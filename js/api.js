async function sendApiRequest(
    action,
    parameters = {}
) {

    const maxAttempts = 3;

    let lastError = null;


    /*
     * ====================================
     * 整個 API 請求開始
     * ====================================
     */

    if (
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

                const query =
                    new URLSearchParams({

                        action,

                        ...parameters

                    });


                const response =
                    await fetch(
                        `${CONFIG.API_URL}?${query.toString()}`,
                        {

                            method:
                                "GET",

                            redirect:
                                "follow",

                            cache:
                                "no-store"

                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        `API 請求失敗（${response.status}）`
                    );

                }


                const result =
                    await response.json();


                if (!result.success) {

                    throw new Error(
                        result.error ||
                        "發生未知錯誤"
                    );

                }


                return result.data;


            } catch (error) {

                lastError =
                    error;


                if (
                    attempt >= maxAttempts
                ) {

                    throw lastError;

                }


                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            300 * attempt
                        )
                );

            }

        }

    } finally {

        /*
         * ====================================
         * 整個 API 流程結束
         * ====================================
         */

        if (
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
   開箱
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


    const maxAttempts = 3;

    let lastError = null;


    /*
     * ====================================
     * 整個開箱流程開始 Loading
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

        /*
         * ====================================
         * Retry
         * ====================================
         */

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            try {

                const response =
                    await fetch(
                        CONFIG.API_URL,
                        {

                            method:
                                "POST",

                            redirect:
                                "follow",

                            cache:
                                "no-store",

                            headers: {

                                "Content-Type":
                                    "text/plain;charset=utf-8"

                            },

                            body:
                                JSON.stringify({

                                    action:
                                        "openCase",

                                    sessionToken:
                                        sessionToken,

                                    caseId:
                                        caseId

                                })

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
                 * 解析 API
                 * ====================================
                 */

                const result =
                    await response.json();


                /*
                 * ====================================
                 * API 業務錯誤
                 *
                 * 例如：
                 * ELOCoin 不足
                 * 箱子不存在
                 * Session 無效
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
                 * 開箱成功
                 * ====================================
                 */

                return result.data;


            } catch (error) {

                lastError =
                    error;


                /*
                 * 還有重試機會
                 */

                if (
                    attempt < maxAttempts
                ) {

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                300 * attempt
                            )
                    );


                    continue;

                }


                /*
                 * 三次都失敗
                 */

                throw lastError;

            }

        }

    } finally {

        /*
         * ====================================
         * 整個開箱流程結束 Loading
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
