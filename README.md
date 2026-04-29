#  Basty Barber - Sistema de Reservas Web

##  Descripción del Proyecto

Basty Barber es una aplicación web desarrollada con HTML, CSS, Bootstrap y JavaScript que permite a los clientes agendar horas en una barbería de manera sencilla e interactiva.

El sistema incluye un formulario de reservas, una agenda dinámica y una interfaz moderna inspirada en barberías profesionales, con una experiencia visual atractiva y responsiva.

---

##  Funcionalidades Principales

*  Registro de clientes con:

  * Nombre
  * Apellido
  * Email
  * Teléfono
  * Selección de hora
  * Servicios (corte, barba, cejas, etc.)

*  Generación automática de horarios:

  * Desde 11:00 a 18:00
  * Intervalos de 30 minutos

*  Validaciones avanzadas:

  * Validación de email (regex)
  * Validación de teléfono chileno
  * Validación de campos obligatorios
  * Validación de selección de servicios
  * Validación de horarios duplicados en tiempo real

*  Persistencia de datos:

  * Uso de LocalStorage

*  Manipulación del DOM:

  * Render dinámico de reservas
  * Edición de reservas
  * Eliminación de reservas

---

##  Seguridad y Buenas Prácticas

* Sanitización de datos de entrada
* Uso de `textContent` en lugar de `innerHTML`
* Creación de elementos con `createElement`
* Separación de lógica en funciones reutilizables
* Validaciones robustas en frontend

---

##  Estructura del Proyecto

```
barberia/
│── index.html
│── style.css
│── script.js
│── img/
```

---

##  Tecnologías Utilizadas

* HTML5
* CSS3
* Bootstrap 5
* JavaScript (DOM API + LocalStorage)

---

##  Despliegue

* Repositorio en GitHub: *(https://github.com/mignacio0803-hue/barberia/tree/main)*
* Página desplegada: *https://mignacio0803-hue.github.io/barberia/#contacto*

---

##  Uso de Inteligencia Artificial

Para el desarrollo del proyecto se utilizó IA como apoyo en la mejora del código, validaciones y estructura general.

### Prompt utilizado

```
Tengo una aplicación web de barbería que permite registrar reservas con HTML, CSS, Bootstrap y JavaScript. El sistema ya guarda datos en LocalStorage y muestra una agenda.

Necesito mejorar el código para cumplir buenas prácticas de desarrollo.

Requisitos:
- Agregar validaciones avanzadas con regex (nombre, email, teléfono chileno).
- Validar campos obligatorios y selección de servicios.
- Implementar sanitización de datos para evitar inyección.
- Evitar el uso de innerHTML y usar createElement y textContent.
- Modularizar el código en funciones reutilizables.
- Mejorar la manipulación del DOM (agregar, editar, eliminar reservas).
- Validar horarios duplicados en tiempo real.
- Mantener compatibilidad con el HTML existente.
```

Mejoras obtenidas gracias a IA

* Implementación de validaciones con expresiones regulares
* Refactorización del código JavaScript a funciones modulares
* Eliminación de prácticas inseguras (`innerHTML`)
* Mejora en la manipulación del DOM
* Incorporación de sanitización de inputs
* Mejor organización del código y legibilidad

---

## Autor

* Martín Ocares
* Analista de Datos - INACAP

---

## Licencia

Este proyecto es de uso académico.
