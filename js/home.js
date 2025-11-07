document.addEventListener("DOMContentLoaded", () => {
    const turnos = [
        {
            cliente: "Cavani, Edinson",
            dni: "23445452",
            fecha: "Lunes 3, Noviembre 2025 12:40",
            servicio: "Alquiler Cancha 2",
            estado: "Expirado"
        },
        {
            cliente: "Delgado, Milton",
            dni: "23445664",
            fecha: "Viernes 7, Noviembre 2025 20:00",
            servicio: "Alquiler Cancha 2",
            estado: "Confirmado"
        },
        {
            cliente: "Zeballos, Exequiel",
            dni: "23845432",
            fecha: "Sábado 8, Noviembre 2025 22:00",
            servicio: "Alquiler Cancha 1",
            estado: "Confirmado"
        }
    ];

    const container = document.getElementById("turnos-container");

    turnos.forEach(turno => {
        const card = document.createElement("div");
        card.classList.add("turno-card");
        card.innerHTML = `
            <h4>Cliente: <strong>${turno.cliente}</strong></h4>
            <p><strong>DNI:</strong> ${turno.dni}</p>
            <p><strong>Fecha y Hora:</strong> ${turno.fecha}</p>
            <p><strong>Servicio:</strong> ${turno.servicio}</p>
            <p class="estado ${turno.estado.toLowerCase()}"><strong>Estado:</strong> ${turno.estado}</p>
        `;
        container.appendChild(card);
    });
});
