import Auth from "@aws-amplify/auth";

export default function getAuth() {
    const config = {
        region: "eu-north-1",
        userPoolId: "eu-north-1_T0CZQQ1dX",
        userPoolWebClientId: "4c4g5j647lbdm1kn07i54nl425",
        mandatorySignIn: true,
        authenticationFlowType: 'USER_SRP_AUTH',
    };
    
    Auth.configure(config);
    return Auth;
}
