'use strict';

var fs = require('fs');
var path = require('path');

const AWS = require('aws-sdk');
AWS.config.update({ region: 'sa-east-2' });
const docClient = new AWS.DynamoDB.DocumentClient();

async function syncScan() {

  const params = {
     // Specify which items in the results are returned.
     FilterExpression: "Id > :s AND Id < :e",
     // Define the expression attribute value, which are substitutes for the values you want to compare.
     ExpressionAttributeValues: {
       ":s": {N: '0'},
       ":e": {N: '100'}
     },
     // Set the projection expression, which are the attributes that you want.
     ProjectionExpression: "Id",
     TableName: "ProductCatalog",
  };

  const awsRequest = await docClient.scan(params);
  const result = await awsRequest.promise();
  console.log(result.Items); // <<--- Your results are here
  return(result.Items)
}


exports.get = function(event, context, callback) {
  var contents = fs.readFileSync(`public${path.sep}index.html`);
  var ids = ""
  var items = syncScan();
  items.forEach(function (element, index, array) {
    ids += " " + element.Id['N'];
    console.log(
        "printing",
        element.Id
    );
  });

  var result = {
    statusCode: 200,
    body: contents.toString() + ids,
    headers: {'content-type': 'text/html'}
  };

  callback(null, result);
};
