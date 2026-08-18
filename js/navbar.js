document.addEventListener(
    "DOMContentLoaded",
    function(){

        const navbar =
            document.querySelector("#navbar");


        if(!navbar){
            return;
        }


        const challenge =
            isChallengeMode();



        const brandHTML =
            challenge
            ?
            `
            ELOCase

            <span class="challenge-brand-text">
                Challenge Mode
            </span>
            `
            :
            `
            ELOCase
            `;



        const navHTML =
            challenge
            ?
            `
            <a href="challenge-room.html"
            class="nav-link">
                挑戰房間
            </a>


            <a href="cases.html?mode=challenge"
            class="nav-link">
                開箱
            </a>


            <a href="inventory.html"
            class="nav-link">
                我的物品
            </a>
            `
            :
            `
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
            `;



        navbar.innerHTML = `

        <div class="navbar-container">


            <a href="index.html"
            class="brand">

                ${brandHTML}

            </a>



            <nav class="nav-links">

                ${navHTML}

            </nav>



            <div class="navbar-actions">


                <div class="balance">


                    <span class="balance-label">

                    ${
                        challenge
                        ?
                        "挑戰"
                        :
                        "ELO"
                    }

                    </span>


                    <span
                    class="balance-value"
                    id="navbar-balance">

                        0

                    </span>


                </div>




                <div class="player-menu">


                    <button
                    type="button"
                    class="player-menu-button"
                    id="player-menu-button">


                        <span class="player-avatar">
                            ◉
                        </span>


                        <span
                        id="navbar-player-name"
                        class="player-menu-name">

                            登入

                        </span>


                        <span class="player-menu-arrow">
                            ▾
                        </span>


                    </button>



                    <div
                    class="player-menu-dropdown"
                    id="player-menu-dropdown">


                        <div id="navbar-guest-menu">


                            <a
                            href="login.html"
                            class="player-menu-item">

                                登入

                            </a>


                            <a
                            href="register.html"
                            class="player-menu-item">

                                註冊

                            </a>


                        </div>



                        <div id="navbar-user-menu">


                            <a
                            href="profile.html"
                            class="player-menu-item">

                                個人資料

                            </a>


                            <a
                            href="inventory.html"
                            class="player-menu-item">

                                我的物品

                            </a>


                            <button
                            type="button"
                            id="navbar-logout-button"
                            class="player-menu-item player-menu-logout">

                                登出

                            </button>


                        </div>


                    </div>


                </div>


            </div>


        </div>

        `;



        initNavbar();


    }
);





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
            playerName.textContent="登入";


        if(balance)
            balance.textContent="0";


        if(guestMenu)
            guestMenu.style.display="block";


        if(userMenu)
            userMenu.style.display="none";


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
        guestMenu.style.display="none";


    if(userMenu)
        userMenu.style.display="block";




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
