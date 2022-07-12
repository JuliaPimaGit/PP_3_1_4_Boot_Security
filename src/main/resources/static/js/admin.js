// ALL users
function getUsersTable() {
    fetch('http://localhost:8080/admin/users')
        .then(res => res.json())
        .then(data => {
            data.forEach(function (user) {
                let row = document.querySelector('#usersTable').insertRow();
                row.setAttribute("id", user.id);
                row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.age}</td>
    <td>${user.email}</td>
    <td>${user.roles.map(a => a.role)}</td>
    <td><button type="button" style="background-color: #48b0a5" onclick="getEditModal(${user.id})" class="btn btn-info">Edit</button></td>
    <td><button type="button" style="background-color: #de182f" onclick="getDeleteModal(${user.id})" class="btn btn-danger">Delete</button></td>
`
            })
        })
}

getUsersTable()


// EDIT modal
function getEditModal(id) {
    fetch('http://localhost:8080/admin/users/' + id)
        .then(response => response.json())
        .then(user => {
            $("#editModal").modal()
            document.getElementById("eId").value = user.id
            document.getElementById("eFirstName").value = user.firstName
            document.getElementById("eLastName").value = user.lastName
            document.getElementById("eAge").value = user.age
            document.getElementById("eEmail").value = user.email
            document.getElementById("ePassword").value = user.password
            $('#eRoles').empty()
            let allRolesListE = ["ROLE_ADMIN", "ROLE_USER"]
            let userRoles = ''
            user.roles.forEach(role => {
                userRoles += role.role
            })
            allRolesListE.forEach(function (value) {
                if (userRoles.includes(value)) {
                    $('#eRoles').append('<option id="option"' + value + ' value="' + value + '" selected>' + value + '</option>')
                } else {
                    $('#eRoles').append('<option id="option"' + value + ' value="' + value + '">' + value + '</option>')
                }
            })
        })
}

function editUser() {
    let newRoles = [];
    for (let i = 0; i < window.editForm.eRoles.length; i++) {
        let option = window.editForm.eRoles.options[i];
        if (option.selected) {
            newRoles.push(option.value)
        }
    }
    let eid = window.editForm.eId.value;
    fetch('http://localhost:8080/admin/update?editRoles=' + newRoles, {
        method: 'PUT',
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            id: document.getElementById('eId').value,
            firstName: document.getElementById('eFirstName').value,
            lastName: document.getElementById('eLastName').value,
            age: document.getElementById('eAge').value,
            email: document.getElementById('eEmail').value,
            password: document.getElementById('ePassword').value,
        })
    })
        .then($('#' + eid).replaceWith('<tr id=' + eid + '>' +
            '<td>' + eid + '</td>' +
            '<td>' + window.editForm.eFirstName.value + '</td>' +
            '<td>' + window.editForm.eLastName.value + '</td>' +
            '<td>' + window.editForm.eAge.value + '</td>' +
            '<td>' + window.editForm.eEmail.value + '</td>' +
            '<td>' + newRoles + '</td>' +
            '<td> <button type="button" onclick="getEditModal(' + eid + ')" ' +
            'class="btn btn-info">Edit</button> </td>' +
            '<td> <button type="button" onclick="getDeleteModal(' + eid + ')" ' +
            'class="btn btn-danger">Delete</button> </td>' +
            '</tr>')
        )
}


// DELETE modal
function getDeleteModal(id) {
    fetch('http://localhost:8080/admin/users/' + id)
        .then(response => response.json())
        .then(user => {
            $("#deleteModal").modal()
            document.getElementById("dId").value = user.id
            document.getElementById("dFirstName").value = user.firstName
            document.getElementById("dLastName").value = user.lastName
            document.getElementById("dAge").value = user.age
            document.getElementById("dEmail").value = user.email
            $('#dRoles').empty()
            let rolesListD = user.roles.map(a => '<option>' + a.role + '</option>')
            $("#dRoles").append(rolesListD)
        })
        .then($('#usersTable').empty())
    setTimeout(getUsersTable, 50)
}

function deleteUser() {
    let uid = window.deleteForm.dId.value
    fetch('http://localhost:8080/admin/delete/' + uid, {
        method: 'DELETE',
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then($('#' + uid).remove())
}

// ADD Form
const addUserForm = document.querySelector('#add_user')

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let newRoles = [];
    for (let i = 0; i < window.formNewUser.nRoles.length; i++) {
        let option = window.formNewUser.nRoles.options[i];
        if (option.selected) {
            newRoles.push(option.value)
        }
    }

    fetch('http://localhost:8080/admin/users/add?roles=' + newRoles, {
        method: 'POST',
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
            firstName: document.getElementById('nFirstName').value,
            lastName: document.getElementById('nLastName').value,
            age: document.getElementById('nAge').value,
            email: document.getElementById('nEmail').value,
            password: document.getElementById('nPassword').value,
        })
    })
        .then(res => res.json())
        .then(user => {
            $(`#usersTable tr:last`).after(`<tr id=` + user.id + `>` +
                `<td>` + user.id + `</td>` +
                `<td>` + document.getElementById('nFirstName').value + `</td>` +
                `<td>` + document.getElementById('nLastName').value + `</td>` +
                `<td>` + document.getElementById('nAge').value + `</td>` +
                `<td>` + document.getElementById('nEmail').value + `</td>` +
                `<td>` + newRoles + `</td>` +
                `<td> <button type="button" onclick="getEditModal(` + user.id + `)" ` +
                `class="btn btn-info">Edit</button> </td>` +
                `<td> <button type="button" onclick="getDeleteModal(` + user.id + `)" ` +
                `class="btn btn-danger">Delete</button> </td>` +
                `</tr>`);

            window.formNewUser.nFirstName.value = "";
            window.formNewUser.nLastName.value = "";
            window.formNewUser.nAge.value = "";
            window.formNewUser.nEmail.value = "";
            window.formNewUser.nPassword.value = "";
            window.formNewUser.nRoles.value = "";

            // window.open("#user_table")
        })
})


// .then(data => {
// let user = {
//     id: document.getElementById('nId').value,
//     firstName: document.getElementById('nFirstName').value,
//     lastName: document.getElementById('nLastName').value,
//     age: document.getElementById('nAge').value,
//     email: document.getElementById('nEmail').value,
//     password: document.getElementById('nPassword').value
// }
// user.roles = newRoles;

// addNewRow(user);
// })

// function addNewRow(user) {
//     let newTable = document.getElementById("usersTable");
//     let newRow = document.createElement("tr");
//     newRow.setAttribute("id", user.id);
//     let newId = document.createElement("td");
//     newId.innerHTML = user.id;
//     let newFN = document.createElement("td");
//     newFN.innerHTML = user.firstName;
//     let newLN = document.createElement("td");
//     newLN.innerHTML = user.lastName;
//     let newAge = document.createElement("td");
//     newAge.innerHTML = user.age;
//     let newEmail = document.createElement("td");
//     newEmail.innerHTML = user.email;
//     let newUserRoles = document.createElement("td");
//     newUserRoles.innerHTML = user.roles
//
//     newRow.appendChild(newId);
//     newRow.appendChild(newFN);
//     newRow.appendChild(newLN);
//     newRow.appendChild(newAge);
//     newRow.appendChild(newEmail);
//     newRow.appendChild(newUserRoles);
//     newTable.appendChild(newRow);


// //     let newRow = document.querySelector('#usersTable').insertRow();
//         let newRow = document.createElement("tr");
//         newRow.setAttribute("id", user.id);
//         newRow.innerHTML = `<td>${user.id}</td>
//  <td>${user.firstName}</td>
//  <td>${user.lastName}</td>
//  <td>${user.age}</td>
//  <td>${user.email}</td>
//  <td>${user.roles.map(a => a.role)}</td>
//  <td><button type="button" style="background-color: #48b0a5" onclick="getEditModal(${user.id})" class="btn btn-info">Edit</button></td>
//  <td><button type="button" style="background-color: #de182f" onclick="getDeleteModal(${user.id})" class="btn btn-danger">Delete</button></td>
//  `
//     }
// })



