window.addEventListener("load", function() {
    getMaterias();

});

function loadHtml(object) {

    let tabla = $("tabla");

    let row = document.createElement("tr");

    tabla.appendChild(row);
    row.addEventListener("dblclick", function(e) {
        abrirForm(e, object);
    });

    let id = document.createElement("td");
    row.appendChild(id);
    id.appendChild(document.createTextNode(object.nombre));

    let name = document.createElement("td");
    row.appendChild(name);
    name.appendChild(document.createTextNode(object.cuatrimestre));

    let createdAt = document.createElement("td");
    row.appendChild(createdAt);
    createdAt.appendChild(document.createTextNode(object.fechaFinal));

    let sexo = document.createElement("td");
    row.appendChild(sexo);
    sexo.appendChild(document.createTextNode(object.turno));

    let input = document.createElement("input");
    input.setAttribute("data-id", object.id);
    input.setAttribute("type", "hidden");
    input.setAttribute("value", object.id);
    row.appendChild(input);

}

function abrirForm(e, object) {

    let elemento = e.target;

    console.log(elemento.parentNode.childNodes[0].textContent);

    let id = elemento.parentNode.lastChild.value;

    let idelem = $("id");

    let nombre = $("nombre");
    let cuatrimestre = $("cuatrimestre");
    let fecha = $("fecha");
    let noche = $("noche");
    let mañana = $("mañana");
    let form = $("form");

    /* if (object.turno == "Noche") {
        noche.checked = true;
        mañana.checked = false;
    } else {
        mañana.checked = true;
        noche.checked = false;
    } */

    if (elemento.parentNode.childNodes[3].textContent == "Noche") {
        noche.checked = true;
        mañana.checked = false;
    } else {
        mañana.checked = true;
        noche.checked = false;
    }

    if (object.cuatrimestre == "1") {
        cuatrimestre.selectedIndex = 0;
    } else if (object.cuatrimestre == "2") {
        cuatrimestre.selectedIndex = 1;
    } else if (object.cuatrimestre == "3") {
        cuatrimestre.selectedIndex = 2;
    } else {
        cuatrimestre.selectedIndex = 3;
    }

    idelem.value = id;
    nombre.value = elemento.parentNode.childNodes[0].textContent;
    let fechaNew = elemento.parentNode.childNodes[2].textContent;

    //console.log(fechaNew);

    if (fechaNew.includes("/")) {
        let arrayFechas = fechaNew.split("/");

        let nuevaFecha = arrayFechas[2] + "-" + arrayFechas[1] + "-" + arrayFechas[0];

        //console.log(nuevaFecha);

        fecha.value = nuevaFecha;
    } else {
        fecha.value = fechaNew;
    }

    form.classList.add("display-block");
    form.classList.remove("display-none");

}

function cerrarForm() {
    let form = $("form");
    /* var btn = document.getElementById("add-btn"); */
    form.classList.add("display-none");
    form.classList.remove("display-block");
    /* btn.classList.add("display-flex"); */
}

function editarForm() {
    let id = $("id");
    let nombre = $("nombre");
    let cuatrimestre = $("cuatrimestre");
    let fecha = $("fecha");
    let noche = $("noche");
    let mañana = $("mañana");

    let turno = "Noche";

    if (mañana.checked) {
        turno = "Mañana";
    }

    if (validarForm()) {

        console.log(fecha.value);

        if (fecha.value.includes("-")) {
            let aFecha = fecha.value.split("-");

            let nuevaFecha = aFecha[2] + "/" + aFecha[1] + "/" + aFecha[0];
            console.log(nuevaFecha);
            postRequestEditar(id.value, nombre.value, cuatrimestre.value, nuevaFecha, turno);
        } else {
            postRequestEditar(id.value, nombre.value, cuatrimestre.value, fecha.value, turno);
        }


        cerrarForm();
    }
}

function eliminarForm() {

    let id = $("id");
    postRequestEliminar(id.value);
    cerrarForm();

}

function validarForm() {

    let nombre = $("nombre");
    //let fecha = $("fecha");
    let noche = $("noche");
    let mañana = $("mañana");
    let fechaHoy = new Date();
    let isvalid = true;

    let Fecha_aux = document.getElementById("fecha").value.split("/");

    console.log(fechaHoy.getTime());

    let arrayFechas = Fecha_aux;

    let nuevaFecha = arrayFechas[2] + "-" + arrayFechas[1] + "-" + arrayFechas[0];
    let Fecha1 = Date.parse(nuevaFecha);

    console.log(Fecha1);
    if (nombre.value.toString().length < 6) {
        nombre.classList.add("invalid");
        isvalid = false;
    }

    if (Fecha1 > fechaHoy.getTime()) {
        fecha.classList.add("invalid");
        isvalid = false;
    }

    if (noche.checked == false && mañana.checked == false) {
        noche.classList.add("invalid");
        mañana.classList.add("invalid");
        isvalid = false;
    }

    return isvalid;
}

function getMaterias() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {
            let response = JSON.parse(this.responseText);
            for (object of response) {
                loadHtml(object);
            }

        }
    };
    request.open("GET", "http://localhost:3000/materias", true);
    request.send();
}

function postRequestEditar(id, nombre, cuatrimestre, fecha, turno) {

    let object = { id, nombre, cuatrimestre, fecha, turno };
    let loader = $("loader");

    console.log(object);

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if (this.status == 200 && this.readyState == 4) {

            let response = JSON.parse(this.responseText);
            loader.classList.add("display-none");
            /* loadHtml(object); */
            reloadContent(object);
            // let loader = $("loader");
            /* loader.setAttribute("hidden", "true"); */

        } else {
            loader.classList.add("display-none");
        }
    };

    request.open("POST", "http://localhost:3000/editar", true);
    request.setRequestHeader("Content-Type", "application/json");

    let personaJson = {
        id: id,
        nombre: nombre,
        cuatrimestre: cuatrimestre,
        fechaFinal: fecha,
        turno: turno
    }

    let stringPersona = JSON.stringify(personaJson);

    loader.classList.remove("display-none");

    request.send(stringPersona);

}

function postRequestEliminar(id) {

    let object = { id };
    let loader = $("loader");

    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.status == 200 && this.readyState == 4) {

            let response = JSON.parse(this.responseText);
            if (this.status == 200 && this.readyState == 4) {

                let response = JSON.parse(this.responseText);
                loader.classList.add("display-none");
                /* loadHtml(object); */
                removeRow(object);
                // let loader = $("loader");
                /* loader.setAttribute("hidden", "true"); */



            } else {
                loader.classList.add("display-none");
            }

        }
    };

    request.open("POST", "http://localhost:3000/eliminar", true);
    request.setRequestHeader("Content-Type", "application/json");

    let personaJson = {
        id: id
    }

    let stringPersona = JSON.stringify(personaJson);
    loader.classList.remove("display-none");

    request.send(stringPersona);

}

function reloadContent(object) {
    let hijo = document.querySelector("input[data-id='" + object.id + "']");
    // console.log(hijo.parentNode.childNodes[0]);

    hijo.parentNode.childNodes[0].textContent = object.nombre;
    hijo.parentNode.childNodes[1].textContent = object.cuatrimestre;
    hijo.parentNode.childNodes[2].textContent = object.fecha;

    hijo.parentNode.childNodes[3].textContent = object.turno;

    // console.log(hijo.parentNode.childNodes[0]);
}

function removeRow(object) {
    let hijo = document.querySelector("input[data-id='" + object.id + "']");
    $("tabla").removeChild(hijo.parentNode);
    console.log("se elimino");
}

/* function borrarRow(event) {
    let elemento = event.target;
    $("tabla").removeChild(elemento.parentNode.parentNode);

} */

function $(id) {
    return document.getElementById(id);
}