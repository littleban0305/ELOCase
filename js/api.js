async function sendApiRequest(action, parameters = {}) {
    const query = new URLSearchParams({
        action,
        ...parameters
    });

    const response = await fetch(
        `${CONFIG.API_URL}?${query.toString()}`
    );

    if (!response.ok) {
        throw new Error("API 請求失敗");
    }

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.error || "發生未知錯誤");
    }

    return result.data;
}
