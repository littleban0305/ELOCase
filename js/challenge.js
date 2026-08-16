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



    document
    .getElementById(
        "create-challenge-button"
    )
    .onclick =
    createButton;



    document
    .getElementById(
        "join-challenge-button"
    )
    .onclick =
    joinButton;


});





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



        /*
         * 顯示 Challenge Code
         */


        document
        .getElementById(
            "challenge-code"
        )
        .innerText =
            result.challengeCode;



        document
        .getElementById(
            "created-challenge"
        )
        .classList
        .remove(
            "hidden"
        );



        loadChallenge();


    }
    catch(error){

        alert(
            error.message
        );

    }

}





async function joinButton(){


    try{


        const code =
            document
            .getElementById(
                "join-code"
            )
            .value;



        const result =
            await joinChallenge(
                code
            );


        currentChallengeId =
            result.challengeId;



        loadChallenge();


    }
    catch(error){

        alert(
            error.message
        );

    }

}





async function loadChallenge(){


    const data =
        await getChallenge(
            currentChallengeId
        );


    document
    .getElementById(
        "challenge-room"
    )
    .classList
    .remove(
        "hidden"
    );



    const players =
        data.players;



    players.forEach(
        player=>{


            if(
                player.role ===
                "playerA"
            ){

                document
                .getElementById(
                    "player-a-ec"
                )
                .innerText =
                    player.challengeEC;


            }


            if(
                player.role ===
                "playerB"
            ){

                document
                .getElementById(
                    "player-b-ec"
                )
                .innerText =
                    player.challengeEC;


            }


        }
    );


}

document.addEventListener(
"DOMContentLoaded",
()=>{


const copyButton =
document.getElementById(
"copy-code-button"
);



if(copyButton){


copyButton.addEventListener(
"click",
async()=>{


const code =
document
.getElementById(
"challenge-code"
)
.innerText;



if(!code || code==="-" ){
return;
}



await navigator.clipboard.writeText(
code
);



const message =
document.getElementById(
"copy-message"
);



message.innerText =
"✓ 已複製挑戰代碼";



setTimeout(()=>{

message.innerText="";

},2000);



});


}



});

const menuButton =
document.getElementById(
"player-menu-button"
);


const playerMenu =
document.querySelector(
".player-menu"
);


if(menuButton){

menuButton.onclick =
()=>{

playerMenu.classList.toggle(
"open"
);

};

}
