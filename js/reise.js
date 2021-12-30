const btn = document.querySelector('.btn-list');
const list = document.querySelector('.container ul');
let input = [];
var storedReisen = []
const BASE_URL = "https://travel-addict-backend-server.herokuapp.com";
// const BASE_URL = "http://localhost:8080";

document.addEventListener('DOMContentLoaded', async () => {
    const getReisen = await fetch(`${BASE_URL}/reisen`, {
        method: 'GET',
        mode: "cors",
        credentials: 'include'
    }).then(response => response.json())
        .then(reisenList => {

            console.log('Success:', reisenList);
            storedReisen = reisenList;

            for (let i = 0; i < storedReisen.length; i++) {

                const li = document.createElement('li');

                //input Elements, ids, types
                var inputName = document.createElement('input');
                inputName.type = "text";
                inputName.id = "inputName";
                var inputStartDatum = document.createElement('input');
                inputStartDatum.type = "date";
                inputStartDatum.id = "inputStartDatum";
                var inputEndDatum = document.createElement('input');
                inputEndDatum.type = "date";
                inputEndDatum.id = "inputEndDatum";
                var inputLand = document.createElement('input');
                inputLand.type = "text";
                inputLand.id = "inputLand";
                inputLand.setAttribute('list', 'dList');
                //var reiseId;
                //inputLand.maxLength = "2";

                li.id = "card";
                try {
                    //var item = JSON.parse(localStorage.getItem(key));
                    //var item = JSON.parse(storedReisen[i])
                    var item = storedReisen[i];
                    //console.log(userId);

                }
                catch (e) {
                    console.log("invalid item error");
                }

                if (item.length != 0) {

                    //if storedReisen[i].user_id == current user id, then display cards
                    //if(item.user_id == await authService.getUserIdInSession(session))
                    {

                        li.innerHTML = "Name: " + "\n";
                        li.name = item.name;
                        list.appendChild(li);

                        li.appendChild(inputName);
                        inputName.defaultValue = item.name;
                        li.innerHTML = li.innerHTML + "Startdatum: " + "\n";
                        li.appendChild(inputStartDatum);
                        inputStartDatum.defaultValue = item.startDatum.substring(0, 10);
                        li.innerHTML = li.innerHTML + "Enddatum: " + "\n";
                        li.appendChild(inputEndDatum);
                        inputEndDatum.defaultValue = item.endDatum.substring(0, 10);
                        li.innerHTML = li.innerHTML + "Land: " + "\n";
                        li.appendChild(inputLand);
                        inputLand.defaultValue = item.land[0] + item.land[1];

                        //save button
                        const save = document.createElement('button')
                        save.id = "save";
                        save.innerHTML = "Save";
                        li.appendChild(save);
                        var savedInput = [];

                        const saves = document.querySelectorAll('#save');
                        for (let i = 0; i < saves.length; i++) {
                            saves[i].addEventListener('click', (s) => {
                                const inputs = saves[i].parentElement.querySelectorAll('input');
                                var lastReise = item.name;

                                var savedReise =
                                {
                                    name: inputs[0].value,
                                    startDatum: inputs[1].value,
                                    endDatum: inputs[2].value,
                                    land: inputs[3].value[0] + inputs[3].value[1]
                                }

                                //savedInput.push(savedReise);
                                //localStorage.setItem("Reisen", JSON.stringify(savedInput));
                                putReise(lastReise.id, savedReise);
                                //localStorage.removeItem(lastName);
                                deleteReise(lastReise.id);
                                lastReise = savedReise;
                                //lastName = savedReise.name;

                                //savedInput.pop();
                            });
                        }


                        //span
                        const span = document.createElement('span');
                        span.innerHTML = 'X';
                        span.contentEditable = false;
                        li.appendChild(span);
                        const remove = document.querySelectorAll('span');

                        for (let i = 0; i < remove.length; i++) {
                            remove[i].addEventListener('click', () => {

                                remove[i].parentElement.remove();
                                //localStorage.removeItem(remove[i].parentElement.name);
                                //localStorage.setItem("Reisen", JSON.stringify(savedInput));
                                for (let j = 0; j < storedReisen.length; j++) {
                                    //console.log(storedReisen.length);
                                    //console.log(storedReisen[j].name);
                                    //console.log(remove[i].parentElement.name);
                                    if (storedReisen[j].name == remove[i].parentElement.name) {
                                        console.log(storedReisen[j].id);
                                        deleteReise(storedReisen[j].id);
                                        break;
                                    }
                                }

                            })
                        }
                    }
                }
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
})

var reiseObject = {}

const postReise = async (reiseObject) => {
    const postReiseResponse = await fetch(`${BASE_URL}/reisen`, {
        method: 'POST',
        mode: "cors",
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reiseObject
            /*
            "name": "Will's Reise to Bali",
            "startDatum": "2018-04-19",
            "endDatum": "2018-05-19",
            "land": "DE",
            "user_id": "24ce658d-9a12-4783-96ad-924464e68080"
            */
        )
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            //console.log(data.id);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const deleteReise = async (reiseId) => {
    const deleteReiseResponse = await fetch(`${BASE_URL}/reisen/${reiseId}`, {
        method: 'DELETE',
        mode: "cors",
        credentials: 'include',
    })
}

const putReise = async (reiseId, reiseObject) => {
    const putReise = await fetch(`${BASE_URL}/reisen/${reiseId}`, {
        method: 'PUT',
        mode: "cors",
        credentials: 'include',
        body: JSON.stringify({ reiseObject })
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}



// plus button
btn.addEventListener('click', async (e) => {
    if (document.getElementById('name').value != "" && document.getElementById('startDatum').value != ""
        && document.getElementById('endDatum').value != "" && document.getElementById('land').value != "") {
        e.preventDefault();

        let loggedInUserEmail = await fetch(`${BASE_URL}/loggedInUserEmail`, {
            method: 'GET',
            mode: "cors",
            credentials: 'include',
        }).then(response => response.json())
            .then(data => {
                console.log('Success:', data.email);
                //console.log(data.id);
                reiseObject =
                {
                    name: document.getElementById('name').value,
                    startDatum: document.getElementById('startDatum').value,
                    endDatum: document.getElementById('endDatum').value,
                    land: document.getElementById('land').value[0] + document.getElementById('land').value[1],
                    user_email: data.email
                }
                //input.push(reise);
                document.forms[0].reset();
                //localStorage.setItem(reise.name, JSON.stringify(input));
                //localStorage.setItem("Reisen", JSON.stringify(input));
                postReise(reiseObject);

                //input.pop();

                //li
                const li = document.createElement('li');
                li.id = "card";
                //input Elements, ids, types
                var inputName = document.createElement('input');
                inputName.type = "text";
                inputName.id = "inputName";
                var inputStartDatum = document.createElement('input');
                inputStartDatum.type = "date";
                inputStartDatum.id = "inputStartDatum";
                var inputEndDatum = document.createElement('input');
                inputEndDatum.type = "date";
                inputEndDatum.id = "inputEndDatum";
                var inputLand = document.createElement('input');
                inputLand.type = "text";
                inputLand.id = "inputLand";
                inputLand.setAttribute('list', 'dList');
                //inputLand.maxLength = "2";

                //appending children
                li.innerHTML = "Name: " + "\n";
                li.name = reiseObject.name;
                list.appendChild(li);

                li.appendChild(inputName);
                inputName.defaultValue = reiseObject.name;
                li.innerHTML = li.innerHTML + "Startdatum: " + "\n";
                li.appendChild(inputStartDatum);
                inputStartDatum.defaultValue = reiseObject.startDatum;
                li.innerHTML = li.innerHTML + "Enddatum: " + "\n";
                li.appendChild(inputEndDatum);
                inputEndDatum.defaultValue = reiseObject.endDatum;
                li.innerHTML = li.innerHTML + "Land: " + "\n";
                li.appendChild(inputLand);
                inputLand.defaultValue = reiseObject.land[0] + reiseObject.land[1]

                //save button
                const save = document.createElement('button')
                save.id = "save";
                save.innerHTML = "Save";
                li.appendChild(save);
                var savedInput = [];
                //var savedReise = [];

                const saves = document.querySelectorAll('#save');
                for (let i = 0; i < saves.length; i++) {
                    saves[i].addEventListener('click', (s) => {
                        const inputs = saves[i].parentElement.querySelectorAll('input');
                        var lastReise = reiseObject;
                        var savedReise =
                        {
                            name: inputs[0].value,
                            startDatum: inputs[1].value,
                            endDatum: inputs[2].value,
                            land: inputs[3].value[0] + inputs[3].value[1]
                        }

                        //savedInput.push(savedReise);
                        //localStorage.setItem(savedReise.name, JSON.stringify(savedInput));
                        //localStorage.setItem("Reisen", JSON.stringify(savedInput));
                        putReise(lastReise.id, savedReise);
                        //localStorage.removeItem(lastName);
                        deleteReise(lastReise.id);
                        //lastName = savedReise.name;
                        lastReise = savedReise;
                        //savedInput.pop();

                    });
                }
            })
    }

    //span
    const span = document.createElement('span');
    span.innerHTML = 'X';
    span.contentEditable = false;
    li.appendChild(span);
    const remove = document.querySelectorAll('span');

    for (let i = 0; i < remove.length; i++) {
        remove[i].addEventListener('click', () => {
            remove[i].parentElement.remove();
            //localStorage.removeItem(remove[i].parentElement.name);
            //localStorage.setItem("Reisen", JSON.stringify(savedInput));
            for (let j = 0; j < storedReisen.length; j++) {
                //console.log(storedReisen.length);
                //console.log(storedReisen[j].name);
                //console.log(remove[i].parentElement.name);
                if (storedReisen[j].name == remove[i].parentElement.name) {
                    console.log(storedReisen[j].id);
                    deleteReise(storedReisen[j].id);
                    break;
                }
            }
        })
    }
});