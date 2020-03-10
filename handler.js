"use strict";

const AWS = require("aws-sdk");
const ses = new AWS.SES();

const SENDER = process.env.SENDER;
const RECEIVERS = process.env.RECEIVERS.split(",").map(address =>
  address.trim()
);

const EMAIL_TEMPLATE = process.env.EMAIL_TEMPLATE;

function handler(event, context, callback) {
  sendEmail(event, function(err, data) {
    context.done(err, null);
  });
}

const sendEmail = (event, context, callback) => {
  const params = {
    Destination: {
      ToAddresses: RECEIVERS
    },
    Source: SENDER,
    Template: EMAIL_TEMPLATE,
    //TemplateData: `{ \"firstname\":\"${event.firstname}\", \"lastname\": \"${event.lastname}\",\"email\": \"${event.email}\" ,\"phone_number\": \"${event.phone_number}\",\"company\": \"${event.company}\", \"how\": \"${event.how}\",\"need\": \"${event.need}\"}`
    TemplateData: event.body
  };

  return ses
    .sendTemplatedEmail(params)
    .promise()
    .then(res => {
      return {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        }
      };
    })
    .catch(err => {
      return {
        statusCode: 500,
        body: {
          error: err
        }
      };
    });
};

module.exports = {
  handler,
  sendEmail
};
