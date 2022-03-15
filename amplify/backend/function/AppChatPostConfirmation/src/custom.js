const aws = require('aws-sdk')
const ddb = new aws.DynamoDB()

const tableName = process.env.USERTABLE;

exports.handler = async (event, context) => {
  // insert code to be executed by your lambda trigger

  if (!event?.request?.userAttributes?.sub) {
    console("NO sub provided")
    return
  }

  const version = 1
  const now = new Date()
  const timestamp = now.getTime()

  const userItem = {
    __typename: { S: 'User'},
    _lastChangedAt: { N: timestamp.toString() },
    _version:  { N: version.toString()},
    createdAt: { S: now.toISOString()},
    updatedAt: { S: now.toISOString()},
    id: { S: event.request.userAttributes.sub},
    name: { S: event.request.userAttributes.email} ,
  }

  const params = {
    Item: userItem,
    TableName: tableName
  }

  try{
    await ddb.putItem(params).promise()
    console.log("success")
  } catch(e) {
    console.log(e)
  }
  

  //save a new User to DynamoDB

};