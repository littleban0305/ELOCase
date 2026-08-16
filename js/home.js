async function loadLuckyPlayers(){

    const track =
        document.querySelector(
            "#lucky-track"
        );


    if(!track){
        return;
    }


    try{

        const drops =
            await getRecentDrops();


        track.innerHTML="";


        drops.forEach(
            drop=>{

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "lucky-item";


                item.innerHTML=`

                    <span class="lucky-player">
                        ${escapeHtml(
                            drop.username
                        )}
                    </span>


                    <span class="lucky-text">
                        獲得
                    </span>


                    <div class="
                        lucky-image
                        ${getRarityClass(
                            drop.rarity
                        )}
                    ">

                        <img
                        src="${drop.itemImage}"
                        >

                    </div>


                    <span class="item-rarity">
                        ${escapeHtml(
                            drop.itemName
                        )}
                    </span>


                    <span class="lucky-value">
                        $${drop.value}
                    </span>


                `;


                track.appendChild(
                    item
                );


            }
        );


    }catch(error){

        console.error(
            "幸運玩家載入失敗",
            error
        );

    }

}
