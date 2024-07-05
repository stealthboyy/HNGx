const express = require('express');
const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const path = "/api/";

app.set('trust proxy', true);

app.get(`${path}hello`, async (req, res) => {
    const visitorName = req.query.visitor_name;
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    let ip = clientIp.split(",")[0].trim()


    const localhostVariants = [
        "localhost", 
        "127.0.0.1",
        "::1",
        "[::1]",
        "0:0:0:0:0:0:1",
        "::",
    ];

    if (localhostVariants.includes(ip)) {
        ip = "127.0.0.1";
    }



    try {
        // Using an IP geolocation service to get the location of the request.
        const geoLocation = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IP_LOCATION_API_KEY}&ip=${ip}`);

        const location = geoLocation.data.state_prov;

        //  Using a weather API to get the temperature of the requester's location

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${ip}`);

        const temperature = weatherResponse.data.current.temp_c;

        res.json({
            ip: ip,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
            });
    }

    catch (error){
        res.status(500).json({ error: 'Failed to get location or the weather information'});
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
