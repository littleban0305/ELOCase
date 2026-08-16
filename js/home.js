async function loadLuckyPlayers(){


    const track =
        document.querySelector(
            "#lucky-track"
        );


    if(!track){
        return;
    }


    try{


        const history =
            await getOpenHistory();



        track.innerHTML = "";



        history.forEach(
            item => {


                const element =
                    document.createElement(
                        "div"
                    );


                element.className =
                    "lucky-item";



                element.innerHTML = `


                    <span class="lucky-player">

                        ${item.username}

                    </span>



                    <span class="lucky-text">

                        獲得

                    </span>



                    <div class="lucky-image">

                        <img
                            src="${item.itemImage}"
                            alt=""
                        >

                    </div>



                    <span class="item-rarity">

                        ${item.itemName}

                    </span>



                    <span class="lucky-value">

                        $${Number(
                            item.value
                        ).toLocaleString()}

                    </span>


                `;



                track.appendChild(
                    element
                );


            }
        );


    }catch(error){


        console.error(
            "幸運玩家載入失敗",
            error
        );


        track.innerHTML = `

            <div class="case-loading">

                無法載入紀錄

            </div>

        `;


    }


}
