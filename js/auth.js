/* ========================================
   ELOCase - Authentication
======================================== */


/* ========================================
   登入
======================================== */

async function login(username, password) {

    const maxAttempts = 3;

    let lastError = null;


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
                                    "login",

                                username:
                                    username,

                                password:
                                    password

                            })

                    }
                );


            /*
             * HTTP 錯誤
             */

            if (!response.ok) {

                throw new Error(
                    `登入服務暫時無法使用（${response.status}）`
                );

            }


            /*
             * 解析 API 回應
             */

            const result =
                await response.json();


            /*
             * API 正常回應
             *
             * 即使帳密錯誤，
             * 也會在這裡正常回傳錯誤訊息
             */

            if (!result.success) {

                throw new Error(
                    result.error ||
                    "登入失敗"
                );

            }


            /*
             * 登入成功
             */

            return result.data;


        } catch (error) {

            lastError =
                error;


            /*
             * 如果已經是最後一次
             * 直接丟出錯誤
             */

            if (
                attempt >= maxAttempts
            ) {

                throw lastError;

            }


            /*
             * Google Apps Script
             * 偶發 redirect / 404
             *
             * 等一下再重試
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        400 * attempt
                    )
            );

        }

    }

}


/* ========================================
   儲存 Session
======================================== */

/* ========================================
   儲存 Session
======================================== */

function saveSession(sessionData) {

    localStorage.setItem(
        "elocaseSessionToken",
        sessionData.sessionToken
    );


    localStorage.setItem(
        "elocaseUser",
        JSON.stringify(
            sessionData.user
        )
    );


    /*
     * 記錄玩家資料最後驗證時間
     */

    localStorage.setItem(
        "elocaseUserVerifiedAt",
        String(
            Date.now()
        )
    );

}


/* ========================================
   取得 Session Token
======================================== */

function getSessionToken() {

    return localStorage.getItem(
        "elocaseSessionToken"
    );

}


/* ========================================
   取得已儲存玩家
======================================== */

function getSavedUser(){

    const data =
        localStorage.getItem(
            "elocaseUser"
        );


    if(!data){

        return null;

    }


    try{

        return JSON.parse(data);

    }
    catch(error){

        localStorage.removeItem(
            "elocaseUser"
        );

        return null;

    }

}

/* ========================================
   清除玩家資料快取
======================================== */

function clearUserCache() {

    localStorage.removeItem(
        "elocaseUser"
    );

    localStorage.removeItem(
        "elocaseUserVerifiedAt"
    );

}

function clearInventoryCache(
    userId
) {

    if (!userId) {

        return;

    }


    removeApiCache(
        `inventory_${userId}`
    );

}

/* ========================================
   檢查玩家資料是否需要重新驗證
======================================== */

function shouldVerifyUser() {

    const verifiedAt =
        Number(
            localStorage.getItem(
                "elocaseUserVerifiedAt"
            ) || 0
        );


    /*
     * 10 分鐘
     */

    const verifyInterval =
       24 * 60 * 60 * 1000;


    return (
        Date.now() - verifiedAt
        >= verifyInterval
    );

}

/* ========================================
   登入狀態
======================================== */

function isLoggedIn() {

    return Boolean(
        getSessionToken()
    );

}


/* ========================================
   登出
======================================== */

function logout() {

    localStorage.removeItem(
        "elocaseSessionToken"
    );


    localStorage.removeItem(
        "elocaseUser"
    );


    window.location.href =
        "login.html";

}


/* ========================================
   驗證 Session
======================================== */

async function verifySession() {

    const sessionToken =
        getSessionToken();


    /*
     * ====================================
     * 沒有 Session
     * ====================================
     */

    if (!sessionToken) {

        return null;

    }


    /*
     * ====================================
     * 先讀取玩家快取
     * ====================================
     */

    const savedUser =
        getSavedUser();


    /*
     * ====================================
     * ⭐ 有玩家快取
     *
     * 直接使用
     * 不等待 API
     * ====================================
     */

    if (savedUser) {

        console.log(
            "⚡ verifySession 使用 LocalStorage"
        );


        /*
         * ====================================
         * 超過 24 小時
         *
         * 背景驗證
         * ====================================
         */

        if (
            shouldVerifyUser()
        ) {

            console.log(
                "🕐 玩家資料已超過 24 小時 → 背景驗證"
            );


            refreshSessionInBackground(
                sessionToken
            );

        } else {

            console.log(
                "🟢 玩家資料尚未過期"
            );

        }


        /*
         * ⭐ 直接回傳
         */

        return savedUser;

    }


    /*
     * ====================================
     * 沒有玩家快取
     *
     * 第一次載入才等待 API
     * ====================================
     */

    console.log(
        "🌐 沒有玩家 Cache → 驗證 Session"
    );


    try {

        const user =
            await sendApiRequest(
                "getPlayerBySession",
                {
                    sessionToken
                }
            );


        /*
         * ====================================
         * 儲存最新玩家資料
         * ====================================
         */

        localStorage.setItem(
            "elocaseUser",
            JSON.stringify(
                user
            )
        );


        localStorage.setItem(
            "elocaseUserVerifiedAt",
            String(
                Date.now()
            )
        );


        return user;


    } catch (error) {

        console.error(
            "❌ 初次 Session 驗證失敗：",
            error
        );


        /*
         * 第一次沒有 Cache，
         * API 又失敗，
         * 才真的視為無法登入。
         */

        localStorage.removeItem(
            "elocaseSessionToken"
        );

        localStorage.removeItem(
            "elocaseUser"
        );

        localStorage.removeItem(
            "elocaseUserVerifiedAt"
        );


        return null;

    }

}

/* ========================================
   背景重新驗證 Session
======================================== */

async function refreshSessionInBackground(
    sessionToken
) {

    try {

        console.log(
            "🔄 背景驗證玩家 Session..."
        );


        const user =
            await sendApiRequest(
                "getPlayerBySession",
                {
                    sessionToken
                }
            );


        /*
         * ====================================
         * 更新玩家資料
         * ====================================
         */

        localStorage.setItem(
            "elocaseUser",
            JSON.stringify(
                user
            )
        );


        localStorage.setItem(
            "elocaseUserVerifiedAt",
            String(
                Date.now()
            )
        );


        console.log(
            "✅ 背景 Session 驗證完成"
        );


        /*
         * ====================================
         * 如果目前頁面有 Navbar
         * 立即更新 ELOCoin / 名稱
         * ====================================
         */

        updateLoginUI(
            user
        );


    } catch (error) {

        /*
         * ====================================
         * 背景驗證失敗
         *
         * 不要直接把玩家踢出去。
         * ====================================
         */

        console.warn(
            "⚠️ 背景 Session 驗證失敗：",
            error.message
        );

    }

}


/* ========================================
   要求登入
======================================== */

async function requireLogin() {

    const user =
        await verifySession();


    if (!user) {

        window.location.href =
            "login.html";

        return null;

    }


    return user;

}


/* ========================================
   更新 Navbar
======================================== */

function updateLoginUI(user) {

    const playerMenu =
        document.querySelector(
            ".player-menu"
        );

    const playerMenuButton =
        document.querySelector(
            "#player-menu-button"
        );

    const playerMenuName =
        document.querySelector(
            "#navbar-player-name"
        );

    const logoutButton =
        document.querySelector(
            "#navbar-logout-button"
        );

    const balance =
        document.querySelector(
            ".balance-value"
        );


    /*
     * ====================================
     * 未登入
     * ====================================
     */

    if (!user) {

        if (balance) {

            balance.textContent =
                "0";

        }


        if (playerMenuButton) {

            playerMenuButton.textContent =
                "登入";

            playerMenuButton.type =
                "button";

        }


        if (playerMenuName) {

            playerMenuName.textContent =
                "登入";

        }


        if (playerMenu) {

            playerMenu.classList.remove(
                "open"
            );

            playerMenu.classList.add(
                "logged-out"
            );

        }


        /*
         * 未登入時直接前往登入頁
         */

        if (playerMenuButton) {

            playerMenuButton.onclick =
                () => {

                    window.location.href =
                        "login.html";

                };

        }


        return;
    }


    /*
     * ====================================
     * 已登入
     * ====================================
     */

    if (playerMenu) {

        playerMenu.classList.remove(
            "logged-out"
        );

    }


    if (balance) {

        balance.textContent =
            Number(
                user.eloCoin || 0
            ).toLocaleString();

    }


    if (playerMenuName) {

        playerMenuName.textContent =
            user.displayName ||
            user.username ||
            "玩家";

    }


    if (playerMenuButton) {

        /*
         * 清除未登入時的 onclick
         */

        playerMenuButton.onclick =
            null;

    }


    /*
     * 登出
     */

    if (logoutButton) {

        logoutButton.onclick =
            () => {

                logout();

            };

    }

}


/* ========================================
   玩家下拉選單
======================================== */

/* ========================================
   玩家下拉選單
======================================== */

function initializePlayerMenu() {

    const playerMenu =
        document.querySelector(
            ".player-menu"
        );


    const playerMenuButton =
        document.querySelector(
            "#player-menu-button"
        );


    if (
        !playerMenu ||
        !playerMenuButton
    ) {

        return;

    }


    /*
     * 防止重複綁定
     */

    if (
        playerMenuButton.dataset.bound
    ) {

        return;

    }


    /*
     * 點擊玩家按鈕
     */

    playerMenuButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            event.stopPropagation();


            /*
             * ====================================
             * 未登入
             * ====================================
             *
             * 不開啟下拉選單
             * 直接前往登入頁
             */

            if (
                playerMenu.classList.contains(
                    "logged-out"
                )
            ) {

                playerMenu.classList.remove(
                    "open"
                );


                window.location.href =
                    "login.html";


                return;

            }


            /*
             * ====================================
             * 已登入
             * ====================================
             *
             * 才允許開啟下拉選單
             */

            playerMenu.classList.toggle(
                "open"
            );

        }
    );


    /*
     * 點擊其他地方關閉
     */

    document.addEventListener(
        "click",
        event => {

            if (
                !playerMenu.contains(
                    event.target
                )
            ) {

                playerMenu.classList.remove(
                    "open"
                );

            }

        }
    );


    /*
     * ESC 關閉
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                playerMenu.classList.remove(
                    "open"
                );

            }

        }
    );


    playerMenuButton.dataset.bound =
        "true";

}


/* ========================================
   登入表單
======================================== */

const loginForm =
    document.querySelector(
        "#login-form"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const username =
                document.querySelector(
                    "#username"
                ).value.trim();


            const password =
                document.querySelector(
                    "#password"
                ).value;


            const message =
                document.querySelector(
                    "#login-message"
                );


            try {

                if (message) {

                    message.textContent =
                        "登入中...";

                }


                const sessionData =
                    await login(
                        username,
                        password
                    );


                saveSession(
                    sessionData
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                if (message) {

                    message.textContent =
                        error.message;

                }

            }

        }
    );

}


/* ========================================
   初始化
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        initializePlayerMenu();


        /*
         * 有玩家 UI 才驗證 Session
         */

        const playerMenu =
            document.querySelector(
                ".player-menu"
            );


        if (!playerMenu) {

            return;

        }


        const user =
            await verifySession();


        updateLoginUI(
            user
        );

    }
);
