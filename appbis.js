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
      center: ol.proj.fromLonLat([2.5884038,48.8411199]),
      zoom: 7
    })
  });

// // AJOUT GEOJSON DES DÉPARTEMENT

// fetch("geojson/departements.geojson")
// .then(response => response.json())
// .then(response => {
//   L.geoJson(response).addTo(map);
// })



// AJOUT DES STATISTIQUES DANS LE SELECT

select_statistique.addEventListener('click',
  function(e){
    e.preventDefault();
    select_statistique.selectedIndex=1;
    fetch('donnees.json')
    .then(function(response){
      if (response.status!==200){
        console.log('Error Satus Code :'+ response.status);
        return;
      }
      response.json().then(function(data){
      let option;
      for (let i = 0; i < data[1].statistiques.length; i++){
        option = document.createElement('option');
        option.text = data[1].statistiques[i].nom;
        select_statistique.add(option);
      }
      })
    })
})

form.addEventListener("submit",envoi);

function envoi(e){
  e.preventDefault();
  var stat_selectionne = select_statistique.options[select_statistique.selectedIndex].value
  console.log("statistique = ",stat_selectionne);
}