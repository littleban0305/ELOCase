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
   箱子卡片
======================================== */

function createCaseCard(caseData) {

    const card =
        document.createElement("a");


    card.className =
        "case-card";


    /*
     * 點擊箱子
     *
     * cases.html
     *      ↓
     * case.html?caseId=C001
     */

    card.href =
        `case.html?caseId=${encodeURIComponent(
            caseData.caseId
        )}`;


    /*
     * C002 特別樣式
     */

    const imageClass =
        caseData.caseId === "C002"
            ? "case-image case-image-featured"
            : "case-image";


    /*
     * 箱子圖片
     */

    const imageContent =
        caseData.imageUrl
            ? `
                <img
                    src="${escapeHtml(
                        caseData.imageUrl
                    )}"
                    alt="${escapeHtml(
                        caseData.name ||
                        "箱子"
                    )}"
                >
            `
            : `
                <span>
                    ${escapeHtml(
                        caseData.game ||
                        "CS2"
                    )}
                </span>
            `;


    card.innerHTML = `

        <div class="${imageClass}">

            ${imageContent}

        </div>


        <div class="case-info">

            <div class="case-card-tags">
                <span class="case-card-game">
                    ${escapeHtml(caseData.game || "-")}
                </span>
                ${caseData.category ? `
                    <span class="case-card-category">
                        ${escapeHtml(caseData.category)}
                    </span>
                ` : ""}
            </div>

            <h3>
                ${escapeHtml(
                    caseData.name ||
                    "未命名箱子"
                )}
            </h3>


            <div class="case-bottom">

                <span class="case-price">

                    $${Number(
                        caseData.price || 0
                    ).toLocaleString()}

                </span>


                <span class="case-action">

                    查看

                </span>

            </div>

        </div>

    `;


    return card;

}


/* ========================================
   箱子分類篩選
======================================== */

let homeCasesSource = [];
let selectedCaseGame = "ALL";
let selectedCaseCategory = "ALL";

function getCaseFilterGames(cases) {
    return Array.from(
        new Set(
            cases.map(item => String(item.game || "").trim()).filter(Boolean)
        )
    );
}

function getCaseFilterCategories(cases, game) {
    const filtered = game === "ALL"
        ? cases
        : cases.filter(item => String(item.game || "").trim() === game);

    return Array.from(
        new Set(
            filtered.map(item => String(item.category || "").trim()).filter(Boolean)
        )
    );
}

function renderCaseFilters(cases) {
    const container = document.querySelector("#case-filters");
    if (!container) return;

    const games = getCaseFilterGames(cases);

    if (selectedCaseGame !== "ALL" && !games.includes(selectedCaseGame)) {
        selectedCaseGame = "ALL";
        selectedCaseCategory = "ALL";
    }

    const categories = getCaseFilterCategories(cases, selectedCaseGame);

    if (selectedCaseCategory !== "ALL" && !categories.includes(selectedCaseCategory)) {
        selectedCaseCategory = "ALL";
    }

    container.innerHTML = `
        <div class="case-filter-row">
            <span class="case-filter-title">遊戲</span>
            <div class="case-filter-options">
                <button type="button" class="case-filter-button ${selectedCaseGame === "ALL" ? "active" : ""}" data-case-game="ALL">全部</button>
                ${games.map(game => `
                    <button type="button" class="case-filter-button ${selectedCaseGame === game ? "active" : ""}" data-case-game="${escapeHtml(game)}">
                        ${escapeHtml(game)}
                    </button>
                `).join("")}
            </div>
        </div>

        <div class="case-filter-row">
            <span class="case-filter-title">分類</span>
            <div class="case-filter-options">
                <button type="button" class="case-filter-button ${selectedCaseCategory === "ALL" ? "active" : ""}" data-case-category="ALL">全部</button>
                ${categories.map(category => `
                    <button type="button" class="case-filter-button ${selectedCaseCategory === category ? "active" : ""}" data-case-category="${escapeHtml(category)}">
                        ${escapeHtml(category)}
                    </button>
                `).join("")}
            </div>
        </div>
    `;

    container.querySelectorAll("[data-case-game]").forEach(button => {
        button.addEventListener("click", () => {
            selectedCaseGame = button.dataset.caseGame || "ALL";
            selectedCaseCategory = "ALL";
            renderCases(homeCasesSource);
        });
    });

    container.querySelectorAll("[data-case-category]").forEach(button => {
        button.addEventListener("click", () => {
            selectedCaseCategory = button.dataset.caseCategory || "ALL";
            renderCases(homeCasesSource);
        });
    });
}

function getVisibleCases(cases) {
    return cases.filter(item => {
        const game = String(item.game || "").trim();
        const category = String(item.category || "").trim();
        return (selectedCaseGame === "ALL" || game === selectedCaseGame)
            && (selectedCaseCategory === "ALL" || category === selectedCaseCategory);
    });
}


/* ========================================
   箱子列表
======================================== */

function renderCases(cases) {

    homeCasesSource = Array.isArray(cases) ? cases : [];

    renderCaseFilters(homeCasesSource);

    const visibleCases = getVisibleCases(homeCasesSource);

    const container =
        document.querySelector(
            "#case-grid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !visibleCases ||
        visibleCases.length === 0
    ) {

        container.innerHTML = `

            <div class="case-loading">

                目前沒有可用的箱子。

            </div>

        `;

        return;

    }


    visibleCases.forEach(
        caseData => {

            const card =
                createCaseCard(
                    caseData
                );


            container.appendChild(
                card
            );

        }
    );

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
