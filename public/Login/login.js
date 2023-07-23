let myForm = document.getElementById('myForm');
  let ul = document.getElementById('list')
  let username = document.getElementById("email");
  let password = document.getElementById("password");
  let forgot = document.getElementById('fp');

  myForm.addEventListener('submit', onSubmit)

  let myObj = {
    name: username,
    password: password
  }
  async function onSubmit(e){
    
    try{
      e.preventDefault();
    myObj.name = username.value;
    myObj.password = password.value;
  let post = await axios.post('http://65.2.141.71:3000/user/login', myObj);
  console.log(post.data)
  localStorage.setItem('token', post.data.token);
  displayData(post)
  alert('User logged in successfully');
  window.location.href = "http://65.2.141.71:3000/Expense/expense.html"
    }
  catch(e){
    displayData(e.response);
}
  }

  function displayData(o){
    let li = document.createElement('li')
    li.innerHTML ='Status-'+ o.status + ' '+ o.data.message;
    ul.appendChild(li);
  }
  fp.onclick = () => {
    window.location.href = `http://65.2.141.71:3000/ForgotPassword/forgot-password.html`;
  }