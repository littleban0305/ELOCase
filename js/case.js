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
   連續速度：
   快 → 快 → 慢 → 持續慢速
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
     * 清除 CSS transition
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


    track.innerHTML = "";


    /*
     * ====================================
     * 建立大量物品
     * ====================================
     */

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


    track.offsetHeight;


    /*
     * ====================================
     * 連續速度動畫
     *
     * 不使用 CSS transition
     *
     * 速度會自然下降
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


        const elapsed =
            currentTime -
            caseWaitingStartTime;


        /*
         * ====================================
         * 速度
         *
         * 單位：
         * px / 秒
         * ====================================
         */

        let speed;


        if (
            elapsed < 2200
        ) {

            /*
             * 第一階段：
             * 超快
             */

            speed =
                1050;

        } else if (
            elapsed < 4200
        ) {

            /*
             * 第二階段：
             * 還是快
             */

            speed =
                850;

        } else if (
            elapsed < 6500
        ) {

            /*
             * 第三階段：
             * 開始慢
             */

            speed =
                560;

        } else {

            /*
             * 最後：
             * 持續慢速
             *
             * API 沒回來就一直跑
             */

            speed =
                180;

        }


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
         * 避免跑到最右邊停住
         * ====================================
         */

        const trackWidth =
            track.scrollWidth;

        const viewportWidth =
            track.parentElement
                ? track.parentElement
                    .offsetWidth
                : window.innerWidth;


        /*
         * 已經接近尾端
         *
         * 把軌道瞬間往前補一段
         * 使用者看不到跳動
         */

        if (
            Math.abs(caseWaitingX) >
            trackWidth -
            viewportWidth -
            1200
        ) {

            const resetDistance =
                trackWidth * 0.45;


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
   
   caseWaitingActive = false;
   
   
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


    /*
     * ====================================
     * 取得目前等待動畫的位置
     * ====================================
     *
     * 這裡非常重要：
     * 不再回到 0
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
     * 取消等待動畫
     * ====================================
     */

    track.style.transition =
        "none";


    /*
     * 把目前視覺位置固定住
     *
     * 避免切換 transition 時跳動
     */

    track.style.transform =
        `translateX(${currentX}px)`;


    /*
     * ====================================
     * 建立正式動畫物品
     * ====================================
     *
     * 注意：
     * 不再直接把整條軌道清掉。
     *
     * 我們保留等待動畫的畫面，
     * 在後面接上正式物品。
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
     * 建立真正的中獎區
     * ====================================
     */

    const animationItems = [];


    /*
     * 前面放 24 個隨機物品
     */

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


    /*
     * 真正中獎物品
     */

    animationItems.push(
        winningItem
    );


    /*
     * 後面再放 6 個
     */

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
     * 找到中獎物品
     * ====================================
     */

    const itemElements =
        track.querySelectorAll(
            ".case-preview-item"
        );


    /*
     * 等待動畫原本有很多物品
     *
     * 所以正式動畫放在最後面。
     *
     * 找最後 31 個：
     *
     * [24 隨機]
     * [1 中獎]
     * [6 隨機]
     */

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
     * 計算畫面中央位置
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


    /*
     * 目標位置
     */

    const targetX =
        (
            wrapperWidth / 2
        ) -
        itemCenter;


    /*
     * ====================================
     * 目前位置
     * ====================================
     */

    const startX =
        currentX;


    /*
     * ====================================
     * 計算剩餘距離
     * ====================================
     */

    const distance =
        targetX -
        startX;


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
     * 正式減速
     *
     * 從「目前位置」
     * 接到中獎物品
     *
     * 不重新開始
     * ====================================
     */

    const animationDuration =
        5200;


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

        }
    );


    /*
     * ====================================
     * 動畫完成
     * ====================================
     */

    setTimeout(
        () => {

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


                /*
                 * ====================================
                 * 立刻開始等待動畫
                 * ====================================
                 */
                window.ELOCaseOpening = true;
               
                startCaseWaitingAnimation();


                /*
                 * ====================================
                 * API 在背景處理
                 *
                 * 可以 1 秒
                 * 可以 10 秒
                 * 可以 20 秒
                 *
                 * 動畫都不會停
                 * ====================================
                 */

                const result =
                    await openCase(
                        caseId
                    );


                /*
                 * ====================================
                 * 更新餘額
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
                 * API 成功
                 *
                 * 等待動畫 → 正式減速動畫
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
                 * API 失敗
                 */

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


            } finally {

                /*
                 * ====================================
                 * 結束開箱狀態
                 * ====================================
                 */

                window.ELOCaseOpening = false;
               
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
