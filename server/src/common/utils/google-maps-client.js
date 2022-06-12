const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});

const getCoordinates = async (address) => {
    try {
        let args = {
            params: {
                key: process.env.GOOGLE_MAPS_API_KEY,
                address: address
            }
        };
        const geoResult = await googleMapsClient.geocode(args);
        if (geoResult.data.results[0].geometry) {
            return geoResult.data.results[0].geometry.location;
        } else {
            console.log('Address is not valid from utils getCoordinates');
            throw Error('Address is not valid');
        }
    } catch (err) {
        console.log('Address is not valid from utils getCoordinates', err);
        throw Error('Address is not valid');
    }
};

module.exports = {
    getCoordinates
};