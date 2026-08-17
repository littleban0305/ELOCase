/* ========================================
   ELOCase Challenge UI
======================================== */


function isChallengeMode(){


    const params =
        new URLSearchParams(
            window.location.search
        );


    return (
        params.get("mode")
        ===
        "challenge"
    );

}





function applyChallengeModeUI(){


    if(
        !isChallengeMode()
    ){

        return;

    }



    document.body.classList.add(
        "challenge-mode"
    );



    updateChallengeNavbar();



    updateChallengeLabels();


}







function updateChallengeNavbar(){


    const brand =
        document.querySelector(
            ".brand"
        );


    if(!brand){

        return;

    }



    brand.innerHTML =

    `
    <span class="elo-brand">
        ELOCase
    </span>

    <span class="challenge-brand-text">
        Challenge Mode
    </span>
    `;


}







function updateChallengeLabels(){


    const labels =
        document.querySelectorAll(
            ".section-label"
        );



    labels.forEach(
        label=>{


            if(
                label.innerText
                ===
                "開箱"
            ){

                label.innerText =
                    "Challenge Mode";


            }


        }
    );


}
