/*
ROUTE : GET /list-items/
*/

const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const util = require('../api/util.js');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LIST_ITEM_TABLE;

exports.handler = async (event) => {
    try {
        let query = event.queryStringParameters;
        let limit = query && query.limit ? parseInt(query.limit) : 5;
        let user_id = util.getUserId(event.headers);

        let params = {
            TableName: tableName,
            KeyConditionExpression: "user_id = :uid",
            ExpressionAttributeValues: {
                ":uid": user_id
            },
            Limit: limit,
            ScanIndexForward: false
        }

        let startTimestamp = query && query.start ? parseInt(query.start) : 0;

        if (startTimestamp > 0) {
            params.ExclusiveStartKey = {
                user_id: user_id,
                timestamp: startTimestamp
            }
        }

        var data = await dynamoDB.query(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify(data)
        }
    } catch (error) {
        console.log("Error", error)
        return {
            statusCode: error.statusCode ? error.statusCode : 500,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({
                error: error.name ? error.name : "Exception",
                message: error.message ? error.message : "Unknown Exception"
            })
        }
    }
}