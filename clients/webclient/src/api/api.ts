import axios from 'axios';
import {urlPrefix} from '../../../../common/settings'
import * as interfaces from '../../../../server/src/interfaces'

export let apiAxios = axios.create();
export function setApiBearerToken(token: string) {
    apiAxios = axios.create({
        headers: {
            common: {
                Authorization: 'Bearer ' + token,
            },
        },
    });
}

export async function getVendorSubscriptions():Promise<interfaces.UserSubscription[]> {
    return await apiAxios.get(urlPrefix + "/v/subscriptions")
}