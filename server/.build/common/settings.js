"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbVendor = exports.dbUser5 = exports.dbUser4 = exports.dbUser3 = exports.dbUser2 = exports.dbUser1 = exports.testVendPass = exports.testVend = exports.testPass = exports.testUser = exports.awsCognitoAppClientId = exports.awsCognitoUserPoolId = exports.REGION = exports.TABLENAME = exports.urlPrefix = void 0;
exports.urlPrefix = "http://localhost:3000/dev";
exports.TABLENAME = process.env.TABLENAME;
exports.REGION = "eu-north-1";
exports.awsCognitoUserPoolId = process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID;
exports.awsCognitoAppClientId = process.env.VUE_APP_AWS_COGNITO_APP_CLIENT_ID;
exports.testUser = process.env.TESTUSERNAME;
exports.testPass = process.env.TESTPASSWORD;
exports.testVend = process.env.TESTVENDOR;
exports.testVendPass = process.env.TESTVENDORPASSWORD;
exports.dbUser1 = process.env.DBUSER1;
exports.dbUser2 = process.env.DBUSER2;
exports.dbUser3 = process.env.DBUSER3;
exports.dbUser4 = process.env.DBUSER4;
exports.dbUser5 = process.env.DBUSER5;
exports.dbVendor = process.env.DBVENDOR;
//# sourceMappingURL=settings.js.map