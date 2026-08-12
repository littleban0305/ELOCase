/* ========================================
   ELOCase - Loading Bar
======================================== */

(function () {

    let loadingBar = null;

    let progressTimer = null;


    /* ========================================
       建立 Loading Bar
    ======================================== */

    function createLoadingBar() {

        if (document.querySelector("#elo-loading-bar")) {
            loadingBar =
                document.querySelector(
                    "#elo-loading-bar"
                );

            return;
        }


        loadingBar =
            document.createElement("div");

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

        createLoadingBar();


        clearInterval(
            progressTimer
        );


        loadingBar.classList.remove(
            "loading-complete"
        );

        loadingBar.classList.add(
            "loading-active"
        );


        loadingBar.style.width =
            "0%";


        /*
         * 假進度：
         * 快速前進到約 70%
         */

        let progress = 0;


        progressTimer =
            setInterval(
                () => {

                    if (progress >= 70) {
                        return;
                    }


                    const remaining =
                        70 - progress;


                    progress +=
                        Math.max(
                            0.5,
                            remaining * 0.08
                        );


                    loadingBar.style.width =
                        `${progress}%`;

                },
                80
            );

    }


    /* ========================================
       完成載入
    ======================================== */

    function finishLoading() {

        createLoadingBar();


        clearInterval(
            progressTimer
        );


        loadingBar.classList.remove(
            "loading-active"
        );


        loadingBar.classList.add(
            "loading-complete"
        );


        loadingBar.style.width =
            "100%";


        setTimeout(
            () => {

                loadingBar.style.opacity =
                    "0";


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


    /* ========================================
       頁面初始載入
    ======================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            () => {

                finishLoading();

            }
        );

    }

})();
