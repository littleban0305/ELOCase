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

/* ========================================
   讀取 Cache（允許過期資料）
======================================== */

function getApiCacheStale(key) {

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


        return {

            data:
                cacheData.data,

            savedAt:
                Number(
                    cacheData.savedAt || 0
                ),

            expiresAt:
                Number(
                    cacheData.expiresAt || 0
                ),

            expired:
                Date.now() >=
                Number(
                    cacheData.expiresAt || 0
                )

        };


    } catch (error) {

        console.warn(
            "⚠️ Cache 資料損壞：",
            key
        );


        return null;

    }

}

/* ========================================
   檢查 Cache 是否已過期
======================================== */

function isApiCacheExpired(key) {

    const raw =
        localStorage.getItem(
            API_CACHE_PREFIX +
            key
        );


    /*
     * 沒有 Cache
     */

    if (!raw) {

        return true;

    }


    try {

        const cacheData =
            JSON.parse(
                raw
            );


        /*
         * 沒有 expiresAt
         */

        if (
            !cacheData.expiresAt
        ) {

            return true;

        }


        return (
            Date.now() >=
            Number(
                cacheData.expiresAt
            )
        );


    } catch (error) {

        return true;

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
   更新玩家資料
======================================== */

async function updatePlayer(
    displayName
) {

    const sessionToken =
        getSessionToken();


    if (!sessionToken) {

        throw new Error(
            "請先登入"
        );

    }


    const requestData = {

        action:
            "updatePlayer",

        token:
            sessionToken,

        displayName:
            displayName

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
                "更新玩家資料失敗"
            );

        }


        return result.data;


    } catch (error) {

        console.error(
            "❌ 更新玩家資料失敗：",
            error
        );

        throw error;

    }

}

/* ========================================
   取得所有箱子
======================================== */

async function getCases() {

    const cached =
        getApiCacheStale(
            "cases"
        );


    /*
     * ====================================
     * 有任何舊資料
     * ====================================
     */

    if (cached) {

        console.log(
            "⚡ getCases 使用 LocalStorage"
        );


        /*
         * Cache 過期
         * → 舊資料照樣先顯示
         * → 背景更新
         */

        if (
            cached.expired
        ) {

            console.log(
                "🕐 Cases Cache 已過期 → 背景更新"
            );


            refreshCasesInBackground();

        } else {

            console.log(
                "🟢 Cases Cache 尚未過期"
            );

        }


        /*
         * ⭐ 永遠先回傳本機資料
         */

        return cached.data;

    }


    /*
     * ====================================
     * 完全沒有 Cache
     * → 第一次才等待 API
     * ====================================
     */

    console.log(
        "🌐 getCases 沒有 Cache → 呼叫 API"
    );


    const data =
        await sendApiRequest(
            "getCases"
        );


    saveApiCache(
        "cases",
        data
    );


    return data;

}

/* ========================================
   背景更新箱子資料
======================================== */

async function refreshCasesInBackground() {

    try {

        console.log(
            "🔄 背景更新 Cases..."
        );


        const data =
            await sendApiRequest(
                "getCases"
            );


        saveApiCache(
            "cases",
            data
        );


        console.log(
            "✅ Cases 背景更新完成"
        );


        /*
         * 如果目前頁面有箱子列表，
         * 通知頁面重新整理
         */

        window.dispatchEvent(
            new CustomEvent(
                "eloCasesUpdated",
                {
                    detail: data
                }
            )
        );


    } catch (error) {

        console.warn(
            "⚠️ Cases 背景更新失敗：",
            error.message
        );

    }

}


async function getCase(caseId) {

    const cacheKey =
        `case_${caseId}`;


    /*
     * ====================================
     * 讀取 Cache
     * 即使過期也照樣可以拿
     * ====================================
     */

    const cached =
        getApiCacheStale(
            cacheKey
        );


    /*
     * ====================================
     * 有舊資料
     * ====================================
     */

    if (cached) {

        console.log(
            "⚡ getCase 使用 LocalStorage：",
            caseId
        );


        /*
         * 已過期
         * → 背景更新
         */

        if (
            cached.expired
        ) {

            console.log(
                "🕐 Case Cache 已過期 → 背景更新：",
                caseId
            );


            refreshCaseInBackground(
                caseId
            );

        } else {

            console.log(
                "🟢 Case Cache 尚未過期：",
                caseId
            );

        }


        /*
         * ⭐ 立即回傳舊資料
         */

        return cached.data;

    }


    /*
     * ====================================
     * 完全沒有 Cache
     * → 第一次才等待 API
     * ====================================
     */

    console.log(
        "🌐 getCase 沒有 Cache → 呼叫 API：",
        caseId
    );


    const data =
        await sendApiRequest(
            "getCase",
            {
                caseId
            }
        );


    /*
     * ====================================
     * 儲存 24 小時
     * ====================================
     */

    saveApiCache(
        cacheKey,
        data
    );


    return data;

}

/* ========================================
   背景更新單一箱子
======================================== */

async function refreshCaseInBackground(
    caseId
) {

    const cacheKey =
        `case_${caseId}`;


    try {

        console.log(
            "🔄 背景更新 Case：",
            caseId
        );


        const data =
            await sendApiRequest(
                "getCase",
                {
                    caseId
                }
            );


        /*
         * 更新 Cache
         */

        saveApiCache(
            cacheKey,
            data
        );


        console.log(
            "✅ Case 背景更新完成：",
            caseId
        );


        /*
         * 通知目前頁面
         */

        window.dispatchEvent(
            new CustomEvent(
                "eloCaseUpdated",
                {
                    detail: {

                        caseId:
                            caseId,

                        data:
                            data

                    }
                }
            )
        );


    } catch (error) {

        console.warn(
            "⚠️ Case 背景更新失敗：",
            caseId,
            error.message
        );

    }

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


    /*
     * ====================================
     * 讀取 Cache
     * 即使過期也先使用
     * ====================================
     */

    const cached =
        getApiCacheStale(
            cacheKey
        );


    /*
     * ====================================
     * 有舊資料
     * ====================================
     */

    if (cached) {

        console.log(
            "⚡ getCaseItems 使用 LocalStorage：",
            caseId
        );


        /*
         * 過期
         * → 背景更新
         */

        if (
            cached.expired
        ) {

            console.log(
                "🕐 CaseItems Cache 已過期 → 背景更新：",
                caseId
            );


            refreshCaseItemsInBackground(
                caseId
            );

        } else {

            console.log(
                "🟢 CaseItems Cache 尚未過期：",
                caseId
            );

        }


        /*
         * ⭐ 立即回傳
         */

        return cached.data;

    }


    /*
     * ====================================
     * 完全沒有 Cache
     * ====================================
     */

    console.log(
        "🌐 getCaseItems 沒有 Cache → 呼叫 API：",
        caseId
    );


    const data =
        await sendApiRequest(
            "getCaseItems",
            {
                caseId
            }
        );


    /*
     * ====================================
     * 儲存 24 小時
     * ====================================
     */

    saveApiCache(
        cacheKey,
        data
    );


    return data;

}

/* ========================================
   背景更新箱子內容物
======================================== */

async function refreshCaseItemsInBackground(
    caseId
) {

    const cacheKey =
        `caseItems_${caseId}`;


    try {

        console.log(
            "🔄 背景更新 CaseItems：",
            caseId
        );


        const data =
            await sendApiRequest(
                "getCaseItems",
                {
                    caseId
                }
            );


        /*
         * 更新 Cache
         */

        saveApiCache(
            cacheKey,
            data
        );


        console.log(
            "✅ CaseItems 背景更新完成：",
            caseId
        );


        /*
         * 通知目前頁面
         */

        window.dispatchEvent(
            new CustomEvent(
                "eloCaseItemsUpdated",
                {
                    detail: {

                        caseId:
                            caseId,

                        data:
                            data

                    }
                }
            )
        );


    } catch (error) {

        console.warn(
            "⚠️ CaseItems 背景更新失敗：",
            caseId,
            error.message
        );

    }

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
               
               if (
                   savedUser &&
                   savedUser.userId
               ) {
               
                   /*
                    * 開箱後只需要更新會變動的資料
                    *
                    * 玩家基本資料繼續使用 Cache
                    */
               
                   localStorage.setItem(
                       "elocaseUser",
                       JSON.stringify(
                           savedUser
                       )
                   );
               
               }
            
            
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
                         * 玩家資料 Cache 保留
                         *
                         * 不再 clearUserCache()
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

/* ========================================
   AI 內容生成
======================================== */

async function generateAI(prompt) {

    if (!prompt) {

        throw new Error(
            "缺少 AI 指令"
        );

    }


    const requestData = {

        action:
            "generateAI",

        prompt:
            prompt

    };


    try {

        console.log(
            "🤖 AI 請求：",
            prompt
        );


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


        if (!response.ok) {

            throw new Error(
                `AI API 請求失敗（${response.status}）`
            );

        }


        const result =
            await response.json();


        if (!result.success) {

            throw new Error(
                result.error ||
                "AI 生成失敗"
            );

        }


        console.log(
            "🤖 AI 回應：",
            result.data
        );


        return result.data;


    } catch (error) {

        console.error(
            "❌ AI 請求失敗：",
            error
        );

        throw error;

    }

}
