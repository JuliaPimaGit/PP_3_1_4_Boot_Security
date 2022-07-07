const url = 'http://localhost:8080/user/logIn'
let userAuth = document.querySelector('#userInfo')
fetch(url)
    .then(res => res.json())
    .then(user => {
        userAuth.innerHTML =
            `<td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.age}</td>
        <td>${user.email}</td>
        <td>${user.roles.map (a => a.role)}</td>`
    })
