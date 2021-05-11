"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Api = void 0;
const axios_1 = __importDefault(require("axios"));
const settings_1 = require("../../../../common/settings");
const auth_1 = __importDefault(require("../components/LoginDialog/auth"));
class Api {
    constructor() {
        this.apiAxios = axios_1.default.create();
        this.jwtLastRefreshed = 0;
    }
    async login(username, password) {
        const auth = auth_1.default();
        await auth.signIn(username, password);
        let jwtToken = (await auth.currentSession()).getIdToken().getJwtToken();
        this.setApiBearerToken(jwtToken);
    }
    async logout() {
        const auth = auth_1.default();
        await auth.signOut();
    }
    setApiBearerToken(token) {
        this.jwtLastRefreshed = Date.now();
        this.apiAxios = axios_1.default.create({
            headers: {
                common: {
                    Authorization: 'Bearer ' + token,
                },
            },
        });
    }
    async ensureFreshToken() {
        if (this.jwtLastRefreshed < (Date.now() - (1000 * 60))) {
            let Auth = auth_1.default();
            let jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
            this.setApiBearerToken(jwtToken);
        }
    }
    async getUserprofile() {
        await this.ensureFreshToken();
        try {
            const userprofile = await this.apiAxios.get(settings_1.urlPrefix + "/userprofile");
            return userprofile.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async putUserprofile(userprofile) {
        await this.ensureFreshToken();
        const addedUser = await this.apiAxios.put(settings_1.urlPrefix + "/userprofile", userprofile);
        return addedUser.data;
    }
    async deleteUserprofile() {
        await this.ensureFreshToken();
        await this.apiAxios.delete(settings_1.urlPrefix + "/userprofile");
    }
    async getVendor(vendorId) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
        try {
            const vendor = await this.apiAxios.get(url);
            return vendor.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async putVendor(vendor, vendorId) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
        const addedVendor = await this.apiAxios.put(url, vendor);
        return addedVendor.data;
    }
    async deleteVendor(vendorId) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
        await this.apiAxios.delete(url);
    }
    async getVendorSubscriptions() {
        await this.ensureFreshToken();
        const result = await this.apiAxios.get(settings_1.urlPrefix + "/v/subscriptions");
        return result.data;
    }
    async getUserSubscriptions() {
        await this.ensureFreshToken();
        const result = await this.apiAxios.get(settings_1.urlPrefix + "/u/subscriptions");
        return result.data;
    }
    async getVendorSubscription(id) {
        await this.ensureFreshToken();
        try {
            const url = settings_1.urlPrefix + "/v/subscription?userId=" + encodeURIComponent(id);
            const vendorSubscription = await this.apiAxios.get(url);
            return vendorSubscription.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async putVendorSubscription(subscription) {
        await this.ensureFreshToken();
        try {
            const url = settings_1.urlPrefix + "/v/subscription?userId=" + encodeURIComponent(subscription.userId);
            const addedSubscription = await this.apiAxios.put(url, subscription);
            return addedSubscription.data;
        }
        catch (error) {
            if (error.response.status == 403) {
                return null;
            }
            throw (error);
        }
    }
    async deleteVendorSubscription(id) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/v/subscription?userId=" + encodeURIComponent(id);
        await this.apiAxios.delete(url);
    }
    async getUserSubscription(id) {
        await this.ensureFreshToken();
        try {
            const url = settings_1.urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(id);
            const userSubscription = await this.apiAxios.get(url);
            return userSubscription.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async putUserSubscription(subscription) {
        await this.ensureFreshToken();
        try {
            const url = settings_1.urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(subscription.vendorId);
            const addedSubscription = await this.apiAxios.put(url, subscription);
            return addedSubscription.data;
        }
        catch (error) {
            if (error.response.status == 403) {
                return null;
            }
            throw (error);
        }
    }
    async deleteUserSubscription(id) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(id);
        await this.apiAxios.delete(url);
    }
    async getAllVendorsDeliveries(startDate, endDate, summary) {
        await this.ensureFreshToken();
        try {
            let url = settings_1.urlPrefix + "/v/deliveries?start=" + encodeURIComponent(startDate) + "&end=" + endDate;
            if (summary) {
                url += "&summary=true";
            }
            const deliveries = await this.apiAxios.get(url);
            return deliveries.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async postNewDeliveries(startDate, no, userId) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/v/deliveries?startDate=" + startDate + "&no=" + no + "&userId=" + encodeURIComponent(userId);
        const addedDeliveries = await this.apiAxios.post(url);
        return addedDeliveries.data;
    }
    async getAllUsersDeliveries(startDate, endDate) {
        await this.ensureFreshToken();
        try {
            const deliveries = await this.apiAxios.get(settings_1.urlPrefix + "/u/deliveries?start=" + startDate + "&end=" + endDate);
            return deliveries.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async getDelivery(vendorId, userId, time) {
        await this.ensureFreshToken();
        try {
            const url = settings_1.urlPrefix + "/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId) + "&time=" + time;
            const delivery = await this.apiAxios.get(url);
            return delivery.data;
        }
        catch (error) {
            if (error.response.status == 404) {
                return null;
            }
            throw (error);
        }
    }
    async putDelivery(vendorId, userId, delivery) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId);
        const newDelivery = await this.apiAxios.put(url, delivery);
        return newDelivery.data;
    }
    async deleteDelivery(vendorId, userId, time) {
        await this.ensureFreshToken();
        const url = settings_1.urlPrefix + "/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId) + "&time=" + time;
        await this.apiAxios.delete(url);
    }
    async getUnpaidDeliveries(userId, yearMonth, afterDate) {
        await this.ensureFreshToken();
        let url = settings_1.urlPrefix + "/unpaidDeliveries?userId=" + encodeURIComponent(userId) + "&yearMonth=" + yearMonth;
        if (afterDate) {
            url += "&afterDate=" + afterDate;
        }
        const response = await this.apiAxios.get(url);
        return parseInt(response.data.no);
    }
}
exports.Api = Api;
let api = new Api();
exports.default = api;
//# sourceMappingURL=api.js.map