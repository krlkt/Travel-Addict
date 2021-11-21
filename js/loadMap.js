const mymap = L.map('map').setView([20, 0], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png	', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

const visitedCountries = [];
for(let i = 2; i < localStorage.length; i++)
{
  var item = JSON.parse(localStorage.getItem(localStorage.key(i)));
  visitedCountries.push(item[0].land);
}

//visitedCountries = ['DE', 'US', 'RU', 'ID'];

const loadData = async () => {
  const response = await fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson')
  const data = await response.json();
  console.log(data);
  return data;
}



const displayData = async () => {
  const data = await loadData();
  const filteredData = {
    ...data,
    features: data.features.filter(feature =>
      !visitedCountries.includes(feature.properties.iso_a2))
  };

  L.geoJSON(filteredData, {
    style: function (feature) {
      return {
        fill: true,
        weight: 0.5,
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7
      };
    }
  }).addTo(mymap);
}

displayData();


