document.addEventListener(
"DOMContentLoaded",
async()=>{


    const cases =
        await getCases();


    renderCases(
        cases
    );


});


function renderCases(cases){


    const grid =
        document.querySelector(
            "#case-grid"
        );


    grid.innerHTML="";


    cases.forEach(
        item=>{


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "case-card";


            card.innerHTML =
            `
            <h3>
                ${item.name}
            </h3>

            <p>
                $${item.price}
            </p>
            `;


            card.onclick =
            ()=>{


                const params =
                    new URLSearchParams(
                        location.search
                    );


                let url =
                "case.html?caseId="
                +
                item.caseId;


                if(
                    params.get("mode")
                    ===
                    "challenge"
                ){

                    url +=
                    "&mode=challenge&challengeId="
                    +
                    params.get(
                        "challengeId"
                    );

                }


                location.href=url;


            };


            grid.appendChild(card);


        }
    );


}
