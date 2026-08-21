/* ========================================
   ELOCase Challenge Room
======================================== */


let challengeId = null;

let currentUser = null;

let myPlayer = null;

let opponentPlayer = null;

let refreshTimer = null;




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



    initButtons();


    loadChallengeRoom(true);
   
   
    refreshTimer =
        setInterval(
            () => {
   
                loadChallengeRoom(false);
   
            },
            3000
        );


});






/* ========================================
   載入房間
======================================== */


/* ========================================
   載入 Challenge 房間
======================================== */

async function loadChallengeRoom(
    showLoading = false
){

    /*
     * ====================================
     * Challenge Room
     *
     * 🚫 不使用舊 ELOLoading
     *
     * Challenge Room 現在直接背景載入
     * 不顯示原本橘色 Loading Bar。
     *
     * showLoading 參數先保留，
     * 避免影響其他地方呼叫這個函式。
     * ====================================
     */

    try{

        const result =
            await getChallenge(
                challengeId,
                {
                    /*
                     * Challenge Room
                     * 永遠不使用 API Loading
                     */
                    noLoading:
                        true
                }
            );


        if(
            !result ||
            !result.challenge
        ){

            return;

        }


        /*
         * ====================================
         * 更新玩家資料
         * ====================================
         */

        processPlayers(
            result.players
        );


        /*
         * ====================================
         * 更新 Challenge Room UI
         * ====================================
         */

        renderChallenge(
            result
        );


        /*
         * ====================================
         * 判斷是否雙方都完成
         * ====================================
         */

        if(
            Array.isArray(
                result.players
            )
        ){

            const allFinished =
                result.players.length >= 2 &&
                result.players.every(
                    player =>
                        String(
                            player.finished
                        )
                        .toLowerCase()
                        ===
                        "true"
                );


            if(
                allFinished
            ){

                /*
                 * 停止 3 秒背景更新
                 */

                if(
                    refreshTimer
                ){

                    clearInterval(
                        refreshTimer
                    );

                    refreshTimer =
                        null;

                }


                /*
                 * 前往結果頁
                 */

                location.href =
                    "challenge-result.html?id="
                    +
                    encodeURIComponent(
                        challengeId
                    );


                return;

            }

        }

    }
    catch(error){

        console.error(
            "Challenge Room 載入失敗",
            error
        );

    }

}








/* ========================================
   判斷玩家身份
======================================== */


function processPlayers(players){


    myPlayer = null;

    opponentPlayer = null;



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
   渲染
======================================== */


function renderChallenge(data){



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




renderMyPlayer();



renderOpponentPlayer();



}

/* ========================================
   我的資料
======================================== */


function renderMyPlayer(){

    if(!myPlayer){

        return;

    }


    const finishButton =
        document.getElementById(
            "finish-challenge-button"
        );

   const openButton =
       document.getElementById(
           "open-case-button"
       );


    if(finishButton){

        if(
            String(
                myPlayer.finished
            ).toLowerCase()
            ===
            "true"
        ){

            finishButton.disabled =
                true;

            finishButton.innerText =
                "已結束挑戰";

        }
        else{

            finishButton.disabled =
                false;

            finishButton.innerText =
                "結束挑戰";

        }

    }

   if(openButton){
   
       if(
           String(
               myPlayer.finished
           ).toLowerCase()
           ===
           "true"
       ){
   
           openButton.disabled =
               true;
   
           openButton.innerText =
               "挑戰已結束";
   
       }
       else{
   
           openButton.disabled =
               false;
   
           openButton.innerText =
               "選擇箱子開啟";
   
       }
   
   }


    const myItemValue =
        Array.isArray(
            myPlayer.items
        )
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


    setText(
        "my-player-name",
        myPlayer.displayName ||
        "我的挑戰"
    );


    setText(
        "my-player-coin",
        formatNumber(
            myPlayer.challengeEC
        )
    );


    setText(
        "my-player-value",
        formatNumber(
            myItemValue
        )
    );


    setText(
        "navbar-my-coin",
        formatNumber(
            myPlayer.challengeEC
        )
    );


    setText(
        "navbar-my-value",
        formatNumber(
            myItemValue
        )
    );


    renderItems(
        "my-items",
        myPlayer.items
    );

}

/* ========================================
   對手資料
======================================== */


function renderOpponentPlayer(){

    if(!opponentPlayer){

        return;

    }


    const opponentItemValue =
        Array.isArray(
            opponentPlayer.items
        )
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
        "opponent-name",
        opponentPlayer.displayName ||
        "等待對手"
    );


    setText(
        "opponent-coin",
        formatNumber(
            opponentPlayer.challengeEC
        )
    );


    setText(
        "opponent-value",
        formatNumber(
            opponentItemValue
        )
    );


    setText(
        "navbar-opponent-coin",
        formatNumber(
            opponentPlayer.challengeEC
        )
    );


    setText(
        "navbar-opponent-value",
        formatNumber(
            opponentItemValue
        )
    );


    renderItems(
        "opponent-items",
        opponentPlayer.items
    );

}

/* ========================================
   物品列表
======================================== */


function renderItems(
id,
items
){


const container =
document.getElementById(
id
);



if(!container){

    return;

}



container.innerHTML = "";



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





items.forEach(
item=>{

console.log(
    "🔍 Challenge Item 原始資料：",
    item
);


const div =
document.createElement(
"div"
);



div.className =
"challenge-item";



div.innerHTML =

`

<div class="challenge-item-image">

${
    item.image
    ?
    `
    <img 
        src="${item.image}"
        alt=""
    >
    `
    :
    ""
}

</div>


<div class="challenge-item-name">

${item.name || "未知物品"}

</div>


<div class="challenge-item-value">

$${formatNumber(item.value)}

</div>

`;



container.appendChild(
div
);



});



}








/* ========================================
   按鈕
======================================== */


function initButtons(){



const openButton =
document.getElementById(
"open-case-button"
);



if(openButton){


openButton.onclick =
()=>{


location.href =

"cases.html?mode=challenge&challengeId="
+
challengeId;


};


}





const backButton =
document.getElementById(
"back-room-button"
);



if(backButton){


backButton.onclick =
()=>{


location.href =
"challenge-room.html?id="
+
challengeId;


};


}






const finishButton =
document.getElementById(
"finish-challenge-button"
);



if(finishButton){


finishButton.onclick =
()=>{


finishChallenge();


};


}




const copyButton =
document.getElementById(
"copy-code-button"
);



if(copyButton){


copyButton.onclick =
copyChallengeCode;


}


}










/* ========================================
   結束挑戰
======================================== */


async function finishChallenge(){

    const confirmResult =
        confirm(
            "確定要結束挑戰嗎？\n\n結束後將無法再開啟箱子。"
        );


    if(!confirmResult){

        return;

    }


    const finishButton =
        document.getElementById(
            "finish-challenge-button"
        );


    try{

        /*
         * 防止重複點擊
         */

        if(finishButton){

            finishButton.disabled = true;

            finishButton.innerText =
                "處理中...";

        }


        /*
         * 呼叫 API
         */

        const result =
             await sendChallengePost({
         
                 action:
                     "finishChallenge",
         
                 challengeId:
                     challengeId,
         
                 sessionToken:
                     getSessionToken()
         
             });
         
         
         console.log(
             "🔥 finishChallenge API 回傳：",
             result
         );
         
         
         /*
          * 取得結果
          */
         
         const data =
             result;


        /*
         * 顯示目前完成狀態
         */

        if(data){

            console.log(
                "Finish Challenge Result:",
                data
            );

        }


        /*
         * 雙方都完成
         */

        if(
            data &&
            data.allFinished
        ){

            /*
             * 下一階段：
             * 前往 Result
             */

            location.href =
                "challenge-result.html?id="
                +
                encodeURIComponent(
                    challengeId
                );

            return;

        }


        /*
         * 只有自己完成
         */

        alert(
            "你已完成挑戰！\n\n等待對手完成後即可查看結果。"
        );


        /*
         * 重新載入房間
         */

        await loadChallengeRoom();


        /*
         * 按鈕狀態
         */

        if(finishButton){

            finishButton.innerText =
                "已結束挑戰";

        }


    }
    catch(error){

        console.error(
            "結束挑戰失敗：",
            error
        );


        alert(
            error.message ||
            "結束挑戰失敗"
        );


        /*
         * 發生錯誤才恢復按鈕
         */

        if(finishButton){

            finishButton.disabled =
                false;

            finishButton.innerText =
                "結束挑戰";

        }

    }

}

/* ========================================
   複製
======================================== */


async function copyChallengeCode(){


const code =
document
.getElementById(
"challenge-code"
)
.innerText;



if(!code){

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
"已複製挑戰代碼";


setTimeout(
()=>{


msg.innerText =
"";


},
2000
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


const element =
document.getElementById(
id
);



if(element){

element.innerText =
value;

}


}



function formatNumber(value){


return Number(
value || 0
)
.toLocaleString();



}



function getStatusText(status){


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
