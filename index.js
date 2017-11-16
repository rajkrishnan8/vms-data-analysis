const express = require('express')
const app = express();
const http = require('http');
require('./app/index')

app.get('/', (req, res) => res.send('Hello World'))

//app.listen(3000, () => console.log('Example app listening on port 3000!'))

/*http.get('http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false', (res) => {
        console.log(res);
    })

*/