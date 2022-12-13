// VARIABLES
var select_statistique = document.getElementById('statistiques');
var select_annee = document.getElementById('annee');
var form = document.getElementById('form');


// CREATION CARTE AVEC OPENLAYERS
var map = new ol.Map({
    target: 'map', // the ID of the element in which to render the map
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([3, 47]),
      zoom: 5.5
    })
  });

// AJOUT GEOJSON DES DÉPARTEMENTS -> create a new vector layer for the GeoJSON data
  var dep = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: 'contour_dep.geojson',
      format: new ol.format.GeoJSON()
    }),
  })
  map.addLayer(dep);// add the vector layer to the map



// AJOUT DES STATISTIQUES DANS LE SELECT

select_statistique.selectedIndex=1;
fetch('donnees.json').then(function(response){
  if (response.status!==200){
    console.log('Error Satus Code :'+ response.status);
    return;
  }
  response.json().then(function(data){
    let option;
    console.log(data[1].statistiques);
    for (let i = 0; i < data[1].statistiques.length; i++){
      option = document.createElement('option');
      option.text = data[1].statistiques[i].nom;
      select_statistique.add(option);
    }
  })
})

//AJOUT DES ANNEES DANS LE SELECT
// for (let i = 1980; i < 2023; i++){
//   option = document.createElement('option');
//   option.text = i;
//   select_annee.add(option);
// }

form.addEventListener("submit", envoi)
function envoi(e){
  e.preventDefault();
  var stat = select_statistique.options[select_statistique.selectedIndex].value;
  var annee = select_annee.value;
  console.log("stats : ",stat);
  console.log("année : ",annee);
}
