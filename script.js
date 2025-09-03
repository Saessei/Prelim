let form = document.getElementById('getForm'); 
let users = [];
let currentUser = null;

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let numInput = document.getElementById('numUser');
    let numUsers = numInput.value.trim();

    if (numUsers <= 0 || numUsers > 1000) {
        alert("Please enter a valid number of users between 1 and 1000.");
        return;
    }

    fetch('https://randomuser.me/api/?results=' + numUsers)
        .then(response => response.json())
        .then(data => {
            users = data.results;
            renderUsers();
        })
        .catch(error => {
            console.log('Something went wrong:', error);
        });
});

function renderUsers() {
    let tableBody = document.getElementById('userContainer');
    tableBody.innerHTML = '';

    let nameSelect = document.getElementById('nameBasis');
    let nameBasis = nameSelect.value;

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let name = nameBasis === 'first' ? user.name.first : user.name.last;

        let row = document.createElement('tr');
        row.setAttribute('data-index', i);
        row.innerHTML =
            '<td>' + name + '</td>' +
            '<td>' + user.gender + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.location.country + '</td>';


        row.ondblclick = function() {
            let index = this.getAttribute('data-index');
            openUserModal(index);
        };

        tableBody.appendChild(row);
    }        
}

document.getElementById('nameBasis').addEventListener('change', renderUsers);

function openUserModal(index) {
    currentUser = index;
    let user = users[index];
    let modalBody = document.getElementById('modalBody');

    let fullAddress = user.location.street.number + ' ' + user.location.street.name + ', ' +
                      user.location.city + ', ' + user.location.state + ', ' +
                      user.location.country + ', ' + user.location.postcode;

    modalBody.innerHTML = `
        <div class="user-card">
            <div class="user-avatar">
                <img src="${user.picture.large}" class="rounded-circle" style="width:100px;height:100px;">
            </div>

            <div class="user-pill">${user.name.title} ${user.name.first} ${user.name.last}</div>
            <div class="user-pill"><b>Address</b><br>${fullAddress}</div>
            <div class="user-pill"><b>Email</b><br>${user.email}</div>
            <div class="user-pill"><b>Phone</b><br>${user.phone}</div>
            <div class="user-pill"><b>Telephone Number</b><br>${user.cell}</div>
            <div class="user-pill"><b>Date of birth</b><br>${new Date(user.dob.date).toLocaleDateString()}</div>
            <div class="user-pill"><b>Gender</b><br>${user.gender}</div>
        </div>`;

    let modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
}

document.getElementById('deleteUserBtn').onclick = function() {
    if (currentUser !== null) {
        users.splice(currentUser, 1);
        renderUsers();
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    }
};

document.getElementById('editUserBtn').onclick = function() {
    if (currentUser !== null) {
        let user = users[currentUser];
        let modalBody = document.getElementById('modalBody');
        let fullAddress = user.location.street.number + ' ' + user.location.street.name + ', ' +
                          user.location.city + ', ' + user.location.state + ', ' +
                          user.location.country + ', ' + user.location.postcode;

        modalBody.innerHTML = `
            <div class="user-card">
                <div class="user-avatar text-center mb-3">
                    <img src="${user.picture.large}" class="rounded-circle" style="width:100px;height:100px;"></div>

                <div>
                    <input type="text" class="form-control rounded-pill" id="editTitle" style= "width: 500px;" value="${user.name.title}">
                </div>
                <div>
                    <input type="text" class="form-control rounded-pill" id="editFirst" style= "width: 500px;" value="${user.name.first}">
                </div>
                <div>
                    <input type="text" class="form-control rounded-pill" id="editLast" style= "width: 500px;" value="${user.name.last}">
                </div>
                <div >
                    <input type="text" class="form-control rounded-pill" id="editGender" style= "width: 500px;" value="${user.gender}">
                </div>
                <div >
                    <input type="text" class="form-control rounded-pill" id="editFullAddress" style= "width: 500px;" value="${fullAddress}">
                </div>
                <div>
                    <input type="email" class="form-control rounded-pill" id="editEmail" style= "width: 500px;" value="${user.email}">
                </div>
                <div>
                    <input type="text" class="form-control rounded-pill" id="editPhone" style= "width: 500px;" value="${user.phone}">
                </div>
                <div>
                    <input type="text" class="form-control rounded-pill" id="editCell" style= "width: 500px;" value="${user.cell}">
                </div>
                <div>
                    <input type="date" class="form-control rounded-pill" id="editDob" style= "width: 500px;" value="${user.dob.date.substring(0, 10)}">
                </div>
                <div class="text-center">
                    <button class="btn btn-primary rounded-pill px-4" id="saveEditBtn">Save</button>
                </div>
            </div>`;

        document.getElementById('saveEditBtn').onclick = function() {
            user.name.title = document.getElementById('editTitle').value;
            user.name.first = document.getElementById('editFirst').value;
            user.name.last = document.getElementById('editLast').value;
            user.gender = document.getElementById('editGender').value;
            user.fullAddress = document.getElementById('editFullAddress').value;
            user.email = document.getElementById('editEmail').value;
            user.phone = document.getElementById('editPhone').value;
            user.cell = document.getElementById('editCell').value;
            user.dob.date = document.getElementById('editDob').value;

            let editedAddress = document.getElementById('editFullAddress').value;
            let parts = editedAddress.split(',').map(p => p.trim()); 

            if (parts.length >= 5) {
                let addressParts = parts[0].split(" ");
                user.location.country = parts[3];
            }

            bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        };
    }
};

document.getElementById('userModal').addEventListener('hidden.bs.modal', function () {
    renderUsers();
});