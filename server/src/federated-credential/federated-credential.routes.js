const express = require('express');
const { status } = require('express/lib/response');
const FederatedCredentialController = require('./federated-credential.controllers');
const router = express.Router();

router.get('/', FederatedCredentialController.getFederatedCredentials);

router.get('/:id', FederatedCredentialController.getFederatedCredentialById);

router.post('/', FederatedCredentialController.addFederatedCredential);

router.delete('/:id', FederatedCredentialController.deleteFederatedCredential);

router.put('/:id', FederatedCredentialController.updateFederatedCredential);

module.exports = router;
