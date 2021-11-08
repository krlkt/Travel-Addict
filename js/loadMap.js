var karte = L.map('karte').setView([20, 0], 2);

$.getJSON('/img/map.geojson', function(data)
{
  L.geoJson(data).addTo(karte);
});

/*
var states = [{
    "type": "Feature",

}]
*/