'use strict';

var fs = require('fs');
var path = require('path');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-2' });
const docClient = new AWS.DynamoDB.DocumentClient();

async function syncScan() {

  const params = {
    FilterExpression: "Id > :s AND Id < :e",
    
    ExpressionAttributeValues: {
      ":s": 0,
      ":e": 100
    },
    ProjectionExpression: "Id",
    TableName: "ProductCatalog",
  };

  const result2 = await docClient.scan(params).promise();

  console.log(result2.Items); // <<--- Your results are here
  return (result2)
}


exports.get = async function (event, context, callback) {
  var contents = fs.readFileSync(`public${path.sep}index.html`);
  var ids = ""
  try {

    var res = await syncScan();
    console.log("here 123435");

    var jsonRes = JSON.stringify(res, null, 2);

    var result = {
      statusCode: 200,
      body: contents.toString() + jsonRes,
      headers: { 'content-type': 'text/html' }
    };

    callback(null, result);
  }
  catch (err) {
    var result = {
      statusCode: 200,
      body:contents.toString() +"error" + JSON.stringify(err, null, 2),
      headers: { 'content-type': 'text/html' }
    };

    callback(null, result);
  }
};

var cb = function (a, b) { console.log(b) };
exports.get(null, null, cb);
