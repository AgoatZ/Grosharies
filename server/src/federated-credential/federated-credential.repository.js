const express = require('express');
const { status } = require('express/lib/response');
const FederatedCredential = require('./federated-credential.model');

getFederatedCredentials = async function (query) {
    try {
        const federatedCredentials = await FederatedCredential.find(query);
        return federatedCredentials;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Paginating FederatedCredentials');
    }
};

getFederatedCredentialById = async function (federatedCredentialId) {
    try {
        const federatedCredential = await FederatedCredential.findById(federatedCredentialId);
        return federatedCredential;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Retrieving federatedCredential');
    }
};

getFederatedCredentialByProviderAndSubject = async function (provider, subject) {
    try {
        const federatedCredential = await FederatedCredential.findOne({ provider: provider, subject: subject });
        return federatedCredential;
    } catch (e) {
        console.log('Repository error: ' + e.message);

        throw Error('Error while Retrieving federatedCredential');
    }
};

addFederatedCredential = async function (id, issuer, profileId) {
    try {
        const federatedCredential = new FederatedCredential({ userId: id, provider: issuer, subject: profileId });
        return await federatedCredential.save();
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Adding FederatedCredential');
    }
};

deleteFederatedCredential = async function (federatedCredentialId) {
    try {
        const deletedFederatedCredential = await FederatedCredential.findByIdAndDelete(federatedCredentialId);
        return deletedFederatedCredential;
    } catch (e) {
        console.log('repository error: ' + e.message);

        throw Error('Error while Deleting FederatedCredential');
    }
};

updateFederatedCredential = async function (federatedCredentialId, federatedCredentialDetails) {
    try {
        const oldFederatedCredential = await FederatedCredential.findByIdAndUpdate(federatedCredentialId, federatedCredentialDetails);
        return oldFederatedCredential;
    } catch (e) {
        console.log('repository error: ' + e.message);

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
}
