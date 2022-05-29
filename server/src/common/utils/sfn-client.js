const { SFNClient } = require('@aws-sdk/client-sfn');
const sfnClient = new SFNClient({ region: process.env.AWS_DEFAULT_REGION});
module.exports = {
    sfnClient
};