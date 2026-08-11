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


function logout() {

    localStorage.removeItem(
        "elocaseSessionToken"
    );

    localStorage.removeItem(
        "elocaseUser"
    );

    window.location.href = "login.html";
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
                )?.value || "";

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
