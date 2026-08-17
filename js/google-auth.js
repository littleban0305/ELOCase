/* ========================================
   ELOCase Google Authentication
======================================== */


/*
 * ========================================
 * 初始化 Google Login Button
 * ========================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function(){


        const button =
            document.querySelector(
                "#google-login-button"
            );


        /*
         * 不是登入頁
         */

        if(!button){

            return;

        }



        google.accounts.id.initialize({

            client_id:
                CONFIG.GOOGLE_CLIENT_ID,


            callback:
                handleGoogleLogin

        });



        google.accounts.id.renderButton(

            button,

            {

                theme:
                    "outline",

                size:
                    "large",

                width:
                    360,

                text:
                    "signin_with"

            }

        );


    }

);



/*
 * ========================================
 * Google 登入回呼
 * ========================================
 */


async function handleGoogleLogin(
    response
){


    const googleToken =
        response.credential;



    console.log(
        "Google Credential:",
        googleToken
    );



    try {



        const result =
            await googleLogin(
                googleToken
            );



        console.log(
            "Google Login Result:",
            result
        );




        /*
         * ====================================
         * 第一次 Google 登入
         *
         * 需要完善資料
         * ====================================
         */


        if(
            result.needProfile
        ){



            localStorage.setItem(

                "googleRegisterData",

                JSON.stringify(
                    result.googleData
                )

            );



            location.href =
                "google-profile.html";



            return;

        }




        /*
         * ====================================
         * 已有 Google 帳號
         *
         * 直接登入
         * ====================================
         */


        saveSession(
            result
        );



        location.href =
            "index.html";




    }
    catch(error){


        console.error(

            "Google 登入失敗:",
            error

        );


        alert(
            error.message
        );


    }


}



/*
 * ========================================
 * 呼叫 GAS Google Login API
 * ========================================
 */


async function googleLogin(
    googleToken
){


    if(
        !googleToken
    ){

        throw new Error(
            "缺少 Google Token"
        );

    }



    const response =
        await fetch(

            CONFIG.API_URL,

            {

                method:
                    "POST",


                headers:{


                    "Content-Type":
                    "text/plain;charset=utf-8"


                },


                body:

                    JSON.stringify({

                        action:
                            "googleLogin",


                        googleToken:
                            googleToken


                    }),


                redirect:
                    "follow",


                cache:
                    "no-store"


            }

        );




    if(
        !response.ok
    ){

        throw new Error(
            "Google 登入服務錯誤"
        );

    }




    const result =
        await response.json();




    if(
        !result.success
    ){

        throw new Error(

            result.error ||
            "Google 登入失敗"

        );

    }




    return result.data;


}
