let form = document.getElementById('getForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let numInput = document.getElementById('numUser');
    let numUsers = numInput.value;


    fetch('https://randomuser.me/api/?results=' + numUsers)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            let users = data.results;
            let tableBody = document.getElementById('userContainer');
            tableBody.innerHTML = '';

            let nameSelect = document.getElementById('nameBasis');
            let nameBasis = nameSelect.value;

            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                let name;
                if (nameBasis === 'first') {
                    name = user.name.first;
                } else {
                    name = user.name.last;
                }

                let row = '<tr>' +
                    '<td>' + name + '</td>' +
                    '<td>' + user.gender + '</td>' +
                    '<td>' + user.email + '</td>' +
                    '<td>' + user.location.country + '</td>' +
                    '</tr>';
                tableBody.innerHTML += row;
            }
        })
        .catch(function(error) {
            console.log('Error:', error);
        })
    });