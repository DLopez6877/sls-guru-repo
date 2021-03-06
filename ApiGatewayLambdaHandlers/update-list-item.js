/*
ROUTE : PATCH /list-item  
*/


const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' })

const util = require('../api/util.js');
const moment = require('moment');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.LIST_ITEM_TABLE;

exports.handler = async (event) => {
    try {
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.expires = moment().add(60, 'days').unix();

       await dynamoDB.put({
            TableName: tableName,
            Item: item,
            ConditionExpression: '#t = :t',
            ExpressionAttributeNames: {
                '#t': 'timestamp'
            },
            ExpressionAttributeValues: {
                ':t': item.timestamp
            }
        }).promise();

        return {
            statusCode: 200,
            headers: util.getResponseHeaders(),
            body: JSON.stringify({item})
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