import Auth from "@aws-amplify/auth";
import * as settings from '../../../../../common/settings'

export default function getAuth() {
    const config = {
        region: settings.REGION,
        userPoolId: settings.awsCognitoUserPoolId,
        userPoolWebClientId: settings.awsCognitoAppClientId,
        mandatorySignIn: true,
        authenticationFlowType: 'USER_SRP_AUTH',
    };
    
    Auth.configure(config);
    return Auth;
}
