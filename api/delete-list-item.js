/*
ROUTE : DELETE /list-item/t/{list_item_id}  
*/


const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const util = require('./util.js');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LIST_ITEM_TABLE;

exports.handler = async (event) => {
    try {
        let timestamp = parseInt(event.pathParameters.timestamp);
        let params = {
            TableName: tableName,
            Key: {
                user_id: util.getUserId(event.headers),
                timestamp: timestamp
            }
        }

        await dynamoDB.delete(params).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders()
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