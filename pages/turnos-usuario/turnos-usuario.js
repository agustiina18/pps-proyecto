document.addEventListener('DOMContentLoaded', () => {
  cargarTurnosUsuario();
  
  document.querySelector('.btn-nuevo-turno').addEventListener('click', () => {
    window.location.href = 'reserva-turno.html';
  });
});

function cargarTurnosUsuario() {
  const tbody = document.querySelector('.tabla-turnos tbody');
  tbody.innerHTML = ''; 

  const turnos = [
    {empresa:'Peluquería “Look”', servicio:'Corte', fecha:'12/12/2025 15:30', estado:'Confirmado'},
    {empresa:'Gym Pro', servicio:'Entrenamiento Personal', fecha:'15/12/2025 10:00', estado:'Pendiente'}
  ];

  turnos.forEach(turno => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${turno.empresa}</td>
      <td>${turno.servicio}</td>
      <td>${turno.fecha}</td>
      <td>${turno.estado}</td>
      <td><button class="btn-cancelar">Cancelar</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.btn-cancelar').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const row = ev.target.closest('tr');
      const empresa = row.cells[0].textContent;
      // lógica de cancelación...
      alert(`Cancelar turno en ${empresa}`);
    });
  });
}