import axios from 'axios';
import { url } from 'node:inspector';
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
        setApiBearerToken(jwtToken);
    }
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

export async function deleteUserprofile() {
    await ensureFreshToken();
    await apiAxios.delete(urlPrefix + "/userprofile");
}

export async function getVendor(vendorId: string): Promise<interfaces.Vendor | null> {
    await ensureFreshToken();
    const url = urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
    try {
        const vendor = await apiAxios.get(url);
        return vendor.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putVendor(vendor: interfaces.Vendor): Promise<interfaces.Vendor> {
    await ensureFreshToken();
    const addedVendor = await apiAxios.put(urlPrefix + "/vendor", vendor);
    return addedVendor.data;
}

export async function deleteVendor(vendorId: string) {
    await ensureFreshToken();
    const url = urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
    await apiAxios.delete(url);
}

// TODO: Lag en funksjon for å hente liste av vendors når tilhørende lambda er implementert.

export async function getVendorSubscriptions():Promise<interfaces.UserSubscription[]> {
    await ensureFreshToken();
    return await apiAxios.get(urlPrefix + "/v/subscriptions");
}

export async function getUserSubscriptions():Promise<interfaces.VendorSubscription[]> {
    await ensureFreshToken();
    return await apiAxios.get(urlPrefix + "/u/subscriptions");
}

export async function getVendorSubscription(id: string):Promise<interfaces.Subscription | null> {
    await ensureFreshToken();
    try {
        const vendorSubscription = await apiAxios.get(urlPrefix + "/v/subscription?userId=" + id);
        return vendorSubscription.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putVendorSubscription(subscription: interfaces.Subscription):Promise<interfaces.Subscription> {
    await ensureFreshToken();
    const addedSubscription = await apiAxios.put(urlPrefix + "/v/subscription?userId=" + subscription.userId, subscription);
    return addedSubscription.data;
}

export async function deleteVendorSubscription(id: string) {
    await ensureFreshToken();
    await apiAxios.delete(urlPrefix + "/v/subscription?userId=" + id);
}

export async function getUserSubscription(id: string):Promise<interfaces.Subscription | null> {
    await ensureFreshToken();
    try {
        const userSubscription = await apiAxios.get(urlPrefix + "/u/subscription?vendorId=" + id);
        return userSubscription.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putUserSubscription(subscription: interfaces.Subscription):Promise<interfaces.Subscription> {
    await ensureFreshToken();
    const addedSubscription = await apiAxios.put(urlPrefix + "/u/subscription?vendorId=" + subscription.vendorId, subscription);
    return addedSubscription.data;
}

export async function deleteUserSubscription(id: string) {
    await ensureFreshToken();
    await apiAxios.delete(urlPrefix + "/u/subscription?vendorId=" + id);
}

export async function getAllVendorsDeliveries(start: string, end: string):Promise<interfaces.Delivery[] | null> {
    await ensureFreshToken();
    try {
        const deliveries = await apiAxios.get(urlPrefix + "/v/deliveries?start=" + start + "&end=" + end);
        return deliveries.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putNewDeliveries(deliveries: interfaces.Delivery[]): Promise<interfaces.Delivery[]> {
    await ensureFreshToken();
    const addedDeliveries = await apiAxios.post(urlPrefix + "/v/deliveries", deliveries);
    return addedDeliveries.data;
}

export async function getAllUsersDeliveries(start: string, end: string):Promise<interfaces.Delivery[] | null> {
    await ensureFreshToken();
    try {
        const deliveries = await apiAxios.get(urlPrefix + "/u/deliveries?start=" + start + "&end=" + end);
        return deliveries.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function getDelivery(vendorId: string, userId: string, time: string):Promise<interfaces.Delivery | null> {
    await ensureFreshToken();
    try {
        const delivery = await apiAxios.get(urlPrefix + "/delivery?vendorId=" + vendorId + "&userId=" + userId + "&time=" + time);
        return delivery.data;
    } catch (error) {
        if (error.response.status == 404) {
            return null;
        }
        throw (error);
    }
}

export async function putNewDelivery(vendorId: string, userId: string, delivery: interfaces.Delivery):Promise<interfaces.Delivery> {
    await ensureFreshToken();
    const newDelivery = await apiAxios.put(urlPrefix + "/delivery?vendorId=" + vendorId + "&userId=" + userId, delivery);
    return newDelivery.data;
}

export async function deleteDelivery(vendorId: string, userId: string, time: string) {
    await ensureFreshToken();
    await apiAxios.delete(urlPrefix + "/delivery?vendorId=" + vendorId + "&userId=" + userId + "&time=" + time);
}

// TODO: Lag en funksjon for å hente første levering når tilhørende lambda er implementert.
