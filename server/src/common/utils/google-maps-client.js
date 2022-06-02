const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});

const getCoordinates = async (address) => {
    let args = {
        params: {
            key: process.env.GOOGLE_MAPS_API_KEY,
            address: address
        }
    };
    const geoResult = await googleMapsClient.geocode(args);
    return geoResult.data.results[0].geometry.location;
};

module.exports = {
    getCoordinates
};