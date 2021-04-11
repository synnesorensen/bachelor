import axios from 'axios';
import {urlPrefix} from '../settings'
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

export async function getVendor():Promise<interfaces.Vendor[]> {
    return await apiAxios.get(urlPrefix + "/userprofile?userId=synne@birthdaygirl.yay")
}