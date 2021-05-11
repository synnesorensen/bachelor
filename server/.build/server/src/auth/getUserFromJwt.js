"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfoFromEvent = exports.getUserInfo = void 0;
function getUserInfo(jwt) {
    const jwt_parts = parseJwt(jwt);
    if (jwt_parts) {
        return jwt_parts.payload.email;
    }
    return null;
}
exports.getUserInfo = getUserInfo;
const decodeBase64 = (base64Encoded) => {
    return Buffer.from(base64Encoded, 'base64').toString();
};
function parseJwt(token) {
    try {
        const parts = token.split('.');
        return {
            header: JSON.parse(decodeBase64(parts[0].replace(/-/g, '+').replace(/_/g, '/'))),
            payload: JSON.parse(decodeBase64(parts[1].replace(/-/g, '+').replace(/_/g, '/'))),
        };
    }
    catch (error) {
        console.log('JWT parse error', token, error);
    }
}
;
function getUserInfoFromEvent(event) {
    return getUserInfo(getJWT(event));
}
exports.getUserInfoFromEvent = getUserInfoFromEvent;
function getJWT(event) {
    let auth = event.headers.authorization;
    if (!auth) {
        auth = event.headers.Authorization;
    }
    if (!auth) {
        return "";
    }
    return auth.slice(7);
}
//# sourceMappingURL=getUserFromJwt.js.map