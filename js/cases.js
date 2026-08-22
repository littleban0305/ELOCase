/* ========================================
ELOCase - Cases List
======================================== */

let challengeCasesNavbarTimer = null;

let challengeCasesListTimer = null;

let casesPageSource = [];
let casesPageGame = "ALL";
let casesPageCategory = "ALL";

function getCasesPageGames(cases) {
    return Array.from(new Set(cases.map(item => String(item.game || "").trim()).filter(Boolean)));
}

function getCasesPageCategories(cases, game) {
    const filtered = game === "ALL" ? cases : cases.filter(item => String(item.game || "").trim() === game);
    return Array.from(new Set(filtered.map(item => String(item.category || "").trim()).filter(Boolean)));
}

function renderCasesPageFilters(cases) {
    const container = document.querySelector("#case-filters");
    if (!container) return;

    const games = getCasesPageGames(cases);
    if (casesPageGame !== "ALL" && !games.includes(casesPageGame)) {
        casesPageGame = "ALL";
        casesPageCategory = "ALL";
    }

    const categories = getCasesPageCategories(cases, casesPageGame);
    if (casesPageCategory !== "ALL" && !categories.includes(casesPageCategory)) {
        casesPageCategory = "ALL";
    }

    container.innerHTML = `
        <div class="case-filter-row">
            <span class="case-filter-title">遊戲</span>
            <div class="case-filter-options">
                <button type="button" class="case-filter-button ${casesPageGame === "ALL" ? "active" : ""}" data-page-game="ALL">全部</button>
                ${games.map(game => `
                    <button type="button" class="case-filter-button ${casesPageGame === game ? "active" : ""}" data-page-game="${escapeHtml(game)}">${escapeHtml(game)}</button>
                `).join("")}
            </div>
        </div>
        <div class="case-filter-row">
            <span class="case-filter-title">分類</span>
            <div class="case-filter-options">
                <button type="button" class="case-filter-button ${casesPageCategory === "ALL" ? "active" : ""}" data-page-category="ALL">全部</button>
                ${categories.map(category => `
                    <button type="button" class="case-filter-button ${casesPageCategory === category ? "active" : ""}" data-page-category="${escapeHtml(category)}">${escapeHtml(category)}</button>
                `).join("")}
            </div>
        </div>
    `;

    container.querySelectorAll("[data-page-game]").forEach(button => {
        button.addEventListener("click", () => {
            casesPageGame = button.dataset.pageGame || "ALL";
            casesPageCategory = "ALL";
            renderCases(casesPageSource);
        });
    });

    container.querySelectorAll("[data-page-category]").forEach(button => {
        button.addEventListener("click", () => {
            casesPageCategory = button.dataset.pageCategory || "ALL";
            renderCases(casesPageSource);
        });
    });
}

function getVisibleCasesPage(cases) {
    return cases.filter(item => {
        const game = String(item.game || "").trim();
        const category = String(item.category || "").trim();
        return (casesPageGame === "ALL" || game === casesPageGame)
            && (casesPageCategory === "ALL" || category === casesPageCategory);
    });
}


/* ========================================
初始化
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*
         * ====================================
         * 先判斷 Challenge Mode
         *
         * ⚠️ Loading 必須比 API / Session
         * 更早開始
         * ====================================
         */

        const params =
            new URLSearchParams(
                location.search
            );


        const mode =
            params.get(
                "mode"
            );


        const challengeId =
            params.get(
                "challengeId"
            );


        const isChallengePage =
            mode === "challenge" &&
            !!challengeId;


        /*
         * ====================================
         * Challenge 專屬 Loading
         *
         * 第一次進入頁面立即開始
         *
         * 後面的背景更新不會觸發
         * ====================================
         */

        if(
            isChallengePage &&
            window.ELOChallengeLoading
        ){

            ELOChallengeLoading.start();

        }


        try {

            /*
             * ====================================
             * 驗證登入
             * ====================================
             */

            const user =
                await verifySession();


            updateLoginUI(
                user
            );


            /*
             * ====================================
             * 第一次立即載入箱子
             * ====================================
             */

            const cases =
                await getCases();


            /*
             * ====================================
             * 建立箱子卡片
             * ====================================
             */

            renderCases(
                cases
            );


            /*
             * ====================================
             * ⭐ 等待 Case 圖片真正載入
             *
             * Challenge Mode：
             *
             * API
             * ↓
             * Case Card
             * ↓
             * Case 圖片
             * ↓
             * Challenge Navbar 資料
             * ↓
             * Loading 才結束
             * ====================================
             */
            
            if(
                isChallengePage
            ){
            
                await waitForCaseImages();
            
            
                /*
                 * ====================================
                 * ⭐ 等待 Challenge Navbar 完成
                 *
                 * 右上角四個數值必須先更新完成：
                 *
                 * 我的 EC
                 * 我的價值
                 * 對手 EC
                 * 對手價值
                 *
                 * 才允許 Loading Bar 消失。
                 * ====================================
                 */
            
                await waitForChallengeNavbar();
            
            }
            
            
            /*
             * ====================================
             * ⭐ 第一次真正載入完成
             * ====================================
             */
            
            if(
                isChallengePage &&
                window.ELOChallengeLoading
            ){
            
                ELOChallengeLoading.finish();
            
            }


            /*
             * ====================================
             * Challenge 返回按鈕
             * ====================================
             */

            initChallengeBack();


            /*
             * ====================================
             * Challenge Navbar 即時更新
             * ====================================
             */

            startChallengeCasesRefresh();


            /*
             * ====================================
             * Challenge 箱子列表背景更新
             *
             * 每 3 秒更新一次
             *
             * ⚠️ 絕對不觸發 Loading
             * ====================================
             */

            if(
                isChallengePage
            ){

                challengeCasesListTimer =
                    setInterval(
                        async () => {

                            try {

                                const updatedCases =
                                    await getCases();


                                /*
                                 * 只更新列表
                                 *
                                 * 不觸發任何 Loading
                                 */

                                renderCases(
                                    updatedCases
                                );


                            }
                            catch(error){

                                console.error(
                                    "Challenge 箱子列表更新失敗：",
                                    error
                                );

                            }

                        },
                        3000
                    );

            }


        }
        catch(error){

            console.error(
                "開箱列表載入失敗：",
                error
            );


            /*
             * ====================================
             * 確保 Challenge Loading 停止
             * ====================================
             */

            if(
                isChallengePage &&
                window.ELOChallengeLoading
            ){

                ELOChallengeLoading.stop();

            }


            const grid =
                document.querySelector(
                    "#case-grid"
                );


            if(grid){

                grid.innerHTML =

                `
                <div class="case-loading">

                    箱子資料載入失敗

                </div>
                `;

            }

        }

    }
);


/* ========================================
渲染箱子列表
======================================== */

function renderCases(cases){

    casesPageSource = Array.isArray(cases) ? cases : [];

    renderCasesPageFilters(casesPageSource);

    const visibleCases = getVisibleCasesPage(casesPageSource);

    const grid =
        document.querySelector(
            "#case-grid"
        );


    if(!grid){

        return;

    }


    grid.innerHTML = "";


    if(
        !visibleCases ||
        visibleCases.length === 0
    ){

        grid.innerHTML =

        `
        <div class="case-empty">

            目前沒有箱子

        </div>
        `;

        return;

    }


    visibleCases.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "case-card";


            card.innerHTML =

            `

                <div class="case-image">

                    ${
                        item.imageUrl

                        ?

                        `
                        <img
                            src="${escapeHtml(
                                item.imageUrl
                            )}"
                            alt=""
                        >
                        `

                        :

                        `
                        ELOCase
                        `
                    }

                </div>


                <div class="case-info">

                    <div class="case-card-tags">
                        <span class="case-card-game">
                            ${escapeHtml(item.game || "-")}
                        </span>
                        ${item.category ? `
                            <span class="case-card-category">
                                ${escapeHtml(item.category)}
                            </span>
                        ` : ""}
                    </div>

                    <h3>

                        ${escapeHtml(
                            item.name ||
                            "未命名箱子"
                        )}

                    </h3>


                    <div class="case-bottom">

                        <span class="case-price">

                            $${Number(
                                item.price || 0
                            ).toLocaleString()}

                        </span>


                        <span class="case-action">

                            開啟 →

                        </span>

                    </div>

                </div>

            `;


            /*
             * ====================================
             * 點擊箱子
             * ====================================
             */

            card.onclick =
            () => {

                const params =
                    new URLSearchParams(
                        location.search
                    );


                const mode =
                    params.get(
                        "mode"
                    );


                const challengeId =
                    params.get(
                        "challengeId"
                    );


                let url =
                    "case.html?caseId="
                    +
                    encodeURIComponent(
                        item.caseId
                    );


                /*
                 * Challenge Mode
                 *
                 * 保留 Challenge 資訊
                 */

                if(
                    mode === "challenge" &&
                    challengeId
                ){

                    url +=
                        "&mode=challenge"
                        +
                        "&challengeId="
                        +
                        encodeURIComponent(
                            challengeId
                        );

                }


                location.href =
                    url;

            };


            grid.appendChild(
                card
            );

        }
    );

}

/* ========================================
等待 Case 圖片載入
======================================== */

function waitForCaseImages(){

    return new Promise(
        resolve => {

            const grid =
                document.querySelector(
                    "#case-grid"
                );


            /*
             * 沒有 Grid
             * 直接完成
             */

            if(!grid){

                resolve();

                return;

            }


            const images =
                Array.from(
                    grid.querySelectorAll(
                        "img"
                    )
                );


            /*
             * 沒有圖片
             * 直接完成
             */

            if(
                images.length === 0
            ){

                /*
                 * 至少等一幀
                 * 讓瀏覽器完成排版
                 */

                requestAnimationFrame(
                    () => {

                        resolve();

                    }
                );

                return;

            }


            /*
             * ====================================
             * 等待所有圖片
             *
             * load  → 完成
             * error → 也算完成
             * ====================================
             */

            let finishedCount = 0;

            let resolved = false;


            const finishOne =
                () => {

                    if(resolved){

                        return;

                    }


                    finishedCount++;


                    if(
                        finishedCount >=
                        images.length
                    ){

                        resolved =
                            true;


                        /*
                         * 再等一幀
                         *
                         * 確保圖片載入後
                         * DOM / Layout 已經更新
                         */

                        requestAnimationFrame(
                            () => {

                                resolve();

                            }
                        );

                    }

                };


            images.forEach(
                image => {

                    /*
                     * 圖片早已載入完成
                     */

                    if(
                        image.complete
                    ){

                        finishOne();

                        return;

                    }


                    /*
                     * 圖片正常載入
                     */

                    image.addEventListener(
                        "load",
                        finishOne,
                        {
                            once: true
                        }
                    );


                    /*
                     * 圖片載入失敗
                     *
                     * 不應該讓 Loading 永遠卡住
                     */

                    image.addEventListener(
                        "error",
                        finishOne,
                        {
                            once: true
                        }
                    );

                }
            );


            /*
             * ====================================
             * 最長等待時間
             *
             * 避免某一張圖片伺服器卡死，
             * 導致整個 Loading 永遠不消失。
             * ====================================
             */

            setTimeout(
                () => {

                    if(resolved){

                        return;

                    }


                    resolved =
                        true;


                    console.warn(
                        "⚠️ 部分 Case 圖片載入逾時，繼續完成 Loading"
                    );


                    resolve();

                },
                10000
            );

        }
    );

}

/*
========================================
等待 Challenge Navbar 完成
========================================

Challenge Cases 首次載入時：

Loading Bar 不只等待箱子。

還必須等待右上角：

1. 我的 EC
2. 我的物品價值
3. 對手 EC
4. 對手物品價值

全部完成後才結束 Loading。
========================================
*/

async function waitForChallengeNavbar(){

    /*
     * ====================================
     * 只在 Challenge Mode 使用
     * ====================================
     */

    const params =
        new URLSearchParams(
            location.search
        );


    const mode =
        params.get(
            "mode"
        );


    const challengeId =
        params.get(
            "challengeId"
        );


    if(
        mode !== "challenge" ||
        !challengeId
    ){

        return;

    }


    /*
     * ====================================
     * 最多等待 15 秒
     *
     * 避免 API 異常時 Loading 永遠卡住
     * ====================================
     */

    const maxAttempts =
        30;


    const interval =
        500;


    /*
     * ====================================
     * 等待 Navbar DOM
     * ====================================
     */

    for(
        let attempt = 0;
        attempt < maxAttempts;
        attempt++
    ){

        /*
         * Challenge Navbar 是否已經建立
         */

        const myCoin =
            document.querySelector(
                "#navbar-my-coin"
            );


        const myValue =
            document.querySelector(
                "#navbar-my-value"
            );


        const opponentCoin =
            document.querySelector(
                "#navbar-opponent-coin"
            );


        const opponentValue =
            document.querySelector(
                "#navbar-opponent-value"
            );


        /*
         * Navbar 還沒建立
         *
         * 等下一次
         */

        if(
            !myCoin ||
            !myValue ||
            !opponentCoin ||
            !opponentValue
        ){

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        interval
                    )
            );


            continue;

        }


        /*
         * ====================================
         * 嘗試立即取得 Challenge 最新資料
         * ====================================
         */

        try{

            const result =
                await getChallenge(
                    challengeId,
                    {
                        noLoading: true
                    }
                );


            if(
                result &&
                Array.isArray(
                    result.players
                )
            ){

                const user =
                    await verifySession();


                if(user){

                    let me = null;

                    let opponent = null;


                    result.players.forEach(
                        player => {

                            if(
                                String(
                                    player.userId
                                )
                                ===
                                String(
                                    user.userId
                                )
                            ){

                                me =
                                    player;

                            }
                            else{

                                opponent =
                                    player;

                            }

                        }
                    );


                    /*
                     * ====================================
                     * 找到雙方玩家
                     * ====================================
                     */

                    if(
                        me &&
                        opponent
                    ){

                        /*
                         * 我的 EC
                         */

                        setText(
                            "navbar-my-coin",
                            formatNumber(
                                me.challengeEC
                            )
                        );


                        /*
                         * 我的物品價值
                         */

                        const myItemValue =
                            Array.isArray(
                                me.items
                            )
                                ? me.items.reduce(
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
                            "navbar-my-value",
                            formatNumber(
                                myItemValue
                            )
                        );


                        /*
                         * 對手 EC
                         */

                        setText(
                            "navbar-opponent-coin",
                            formatNumber(
                                opponent.challengeEC
                            )
                        );


                        /*
                         * 對手物品價值
                         */

                        const opponentItemValue =
                            Array.isArray(
                                opponent.items
                            )
                                ? opponent.items.reduce(
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
                            "navbar-opponent-value",
                            formatNumber(
                                opponentItemValue
                            )
                        );


                        /*
                         * ====================================
                         * ⭐ 四張資料卡已完成
                         * ====================================
                         */

                        return;

                    }

                }

            }

        }
        catch(error){

            console.warn(
                "等待 Challenge Navbar 更新失敗：",
                error
            );

        }


        /*
         * ====================================
         * 尚未完成
         * 等待下一次
         * ====================================
         */

        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    interval
                )
        );

    }


    /*
     * ====================================
     * 超過最大等待時間
     *
     * 不讓整個頁面永久卡住
     * ====================================
     */

    console.warn(
        "⚠️ Challenge Navbar 等待逾時，繼續載入頁面"
    );

}

/* ========================================
HTML 防護
======================================== */

function escapeHtml(
    value
){

    return String(
        value ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );

}


/* ========================================
Challenge 返回
======================================== */

function initChallengeBack(){

    const button =
        document.querySelector(
            "#challenge-back"
        );


    if(!button){

        return;

    }


    const params =
        new URLSearchParams(
            location.search
        );


    const challengeId =
        params.get(
            "challengeId"
        );


    if(challengeId){

        button.href =
            "challenge-room.html?id="
            +
            encodeURIComponent(
                challengeId
            );


        button.style.display =
            "inline-flex";

    }

}


/* ========================================
Challenge Cases Navbar 即時更新
======================================== */

function startChallengeCasesRefresh(){

    const params =
        new URLSearchParams(
            location.search
        );


    const mode =
        params.get(
            "mode"
        );


    const challengeId =
        params.get(
            "challengeId"
        );


    if(
        mode !== "challenge" ||
        !challengeId
    ){

        return;

    }


    /*
     * 避免重複建立 Timer
     */

    if(
        challengeCasesNavbarTimer
    ){

        clearInterval(
            challengeCasesNavbarTimer
        );

    }


    challengeCasesNavbarTimer =
        setInterval(
            refreshChallengeCasesNavbar,
            3000
        );

}


/* ========================================
Challenge Navbar 背景更新
======================================== */

async function refreshChallengeCasesNavbar(){

    const params =
        new URLSearchParams(
            location.search
        );


    const challengeId =
        params.get(
            "challengeId"
        );


    if(!challengeId){

        return;

    }


    try{

        /*
         * ====================================
         * 背景取得 Challenge
         *
         * 不觸發 Loading
         * ====================================
         */

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

            return;

        }


        const user =
            await verifySession();


        if(!user){

            return;

        }


        let me = null;

        let opponent = null;


        result.players.forEach(
            player => {

                if(
                    String(
                        player.userId
                    )
                    ===
                    String(
                        user.userId
                    )
                ){

                    me =
                        player;

                }
                else{

                    opponent =
                        player;

                }

            }
        );


        /*
         * ====================================
         * 自己
         * ====================================
         */

        if(me){

            setText(
                "navbar-my-coin",
                formatNumber(
                    me.challengeEC
                )
            );


            const myItemValue =
                Array.isArray(
                    me.items
                )
                ?
                me.items.reduce(
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
                :
                0;


            setText(
                "navbar-my-value",
                formatNumber(
                    myItemValue
                )
            );

        }


        /*
         * ====================================
         * 對手
         * ====================================
         */

        if(opponent){

            setText(
                "navbar-opponent-coin",
                formatNumber(
                    opponent.challengeEC
                )
            );


            const opponentItemValue =
                Array.isArray(
                    opponent.items
                )
                ?
                opponent.items.reduce(
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
                :
                0;


            setText(
                "navbar-opponent-value",
                formatNumber(
                    opponentItemValue
                )
            );

        }


    }
    catch(error){

        console.warn(
            "Challenge Navbar 更新失敗",
            error
        );

    }

}


/* ========================================
通用文字更新
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


/* ========================================
數字格式
======================================== */

function formatNumber(value){

    return Number(
        value || 0
    ).toLocaleString();

}
