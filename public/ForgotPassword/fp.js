let form = document.getElementById('forgotForm');
        let button = document.getElementById('button');
        let email = document.getElementById('email')
        form.addEventListener('submit', onSubmit)
          async function onSubmit(e)  {
            e.preventDefault();
            const obj = {
            email: email.value
        }
            console.log(obj);
            const post = await axios.post('http://localhost:3000/password/forgotPassword', obj)
            console.log(post.data);
        }