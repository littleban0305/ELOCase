/* ========================================
   ELOCase - 箱子詳細頁
======================================== */


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadCasePage();

    }
);


/* ---------- 載入箱子 ---------- */

async function loadCasePage() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const caseId =
        params.get("caseId");


    if (!caseId) {

        showCaseError(
            "找不到箱子"
        );

        return;

    }


    try {

        const [
            caseData,
            items
        ] = await Promise.all([

            getCase(caseId),

            getCaseItems(caseId)

        ]);


        renderCase(
            caseData
        );


        renderCaseItems(
            items
        );


    } catch (error) {

        console.error(
            "載入箱子失敗：",
            error
        );


        showCaseError(
            error.message ||
            "箱子資料載入失敗"
        );

    }

}


/* ---------- 箱子資訊 ---------- */

function renderCase(caseData) {

    const name =
        document.querySelector(
            "#case-name"
        );


    const game =
        document.querySelector(
            "#case-game"
        );


    const price =
        document.querySelector(
            "#case-price"
        );


    const image =
        document.querySelector(
            "#case-image"
        );


    const description =
        document.querySelector(
            "#case-description"
        );


    if (name) {

        name.textContent =
            caseData.name || "未命名箱子";

    }


    if (game) {

        game.textContent =
            caseData.game || "";

    }


    if (price) {

        price.textContent =
            `$${Number(
                caseData.price || 0
            ).toLocaleString()}`;

    }


    if (description) {

        description.textContent =
            caseData.description || "";

    }


    if (image) {

        if (caseData.imageUrl) {

            image.innerHTML = `
                <img
                    src="${escapeHtml(
                        caseData.imageUrl
                    )}"
                    alt="${escapeHtml(
                        caseData.name || ""
                    )}"
                >
            `;

        } else {

            image.textContent =
                "ELOCase";

        }

    }

}


/* ---------- 箱子物品 ---------- */

function renderCaseItems(items) {

    const grid =
        document.querySelector(
            "#case-items"
        );


    if (!grid) {
        return;
    }


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        grid.innerHTML = `
            <div class="case-items-empty">
                此箱子目前沒有物品
            </div>
        `;

        return;

    }


    grid.innerHTML = "";


    items.forEach(
        item => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "case-item-card";


            const rarityClass =
                getRarityClass(
                    item.rarity
                );


            const image =
                item.image
                    ? `
                        <img
                            src="${escapeHtml(
                                item.image
                            )}"
                            alt="${escapeHtml(
                                item.name
                            )}"
                        >
                    `
                    : `
                        <div class="
                            case-item-placeholder
                        ">
                            ELO
                        </div>
                    `;


            card.innerHTML = `

                <div class="
                    case-item-image
                ">

                    ${image}

                </div>


                <div class="
                    case-item-info
                ">

                    <div class="
                        case-item-name
                    ">

                        ${escapeHtml(
                            item.name ||
                            "未命名物品"
                        )}

                    </div>


                    <div class="
                        case-item-bottom
                    ">

                        <span class="
                            case-item-rarity
                            ${rarityClass}
                        ">

                            ${escapeHtml(
                                item.rarity ||
                                "普通"
                            )}

                        </span>


                        <span class="
                            case-item-value
                        ">

                            $${Number(
                                item.value || 0
                            ).toLocaleString()}

                        </span>

                    </div>

                </div>

            `;

            card.onclick =
            ()=>{
            
            
            const params =
            new URLSearchParams(
            window.location.search
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
            item.caseId;
            
            
            
            if(
            mode === "challenge"
            &&
            challengeId
            ){
            
            url +=
            "&mode=challenge&challengeId="
            +
            challengeId;
            
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


/* ---------- 稀有度 ---------- */

function getRarityClass(
    rarity
) {

    const value =
        String(
            rarity || ""
        ).toLowerCase();


    if (
        value.includes("藍") ||
        value.includes("blue")
    ) {

        return "rarity-blue";

    }


    if (
        value.includes("紫") ||
        value.includes("purple")
    ) {

        return "rarity-purple";

    }


    if (
        value.includes("粉") ||
        value.includes("pink")
    ) {

        return "rarity-pink";

    }


    if (
        value.includes("紅") ||
        value.includes("red")
    ) {

        return "rarity-red";

    }


    return "";

}


/* ---------- 錯誤 ---------- */

function showCaseError(
    message
) {

    const container =
        document.querySelector(
            "#case-page"
        );


    if (!container) {
        return;
    }


    container.innerHTML = `

        <div class="
            case-page-error
        ">

            ${escapeHtml(
                message
            )}

        </div>

    `;

}


/* ---------- HTML 防護 ---------- */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
