var ctx = document.getElementById('myChart').getContext('2d');

var data = {
  labels: ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"],
  datasets: [{
    label: 'My Dataset',
    data: yValues,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

  var myChart = new Chart(ctx, {
  type: 'line',
  data: data,
  options: options
});

// Add a new point to the chart every second
setInterval(function() {
var newDataPoint = Math.floor(Math.random() * 100); // Generate a random data point
myChart.data.datasets[0].data.push(newDataPoint); // Add the new data point to the chart
myChart.update(); // Update the chart to display the new data point
}, 1000); // Execute the function every second