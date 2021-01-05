function AddInLocalStorage() {
    //stockage du json en localstorage pour plus facilement get / modifier / supprimer les valeurs en temps réel
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
    };

    fetch('https://jsonplaceholder.typicode.com/todos', requestOptions)
        .then(result => {
            if (!result.ok) throw result;
            return result.json();
        })
        .then(tasks => {
            localStorage.setItem('myData', JSON.stringify(tasks));
            var DataInJSON = (localStorage.getItem('myData'));
            DataInJSON = JSON.parse(DataInJSON);

            //      console.log(DataInJSON.length);

        })
        .catch(error => {
            console.log(error);
        });


}

function getTasks() {
    //permet d'initialiser le tableau à l'aide des variables locals 
    var alreadyThere = document.getElementById("allTable");
    //permet de ne pas générer plusieurs fois le get
    if (alreadyThere == null) {
        var arrayKey = ["User", "Id", "Titre", "Terminé", "Action"]

        var myDiv = document.getElementById("divtable")
        var table = document.createElement("table");
        table.setAttribute("id", 'allTable');
        table.setAttribute("class", 'table');
        myDiv.appendChild(table);
        let thead = table.createTHead();
        var newTr = document.createElement("tr");
        thead.appendChild(newTr);

        for (let index = 0; index < arrayKey.length; index++) { //permet d'afficher le haut du tableau
            var newTh = document.createElement("th");
            newTr.appendChild(newTh);
            newTh.innerHTML += arrayKey[index];
        }
        var tbody = table.appendChild(document.createElement('tbody'));
        tbody.setAttribute("id", 'tbody_getTask');

        //utilisation des local storage utilisés au début
        var DataInJSON = (localStorage.getItem('myData'));
        DataInJSON = JSON.parse(DataInJSON);

        console.log(DataInJSON.length);

        //pour chaque données dans le local storage on l'affiche dans le tableau
        DataInJSON.forEach(task => {
            createNewRow(tbody, Object.values(task));
        });
        countTasks(); //comptage des taches

    }
}

function reloadTasks() {
    document.getElementById("allTable").remove();
    document.getElementById("nb_task").remove();
    getTasks();
}

function createNewRow(tbody, task) {
    var newTr = document.createElement("tr");
    tbody.appendChild(newTr);
    for (let index = 0; index < task.length; index++) {
        createCell(newTr, task[index]);
    }
    var newTd = document.createElement("td");
    newTr.appendChild(newTd);
    newTd.setAttribute("class", 'boldFont');

    var btn = document.createElement("button");
    btn.setAttribute("class", 'btn btn-dark');

    if (task[3] == true) {
        btn.setAttribute("id", 'delete');
        btn.onclick = function () {
            var idToDelete = task[1];
            alert("suppression de l'id : " + idToDelete);
            deleteAPI(idToDelete);
        }
        btn.innerHTML = "Supprimer";
        newTd.appendChild(btn);
    } else {
        btn.setAttribute("id", 'terminate');
        btn.onclick = function () {
            var idToUpdate = task[1];
            alert("update");
            updateAPI(idToUpdate);
        }
        btn.innerHTML = "Terminer";
    }
    newTd.appendChild(btn);

}

function createCell(newTr, mytask) {
    var newTd = document.createElement("td");
    newTr.appendChild(newTd);
    newTd.setAttribute("id", 'boldFont');
    switch (mytask) {
        case true:
            value = "Oui";
            newTd.setAttribute("class", 'green');
            break;

        case false:
            value = "Non";
            newTd.setAttribute("class", 'red');
            break;

        default:
            value = mytask;
            break;
    }
    newTd.innerHTML += value;
}

function countTasks() {
    var DataInJSON = (localStorage.getItem('myData'));
    DataInJSON = JSON.parse(DataInJSON);

    var myDiv = document.createElement("div");
    myDiv.setAttribute("id", 'nb_task');
    document.body.appendChild(myDiv);
    myDiv.innerHTML += `Nombre de tâches : ${DataInJSON.length}`;
    console.log("il y a " + DataInJSON.length + " valeurs");

}

function postAPI() {
    var titrePost = document.getElementById("inputTitre").value;
    if (titrePost == null || titrePost == undefined || titrePost == "") {
        alert('veuillez renseigner un titre');
    } else {


        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                title: titrePost,
                completed: false,
            }),
            mode: "cors",
            redirect: 'follow'
        };

        fetch('https://jsonplaceholder.typicode.com/todos', requestOptions)
            .then(result => {
                if (!result.ok) throw result;
                return result.json();
            })
            .then(tasks => {
                console.log("Création de l'entité " + tasks.id + " : " + tasks.title);

                //permet d'ajouter le champ userId 

                const obj2 = {
                    userId: 1,
                    id: undefined,
                    title: undefined,
                    completed: undefined
                }

                const result = {};
                let key;

                for (key in obj2) {
                    if (obj2.hasOwnProperty(key)) {
                        result[key] = obj2[key];
                    }
                }

                for (key in tasks) {
                    if (tasks.hasOwnProperty(key)) {
                        result[key] = tasks[key];
                    }
                }

                console.log("ajoute de :" + result);

                var DataInJSON = (localStorage.getItem('myData'));
                DataInJSON = JSON.parse(DataInJSON);

                var a = [];
                // Parse the serialized data back into an array of objects
                a = JSON.parse(localStorage.getItem('myData')) || [];
                // Push the new data (whether it be an object or anything else) onto the array
                a.push(result);
                // Re-serialize the array back into a string and store it in localStorage

                localStorage.setItem('myData', JSON.stringify(a));

                DataInJSON = (localStorage.getItem('myData'));
                DataInJSON = JSON.parse(DataInJSON);

                reloadTasks();
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function deleteAPI(idToDelete) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        mode: "cors",
        redirect: 'follow'
    };

    urlDelete = 'https://jsonplaceholder.typicode.com/todos/' + idToDelete;

    fetch(urlDelete, requestOptions)
        .then(result => {
            if (!result.ok) throw result;
            return result.json();
        })
        .then(tasks => {
            //J'aurais bien aimer récupérer les valeurs de l'api cependant elle ne retourne rien 
            //pas retour donc on ne passe même pas dans le then
        })
        .catch(error => {
            console.log(error);
        });

    console.log("Suppresion de l'id :" + idToDelete);

    var DataInJSON = (localStorage.getItem('myData'));
    DataInJSON = JSON.parse(DataInJSON);
    DataInJSON.forEach(element => {

        if (element.id > -1 &&
            element.id === parseInt(idToDelete)

        ) {
            DataInJSON.splice(DataInJSON.indexOf(element), 1);
            localStorage.setItem('myData', JSON.stringify(DataInJSON));
            reloadTasks();
        }

    });
}



function updateAPI(idToUpdate) {

    /*var DataInJSON = (localStorage.getItem('myData'));
    DataInJSON = JSON.parse(DataInJSON);*/
    //`https://jsonplaceholder.typicode.com/todos/${idToUpdate}`

    var raw = JSON.stringify({ "completed": true });
    /*var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "completed": true });

    var requestOptions = {
        method: 'PATCH',//un probleme avec le put m'empeche de fetch, donc j'utilise patch
        headers: myHeaders,
        body: raw,
        mode: "cors",
        redirect: 'follow'
    };

    fetch("https://jsonplaceholder.typicode.com/todos/1", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => alert(error));*/

    fetch("https://jsonplaceholder.typicode.com/todos/1", {
        _method: 'PATCH',
        crossDomain: true,
        xhrFields: {
            withCredentials: true
        },
        mode: "cors",
        redirect: 'follow',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': ''
        },
        data: JSON.stringify({ "completed": true }),
        credentials: 'include'
    })
        .then(res => console.log(res.json()))
        .then(res => {
            console.log(res);
        })
        .catch(err => alert(err))
}
