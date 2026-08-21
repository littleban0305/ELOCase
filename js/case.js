/* ========================================
ELOCase - Case Detail
======================================== */


/* ========================================
取得網址中的 caseId
======================================== */

function getCaseIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "caseId"
    );

}


/* ========================================
Challenge Mode 判斷
======================================== */

function getChallengeDataFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        mode:
            params.get(
                "mode"
            ),


        challengeId:
            params.get(
                "challengeId"
            )

    };

}


/* ========================================
稀有度 CSS
======================================== */

function getRarityClass(rarity) {

    const value =
        String(
            rarity || ""
        )
        .trim()
        .toLowerCase();


    if (
        value.includes("consumer")
    ) {

        return "rarity-white";

    }


    if (
        value.includes("industrial")
    ) {

        return "rarity-light-blue";

    }


    if (
        value.includes("mil-spec")
    ) {

        return "rarity-blue";

    }


    if (
        value.includes("restricted")
    ) {

        return "rarity-purple";

    }


    if (
        value.includes("classified")
    ) {

        return "rarity-pink";

    }


    if (
        value.includes("covert")
    ) {

        return "rarity-red";

    }


    if (
        value.includes("contraband")
    ) {

        return "rarity-gold";

    }


    return "";

}


/* ========================================
更新玩家餘額
======================================== */

function updateBalance(eloCoin) {

    const balanceElement =
        document.querySelector(
            ".balance-value"
        );


    if (!balanceElement) {

        return;

    }


    balanceElement.textContent =
        Number(
            eloCoin || 0
        ).toLocaleString();

}


/* ========================================
更新箱子圖片
======================================== */

function renderCaseImage(caseData) {

    const imageElement =
        document.querySelector(
            "#case-image"
        );


    if (!imageElement) {

        return;

    }


    if (caseData.imageUrl) {

        imageElement.innerHTML = `

            <img
                src="${escapeHtml(
                    caseData.imageUrl
                )}"
                alt=""
                onerror="
                    this.style.display='none';
                    this.parentElement.classList.add('image-error');
                "
            >

        `;

        return;

    }


    imageElement.innerHTML = `

        <span>
            ${escapeHtml(
                caseData.game ||
                "ELOCase"
            )}
        </span>

    `;

}


/* ========================================
更新箱子資訊
======================================== */

function renderCaseInfo(caseData) {

    const gameElement =
        document.querySelector(
            "#case-game"
        );


    const nameElement =
        document.querySelector(
            "#case-name"
        );


    const priceElement =
        document.querySelector(
            "#case-price"
        );


    if (gameElement) {

        gameElement.textContent =
            caseData.game ||
            "CS2";

    }


    if (nameElement) {

        nameElement.textContent =
            caseData.name ||
            "未命名箱子";

    }


    if (priceElement) {

        priceElement.textContent =
            `$${Number(
                caseData.price || 0
            ).toLocaleString()}`;

    }


    document.title =
        `${caseData.name || "箱子"}｜ELOCase`;

}


/* ========================================
建立物品卡片
======================================== */

function createCaseItemCard(item) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "case-item-card " +
        getRarityClass(
            item.rarity
        );


    const imageContent =
        item.image
            ? `

                <img
                    src="${escapeHtml(
                        item.image
                    )}"
                    alt=""
                    class="case-item-real-image"
                    onerror="
                        this.style.display='none';
                    "
                >

                <div class="case-item-blur">

                    <span>
                        ${escapeHtml(
                            item.name ||
                            "未知物品"
                        )}
                    </span>

                </div>

            `
            : `

                <div class="case-item-blur">

                    <span>
                        ${escapeHtml(
                            item.name ||
                            "未知物品"
                        )}
                    </span>

                </div>

            `;


    card.innerHTML = `

        <div class="case-item-image">

            ${imageContent}

            <span class="case-item-probability">

                ${Number(
                    item.probability || 0
                ).toFixed(2)}%

            </span>

        </div>


        <div class="case-item-info">

            <h3>

                ${escapeHtml(
                    item.name ||
                    "未命名物品"
                )}

            </h3>


            <div class="case-item-value">

                $${Number(
                    item.value || 0
                ).toLocaleString()}

            </div>

        </div>

    `;


    const image =
        card.querySelector(
            ".case-item-real-image"
        );


    if (image) {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

            }
        );

    }


    return card;

}


/* ========================================
顯示箱子內容物
======================================== */

function renderCaseItems(items) {

    window.currentCaseItems =
        items || [];


    renderCasePreview(
        window.currentCaseItems
    );


    const container =
        document.querySelector(
            "#case-items"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML = `

            <div class="case-items-loading">

                這個箱子目前沒有內容物。

            </div>

        `;

        return;

    }


    items.forEach(
        item => {

            const card =
                createCaseItemCard(
                    item
                );


            container.appendChild(
                card
            );

        }
    );

}


/* ========================================
Case Preview
======================================== */

function renderCasePreview(items) {

    const track =
        document.querySelector(
            "#case-preview-track"
        );


    if (!track) {

        return;

    }


    track.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        return;

    }


    const previewItems = [];


    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const item =
            items[
                Math.floor(
                    Math.random() *
                    items.length
                )
            ];


        previewItems.push(
            item
        );

    }


    previewItems.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "case-preview-item " +
                getRarityClass(
                    item.rarity
                );


            element.innerHTML = `

                <div
                    class="case-preview-item-image"
                >

                    ${
                        item.image
                            ? `

                                <img
                                    src="${escapeHtml(
                                        item.image
                                    )}"
                                    alt=""
                                    onerror="
                                        this.style.display='none';
                                    "
                                >

                            `
                            : `

                                <div
                                    class="case-item-blur"
                                >

                                    <span>
                                        ${escapeHtml(
                                            item.name ||
                                            "未知物品"
                                        )}
                                    </span>

                                </div>

                            `
                    }

                </div>


                <div
                    class="case-preview-item-name"
                >

                    ${escapeHtml(
                        item.name ||
                        "未知物品"
                    )}

                </div>

            `;


            track.appendChild(
                element
            );

        }
    );

}


/* ========================================
舊版普通模式等待動畫
======================================== */

let caseWaitingAnimationFrame = null;

let caseWaitingX = 0;

let caseWaitingStartTime = 0;

let caseWaitingLastTime = 0;

let caseWaitingActive = false;


/* ========================================
判斷目前是不是 Challenge Mode
======================================== */

function isChallengeCasePage() {

    const challengeData =
        getChallengeDataFromUrl();


    return (
        challengeData.mode ===
            "challenge"
        &&
        !!challengeData.challengeId
    );

}


/* ========================================
開箱等待動畫
========================================

注意：

Challenge Mode
不再使用這個舊版等待動畫。

普通模式
仍然正常使用。

======================================== */

function startCaseWaitingAnimation() {

    /*
     * ====================================
     * Challenge Mode 禁止使用舊 Loading
     * ====================================
     */

    if (
        isChallengeCasePage()
    ) {

        return;

    }


    const track =
        document.querySelector(
            "#case-preview-track"
        );


    const status =
        document.querySelector(
            "#case-preview-status"
        );


    const previewContainer =
        document.querySelector(
            "#case-preview-container"
        );


    if (previewContainer) {

        previewContainer.classList.add(
            "show"
        );

    }


    if (!track) {

        return;

    }


    if (
        caseWaitingAnimationFrame
    ) {

        cancelAnimationFrame(
            caseWaitingAnimationFrame
        );

    }


    caseWaitingX =
        0;


    caseWaitingStartTime =
        performance.now();


    caseWaitingLastTime =
        caseWaitingStartTime;


    caseWaitingActive =
        true;


    document.body.classList.add(
        "case-opening"
    );


    track.style.transition =
        "none";


    track.style.transform =
        "translateX(0px)";


    const sourceItems =
        window.currentCaseItems || [];


    if (
        sourceItems.length === 0
    ) {

        return;

    }


    track.innerHTML = "";


    const waitingItems = [];


    for (
        let i = 0;
        i < 160;
        i++
    ) {

        const item =
            sourceItems[
                Math.floor(
                    Math.random() *
                    sourceItems.length
                )
            ];


        waitingItems.push(
            item
        );

    }


    waitingItems.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "case-preview-item " +
                getRarityClass(
                    item.rarity
                );


            element.innerHTML = `

                <div
                    class="case-preview-item-image"
                >

                    ${
                        item.image
                            ? `

                                <img
                                    src="${escapeHtml(
                                        item.image
                                    )}"
                                    alt=""
                                    onerror="
                                        this.style.display='none';
                                    "
                                >

                            `
                            : `

                                <div
                                    class="case-item-blur"
                                >

                                    <span>
                                        ${escapeHtml(
                                            item.name ||
                                            "未知物品"
                                        )}
                                    </span>

                                </div>

                            `
                    }

                </div>


                <div
                    class="case-preview-item-name"
                >

                    ${escapeHtml(
                        item.name ||
                        "未知物品"
                    )}

                </div>

            `;


            track.appendChild(
                element
            );

        }
    );


    if (status) {

        status.textContent =
            "正在開啟箱子...";

    }


    track.offsetHeight;


    function animateWaiting(
        currentTime
    ) {

        if (
            !caseWaitingActive
        ) {

            return;

        }


        const deltaTime =
            currentTime -
            caseWaitingLastTime;


        caseWaitingLastTime =
            currentTime;


        const speed =
            18000;


        caseWaitingX -=
            speed *
            deltaTime /
            1000;


        const trackWidth =
            track.scrollWidth;


        const viewportWidth =
            track.parentElement
                ? track.parentElement.offsetWidth
                : window.innerWidth;


        const resetPoint =
            trackWidth -
            viewportWidth -
            1500;


        if (
            Math.abs(
                caseWaitingX
            ) >
            resetPoint
        ) {

            const resetDistance =
                trackWidth * 0.75;


            caseWaitingX +=
                resetDistance;

        }


        track.style.transform =
            `translateX(${caseWaitingX}px)`;


        caseWaitingAnimationFrame =
            requestAnimationFrame(
                animateWaiting
            );

    }


    caseWaitingAnimationFrame =
        requestAnimationFrame(
            animateWaiting
        );

}


/* ========================================
正式開箱動畫
======================================== */

function playCasePreviewAnimation(result) {

    return new Promise(
        resolve => {

            const track =
                document.querySelector(
                    "#case-preview-track"
                );


            const status =
                document.querySelector(
                    "#case-preview-status"
                );


            const pointer =
                document.querySelector(
                    ".case-preview-pointer"
                );


            if (!track) {

                resolve();

                return;

            }


            caseWaitingActive =
                false;


            if (
                caseWaitingAnimationFrame
            ) {

                cancelAnimationFrame(
                    caseWaitingAnimationFrame
                );


                caseWaitingAnimationFrame =
                    null;

            }


            const winningItem =
                result.item;


            if (!winningItem) {

                throw new Error(
                    "開箱結果缺少物品資料"
                );

            }


            const currentTransform =
                window.getComputedStyle(
                    track
                ).transform;


            let currentX =
                0;


            if (
                currentTransform &&
                currentTransform !== "none"
            ) {

                const matrix =
                    new DOMMatrix(
                        currentTransform
                    );


                currentX =
                    matrix.m41;

            }


            track.style.transition =
                "none";


            track.style.transform =
                `translateX(${currentX}px)`;


            const sourceItems =
                window.currentCaseItems || [];


            if (
                sourceItems.length === 0
            ) {

                throw new Error(
                    "箱子沒有內容物"
                );

            }


            const animationItems = [];


            for (
                let i = 0;
                i < 24;
                i++
            ) {

                const randomItem =
                    sourceItems[
                        Math.floor(
                            Math.random() *
                            sourceItems.length
                        )
                    ];


                animationItems.push(
                    randomItem
                );

            }


            animationItems.push(
                winningItem
            );


            for (
                let i = 0;
                i < 6;
                i++
            ) {

                const randomItem =
                    sourceItems[
                        Math.floor(
                            Math.random() *
                            sourceItems.length
                        )
                    ];


                animationItems.push(
                    randomItem
                );

            }


            animationItems.forEach(
                item => {

                    const element =
                        document.createElement(
                            "div"
                        );


                    element.className =
                        "case-preview-item " +
                        getRarityClass(
                            item.rarity
                        );


                    element.innerHTML = `

                        <div
                            class="case-preview-item-image"
                        >

                            ${
                                item.image
                                    ? `

                                        <img
                                            src="${escapeHtml(
                                                item.image
                                            )}"
                                            alt=""
                                            onerror="
                                                this.style.display='none';
                                            "
                                        >

                                    `
                                    : `

                                        <div
                                            class="case-item-blur"
                                        >

                                            <span>
                                                ${escapeHtml(
                                                    item.name ||
                                                    "未知物品"
                                                )}
                                            </span>

                                        </div>

                                    `
                            }

                        </div>


                        <div
                            class="case-preview-item-name"
                        >

                            ${escapeHtml(
                                item.name ||
                                "未命名物品"
                            )}

                        </div>

                    `;


                    track.appendChild(
                        element
                    );

                }
            );


            const itemElements =
                track.querySelectorAll(
                    ".case-preview-item"
                );


            const winningIndex =
                itemElements.length - 7;


            const winningElement =
                itemElements[
                    winningIndex
                ];


            if (!winningElement) {

                throw new Error(
                    "無法定位中獎物品"
                );

            }


            const wrapper =
                document.querySelector(
                    ".case-preview-wrapper"
                );


            if (!wrapper) {

                throw new Error(
                    "找不到開箱預覽區"
                );

            }


            const wrapperWidth =
                wrapper.offsetWidth;


            const itemWidth =
                winningElement.offsetWidth;


            const itemLeft =
                winningElement.offsetLeft;


            const itemCenter =
                itemLeft +
                itemWidth / 2;


            const targetX =
                (
                    wrapperWidth / 2
                ) -
                itemCenter;


            const startX =
                currentX;


            const distance =
                targetX -
                startX;


            const animationDuration =
                3500;


            console.log(
                "🔥 正式動畫開始 X：",
                Math.round(
                    startX
                )
            );


            console.log(
                "🔥 正式動畫目標 X：",
                Math.round(
                    targetX
                )
            );


            console.log(
                "🔥 正式動畫距離：",
                Math.round(
                    Math.abs(
                        distance
                    )
                ),
                "px"
            );


            console.log(
                "🔥 正式動畫時間：",
                animationDuration,
                "ms"
            );


            console.log(
                "🔥 正式動畫平均速度：",
                Math.round(
                    Math.abs(
                        distance
                    ) /
                    (
                        animationDuration /
                        1000
                    )
                ),
                "px/s"
            );


            if (status) {

                status.textContent =
                    "正在開啟箱子...";

            }


            let lastX =
                startX;


            let lastTime =
                performance.now();


            let maxSpeed =
                0;


            let speedMonitorFrame =
                null;


            const animationStartTime =
                performance.now();


            function measureSpeed(
                now
            ) {

                const transform =
                    window.getComputedStyle(
                        track
                    ).transform;


                if (
                    transform &&
                    transform !== "none"
                ) {

                    const matrix =
                        new DOMMatrix(
                            transform
                        );


                    const currentX =
                        matrix.m41;


                    const deltaTime =
                        now -
                        lastTime;


                    if (
                        deltaTime > 0
                    ) {

                        const currentSpeed =
                            Math.abs(
                                currentX -
                                lastX
                            ) /
                            (
                                deltaTime /
                                1000
                            );


                        maxSpeed =
                            Math.max(
                                maxSpeed,
                                currentSpeed
                            );

                    }


                    lastX =
                        currentX;


                    lastTime =
                        now;

                }


                if (
                    now -
                    animationStartTime <
                    animationDuration
                ) {

                    speedMonitorFrame =
                        requestAnimationFrame(
                            measureSpeed
                        );

                }
                else {

                    console.log(
                        "🔥🔥 正式動畫最高速度：",
                        Math.round(
                            maxSpeed
                        ),
                        "px/s"
                    );

                }

            }


            requestAnimationFrame(
                () => {

                    track.style.transition =
                        `
                            transform
                            ${animationDuration}ms
                            cubic-bezier(
                                0.08,
                                0.72,
                                0.18,
                                1
                            )
                        `;


                    track.style.transform =
                        `translateX(${targetX}px)`;


                    speedMonitorFrame =
                        requestAnimationFrame(
                            measureSpeed
                        );

                }
            );


            setTimeout(
                () => {

                    if (
                        speedMonitorFrame
                    ) {

                        cancelAnimationFrame(
                            speedMonitorFrame
                        );


                        speedMonitorFrame =
                            null;

                    }


                    winningElement.classList.add(
                        "winning-item"
                    );


                    if (status) {

                        status.textContent =
                            `你獲得了 ${winningItem.name}`;

                    }


                    if (pointer) {

                        pointer.classList.add(
                            "winning"
                        );

                    }


                    resolve();

                },
                animationDuration
            );

        }
    );

}


/* ========================================
初始化開箱按鈕
======================================== */

function initializeOpenCaseButton() {

    const button =
        document.querySelector(
            "#open-case-button"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        async () => {

            if (
                button.disabled
            ) {

                return;

            }


            const caseId =
                getCaseIdFromUrl();


            if (!caseId) {

                alert(
                    "缺少箱子 ID"
                );

                return;

            }


            const sessionToken =
                getSessionToken();


            if (!sessionToken) {

                window.location.href =
                    "login.html";

                return;

            }


            const challengeData =
                getChallengeDataFromUrl();


            const isChallenge =
                challengeData.mode ===
                    "challenge"
                &&
                !!challengeData.challengeId;


            try {

                button.disabled =
                    true;


                button.textContent =
                    "開箱中...";


                window.ELOCaseOpening =
                    true;


                let apiPromise;


                /*
                 * ====================================
                 * Challenge Mode
                 * ====================================
                 */

                if (
                    isChallenge
                ) {

                    if (
                        !challengeData.challengeId
                    ) {

                        throw new Error(
                            "缺少 Challenge ID"
                        );

                    }


                    apiPromise =
                        openChallengeCase(
                            {
                                sessionToken,

                                challengeId:
                                    challengeData.challengeId,

                                caseId

                            }
                        );

                }
                else {

                    /*
                     * ====================================
                     * 普通模式
                     * ====================================
                     */

                    apiPromise =
                        openCase(
                            caseId
                        );

                }


                /*
                 * ====================================
                 * Intro
                 *
                 * Challenge / 普通模式都保留
                 * ====================================
                 */

                await playCaseOpeningIntro();


                /*
                 * ====================================
                 * API 結果
                 * ====================================
                 */

                const result =
                    await apiPromise;


                /*
                 * ====================================
                 * 更新餘額
                 * ====================================
                 */

                if (
                    isChallenge
                ) {
                
                    /*
                     * ====================================
                     * Challenge Mode
                     *
                     * openChallengeCase() 已經在 GAS
                     * 完成以下操作：
                     *
                     * 1. 扣除 Challenge EC
                     * 2. 新增 ChallengeInventory
                     * 3. 更新 ChallengePlayers.finalValue
                     *
                     * 因此前端不再重複呼叫
                     * addChallengeItem()
                     *
                     * 避免：
                     * - 未知 API
                     * - 重複新增物品
                     * - finalValue 重複計算
                     * ====================================
                     */
                
                    updateChallengeBalance(
                        result.remainingEC
                    );
                
                }
                else {
                
                    updateBalance(
                        result.remainingEloCoin
                    );
                
                
                    const savedUser =
                        getSavedUser();
                
                
                    if (
                        savedUser
                    ) {
                
                        savedUser.eloCoin =
                            result.remainingEloCoin;
                
                
                        localStorage.setItem(
                            "elocaseUser",
                            JSON.stringify(
                                savedUser
                            )
                        );
                
                    }
                
                }
                else {

                    updateBalance(
                        result.remainingEloCoin
                    );


                    const savedUser =
                        getSavedUser();


                    if (
                        savedUser
                    ) {

                        savedUser.eloCoin =
                            result.remainingEloCoin;


                        localStorage.setItem(
                            "elocaseUser",
                            JSON.stringify(
                                savedUser
                            )
                        );

                    }

                }


                /*
                 * ====================================
                 * 普通模式才儲存開箱紀錄
                 * ====================================
                 */

                if (
                    !isChallenge
                ) {

                    await saveOpenHistory(
                        result
                    );

                }


                /*
                 * ====================================
                 * 正式動畫
                 *
                 * Challenge Mode
                 * 也直接進正式動畫。
                 *
                 * 不使用舊橘色等待條。
                 * ====================================
                 */

                await playCasePreviewAnimation(
                    result
                );


                /*
                 * ====================================
                 * Challenge 完成後
                 * ====================================
                 */

                if (
                    isChallenge
                ) {

                    setTimeout(
                        () => {

                            createReturnChallengeButton(
                                challengeData.challengeId
                            );

                        },
                        4000
                    );

                }


            }
            catch (error) {

                console.error(
                    "開箱失敗：",
                    error
                );


                caseWaitingActive =
                    false;


                if (
                    caseWaitingAnimationFrame
                ) {

                    cancelAnimationFrame(
                        caseWaitingAnimationFrame
                    );


                    caseWaitingAnimationFrame =
                        null;

                }


                const track =
                    document.querySelector(
                        "#case-preview-track"
                    );


                if (track) {

                    track.style.transition =
                        "none";

                }


                alert(
                    error.message ||
                    "開箱失敗"
                );

            }
            finally {

                window.ELOCaseOpening =
                    false;


                document.body.classList.remove(
                    "case-opening"
                );


                button.disabled =
                    false;


                button.textContent =
                    "開啟箱子";

            }

        }
    );

}


/* ========================================
載入箱子
======================================== */

async function initializeCasePage() {

    const caseId =
        getCaseIdFromUrl();


    const caseName =
        document.querySelector(
            "#case-name"
        );


    const caseItems =
        document.querySelector(
            "#case-items"
        );


    if (!caseId) {

        if (caseName) {

            caseName.textContent =
                "找不到箱子";

        }


        if (caseItems) {

            caseItems.innerHTML = `

                <div class="case-items-loading">

                    缺少箱子 ID。

                </div>

            `;

        }


        return;

    }


    try {

        const caseData =
            await getCase(
                caseId
            );


        if (!caseData) {

            throw new Error(
                "找不到這個箱子"
            );

        }


        /*
         * 初始化 Challenge Case 快取
         */

        window.currentChallengeCaseData =
            caseData;


        renderCaseImage(
            caseData
        );


        renderCaseInfo(
            caseData
        );


        const items =
            await getCaseItems(
                caseId
            );


        window.lastChallengeCaseItemsData =
            JSON.stringify(
                items || []
            );


        renderCaseItems(
            items
        );


        /*
         * ====================================
         * Challenge Mode
         * ====================================
         *
         * 啟動背景同步。
         *
         * 不啟動任何舊 Loading。
         * ====================================
         */

        startChallengeCaseRefresh();

    }
    catch (error) {

        console.error(
            "箱子資料載入失敗：",
            error
        );


        if (caseName) {

            caseName.textContent =
                "箱子載入失敗";

        }


        if (caseItems) {

            caseItems.innerHTML = `

                <div class="case-items-loading">

                    ${escapeHtml(
                        error.message ||
                        "無法載入箱子資料"
                    )}

                </div>

            `;

        }

    }

}


/* ========================================
HTML 防護
======================================== */

function escapeHtml(value) {

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
初始化
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initCaseBack();

        initializeCasePage();

        initializeOpenCaseButton();

    }
);


/* ========================================
開箱 Intro
======================================== */

function playCaseOpeningIntro() {

    return new Promise(
        resolve => {

            const animation =
                document.querySelector(
                    "#case-opening-animation"
                );


            if (!animation) {

                resolve();

                return;

            }


            animation.className =
                "case-opening-animation";


            requestAnimationFrame(
                () => {

                    animation.classList.add(
                        "active"
                    );

                }
            );


            setTimeout(
                () => {

                    animation.classList.add(
                        "key-fly"
                    );

                },
                200
            );


            setTimeout(
                () => {

                    animation.classList.add(
                        "key-lock"
                    );

                },
                1150
            );


            setTimeout(
                () => {

                    animation.classList.add(
                        "light-burst"
                    );

                },
                2150
            );


            setTimeout(
                () => {

                    animation.classList.add(
                        "light-cover"
                    );

                },
                2450
            );


            /*
             * ====================================
             * ⭐ 這裡是本次最重要的修改
             * ====================================
             *
             * 以前：
             *
             * 2450ms
             * ↓
             * startCaseWaitingAnimation()
             *
             * 現在：
             *
             * Challenge Mode
             * ↓
             * 不啟動舊橘色 Loading
             *
             * 普通模式
             * ↓
             * 照舊啟動
             * ====================================
             */

            setTimeout(
                () => {

                    if (
                        !isChallengeCasePage()
                    ) {

                        startCaseWaitingAnimation();

                    }

                },
                2450
            );


            setTimeout(
                () => {

                    animation.classList.remove(
                        "active"
                    );


                    animation.className =
                        "case-opening-animation";


                    resolve();

                },
                2900
            );

        }
    );

}


/* ========================================
返回箱子列表
======================================== */

function initCaseBack() {

    const button =
        document.querySelector(
            "#case-back"
        );


    if (!button) {

        return;

    }


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


    if (
        mode === "challenge" &&
        challengeId
    ) {

        button.href =
            "cases.html?mode=challenge&challengeId="
            +
            challengeId;

    }
    else {

        button.href =
            "cases.html";

    }

}


/* ========================================
建立回到 Challenge 按鈕
======================================== */

function createReturnChallengeButton(
    challengeId
) {

    const container =
        document.querySelector(
            ".case-hero-actions"
        );


    if (!container) {

        return;

    }


    if (
        container.querySelector(
            ".return-challenge-button"
        )
    ) {

        return;

    }


    const button =
        document.createElement(
            "a"
        );


    button.href =
        "challenge-room.html?id="
        +
        challengeId;


    button.className =
        "button button-secondary return-challenge-button";


    button.textContent =
        "回到挑戰房間";


    container.appendChild(
        button
    );

}


/* ========================================
更新 Challenge EC
======================================== */

function updateChallengeBalance(ec) {

    const balanceElement =
        document.querySelector(
            ".balance-value"
        );


    if (!balanceElement) {

        return;

    }


    balanceElement.textContent =
        Number(
            ec || 0
        ).toLocaleString();

}


/* ========================================
Challenge 新增物品
======================================== */

async function addChallengeItem(data) {

    try {

        const response =
            await sendChallengePost(
                {
                    action:
                        "addChallengeItem",

                    challengeId:
                        data.challengeId,

                    sessionToken:
                        getSessionToken(),

                    item:
                        data.item

                }
            );


        return response;

    }
    catch (error) {

        console.error(
            "新增 Challenge 物品失敗",
            error
        );


        throw error;

    }

}


/* ========================================
Challenge Case 即時更新
======================================== */

let challengeCaseRefreshTimer =
    null;


/*
 * ⭐ 新增：
 * 防止背景更新重疊
 */

let challengeCaseRefreshRunning =
    false;


/* ========================================
啟動 Challenge Case 背景更新
======================================== */

function startChallengeCaseRefresh() {

    const challengeData =
        getChallengeDataFromUrl();


    if (
        challengeData.mode !==
            "challenge"
        ||
        !challengeData.challengeId
    ) {

        return;

    }


    if (
        challengeCaseRefreshTimer
    ) {

        clearInterval(
            challengeCaseRefreshTimer
        );

    }


    /*
     * 立即更新一次
     */

    refreshChallengeCase();


    /*
     * 每 3 秒背景更新
     */

    challengeCaseRefreshTimer =
        setInterval(
            refreshChallengeCase,
            3000
        );

}


/* ========================================
Challenge Case 背景更新
======================================== */

async function refreshChallengeCase() {

    /*
     * ====================================
     * 正在開箱
     *
     * 不更新
     * ====================================
     */

    if (
        window.ELOCaseOpening
    ) {

        return;

    }


    /*
     * ====================================
     * ⭐ 防止 API 重疊
     * ====================================
     */

    if (
        challengeCaseRefreshRunning
    ) {

        return;

    }


    const challengeData =
        getChallengeDataFromUrl();


    if (
        challengeData.mode !==
            "challenge"
        ||
        !challengeData.challengeId
    ) {

        return;

    }


    const caseId =
        getCaseIdFromUrl();


    if (!caseId) {

        return;

    }


    challengeCaseRefreshRunning =
        true;


    try {

        /*
         * ====================================
         * Challenge 最新資料
         *
         * 明確要求：
         * 不顯示 Loading
         * ====================================
         */

        const challengeResult =
            await getChallenge(
                challengeData.challengeId,
                {
                    noLoading: true
                }
            );


        if (
            challengeResult &&
            challengeResult.players
        ) {

            updateChallengeCasePlayers(
                challengeResult.players
            );

        }


        /*
         * ====================================
         * Case 最新資料
         *
         * 背景更新不應該重新觸發
         * Challenge Loading
         * ====================================
         */

        const caseData =
            await getCase(
                caseId,
                {
                    noLoading: true
                }
            );


        if (caseData) {

            const oldCaseData =
                JSON.stringify(
                    window.currentChallengeCaseData ||
                    null
                );


            const newCaseData =
                JSON.stringify(
                    caseData
                );


            if (
                oldCaseData !==
                newCaseData
            ) {

                window.currentChallengeCaseData =
                    caseData;


                renderCaseImage(
                    caseData
                );


                renderCaseInfo(
                    caseData
                );

            }

        }


        /*
         * ====================================
         * 最新內容物
         * ====================================
         */

        const items =
            await getCaseItems(
                caseId,
                {
                    noLoading: true
                }
            );


        updateChallengeCaseItems(
            items
        );

    }
    catch (error) {

        console.error(
            "Challenge Case 背景更新失敗：",
            error
        );

    }
    finally {

        challengeCaseRefreshRunning =
            false;

    }

}


/* ========================================
Challenge Case
只更新內容物卡片
不重建 Preview
======================================== */

function updateChallengeCaseItems(
    items
) {

    const newData =
        JSON.stringify(
            items || []
        );


    /*
     * ====================================
     * 資料完全沒變
     * ====================================
     */

    if (
        window.lastChallengeCaseItemsData ===
        newData
    ) {

        return;

    }


    window.lastChallengeCaseItemsData =
        newData;


    window.currentCaseItems =
        items || [];


    const container =
        document.querySelector(
            "#case-items"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        !items ||
        items.length === 0
    ) {

        container.innerHTML = `

            <div class="case-items-loading">

                這個箱子目前沒有內容物。

            </div>

        `;

        return;

    }


    items.forEach(
        item => {

            const card =
                createCaseItemCard(
                    item
                );


            container.appendChild(
                card
            );

        }
    );

}


/* ========================================
Challenge Case
更新右上角 Navbar 雙方即時資料
======================================== */

function updateChallengeCasePlayers(
    players
) {

    if (
        !Array.isArray(
            players
        ) ||
        players.length === 0
    ) {

        console.log(
            "⚠️ Challenge 沒有 players 資料"
        );

        return;

    }


    const sessionUser =
        getSavedUser();


    if (!sessionUser) {

        console.log(
            "⚠️ 找不到目前登入玩家"
        );

        return;

    }


    const myUserId =
        String(
            sessionUser.userId ??
            sessionUser.id ??
            sessionUser.uid ??
            ""
        );


    const myPlayer =
        players.find(
            player => {

                const playerUserId =
                    String(
                        player.userId ??
                        player.id ??
                        player.uid ??
                        ""
                    );


                return (
                    playerUserId ===
                    myUserId
                );

            }
        );


    const opponentPlayer =
        players.find(
            player => {

                const playerUserId =
                    String(
                        player.userId ??
                        player.id ??
                        player.uid ??
                        ""
                    );


                return (
                    playerUserId !==
                    myUserId
                );

            }
        );


    /*
     * ====================================
     * 我的 EC
     * ====================================
     */

    if (myPlayer) {

        const myCoin =
            document.querySelector(
                "#navbar-my-coin"
            );


        if (myCoin) {

            myCoin.textContent =
                Number(
                    myPlayer.challengeEC ??
                    0
                ).toLocaleString();

        }


        /*
         * ====================================
         * 我的物品總價值
         * ====================================
         */

        const myValue =
            document.querySelector(
                "#navbar-my-value"
            );


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


        if (myValue) {

            myValue.textContent =
                Number(
                    myItemValue
                ).toLocaleString();

        }

    }


    /*
     * ====================================
     * 對手資料
     * ====================================
     */

    if (opponentPlayer) {

        const opponentCoin =
            document.querySelector(
                "#navbar-opponent-coin"
            );


        if (opponentCoin) {

            opponentCoin.textContent =
                Number(
                    opponentPlayer.challengeEC ??
                    0
                ).toLocaleString();

        }


        const opponentValue =
            document.querySelector(
                "#navbar-opponent-value"
            );


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


        if (opponentValue) {

            opponentValue.textContent =
                Number(
                    opponentItemValue
                ).toLocaleString();

        }

    }

}
