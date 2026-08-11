function updateBalance(eloCoin) {
    const balanceElement = document.querySelector(".balance-value");

    if (!balanceElement) {
        return;
    }

    balanceElement.textContent = Number(eloCoin).toLocaleString();
}
