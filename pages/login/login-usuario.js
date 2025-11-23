/**
 * Maneja el inicio de sesión del usuario.
 * @param {Event} event - El evento de envío del formulario.
 */
function iniciarSesion(event) {
  event.preventDefault();

  // Variables locales 
  const correo = document.getElementById("loginEmail").value.trim();
  const clave = document.getElementById("loginPassword").value.trim();
  const URL_DESTINO = "./pages/home-usuario/home-usuario.html"; 

  if (!correo || !clave) {
    alert("Por favor completá todos los campos.");
    return;
  }

  const listaUsuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = listaUsuarios.find(
    (u) => u.email === correo && u.password === clave
  );

  if (usuarioValido) {
    alert("¡Inicio de sesión exitoso!");

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));

    window.location.href = URL_DESTINO;
  } else {
    alert("Email o contraseña incorrectos.");
  }
}