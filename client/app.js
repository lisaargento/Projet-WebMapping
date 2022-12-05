var map = L.map('map').setView([48.8411199,2.5884038], 11);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
 
var button1 = document.getElementById('tdt1');
var button2 = document.getElementById('tdt2');
var shelterMarkers = new L.FeatureGroup();
var info=document.getElementById("info");
liste_marker=[];


function ajout(){
  var marker = L.marker([r[i].lat, r[i].lon]);
  liste_marker.push(marker);
  marker.addTo(shelterMarkers);
  shelterMarkers.addTo(map);
  info.textContent="magnitude: "+r[i].magni+" distance:"+r[i].dist;
  map.fitBounds(shelterMarkers.getBounds());
}

function tdt1(i){
    data="id2="+i
    fetch('../serveur/my_tdt1.json', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(r => r.json())
      .then(r => {
        button1.addEventListener("click",ajout,{once:true});
      })

}
function tdt2(i){
    data="id="+i
    fetch('../serveur/my_tdt2.json', {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(r => r.json())
      .then(r => {
        button2.addEventListener("click",ajout,{once:true});
      })
}


for(var i=0;i<3;i++){
    tdt1(i);
    tdt2(i);
}