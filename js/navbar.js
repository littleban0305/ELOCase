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
                                type="button"
                                id="navbar-logout-button"
                                class="player-menu-item player-menu-logout"
                            >
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



function logoutPlayer(){

    /*
     * 清除登入資訊
     */

    localStorage.removeItem(
        "sessionToken"
    );


    localStorage.removeItem(
        "elocaseUser"
    );



    /*
     * 清除玩家相關 Cache
     */

    Object.keys(
        localStorage
    )
    .forEach(key=>{


        if(
            key.startsWith(
                "ELOCASE_CACHE_"
            )
        ){

            localStorage.removeItem(
                key
            );

        }


    });



    /*
     * 清除其他可能資料
     */

    localStorage.removeItem(
        "inventory"
    );


    localStorage.removeItem(
        "player"
    );



    /*
     * 重新整理頁面
     */

    location.reload();


}




function initNavbar(){


    setActiveNav();



    /*
     * ========================================
     * Dropdown
     * ========================================
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
     * ========================================
     * 玩家資料
     * ========================================
     */


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



    /*
     * ========================================
     * 未登入
     * ========================================
     */


    if(!user){


        if(playerName){

            playerName.textContent =
                "登入";

        }


        if(balance){

            balance.textContent =
                "0";

        }


        if(guestMenu){

            guestMenu.style.display =
                "block";

        }


        if(userMenu){

            userMenu.style.display =
                "none";

        }


        return;


    }




    /*
     * ========================================
     * 已登入
     * ========================================
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



    if(guestMenu){

        guestMenu.style.display =
            "none";

    }


    if(userMenu){

        userMenu.style.display =
            "block";

    }



    /*
     * ========================================
     * 登出
     * ========================================
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
    .forEach(
        function(link){


            const href =
                link.getAttribute(
                    "href"
                );



            if(
                href === current
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
            maximumFractionDigits: 2
        }
    );


}
