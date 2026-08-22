/* ========================================
   ELOCase - Admin Cases
======================================== */


/* ========================================
   全域狀態
======================================== */

let adminCases = [];

let editingCaseId = null;

let caseEditorItems = [];


/* ========================================
   DOM
======================================== */

const casesContainer =
    document.querySelector(
        "#cases-container"
    );


const casesLoading =
    document.querySelector(
        "#cases-loading"
    );


const adminMessage =
    document.querySelector(
        "#admin-message"
    );


const caseModal =
    document.querySelector(
        "#case-modal"
    );


const caseForm =
    document.querySelector(
        "#case-form"
    );


const createCaseButton =
    document.querySelector(
        "#create-case-button"
    );


const closeModalButton =
    document.querySelector(
        "#close-modal-button"
    );


const cancelModalButton =
    document.querySelector(
        "#cancel-modal-button"
    );


const saveCaseButton =
    document.querySelector(
        "#save-case-button"
    );


const modalTitle =
    document.querySelector(
        "#modal-title"
    );


const modalLabel =
    document.querySelector(
        "#modal-label"
    );


const caseIdInput =
    document.querySelector(
        "#caseId"
    );


const caseNameInput =
    document.querySelector(
        "#case-name"
    );


const caseGameInput =
    document.querySelector(
        "#case-game"
    );


const casePriceInput =
    document.querySelector(
        "#case-price"
    );


const caseImageUrlInput =
    document.querySelector(
        "#case-image-url"
    );


const caseStatusInput =
    document.querySelector(
        "#case-status"
    );


const caseImagePreview =
    document.querySelector(
        "#case-image-preview"
    );


const caseItemsEditor =
    document.querySelector(
        "#case-items-editor"
    );


const caseItemsCount =
    document.querySelector(
        "#case-items-count"
    );


const addCaseItemButton =
    document.querySelector(
        "#add-case-item-button"
    );


/* ========================================
   顯示訊息
======================================== */

function showMessage(
    message,
    type = "info"
) {

    if (!adminMessage) {

        return;

    }


    adminMessage.textContent =
        message;


    adminMessage.className =
        "admin-message " +
        type;


    setTimeout(
        () => {

            adminMessage.textContent =
                "";

            adminMessage.className =
                "admin-message";

        },
        3500
    );

}


/* ========================================
   取得 Session
======================================== */

function getAdminSessionToken() {

    return (
        localStorage.getItem(
            "elocaseSessionToken"
        )
        ||
        localStorage.getItem(
            "sessionToken"
        )
    );

}


/* ========================================
   管理員驗證
======================================== */

async function checkAdmin() {

    const sessionToken =
        getAdminSessionToken();


    if (!sessionToken) {

        alert(
            "請先登入管理員帳號"
        );


        location.href =
            "login.html";


        return false;

    }


    try {

        const result =
            await sendApiRequest(
                "getAdminInfo",
                {
                    sessionToken:
                        sessionToken
                }
            );


        if (
            !result ||
            result.role !== "admin"
        ) {

            throw new Error(
                "你沒有管理員權限"
            );

        }


        return true;


    } catch (error) {

        console.error(
            "管理員驗證失敗：",
            error
        );


        alert(
            error.message ||
            "你沒有管理員權限"
        );


        location.href =
            "index.html";


        return false;

    }

}


/* ========================================
   取得箱子
======================================== */

async function loadCases() {

    if (casesLoading) {

        casesLoading.style.display =
            "block";

    }


    if (casesContainer) {

        casesContainer.innerHTML =
            "";

    }


    try {

        const sessionToken =
            getAdminSessionToken();


        const result =
            await sendApiRequest(
                "getAdminCases",
                {
                    sessionToken:
                        sessionToken
                }
            );


        /*
         * API 可能直接回傳陣列
         */

        adminCases =
            Array.isArray(result)
                ? result
                : (
                    result.cases ||
                    result.data ||
                    []
                );


        renderCases();


    } catch (error) {

        console.error(
            "取得箱子失敗：",
            error
        );


        showMessage(
            error.message ||
            "取得箱子失敗",
            "error"
        );


        if (casesContainer) {

            casesContainer.innerHTML = `

                <div class="empty-state">

                    <h3>
                        無法載入箱子
                    </h3>

                    <p>
                        ${escapeHtml(
                            error.message ||
                            "請稍後再試"
                        )}
                    </p>

                    <button
                        type="button"
                        class="button button-secondary"
                        onclick="loadCases()"
                    >
                        重新載入
                    </button>

                </div>

            `;

        }

    } finally {

        if (casesLoading) {

            casesLoading.style.display =
                "none";

        }

    }

}


/* ========================================
   顯示箱子
======================================== */

function renderCases() {

    if (!casesContainer) {

        return;

    }


    if (!adminCases.length) {

        casesContainer.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📦
                </div>

                <h3>
                    目前沒有箱子
                </h3>

                <p>
                    建立第一個 ELOCase 箱子吧。
                </p>

                <button
                    type="button"
                    class="button button-primary"
                    onclick="openCreateModal()"
                >
                    ＋ 新增箱子
                </button>

            </div>

        `;

        return;

    }


    casesContainer.innerHTML =
        adminCases
            .map(
                renderCaseCard
            )
            .join("");

}


/* ========================================
   箱子卡片
======================================== */

function renderCaseCard(caseData) {

    const status =
        String(
            caseData.status ||
            "active"
        );


    const isActive =
        status === "active";


    const imageUrl =
        String(
            caseData.imageUrl ||
            ""
        );


    return `

        <article
            class="admin-case-card ${
                isActive
                    ? ""
                    : "inactive"
            }"
        >

            <div class="admin-case-image">

                ${
                    imageUrl

                    ? `

                        <img
                            src="${escapeAttribute(
                                imageUrl
                            )}"
                            alt="${escapeAttribute(
                                caseData.name ||
                                "箱子"
                            )}"
                            loading="lazy"
                            onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
                        >

                        <div
                            class="image-error"
                            style="display:none;"
                        >
                            📦
                        </div>

                    `

                    : `

                        <div class="no-image">
                            📦
                        </div>

                    `
                }

            </div>


            <div class="admin-case-content">

                <div class="admin-case-top">

                    <div>

                        <h2>
                            ${escapeHtml(
                                caseData.name ||
                                "未命名箱子"
                            )}
                        </h2>

                        <span class="case-id">

                            ${
                                escapeHtml(
                                    caseData.caseId ||
                                    ""
                                )
                            }

                        </span>

                    </div>


                    <span
                        class="case-status ${
                            isActive
                                ? "active"
                                : "inactive"
                        }"
                    >

                        ${
                            isActive
                                ? "啟用"
                                : "停用"
                        }

                    </span>

                </div>


                <div class="admin-case-meta">

                    <div>

                        <span>
                            遊戲
                        </span>

                        <strong>
                            ${escapeHtml(
                                caseData.game ||
                                "-"
                            )}
                        </strong>

                    </div>


                    <div>

                        <span>
                            價格
                        </span>

                        <strong>
                            ${formatPrice(
                                caseData.price
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    Array.isArray(caseData.items) && caseData.items.length
                        ? `<p class="admin-case-description">${caseData.items.length} 個內容物</p>`
                        : ""
                }


                <div class="admin-case-actions">

                    <button
                        type="button"
                        class="button button-secondary"
                        onclick="openEditModal('${escapeAttribute(
                            caseData.caseId
                        )}')"
                    >
                        編輯
                    </button>


                    ${
                        isActive

                        ? `

                            <button
                                type="button"
                                class="button button-danger"
                                onclick="deleteCaseConfirm('${escapeAttribute(
                                    caseData.caseId
                                )}')"
                            >
                                停用
                            </button>

                        `

                        : `

                            <button
                                type="button"
                                class="button button-secondary"
                                onclick="restoreCase('${escapeAttribute(
                                    caseData.caseId
                                )}')"
                            >
                                重新啟用
                            </button>

                        `
                    }

                </div>

            </div>

        </article>

    `;

}


/* ========================================
   新增 Modal
======================================== */

function openCreateModal() {

    editingCaseId = null;

    caseEditorItems = [];

    caseForm.reset();

    caseIdInput.value = "";
    caseStatusInput.value = "active";

    modalLabel.textContent = "新增箱子";
    modalTitle.textContent = "建立箱子";
    saveCaseButton.textContent = "建立箱子";

    updateImagePreview();
    renderCaseEditorItems();

    caseModal.classList.add("show");

    setTimeout(() => {
        caseNameInput.focus();
    }, 100);
}


/* ========================================
   編輯 Modal
======================================== */

async function openEditModal(caseId) {

    const caseData =
        adminCases.find(
            item => String(item.caseId) === String(caseId)
        );

    if (!caseData) {
        alert("找不到指定箱子");
        return;
    }

    editingCaseId = caseId;

    caseIdInput.value = caseData.caseId || "";
    caseNameInput.value = caseData.name || "";
    caseGameInput.value = caseData.game || "";
    casePriceInput.value = caseData.price ?? "";
    caseImageUrlInput.value = caseData.imageUrl || "";
    caseStatusInput.value = caseData.status || "active";

    modalLabel.textContent = "編輯箱子";
    modalTitle.textContent = "編輯箱子";
    saveCaseButton.textContent = "儲存修改";

    updateImagePreview();

    caseEditorItems = [];
    renderCaseEditorItems();

    caseModal.classList.add("show");

    try {
        const items = await getCaseItems(caseId, { noLoading: true });
        caseEditorItems = Array.isArray(items) ? items.map(normalizeCaseEditorItem) : [];
        renderCaseEditorItems();
    } catch (error) {
        console.warn("⚠️ 載入箱子物品失敗：", error);
        showMessage("箱子已開啟，但無法載入內容物：" + (error.message || "未知錯誤"), "error");
    }
}


/* ========================================
   關閉 Modal
======================================== */

function closeCaseModal() {

    caseModal.classList.remove(
        "show"
    );


    editingCaseId = null;
    caseEditorItems = [];
    renderCaseEditorItems();

}


/* ========================================
   圖片預覽
======================================== */

function updateImagePreview() {

    if (!caseImagePreview) {

        return;

    }


    const url =
        caseImageUrlInput.value.trim();


    if (!url) {

        caseImagePreview.innerHTML = `

            <span>
                尚未設定圖片
            </span>

        `;

        return;

    }


    caseImagePreview.innerHTML = `

        <img
            src="${escapeAttribute(
                url
            )}"
            alt="箱子圖片預覽"
            onerror="showImagePreviewError()"
        >

    `;

}


/* ========================================
   圖片預覽失敗
======================================== */

function showImagePreviewError() {

    if (!caseImagePreview) {

        return;

    }


    caseImagePreview.innerHTML = `

        <span>
            ⚠️ 圖片網址無法載入
        </span>

    `;

}


/* ========================================
   箱子內容物編輯器
======================================== */

const CASE_ITEM_LIMIT = 12;

const CASE_RARITIES = [
    "Consumer Grade",
    "Industrial Grade",
    "Mil-Spec",
    "Restricted",
    "Classified",
    "Covert",
    "Exceedingly Rare",
    "Contraband"
];

const CASE_WEAR_OPTIONS = [
    "Factory New (FN)",
    "Minimal Wear (MW)",
    "Field-Tested (FT)",
    "Well-Worn (WW)",
    "Battle-Scarred (BS)"
];

function getCaseEditorColor(rarity) {
    const map = {
        "Consumer Grade": "White",
        "Industrial Grade": "Light Blue",
        "Mil-Spec": "Blue",
        "Restricted": "Purple",
        "Classified": "Pink",
        "Covert": "Red",
        "Exceedingly Rare": "Gold",
        "Contraband": "Orange"
    };
    return map[rarity] || "Blue";
}

function normalizeCaseEditorItem(item = {}) {
    const rarity = String(item.rarity || "Mil-Spec").trim();
    return {
        itemId: item.itemId || "",
        name: String(item.name || ""),
        marketHashName: String(item.marketHashName || ""),
        rarity: CASE_RARITIES.includes(rarity) ? rarity : "Mil-Spec",
        color: getCaseEditorColor(rarity),
        wear: CASE_WEAR_OPTIONS.includes(String(item.wear || ""))
            ? String(item.wear)
            : "Factory New (FN)",
        value: Number.isFinite(Number(item.value)) ? Number(item.value) : 0,
        rarityWeight: Number.isFinite(Number(item.rarityWeight)) ? Number(item.rarityWeight) : 1,
        imageUrl: String(item.imageUrl || "")
    };
}

function caseRarityOptions(current) {
    return CASE_RARITIES.map(option => `
        <option value="${escapeAttribute(option)}" ${option === current ? "selected" : ""}>
            ${escapeHtml(option)}
        </option>
    `).join("");
}

function caseWearOptions(current) {
    return CASE_WEAR_OPTIONS.map(option => `
        <option value="${escapeAttribute(option)}" ${option === current ? "selected" : ""}>
            ${escapeHtml(option)}
        </option>
    `).join("");
}

function renderCaseEditorItems() {
    if (!caseItemsEditor) return;

    if (caseItemsCount) {
        caseItemsCount.textContent = `${caseEditorItems.length} / ${CASE_ITEM_LIMIT}`;
    }

    if (addCaseItemButton) {
        addCaseItemButton.disabled = caseEditorItems.length >= CASE_ITEM_LIMIT;
        addCaseItemButton.textContent = caseEditorItems.length >= CASE_ITEM_LIMIT
            ? "已達 12 個物品"
            : "＋ 新增物品";
    }

    if (!caseEditorItems.length) {
        caseItemsEditor.innerHTML = `
            <div class="case-items-editor-empty">
                <div class="case-items-editor-empty-icon">📦</div>
                <strong>尚未加入物品</strong>
                <span>按下「新增物品」開始建立這個箱子的掉落內容。</span>
            </div>
        `;
        return;
    }

    caseItemsEditor.innerHTML = caseEditorItems.map((item, index) => `
        <article class="case-editor-item" data-item-index="${index}" data-item-id="${escapeAttribute(item.itemId || "")}" data-color="${escapeAttribute(item.color)}">
            <div class="case-editor-item-image-wrap">
                <div class="case-editor-item-image" data-item-image-preview>
                    ${item.imageUrl
                        ? `<img src="${escapeAttribute(item.imageUrl)}" alt="${escapeAttribute(item.name || "物品圖片")}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';">
                           <span class="case-editor-image-fallback" style="display:none;">無法載入</span>`
                        : `<span class="case-editor-image-fallback">尚無圖片</span>`}
                </div>
            </div>

            <div class="case-editor-item-main">
                <div class="case-editor-item-top">
                    <span class="case-editor-item-number">物品 ${index + 1}</span>
                    <span class="case-editor-item-rarity">${escapeHtml(item.rarity)}</span>
                    <button type="button" class="case-editor-remove" data-remove-case-item="${index}">移除</button>
                </div>

                <div class="case-editor-grid">
                    <div class="case-editor-field case-editor-field-wide">
                        <label>物品名稱</label>
                        <input type="text" class="case-edit-name" value="${escapeAttribute(item.name)}" placeholder="例如：AK-47 | Slate">
                    </div>

                    <div class="case-editor-field case-editor-field-wide">
                        <label>Steam Market Hash Name</label>
                        <input type="text" class="case-edit-market-hash" value="${escapeAttribute(item.marketHashName)}" placeholder="AK-47 | Slate (Field-Tested)">
                    </div>

                    <div class="case-editor-field case-editor-field-wide">
                        <label>圖片 URL</label>
                        <input type="url" class="case-edit-image-url" value="${escapeAttribute(item.imageUrl)}" placeholder="https://...">
                    </div>

                    <div class="case-editor-field">
                        <label>稀有度</label>
                        <select class="case-edit-rarity">${caseRarityOptions(item.rarity)}</select>
                    </div>

                    <div class="case-editor-field">
                        <label>顏色</label>
                        <input type="text" class="case-edit-color" value="${escapeAttribute(item.color)}" readonly>
                    </div>

                    <div class="case-editor-field">
                        <label>磨損</label>
                        <select class="case-edit-wear">${caseWearOptions(item.wear)}</select>
                    </div>

                    <div class="case-editor-field">
                        <label>價值 USD</label>
                        <input type="number" class="case-edit-value" min="0" step="0.01" value="${Number(item.value)}">
                    </div>

                    <div class="case-editor-field">
                        <label>掉落權重</label>
                        <input type="number" class="case-edit-weight" min="0" step="0.01" value="${Number(item.rarityWeight)}">
                    </div>
                </div>
            </div>
        </article>
    `).join("");

    caseItemsEditor.querySelectorAll(".case-edit-rarity").forEach(select => {
        select.addEventListener("change", event => {
            const card = event.target.closest(".case-editor-item");
            const index = Number(card.dataset.itemIndex);
            const rarity = event.target.value;
            caseEditorItems[index].rarity = rarity;
            caseEditorItems[index].color = getCaseEditorColor(rarity);
            card.dataset.color = caseEditorItems[index].color;
            card.querySelector(".case-edit-color").value = caseEditorItems[index].color;
            card.querySelector(".case-editor-item-rarity").textContent = rarity;
        });
    });

    caseItemsEditor.querySelectorAll(".case-edit-image-url").forEach(input => {
        input.addEventListener("input", event => {
            const card = event.target.closest(".case-editor-item");
            const index = Number(card.dataset.itemIndex);
            caseEditorItems[index].imageUrl = event.target.value.trim();
            const preview = card.querySelector("[data-item-image-preview]");
            const url = event.target.value.trim();
            preview.innerHTML = url
                ? `<img src="${escapeAttribute(url)}" alt="物品圖片" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><span class="case-editor-image-fallback" style="display:none;">無法載入</span>`
                : `<span class="case-editor-image-fallback">尚無圖片</span>`;
        });
    });

    caseItemsEditor.querySelectorAll("[data-remove-case-item]").forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.removeCaseItem);
            caseEditorItems.splice(index, 1);
            renderCaseEditorItems();
        });
    });
}

function addCaseEditorItem() {
    if (caseEditorItems.length >= CASE_ITEM_LIMIT) {
        alert("最多只能有 12 個物品");
        return;
    }

    caseEditorItems.push(normalizeCaseEditorItem({
        rarity: "Mil-Spec",
        wear: "Factory New (FN)",
        value: 0,
        rarityWeight: 1,
        imageUrl: ""
    }));

    renderCaseEditorItems();

    const cards = caseItemsEditor?.querySelectorAll(".case-editor-item");
    cards?.[cards.length - 1]?.querySelector(".case-edit-name")?.focus();
}

function collectCaseEditorItems() {
    if (!caseItemsEditor) return [];

    const cards = [...caseItemsEditor.querySelectorAll(".case-editor-item")];
    const items = cards.map(card => {
        const rarity = card.querySelector(".case-edit-rarity")?.value || "Mil-Spec";
        return normalizeCaseEditorItem({
            itemId: card.dataset.itemId || "",
            name: card.querySelector(".case-edit-name")?.value.trim() || "",
            marketHashName: card.querySelector(".case-edit-market-hash")?.value.trim() || "",
            rarity,
            color: getCaseEditorColor(rarity),
            wear: card.querySelector(".case-edit-wear")?.value || "Factory New (FN)",
            value: Number(card.querySelector(".case-edit-value")?.value),
            rarityWeight: Number(card.querySelector(".case-edit-weight")?.value),
            imageUrl: card.querySelector(".case-edit-image-url")?.value.trim() || ""
        });
    });

    if (!items.length) throw new Error("至少需要加入一個物品");

    const totalWeight = items.reduce((sum, item) => sum + item.rarityWeight, 0);
    if (totalWeight <= 0) throw new Error("所有物品的掉落權重不能全部為 0");

    items.forEach(item => {
        if (!item.name) throw new Error("有物品名稱尚未填寫");
        if (!Number.isFinite(item.value) || item.value < 0) throw new Error(`${item.name} 的價格無效`);
        if (!Number.isFinite(item.rarityWeight) || item.rarityWeight < 0) throw new Error(`${item.name} 的掉落權重無效`);
        item.probability = Number((item.rarityWeight / totalWeight * 100).toFixed(4));
    });

    return items;
}

/* ========================================
   儲存箱子
======================================== */

async function saveCase(event) {

    event.preventDefault();


    console.log(
        "===================================="
    );

    console.log(
        "🛠️ [Admin] saveCase 開始"
    );

    console.log(
        "===================================="
    );


    /*
     * ====================================
     * 基本資料驗證
     * ====================================
     */

    const name =
        caseNameInput.value.trim();

    const game =
        caseGameInput.value.trim();

    const price =
        Number(
            casePriceInput.value
        );

    const imageUrl =
        caseImageUrlInput.value.trim();

    const status =
        caseStatusInput.value;


    console.log(
        "📦 表單資料：",
        {
            name,
            game,
            price,
            imageUrl,
            status
        }
    );


    if (
        !name ||
        !game
    ) {

        alert(
            "請填寫箱子名稱與遊戲"
        );

        return;

    }


    if (
        isNaN(price) ||
        price < 0
    ) {

        alert(
            "請輸入有效的箱子價格"
        );

        return;

    }


    /*
     * ====================================
     * 記錄目前模式
     * ====================================
     */

    const isEditing =
        Boolean(
            editingCaseId
        );


    const currentCaseId =
        editingCaseId;


    console.log(
        "🔧 模式：",
        isEditing
            ? "編輯"
            : "新增"
    );


    console.log(
        "🆔 caseId：",
        currentCaseId
    );


    /*
     * ====================================
     * 建立 caseData
     * ====================================
     */

    const caseData = {

        name:
            name,

        game:
            game,

        price:
            price,

        imageUrl:
            imageUrl,

        items:
            collectCaseEditorItems(),

        status:
            status

    };


    /*
     * 編輯模式加入 caseId
     */

    if (
        isEditing
    ) {

        caseData.caseId =
            currentCaseId;

    }


    console.log(
        "📤 最終 caseData：",
        caseData
    );


    /*
     * ====================================
     * Session
     * ====================================
     */

    const sessionToken =
        getAdminSessionToken();


    console.log(
        "🔐 Session Token：",
        sessionToken
            ? "存在"
            : "不存在"
    );


    if (!sessionToken) {

        alert(
            "登入 Session 已不存在，請重新登入"
        );

        return;

    }


    /*
     * ====================================
     * 禁用按鈕
     * ====================================
     */

    saveCaseButton.disabled =
        true;


    saveCaseButton.textContent =
        isEditing
            ? "儲存中..."
            : "建立中...";


    try {

        /*
         * ====================================
         * API Action
         * ====================================
         */

        const action =
            isEditing
                ? "updateCase"
                : "createCase";


        const parameters = {

            sessionToken:
                sessionToken,

            caseData:
                caseData

        };


        console.log(
            "🚀 準備送出 POST API："
        );


        console.log(
            "➡️ action：",
            action
        );


        console.log(
            "➡️ parameters：",
            parameters
        );


        console.log(
            "➡️ POST JSON：",
            JSON.stringify({

                action:
                    action,

                ...parameters

            })
        );


        /*
         * ====================================
         * ⭐ 重要：
         * createCase / updateCase
         * 必須使用 POST
         * ====================================
         */

        const result =
            isEditing
                ? await updateCase(
                    caseData
                )
                : await createCase(
                    caseData
                );


        /*
         * ====================================
         * API 回應
         * ====================================
         */

        console.log(
            "✅ API 回應：",
            result
        );


        /*
         * ====================================
         * 成功
         * ====================================
         */

        closeCaseModal();


        showMessage(
            isEditing
                ? "箱子更新成功"
                : "箱子建立成功",
            "success"
        );


        await loadCases();


    } catch (error) {

        /*
         * ====================================
         * 錯誤
         * ====================================
         */

        console.error(
            "❌ 儲存箱子失敗：",
            error
        );


        console.error(
            "❌ Error message：",
            error.message
        );


        console.error(
            "❌ Error stack：",
            error.stack
        );


        alert(
            error.message ||
            "儲存箱子失敗"
        );


    } finally {

        /*
         * ====================================
         * 恢復按鈕
         * ====================================
         */

        saveCaseButton.disabled =
            false;


        saveCaseButton.textContent =
            isEditing
                ? "儲存修改"
                : "建立箱子";

    }

}


/* ========================================
   停用箱子
======================================== */

async function deleteCaseConfirm(caseId) {

    const caseData =
        adminCases.find(
            item =>
                String(
                    item.caseId
                ) ===
                String(
                    caseId
                )
        );


    if (!caseData) {

        alert(
            "找不到指定箱子"
        );

        return;

    }


    const confirmed =
        confirm(
            `確定要停用「${caseData.name}」嗎？\n\n箱子資料不會被直接刪除，只會改為停用。`
        );


    if (!confirmed) {

        return;

    }


    try {

        const sessionToken =
            getAdminSessionToken();


        if (!sessionToken) {

            throw new Error(
                "登入 Session 已不存在，請重新登入"
            );

        }


        /*
         * ⭐ deleteCase 必須使用 POST
         */

        await deleteCase(
            caseId
        );


        showMessage(
            "箱子已停用",
            "success"
        );


        await loadCases();


    } catch (error) {

        console.error(
            "停用箱子失敗：",
            error
        );


        alert(
            error.message ||
            "停用箱子失敗"
        );

    }

}


/* ========================================
   重新啟用箱子
======================================== */

async function restoreCase(caseId) {

    const caseData =
        adminCases.find(
            item =>
                String(
                    item.caseId
                ) ===
                String(
                    caseId
                )
        );


    if (!caseData) {

        alert(
            "找不到指定箱子"
        );

        return;

    }


    const confirmed =
        confirm(
            `確定要重新啟用「${caseData.name}」嗎？`
        );


    if (!confirmed) {

        return;

    }


    try {

        const sessionToken =
            getAdminSessionToken();


        if (!sessionToken) {

            throw new Error(
                "登入 Session 已不存在，請重新登入"
            );

        }


        /*
         * ⭐ restoreCase 實際上也是 updateCase
         * 所以必須使用 POST
         */

        await updateCase({

            caseId:
                caseId,

            status:
                "active"

        });


        showMessage(
            "箱子已重新啟用",
            "success"
        );


        await loadCases();


    } catch (error) {

        console.error(
            "重新啟用失敗：",
            error
        );


        alert(
            error.message ||
            "重新啟用失敗"
        );

    }

}


/* ========================================
   格式化價格
======================================== */

function formatPrice(value) {

    const number =
        Number(
            value
        );


    if (
        isNaN(number)
    ) {

        return "$0";

    }


    return "$" +
        number.toLocaleString(
            "en-US",
            {
                maximumFractionDigits:
                    2
            }
        );

}


/* ========================================
   HTML Escape
======================================== */

function escapeHtml(value) {

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


function escapeAttribute(value) {

    return escapeHtml(
        value
    );

}


/* ========================================
   事件
======================================== */

if (createCaseButton) {

    createCaseButton.addEventListener(
        "click",
        openCreateModal
    );

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeCaseModal
    );

}


if (cancelModalButton) {

    cancelModalButton.addEventListener(
        "click",
        closeCaseModal
    );

}


if (caseForm) {

    caseForm.addEventListener(
        "submit",
        saveCase
    );

}


if (caseImageUrlInput) {

    caseImageUrlInput.addEventListener(
        "input",
        updateImagePreview
    );

}


if (addCaseItemButton) {

    addCaseItemButton.addEventListener(
        "click",
        addCaseEditorItem
    );

}


/* ========================================
   點擊 Modal 外部關閉
======================================== */

if (caseModal) {

    caseModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                caseModal
            ) {

                closeCaseModal();

            }

        }
    );

}


/* ========================================
   ESC 關閉
======================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            caseModal.classList.contains(
                "show"
            )
        ) {

            closeCaseModal();

        }

    }
);


/* ========================================
   初始化
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const isAdmin =
            await checkAdmin();


        if (!isAdmin) {

            return;

        }


        await loadCases();

    }
);
