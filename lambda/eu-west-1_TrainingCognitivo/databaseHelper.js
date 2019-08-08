const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "TrainingCognitivo";

var dbHelper = function () { };

dbHelper.prototype.addUser = (userId, name) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      Item: {
        user: userId,
        name: name,
        trainings: {}
      }
    };
    docClient.put(params, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

dbHelper.prototype.getUserData = (userId) => {
  return new Promise((resolve, reject) => {
    var params = {
      TableName : tableName,
      Key: {
        user: userId
      }
    };

    docClient.get(params, function(err, data) {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

module.exports = new dbHelper();