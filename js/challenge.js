let currentChallengeId = null;



document.addEventListener(
"DOMContentLoaded",
async()=>{


    const user =
        await verifySession();


    if(user){

        document
        .getElementById(
            "challenge-player-name"
        )
        .innerText =
            user.displayName;

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



        alert(
            "Challenge Code:\n"
            +
            result.challengeCode
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
