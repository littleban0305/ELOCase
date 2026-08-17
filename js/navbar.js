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



function initNavbar(){

    /*
     * 這裡放：
     * - 登入狀態
     * - 玩家名稱
     * - EC餘額
     * - 登出
     * - dropdown
     */


}
