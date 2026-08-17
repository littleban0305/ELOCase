document.addEventListener(
    "DOMContentLoaded",
    function(){

        const navbar =
            document.querySelector("#navbar");


        if(!navbar){
            return;
        }


        navbar.innerHTML = `

        <div class="navbar-container">


            <a href="index.html" class="brand">
                ELOCase
            </a>



            <nav class="nav-links">

                <a href="index.html" class="nav-link">
                    首頁
                </a>


                <a href="cases.html" class="nav-link">
                    開箱
                </a>


                <a href="inventory.html" class="nav-link">
                    我的物品
                </a>


                <a href="profile.html" class="nav-link">
                    個人資料
                </a>

            </nav>



            <div class="navbar-actions">


                <div class="balance">

                    <span class="balance-label">
                        $
                    </span>

                    <span
                        class="balance-value"
                        id="navbar-balance"
                    >
                        0
                    </span>

                </div>



                <div class="player-menu">


                    <button
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


                        <span>
                            ▾
                        </span>

                    </button>



                    <div
                        class="player-menu-dropdown"
                        id="player-menu-dropdown"
                    >

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


        </div>

        `;


        initNavbar();


    }
);

function logoutPlayer(){

    localStorage.removeItem(
        "sessionToken"
    );


    localStorage.removeItem(
        "elocaseUser"
    );

}

function initNavbar(){


    setActiveNav();



    /*
     * Dropdown
     */

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

        menuButton.addEventListener(
            "click",
            function(e){

                e.stopPropagation();

                dropdown.classList.toggle(
                    "show"
                );

            }
        );


        document.addEventListener(
            "click",
            function(){

                dropdown.classList.remove(
                    "show"
                );

            }
        );

    }



    /*
     * 取得玩家
     */

    const user =
        getSavedUser();



    const playerName =
        document.querySelector(
            "#navbar-player-name"
        );


    const balance =
        document.querySelector(
            "#navbar-balance"
        );



    if(!user){

        if(playerName){

            playerName.textContent =
                "登入";

        }


        if(balance){

            balance.textContent =
                "0";

        }


        return;

    }


    /*
     * 已登入資料
     */

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



    /*
     * 登出
     */

    const logoutButton =
        document.querySelector(
            "#navbar-logout-button"
        );


    if(logoutButton){

        logoutButton.addEventListener(
            "click",
            function(){

                logoutPlayer();

                location.href =
                    "index.html";

            }
        );

    }


}

function setActiveNav(){

    const current =
        location.pathname
        .split("/")
        .pop();


    document
    .querySelectorAll(".nav-link")
    .forEach(link=>{


        const href =
            link
            .getAttribute("href");


        if(href === current){

            link.classList.add(
                "active"
            );

        }

    });

}

function formatCurrency(value){

    return Number(value || 0)
        .toLocaleString(
            "en-US",
            {
                maximumFractionDigits: 2
            }
        );

}
