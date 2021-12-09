$(document).ready(function()
{
    const dList = document.querySelector('#dList');
    var options = []
    var countryCodes = [];
    

    $.getJSON('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson',
        function(data)
        {
            var features = data.features;

            for(let i = 0; i < features.length; i++)
            {
                var country = data.features[i].properties.sovereignt;
                var countryCode = data.features[i].properties.iso_a2;

                countryCodes.push(countryCode);
                options.push(countryCode + " - " + country);
            }

            options.forEach(function(item)
            {
                var option = document.createElement('option');
                option.value = item;
                dList.appendChild(option);
            });
        })

        

        
})