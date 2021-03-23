import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
 
const documentClient = new DocumentClient({ region: 'eu-north-1' });

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  
  let params = {
    TableName : 'MainTable',
    KeyConditionExpression: "#pk = :vendor",
    ExpressionAttributeNames:{
        "#pk": "pk"
    },
    ExpressionAttributeValues: {
        ":vendor": 'lunsj_customer'
    }
  };

  let customerList = await documentClient.query(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(customerList.Items)
  };
}
 
export const mainHandler = middy(handler).use(cors());
