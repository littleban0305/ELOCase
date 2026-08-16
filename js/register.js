document
.getElementById(
    "register-button"
)
.addEventListener(
    "click",
    register
);



async function register(){


    const username =
        document
        .getElementById("username")
        .value
        .trim();


    const displayName =
        document
        .getElementById("displayName")
        .value
        .trim();


    const email =
        document
        .getElementById("email")
        .value
        .trim();


    const password =
        document
        .getElementById("password")
        .value;


    const confirmPassword =
        document
        .getElementById("confirmPassword")
        .value;



    const message =
        document
        .getElementById(
            "register-message"
        );



    if(
        password !== confirmPassword
    ){

        message.textContent =
            "兩次密碼不一致";

        return;

    }



    try{


        const result =
            await registerPlayerAPI(
                {
                    username,
                    displayName,
                    email,
                    password
                }
            );



        if(
            result.success
        ){

            message.textContent =
                "註冊成功！";


            setTimeout(
                ()=>{

                    location.href =
                        "login.html";

                },
                1000
            );


        }else{


            message.textContent =
                result.message;


        }



    }catch(error){


        console.error(error);


        message.textContent =
            "註冊失敗，請稍後再試";


    }


}
