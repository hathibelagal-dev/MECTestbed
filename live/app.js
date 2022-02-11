var memcached = require('memcached-promise');
var client = new memcached('127.0.0.1:3000');
var got = require('got');

async function addToMemcache() {
    var url = 'http://localhost:8080/' + 
                'location/v2/queries/zones';
    var response = await got(url);
    var data = JSON.parse(response.body);
    var zones = data["zoneList"]["zone"];
    for(var i=0;i<zones.length;i++) {
        var zoneId = zones[i]["zoneId"];
        var nPOA = zones[i]["numberOfAccessPoints"];
        try {
            await client.add(zoneId, nPOA, 100);
            console.log(`Added ${zoneId}`);
        } catch(e) {
            console.log(`Not added ${zoneId}. May be present already`);
        }
    }
}

async function start() {
    await addToMemcache();
    // Test if the data is available on Memcache now
    var data = await client.get('zone01');
    console.log(data);
}

start();
