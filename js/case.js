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
   顯示開箱結果
======================================== */

function showOpenCaseResult(result) {

    let resultElement =
        document.querySelector(
            "#open-case-result"
        );


    /*
     * 第一次建立
     */

    if (!resultElement) {

        resultElement =
            document.createElement(
                "div"
            );


        resultElement.id =
            "open-case-result";


        resultElement.className =
            "open-case-result";


        document.body.appendChild(
            resultElement
        );

    }


    const item =
        result.item;


    resultElement.innerHTML = `

        <div class="open-case-result-box">

            <div class="open-case-result-label">

                開箱結果

            </div>


            <div class="open-case-result-image">

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
                                class="
                                    open-case-result-blur
                                "
                            ></div>
                        `
                }

            </div>


            <div
                class="
                    open-case-result-rarity
                    ${getRarityClass(
                        item.rarity
                    )}
                "
            >

                ${escapeHtml(
                    item.rarity ||
                    "未知"
                )}

            </div>


            <h2>

                ${escapeHtml(
                    item.name ||
                    "未知物品"
                )}

            </h2>


            <div class="open-case-result-value">

                $${Number(
                    item.value || 0
                ).toLocaleString()}

            </div>


            <div class="open-case-result-balance">

                剩餘 $${Number(
                    result.remainingEloCoin || 0
                ).toLocaleString()}

            </div>


            <button
                type="button"
                id="close-open-case-result"
                class="button button-primary"
            >
                確定
            </button>

        </div>

    `;


    resultElement.classList.add(
        "show"
    );


    const closeButton =
        document.querySelector(
            "#close-open-case-result"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            () => {

                resultElement.classList.remove(
                    "show"
                );

            }
        );

    }

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
             * 防止連點
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
             * 確認登入
             */

            const sessionToken =
                getSessionToken();


            if (!sessionToken) {

                window.location.href =
                    "login.html";

                return;

            }


            try {

                button.disabled =
                    true;


                button.textContent =
                    "開箱中...";


                /*
                 * 呼叫後端
                 */

                const result =
                    await openCase(
                        caseId
                    );


                /*
                 * 更新餘額
                 */

                updateBalance(
                    result.remainingEloCoin
                );


                /*
                 * 更新 LocalStorage 玩家資料
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
                 * 顯示結果
                 */

                showOpenCaseResult(
                    result
                );


            } catch (error) {

                console.error(
                    "開箱失敗：",
                    error
                );


                alert(
                    error.message ||
                    "開箱失敗"
                );


            } finally {

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
