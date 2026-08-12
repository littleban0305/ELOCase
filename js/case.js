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
        ).trim().toLowerCase();


    switch (value) {

        case "blue":
        case "consumer":
        case "消費級":
            return "rarity-blue";


        case "purple":
        case "industrial":
        case "工業級":
            return "rarity-purple";


        case "pink":
        case "mil-spec":
        case "受限":
            return "rarity-pink";


        case "red":
        case "classified":
        case "保密":
            return "rarity-red";


        default:
            return "";

    }

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


    /*
     * 有圖片
     */

    if (caseData.imageUrl) {

        imageElement.innerHTML = `

            <img
                src="${escapeHtml(
                    caseData.imageUrl
                )}"
                alt="${escapeHtml(
                    caseData.name ||
                    "箱子"
                )}"
            >

        `;

        return;

    }


    /*
     * 沒有圖片
     */

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


    const descriptionElement =
        document.querySelector(
            "#case-description"
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


    if (descriptionElement) {

        descriptionElement.textContent =
            caseData.description ||
            "這個箱子目前沒有描述。";

    }


    if (priceElement) {

        priceElement.textContent =
            `$${Number(
                caseData.price || 0
            ).toLocaleString()}`;

    }


    /*
     * 更新頁面標題
     */

    document.title =
        `${caseData.name || "箱子"}｜ELOCase`;

}


/* ========================================
   建立內容物卡片
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


    /*
     * 圖片
     */

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
                       this.parentElement.classList.add('image-error');
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

            <div class="case-item-rarity ${rarityClass}">

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
   開箱按鈕
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
        () => {

            /*
             * 開箱系統下一階段再接
             */

            alert(
                "開箱功能即將推出"
            );

        }
    );

}


/* ========================================
   載入箱子
======================================== */

async function initializeCasePage() {

    const caseId =
        getCaseIdFromUrl();


    const caseImage =
        document.querySelector(
            "#case-image"
        );


    const caseName =
        document.querySelector(
            "#case-name"
        );


    const caseItems =
        document.querySelector(
            "#case-items"
        );


    /*
     * 沒有 caseId
     */

    if (!caseId) {

        if (caseName) {

            caseName.textContent =
                "找不到箱子";

        }


        if (caseImage) {

            caseImage.innerHTML = `

                <span>
                    ELOCase
                </span>

            `;

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
         * ====================================
         * 取得箱子
         * ====================================
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
         * ====================================
         * 取得箱子內容物
         * ====================================
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
