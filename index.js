const express = require('express');
const axios = require('axios')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const path = "/api/";


app.get(`${path}hello`, async (req, res) => {
    // const visitorName = req.query.visitor_name;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.rem;

    try {
        console.log(req.headers['x-forwarded-for'])
        // Using an IP geolocation service to get the location of the request.
        const geoLocation = await axios.get(`https://api.ip2location.io/?key=${process.env.IP_LOCATION_API_KEY}&ip=${clientIp}&format=json`);
        // console.log(geoLocation.data);

        // const location = geoLocation.data.city;

        //  // Using a weather API to get the temperature of the requester's location
        // //  const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
        // // const temperature = weatherResponse.data.main.temp;

        // res.json({
        //     client_ip: clientIp,
        //     location: location,
        //     greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        //     });
    }

    catch (error){
        res.status(500).json({ error: 'Failed to get location or weather information' });
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
