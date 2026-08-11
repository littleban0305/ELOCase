async function getPlayerByToken(token) {
    return await sendApiRequest(
        "getPlayerByToken",
        {
            token
        }
    );
}
