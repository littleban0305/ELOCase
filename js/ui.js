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
   箱子列表
======================================== */

function renderCases(cases) {

    const container =
        document.querySelector(
            "#case-grid"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !cases ||
        cases.length === 0
    ) {

        container.innerHTML = `

            <div class="case-loading">

                目前沒有可用的箱子。

            </div>

        `;

        return;

    }


    cases.forEach(
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
