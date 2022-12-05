var map = L.map('map').setView([48.8411199,2.5884038], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var tdt1 = document.getElementById(tdt2);
var tdt2 = document.getElementById(tdt2);
var marker_tdt = new Location.FeatureGroup();

var marker = L.marker([51.5, -0.09]).addTo(map);


/*fetch('page.php')
.then(function (result) {
  // retourne le résultat binaire en text
  return result.text();
})
.then(function (result) {
  // result (le résultat au format texte)
  // par ex, on l’intègre brut dans la page
  document.getElementById('id').innerHTML = result;
})*/
