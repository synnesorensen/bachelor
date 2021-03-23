import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';


const database = new DynamoDB({ region: 'eu-north-1' });

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    let params = {
        TableName: 'MainTable',
        Key: {
            'pk': {S: 'synne'},
            'sk': {S: 'synne'}
        }
    };

    database.deleteItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });

      return {
        statusCode: 200,
        body: JSON.stringify(params.Key)
      };

}

export const mainHandler = middy(handler).use(cors());