try {
    let myForm = document.getElementById('myForm');
    let ul = document.getElementById('items');
    let rzp = document.getElementById('rzp-button');
    let list = document.getElementById('list');
    let download = document.getElementById('download')
    let content = document.getElementById('content');
    let oldData = document.getElementById('prev-download')
    let oldFiles = document.getElementById('oldFiles');
    let numRows = document.getElementById('numrows')
    let dailyButton = document.getElementById('daily')
    let monthlyButton = document.getElementById('monthly')
    let yearlyButton = document.getElementById('yearly')
    
    //eventListners
    myForm.addEventListener('submit',onSubmit);
    dailyButton.addEventListener('click',dailyFunc)
    monthlyButton.addEventListener('click', monthlyFunc)
    yearlyButton.addEventListener('click', yearlyFunc)

    async function dailyFunc(e) {
        e.preventDefault()
        let token = localStorage.getItem('token');
        let dailyData = await axios.get(`http://localhost:3000/expense/daily-expenses`, {headers: {'Authorization': token }})
        console.log(dailyData)
        let p = document.createElement('p')
        p.innerHTML=`${dailyData.data.data[0].date} ----- ${dailyData.data.data[0].total}`
        dailyButton.appendChild(p)
    }
    async function monthlyFunc(e) {
        e.preventDefault()
        let token = localStorage.getItem('token');
        let monthlyData = await axios.get(`http://localhost:3000/expense/monthly-expenses`, {headers: {'Authorization': token }})
        console.log(monthlyData);
        for(let i=0; i<monthlyData.data.data.length; i++){
            let p = document.createElement('p')
            p.innerHTML=`${monthlyData.data.data[i].month} ----- ${monthlyData.data.data[i].total}`
            monthlyButton.appendChild(p)
        }
    }
    async function yearlyFunc(e) {
        e.preventDefault()
        let token = localStorage.getItem('token');
        let yearlyData = await axios.get(`http://localhost:3000/expense/yearly-expenses`, {headers: {'Authorization': token }})
        console.log(yearlyData);
        for(let i=0; i<yearlyData.data.data.length; i++){
            let p = document.createElement('p')
            p.innerHTML=`${yearlyData.data.data[i].year} ----- ${yearlyData.data.data[i].total}`
            yearlyButton.appendChild(p)
        }
    }
    
    //input values
    let expAmount= document.getElementById('expAmount');
    let expDesc = document.getElementById('desc');
    let category = document.getElementById('category');
    let premium = document.getElementById('premium')
    let leadButt = document.getElementById('leaderboard')
    let board = document.createElement('h3');
    premium.style.display = 'block';
    
    
    //onchange function
    limitChange = async() => {
            localStorage.setItem('limit', numRows.value);
            document.getElementById('items').innerHTML = '';
        
        let token = localStorage.getItem('token')
        const pageLoad =  await axios.get(`http://localhost:3000/expense/get-expense?page=1&limit=${localStorage.getItem('limit')}`, {headers: {'Authorization': token}});
         let data = pageLoad.data.data;
         console.log(pageLoad.data.data);
        for(var i=0; i<data.length; i++){
            displayData(data[i]);
        }
        }
    //event function
    async function onSubmit(e){
        try{
            e.preventDefault();
        
        let myObj = {
        amount: expAmount.value,
        desc: expDesc.value,
        category: category.value
        }
        //adding to crud
        let token = localStorage.getItem('token');
        let post = await axios.post("http://localhost:3000/expense/add-expense", myObj, {headers: {'Authorization': token }})
        console.log(post.data)
        ul.removeChild(ul.lastElementChild);
        displayData(post.data);
    
        //clearing the form
        document.myForm.reset();
        }
        catch(err){
            console.log(err);
        }
       
    }
    
    // function to display data from crud
    async function displayData(obj){
        // console.log(obj)
        let li = document.createElement('li');
        li.id = `${obj.id}`;
        let amount = document.createElement('label')
        amount.innerHTML = obj.amount;
        let desc = document.createElement('label')
        desc.innerHTML = obj.desc;
        let category= document.createElement('label')
        category.innerHTML = obj.category;
        let button = document.createElement('button')
        button.class = 'btn';
        button.innerHTML = 'delete'; 
    
        li.appendChild(amount)
        li.appendChild(desc)
        li.appendChild(category)
        li.appendChild(button)
        ul.insertBefore(li, ul.firstChild)
    
        button.onclick = async function(e){
            try{
                let token = localStorage.getItem('token')
            const del = await axios.delete(`http://localhost:3000/expense/delete-expense/${obj.id}`, {headers: {'Authorization': token }})
            console.log(del.data);
            ul.removeChild(li);
            }
            catch(err){
                console.log(err);
            }
            
        }
        
    }
    
    rzp.onclick = async function(e){
       try{
        e.preventDefault();
        let token = localStorage.getItem('token');
        const response =  await axios.get('http://localhost:3000/purchase/buyPremium', {headers: {'Authorization': token}})
        console.log(response.data);
        var options = {
            "key": response.data.key_id,
            "order_id": response.data.order.id,
            "handler": async function(response){
                    const postData = await axios.post('http://localhost:3000/purchase/paymentStatus', {
                    order_id: options.order_id,
                    payment_id: response.razorpay_payment_id
                },{
                    headers: {'Authorization': token}
                })
                alert('You are a premium user now!');
                showPremiumUser();
                console.log(postData);
                localStorage.setItem('token', postData.data.token);
                }
            }
            
            const rzp1 = new Razorpay(options)
            rzp1.open()
            e.preventDefault()
            rzp1.on('payment.failed', async function(response){
                 try{
                    console.log(response);
                let failure = await axios.post('http://localhost:3000/purchase/paymentStatus', {
                    order_id: options.order_id,
                    payment_id: '-1'
                },{
                    headers: {'Authorization': token}
                })
                console.log(failure);
                alert('something went wrong');
                 }
                 catch(err){
                    console.log(err.response.data.message);
                 }
               
            })
       }
       catch(err){
        console.log(err)
       }
        }
    
    
        leadButt.onclick = async () => {
            let token = localStorage.getItem('token');
            const getData = await axios.get("http://localhost:3000/premium/showLeaderBorad", {headers: {'Authorization': token }})
            console.log(typeof getData.data);
            for(let i=0; i< getData.data.length; i++){
                displayLeaderBoard(getData.data[i]);
            }
        }
        function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }
    
    download.onclick = async () => {
        try{
            let token = localStorage.getItem('token');
        const resp = await axios.get('http://localhost:3000/user/download', {headers: {'Authorization': token }})
        if(resp.status === 200){
            var a = document.createElement('a');
            a.href = resp.data.fileURL;
            a.download='myexpense.csv';
            a.click();
        }else{
            throw new Error('Something Went Wrong')
        }
        }
        catch(err){
            console.log(err);
        }    
    }
    
    oldData.onclick = async() => {
        oldFiles.style.visibility = 'visible';
            const token = localStorage.getItem('token');
            const content = await axios.get('http://localhost:3000/user/oldFiles', {headers: {'Authorization': token }})
            console.log(content.data);
            content.data.forEach(element => {
                let tr = document.createElement('tr')
                let date_td = document.createElement('td')
                let url_td = document.createElement('td');
                date_td.innerHTML = element.createdAt;
                url_td.innerHTML = `<a href = ${element.url}>LINK!</a>`;
                oldFiles.appendChild(tr)
                tr.appendChild(date_td)
                tr.appendChild(url_td);
            });
    
    
        }
    
    function showPremiumUser(){
        rzp.style.visibility = 'hidden';
        premium.innerHTML = 'You are a Premium User!';
        leadButt.style.visibility = 'visible';
        download.style.visibility = 'visible';
        //content.style.visibility = 'visible';
        oldData.style.visibility = 'visible'
    }
     
    
    
    window.addEventListener("DOMContentLoaded",async () => {
        const token = localStorage.getItem('token');
        console.log(parseJwt(token))
        const isPremiumUser = parseJwt(token).isPremiumUser;
        if(isPremiumUser){
            showPremiumUser()
        }
        let limit = localStorage.getItem('limit')
        const pageLoad = await axios.get(`http://localhost:3000/expense/get-expense?page=1&limit=${localStorage.getItem('limit')}`, {headers: {'Authorization': token }});
         let data = pageLoad.data.data;
         console.log(pageLoad.data);
         showPagination(pageLoad.data)
        for(var i=0; i<data.length; i++){
            displayData(data[i]);
        }
           
    })

    function showPagination(object)
    {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';
        if(object.hasPreviousPage)
        {
            const btn2=document.createElement('button');
            btn2.innerHTML = object.previousPage;
            btn2.addEventListener('click',() => getExpenses(object.previousPage))
            pagination.appendChild(btn2);
        }
        
            const btn1=document.createElement('button');
            btn1.innerHTML = `<h3>${object.currentPage}</h3>`
            btn1.addEventListener('click',() => getExpenses(object.currentPage))
            pagination.appendChild(btn1);
        
        if(object.hasNext)
        {
            const btn3=document.createElement('button');
            btn3.innerHTML = object.nextPage;
            btn3.addEventListener('click',() => getExpenses(object.nextPage))
            pagination.appendChild(btn3);
        }
    
    }
    async function getExpenses(page){
        ul.innerHTML='';
        const token = localStorage.getItem('token');
        const data = await axios.get(`http://localhost:3000/expense/get-expense?page=${page}&limit=${localStorage.getItem('limit')}`, {headers: {'Authorization': token }})
        for(let i=0; i< data.data.data.length; i++){
            displayData(data.data.data[i])
        }
        showPagination(data.data)
        console.log(data.data.data);
    }
    function displayLeaderBoard(obj){
        console.log(obj)
            
                let li = document.createElement('li')
                li.innerHTML = obj.name + '---' + 'total - expenses' + '---' +obj.totalExpenses
                list.appendChild(li);
    }
     }
    
    
    catch(error) {
        console.log(error)
    }