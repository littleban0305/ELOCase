let challengeId = null;


document.addEventListener(
"DOMContentLoaded",
async()=>{


    const params =
        new URLSearchParams(
            location.search
        );


    challengeId =
        params.get(
            "id"
        );



    if(!challengeId){

        alert(
            "缺少 Challenge ID"
        );

        return;

    }



    document
    .getElementById(
        "challenge-id"
    )
    .innerText =
        challengeId;



    loadRoom();


});





async function loadRoom(){


    try{


        const data =
            await getChallenge(
                challengeId
            );



        const players =
            data.players;



        players.forEach(
            player=>{


                if(
                    player.role === "playerA"
                ){

                    document
                    .getElementById(
                        "player-a-name"
                    )
                    .innerText =
                        player.username;


                    document
                    .getElementById(
                        "player-a-ec"
                    )
                    .innerText =
                        player.challengeEC;


                }



                if(
                    player.role === "playerB"
                ){

                    document
                    .getElementById(
                        "player-b-name"
                    )
                    .innerText =
                        player.username;


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
    catch(error){

        alert(
            error.message
        );

    }


}
