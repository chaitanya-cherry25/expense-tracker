const baseurl = "https://expense-dev-server.temanedtech.com"
const token = localStorage.getItem("token");

window.onload = () => {

    const token = localStorage.getItem("token");
    if (!token) {


        window.location.assign(window.location.origin + "/html/index.html");
    }
    fetchData()
}

const logout = () => {
    localStorage.clear();
    window.location.reload();
}


const fetchData = async () => {
    const res = await fetch(baseurl + "/expenses", {
        headers: {
            Authorization: "bearer " + token
        }
    })

    const data = await res.json();
    console.log(data);
    render(data);
}
const render = (data) => {
    const parentdiv = document.createElement("div");
    data.forEach(e => {
        const div = document.createElement("div");
        const keys = Object.keys(e);
        for (const key of keys) {
            const para = document.createElement("p");
            para.innerText = key + " : " + e[key];
            para.classList.add(key);
            div.appendChild(para);
        }
        const button= document.createElement("button")
        button.innerText="Delete Expense";
        button.style.color="red";
        button.dataset.expId= e._id;

        button.addEventListener("click",(event)=> deleteExp(event))


        const update= document.createElement("button")
        update.innerText="update Expense";

        update.setAttribute("type","button");
        update.setAttribute("data-toggle","modal");
        update.setAttribute("data-target","#updateExpmodel")
        update.setAttribute("class","btn btn-primary")
        update.dataset.expId= e._id;
        update.addEventListener("click",()=> updateExp(e))
        
        div.appendChild(update);
        div.appendChild(button);
        parentdiv.appendChild(div);
    });
    root.replaceChildren(parentdiv);
}





var expform = document.getElementById("expform");
expform.addEventListener("submit", (event) => {

    event.preventDefault();
    const formData = {
        name: expform.name.value,
        desc: expform.desc.value,
        amount: expform.amount.value,
        transactionDetails: expform.transactionDetails.value,
        transactionAccount: expform.transactionAccount.value,
        type:expform.type.value

    };

    fetch(baseurl + "/expenses/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "bearer " + token
        },
        body: JSON.stringify(formData)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            fetchData();
        })
        .catch(err => console.log(err))
})


const deleteExp=(event)=>{
    fetch(baseurl + "/expenses/delete/"+ event.target.dataset.expId, {
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
            Authorization: "bearer " + token
        },
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        fetchData();
    })
    .catch(err => console.log(err))
    }




const updateExp = (e) => {
    console.log(e);
    const updateForm = document.getElementById("updateexpform");
    updateForm.name.value = e.name
    updateForm.desc.value = e.desc
    updateForm.amount.value = e.amount
    updateForm.transactionDetails.value = e.transactionDetails
    updateForm.transactionAccount.value = e.transactionAccount
    updateForm.type.value = e.type
    updateForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const formDataa = {
            name: updateForm.name.value,
            desc: updateForm.desc.value,
            type: updateForm.type.value,
            amount: updateForm.amount.value,
            transactionAccount: updateForm.transactionAccount.value,
            transactionDetails: updateForm.transactionDetails.value,
        }
        fetch(baseurl+ "/expenses/update/"+e._id,{
            method:"PUT",
            headers: {
                "Content-Type":"application/json",
                Authorization: "Bearer "+ token
            },
            body: JSON.stringify(formDataa)

        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            window.location.reload();
        })
        .catch(err => console.log(err))
    })
}