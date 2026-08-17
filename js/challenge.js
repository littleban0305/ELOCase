let currentChallengeId = null;


/*
========================================
初始化
========================================
*/

document.addEventListener(
"DOMContentLoaded",
async()=>{


    const user =
        await verifySession();



    if(user){


        const playerName =
            document.getElementById(
                "navbar-player-name"
            );


        if(playerName){

            playerName.innerText =
                user.displayName;

        }

    }



    const createButtonElement =
        document.getElementById(
            "create-challenge-button"
        );


    if(createButtonElement){

        createButtonElement.onclick =
            createButton;

    }



    const joinButtonElement =
        document.getElementById(
            "join-challenge-button"
        );


    if(joinButtonElement){

        joinButtonElement.onclick =
            joinButton;

    }



    initCopyButton();

    initPlayerMenu();


});







/*
========================================
建立 Challenge
========================================
*/

async function createButton(){


    try{


        const input =
            document.getElementById(
                "create-ec"
            );


        const ec =
            Number(
                input.value
            );



        if(
            !ec ||
            ec <= 0
        ){

            alert(
                "請輸入有效的挑戰資金"
            );

            return;

        }




        const result =
            await createChallenge(
                ec
            );



        currentChallengeId =
            result.challengeId;



        /*
         * 進入等待房間
         */

        location.href =
            "challenge-room.html?id="
            +
            result.challengeId;



    }
    catch(error){


        alert(
            error.message
        );


    }


}








/*
========================================
加入 Challenge
========================================
*/

async function joinButton(){


    try{


        const input =
            document.getElementById(
                "join-code"
            );


        const code =
            input.value.trim();



        if(!code){


            alert(
                "請輸入挑戰代碼"
            );


            return;


        }





        const result =
            await joinChallenge(
                code
            );



        currentChallengeId =
            result.challengeId;



        /*
         * 進入同一個挑戰房間
         */

        location.href =
            "challenge-room.html?id="
            +
            result.challengeId;



    }
    catch(error){


        alert(
            error.message
        );


    }


}








/*
========================================
複製 Challenge Code
========================================
*/

function initCopyButton(){


    const copyButton =
        document.getElementById(
            "copy-code-button"
        );



    if(!copyButton){

        return;

    }




    copyButton.onclick =
    async()=>{


        const codeElement =
            document.getElementById(
                "challenge-code"
            );



        if(!codeElement){

            return;

        }



        const code =
            codeElement.innerText.trim();




        if(
            !code ||
            code === "-"
        ){

            return;

        }





        try{


            await navigator.clipboard.writeText(
                code
            );



            const message =
                document.getElementById(
                    "copy-message"
                );



            if(message){


                message.innerText =
                    "✓ 已複製挑戰代碼";



                setTimeout(()=>{


                    message.innerText =
                        "";


                },2000);


            }


        }
        catch(error){


            alert(
                "複製失敗，請手動複製"
            );


        }



    };


}









/*
========================================
玩家下拉選單
========================================
*/

function initPlayerMenu(){


    const menuButton =
        document.getElementById(
            "player-menu-button"
        );



    const playerMenu =
        document.querySelector(
            ".player-menu"
        );




    if(
        !menuButton ||
        !playerMenu
    ){

        return;

    }





    menuButton.onclick =
    ()=>{


        playerMenu
        .classList
        .toggle(
            "open"
        );


    };




    /*
     * 點外面關閉選單
     */

    document.addEventListener(
    "click",
    (event)=>{


        if(
            !playerMenu.contains(
                event.target
            )
        ){

            playerMenu
            .classList
            .remove(
                "open"
            );

        }


    });


}
