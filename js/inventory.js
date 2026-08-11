async function loadInventory() {

    const grid =
        document.querySelector("#inventory-grid");

    const count =
        document.querySelector("#inventory-count");

    const searchInput =
        document.querySelector("#inventory-search");

    if (!grid) {
        return;
    }


    const user =
        await requireLogin();

    if (!user) {
        return;
    }


    updateLoginUI(user);


    let items = [];


    try {

        items =
            await getInventory(
                user.userId
            );

        if (!Array.isArray(items)) {
            items = [];
        }

    } catch (error) {

        grid.innerHTML = `
            <div class="inventory-error">
                ${escapeHtml(
                    error.message ||
                    "目前無法取得物品資料。"
                )}
            </div>
        `;

        return;
    }


    function render(list) {

        grid.innerHTML = "";


        count.textContent =
            list.length.toLocaleString();


        if (list.length === 0) {

            grid.innerHTML = `
                <div class="inventory-empty">

                    <div class="inventory-empty-title">
                        目前沒有物品
                    </div>

                    <div class="inventory-empty-text">
                        取得物品後，它們會顯示在這裡。
                    </div>

                </div>
            `;

            return;
        }


        list.forEach(item => {

            const card =
                document.createElement("article");


            card.className =
                "inventory-card";


            const rarity =
                getInventoryRarityClass(
                    item.rarity
                );


            const image =
                item.image
                    ? `
                        <img
                            src="${escapeHtml(item.image)}"
                            alt="${escapeHtml(item.name)}"
                            loading="lazy"
                            onerror="this.style.display='none'"
                        >
                    `
                    : `
                        <span class="inventory-image-placeholder">
                            ${escapeHtml(
                                item.weapon || "ITEM"
                            )}
                        </span>
                    `;


            card.innerHTML = `
            
                <div class="inventory-image">
            
                    ${image}
            
                </div>
            
            
                <div class="inventory-hover">
            
                    <div class="inventory-detail">
            
                        <div class="inventory-detail-name">
                            ${escapeHtml(
                                item.name ||
                                "未命名物品"
                            )}
                        </div>
            
            
                        <div class="inventory-detail-game">
                            ${escapeHtml(
                                item.game ||
                                "CS2"
                            )}
                        </div>
            
            
                        <div class="inventory-detail-rarity ${rarity}">
                            ${escapeHtml(
                                item.rarity ||
                                "普通"
                            )}
                        </div>
            
            
                        <div class="inventory-detail-value">
                            $${Number(
                                item.value || 0
                            ).toLocaleString()}
                        </div>
            
                    </div>
            
            
                    <div class="inventory-actions">
            
                        <button
                            type="button"
                            class="inventory-action"
                            data-action="upgrade"
                            data-inventory-id="${escapeHtml(
                                item.inventoryId
                            )}"
                        >
                            升級
                        </button>
            
            
                        <button
                            type="button"
                            class="inventory-action"
                            data-action="market"
                            data-inventory-id="${escapeHtml(
                                item.inventoryId
                            )}"
                        >
                            市場
                        </button>
            
                    </div>
            
                </div>
            
            
                <div class="inventory-info">
            
                    <div class="inventory-name">
                        ${escapeHtml(
                            item.name ||
                            "未命名物品"
                        )}
                    </div>
            
            
                    <div class="inventory-meta">
            
                        <span class="inventory-rarity">
                            ${escapeHtml(
                                item.rarity ||
                                "普通"
                            )}
                        </span>
            
            
                        <span class="inventory-price">
                            $${Number(
                                item.value || 0
                            ).toLocaleString()}
                        </span>
            
                    </div>
            
                </div>
            
            `;


            grid.appendChild(card);

            const actionButtons =
                card.querySelectorAll(
                    ".inventory-action"
                );
            
            
            actionButtons.forEach(button => {
            
                button.addEventListener(
                    "click",
                    event => {
            
                        event.stopPropagation();
            
            
                        const action =
                            button.dataset.action;
            
            
                        const inventoryId =
                            button.dataset.inventoryId;
            
            
                        if (action === "upgrade") {
            
                            console.log(
                                "升級物品：",
                                inventoryId
                            );
            
                            return;
                        }
            
            
                        if (action === "market") {
            
                            console.log(
                                "市場物品：",
                                inventoryId
                            );
            
                        }
            
                    }
                );
            
            });

        });

    }


    render(items);


    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!keyword) {

                render(items);

                return;
            }


            const filtered =
                items.filter(item => {

                    const name =
                        String(
                            item.name || ""
                        ).toLowerCase();


                    const weapon =
                        String(
                            item.weapon || ""
                        ).toLowerCase();


                    return (
                        name.includes(keyword) ||
                        weapon.includes(keyword)
                    );

                });


            render(filtered);

        }
    );

}


/* ========================================
   稀有度樣式
   ======================================== */

function getInventoryRarityClass(rarity) {

    const map = {

        "藍色":
            "inventory-rarity-blue",

        "紫色":
            "inventory-rarity-purple",

        "粉色":
            "inventory-rarity-pink",

        "紅色":
            "inventory-rarity-red"

    };


    return map[rarity] || "";

}


/* ========================================
   HTML 安全處理
   ======================================== */

function escapeHtml(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}


/* ========================================
   啟動
   ======================================== */

loadInventory();
