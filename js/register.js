document
.querySelector("#register-form")
.addEventListener(
"submit",
async function(e){

    e.preventDefault();


    const username =
        document.querySelector("#username").value.trim();


    const displayName =
        document.querySelector("#displayName").value.trim();


    const email =
        document.querySelector("#email").value.trim();


    const password =
        document.querySelector("#password").value;


    const confirmPassword =
        document.querySelector("#confirmPassword").value;

    if(
        !username ||
        !displayName ||
        !password
    ){
    
        alert(
            "請填寫完整資料"
        );
    
        return;
    
    }

    if(password.length < 6){
    
        alert(
            "密碼至少需要 6 個字元"
        );
    
        return;
    
    }

    if(password !== confirmPassword){

        alert(
            "兩次密碼不一致"
        );

        return;

    }



    try {

        const button =
            document.querySelector(
                "#register-button"
            );
        
        
        button.disabled = true;
        button.textContent =
            "註冊中...";

        const result =
            await registerPlayer(
                username,
                displayName,
                email,
                password
            );


        console.log(
            "註冊成功：",
            result
        );


        alert(
            "註冊成功！"
        );


        location.href =
            "login.html";


    }catch(error){

        button.disabled = false;
    
        button.textContent =
            "註冊";

        console.error(
            error
        );


        alert(
            error.message
        );


    }


});
