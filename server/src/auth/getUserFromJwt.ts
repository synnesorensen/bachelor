import { APIGatewayProxyEvent } from "aws-lambda";

export function getUserInfo(jwt: string): string | null {
  const jwt_parts = parseJwt(jwt);
  if (jwt_parts) {
    return jwt_parts.payload.email;
  }
  return null;
}

const decodeBase64 = (base64Encoded: string) => {
  return Buffer.from(base64Encoded, 'base64').toString();
};

function parseJwt(token: string) {
  try {
    const parts = token.split('.');
    return {
      header: JSON.parse(decodeBase64(parts[0].replace(/-/g, '+').replace(/_/g, '/'))),
      payload: JSON.parse(decodeBase64(parts[1].replace(/-/g, '+').replace(/_/g, '/'))),
    };
  } catch (error) {
    console.log('JWT parse error', token, error);
  }
};

export function getUserInfoFromEvent(event: APIGatewayProxyEvent): string | null {
  return getUserInfo(getJWT(event));
}

function getJWT(event: APIGatewayProxyEvent): string {
  let auth = event.headers.authorization;
  if (!auth) {
    auth = event.headers.Authorization;
  }
  if (!auth) {
    return "";
  }
  return auth.slice(7)
}
