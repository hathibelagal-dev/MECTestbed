var got = require('got');
var fs = require('fs');
var express = require('express');
var app = express()

// The URL of the Location Service API through the API gateway
var url = 'http://gateway-app/location/v2/queries/users';

var oldZone = -1;
var zoneCounter = 0;
var inMigration = 0;
function getUserInfo() {
    // Make a HTTP GET request to the URL
    got(url).then((response) => {    
        var data = JSON.parse(response.body);
        console.log(inMigration);
        if(!inMigration) {
            console.log(zoneCounter);
		    console.log(JSON.stringify(data));
        } else {
            var runtimeLogs = "";
            try {
                runtimeLogs = fs.readFileSync('/data/runtimedata.dat', 'utf-8');
            } catch(noFile) {}
                runtimeLogs += "\n" + JSON.stringify(data);
                fs.writeFileSync('/data/runtimedata.dat', runtimeLogs);
        }
        try {
            var zone = data['userList']['user'][0]['zoneId'];
            if(zone != oldZone) {
                oldZone = zone;
                zoneCounter += 1;
                
                // persist state in volume
                var state = {
                    'counter': zoneCounter,
                    'zone': oldZone
                };
                fs.writeFileSync('/data/state.json', JSON.stringify(state));
            }
        } catch(e) {
            console.log('No zone info available');
        }
    });
}

// user state init
try {
    var data = JSON.parse(fs.readFileSync('/data/state.json', 'utf-8'));
    zoneCounter = data['counter'];
    oldZone = data['zone'];
    console.log("Using saved state");
} catch(e) {
    console.log("No state present");
}

// Repeat every 200 ms
setInterval(getUserInfo, 200);

// An endpoint that this application exposes so that
// it can be told when the migration phase changes 
app.get('/changePhase', (req, res) => {
    if(req.query.inMigration) {
        inMigration = 1;
    } else {
        inMigration = 0;
    }
    fs.writeFileSync('/data/runtimedata.dat', "");
    res.status(200).send("OK");
});

// Start a web server so the endpoint is accessible
app.listen(3000, () => {
    console.log("Started app");
});
