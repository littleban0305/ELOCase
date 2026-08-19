let challengeId = null;


document.addEventListener(
"DOMContentLoaded",
async()=>{


const params =
new URLSearchParams(
location.search
);


challengeId =
params.get("id");



if(!challengeId){

alert(
"缺少 Challenge ID"
);

return;

}



await loadResult();



const back =
document.getElementById(
"back-challenge-button"
);


if(back){

back.onclick=()=>{

location.href =
"challenge.html";

};

}



});





async function loadResult(){

try{


const result =
await getChallenge(
challengeId
);



if(
!result ||
!result.players
){

return;

}



renderResult(
result.players
);



}
catch(error){

console.error(
"Result 載入失敗",
error
);

}

}







function renderResult(players){


if(players.length < 2){

return;

}


const playerA =
players[0];


const playerB =
players[1];



const totalA =
Number(playerA.challengeEC || 0)
+
Number(playerA.finalValue || 0);



const totalB =
Number(playerB.challengeEC || 0)
+
Number(playerB.finalValue || 0);




setText(
"player-a-name",
playerA.displayName || playerA.userId
);


setText(
"player-b-name",
playerB.displayName || playerB.userId
);



setText(
"player-a-total",
formatNumber(totalA)
);


setText(
"player-b-total",
formatNumber(totalB)
);



setText(
"player-a-items",
formatNumber(playerA.finalValue)
);


setText(
"player-b-items",
formatNumber(playerB.finalValue)
);



setText(
"player-a-coin",
formatNumber(playerA.challengeEC)
);


setText(
"player-b-coin",
formatNumber(playerB.challengeEC)
);




const winner =
document.getElementById(
"winner-text"
);



if(totalA > totalB){

winner.innerText =
"🎉 玩家 A 獲勝！";

}
else if(totalB > totalA){

winner.innerText =
"🎉 玩家 B 獲勝！";

}
else{

winner.innerText =
"🤝 平手！";

}


}





function setText(id,value){

const el =
document.getElementById(id);


if(el){

el.innerText =
value;

}

}



function formatNumber(value){

return Number(
value || 0
)
.toLocaleString(
undefined,
{
maximumFractionDigits:2
}
);

}
