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
     * 開箱時不要顯示全域 Loading Bar
     * ====================================
     */

    const requestData = {

        action:
            "openCase",

        sessionToken:
            sessionToken,

        caseId:
            caseId

    };


    try {

        /*
         * ====================================
         * POST 開箱
         * ====================================
         */

        const requestUrl =
            `${CONFIG.API_URL}?_=${Date.now()}`;
        
        const response =
            await fetch(
                requestUrl,
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

                    /*
                     * 讓 Google Apps Script
                     * 自己處理 redirect
                     */

                    redirect:
                        "follow",

                    /*
                     * 不使用舊快取
                     */

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
                `開箱服務無法使用（${response.status}）`
            );

        }


        /*
         * ====================================
         * 解析結果
         * ====================================
         */

        const result =
            await response.json();


        /*
         * ====================================
         * API 回報錯誤
         * ====================================
         */

        if (!result.success) {

            throw new Error(
                result.error ||
                "開箱失敗"
            );

        }


        /*
         * ====================================
         * 成功
         * ====================================
         */

        return result.data;


    } catch (error) {

        console.error(
            "openCase API 錯誤：",
            error
        );


        throw error;

    }

}
