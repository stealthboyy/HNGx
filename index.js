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
    const ip = clientIp.split(",")[0].trim()


    try {
        // Using an IP geolocation service to get the location of the request.
        const geoLocation = await axios.get(`https://ipinfo.io/${ip}?token=${process.env.IP_LOCATION_API_KEY}`);

        const location = `${geoLocation.data.city}`;


        //  Using a weather API to get the temperature of the requester's location

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${location}`);
        
        const temperature = await weatherResponse.data.current.temp_c;
        console.log(temperature)

        res.json({
            ip: clientIp,
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
