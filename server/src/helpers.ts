import { APIGatewayProxyEvent } from 'aws-lambda';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';

export function logEvent(event: APIGatewayProxyEvent) {
  console.log("Method:" + event.httpMethod);
  const user = getUserInfoFromEvent(event);
  console.log("UserId:" + user);
  console.log("Body:" + event.body);
  console.log("Params:" + JSON.stringify(event.queryStringParameters));
}