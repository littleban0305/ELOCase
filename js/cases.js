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

        let isChallengePage = false;


        try {

            const user =
                await verifySession();


            updateLoginUI(
                user
            );


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


            /*
             * ====================================
             * 判斷 Challenge Mode
             * ====================================
             */

            isChallengePage =
                mode === "challenge" &&
                !!challengeId;


            /*
             * ====================================
             * Challenge 專屬 Loading
             *
             * 只用於第一次載入
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


            /*
             * ====================================
             * 第一次立即載入箱子
             * ====================================
             */

            const cases =
                await getCases();


            renderCases(
                cases
            );


            /*
             * ====================================
             * 第一次載入完成
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
