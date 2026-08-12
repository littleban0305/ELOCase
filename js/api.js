async function sendApiRequest(action, parameters = {}) {

    const query = new URLSearchParams({
        action,
        ...parameters
    });

    const response = await fetch(
        `${CONFIG.API_URL}?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error("API 請求失敗");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.error || "發生未知錯誤"
        );
    }

    return result.data;
}


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

async function openCase(caseId) {

    const sessionToken =
        getSessionToken();

    if (!sessionToken) {

        throw new Error(
            "請先登入"
        );

    }


    const response =
        await fetch(
            CONFIG.API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify({

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

}
