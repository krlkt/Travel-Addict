const btn = document.querySelector('.btn-list');
const list = document.querySelector('.container ul');
let input = [];
var storedReisen = []
const BASE_URL = "https://travel-addict-backend-server.herokuapp.com";

document.addEventListener('DOMContentLoaded', async () => {
    /*
    const getReisen = async () => {
        const response = await fetch(`http://localhost:8080/reisen`);
        const json = await response.json();
        return json;
    }*/
    const getReise = await fetch(`${BASE_URL}/reisen`, {
        method: 'GET'
    }).then(response => response.json())
        .then(reisenList => {
            console.log('Success:', reisenList);
            storedReisen = reisenList;
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
        body: JSON.stringify(
            reiseObject
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const deleteReise = async (reiseId) => {
    const deleteReise = await fetch(`${BASE_URL}/reisen/${reiseId}`, {
        method: 'DELETE',
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

const putReise = async (id, reiseObject) => {
    const putReise = await fetch(`${BASE_URL}/reisen/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ reiseObject })
    }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

Object.keys(storedReisen).forEach(function (key) {
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
    //inputLand.maxLength = "2";

    li.id = "card";
    try {
        //var item = JSON.parse(localStorage.getItem(key));
        var item = JSON.parse(storedReisen[key])
        console.log(item);
    }
    catch (e) {

    }

    if (item.length != 0) {
        //var item = JSON.parse(localStorage.getItem(key));

        li.innerHTML = "Name: " + "\n";
        li.name = item[0].name;
        list.appendChild(li);

        li.appendChild(inputName);
        inputName.defaultValue = item[0].name;
        li.innerHTML = li.innerHTML + "Startdatum: " + "\n";
        li.appendChild(inputStartDatum);
        inputStartDatum.defaultValue = item[0].startDatum;
        li.innerHTML = li.innerHTML + "Enddatum: " + "\n";
        li.appendChild(inputEndDatum);
        inputEndDatum.defaultValue = item[0].endDatum;
        li.innerHTML = li.innerHTML + "Land: " + "\n";
        li.appendChild(inputLand);
        inputLand.defaultValue = item[0].land[0] + item[0].land[1];

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
                var lastReise = item[0];

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
                deleteReise(remove[i].parentElement.id);
            })
        }
    }
});

// plus button
btn.addEventListener('click', (e) => {
    if (document.getElementById('name').value != "" && document.getElementById('startDatum').value != ""
        && document.getElementById('endDatum').value != "" && document.getElementById('land').value != "") {
        e.preventDefault();

        reiseObject =
        {
            name: document.getElementById('name').value,
            startDatum: document.getElementById('startDatum').value,
            endDatum: document.getElementById('endDatum').value,
            land: document.getElementById('land').value[0] + document.getElementById('land').value[1]
        }
        //input.push(reise);
        document.forms[0].reset();
        //localStorage.setItem(reise.name, JSON.stringify(input));
        //localStorage.setItem("Reisen", JSON.stringify(input));
        postReise(reiseObject);

        //input.pop();

        //li
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
        //inputLand.maxLength = "2";

        //appending children
        li.id = "card";
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
                deleteReise(remove[i].parentElement.id);
            })
        }
    }
});