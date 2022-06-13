const FederatedCredentialService = require('./federated-credential.services');  

getFederatedCredentials = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    
    const page = req.params.page ? req.params.page : 1;
    const limit = req.params.limit ? req.params.limit : 30;
    try {
        const federatedCredentials = await FederatedCredentialService.getFederatedCredentials({}, page, limit)
        return res.status(200).json({ federatedCredentials: federatedCredentials, message: "Succesfully FederatedCredentials Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};


getFederatedCredentialById = async function (req, res, next) {
    // Validate request parameters, queries using express-validator
    try {
        const federatedCredential = await FederatedCredentialService.getFederatedCredentialById(req.params.id)
        return res.status(200).json({ federatedCredential: federatedCredential, message: "Succesfully federatedCredential Retrieved" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

addFederatedCredential = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const federatedCredential = await FederatedCredentialService.addFederatedCredential(req.body);
        return res.status(200).json({ federatedCredential: federatedCredential, message: "Succesfully FederatedCredential Added" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

deleteFederatedCredential = async function (req, res, next) {
    try {
        const federatedCredential = await FederatedCredentialService.deleteFederatedCredential(req.params.id);
        return res.status(200).json({ federatedCredential: federatedCredential, message: "Succesfully FederatedCredential Deleted" });
    } catch (e) {
        console.log('controller error: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
}

updateFederatedCredential = async function (req, res, next) {
    // Validate request parameters, queries using express-validator

    try {
        const oldFederatedCredential = await FederatedCredentialService.updateFederatedCredential(req.params.id, req.body);
        return res.status(200).json({ oldFederatedCredential: oldFederatedCredential, message: "Succesfully FederatedCredential Updated" });
    } catch (e) {
        console.log('controller error from updateFederatedCredential: ' + e.message);

        return res.status(400).json({ message: e.message });
    }
};

module.exports = {
    getFederatedCredentials,
    getFederatedCredentialById,
    addFederatedCredential,
    deleteFederatedCredential,
    updateFederatedCredential
}