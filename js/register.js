document
.querySelector("#register-form")
.addEventListener(
"submit",
async function(e){

    e.preventDefault();


    const username =
        document
        .querySelector("#username")
        .value
        .trim();


    const displayName =
        document
        .querySelector("#displayName")
        .value
        .trim();


    const email =
        document
        .querySelector("#email")
        .value
        .trim();


    const password =
        document
        .querySelector("#password")
        .value;


    const confirmPassword =
        document
        .querySelector("#confirmPassword")
        .value;



    const button =
        document.querySelector(
            "#register-button"
        );



    /*
     * ========================================
     * 基本檢查
     * ========================================
     */


    if(
        !username ||
        !displayName ||
        !password
    ){

        alert(
            "請填寫完整資料"
        );

        return;

    }



    if(
        username.length < 4
    ){

        alert(
            "帳號至少需要 4 個字元"
        );

        return;

    }



    if(
        password.length < 6
    ){

        alert(
            "密碼至少需要 6 個字元"
        );

        return;

    }



    if(
        password !== confirmPassword
    ){

        alert(
            "兩次密碼不一致"
        );

        return;

    }



    try {


        /*
         * ========================================
         * 註冊中狀態
         * ========================================
         */


        if(button){

            button.disabled =
                true;


            button.textContent =
                "註冊中...";

        }



        /*
         * ========================================
         * 呼叫 API
         * ========================================
         */


        const result =
            await registerPlayer(
                username,
                displayName,
                email,
                password
            );



        console.log(
            "註冊成功：",
            result
        );



        alert(
            "註冊成功！"
        );



        location.href =
            "login.html";



    }
    catch(error){


        console.error(
            "註冊失敗：",
            error
        );



        alert(
            error.message ||
            "註冊失敗"
        );



    }
    finally{


        /*
         * ========================================
         * 恢復按鈕
         * ========================================
         */


        if(button){

            button.disabled =
                false;


            button.textContent =
                "建立帳號";

        }


    }


});
