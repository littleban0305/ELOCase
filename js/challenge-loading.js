/* ========================================
   ELOCase - Challenge Loading
   全新 Challenge 專用 Loading Bar
======================================== */

(function(){

    let loadingBar = null;

    let activeCount = 0;

    let progressTimer = null;

    let finishTimer = null;


    /* ========================================
       判斷是否為 Challenge 頁面
    ======================================== */

    function isChallengePage(){

        const params =
            new URLSearchParams(
                window.location.search
            );


        const mode =
            params.get(
                "mode"
            );


        const path =
            window.location.pathname;


        return (

            mode === "challenge"

            ||

            document.body.classList.contains(
                "challenge-mode"
            )

            ||

            path.endsWith(
                "challenge-room.html"
            )

            ||

            path.endsWith(
                "challenge-result.html"
            )

        );

    }


    /* ========================================
       建立 Loading Bar
    ======================================== */

    function create(){

        if(
            loadingBar
        ){

            return;

        }


        loadingBar =
            document.querySelector(
                "#elo-challenge-loading-bar"
            );


        if(
            loadingBar
        ){

            return;

        }


        loadingBar =
            document.createElement(
                "div"
            );


        loadingBar.id =
            "elo-challenge-loading-bar";


        document.body.prepend(
            loadingBar
        );

    }


    /* ========================================
       開始
    ======================================== */

    function start(){

        if(
            !isChallengePage()
        ){

            return;

        }


        create();


        clearTimeout(
            finishTimer
        );


        activeCount++;


        /*
         * 已經有 Loading
         * 不重新建立
         */

        if(
            activeCount > 1
        ){

            return;

        }


        clearInterval(
            progressTimer
        );


        loadingBar.classList.remove(
            "challenge-loading-complete"
        );


        loadingBar.classList.add(
            "challenge-loading-active"
        );


        loadingBar.style.opacity =
            "1";


        loadingBar.style.width =
            "0%";


        /*
         * ====================================
         * 假進度
         *
         * 不跑到 100%
         * 必須等真正完成
         * ====================================
         */

        let progress = 0;


        progressTimer =
            setInterval(
                function(){

                    if(
                        progress < 65
                    ){

                        progress +=
                            Math.max(
                                1,
                                (
                                    65 -
                                    progress
                                ) * 0.08
                            );

                    }

                    else if(
                        progress < 88
                    ){

                        progress +=
                            0.12;

                    }

                    else{

                        progress =
                            88;

                    }


                    loadingBar.style.width =
                        `${progress}%`;

                },
                100
            );

    }


    /* ========================================
       完成
    ======================================== */

    function finish(){

        if(
            !loadingBar
        ){

            return;

        }


        if(
            activeCount <= 0
        ){

            activeCount = 0;

            return;

        }


        activeCount--;


        /*
         * 還有其他 Loading
         */

        if(
            activeCount > 0
        ){

            return;

        }


        clearInterval(
            progressTimer
        );


        loadingBar.classList.remove(
            "challenge-loading-active"
        );


        loadingBar.classList.add(
            "challenge-loading-complete"
        );


        loadingBar.style.width =
            "100%";


        loadingBar.style.opacity =
            "1";


        /*
         * 完成後淡出
         */

        finishTimer =
            setTimeout(
                function(){

                    loadingBar.style.opacity =
                        "0";


                    setTimeout(
                        function(){

                            if(
                                !loadingBar
                            ){

                                return;

                            }


                            loadingBar.classList.remove(
                                "challenge-loading-complete"
                            );


                            loadingBar.style.width =
                                "0%";

                        },
                        250
                    );

                },
                180
            );

    }


    /* ========================================
       強制停止
    ======================================== */

    function stop(){

        activeCount = 0;


        clearInterval(
            progressTimer
        );


        clearTimeout(
            finishTimer
        );


        if(
            !loadingBar
        ){

            return;

        }


        loadingBar.classList.remove(
            "challenge-loading-active"
        );


        loadingBar.classList.add(
            "challenge-loading-complete"
        );


        loadingBar.style.width =
            "100%";


        loadingBar.style.opacity =
            "0";


        setTimeout(
            function(){

                if(
                    loadingBar
                ){

                    loadingBar.style.width =
                        "0%";

                    loadingBar.classList.remove(
                        "challenge-loading-complete"
                    );

                }

            },
            250
        );

    }


    /* ========================================
       全域 API
    ======================================== */

    window.ELOChallengeLoading = {

        start:
            start,

        finish:
            finish,

        stop:
            stop

    };

})();
