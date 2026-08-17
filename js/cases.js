/* ========================================
   ELOCase - Cases List
======================================== */


/*
========================================
初始化
========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async()=>{


        try{


            const user =
                await verifySession();


            updateLoginUI(
                user
            );


            const cases =
                await getCases();


            renderCases(
                cases
            );


        }
        catch(error){


            console.error(
                "開箱列表載入失敗：",
                error
            );


            const grid =
                document.querySelector(
                    "#case-grid"
                );


            if(grid){

                grid.innerHTML =
                `
                <div class="case-loading">

                    箱子資料載入失敗

                </div>
                `;

            }


        }


    }
);





/*
========================================
渲染箱子列表
========================================
*/


function renderCases(cases) {

    const grid =
        document.querySelector(
            "#case-grid"
        );


    if(!grid){
        return;
    }


    grid.innerHTML = "";


    if(
        !cases ||
        cases.length === 0
    ){

        grid.innerHTML = `
            <div class="case-empty">
                目前沒有箱子
            </div>
        `;

        return;

    }



    cases.forEach(
        item=>{


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "case-card";



            card.innerHTML = `


                <div class="case-image">


                    ${
                        item.imageUrl

                        ?

                        `
                        <img
                            src="${escapeHtml(
                                item.imageUrl
                            )}"
                            alt=""
                        >
                        `

                        :

                        `
                        ELOCase
                        `

                    }


                </div>



                <div class="case-info">


                    <h3>

                        ${escapeHtml(
                            item.name ||
                            "未命名箱子"
                        )}

                    </h3>



                    <div class="case-bottom">


                        <span class="case-price">

                            $${Number(
                                item.price || 0
                            ).toLocaleString()}

                        </span>



                        <span class="case-action">

                            開啟 →

                        </span>


                    </div>


                </div>



            `;



            card.onclick =
            ()=>{


                window.location.href =
                    "case.html?caseId="
                    +
                    item.caseId;


            };



            grid.appendChild(
                card
            );


        }
    );

}





/*
========================================
HTML 防護
========================================
*/


function escapeHtml(
    value
){


    return String(
        value ?? ""
    )
    .replaceAll(
        "&",
        "&amp;"
    )
    .replaceAll(
        "<",
        "&lt;"
    )
    .replaceAll(
        ">",
        "&gt;"
    )
    .replaceAll(
        '"',
        "&quot;"
    )
    .replaceAll(
        "'",
        "&#039;"
    );


}
