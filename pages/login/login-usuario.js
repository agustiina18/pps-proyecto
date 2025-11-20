function loginUsuario(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Por favor completá todos los campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const usuarioValido = usuarios.find(
    (u) => u.email === email && u.password === password
  );

  if (usuarioValido) {
    alert("¡Inicio de sesión exitoso!");

    localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));

    window.location.href = "agenda.html";
  } else {
    alert("Email o contraseña incorrectos.");
  }
}
