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


    console.log(
        "Google Token:",
        response.credential
    );


}
