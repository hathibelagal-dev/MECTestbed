var got = require('got');

// The URL of the RNIS API through the API gateway
var url = 'http://gateway-app/rni/v2/queries/rab_info';

function getRABInfo() {
    // Make a HTTP GET request to the URL
    got(url).then((response) => {
        // Parse the JSON document returned
        var data = JSON.parse(response.body);
        try {
            // Print the E-RAB info obtained
    	    console.log(data['cellUserInfo'][0]['ueInfo'][0]['erabInfo']);
        } catch(e) {
            console.log('No RAB info available');
        }
    });
}

// Repeat every 200 ms
setInterval(getRABInfo, 200);
