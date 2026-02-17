document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reportForm");
  const reportsDiv = document.getElementById("reports");

  const locationInput = document.getElementById("location");
  const descriptionInput = document.getElementById("description");
  const urgencyInput = document.getElementById("urgency");
  const imageInput = document.getElementById("image");

  /* ---------------- MAP ---------------- */
  const map = L.map("map").setView([20.5937, 78.9629], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  /* ------------ GPS LOCATION ----------- */
  const detectBtn = document.getElementById("detectLocation");
  detectBtn.addEventListener("click", () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      locationInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      map.setView([lat, lng], 14);
      L.marker([lat, lng]).addTo(map);
    });
  });

  /* ----------- LOCAL STORAGE ------------ */
  let reports = JSON.parse(localStorage.getItem("reports")) || [];

  function renderReports() {
    reportsDiv.innerHTML = "";

    reports.forEach((r) => {
      const div = document.createElement("div");
      div.className = "report";

      div.innerHTML = `
        ${r.image ? `<img src="${r.image}">` : ""}
        <h3>📍 ${r.location}</h3>
        <p>${r.description}</p>
        <span class="badge ${r.urgency.toLowerCase()}">
          ${r.urgency}
        </span>
      `;

      reportsDiv.appendChild(div);
    });
  }

  renderReports();

  const msg = document.getElementById("successMsg");
msg.style.display = "block";

setTimeout(() => {
  msg.style.display = "none";
}, 2000);


  /* ------------- SUBMIT FORM ------------ */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let imageURL = "";
    if (imageInput.files[0]) {
      imageURL = URL.createObjectURL(imageInput.files[0]);
    }

    const report = {
      location: locationInput.value,
      description: descriptionInput.value,
      urgency: urgencyInput.value,
      image: imageURL
    };

    reports.push(report);
    localStorage.setItem("reports", JSON.stringify(reports));

    renderReports();
    form.reset();

    // success feedback
    const msg = document.getElementById("successMsg");
    if (msg) {
      msg.style.display = "block";
      setTimeout(() => {
        msg.style.display = "none";
      }, 2000);
    }
  });

  /* ------------- DARK MODE -------------- */
  const toggleBtn = document.getElementById("toggleTheme");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });
  }
});
