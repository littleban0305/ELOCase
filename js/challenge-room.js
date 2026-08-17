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



    refreshTimer =
        setInterval(
            loadChallengeRoom,
            3000
        );


});







/*
========================================
取得 Challenge Room
========================================
*/

async function loadChallengeRoom(){


    try{


        const result =
            await getChallengeRoom(
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
            "載入 Challenge Room 失敗",
            error
        );

    }


}









/*
========================================
更新房間資料
========================================
*/

function updateChallengeInfo(
data
){


    const challenge =
        data.challenge;



    /*
    ================================
    Challenge Code
    ================================
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
    ================================
    狀態
    ================================
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
    ================================
    玩家
    ================================
    */


    resetPlayers();



    const players =
        data.players || [];



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


        }
    );



}









/*
========================================
設定玩家
========================================
*/

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


    const value =
        document.getElementById(
            "player-" + side + "-value"
        );



    if(name){

        name.innerText =
            player.displayName ||
            "未知玩家";

    }




    if(ec){

        ec.innerText =
            Number(
                player.challengeEC
            )
            .toLocaleString();

    }




    if(value){

        value.innerText =
            Number(
                player.finalValue
            )
            .toFixed(2);

    }


}









/*
========================================
重置玩家
========================================
*/

function resetPlayers(){


    const defaults = {


        "player-a-name":
            "Player A",


        "player-a-ec":
            "-",


        "player-a-value":
            "0",



        "player-b-name":
            "等待玩家",


        "player-b-ec":
            "-",


        "player-b-value":
            "0"


    };



    Object.keys(defaults)
    .forEach(
        id=>{


            const element =
                document.getElementById(
                    id
                );


            if(element){

                element.innerText =
                    defaults[id];

            }


        }
    );


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
