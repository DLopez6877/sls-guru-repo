/*
ROUTE : GET /list-item/id/{list_item_id}
*/


const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const util = require('./util.js');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const { isEmpty } = require('underscore');

const tableName = process.env.LIST_ITEM_TABLE;

exports.handler = async (event) => {
    try {
        let list_item_id = decodeURIComponent(event.pathParameters.list_item_id);
        
        let params = {
            TableName: tableName,
            IndexName: 'list_item_id-index',
            KeyConditionExpression: 'list_item_id = :list_item_id',
            ExpressionAttributeValues: {
                ':list_item_id': list_item_id
            },
            Limit: 1
        };

        let data = await dynamoDB.query(params).promise();
        if (!isEmpty(data.Items)) {
            return {
                statusCode: 200,
                headers: util.getResponseHeaders(),
                body: JSON.stringify(data.Items[0])
            }
        } else {
            return {
                statusCode: 404,
                headers: util.getResponseHeaders
            }
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