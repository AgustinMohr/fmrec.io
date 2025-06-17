document.addEventListener("DOMContentLoaded", () => {
  const trackForm = document.getElementById("trackForm");
  const trackList = document.getElementById("trackList");
  const userForm = document.getElementById("userForm");
  const userList = document.getElementById("userList");

  // Cargar pistas existentes
  fetch("/tracks")
    .then(res => res.json())
    .then(data => renderTracks(data));

  // Cargar usuarios existentes
  fetch("/users")
    .then(res => res.json())
    .then(data => renderUsers(data));

  // SUBIR PISTA
  trackForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(trackForm);

    fetch("/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(res => {
        alert(res.message);
        if (res.status === "ok") {
          trackForm.reset();
          fetch("/tracks")
            .then(r => r.json())
            .then(renderTracks);
        }
      });
  });



  // AGREGAR USUARIO
  userForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = userForm.username.value;
    const role = userForm.role.value;

    fetch("/add_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, role })
    })
      .then(res => res.json())
      .then(res => {
        alert("Usuario agregado");
        userForm.reset();
        fetch("/users")
          .then(r => r.json())
          .then(renderUsers);
      });
  });

  function renderTracks(tracks) {
    trackList.innerHTML = "";
    tracks.forEach((t, i) => {
      const audio = document.createElement("audio");
      audio.controls = true;
      audio.src = `/static/audio/${t.filename}`;

      const div = document.createElement("div");
      div.innerHTML = `<strong>${t.artist}</strong> - ${t.title}`;
      div.appendChild(audio);

      trackList.appendChild(div);
    });
  }

  function renderUsers(users) {
    userList.innerHTML = "";
    users.forEach(u => {
      const div = document.createElement("div");
      div.textContent = `${u.username} (${u.role})`;
      userList.appendChild(div);
    });
  }
});
