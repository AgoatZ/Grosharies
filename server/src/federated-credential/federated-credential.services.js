const express = require('express');
const { status } = require('express/lib/response');
const Repository = require('./federated-credential.repository');
const router = express.Router();

getFederatedCredentials = async function (query, page, limit) {
    try {
        const federatedCredentials = await Repository.getFederatedCredentials(query);
        return federatedCredentials;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Paginating FederatedCredentials');
    }
};

getFederatedCredentialById = async function (federatedCredentialId) {
    try {
        console.log("FederatedCredential Service federatedCredentialId:", federatedCredentialId);
        const federatedCredential = await Repository.getFederatedCredentialById(federatedCredentialId)
        return federatedCredential;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving federatedCredential');
    }
};

getFederatedCredentialByProviderAndSubject = async function (provider, subject) {
    try {
        const federatedCredential = await Repository.getFederatedCredentialByProviderAndSubject(provider, subject);
        return federatedCredential;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Retrieving federatedCredential');
    }
};

addFederatedCredential = async function (id, issuer, profileId) {
    try {
        const federatedCredential = await Repository.addFederatedCredential(id, issuer, profileId);
        return federatedCredential;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Adding FederatedCredential');
    }
};

deleteFederatedCredential = async function (federatedCredentialId) {
    try {
        const deletedFederatedCredential = await Repository.deleteFederatedCredential(federatedCredentialId);
        return deletedFederatedCredential;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Deleting FederatedCredential');
    }
};

updateFederatedCredential = async function (federatedCredentialId, federatedCredentialDetails) {
    try {
        const oldFederatedCredential = await Repository.updateFederatedCredential(federatedCredentialId, federatedCredentialDetails);
        return oldFederatedCredential;
    } catch (e) {
        console.log('service error: ' + e.message);

        throw Error('Error while Updating FederatedCredential');
    }
};

module.exports = {
    getFederatedCredentials,
    getFederatedCredentialById,
    addFederatedCredential,
    deleteFederatedCredential,
    updateFederatedCredential,
    getFederatedCredentialByProviderAndSubject
};
