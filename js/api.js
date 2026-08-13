async function sendApiRequest(
    action,
    parameters = {}
) {

    const maxAttempts = 3;

    let lastError = null;


    /*
     * ====================================
     * Loading 開始
     * ====================================
     */

    if (
        !window.ELOCaseOpening &&
        window.ELOLoading &&
        typeof window.ELOLoading.start === "function"
    ) {
    
        window.ELOLoading.start();
    
    }


    try {

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            try {

                /*
                 * ====================================
                 * 每一次重試都重新建立 URL
                 * ====================================
                 */

                const query =
                    new URLSearchParams({

                        action,
                        ...parameters

                    });


                const requestUrl =
                    `${CONFIG.API_URL}?${query.toString()}`;


                console.log(
                    `API 請求 ${attempt}/${maxAttempts}:`,
                    action
                );


                /*
                 * ====================================
                 * 發送 GET
                 * ====================================
                 */

                const response =
                    await fetch(
                        requestUrl,
                        {

                            method:
                                "GET",

                            redirect:
                                "follow",

                            cache:
                                "no-store"

                        }
                    );


                /*
                 * ====================================
                 * HTTP 錯誤
                 * ====================================
                 */

                if (!response.ok) {

                    throw new Error(
                        `API 請求失敗（${response.status}）`
                    );

                }


                /*
                 * ====================================
                 * 解析 JSON
                 * ====================================
                 */

                const result =
                    await response.json();


                /*
                 * ====================================
                 * API 自己回報錯誤
                 * ====================================
                 */

                if (!result.success) {

                    throw new Error(
                        result.error ||
                        "發生未知錯誤"
                    );

                }


                /*
                 * ====================================
                 * 成功
                 * ====================================
                 */

                return result.data;


            } catch (error) {

                lastError =
                    error;


                console.warn(
                    `API 第 ${attempt} 次請求失敗：`,
                    error.message
                );


                /*
                 * 最後一次
                 * 不再重試
                 */

                if (
                    attempt >= maxAttempts
                ) {

                    throw lastError;

                }


                /*
                 * ====================================
                 * 重試等待
                 *
                 * 第一次：500ms
                 * 第二次：1000ms
                 * ====================================
                 */

                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            500 * attempt
                        )
                );

            }

        }

    } finally {

        /*
         * ====================================
         * Loading 結束
         * ====================================
         */

        if (
            !window.ELOCaseOpening &&
            window.ELOLoading &&
            typeof window.ELOLoading.finish === "function"
        ) {
        
            window.ELOLoading.finish();
        
        }

    }

}

/* ========================================
   取得所有箱子
======================================== */

async function getCases() {

    return await sendApiRequest(
        "getCases"
    );

}


async function getCase(caseId) {

    return await sendApiRequest(
        "getCase",
        {
            caseId
        }
    );
}

async function getInventory(userId) {

    return await sendApiRequest(
        "getInventory",
        {
            userId
        }
    );
}

async function getCaseItems(caseId) {

    return await sendApiRequest(
        "getCaseItems",
        {
            caseId
        }
    );

}

/* ========================================
   開箱 API
======================================== */

async function openCase(caseId) {

    /*
     * ====================================
     * 檢查登入
     * ====================================
     */

    const sessionToken =
        getSessionToken();


    if (!sessionToken) {

        throw new Error(
            "請先登入"
        );

    }


    /*
     * ====================================
     * 建立本次開箱專用 requestId
     * ====================================
     */

    const requestId =
        "OPENCASE_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 10);


    console.log(
        "🎁 開箱 requestId：",
        requestId
    );


    /*
     * ====================================
     * POST 開箱
     * ====================================
     */

    const requestData = {

        action:
            "openCase",

        sessionToken:
            sessionToken,

        caseId:
            caseId,

        requestId:
            requestId

    };


    try {

        const response =
            await fetch(
                CONFIG.API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            requestData
                        ),

                    redirect:
                        "follow",

                    cache:
                        "no-store"

                }
            );


        /*
         * ====================================
         * POST 成功
         * ====================================
         */

        if (response.ok) {

            const result =
                await response.json();


            if (
                result.success
            ) {

                /*
                 * 直接成功
                 */

                return result.data;

            }


            /*
             * API 本身回報錯誤
             *
             * 這種情況不要盲目查詢，
             * 因為後端已經明確告訴我們錯誤。
             */

            throw new Error(
                result.error ||
                "開箱失敗"
            );

        }


        /*
         * ====================================
         * ⭐ POST HTTP 錯誤
         *
         * 不直接判定開箱失敗。
         *
         * 改用同一個 requestId
         * 去查詢後端結果。
         * ====================================
         */

        console.warn(
            "⚠️ POST 開箱回應異常：",
            response.status
        );


    } catch (error) {

        /*
         * ====================================
         * ⭐ 網路錯誤 / 404
         *
         * 這裡故意不立刻 throw。
         *
         * 因為 Google Apps Script
         * 可能已經把開箱做完。
         * ====================================
         */

        console.warn(
            "⚠️ POST 開箱連線異常：",
            error.message
        );

    }


    /*
     * ====================================
     * ⭐ 開始查詢結果
     * ====================================
     */

    console.log(
        "🔎 開始查詢開箱結果：",
        requestId
    );


    const maxChecks =
        15;


    const checkInterval =
        1000;


    for (
        let attempt = 1;
        attempt <= maxChecks;
        attempt++
    ) {

        try {

            const query =
                new URLSearchParams({

                    action:
                        "getOpenCaseResult",

                    sessionToken:
                        sessionToken,

                    requestId:
                        requestId

                });


            const resultUrl =
                `${CONFIG.API_URL}?${query.toString()}`;


            console.log(
                `🔎 查詢開箱結果 ${attempt}/${maxChecks}`
            );


            const resultResponse =
                await fetch(
                    resultUrl,
                    {

                        method:
                            "GET",

                        redirect:
                            "follow",

                        cache:
                            "no-store"

                    }
                );


            /*
             * ====================================
             * HTTP 錯誤
             * ====================================
             */

            if (
                !resultResponse.ok
            ) {

                console.warn(
                    "⚠️ 結果查詢 HTTP 錯誤：",
                    resultResponse.status
                );

            } else {

                const result =
                    await resultResponse.json();


                /*
                 * ====================================
                 * 成功
                 * ====================================
                 */

                if (
                    result.success &&
                    result.data
                ) {

                    /*
                     * processing
                     */

                    if (
                        result.data.status ===
                        "processing"
                    ) {

                        console.log(
                            "⏳ 開箱仍在處理..."
                        );

                    }


                    /*
                     * success
                     */

                    else if (
                        result.data.status ===
                        "success"
                    ) {

                        console.log(
                            "🎉 找回開箱結果：",
                            result.data.result
                        );


                        return result.data.result;

                    }

                }


                /*
                 * ====================================
                 * API 明確回報錯誤
                 * ====================================
                 */

                if (
                    !result.success &&
                    result.error
                ) {

                    /*
                     * 找不到紀錄可能只是
                     * Google 還沒寫入 Sheet。
                     *
                     * 所以繼續等。
                     */

                    console.warn(
                        "⚠️ 結果查詢：",
                        result.error
                    );

                }

            }

        } catch (error) {

            console.warn(
                "⚠️ 結果查詢失敗：",
                error.message
            );

        }


        /*
         * ====================================
         * 等待下一次查詢
         * ====================================
         */

        if (
            attempt <
            maxChecks
        ) {

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        checkInterval
                    )
            );

        }

    }


    /*
     * ====================================
     * 超過等待時間
     * ====================================
     */

    throw new Error(
        "開箱結果等待逾時，請稍後再試"
    );

}
