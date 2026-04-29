/**
 * ========================================
 * SISTEMA DE RESERVAS - BASTY BARBER
 * ========================================
 * Refactorización con seguridad, validaciones avanzadas y arquitectura modular
 * 
 * MEJORAS IMPLEMENTADAS:
 * - Validaciones con regex (nombre, email, teléfono)
 * - Sanitización de entrada para prevenir XSS
 * - Uso de createElement en lugar de innerHTML
 * - Modularización de funciones
 * - Event delegation para manipulación del DOM
 * - Validación de horarios en tiempo real
 * - Código limpio y bien documentado
 */

// ========== ELEMENTOS DEL DOM ==========
const form = document.querySelector("#formReserva");
const inputNombreCompleto = document.querySelector("#nombreCompleto");
const inputEmail = document.querySelector("#email");
const inputTelefono = document.querySelector("#telefono");
const inputFecha = document.querySelector("#fecha");
const horaSelect = document.querySelector("#hora");
const listaReservas = document.querySelector("#listaReservas");
const errorHora = document.querySelector("#errorHora");

// ========== ESTADO GLOBAL ==========
let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

// ========== EXPRESIONES REGULARES (REGEX) ==========
const REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,}$/, // Solo letras y mínimo 2 caracteres
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Formato básico válido de email
    telefonoChileno: /^(\+569|9)\d{8}$/ // +569XXXXXXXX o 9XXXXXXXX
};

// ========== SANITIZACIÓN DE SEGURIDAD ==========
/**
 * Sanitiza texto eliminando caracteres peligrosos (< y >)
 * Previene ataques XSS
 * @param {string} texto - Texto a sanitizar
 * @returns {string} Texto sanitizado
 */
const sanitizarInput = (texto) => {
    return texto.trim().replace(/[<>]/g, "");
};

// ========== VALIDACIONES CON REGEX ==========
/**
 * Valida que nombre y apellido contengan solo letras y tengan mínimo 2 caracteres
 * @param {string} texto - Texto a validar
 * @returns {boolean} true si es válido
 */
const validarNombre = (texto) => {
    return REGEX.nombre.test(sanitizarInput(texto));
};

/**
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
const validarEmail = (email) => {
    return REGEX.email.test(sanitizarInput(email));
};

/**
 * Valida teléfono en formato chileno
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} true si es válido
 */
const validarTelefonoChileno = (telefono) => {
    return REGEX.telefonoChileno.test(sanitizarInput(telefono));
};

/**
 * Valida que al menos un servicio esté seleccionado
 * @returns {boolean} true si hay al menos un servicio
 */
const validarServicios = () => {
    return document.querySelectorAll(".servicio:checked").length > 0;
};

/**
 * Valida si una hora está duplicada en la misma fecha (excluye el índice en edición)
 * @param {string} fecha - Fecha a validar
 * @param {string} hora - Hora a validar
 * @param {number|null} indexEdit - Índice del registro en edición
 * @returns {boolean} true si la hora está ocupada en esa fecha
 */
const validarHoraDuplicada = (fecha, hora, indexEdit = null) => {
    return reservas.some((r, i) => r.fecha === fecha && r.hora === hora && i !== indexEdit);
};

// ========== VALIDACIÓN GENERAL DEL FORMULARIO ==========
/**
 * Valida todos los campos del formulario
 * @returns {object} { valido: boolean, errores: object }
 */
const validarFormulario = () => {
    const errores = {};

    // Validar nombre completo
    if (!validarNombre(inputNombreCompleto.value)) {
        errores.nombreCompleto = "Solo letras, mínimo 2 caracteres";
    }

    // Validar email
    if (!validarEmail(inputEmail.value)) {
        errores.email = "Email no válido";
    }

    // Validar teléfono
    if (!validarTelefonoChileno(inputTelefono.value)) {
        errores.telefono = "Formato: +569XXXXXXXX o 9XXXXXXXX";
    }

    // Validar fecha
    const fechaSeleccionada = new Date(inputFecha.value);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    if (fechaSeleccionada < hoy) {
        errores.fecha = "La fecha no puede ser en el pasado";
    }

    // Validar servicios
    if (!validarServicios()) {
        errores.servicios = "Selecciona al menos un servicio";
    }

    return {
        valido: Object.keys(errores).length === 0,
        errores
    };
};

// ========== MOSTRAR ERRORES EN EL DOM ==========
/**
 * Limpia y muestra errores en el formulario
 * @param {object} errores - Objeto con errores
 */
const mostrarErrores = (errores) => {
    // Limpiar errores previos
    document.querySelectorAll(".error-text").forEach(el => el.remove());

    // Mostrar nuevos errores
    for (const [campo, mensaje] of Object.entries(errores)) {
        const elemento = document.querySelector(`#${campo}`);
        if (elemento) {
            const errorDiv = document.createElement("div");
            errorDiv.className = "error-text text-danger small mt-1";
            errorDiv.textContent = mensaje;
            elemento.parentNode.insertBefore(errorDiv, elemento.nextSibling);
        }
    }
};

/**
 * Limpia los mensajes de error
 */
const limpiarErrores = () => {
    document.querySelectorAll(".error-text").forEach(el => el.remove());
    errorHora.textContent = "";
};

// ========== GENERACIÓN DE HORARIOS ==========
/**
 * Genera opciones de horarios de 11:00 a 18:00 cada 30 minutos
 */
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

// ========== CREAR OBJETO RESERVA ==========
/**
 * Crea un objeto reserva con datos sanitizados
 * @returns {object} Objeto reserva
 */
const crearReserva = () => {
    return {
        nombreCompleto: sanitizarInput(inputNombreCompleto.value),
        email: sanitizarInput(inputEmail.value),
        telefono: sanitizarInput(inputTelefono.value),
        fecha: inputFecha.value,
        hora: horaSelect.value,
        servicios: Array.from(document.querySelectorAll(".servicio:checked"))
            .map(s => sanitizarInput(s.value))
    };
};

// ========== GUARDAR EN LOCAL STORAGE ==========
/**
 * Persiste las reservas en localStorage
 */
const guardarEnLocalStorage = () => {
    localStorage.setItem("reservas", JSON.stringify(reservas));
};

// ========== RENDERIZAR RESERVAS EN EL DOM ==========
/**
 * Renderiza dinámicamente todas las reservas en la agenda
 * Usa createElement para máxima seguridad contra XSS
 */
const renderReservas = () => {
    // Limpiar lista
    listaReservas.innerHTML = "";

    // Si no hay reservas, mostrar mensaje
    if (reservas.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "text-muted";
        vacio.textContent = "No hay reservas registradas";
        listaReservas.appendChild(vacio);
        return;
    }

    // Crear tarjeta por cada reserva
    reservas.forEach((reserva, index) => {
        const card = document.createElement("div");
        card.className = "reserva-card";

        // Crear estructura de la tarjeta con elementos seguros
        const nombre = document.createElement("strong");
        nombre.textContent = reserva.nombreCompleto;

        const fecha = document.createElement("p");
        fecha.className = "mb-1";
        fecha.textContent = `📅 ${reserva.fecha}`;

        const hora = document.createElement("p");
        hora.className = "mb-1";
        hora.textContent = `🕒 ${reserva.hora}`;

        const servicios = document.createElement("p");
        servicios.className = "mb-2";
        servicios.textContent = `💈 ${reserva.servicios.join(", ")}`;

        // Botón Editar
        const btnEditar = document.createElement("button");
        btnEditar.className = "btn btn-sm btn-warning editar";
        btnEditar.dataset.id = index;
        btnEditar.textContent = "Editar";

        // Botón Eliminar
        const btnEliminar = document.createElement("button");
        btnEliminar.className = "btn btn-sm btn-danger eliminar ms-2";
        btnEliminar.dataset.id = index;
        btnEliminar.textContent = "Eliminar";

        // Contenedor de botones
        const botones = document.createElement("div");
        botones.appendChild(btnEditar);
        botones.appendChild(btnEliminar);

        // Agregar elementos a la tarjeta
        card.appendChild(nombre);
        card.appendChild(document.createElement("br"));
        card.appendChild(fecha);
        card.appendChild(hora);
        card.appendChild(servicios);
        card.appendChild(botones);

        listaReservas.appendChild(card);
    });

    guardarEnLocalStorage();
};

// ========== CARGAR RESERVA EN FORMULARIO (EDITAR) ==========
/**
 * Carga datos de una reserva en el formulario para edición
 * @param {number} index - Índice de la reserva
 */
const cargarReservaEnFormulario = (index) => {
    const reserva = reservas[index];

    inputNombreCompleto.value = reserva.nombreCompleto;
    inputEmail.value = reserva.email;
    inputTelefono.value = reserva.telefono;
    inputFecha.value = reserva.fecha;
    horaSelect.value = reserva.hora;

    document.querySelectorAll(".servicio").forEach(checkbox => {
        checkbox.checked = reserva.servicios.includes(checkbox.value);
    });

    document.querySelector("#editIndex").value = index;

    // Scroll al formulario
    form.scrollIntoView({ behavior: "smooth" });
};

// ========== RESETEAR FORMULARIO ==========
/**
 * Limpia el formulario y los errores
 */
const resetearFormulario = () => {
    form.reset();
    document.querySelector("#editIndex").value = "";
    limpiarErrores();
};

// ========== EVENT LISTENERS ==========

/**
 * Validación en tiempo real de hora duplicada
 */
horaSelect.addEventListener("change", () => {
    const editIndex = document.querySelector("#editIndex").value;

    if (validarHoraDuplicada(inputFecha.value, horaSelect.value, editIndex)) {
        errorHora.textContent = "⚠️ Esta hora ya está reservada para esta fecha";
        errorHora.className = "text-danger mb-2";
    } else {
        errorHora.textContent = "";
    }
});

/**
 * Validación en tiempo real al cambiar fecha
 */
inputFecha.addEventListener("change", () => {
    const editIndex = document.querySelector("#editIndex").value;

    if (validarHoraDuplicada(inputFecha.value, horaSelect.value, editIndex)) {
        errorHora.textContent = "⚠️ Esta hora ya está reservada para esta fecha";
        errorHora.className = "text-danger mb-2";
    } else {
        errorHora.textContent = "";
    }
});

/**
 * Manejo del envío del formulario
 */
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Validar formulario
    const { valido, errores } = validarFormulario();

    if (!valido) {
        mostrarErrores(errores);
        return;
    }

    // Verificar hora duplicada
    const editIndex = document.querySelector("#editIndex").value;
    if (validarHoraDuplicada(inputFecha.value, horaSelect.value, editIndex)) {
        errorHora.textContent = "⚠️ Esta hora ya está reservada para esta fecha";
        errorHora.className = "text-danger mb-2";
        return;
    }

    // Crear o actualizar reserva
    const nuevaReserva = crearReserva();

    if (editIndex === "") {
        reservas.push(nuevaReserva);
    } else {
        reservas[parseInt(editIndex)] = nuevaReserva;
    }

    // Actualizar UI
    renderReservas();
    resetearFormulario();
});

/**
 * Event Delegation para botones Editar y Eliminar
 */
listaReservas.addEventListener("click", (e) => {
    const id = e.target.dataset.id;

    if (e.target.classList.contains("eliminar")) {
        if (confirm("¿Eliminar esta reserva?")) {
            reservas.splice(parseInt(id), 1);
            renderReservas();
            resetearFormulario();
        }
    }

    if (e.target.classList.contains("editar")) {
        cargarReservaEnFormulario(parseInt(id));
    }
});

// ========== INICIALIZACIÓN ==========
document.addEventListener("DOMContentLoaded", () => {
    generarHorarios();
    renderReservas();
});