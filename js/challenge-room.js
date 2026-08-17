let challengeId = null;

let refreshTimer = null;



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



    /*
     * 每 3 秒同步一次
     */

    refreshTimer =
        setInterval(
            loadChallengeRoom,
            3000
        );



});








/*
========================================
取得 Challenge
========================================
*/

async function loadChallengeRoom(){


    try{


        const result =
            await getChallenge(
                challengeId
            );



        if(
            !result ||
            !result.challenge
        ){

            return;

        }



        updateChallengeInfo(
            result
        );



    }
    catch(error){


        console.error(
            error
        );


    }


}









/*
========================================
更新畫面
========================================
*/

function updateChallengeInfo(
data
){



    const challenge =
        data.challenge;



    /*
     * Code
     */

    const code =
        document.getElementById(
            "challenge-code"
        );


    if(code){


        code.innerText =
            challenge.challengeCode;


    }






    /*
     * 狀態
     */

    const status =
        document.getElementById(
            "challenge-status"
        );



    if(status){


        status.innerText =
            getStatusText(
                challenge.status
            );


    }






    /*
     * 玩家
     */

    const players =
        data.players || [];



    resetPlayers();




    players.forEach(
    player=>{


        if(
            player.role ===
            "playerA"
        ){


            setPlayer(
                "a",
                player
            );


        }



        if(
            player.role ===
            "playerB"
        ){


            setPlayer(
                "b",
                player
            );


        }



    });



}









function setPlayer(
side,
player
){


    const name =
        document.getElementById(
            "player-" + side + "-name"
        );


    const ec =
        document.getElementById(
            "player-" + side + "-ec"
        );



    if(name){

        name.innerText =
            player.displayName ||
            "未知玩家";

    }



    if(ec){

        ec.innerText =
            player.challengeEC;

    }



}








function resetPlayers(){


    const bName =
        document.getElementById(
            "player-b-name"
        );


    const bEC =
        document.getElementById(
            "player-b-ec"
        );



    if(bName){

        bName.innerText =
            "等待玩家";

    }



    if(bEC){

        bEC.innerText =
            "-";

    }



}









/*
========================================
狀態文字
========================================
*/

function getStatusText(
status
){


    switch(status){


        case "waiting":

            return "等待玩家加入";


        case "active":

            return "挑戰進行中";


        case "finished":

            return "挑戰完成";


        default:

            return status;


    }


}








/*
========================================
複製 Code
========================================
*/

document.addEventListener(
"click",
async(event)=>{


    if(
        event.target.id !==
        "copy-code-button"
    ){

        return;

    }



    const code =
        document.getElementById(
            "challenge-code"
        )?.innerText;



    if(
        !code ||
        code === "-"
    ){

        return;

    }




    await navigator.clipboard.writeText(
        code
    );



    const msg =
        document.getElementById(
            "copy-message"
        );



    if(msg){


        msg.innerText =
            "✓ 已複製挑戰代碼";



        setTimeout(()=>{


            msg.innerText =
                "";


        },2000);


    }


});








/*
========================================
玩家選單
========================================
*/

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
        !button ||
        !menu
    ){

        return;

    }



    button.onclick =
    ()=>{


        menu.classList.toggle(
            "open"
        );


    };



}
