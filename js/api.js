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
     * 開始 Loading
     * ====================================
     */

    if (
        window.ELOLoading &&
        typeof window.ELOLoading.start === "function"
    ) {

        window.ELOLoading.start();

    }


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


        if (!response.ok) {

            throw new Error(
                "開箱服務無法使用"
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error ||
                "開箱失敗"
            );

        }


        return result.data;


    } finally {

        /*
         * ====================================
         * 開箱 API 結束
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
