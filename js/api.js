/* ========================================
   ELOCase LocalStorage Cache
======================================== */

const API_CACHE_PREFIX =
    "ELOCASE_CACHE_";

const API_CACHE_24_HOURS =
    24 * 60 * 60 * 1000;


/*
 * 儲存 Cache
 */
function saveApiCache(
    key,
    data,
    duration =
        API_CACHE_24_HOURS
) {

    const cacheData = {

        data:
            data,

        savedAt:
            Date.now(),

        expiresAt:
            Date.now() +
            duration

    };


    localStorage.setItem(

        API_CACHE_PREFIX +
        key,

        JSON.stringify(
            cacheData
        )

    );

}


/*
 * 讀取 Cache
 */
function getApiCache(
    key
) {

    const raw =
        localStorage.getItem(
            API_CACHE_PREFIX +
            key
        );


    if (!raw) {

        return null;

    }


    try {

        const cacheData =
            JSON.parse(
                raw
            );


        /*
         * 已過期
         */

        if (
            Date.now() >=
            cacheData.expiresAt
        ) {

            localStorage.removeItem(
                API_CACHE_PREFIX +
                key
            );

            return null;

        }


        return cacheData.data;


    } catch (error) {

        /*
         * Cache 壞掉
         */

        localStorage.removeItem(
            API_CACHE_PREFIX +
            key
        );

        return null;

    }

}


/*
 * 刪除 Cache
 */
function removeApiCache(
    key
) {

    localStorage.removeItem(
        API_CACHE_PREFIX +
        key
    );

}

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

    /*
     * ====================================
     * 先讀 LocalStorage
     * ====================================
     */

    const cached =
        getApiCache(
            "cases"
        );


    if (cached) {

        console.log(
            "⚡ getCases 使用 LocalStorage"
        );

        return cached;

    }


    /*
     * ====================================
     * Cache 沒有
     * → 呼叫 API
     * ====================================
     */

    console.log(
        "🌐 getCases 呼叫 API"
    );


    const data =
        await sendApiRequest(
            "getCases"
        );


    /*
     * ====================================
     * 儲存 24 小時
     * ====================================
     */

    saveApiCache(
        "cases",
        data
    );


    return data;

}


async function getCase(
    caseId
) {

    const cacheKey =
        `case_${caseId}`;


    const cached =
        getApiCache(
            cacheKey
        );


    if (cached) {

        console.log(
            "⚡ getCase 使用 LocalStorage：",
            caseId
        );

        return cached;

    }


    console.log(
        "🌐 getCase 呼叫 API：",
        caseId
    );


    const data =
        await sendApiRequest(
            "getCase",
            {
                caseId
            }
        );


    saveApiCache(
        cacheKey,
        data
    );


    return data;

}

async function getInventory(userId) {

    /*
     * ====================================
     * 檢查 userId
     * ====================================
     */

    if (!userId) {

        throw new Error(
            "缺少 userId"
        );

    }


    /*
     * ====================================
     * Inventory Cache
     *
     * 只快取 5 分鐘
     * ====================================
     */

    const cacheKey =
        `inventory_${userId}`;


    const cached =
        getApiCache(
            cacheKey
        );


    if (cached) {

        console.log(
            "⚡ getInventory 使用 LocalStorage：",
            userId
        );

        return cached;

    }


    /*
     * ====================================
     * Cache 沒有
     * → 呼叫 API
     * ====================================
     */

    console.log(
        "🌐 getInventory 呼叫 API：",
        userId
    );


    const data =
        await sendApiRequest(
            "getInventory",
            {
                userId
            }
        );


    /*
     * ====================================
     * 儲存 5 分鐘
     * ====================================
     */

    saveApiCache(
        cacheKey,
        data,
        5 * 60 * 1000
    );


    return data;

}

async function getCaseItems(
    caseId
) {

    const cacheKey =
        `caseItems_${caseId}`;


    const cached =
        getApiCache(
            cacheKey
        );


    if (cached) {

        console.log(
            "⚡ getCaseItems 使用 LocalStorage：",
            caseId
        );

        return cached;

    }


    console.log(
        "🌐 getCaseItems 呼叫 API：",
        caseId
    );


    const data =
        await sendApiRequest(
            "getCaseItems",
            {
                caseId
            }
        );


    saveApiCache(
        cacheKey,
        data
    );


    return data;

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
        
        
            /*
             * ====================================
             * POST 正常成功
             * ====================================
             */
        
            if (
                result.success
            ) {
            
                console.log(
                    "🎉 POST 直接取得開箱結果"
                );
            
            
                /*
                 * ====================================
                 * 先取得目前玩家
                 * ====================================
                 */
            
                const savedUser =
                    getSavedUser();
            
            
                /*
                 * ====================================
                 * 清除玩家資料 Cache
                 * ====================================
                 */
            
                clearUserCache();
            
            
                /*
                 * ====================================
                 * 清除 Inventory Cache
                 * ====================================
                 */
            
                if (
                    savedUser &&
                    savedUser.userId
                ) {
            
                    clearInventoryCache(
                        savedUser.userId
                    );
            
                }
            
            
                return result.data;
            
            }
        
        
            /*
             * ====================================
             * POST 有正常回應，
             * 但 API 回報失敗
             *
             * 不要馬上判定開箱失敗。
             *
             * 因為後端可能已經完成，
             * 只是回傳內容出現異常。
             *
             * 改走 requestId 查詢。
             * ====================================
             */
        
            console.warn(
                "⚠️ POST 回傳 API 錯誤：",
                result.error ||
                "未知錯誤"
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
                     
                     
                         /*
                          * ====================================
                          * 先取得目前玩家
                          * ====================================
                          */
                     
                         const savedUser =
                             getSavedUser();
                     
                     
                         /*
                          * ====================================
                          * 清除玩家資料 Cache
                          * ====================================
                          */
                     
                         clearUserCache();
                     
                     
                         /*
                          * ====================================
                          * 清除 Inventory Cache
                          * ====================================
                          */
                     
                         if (
                             savedUser &&
                             savedUser.userId
                         ) {
                     
                             clearInventoryCache(
                                 savedUser.userId
                             );
                     
                         }
                     
                     
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
