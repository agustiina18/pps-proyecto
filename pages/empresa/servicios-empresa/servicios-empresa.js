const USE_BACKEND = false;
const empresaId = 1;

// Profesionales simulados 
const profesionalesMock = [
  "María Gómez",
  "Laura Ruiz",
  "Juan Pérez",
  "Ana Rodríguez"
];

// ELEMENTOS DEL DOM
const listaServicios = document.getElementById("listaServicios");

// Modal agregar/editar (es el mismo)
const modalServicio = document.getElementById("modalServicio");
const tituloModal = document.getElementById("tituloModal");

const campoNombre = document.getElementById("campoNombre");
const campoDuracion = document.getElementById("campoDuracion");
const profesionalSelect = document.getElementById("campoProfesionalSelect");
const profesionalTexto = document.getElementById("campoProfesionalTexto");
const campoPrecio = document.getElementById("campoPrecio");
const campoAclaracion = document.getElementById("campoAclaracion");

const diasContainer = document.getElementById("diasContainer");

const btnAbrirAgregar = document.getElementById("btnAbrirAgregar");
const btnCancelarModal = document.getElementById("btnCancelarModal");
const btnGuardarModal = document.getElementById("btnGuardarModal");

// Modal eliminar
const modalEliminar = document.getElementById("modalEliminar");
const textoEliminar = document.getElementById("textoEliminar");
const btnCancelarEliminar = document.getElementById("btnCancelarEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

// Estado
let servicioEditando = null;
let servicioEliminando = null;

// DATOS MOCK DE SERVICIOS

let serviciosMock = [
  {
    id: 1,
    nombre: "Corte de pelo",
    duracion: 45,
    profesional: "María Gómez",
    precio: 4000,
    aclaracion: "Incluye lavado",
    horarios: {
      Lun: [{ desde: "09:00", hasta: "17:00" }],
      Mar: [{ desde: "09:00", hasta: "17:00" }],
      Mié: [{ desde: "09:00", hasta: "17:00" }],
      Jue: [{ desde: "09:00", hasta: "17:00" }],
      Vie: [{ desde: "09:00", hasta: "17:00" }]
    }
  },
  {
    id: 2,
    nombre: "Coloración",
    duracion: 120,
    profesional: "Laura Ruiz",
    precio: 15000,
    aclaracion: "",
    horarios: {
      Mar: [
        { desde: "10:00", hasta: "14:00" },
        { desde: "16:00", hasta: "20:00" }
      ],
      Vie: [
        { desde: "10:00", hasta: "18:00" }
      ]
    }
  }
];

// RENDER DE TARJETAS
function resumenDias(serv) {
  if (!serv.horarios) return "—";
  const dias = Object.keys(serv.horarios);
  return dias.length ? dias.join(", ") : "—";
}

function resumenHorarios(serv) {
  if (!serv.horarios) return "—";
  const dia = Object.keys(serv.horarios)[0];
  if (!dia) return "—";
  const ints = serv.horarios[dia];
  if (!ints || !ints.length) return "—";
  if (ints.length === 1) {
    return `${ints[0].desde} - ${ints[0].hasta}`;
  }
  return "Varios intervalos";
}

function renderServicios(lista) {
  listaServicios.innerHTML = "";

  lista.forEach(serv => {
    const div = document.createElement("div");
    div.className = "servicio-card";

    div.innerHTML = `
      <div class="servicio-titulo">${serv.nombre}</div>
      <div class="servicio-dato">Duración: ${serv.duracion} min</div>
      <div class="servicio-dato">Profesional: ${serv.profesional || "No asignado"}</div>
      <div class="servicio-dato">Precio: $${serv.precio}</div>
      <div class="servicio-dato">Días: ${resumenDias(serv)}</div>
      <div class="servicio-dato">Horario: ${resumenHorarios(serv)}</div>
      <div class="servicio-dato">Aclaración: ${serv.aclaracion || "—"}</div>

      <div class="servicio-acciones">
        <button class="btn-accion btn-editar">Editar</button>
        <button class="btn-accion btn-eliminar">Eliminar</button>
      </div>
    `;

    div.querySelector(".btn-editar").onclick = () => abrirModalEditar(serv);
    div.querySelector(".btn-eliminar").onclick = () => abrirModalEliminar(serv);

    listaServicios.appendChild(div);
  });
}

// SISTEMA DE DÍAS / HORARIOS
const diasSemana = [
  { key: "Lun", label: "Lun", laboral: true },
  { key: "Mar", label: "Mar", laboral: true },
  { key: "Mié", label: "Mié", laboral: true },
  { key: "Jue", label: "Jue", laboral: true },
  { key: "Vie", label: "Vie", laboral: true },
  { key: "Sáb", label: "Sáb", laboral: false },
  { key: "Dom", label: "Dom", laboral: false }
];

function crearSelectHora(valor = "09:00") {
  const select = document.createElement("select");
  select.classList.add("select-hora");
  for (let h = 0; h < 24; h++) {
    const hora = String(h).padStart(2, "0") + ":00";
    const opt = document.createElement("option");
    opt.value = hora;
    opt.textContent = hora;
    if (hora === valor) opt.selected = true;
    select.appendChild(opt);
  }
  return select;
}

function crearFilaIntervalo(container, desde = "09:00", hasta = "17:00") {
  const fila = document.createElement("div");
  fila.classList.add("intervalo");

  const selDesde = crearSelectHora(desde);
  selDesde.classList.add("select-desde");
  const selHasta = crearSelectHora(hasta);
  selHasta.classList.add("select-hasta");

  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "-";
  btnEliminar.classList.add("btn-int");
  btnEliminar.onclick = () => fila.remove();

  fila.append(selDesde, selHasta, btnEliminar);
  container.appendChild(fila);
}

function construirUIHorarios(horariosIniciales = null, esNuevo = false) {
  diasContainer.innerHTML = "";

  diasSemana.forEach(dia => {
    const card = document.createElement("div");
    card.classList.add("dia-card");
    card.dataset.dia = dia.key;

    const header = document.createElement("div");
    header.classList.add("dia-header");

    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.classList.add("dia-checkbox");

    const lbl = document.createElement("label");
    lbl.textContent = dia.label;

    header.append(chk, lbl);

    const intervalosDiv = document.createElement("div");
    intervalosDiv.classList.add("intervalos-dia");

    // Valores iniciales
    let intervalosData = [];
    if (horariosIniciales && horariosIniciales[dia.key]) {
      intervalosData = horariosIniciales[dia.key];
    } else if (esNuevo && dia.laboral) {
      intervalosData = [{ desde: "09:00", hasta: "17:00" }];
    }

    if (intervalosData.length) {
      chk.checked = true;
      intervalosData.forEach(int => {
        crearFilaIntervalo(intervalosDiv, int.desde, int.hasta);
      });
    }

    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.classList.add("btn-plus-dia");
    btnPlus.onclick = () => {
      if (!chk.checked) chk.checked = true;
      crearFilaIntervalo(intervalosDiv);
    };


    card.append(header, intervalosDiv, btnPlus);
    diasContainer.appendChild(card);
  });
}

function leerHorariosDesdeUI() {
  const data = {};

  const cards = diasContainer.querySelectorAll(".dia-card");
  cards.forEach(card => {
    const diaKey = card.dataset.dia;
    const chk = card.querySelector(".dia-checkbox");
    const intervalosDiv = card.querySelector(".intervalos-dia");
    const filas = [...intervalosDiv.querySelectorAll(".intervalo")];

    if (!chk.checked || !filas.length) return;

    const arr = filas.map(f => ({
      desde: f.querySelector(".select-desde").value,
      hasta: f.querySelector(".select-hasta").value
    }));

    data[diaKey] = arr;
  });

  return data;
}


// ABRIR MODAL AGREGAR / EDITAR

function poblarProfesionalesSelect() {
  profesionalSelect.innerHTML = "";
  const optEmpty = document.createElement("option");
  optEmpty.value = "";
  optEmpty.textContent = "Seleccionar profesional";
  profesionalSelect.appendChild(optEmpty);

  profesionalesMock.forEach(nombre => {
    const opt = document.createElement("option");
    opt.value = nombre;
    opt.textContent = nombre;
    profesionalSelect.appendChild(opt);
  });
}

function abrirModalAgregar() {
  servicioEditando = null;
  tituloModal.textContent = "Agregar servicio";

  campoNombre.value = "";
  campoDuracion.value = "";
  campoPrecio.value = "";
  campoAclaracion.value = "";

  // Profesional: usar SELECT
  poblarProfesionalesSelect();
  profesionalSelect.classList.remove("oculto");
  profesionalTexto.classList.add("oculto");
  profesionalTexto.value = "";

  // Horarios por defecto (Lun-Vie 09-17)
  construirUIHorarios(null, true);

  modalServicio.classList.add("show");
}

function abrirModalEditar(serv) {
  servicioEditando = serv;
  tituloModal.textContent = "Editar servicio";

  campoNombre.value = serv.nombre;
  campoDuracion.value = serv.duracion;
  campoPrecio.value = serv.precio;
  campoAclaracion.value = serv.aclaracion || "";

  // Profesional: texto no editable
  profesionalSelect.classList.add("oculto");
  profesionalTexto.classList.remove("oculto");
  profesionalTexto.value = serv.profesional || "";

  // Horarios desde el servicio
  construirUIHorarios(serv.horarios || {}, false);

  modalServicio.classList.add("show");
}

// GUARDAR SERVICIO
btnGuardarModal.onclick = () => {
  const horarios = leerHorariosDesdeUI();

  let profesionalValor;
  if (servicioEditando) {
    profesionalValor = profesionalTexto.value;
  } else {
    profesionalValor = profesionalSelect.value || "";
  }

  const data = {
    nombre: campoNombre.value,
    duracion: Number(campoDuracion.value) || 0,
    profesional: profesionalValor,
    precio: Number(campoPrecio.value) || 0,
    aclaracion: campoAclaracion.value,
    horarios
  };

  if (!USE_BACKEND) {
    if (servicioEditando) {
      Object.assign(servicioEditando, data);
    } else {
      data.id = Date.now();
      serviciosMock.push(data);
    }
    modalServicio.classList.remove("show");
    renderServicios(serviciosMock);
    return;
  }

  alert("Conectar a backend MiTurno");
};

// MODAL ELIMINAR
function abrirModalEliminar(serv) {
  servicioEliminando = serv;
  textoEliminar.textContent = `¿Eliminar "${serv.nombre}"?`;
  modalEliminar.classList.add("show");
}

btnConfirmarEliminar.onclick = () => {
  if (!USE_BACKEND) {
    serviciosMock = serviciosMock.filter(s => s.id !== servicioEliminando.id);
    modalEliminar.classList.remove("show");
    renderServicios(serviciosMock);
    return;
  }
  alert("Conectar backend");
};

btnCancelarEliminar.onclick = () => modalEliminar.classList.remove("show");

// EVENTOS GENERALES
btnAbrirAgregar.onclick = abrirModalAgregar;
btnCancelarModal.onclick = () => modalServicio.classList.remove("show");

// INICIO
renderServicios(serviciosMock);
