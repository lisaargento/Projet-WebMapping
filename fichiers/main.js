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
var chart;

//alert("Vous devez d'abord choisir une statistique à étudier et une année d'étude. Puis il vous suffira de cliquer sur le ou les départements que vous souhaitez étudier.");



//  -------------------------- AFFICHAGE DE LA CARTE -------------------------- //
//Définition de la vue initiale (pour pouvoir recentrer la carte)
const view = new ol.View({
  center: ol.proj.fromLonLat([3, 46.6]),// coordonnées de centrage
  zoom: 5.35// niveau de zoom
});

// CREATION CARTE AVEC OPENLAYERS
var map = new ol.Map({
  target: 'map', // the ID of the element in which to render the map
  layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
  view: view
});

//AJOUT BOUTON POUR RECENTRER LA CARTE
const centerButton = document.getElementById('center-button');
centerButton.addEventListener('click', function() {
  view.setCenter(ol.proj.fromLonLat([3, 46.6]));
  view.setZoom(5.3);
});


// AJOUT GEOJSON DES DÉPARTEMENTS -> create a new vector layer for the GeoJSON data
var depLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'contour_dep.geojson',
    format: new ol.format.GeoJSON(),
  })
});
map.addLayer(depLayer);// add the vector layer to the 

//création style des département pour ajouter couleur
const styleFunction = function(format) {
  const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16); // generate a random color
  const name = format.get('nom'); // get the department name from the feature data
  const label = new ol.style.Text({
    font: '1.5vh Calibri',
    text: name,
    fill: new ol.style.Fill({
      color: 'black'
    }),
    stroke: new ol.style.Stroke({
      color: 'white',
      width: 1.5
    }),
  });
  return new ol.style.Style({
    fill: new ol.style.Fill({
      color: randomColor
    }),
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 0.2
    }),
    text: label // ajout des noms de département dans le style
  });
};
//AJOUT DU STYLE AUX DEPARTEMENTS
depLayer.setStyle(styleFunction);



//  -------------------------- REMPLISSAGE ET ENVOI FORM -------------------------- //

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


//  -------------------------- AFFICHAGE PANNEAU INFO DEP -------------------------- //


//récupération département cliqué
map.on('singleclick', function(e) {
  dep = map.forEachFeatureAtPixel(e.pixel, function(dep) {
  if (id_stat < 0) {alert('Vous devez choisir une statistique à étudier ou valider votre choix !')}
  else{
    nom_dep = dep.N.nom;
    console.log("Information sur le point cliqué : ", dep.N.nom);//Renvoie le nom du département cliqué dans la console
    //Récupére le tableau associé au département choisi
    fetch('donnees.json').then(function(response){
      response.json().then(function(data){
        for (let i = 0; i < data[0].departements.length; i++){//Parcourt la liste des départements
          // Récupère la stat en fonction du département
          if(nom_dep == data[0].departements[i].nom){
            tab = data[0].departements[i].statistiques[id_stat],
            console.log(tab); // tableau 12,1 en sortie
          }
        }
        afficher_pannel();
      })
    })    
  };
  })
})


//AFFICHAGE PANNEAU  
function afficher_pannel(){ 
  //création panneau s'il n'existe pas déjà
  if(PannelAlreadyExist == 0) {
    pannel.style.display = 'block',
    PannelAlreadyExist = 1,
    fermer_pannel(),
    remplissage_pannel()
  }
}

//AJOUT INFORMATIONS DANS PANNEAU
function remplissage_pannel(){
  //ajout Info stat étudiée titre pannel 
  titre.innerHTML = nom_dep.bold() + " : Timeline du " + stat.toLowerCase() + " en " + annee;

  var xValues = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
  var yValues = tab;
  

  chart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {label: 'Nombre de personnes décédées',
        lineTension: 0,
        backgroundColor: "rgba(0,20,255,0.1)",
        borderColor: "rgba(0,20,255,0.5)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(0,20,255,0.5)",
        data: [yValues[0]]}    
      ]
    },
    options: {
      scales: {
        yAxes: [{ticks: {min: 0, max: Math.max.apply(null, tab)+1}}],
      }
    }
  });
  
  // Add a new point to the chart every 2 seconds

  // var i=0;
  // let pointInterval = setInterval(
  //     i+=1,
  //     chart.data.datasets[0].data.push(yValues[i]),
  //     chart.update(),
  //     // if (i=12){break},// Update the chart to display the new data point every 2 seconds 
  //   1000); // Add the new data point to the chart
  //   if (i=12){clearInterval(pointInterval)};

//   for (let i = 0; i < 11; i++){//for (var i = 0; i < yValues.length; i++){
//     chart.update();// Update the chart to display the new data point every 2 seconds
//     setTimeout(
//       chart.data.datasets[0].data.push(yValues[i]),
//     1000); // Add the new data point to the chart
//  };
}
  

  //SUPPRESSION PANNEAU
  function fermer_pannel(){
    //écoute bouton pour fermer panneau
    if(PannelAlreadyExist == 1) {
      document.getElementById("btn_close").addEventListener('click', function() {
        chart.destroy();//supprimer chart existante!!!!!!!!!!!!!!!!!!!!!
        pannel.style.display = 'none';
        PannelAlreadyExist = 0;
      });
    }
  };


//Pr colorer les départements??????????????????????????????
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
  