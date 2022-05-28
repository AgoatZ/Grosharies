const { SNSClient } = require('@aws-sdk/client-sns');
const REGION = process.env.AWS_DEFAULT_REGION;
const snsClient = new SNSClient({ region: REGION });
const { SFNClient } = require('@aws-sdk/client-sfn');
const sfnClient = new SFNClient({ region: REGION});
module.exports = {
    snsClient,
    sfnClient
};