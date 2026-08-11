function updateBalance(eloCoin) {

    const balanceElement =
        document.querySelector(
            ".balance-value"
        );

    if (!balanceElement) {
        return;
    }

    balanceElement.textContent =
        Number(eloCoin).toLocaleString();
}


function createCaseCard(caseData) {

    const card =
        document.createElement("a");

    card.className = "case-card";

    card.href =
        `cases.html?caseId=${encodeURIComponent(
            caseData.caseId
        )}`;

    const imageClass =
        caseData.caseId === "C002"
            ? "case-image case-image-featured"
            : "case-image";

    card.innerHTML = `
        <div class="${imageClass}">
            <span>${caseData.game || "CS2"}</span>
        </div>

        <div class="case-info">

            <h3>
                ${escapeHtml(caseData.name)}
            </h3>

            <div class="case-bottom">

                <span class="case-price">
                    $${Number(
                        caseData.price
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


function renderCases(cases) {

    const container =
        document.querySelector(
            "#case-grid"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!cases || cases.length === 0) {

        container.innerHTML = `
            <div class="case-loading">
                目前沒有可用的箱子。
            </div>
        `;

        return;
    }

    cases.forEach(caseData => {

        const card =
            createCaseCard(caseData);

        container.appendChild(card);

    });
}


function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
