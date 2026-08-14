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
   稀有度 CSS
======================================== */

function getRarityClass(rarity) {

    const value =
        String(
            rarity || ""
        )
        .trim()
        .toLowerCase();


    switch (value) {

        case "blue":
        case "藍色":
        case "consumer":
        case "消費級":

            return "rarity-blue";


        case "purple":
        case "紫色":
        case "industrial":
        case "工業級":

            return "rarity-purple";


        case "pink":
        case "粉色":
        case "mil-spec":
        case "受限":

            return "rarity-pink";


        case "red":
        case "紅色":
        case "classified":
        case "保密":

            return "rarity-red";


        default:

            return "";

    }

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
        "case-item-card";


    const rarityClass =
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

        </div>


        <div class="case-item-info">

            <div
                class="
                    case-item-rarity
                    ${rarityClass}
                "
            >

            <span class="case-item-probability">
                ${Number(item.probability || 0).toFixed(2)}%
            </span>

                ${escapeHtml(
                    item.rarity ||
                    "未知"
                )}

            </div>


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


    /*
     * 圖片載入失敗
     */

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


    /*
     * 建立預覽物品
     */

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


    /*
     * 建立畫面上的卡片
     */

    previewItems.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "case-preview-item";


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

let caseWaitingAnimationFrame = null;

let caseWaitingX = 0;

let caseWaitingStartTime = 0;

let caseWaitingLastTime = 0;

let caseWaitingActive = false;

/* ========================================
   開箱等待動畫
   快 → 快 → 慢 → 超慢
   API 回來前持續運作
======================================== */

function startCaseWaitingAnimation() {

    const track =
       document.querySelector(
           "#case-preview-track"
       );
   
   const status =
       document.querySelector(
           "#case-preview-status"
       );
   
   
   /*
    * ====================================
    * ⭐ 顯示現有跑馬滑動條
    *
    * Intro 結束後才會執行這裡
    * ====================================
    */
   
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


    /*
     * ====================================
     * 停止上一個等待動畫
     * ====================================
     */

    if (
        caseWaitingAnimationFrame
    ) {

        cancelAnimationFrame(
            caseWaitingAnimationFrame
        );

    }


    /*
     * ====================================
     * 初始化
     * ====================================
     */

    caseWaitingX = 0;


    caseWaitingStartTime =
        performance.now();


    caseWaitingLastTime =
        caseWaitingStartTime;


    caseWaitingActive =
        true;


    document.body.classList.add(
        "case-opening"
    );


    /*
     * ====================================
     * 清除 CSS 動畫
     * ====================================
     */

    track.style.transition =
        "none";


    track.style.transform =
        "translateX(0px)";


    /*
     * ====================================
     * 取得內容物
     * ====================================
     */

    const sourceItems =
        window.currentCaseItems || [];


    if (
        sourceItems.length === 0
    ) {

        return;

    }


    /*
     * ====================================
     * 建立等待用物品
     *
     * 160 個
     * ====================================
     */

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


    /*
     * ====================================
     * 建立卡片
     * ====================================
     */

    waitingItems.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "case-preview-item";


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


    /*
     * ====================================
     * 狀態
     * ====================================
     */

    if (status) {

        status.textContent =
            "正在開啟箱子...";

    }


    /*
     * 強制瀏覽器完成排版
     */

    track.offsetHeight;


    /*
     * ====================================
     * 等待動畫
     *
     * 核心：
     *
     * 快
     * ↓
     * 快
     * ↓
     * 慢
     * ↓
     * 超慢
     *
     * 不會突然重新加速
     * ====================================
     */

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


         /*
          * ====================================
          * 等待 API 時保持超高速
          *
          * API 沒回來：
          * 永遠保持高速
          *
          * API 回來：
          * caseWaitingActive 會變成 false
          * 然後由正式動畫接管
          * ====================================
          */
         
         const speed =
            18000;


        /*
         * ====================================
         * 移動
         * ====================================
         */

        caseWaitingX -=
            speed *
            deltaTime /
            1000;


        /*
         * ====================================
         * 無限循環
         *
         * 使用「完整卡片區段」
         * 來避免突然跳動
         * ====================================
         */

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
            Math.abs(caseWaitingX) >
            resetPoint
        ) {

            /*
             * 不再一次跳 45%
             *
             * 改成只補一小段
             */

            const resetDistance =
                trackWidth * 0.75;
            
            caseWaitingX +=
                resetDistance;

        }


        /*
         * ====================================
         * 套用位置
         * ====================================
         */

        track.style.transform =
            `translateX(${caseWaitingX}px)`;


        /*
         * ====================================
         * 下一幀
         * ====================================
         */

        caseWaitingAnimationFrame =
            requestAnimationFrame(
                animateWaiting
            );

    }


    /*
     * ====================================
     * 開始
     * ====================================
     */

    caseWaitingAnimationFrame =
        requestAnimationFrame(
            animateWaiting
        );

}

/* ========================================
   正式開箱動畫
   API 回來後接管目前位置
======================================== */

function playCasePreviewAnimation(
    result
) {

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
        return;
    }


    /*
     * ====================================
     * 停止等待動畫
     * ====================================
     */

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


    /*
     * ====================================
     * 中獎物品
     * ====================================
     */

    const winningItem =
        result.item;


    if (!winningItem) {

        throw new Error(
            "開箱結果缺少物品資料"
        );

    }


    /*
     * ====================================
     * 取得目前視覺位置
     * ====================================
     */

    const currentTransform =
        window.getComputedStyle(
            track
        ).transform;


    let currentX = 0;


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


    /*
     * ====================================
     * 固定目前位置
     * ====================================
     */

    track.style.transition =
        "none";


    track.style.transform =
        `translateX(${currentX}px)`;


    /*
     * ====================================
     * 取得箱子內容物
     * ====================================
     */

    const sourceItems =
        window.currentCaseItems || [];


    if (
        sourceItems.length === 0
    ) {

        throw new Error(
            "箱子沒有內容物"
        );

    }


    /*
     * ====================================
     * 建立正式動畫物品
     *
     * 前面：
     * 24 個隨機物品
     *
     * 中間：
     * 真正中獎物品
     *
     * 後面：
     * 6 個隨機物品
     * ====================================
     */

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


    /*
     * ====================================
     * 建立正式動畫卡片
     * ====================================
     */

    animationItems.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "case-preview-item";


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


    /*
     * ====================================
     * 找到中獎物品
     * ====================================
     */

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


    /*
     * ====================================
     * 計算目標位置
     * ====================================
     */

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


    /*
     * ====================================
     * 起點
     * ====================================
     */

    const startX =
        currentX;


    /*
     * ====================================
     * 剩餘距離
     *
     * ⚠️ 一定要先宣告 distance
     * 再使用它
     * ====================================
     */

    const distance =
        targetX -
        startX;


    /*
     * ====================================
     * 正式動畫時間
     * ====================================
     */

    const animationDuration =
       3500;


    /*
     * ====================================
     * Debug：動畫基本資料
     * ====================================
     */

    console.log(
        "🔥 正式動畫開始 X：",
        Math.round(startX)
    );


    console.log(
        "🔥 正式動畫目標 X：",
        Math.round(targetX)
    );


    console.log(
        "🔥 正式動畫距離：",
        Math.round(
            Math.abs(distance)
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
            Math.abs(distance) /
            (animationDuration / 1000)
        ),
        "px/s"
    );


    /*
     * ====================================
     * 狀態文字
     * ====================================
     */

    if (status) {

        status.textContent =
            "正在開啟箱子...";

    }


    /*
     * ====================================
     * 最高速度監測
     *
     * 只用來 Debug
     * 不會影響動畫
     * ====================================
     */

    let lastX =
        startX;

    let lastTime =
        performance.now();

    let maxSpeed =
        0;

    let speedMonitorFrame =
        null;


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

        } else {

            console.log(
                "🔥🔥 正式動畫最高速度：",
                Math.round(
                    maxSpeed
                ),
                "px/s"
            );

        }

    }


    /*
     * ====================================
     * 動畫開始時間
     * ====================================
     */

    const animationStartTime =
        performance.now();


    /*
     * ====================================
     * 啟動正式動畫
     * ====================================
     */

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


            /*
             * 開始測速
             */

            speedMonitorFrame =
                requestAnimationFrame(
                    measureSpeed
                );

        }
    );


    /*
     * ====================================
     * 動畫完成
     * ====================================
     */

    setTimeout(
        () => {

            /*
             * 停止測速
             */

            if (
                speedMonitorFrame
            ) {

                cancelAnimationFrame(
                    speedMonitorFrame
                );

                speedMonitorFrame =
                    null;

            }


            /*
             * 中獎效果
             */

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

        },
        animationDuration
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

            /*
             * ====================================
             * 防止連點
             * ====================================
             */

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


            /*
             * ====================================
             * 確認登入
             * ====================================
             */

            const sessionToken =
                getSessionToken();


            if (!sessionToken) {

                window.location.href =
                    "login.html";

                return;

            }


            try {

                /*
                 * ====================================
                 * 鎖定按鈕
                 * ====================================
                 */

                button.disabled =
                    true;


                button.textContent =
                    "開箱中...";


                window.ELOCaseOpening =
                    true;


                /*
                 * ====================================
                 * ⭐ API 立即開始
                 *
                 * 不等待開箱動畫。
                 *
                 * 鑰匙動畫播放的同時，
                 * Google Apps Script 已經開始處理。
                 * ====================================
                 */

                const apiPromise =
                    openCase(
                        caseId
                    );


                /*
                 * ====================================
                 * ⭐ 播放開箱 Intro
                 *
                 * API 與動畫並行。
                 * ====================================
                 */

                await playCaseOpeningIntro();


                /*
                * ====================================
                * ⭐ Intro 完成
                *
                * 鑰匙 → 黃光 → 箱子
                * 已經播放完畢
                *
                * 現在才讓現有滑動條出現
                * ====================================
                */
               
               
               /*
                * ====================================
                * ⭐ 等待 API
                *
                * 滑動條已經在畫面上高速運轉
                * API 回來後再交給正式動畫
                * ====================================
                */
               
               const result =
                   await apiPromise;


                /*
                 * ====================================
                 * 更新玩家餘額
                 * ====================================
                 */

                updateBalance(
                    result.remainingEloCoin
                );


                /*
                 * ====================================
                 * 更新 LocalStorage
                 * ====================================
                 */

                const savedUser =
                    getSavedUser();


                if (savedUser) {

                    savedUser.eloCoin =
                        result.remainingEloCoin;


                    localStorage.setItem(
                        "elocaseUser",
                        JSON.stringify(
                            savedUser
                        )
                    );

                }


                /*
                 * ====================================
                 * ⭐ API 成功
                 *
                 * 如果滑動條已經開始：
                 *
                 *     高速等待
                 *          ↓
                 *     正式減速動畫
                 *
                 * 如果 API 在 Intro 期間
                 * 就完成：
                 *
                 *     Intro
                 *       ↓
                 *     直接正式動畫
                 * ====================================
                 */

                playCasePreviewAnimation(
                    result
                );


            } catch (error) {

                console.error(
                    "開箱失敗：",
                    error
                );


                /*
                 * ====================================
                 * 停止等待動畫
                 * ====================================
                 */

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


                /*
                 * ====================================
                 * 停止滑動條 Transition
                 * ====================================
                 */

                const track =
                    document.querySelector(
                        "#case-preview-track"
                    );


                if (track) {

                    track.style.transition =
                        "none";

                }


                /*
                 * ====================================
                 * 顯示錯誤
                 * ====================================
                 */

                alert(
                    error.message ||
                    "開箱失敗"
                );


            } finally {

                /*
                 * ====================================
                 * 結束開箱狀態
                 * ====================================
                 */

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

        /*
         * 取得箱子
         */

        const caseData =
            await getCase(
                caseId
            );


        if (!caseData) {

            throw new Error(
                "找不到這個箱子"
            );

        }


        renderCaseImage(
            caseData
        );


        renderCaseInfo(
            caseData
        );


        /*
         * 取得內容物
         */

        const items =
            await getCaseItems(
                caseId
            );


        renderCaseItems(
            items
        );


    } catch (error) {

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

        initializeCasePage();

        initializeOpenCaseButton();

    }
);

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


            /*
             * ====================================
             * 重置動畫
             * ====================================
             */

            animation.className =
                "case-opening-animation";


            /*
             * ====================================
             * 顯示動畫
             * ====================================
             */

            requestAnimationFrame(
                () => {

                    animation.classList.add(
                        "active"
                    );

                }
            );


            /*
             * ====================================
             * 0.2 秒
             *
             * 鑰匙開始飛入
             * ====================================
             */

            setTimeout(
                () => {

                    animation.classList.add(
                        "key-fly"
                    );

                },
                200
            );


            /*
             * ====================================
             * 1.15 秒
             *
             * 鑰匙抵達鎖孔
             * ====================================
             */

            setTimeout(
                () => {

                    animation.classList.add(
                        "key-lock"
                    );

                },
                1150
            );

            /*
             * ====================================
             * 2.15 秒
             *
             * 黃光開始爆發
             * ====================================
             */

            setTimeout(
                () => {

                    animation.classList.add(
                        "light-burst"
                    );

                },
                2150
            );


            /*
             * ====================================
             * 2.45 秒
             *
             * 黃光覆蓋箱子
             * ====================================
             */

            setTimeout(
                () => {

                    animation.classList.add(
                        "light-cover"
                    );

                },
                2450
            );

           setTimeout(
             () => {
         
                 startCaseWaitingAnimation();
         
             },
             2450
         );


            /*
             * ====================================
             * 2.9 秒
             *
             * Intro 完成
             *
             * 接下來交給現在的滑動條
             * ====================================
             */

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
