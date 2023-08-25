let myForm = document.getElementById('myForm');

//eventListners
myForm.addEventListener('submit',onSubmit);


//input values
let userName = document.getElementById('name');
let userEmail = document.getElementById('email');
let userPassword = document.getElementById('password');



let myObj = {
    name: userName.value,
    email: userEmail.value,
    password: userPassword.value
}


//event function
async function onSubmit(e){
    e.preventDefault();
    
    myObj.name = userName.value;
    myObj.email = userEmail.value;
    myObj.password = userPassword.value;
    //console.log(myObj)

    //adding to crud
    let post = await axios.post("http://localhost:3000/user/signup", myObj)
    console.log(post.data);
    //displayData(post.data);

    //clearing the form
}
