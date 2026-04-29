const form = document.querySelector("#formReserva");
const lista = document.querySelector("#listaReservas");
const horaSelect = document.querySelector("#hora");
const errorHora = document.querySelector("#errorHora");

let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

/* GENERAR HORARIOS 11:00 a 18:00 cada 30 min */
const generarHorarios = () => {
    for (let h = 11; h < 18; h++) {
        ["00", "30"].forEach(min => {
            const hora = `${h.toString().padStart(2, "0")}:${min}`;
            const option = document.createElement("option");
            option.value = hora;
            option.textContent = hora;
            horaSelect.appendChild(option);
        });
    }
};

generarHorarios();

/* VALIDAR HORA DUPLICADA */
const validarHora = (hora, indexEdit = null) => {
    return reservas.some((r, i) => r.hora === hora && i !== indexEdit);
};

/* RENDER */
const render = () => {
    lista.innerHTML = "";

    reservas.forEach((r, index) => {
        const div = document.createElement("div");
        div.classList.add("reserva-card");

        div.innerHTML = `
            <strong>${r.nombre} ${r.apellido}</strong><br>
            🕒 ${r.hora}<br>
            💈 ${r.servicios.join(", ")}<br>
            <button class="btn btn-sm btn-warning editar" data-id="${index}">Editar</button>
            <button class="btn btn-sm btn-danger eliminar" data-id="${index}">Eliminar</button>
        `;

        lista.appendChild(div);
    });

    localStorage.setItem("reservas", JSON.stringify(reservas));
};

/* EVENTO CAMBIO DE HORA (VALIDACIÓN EN TIEMPO REAL) */
horaSelect.addEventListener("change", () => {
    const editIndex = document.querySelector("#editIndex").value;

    if (validarHora(horaSelect.value, editIndex)) {
        errorHora.textContent = "Esta hora ya está reservada";
    } else {
        errorHora.textContent = "";
    }
});

/* SUBMIT */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const editIndex = document.querySelector("#editIndex").value;

    if (validarHora(horaSelect.value, editIndex)) {
        errorHora.textContent = "Hora ocupada";
        return;
    }

    const reserva = {
        nombre: document.querySelector("#nombre").value,
        apellido: document.querySelector("#apellido").value,
        email: document.querySelector("#email").value,
        telefono: document.querySelector("#telefono").value,
        hora: horaSelect.value,
        servicios: Array.from(document.querySelectorAll(".servicio:checked"))
            .map(s => s.value)
    };

    if (editIndex === "") {
        reservas.push(reserva);
    } else {
        reservas[editIndex] = reserva;
    }

    form.reset();
    document.querySelector("#editIndex").value = "";
    errorHora.textContent = "";

    render();
});

/* EDITAR Y ELIMINAR (EVENT DELEGATION) */
lista.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        reservas.splice(id, 1);
        render();
    }

    if (e.target.classList.contains("editar")) {
        const r = reservas[id];

        document.querySelector("#nombre").value = r.nombre;
        document.querySelector("#apellido").value = r.apellido;
        document.querySelector("#email").value = r.email;
        document.querySelector("#telefono").value = r.telefono;
        horaSelect.value = r.hora;

        document.querySelectorAll(".servicio").forEach(c => {
            c.checked = r.servicios.includes(c.value);
        });

        document.querySelector("#editIndex").value = id;
    }
});

/* INIT */
render();