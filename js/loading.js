/* ========================================
   ELOCase - Loading Bar
======================================== */

(function () {

    let loadingBar = null;

    let progressTimer = null;

    let requestCount = 0;

    let finishTimer = null;


    /* ========================================
       Challenge Mode 判斷
       
       Challenge Mode：
       完全停用舊 Loading Bar

       注意：
       原本 Loading Bar 程式保留
       只是 Challenge 不使用它
    ======================================== */

    function isChallengeMode() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        return (
            params.get("mode") ===
            "challenge"
        );

    }


    /* ========================================
       建立 Loading Bar
    ======================================== */

    function createLoadingBar() {

        if (
            document.querySelector(
                "#elo-loading-bar"
            )
        ) {

            loadingBar =
                document.querySelector(
                    "#elo-loading-bar"
                );

            return;

        }


        loadingBar =
            document.createElement(
                "div"
            );


        loadingBar.id =
            "elo-loading-bar";


        document.body.prepend(
            loadingBar
        );

    }


    /* ========================================
       開始載入
    ======================================== */

    function startLoading() {

        /*
         * ====================================
         * Challenge Mode
         *
         * 停用舊 Loading Bar
         *
         * 不刪除原本程式
         * 只是不執行
         * ====================================
         */

        if (
            isChallengeMode()
        ) {

            return;

        }


        createLoadingBar();


        requestCount++;


        /*
         * 如果已經有 API 正在載入
         * 不重新開始進度
         */

        if (
            requestCount > 1
        ) {

            return;

        }


        clearInterval(
            progressTimer
        );


        clearTimeout(
            finishTimer
        );


        loadingBar.classList.remove(
            "loading-complete"
        );


        loadingBar.classList.add(
            "loading-active"
        );


        loadingBar.style.opacity =
            "1";


        loadingBar.style.width =
            "0%";


        /*
         * ====================================
         * 假進度
         * ====================================
         *
         * 前面正常跑
         * 70% 之後超級慢
         */

        let progress = 0;


        progressTimer =
            setInterval(
                () => {

                    /*
                     * 0% ~ 70%
                     *
                     * 正常速度
                     */

                    if (
                        progress < 70
                    ) {

                        const remaining =
                            70 - progress;


                        progress +=
                            Math.max(
                                0.5,
                                remaining * 0.08
                            );

                    }


                    /*
                     * 70% ~ 90%
                     *
                     * 超級慢速前進
                     */

                    else if (
                        progress < 90
                    ) {

                        progress +=
                            0.015;

                    }


                    /*
                     * 不要自己跑到 100%
                     *
                     * 100% 一定等 API 完成
                     */

                    else {

                        progress =
                            90;

                    }


                    loadingBar.style.width =
                        `${progress}%`;


                },
                100
            );

    }


    /* ========================================
       完成載入
    ======================================== */

    function finishLoading() {

        /*
         * ====================================
         * Challenge Mode
         *
         * 舊 Loading Bar 不處理
         * ====================================
         */

        if (
            isChallengeMode()
        ) {

            return;

        }


        /*
         * 防止計數器變成負數
         */

        if (
            requestCount <= 0
        ) {

            requestCount = 0;

            return;

        }


        requestCount--;


        /*
         * 還有 API 正在執行
         *
         * 不要讓 Loading Bar 消失
         */

        if (
            requestCount > 0
        ) {

            return;

        }


        createLoadingBar();


        clearInterval(
            progressTimer
        );


        /*
         * 最後一個 API 完成
         */

        loadingBar.classList.remove(
            "loading-active"
        );


        loadingBar.classList.add(
            "loading-complete"
        );


        loadingBar.style.width =
            "100%";


        loadingBar.style.opacity =
            "1";


        /*
         * 稍微停留一下
         */

        finishTimer =
            setTimeout(
                () => {

                    loadingBar.style.opacity =
                        "0";


                    /*
                     * 完全消失後重置
                     */

                    setTimeout(
                        () => {

                            loadingBar.classList.remove(
                                "loading-complete"
                            );


                            loadingBar.style.width =
                                "0%";


                            loadingBar.style.opacity =
                                "";


                        },
                        180
                    );


                },
                180
            );

    }


    /* ========================================
       全域 API
    ======================================== */

    window.ELOLoading = {

        start:
            startLoading,

        finish:
            finishLoading

    };


})();
