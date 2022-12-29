// VARIABLES
var select_statistique = document.getElementById('statistiques');
var select_annee = document.getElementById('annee');
var form = document.getElementById('form');
var info = document.getElementById('info');
var pannel = document.getElementById('pannel');
var titre = document.getElementById('titre');
var timeline = document.getElementById('timeline');
var stat;
var annee;
var id_stat;
var nom_dep;
var tab;
var PannelAlreadyExist = false;


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
    format: new ol.format.GeoJSON(),
  })
});
map.addLayer(dep);// add the vector layer to the map
console.log(dep);



// AJOUT DES STATISTIQUES DANS LE SELECT
select_statistique.selectedIndex=1;
fetch('donnees.json').then(function(response){
  if (response.status!==200){
    console.log('Error Satus Code :' + response.status);
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

// AJOUT DES ANNEES DANS LE SELECT
for (let i = 2022; i > 1980; i--){
  option = document.createElement('option');
  option.text = i;
  select_annee.add(option);
}



//ENVOIE FORM AVEC STAT ET ANNEE CHOISIES
form.addEventListener("submit", envoi)
function envoi(e){
  e.preventDefault();
  stat = select_statistique.options[select_statistique.selectedIndex].value;
  annee = select_annee.value;
  id_stat = select_statistique.selectedIndex - 1;
  // console.log("stats : ",stat);
  // console.log("année : ",annee);
  // console.log("id_stat : ",id_stat);
  //Affiche le nom de la stat étudiée
  info.innerHTML = "Statistique étudiée : " + stat + " en " + annee;
  return
}




//RECUPARATION INFORMATIONS PERTINENTES

var id_stat = -1; //id stat choisie
//récupération département cliqué
map.on('singleclick', function(e) {
  var dep = map.forEachFeatureAtPixel(e.pixel, function(dep) {
  if (id_stat < 0) {alert('Vous devez choisir une statistique à étudier ou valider votre choix !')}
    //renvoie le nom du département cliqué dans la console
  else{
    nom_dep = dep.N.nom;
    //console.log("Information sur le point cliqué : ", dep.N.nom)
  }
  return 
  });
});

//Récupérer le tableau associé au département choisi
  fetch('donnees.json').then(function(response){
    response.json().then(function(data){
      for (let i = 0; i < data[0].departements.length; i++){//Parcourt la liste des départements
        // Récupère la stat en fonction du département
        if(nom_dep == data[0].departements[i].nom){
          tab = data[0].departements[i].statistiques[id_stat];
          console.log(tab); // tableau 12,1 en sortie qui n'est pas affichable
        afficher_pannel();
        return 
        }
      }
    })
  })



  
    //AFFICHAGE INFORMATIONS PERTINENTES -> panneau pour Timeline 
function afficher_pannel(){ //NE FONCTIONNE PAS !!!!!!!!!!!!!!!!!!!!!!!!!!!
    //création panneau s'il n'existe pas déjà
  if(PannelAlreadyExist = false) {
    setTimeout( () => {
      pannel.style.display = 'block'
    }, 1000 )

    //ajout Info stat étudiée titre pannel 
    titre.innerHTML = nom_dep.bold() + " : Timeline circulaire du " + stat.toLowerCase() + " en " + annee;
    timeline.add(Janvier);//(NE FONCTIONNE PAS)
    //var month = new Array("Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre");  
    // for (i = 0; i<month.length; i++){  
    // timeline.add(month[i]);  
    // }

    //fermeture
    document.getElementById('btn_close').addEventListener('click', function(e) {
      pannel.style.display = 'none'
      });

    PannelAlreadyExist = true
  }

}
  
   
  
  
  
  // function fetchJSON(url, code_dep) { //Appel du GEOJSON stocké dans le dossier, contenant les frontières de chaque département métropolitain
  //   return fetch(url)
  //   .then(result => result.json())
  //   .then(r => {
  //     for (var i = 0; i <= 96; i++) {
  //       if (r['features'][i]['properties']['code'] == code_dep) { //Grâce au 'for... if...', on trouve les frontières correspondant au département souhaité.
  //         L.geoJSON(r['features'][i]).addTo(dep_layer); //Ajout des frontières dans le layerGroup
  //         dep_layer.addTo(map); //Ajout du layerGroup sur la carte
  //       }
  //     }
  //   });
  //   }
  //fetchJSON('../contour-des-departements.geojson', r[0]['code_dep'])
  