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
      center: ol.proj.fromLonLat([37.41, 8.82]),
      zoom: 5
    })
  });


// AJOUT DES STATISTIQUES DANS LE SELECT

select_statistiques.addEventListener('change', function(e){
  select_statistique.selectedIndex=1;
  fetch('donnees.json')
  .then(function(response){
    if (response.status!==200){
      console.log('Error Satus Code :'+response.status);
      return;
    }
    response.json().then(function(data){
      let option;
      console.log(data[1].statistiques)
      for (let i=0; i<data[1].statistiques.length; i++){
        option = document.createElement('option');
        option.text = data[1].statistiques[i].nom;
        select_statistique.add(option);
      }
    })
  })
  .then(r => {
    // console.log(r)
    select_statistiques.innerHTML = r;
  })
})