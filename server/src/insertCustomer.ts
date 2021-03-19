import middy from 'middy';
import { cors } from 'middy/middlewares';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';


const database = new DynamoDB({ region: 'eu-north-1' });

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    
    let params = {
        TableName: 'MainTable',
        Item: {
            'pk' : {S: 'v#lunsjpaahjul'},
            'sk' : {S: 'c#synne@cool.no#2021#03#23#10'},
            'Entity_Type' : {S: 'Delivery'},
            'menu' : {S: 'Lunch'},
            'date' : {N: '210323'}
        }
    };

    database.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });

      return {
        statusCode: 200,
        body: JSON.stringify(params.Item)
      };

}

export const mainHandler = middy(handler).use(cors());