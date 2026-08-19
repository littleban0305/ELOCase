/* ========================================
ELOCase Challenge Result
======================================== */


let challengeId = null;

let currentUser = null;

let myPlayer = null;

let opponentPlayer = null;



/* ========================================
初始化
======================================== */


document.addEventListener(
"DOMContentLoaded",
async()=>{


    currentUser =
        await verifySession();



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



    await loadChallengeResult();

    initButtons();



});






/* ========================================
載入結果
======================================== */


async function loadChallengeResult(){


try{


    const result =
        await getChallenge(
            challengeId
        );



    if(
        !result ||
        !result.players
    ){

        throw new Error(
            "找不到挑戰資料"
        );

    }



    processPlayers(
        result.players
    );



    renderResult();



}
catch(error){


    console.error(
        "Result 載入失敗",
        error
    );


    alert(
        error.message
    );


}


}








/* ========================================
玩家判斷
======================================== */


function processPlayers(players){


    myPlayer =
        null;


    opponentPlayer =
        null;



    players.forEach(
        player=>{


            if(

                String(
                    player.userId
                )
                ===
                String(
                    currentUser.userId
                )

            ){


                myPlayer =
                    player;


            }
            else{


                opponentPlayer =
                    player;


            }


        }
    );



}







/* ========================================
渲染結果
======================================== */


function renderResult(){



if(
    !myPlayer ||
    !opponentPlayer
){

    return;

}




const myValue =
    Number(
        myPlayer.finalValue
    )
    ||
    0;



const opponentValue =
    Number(
        opponentPlayer.finalValue
    )
    ||
    0;



let resultText =
    "";




if(
    myValue >
    opponentValue
){

    resultText =
        "🎉 恭喜獲勝！";


}
else if(
    myValue <
    opponentValue
){

    resultText =
        "😢 挑戰失敗";


}
else{


    resultText =
        "🤝 平局";


}





setText(
    "winner-text",
    resultText
);

setText(
    "result-title",
    "挑戰結果"
);


setText(
    "result-my-name",
    myPlayer.displayName ||
    "玩家"
);



setText(
    "result-opponent-name",
    opponentPlayer.displayName ||
    "對手"
);





setText(
    "result-my-value",
    formatNumber(
        myValue
    )
);




setText(
    "result-opponent-value",
    formatNumber(
        opponentValue
    )
);


setText(
    "player-a-items",
    formatNumber(
        myValue
    )
);


setText(
    "player-a-coin",
    formatNumber(
        myPlayer.challengeEC
    )
);



setText(
    "player-b-items",
    formatNumber(
        opponentValue
    )
);


setText(
    "player-b-coin",
    formatNumber(
        opponentPlayer.challengeEC
    )
);


const myCard =
    document.querySelector(
        ".player-a"
    );


const opponentCard =
    document.querySelector(
        ".player-b"
    );





if(
    myValue >
    opponentValue
){

    myCard?.classList.add(
        "winner-player"
    );

    opponentCard?.classList.add(
        "loser-player"
    );

}


else if(
    myValue <
    opponentValue
){


    opponentCard?.classList.add(
        "winner-player"
    );


    myCard?.classList.add(
        "loser-player"
    );


}



}









/* ========================================
工具
======================================== */


function setText(
id,
value
){


const el =
    document.getElementById(
        id
    );


if(el){

    el.innerText =
        value;

}


}



function formatNumber(value){


return Number(
    value || 0
)
.toLocaleString();


}

function initButtons(){

const button =
document.getElementById(
    "back-challenge-button"
);


if(button){

button.onclick =
()=>{

location.href =
"challenge.html";

};

}

}
