let currentChallengeId = null;



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


        const ec =
            Number(
                document
                .getElementById(
                    "create-ec"
                )
                .value
            );



        const result =
            await createChallenge(
                ec
            );



        currentChallengeId =
            result.challengeId;



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


        const code =
            document
            .getElementById(
                "join-code"
            )
            .value
            .trim();



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


        const code =
            document
            .getElementById(
                "challenge-code"
            )
            ?.innerText;



        if(
            !code ||
            code === "-"
        ){

            return;

        }



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


}
