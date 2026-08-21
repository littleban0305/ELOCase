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



    if(
        window.ELOChallengeLoading
    ){
    
        ELOChallengeLoading.start();
    
    }
    
    
    await loadChallengeResult()
        .finally(
            () => {
    
                if(
                    window.ELOChallengeLoading
                ){
    
                    ELOChallengeLoading.finish();
    
                }
    
            }
        );

    initButtons();



});






/* ========================================
載入結果
======================================== */


async function loadChallengeResult(){


try{


    const result =
        await getChallenge(
            challengeId,
            {
                noLoading: true
            }
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
        ) || 0;


    const opponentValue =
        Number(
            opponentPlayer.finalValue
        ) || 0;


    /*
     * ========================================
     * 基本資料
     * ========================================
     */

    setText(
        "result-my-name",
        myPlayer.displayName || "玩家"
    );


    setText(
        "result-opponent-name",
        opponentPlayer.displayName || "對手"
    );


    /*
     * ========================================
     * ELOCoin
     * ========================================
     */

    setText(
        "player-a-coin",
        formatNumber(
            myPlayer.challengeEC
        )
    );


    setText(
        "player-b-coin",
        formatNumber(
            opponentPlayer.challengeEC
        )
    );


    /*
     * ========================================
     * 物品價值
     * ========================================
     */

    const myItemValue =
        Array.isArray(myPlayer.items)
            ? myPlayer.items.reduce(
                (
                    total,
                    item
                ) => {

                    return total +
                        (
                            Number(
                                item.value
                            ) || 0
                        );

                },
                0
            )
            : 0;


    const opponentItemValue =
        Array.isArray(opponentPlayer.items)
            ? opponentPlayer.items.reduce(
                (
                    total,
                    item
                ) => {

                    return total +
                        (
                            Number(
                                item.value
                            ) || 0
                        );

                },
                0
            )
            : 0;


    setText(
        "player-a-items",
        formatNumber(
            myItemValue
        )
    );


    setText(
        "player-b-items",
        formatNumber(
            opponentItemValue
        )
    );

    /*
     * ========================================
     * Navbar 資料
     * ========================================
     */
    
    /*
     * 我的 ELOCoin
     */
    
    setText(
        "navbar-my-coin",
        formatNumber(
            myPlayer.challengeEC
        )
    );
    
    
    /*
     * 我的物品價值
     */
    
    setText(
        "navbar-my-value",
        formatNumber(
            myItemValue
        )
    );
    
    
    /*
     * 對手 ELOCoin
     */
    
    setText(
        "navbar-opponent-coin",
        formatNumber(
            opponentPlayer.challengeEC
        )
    );
    
    
    /*
     * 對手物品價值
     */
    
    setText(
        "navbar-opponent-value",
        formatNumber(
            opponentItemValue
        )
    );


    /*
     * ========================================
     * 最終價值
     * ========================================
     */

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


    /*
     * ========================================
     * 勝負
     * ========================================
     */

    const myCard =
        document.querySelector(
            ".player-a"
        );


    const opponentCard =
        document.querySelector(
            ".player-b"
        );


    /*
     * 清除舊狀態
     */

    myCard?.classList.remove(
        "winner-player",
        "loser-player"
    );


    opponentCard?.classList.remove(
        "winner-player",
        "loser-player"
    );


    let resultText = "";


    if(
        myValue >
        opponentValue
    ){

        resultText =
            "🎉 恭喜獲勝！";


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

        resultText =
            "😢 挑戰失敗";


        opponentCard?.classList.add(
            "winner-player"
        );


        myCard?.classList.add(
            "loser-player"
        );


    }
    else{

        resultText =
            "🤝 平局";

    }


    /*
     * ========================================
     * 結果標題
     * ========================================
     */

    setText(
        "winner-text",
        resultText
    );


    /*
     * ========================================
     * 播放結果動畫
     * ========================================
     */

    playResultAnimation(
        myValue,
        opponentValue
    );

}

function playResultAnimation(
    myValue,
    opponentValue
){

    const resultCard =
        document.querySelector(
            ".result-card"
        );


    if(!resultCard){

        return;

    }


    /*
     * 防止重新 render 時重播
     */

    if(
        resultCard.dataset.animationPlayed
        ===
        "true"
    ){

        return;

    }


    resultCard.dataset.animationPlayed =
        "true";


    /*
     * 初始狀態
     */

    resultCard.classList.add(
        "result-animation-start"
    );


    /*
     * 下一幀開始動畫
     */

    requestAnimationFrame(
        ()=>{

            resultCard.classList.add(
                "result-animation-show"
            );

        }
    );


    /*
     * 最終價值數字動畫
     */

    animateNumber(
        "result-my-value",
        myValue
    );


    animateNumber(
        "result-opponent-value",
        opponentValue
    );


    /*
     * 勝者特效
     */

    if(
        myValue >
        opponentValue
    ){

        document.body.classList.add(
            "challenge-win"
        );

    }
    else if(
        myValue <
        opponentValue
    ){

        document.body.classList.add(
            "challenge-lose"
        );

    }
    else{

        document.body.classList.add(
            "challenge-draw"
        );

    }

}

function animateNumber(
    id,
    target
){

    const element =
        document.getElementById(
            id
        );


    if(!element){

        return;

    }


    const duration = 1000;

    const startTime =
        performance.now();


    function update(
        currentTime
    ){

        const progress =
            Math.min(
                (
                    currentTime -
                    startTime
                )
                /
                duration,
                1
            );


        /*
         * easeOut
         */

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const current =
            Math.floor(
                target *
                eased
            );


        element.innerText =
            current.toLocaleString();


        if(
            progress <
            1
        ){

            requestAnimationFrame(
                update
            );

        }
        else{

            element.innerText =
                Number(
                    target
                ).toLocaleString();

        }

    }


    element.innerText =
        "0";


    requestAnimationFrame(
        update
    );

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
