async function login(username, password) {
    const response = await fetch(
        CONFIG.API_URL,
        {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "login",
                username: username,
                password: password
            })
        }
    );

    if (!response.ok) {
        throw new Error("登入服務無法使用");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(
            result.error || "登入失敗"
        );
    }

    return result.data;
}


function saveSession(sessionData) {
    localStorage.setItem(
        "elocaseSessionToken",
        sessionData.sessionToken
    );

    localStorage.setItem(
        "elocaseUser",
        JSON.stringify(sessionData.user)
    );
}


function getSessionToken() {
    return localStorage.getItem(
        "elocaseSessionToken"
    );
}


function getSavedUser() {
    const data = localStorage.getItem(
        "elocaseUser"
    );

    if (!data) {
        return null;
    }

    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}


function isLoggedIn() {
    return Boolean(getSessionToken());
}


function logout() {
    localStorage.removeItem(
        "elocaseSessionToken"
    );

    localStorage.removeItem(
        "elocaseUser"
    );

    window.location.href = "login.html";
}


async function verifySession() {
    const sessionToken = getSessionToken();

    if (!sessionToken) {
        return null;
    }

    try {
        const user = await sendApiRequest(
            "getPlayerBySession",
            {
                sessionToken: sessionToken
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


async function requireLogin() {
    const user = await verifySession();

    if (!user) {
        window.location.href = "login.html";
        return null;
    }

    return user;
}


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
        document.querySelector(".balance-value");

    if (!user) {
        return;
    }

    if (balance) {
        balance.textContent =
            Number(user.eloCoin).toLocaleString();
    }

    if (loginButton) {

        loginButton.textContent =
            user.displayName;

        loginButton.href =
            "profile.html";
    }
}


const loginForm =
    document.querySelector("#login-form");

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

                message.textContent =
                    "登入中...";

                const sessionData =
                    await login(
                        username,
                        password
                    );

                saveSession(sessionData);

                window.location.href =
                    "index.html";

            } catch (error) {

                message.textContent =
                    error.message;
            }
        }
    );
}
