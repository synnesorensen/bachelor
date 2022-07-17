import 'source-map-support/register';
import jwksClient from 'jwks-rsa';
import * as jwt from 'jsonwebtoken';
import * as util from 'util';
import * as settings from '../../../common/settings';

import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const getPolicyDocument = (effect: any, resource: any) => {
  const policyDocument = {
    Version: '2012-10-17', // default version
    Statement: [{
      Action: 'execute-api:Invoke', // default action
      Effect: effect,
      Resource: resource,
    }]
  };
  return policyDocument;
}


// extract and return the Bearer Token from the Lambda event parameters
const getToken = (params: APIGatewayTokenAuthorizerEvent) => {
  if (!params.type || params.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = params.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(`Invalid Authorization token - ${tokenString} does not match "Bearer .*"`);
  }
  return match[1];
}

const jwtOptions = {
  audience: settings.awsCognitoAppClientId,
  issuer: "https://cognito-idp." + settings.REGION + ".amazonaws.com/" + settings.awsCognitoUserPoolId
};

const authenticate = (params: APIGatewayTokenAuthorizerEvent) => {
  const token = getToken(params);

  const decoded = jwt.decode(token, { complete: true, json: true });
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('invalid token');
  }

  const client = jwksClient({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 10, // Default value
    jwksUri: `https://cognito-idp.${settings.REGION}.amazonaws.com/${settings.awsCognitoUserPoolId}/.well-known/jwks.json`
  });
  const getSigningKey = util.promisify(client.getSigningKey);
  return getSigningKey(decoded.header.kid)
    .then((key: any) => {
      const signingKey = key.publicKey || key.rsaPublicKey;
      return jwt.verify(token, signingKey, jwtOptions);
    })
    .then((decoded: any) => ({
      principalId: decoded.sub,
      //      policyDocument: getPolicyDocument('Allow', params.methodArn),
      policyDocument: getPolicyDocument('Allow', '*'),
      context: { scope: decoded.scope }
    }));
}

export async function authorizer(event: APIGatewayTokenAuthorizerEvent) {
  try {
    const data = await authenticate(event);
    return data;
  }
  catch (err) {
    console.error(err)
    return `Unauthorized: ${err.message}`;
  }
}


