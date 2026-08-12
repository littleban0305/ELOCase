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

/* ========================================
   開箱等待動畫
   API 回來前持續滾動
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
     * 開箱狀態
     * ====================================
     */

    document.body.classList.add(
        "case-opening"
    );


    /*
     * 清除舊動畫
     */

    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0px)";


    /*
     * 取得內容物
     */

    const sourceItems =
        window.currentCaseItems || [];


    if (
        sourceItems.length === 0
    ) {

        return;

    }


    /*
     * 清空預覽
     */

    track.innerHTML = "";


    /*
     * ====================================
     * 建立大量等待物品
     *
     * 數量故意很多
     * API 就算 20 秒也不會滾完
     * ====================================
     */

    const waitingItems = [];


    for (
        let i = 0;
        i < 120;
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
     * 狀態文字
     * ====================================
     */

    if (status) {

        status.textContent =
            "正在開啟箱子...";

    }


    /*
     * ====================================
     * 強制重新計算
     * ====================================
     */

    track.offsetHeight;


    /*
     * ====================================
     * 持續滾動
     *
     * 速度刻意放慢
     * 不會快速跑完
     * ====================================
     */

    const waitingDistance =
        Math.max(
            600,
            track.scrollWidth -
            window.innerWidth
        );


    track.style.transition =
        "transform 30000ms linear";


    track.style.transform =
        `translateX(-${waitingDistance}px)`;

}


/* ========================================
   正式開箱動畫
   API 回來後接管
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


    const winningItem =
        result.item;


    /*
     * ====================================
     * 清除等待動畫
     * ====================================
     */

    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0px)";

    track.innerHTML = "";


    /*
     * ====================================
     * 建立正式動畫物品
     * ====================================
     */

    const sourceItems =
        window.currentCaseItems || [];


    const animationItems = [];


    /*
     * 前面 24 個隨機物品
     */

    for (
        let i = 0;
        i < 24;
        i++
    ) {

        if (
            sourceItems.length > 0
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

    }


    /*
     * ====================================
     * 真正中獎物品
     * ====================================
     */

    animationItems.push(
        winningItem
    );


    /*
     * ====================================
     * 後面 6 個物品
     * ====================================
     */

    for (
        let i = 0;
        i < 6;
        i++
    ) {

        if (
            sourceItems.length > 0
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


    const winningIndex =
        24;


    const winningElement =
        itemElements[
            winningIndex
        ];


    if (!winningElement) {

        return;

    }


    /*
     * ====================================
     * 重置位置
     * ====================================
     */

    track.style.transition =
        "none";

    track.style.transform =
        "translateX(0px)";


    track.offsetHeight;


    /*
     * ====================================
     * 計算中獎位置
     * ====================================
     */

    const wrapper =
        document.querySelector(
            ".case-preview-wrapper"
        );


    if (!wrapper) {

        return;

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


    const targetPosition =
        itemCenter -
        wrapperWidth / 2;


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
     * ====================================
     * 正式減速動畫
     *
     * 4.2 秒
     * ====================================
     */

    const animationDuration =
        4200;


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
                `translateX(-${targetPosition}px)`;

        }
    );


    /*
     * ====================================
     * 動畫結束
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
