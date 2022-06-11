const { Client } = require("@googlemaps/google-maps-services-js");
const googleMapsClient = new Client({});

const getCoordinates = async (address) => {
    try{
    let args = {
        params: {
            key: process.env.GOOGLE_MAPS_API_KEY,
            address: address
        }
    };
    const geoResult = await googleMapsClient.geocode(args);
    console.log(geoResult)
    return geoResult.data.results[0].geometry.location;
}
catch(e){
    console.log("google:"+ e.message)
}
return null;
};

module.exports = {
    getCoordinates
};