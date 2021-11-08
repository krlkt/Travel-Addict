var karte = L.map('karte').setView([20, 0], 2);

$.getJSON('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson', function(data)
{
  L.geoJson(data).addTo(karte);
});

/*
var states = [{
    "type": "Feature",

}]
*/