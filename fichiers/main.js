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
var id_stat = -1;
var nom_dep;
var tab;
var PannelAlreadyExist = 0;
//var PannelAlreadyExist = new Boolean(false);   // valeur initiale à false;


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
  console.log("id_stat : ",id_stat);
  //Affiche le nom de la stat étudiée
  info.innerHTML = "Statistique étudiée : " + stat + " en " + annee;
  return
}




//RECUPARATION INFORMATIONS PERTINENTES

//récupération département cliqué
map.on('singleclick', function(e) {
  dep = map.forEachFeatureAtPixel(e.pixel, function(dep) {
  if (id_stat < 0) {alert('Vous devez choisir une statistique à étudier ou valider votre choix !')}
  else{
    nom_dep = dep.N.nom;
    //Renvoie le nom du département cliqué dans la console
    console.log("Information sur le point cliqué : ", dep.N.nom);
    //Récupére le tableau associé au département choisi
    fetch('donnees.json').then(function(response){
      response.json().then(function(data){
        for (let i = 0; i < data[0].departements.length; i++){//Parcourt la liste des départements
          // Récupère la stat en fonction du département
          if(nom_dep == data[0].departements[i].nom){
            tab = data[0].departements[i].statistiques[id_stat];
            //console.log(tab); // tableau 12,1 en sortie qui n'est pas affichable
          }
        }
      })
    })
    //Affiche pannel 
    afficher_pannel()
  }
  })
})


  
    //AFFICHAGE INFORMATIONS DANS PANNEAU 
function afficher_pannel(){ //NE FONCTIONNE PAS !!!!!!!!!!!!!!!!!!!!!!!!!!!
  //création panneau s'il n'existe pas déjà
  if(PannelAlreadyExist == 0) {
    setTimeout(function(){
      pannel.style.display = 'block';
      //ajout Info stat étudiée titre pannel 
      titre.innerHTML = nom_dep.bold() + " : Timeline du " + stat.toLowerCase() + " en " + annee;

      var xValues = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
      var yValues = tab;

      var chart = new Chart("myChart", {
        type: "line",
        data: {
          labels: xValues,
          datasets: [
            {// dataset
              lineTension: 0,
              backgroundColor: "rgba(0,20,255,0.1)",
              borderColor: "rgba(0,20,255,0.5)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(0,20,255,0.5)",
              data: [yValues[0],yValues[1]]
            }    
          ]
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [{ticks: {min: 0, max: Math.max.apply(null, yValues)+1}}],
          }
        }
      });

console.log(chart.data.datasets[0].data);
      // Add a new point to the chart every second
      setInterval(function() {
        for (let i = 1; i < yValues.length; i++){
        var newPoint = yValues[i]; // add new point from the list
        chart.data.datasets[0].push(newPoint); // Add the new data point to the chart
        console.log(chart.data);
        chart.update();} // Update the chart to display the new data point
      }, 2000); // Execute the function every 2 seconds
    }, 800 )




    //fermeture
    document.getElementById("btn_close").addEventListener('click', function() {
      pannel.style.display = 'none';
      PannelAlreadyExist = 0
    });

    PannelAlreadyExist = 1
  }

};



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
  