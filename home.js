document.addEventListener('DOMContentLoaded', function () {
  const heroCarousel = document.querySelector('#heroCarousel');
  new bootstrap.Carousel(heroCarousel, {
    interval: 3000,
    ride: 'carousel',
    pause: false,
    touch: true
  });
});
const installers = [
  { name: "John Doe", phone: "08012345678", state: "Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Praise", phone: "08123456789", state: "Lagos", lat: 6.5290, lng: 3.3815 },
  { name: "Ifeanyi Nwankwo", phone: "08099887766", state: "Enugu", lat: 6.4478, lng: 7.5139 },
  { name: "Chinedu Obi", phone: "07012344321", state: "Enugu", lat: 6.4480, lng: 7.5000 },
  { name: "Bola Akin", phone: "09087654321", state: "Abuja", lat: 9.0578, lng: 7.4951 },
  { name: "Musa Abdullahi", phone: "08011223344", state: "Kano", lat: 12.0000, lng: 8.5167 },
  { name: "Musa", phone: "08011223344", state: "Kastina", lat: 12.981604, lng: 7.622149 }
];

const map = L.map('map').setView([9.0820, 8.6753], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

let markers = [];

function clearMarkers() {
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
}

function showInstallers(stateName) {
  clearMarkers();

  const stateInstallers = installers.filter(installer => installer.state.toLowerCase() === stateName.toLowerCase());

  const container = document.getElementById('installer-details');
  container.innerHTML = `<h5>${stateName} Installers</h5>`;

  if (stateInstallers.length === 0) {
    container.innerHTML += `<p>No installers found for this state.</p>`;
    return;
  }

  const list = document.createElement('ul');
  list.classList.add('list-group', 'mb-3');

  stateInstallers.forEach(installer => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerHTML = `
  <strong>${installer.name}</strong><br>
  <a href="tel:${installer.phone}">${installer.phone}</a>
`;

    list.appendChild(li);

    const marker = L.marker([installer.lat, installer.lng])
      .addTo(map)
      .bindPopup(`<strong>${installer.name}</strong><br>Phone: ${installer.phone}`);

    markers.push(marker);
  });

  container.appendChild(list);

  if (stateInstallers.length > 0) {
    map.setView([stateInstallers[0].lat, stateInstallers[0].lng], 10);
  }
}

document.getElementById('stateSearch').addEventListener('input', function (e) {
  const value = e.target.value.trim();
  if (value.length >= 3) {
    showInstallers(value);
  }
});