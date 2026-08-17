document.addEventListener(
    "DOMContentLoaded",
    function(){


        const button =
            document.querySelector(
                "#google-login-button"
            );


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
                    360

            }

        );


    }

);



async function handleGoogleLogin(response){


    const googleToken =
        response.credential;


    console.log(
        "Google Token:",
        googleToken
    );


    try {


        const result =
            await googleLogin(
                googleToken
            );


        console.log(
            "Google 登入成功:",
            result
        );


        /*
         * 儲存 Session
         */

        localStorage.setItem(
            "sessionToken",
            result.sessionToken
        );


        localStorage.setItem(
            "elocaseUser",
            JSON.stringify(
                result.user
            )
        );


        location.href =
            "index.html";



    }catch(error){


        console.error(
            "Google 登入失敗:",
            error
        );


        alert(
            error.message
        );


    }

}
