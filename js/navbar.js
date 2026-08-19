document.addEventListener(
    "DOMContentLoaded",
    function(){


        const navbar =
            document.querySelector(
                "#navbar"
            );


        if(!navbar){
            return;
        }


        const challenge =
            isChallengeMode();



        if(challenge){

            document.body.classList.add(
                "challenge-mode"
            );

            renderChallengeNavbar(
                navbar
            );


        }
        else{


            renderNormalNavbar(
                navbar
            );


        }



        initNavbar();


    }
);





/*
========================================
普通 Navbar
========================================
*/

function renderNormalNavbar(navbar){


navbar.innerHTML = `


<div class="navbar-container">


<a
href="index.html"
class="brand"
>

ELOCase

</a>



<nav class="nav-links">


<a href="index.html"
class="nav-link">

首頁

</a>



<a href="cases.html"
class="nav-link">

開箱

</a>



<a href="inventory.html"
class="nav-link">

我的物品

</a>



<a href="profile.html"
class="nav-link">

個人資料

</a>



</nav>




<div class="navbar-actions">


<div class="balance">


<span class="balance-label">

ELOCoin

</span>


<span
class="balance-value"
id="navbar-balance"
>

0

</span>


</div>





${createPlayerMenu()}



</div>



</div>


`;

}








/*
========================================
Challenge Navbar
========================================
*/

function renderChallengeNavbar(navbar){


const params =
new URLSearchParams(
    location.search
);


const challengeId =
params.get(
    "challengeId"
)
||
"";



navbar.innerHTML = `


<div class="challenge-navbar-container">



<a
href="challenge-room.html?challengeId=${challengeId}"
class="challenge-brand"
>


<span>

ELOCase

</span>


<strong>

Challenge Mode

</strong>


</a>





<div class="challenge-navbar-status">



<div class="challenge-user-box">


<div class="challenge-box-title">

我的 ELOCoin

</div>


<div
id="navbar-my-coin"
class="challenge-box-value"
>

0

</div>


</div>





<div class="challenge-user-box">


<div class="challenge-box-title">

我的物品價值

</div>


<div
id="navbar-my-value"
class="challenge-box-value"
>

0

</div>


</div>





<div class="challenge-user-box opponent">


<div class="challenge-box-title">

對手 ELOCoin

</div>


<div
id="navbar-opponent-coin"
class="challenge-box-value"
>

0

</div>


</div>





<div class="challenge-user-box opponent">


<div class="challenge-box-title">

對手物品價值

</div>


<div
id="navbar-opponent-value"
class="challenge-box-value"
>

0

</div>


</div>



</div>


</div>


`;

}








/*
========================================
玩家 Menu
========================================
*/

function createPlayerMenu(){


return `


<div class="player-menu">


<button
type="button"
class="player-menu-button"
id="player-menu-button"
>


<span class="player-avatar">

◉

</span>



<span
id="navbar-player-name"
class="player-menu-name"
>

登入

</span>



<span class="player-menu-arrow">

▾

</span>


</button>





<div
class="player-menu-dropdown"
id="player-menu-dropdown"
>



<div id="navbar-guest-menu">


<a
href="login.html"
class="player-menu-item"
>

登入

</a>



<a
href="register.html"
class="player-menu-item"
>

註冊

</a>


</div>





<div id="navbar-user-menu">


<a
href="profile.html"
class="player-menu-item"
>

個人資料

</a>



<a
href="inventory.html"
class="player-menu-item"
>

我的物品

</a>



<button
id="navbar-logout-button"
class="player-menu-item player-menu-logout"
>

登出

</button>



</div>


</div>



</div>


`;

}







function isChallengeMode(){


const params =
new URLSearchParams(
    location.search
);


return (

params.get("mode")
===
"challenge"

)

||

location.pathname.includes(
    "challenge-room"
);


}








function logoutPlayer(){


localStorage.clear();

sessionStorage.clear();


location.href =
"index.html";


}








function initNavbar(){


setActiveNav();



const menuButton =
document.querySelector(
    "#player-menu-button"
);



const dropdown =
document.querySelector(
    "#player-menu-dropdown"
);




if(
menuButton &&
dropdown
){


menuButton.onclick =
function(e){

e.stopPropagation();


dropdown.classList.toggle(
    "show"
);


};



document.addEventListener(
"click",
()=>{

dropdown.classList.remove(
    "show"
);

}

);


}







const user =
getSavedUser();



const guestMenu =
document.querySelector(
"#navbar-guest-menu"
);



const userMenu =
document.querySelector(
"#navbar-user-menu"
);



const playerName =
document.querySelector(
"#navbar-player-name"
);



const balance =
document.querySelector(
"#navbar-balance"
);




if(!user){


if(playerName)
playerName.textContent =
"登入";


if(balance)
balance.textContent =
"0";



if(guestMenu)
guestMenu.style.display =
"block";


if(userMenu)
userMenu.style.display =
"none";


return;

}




if(playerName){

playerName.textContent =
user.displayName ||
user.username ||
"玩家";

}



if(balance){

balance.textContent =
formatCurrency(
user.eloCoin
);

}




if(guestMenu)
guestMenu.style.display =
"none";



if(userMenu)
userMenu.style.display =
"block";





const logoutButton =
document.querySelector(
"#navbar-logout-button"
);



if(logoutButton){

logoutButton.onclick =
()=>{

logoutPlayer();

};

}


}








function setActiveNav(){


const current =
location.pathname
.split("/")
.pop();



document
.querySelectorAll(".nav-link")
.forEach(
link=>{


const href =
link.getAttribute(
"href"
);


if(
href &&
href.includes(current)
){

link.classList.add(
"active"
);

}


}

);


}








function formatCurrency(value){


return Number(
value || 0
)
.toLocaleString(
"en-US",
{
maximumFractionDigits:2
}
);


}
