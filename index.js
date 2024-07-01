const express = require('express');
const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const path = "/api/";


app.get(`${path}hello`, async (req, res) => {
    const visitorName = req.query.visitor_name;
    const clientIp = "8.8.8.8";

    try {
        // Using an IP geolocation service to get the location of the request.
        const geoLocation = await axios.get(`https://api.ip2location.io/?key=${process.env.IP_LOCATION_API_KEY}&ip=${clientIp}&format=json`);

        const location = `${geoLocation.data.city_name}, ${geoLocation.data.region_name}`;


        //  Using a weather API to get the temperature of the requester's location

        const weatherResponse = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${process.env.API_KEY}&q=${clientIp}`);
        //  console.log(weatherResponse);
        const temperature = weatherResponse.data.current.temp_c;

        res.json({
            client_ip: clientIp,
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
