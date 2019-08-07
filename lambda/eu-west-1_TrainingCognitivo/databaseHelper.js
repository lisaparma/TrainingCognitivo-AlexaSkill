const AWS = require("aws-sdk");

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "TrainingCognitivo";

var dbHelper = function () { };

dbHelper.prototype.addUser = (name) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: tableName,
      Item: {
        'user': name,
        'trainings': {}
      }
    };
    docClient.put(params, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
};

module.exports = new dbHelper();