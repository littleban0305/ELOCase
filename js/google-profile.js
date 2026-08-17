/* ========================================
   Google Profile Setup
======================================== */


document.addEventListener(
    "DOMContentLoaded",
    function(){



        const data =
            localStorage.getItem(
                "googleRegisterData"
            );



        if(!data){


            location.href =
                "login.html";


            return;


        }



        const googleData =
            JSON.parse(
                data
            );



        /*
         * 顯示 Google 資料
         */


        const avatar =
            document.querySelector(
                "#google-avatar"
            );


        const name =
            document.querySelector(
                "#google-name"
            );


        const email =
            document.querySelector(
                "#google-email"
            );



        if(avatar){

            avatar.src =
                googleData.avatar;

        }


        if(name){

            name.textContent =
                googleData.displayName;

        }


        if(email){

            email.textContent =
                googleData.email;

        }





        const form =
            document.querySelector(
                "#google-profile-form"
            );



        form.addEventListener(
            "submit",
            async function(e){


                e.preventDefault();



                const username =
                    document
                    .querySelector(
                        "#username"
                    )
                    .value
                    .trim();



                const displayName =
                    document
                    .querySelector(
                        "#displayName"
                    )
                    .value
                    .trim();




                const message =
                    document.querySelector(
                        "#google-profile-message"
                    );



                try{


                    if(message){

                        message.textContent =
                            "建立帳號中...";

                    }



                    const result =
                        await completeGoogleRegister(

                            googleData,

                            username,

                            displayName

                        );




                    saveSession(
                        result
                    );



                    localStorage.removeItem(
                        "googleRegisterData"
                    );



                    location.href =
                        "index.html";



                }
                catch(error){


                    console.error(
                        error
                    );


                    if(message){

                        message.textContent =
                            error.message;

                    }


                }


            }

        );



    }

);
