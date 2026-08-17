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
            await getChallenge(
                challengeId
            )



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



const code =
document.getElementById(
"challenge-code"
);


if(code){

code.innerText =
challenge.challengeCode;

}



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




resetPlayers();



const players =
data.players || [];



players.forEach(
player=>{


if(
player.role === "playerA"
){


setPlayer(
"a",
player
);


}



if(
player.role === "playerB"
){


setPlayer(
"b",
player
);


}



});


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
"player-"+side+"-name"
);



const ec =
document.getElementById(
"player-"+side+"-ec"
);



const value =
document.getElementById(
"player-"+side+"-value"
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
player.finalValue || 0
)
.toFixed(2);

}




renderItems(
side,
player.items || []
);



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

function renderInventory(
side,
items
){


    const container =
        document.getElementById(
            "player-"+side+"-items"
        );


    if(!container){

        return;

    }


    container.innerHTML="";



    if(
        !items ||
        items.length===0
    ){

        container.innerHTML =
        `
        <div class="empty-inventory">
            尚無物品
        </div>
        `;

        return;

    }




    items.forEach(item=>{


        const card =
        document.createElement(
            "div"
        );


        card.className =
            "challenge-item-card";


        card.innerHTML =
        `

        <img src="${item.image || ''}">


        <div>
            ${item.itemId}
        </div>


        <span>
            $${item.value}
        </span>

        `;


        container.appendChild(card);



    });


}

function renderItems(
side,
items
){


const container =
document.getElementById(
"player-"+side+"-items"
);



if(!container){

return;

}



if(
!items ||
items.length === 0
){


container.innerHTML =

`
<div class="empty-item">
尚無物品
</div>
`;


return;

}




container.innerHTML =
"";



items.forEach(
item=>{


const div =
document.createElement(
"div"
);



div.className =
"challenge-item";



div.innerHTML =

`
<div>
${item.itemId}
</div>

<div class="challenge-item-value">

${Number(item.value).toFixed(2)}

</div>
`;



container.appendChild(
div
);



});


}

