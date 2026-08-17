let challengeId = null;



document.addEventListener(
"DOMContentLoaded",
async()=>{


    const user =
        await verifySession();



    if(user){


        const name =
            document.getElementById(
                "navbar-player-name"
            );


        if(name){

            name.innerText =
            user.displayName;

        }

    }



    initPlayerMenu();



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



    loadChallengeRoom();


});





async function loadChallengeRoom(){


    try{


        const result =
            await getChallenge(
                challengeId
            );



        const data =
            result;

        document
        .getElementById(
            "challenge-code"
        )
        .innerText =
        data.challenge.challengeCode;



        document
        .getElementById(
            "challenge-status"
        )
        .innerText =
        data.challenge.status;



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
                    "player-a-name"
                )
                .innerText =
                player.displayName;



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
                    "player-b-name"
                )
                .innerText =
                player.displayName;



                document
                .getElementById(
                    "player-b-ec"
                )
                .innerText =
                player.challengeEC;


            }



        });


    }
    catch(error){


        alert(
            error.message
        );


    }


}







function initPlayerMenu(){


const button =
document.getElementById(
"player-menu-button"
);


const menu =
document.querySelector(
".player-menu"
);



if(
button &&
menu
){


button.onclick =
()=>{


menu.classList.toggle(
"open"
);


};


}


}

document.addEventListener(
"click",
async(e)=>{


if(
e.target.id !==
"copy-code-button"
){

return;

}



const code =
document
.getElementById(
"challenge-code"
)
.innerText;



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
document
.getElementById(
"copy-message"
);



message.innerText =
"✓ 已複製挑戰代碼";



setTimeout(()=>{

message.innerText="";

},2000);



});
