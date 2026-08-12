/* ========================================
   ELOCase - Authentication
======================================== */


/* ========================================
   登入
======================================== */

async function login(username, password) {

    const response = await fetch(
        CONFIG.API_URL,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },

            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            })
        }
    );


    if (!response.ok) {

        throw new Error(
            "登入服務無法使用"
        );

    }


    const result =
        await response.json();


    if (!result.success) {

        throw new Error(
            result.error ||
            "登入失敗"
        );

    }


    return result.data;

}


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

function getSavedUser() {

    const data =
        localStorage.getItem(
            "elocaseUser"
        );


    if (!data) {

        return null;

    }


    try {

        return JSON.parse(
            data
        );

    } catch {

        return null;

    }

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


    if (!sessionToken) {

        return null;

    }


    try {

        const user =
            await sendApiRequest(
                "getPlayerBySession",
                {
                    sessionToken:
                        sessionToken
                }
            );


        localStorage.setItem(
            "elocaseUser",
            JSON.stringify(user)
        );


        return user;


    } catch (error) {

        localStorage.removeItem(
            "elocaseSessionToken"
        );


        localStorage.removeItem(
            "elocaseUser"
        );


        return null;

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

            event.stopPropagation();


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
