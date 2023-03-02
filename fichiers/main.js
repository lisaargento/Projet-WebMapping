// VARIABLES
var select_statistique = document.getElementById('statistiques');
var select_annee = document.getElementById('annee');
var form = document.getElementById('form');
var info = document.getElementById('info');
var pannel = document.getElementById('pannel');
var titre = document.getElementById('titre');
var timeline = document.getElementById('timeline');
const startStopBtn = document.querySelector("#startStopBtn");
var btn_close = document.getElementById("btn_close");
var stat; //statistique selectionnée
var annee; //année selectionnée
var id_stat = -1;//indice statistique selectionnée
var nom_dep; //nom département selectionné
var tab; //variable qui va prendre le tableau 12,1 pour la statistique selectionnée
var PannelAlreadyExist = 0;//
var chart; //graphique
var t; //temps pour interval
var i = 2; //indice pour faire défiler les points de la chart


alert("Vous devez d'abord choisir une statistique à étudier et une année d'étude. Puis il vous suffira de cliquer sur le ou les départements que vous souhaitez étudier.");



//  -------------------------- AFFICHAGE DE LA CARTE -------------------------- //

//Définition de la vue initiale (pour pouvoir recentrer la carte)
const view = new ol.View({
  center: ol.proj.fromLonLat([3, 46.6]),// coordonnées de centrage
  zoom: 5.35// niveau de zoom
});

// CREATION CARTE AVEC OPENLAYERS
var map = new ol.Map({
  target: 'map',
  layers: [new ol.layer.Tile({source: new ol.source.OSM()})],
  view: view
});

//AJOUT BOUTON POUR RECENTRER LA CARTE
const centerButton = document.getElementById('center-button');
centerButton.addEventListener('click', function() {
  view.setCenter(ol.proj.fromLonLat([3, 46.6]));
  view.setZoom(5.3);
});

// AJOUT GEOJSON DES DÉPARTEMENTS -> créer une nouvelle couche vecteur (new vector layer) pour les données GeoJSON
var depLayer = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'contour_dep.geojson',
    format: new ol.format.GeoJSON(),
  })
});
map.addLayer(depLayer);// ajoute la couche vecteur à la carte


// Générer une couleur aléatoire
function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}
// Créer une table de hachage pour stocker les couleurs des départements
const depColors = {};

// Charger le GeoJSON des départements et ajouter les couleurs
fetch('contour_dep.geojson')
.then(response => response.json())
.then(data => {
  // Pour chaque département, générer une couleur aléatoire et l'associer au code de département
  data.features.forEach(feature => {
    const depCode = feature.properties.code;
    depColors[depCode] = randomColor();
  });
  // Appliquer le style aux départements en utilisant la table de hachage de couleurs
  depLayer.setStyle(function(feature) {
    const depCode = feature.get('code');
    const color = depColors[depCode];
    return new ol.style.Style({
      fill: new ol.style.Fill({
        color: color
      }),
      stroke: new ol.style.Stroke({
        color: 'black',
        width: 0.2
      }),
      text: new ol.style.Text({
        font: '1.7vh Calibri',//taille et typo des noms des départements
        text: feature.get('nom'),
        fill: new ol.style.Fill({
          color: 'black'
        }),
        stroke: new ol.style.Stroke({//contour pour que ce soit plus lisible
          color: 'white',
          width: 1.5
        })
      })
    });
  });
});





//  -------------------------- REMPLISSAGE ET ENVOI FORM -------------------------- //

// AJOUT DES STATISTIQUES DANS LE SELECT
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
  if (select_statistique.value == 'Choix de la statistique' || select_annee.value == "Choix de l'année d'étude") {
    alert("Vous devez choisir une statistique à étudier et une année d'étude avant de valider.");
  }
  else {
    stat = select_statistique.options[select_statistique.selectedIndex].value;
    annee = select_annee.value;
    id_stat = select_statistique.selectedIndex - 1;
    // console.log("stats : ",stat);
    // console.log("année : ",annee);
    console.log("id_stat : ",id_stat);
    //Affiche le nom de la stat étudiée
    info.innerHTML = "Statistique étudiée : " + stat + " en " + annee;
  }

}


//  -------------------------- AFFICHAGE PANNEAU INFO -------------------------- //


//Récupère département cliqué
map.on('singleclick', function(e) {
  dep = map.forEachFeatureAtPixel(e.pixel, function(dep) {
    if (id_stat < 0) {
      alert("Vous devez d'abord choisir une statistique à étudier et une année d'étude. Puis il vous suffira de cliquer sur le ou les départements que vous souhaitez étudier.");
    }
    else {
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
          // Affichage du panneau
          pannel.style.display = 'block';
          remplissage_pannel();
        })
      })    
    };
  })
})



//AJOUT INFORMATIONS DANS PANNEAU
function remplissage_pannel(){
  //Ajout titre pannel : Info stat étudiée 
  titre.innerHTML = nom_dep.bold() + " : Timeline du " + stat.toLowerCase() + " en " + annee;

  var xValues = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

  chart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {label: stat,
        lineTension: 0,
        backgroundColor: "rgba(0,20,255,0.1)",
        borderColor: "rgba(0,20,255,0.5)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(0,20,255,0.5)",
        data: [tab[0]]}    
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: Math.max.apply(null, tab) + Math.min.apply(null, tab)
        }
      }
    }
  });

  i = 2; // initialisation obligatoire si on veut pouvoir fermer et ouvrir correctement les panneaux
  affichagePoints();

}
  
// PERMET D'AFFICHER LES POINTS AU FUR ET A MESURE
function affichagePoints() {
  t = setInterval(function () {
    if (i == 13) {
      i = 1;
    }
    chart.data.datasets[0].data = tab.slice(0,i); // .slice équivaut que slicing en python [:]
    chart.update();
    i ++;
  } , 1000);
}

// AJOUT BOUTON POUR FERMER LE PANNEAU ET SUPPRIMER LE GRAP EXISTANT
btn_close.addEventListener('click', function() {
  clearInterval(t);
  startStopBtn.innerHTML = '<img src="pause.png">';
  pannel.style.display = 'none';
  chart.destroy();//supprime chart
});

// AJOUT BOUTON POUR ARRETER OU DEMARRER ANIMATION CHART
startStopBtn.addEventListener("click", function() {
  if (startStopBtn.innerHTML == '<img src="pause.png">') {
      // Code pour l'action de "Stop"
      clearInterval(t);
      startStopBtn.innerHTML = '<img src="play.png">';
  } else {
    // Code pour l'action de "Start"
    clearInterval(t);
    affichagePoints();
    startStopBtn.innerHTML = '<img src="pause.png">';
  }
});




