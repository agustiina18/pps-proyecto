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

// Modal agregar/editar 
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

// RENDER DE TARJETAS 
function renderServicios(lista) {
  listaServicios.innerHTML = "";

  lista.forEach(serv => {
    const div = document.createElement("div");
    div.className = "servicio-card";

    
    const dniProfesional = "99.999.999"; 
    
    div.innerHTML = `
      <div class="servicio-titulo">${serv.nombre}</div>
      
      <div class="servicio-dato">Profesional: ${serv.profesional || "No asignado"}</div>
      <div class="servicio-dato">DNI Profesional: ${dniProfesional}</div>
      <div class="servicio-dato">Duración: ${serv.duracion} min</div> 
      
      <div class="servicio-dato">Precio: $${serv.precio}</div>
      
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



function crearGrupoIntervalo(container, desde = "09:00", hasta = "17:00") {
  const grupo = document.createElement("div");
  grupo.classList.add("intervalo-grupo"); 

  // Configuración (Int y Max)
  const configIntMax = document.createElement("div");
  configIntMax.classList.add("dia-config"); 

  const lblInt = document.createElement("span");
  lblInt.textContent = "Int:";
  
  const inputInt = document.createElement("input");
  inputInt.type = "number";
  inputInt.min = 1;
  inputInt.max = 999;
  inputInt.placeholder = "5";
  inputInt.classList.add("input-int");
  
  const lblMax = document.createElement("span");
  lblMax.textContent = "Max:";
  
  const inputMax = document.createElement("input");
  inputMax.type = "number";
  inputMax.min = 1;
  inputMax.max = 99;
  inputMax.placeholder = "1";
  inputMax.classList.add("input-max");
  
  configIntMax.append(lblInt, inputInt, lblMax, inputMax);


  // Horario (Desde/Hasta y Botón de Eliminar)
  const horarioFila = document.createElement("div");
  horarioFila.classList.add("intervalo"); 
  
  
  const selDesde = crearSelectHora(desde);
  selDesde.classList.add("select-desde");
  const selHasta = crearSelectHora(hasta);
  selHasta.classList.add("select-hasta");
  
  const btnEliminar = document.createElement("button");
  btnEliminar.textContent = "-";
  btnEliminar.classList.add("btn-int");
  btnEliminar.onclick = () => grupo.remove(); // Elimina todo el grupo


  horarioFila.append(selDesde, selHasta, btnEliminar);

  grupo.append(configIntMax, horarioFila);
  container.appendChild(grupo);
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

    const gruposContainer = document.createElement("div"); // Contenedor de grupos
    gruposContainer.classList.add("grupos-horarios-dia");

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
        crearGrupoIntervalo(gruposContainer, int.desde, int.hasta); // Crear grupo inicial
      });
    }

    // Botón de Agregar (+)
    const btnPlus = document.createElement("button");
    btnPlus.textContent = "+";
    btnPlus.classList.add("btn-plus-dia");
    btnPlus.onclick = () => {
      if (!chk.checked) chk.checked = true;
      crearGrupoIntervalo(gruposContainer); // Agrega un nuevo grupo completo
    };


    card.append(header, gruposContainer, btnPlus);
    diasContainer.appendChild(card);
  });
}

function leerHorariosDesdeUI() {
  const data = {};

  const cards = diasContainer.querySelectorAll(".dia-card");
  cards.forEach(card => {
    const diaKey = card.dataset.dia;
    const chk = card.querySelector(".dia-checkbox");
    const gruposContainer = card.querySelector(".grupos-horarios-dia"); 
    const grupos = [...gruposContainer.querySelectorAll(".intervalo-grupo")];

    if (!chk.checked || !grupos.length) return;

    
    const arr = grupos.map(grupo => ({
      // Lectura de Horario (Desde/Hasta)
      desde: grupo.querySelector(".select-desde").value,
      hasta: grupo.querySelector(".select-hasta").value,
      // Lectura de Int/Max
      int: Number(grupo.querySelector(".input-int").value) || null,
      max: Number(grupo.querySelector(".input-max").value) || null,
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

  // Profesional
  poblarProfesionalesSelect();
  profesionalSelect.classList.remove("oculto");
  profesionalTexto.classList.add("oculto");
  profesionalTexto.value = "";

  // Horarios por defecto 
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

document.addEventListener("input", e => {
  if (e.target.classList.contains("input-int")) {
    e.target.value = e.target.value.slice(0, 3);
  }

  if (e.target.classList.contains("input-max")) {
    e.target.value = e.target.value.slice(0, 2);
  }
});