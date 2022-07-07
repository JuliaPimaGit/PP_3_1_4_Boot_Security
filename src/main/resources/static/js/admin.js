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
    <td><button type="button" style="background-color: #abd98c" onclick="getEditModal(${user.id})" class="btn btn-info">Edit</button></td>
    <td><button type="button" style="background-color: #de8118" onclick="getDeleteModal(${user.id})" class="btn btn-danger">Delete</button></td>
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

        .then($('#usersTable tr:last').after('<tr id=' + window.formNewUser.nId.value + '>' +
            '<td>' + window.formNewUser.nId.value + '</td>' +
            '<td>' + window.formNewUser.nFirstName.value + '</td>' +
            '<td>' + window.formNewUser.nLastName.value + '</td>' +
            '<td>' + window.formNewUser.nAge.value + '</td>' +
            '<td>' + window.formNewUser.nEmail.value + '</td>' +
            '<td>' + newRoles + '</td>' +
            '<td> <button type="button" onclick="getEditModal(' + nid + ')" ' +
            'class="btn btn-info">Edit</button> </td>' +
            '<td> <button type="button" onclick="getDeleteModal(' + nid + ')" ' +
            'class="btn btn-danger">Delete</button> </td>' +
            '</tr>'))
})