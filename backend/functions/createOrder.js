const DynamoDB = require('aws-sdk/clients/dynamodb');
const DocumentClient = new DynamoDB.DocumentClient({ region: 'us-east-2' });

const { ORDER_TABLE_NAME } = process.env;

module.exports.handler = async (event) => {
    const orderedItems = event.arguments.newOrder.items;
    let itemsArray = [];

    for (i = 0; i < orderedItems.length; i++) {
        let orderItem = orderedItems[i];
        orderItem.orderId = Math.floor(Math.random() * 100) + "";
        orderItem.userId = event.identity.username;
        orderItem.createdAt = new Date().toJSON();

        const item = {
            PutRequest: {
                Item: orderItem
            }
        };
        if (item) {
            itemsArray.push(item);
        }
    }

    let params = { RequestItems: {} };
    params['RequestItems'][ORDER_TABLE_NAME] = itemsArray
    console.log("====== params =========");
    console.log(JSON.stringify(params));
    try{
        await DocumentClient.batchWrite(params).promise();
        return true;
    }catch(e){
        console.log(e);
        return false;
    }
}