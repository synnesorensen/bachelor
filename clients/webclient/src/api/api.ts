import axios from 'axios';
import {urlPrefix} from '../../../../common/settings'
import * as interfaces from '../../../../server/src/interfaces'
import getAuth from '../components/LoginDialog/auth'

export let apiAxios = axios.create();
let jwtLastRefreshed = 0;

export function setApiBearerToken(token: string) {
    jwtLastRefreshed = Date.now();
    apiAxios = axios.create({
        headers: {
            common: {
                Authorization: 'Bearer ' + token,
            },
        },
    });
}

async function ensureFreshToken() {
    if (jwtLastRefreshed < (Date.now() - (1000*60))) {
        let Auth = getAuth();
        let jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
        console.log("It is old:", jwtToken);
        setApiBearerToken(jwtToken);
    }
}

export async function getVendorSubscriptions():Promise<interfaces.UserSubscription[]> {
    await ensureFreshToken();
    return await apiAxios.get(urlPrefix + "/v/subscriptions");
}

export async function getUserprofile():Promise<interfaces.Userprofile | null> {
    await ensureFreshToken();
    try {
        const userprofile = await apiAxios.get(urlPrefix + "/userprofile");
        return userprofile.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putUserprofile(userprofile: interfaces.Userprofile):Promise<interfaces.Userprofile> {
    await ensureFreshToken();
    const addedUser = await apiAxios.put(urlPrefix + "/userprofile", userprofile);
    return addedUser.data;
}

export async function putSubscription(subscription: interfaces.Subscription):Promise<interfaces.Subscription> {
    await ensureFreshToken();
    const addedSubscription = await apiAxios.put(urlPrefix + "/u/subscription?vendorId=" + subscription.vendorId, subscription);
    return addedSubscription.data;
}