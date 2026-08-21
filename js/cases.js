/* ========================================
ELOCase - Cases List
======================================== */

let challengeCasesNavbarTimer = null;

let challengeCasesListTimer = null;


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
             * API 回來不代表頁面已經準備好。
             *
             * 這裡會等待：
             *
             * API
             * ↓
             * Case Card
             * ↓
             * 圖片載入
             * ↓
             * Loading 才結束
             * ====================================
             */

            if(
                isChallengePage
            ){

                await waitForCaseImages();

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

    const grid =
        document.querySelector(
            "#case-grid"
        );


    if(!grid){

        return;

    }


    grid.innerHTML = "";


    if(
        !cases ||
        cases.length === 0
    ){

        grid.innerHTML =

        `
        <div class="case-empty">

            目前沒有箱子

        </div>
        `;

        return;

    }


    cases.forEach(
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
