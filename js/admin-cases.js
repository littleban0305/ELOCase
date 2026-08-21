/* ========================================
   ELOCase - Admin Cases
======================================== */


/* ========================================
   全域資料
======================================== */

let adminCases = [];

let editingCaseId = null;


/* ========================================
   初始化
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            const user =
                await verifySession();


            /*
             * 必須登入
             */

            if (!user) {

                window.location.href =
                    "login.html";

                return;

            }


            /*
             * 必須是管理員
             */

            if (
                String(
                    user.role || ""
                ).toLowerCase()
                !==
                "admin"
            ) {

                alert(
                    "你沒有管理員權限。"
                );


                window.location.href =
                    "index.html";

                return;

            }


            /*
             * 初始化
             */

            initializeAdminCases();


            await loadAdminCases();


        } catch (error) {

            console.error(
                "管理員頁面初始化失敗：",
                error
            );


            alert(
                error.message ||
                "管理頁面載入失敗"
            );

        }

    }

);


/* ========================================
   初始化 UI
======================================== */

function initializeAdminCases() {


    const createButton =
        document.querySelector(
            "#create-case-button"
        );


    const refreshButton =
        document.querySelector(
            "#refresh-cases-button"
        );


    const closeButton =
        document.querySelector(
            "#close-modal-button"
        );


    const cancelButton =
        document.querySelector(
            "#cancel-case-button"
        );


    const form =
        document.querySelector(
            "#case-form"
        );


    const imageUrl =
        document.querySelector(
            "#case-image-url"
        );


    if (createButton) {

        createButton.addEventListener(
            "click",
            () => {

                openCaseModal();

            }
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                await loadAdminCases();

            }
        );

    }


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCaseModal
        );

    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeCaseModal
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            handleCaseSubmit
        );

    }


    if (imageUrl) {

        imageUrl.addEventListener(
            "input",
            updateImagePreview
        );

    }


    const modal =
        document.querySelector(
            "#case-modal"
        );


    if (modal) {

        modal
        .querySelector(
            ".case-modal-overlay"
        )
        ?.addEventListener(
            "click",
            closeCaseModal
        );

    }

}


/* ========================================
   載入箱子
======================================== */

async function loadAdminCases() {

    const wrapper =
        document.querySelector(
            "#case-table-wrapper"
        );


    if (wrapper) {

        wrapper.innerHTML = `

            <div class="admin-loading">

                載入箱子資料中...

            </div>

        `;

    }


    try {

        /*
         * 管理頁不能使用一般 Cases Cache
         *
         * 因為管理員修改後必須立即看到最新資料。
         */

        const cases =
            await sendApiRequest(
                "getAdminCases",
                {
                    sessionToken:
                        getSessionToken()
                }
            );


        adminCases =
            Array.isArray(cases)
                ? cases
                : [];


        renderAdminCases();

        updateStatistics();


    } catch (error) {

        console.error(
            "取得管理箱子失敗：",
            error
        );


        if (wrapper) {

            wrapper.innerHTML = `

                <div class="admin-empty">

                    ${escapeHtml(
                        error.message ||
                        "箱子資料載入失敗"
                    )}

                </div>

            `;

        }

    }

}


/* ========================================
   Render
======================================== */

function renderAdminCases() {

    const wrapper =
        document.querySelector(
            "#case-table-wrapper"
        );


    if (!wrapper) {

        return;

    }


    if (!adminCases.length) {

        wrapper.innerHTML = `

            <div class="admin-empty">

                目前沒有任何箱子。

            </div>

        `;

        return;

    }


    wrapper.innerHTML = `

        <table class="case-table">

            <thead>

                <tr>

                    <th>
                        圖片
                    </th>

                    <th>
                        箱子
                    </th>

                    <th>
                        遊戲
                    </th>

                    <th>
                        價格
                    </th>

                    <th>
                        狀態
                    </th>

                    <th>
                        操作
                    </th>

                </tr>

            </thead>

            <tbody>

                ${adminCases
                    .map(
                        renderCaseRow
                    )
                    .join("")}

            </tbody>

        </table>

    `;


    /*
     * 綁定操作按鈕
     */

    wrapper
    .querySelectorAll(
        "[data-edit-case]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const caseId =
                        button.dataset.editCase;

                    editCase(
                        caseId
                    );

                }
            );

        }
    );


    wrapper
    .querySelectorAll(
        "[data-toggle-case]"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const caseId =
                        button.dataset.toggleCase;

                    await toggleCase(
                        caseId
                    );

                }
            );

        }
    );

}


/* ========================================
   Row
======================================== */

function renderCaseRow(caseData) {

    const imageUrl =
        caseData.imageUrl ||
        "assets/case/elocase-box.png";


    const status =
        String(
            caseData.status ||
            "inactive"
        ).toLowerCase();


    const statusText =
        status === "active"
            ? "啟用"
            : "停用";


    return `

        <tr>

            <td>

                <img
                    src="${escapeAttribute(
                        imageUrl
                    )}"
                    class="case-image"
                    alt=""
                    onerror="
                        this.src='assets/case/elocase-box.png'
                    "
                >

            </td>


            <td>

                <div class="case-name">

                    ${escapeHtml(
                        caseData.name ||
                        "未命名箱子"
                    )}

                </div>


                <div class="case-id">

                    ${escapeHtml(
                        caseData.caseId ||
                        "-"
                    )}

                </div>

            </td>


            <td>

                ${escapeHtml(
                    caseData.game ||
                    "-"
                )}

            </td>


            <td>

                <span class="case-price">

                    ${formatAdminPrice(
                        caseData.price
                    )}

                </span>

            </td>


            <td>

                <span
                    class="case-status ${status}"
                >

                    ${statusText}

                </span>

            </td>


            <td>

                <div class="case-actions">

                    <button
                        type="button"
                        class="case-action-button"
                        data-edit-case="${escapeAttribute(
                            caseData.caseId
                        )}"
                    >
                        編輯
                    </button>


                    <button
                        type="button"
                        class="case-action-button danger"
                        data-toggle-case="${escapeAttribute(
                            caseData.caseId
                        )}"
                    >

                        ${
                            status === "active"
                                ? "停用"
                                : "啟用"
                        }

                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* ========================================
   新增箱子
======================================== */

function openCaseModal() {

    editingCaseId =
        null;


    document.querySelector(
        "#modal-mode-label"
    ).textContent =
        "新增箱子";


    document.querySelector(
        "#modal-title"
    ).textContent =
        "新增箱子";


    document.querySelector(
        "#case-form"
    ).reset();


    document.querySelector(
        "#case-game"
    ).value =
        "CS2";


    document.querySelector(
        "#case-status"
    ).value =
        "active";


    document.querySelector(
        "#caseId"
    ).value =
        "";


    document.querySelector(
        "#case-form-message"
    ).textContent =
        "";


    updateImagePreview();


    showCaseModal();

}


/* ========================================
   編輯箱子
======================================== */

function editCase(caseId) {

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
            "找不到這個箱子。"
        );

        return;

    }


    editingCaseId =
        caseData.caseId;


    document.querySelector(
        "#modal-mode-label"
    ).textContent =
        "編輯箱子";


    document.querySelector(
        "#modal-title"
    ).textContent =
        "編輯箱子";


    document.querySelector(
        "#caseId"
    ).value =
        caseData.caseId || "";


    document.querySelector(
        "#case-name"
    ).value =
        caseData.name || "";


    document.querySelector(
        "#case-game"
    ).value =
        caseData.game || "CS2";


    document.querySelector(
        "#case-price"
    ).value =
        Number(
            caseData.price
        ) || 0;


    document.querySelector(
        "#case-image-url"
    ).value =
        caseData.imageUrl || "";


    document.querySelector(
        "#case-description"
    ).value =
        caseData.description || "";


    document.querySelector(
        "#case-status"
    ).value =
        caseData.status || "active";


    document.querySelector(
        "#case-form-message"
    ).textContent =
        "";


    updateImagePreview();


    showCaseModal();

}


/* ========================================
   儲存箱子
======================================== */

async function handleCaseSubmit(event) {

    event.preventDefault();


    const saveButton =
        document.querySelector(
            "#save-case-button"
        );


    const message =
        document.querySelector(
            "#case-form-message"
        );


    const caseId =
        document.querySelector(
            "#caseId"
        ).value.trim();


    const name =
        document.querySelector(
            "#case-name"
        ).value.trim();


    const game =
        document.querySelector(
            "#case-game"
        ).value.trim();


    const price =
        Number(
            document.querySelector(
                "#case-price"
            ).value
        );


    const imageUrl =
        document.querySelector(
            "#case-image-url"
        ).value.trim();


    const description =
        document.querySelector(
            "#case-description"
        ).value.trim();


    const status =
        document.querySelector(
            "#case-status"
        ).value;


    if (!name) {

        message.textContent =
            "請輸入箱子名稱。";

        return;

    }


    if (!game) {

        message.textContent =
            "請輸入遊戲名稱。";

        return;

    }


    if (
        !Number.isFinite(price) ||
        price < 0
    ) {

        message.textContent =
            "箱子價格不正確。";

        return;

    }


    try {

        saveButton.disabled =
            true;


        saveButton.textContent =
            editingCaseId
                ? "更新中..."
                : "建立中...";


        message.textContent =
            "";


        let result;


        if (editingCaseId) {

            result =
                await sendApiRequest(
                    "updateCase",
                    {

                        sessionToken:
                            getSessionToken(),

                        caseId:
                            editingCaseId,

                        name,

                        game,

                        price:
                            String(
                                price
                            ),

                        imageUrl,

                        description,

                        status

                    }
                );

        } else {

            result =
                await sendApiRequest(
                    "createCase",
                    {

                        sessionToken:
                            getSessionToken(),

                        name,

                        game,

                        price:
                            String(
                                price
                            ),

                        imageUrl,

                        description,

                        status

                    }
                );

        }


        console.log(
            "箱子儲存成功：",
            result
        );


        /*
         * 清除一般 Cases Cache
         */

        removeApiCache(
            "cases"
        );


        closeCaseModal();


        await loadAdminCases();


        alert(
            editingCaseId
                ? "箱子更新成功！"
                : "箱子建立成功！"
        );


    } catch (error) {

        console.error(
            "儲存箱子失敗：",
            error
        );


        message.textContent =
            error.message ||
            "儲存箱子失敗";


    } finally {

        saveButton.disabled =
            false;


        saveButton.textContent =
            "儲存箱子";

    }

}


/* ========================================
   啟用 / 停用
======================================== */

async function toggleCase(caseId) {

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

        return;

    }


    const currentStatus =
        String(
            caseData.status ||
            "inactive"
        ).toLowerCase();


    const nextStatus =
        currentStatus === "active"
            ? "inactive"
            : "active";


    const actionText =
        nextStatus === "active"
            ? "啟用"
            : "停用";


    if (
        !confirm(
            `確定要${actionText}「${caseData.name}」嗎？`
        )
    ) {

        return;

    }


    try {

        await sendApiRequest(
            "updateCaseStatus",
            {

                sessionToken:
                    getSessionToken(),

                caseId:
                    caseId,

                status:
                    nextStatus

            }
        );


        removeApiCache(
            "cases"
        );


        await loadAdminCases();


    } catch (error) {

        console.error(
            "更新箱子狀態失敗：",
            error
        );


        alert(
            error.message ||
            "更新箱子狀態失敗"
        );

    }

}


/* ========================================
   Modal
======================================== */

function showCaseModal() {

    const modal =
        document.querySelector(
            "#case-modal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


function closeCaseModal() {

    const modal =
        document.querySelector(
            "#case-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    editingCaseId =
        null;

}


/* ========================================
   圖片預覽
======================================== */

function updateImagePreview() {

    const input =
        document.querySelector(
            "#case-image-url"
        );


    const preview =
        document.querySelector(
            "#image-preview"
        );


    if (
        !input ||
        !preview
    ) {

        return;

    }


    const url =
        input.value.trim();


    if (!url) {

        preview.innerHTML =
            "";

        return;

    }


    preview.innerHTML = `

        <img
            src="${escapeAttribute(
                url
            )}"
            alt="圖片預覽"
            onerror="
                this.style.display='none'
            "
        >

    `;

}


/* ========================================
   統計
======================================== */

function updateStatistics() {

    const total =
        adminCases.length;


    const active =
        adminCases.filter(
            item =>
                String(
                    item.status
                ).toLowerCase()
                ===
                "active"
        ).length;


    const inactive =
        total -
        active;


    const totalElement =
        document.querySelector(
            "#total-case-count"
        );


    const activeElement =
        document.querySelector(
            "#active-case-count"
        );


    const inactiveElement =
        document.querySelector(
            "#inactive-case-count"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (activeElement) {

        activeElement.textContent =
            active;

    }


    if (inactiveElement) {

        inactiveElement.textContent =
            inactive;

    }

}


/* ========================================
   格式化價格
======================================== */

function formatAdminPrice(value) {

    const number =
        Number(
            value || 0
        );


    return `$ ${number.toLocaleString(
        "en-US",
        {
            maximumFractionDigits: 2
        }
    )}`;

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
