"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizer = void 0;
require("source-map-support/register");
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
const jwt = __importStar(require("jsonwebtoken"));
const util = __importStar(require("util"));
const settings = __importStar(require("../../../common/settings"));
const getPolicyDocument = (effect, resource) => {
    const policyDocument = {
        Version: '2012-10-17',
        Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }]
    };
    return policyDocument;
};
const getToken = (params) => {
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
};
const jwtOptions = {
    audience: settings.awsCognitoAppClientId,
    issuer: "https://cognito-idp." + settings.REGION + ".amazonaws.com/" + settings.awsCognitoUserPoolId
};
const authenticate = (params) => {
    const token = getToken(params);
    const decoded = jwt.decode(token, { complete: true, json: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
        throw new Error('invalid token');
    }
    const client = jwks_rsa_1.default({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `https://cognito-idp.${settings.REGION}.amazonaws.com/${settings.awsCognitoUserPoolId}/.well-known/jwks.json`
    });
    const getSigningKey = util.promisify(client.getSigningKey);
    return getSigningKey(decoded.header.kid)
        .then((key) => {
        const signingKey = key.publicKey || key.rsaPublicKey;
        return jwt.verify(token, signingKey, jwtOptions);
    })
        .then((decoded) => ({
        principalId: decoded.sub,
        policyDocument: getPolicyDocument('Allow', '*'),
        context: { scope: decoded.scope }
    }));
};
async function authorizer(event) {
    try {
        const data = await authenticate(event);
        return data;
    }
    catch (err) {
        return `Unauthorized: ${err.message}`;
    }
}
exports.authorizer = authorizer;
//# sourceMappingURL=authorizer.js.map