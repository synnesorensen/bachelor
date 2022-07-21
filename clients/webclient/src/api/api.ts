import axios from 'axios';
import { urlPrefix } from '../../../../common/settings';
import * as interfaces from '../../../../common/interfaces';
import * as dto from '../../../../common/dto';
import getAuth from '../components/LoginDialog/auth';

export class Api {
  private apiAxios = axios.create();
  private jwt = "";

    async login(username: string, password: string) {
    const auth = getAuth();
    await auth.signIn(username, password);
    let jwtToken = (await auth.currentSession()).getIdToken().getJwtToken();
    this.setApiBearerToken(jwtToken);
  }

  async logout() {
    const auth = getAuth();
    await auth.signOut();
  }

  setApiBearerToken(token: string) {
    this.jwt = token;
    this.apiAxios = axios.create({
      headers: {
        common: {
          Authorization: 'Bearer ' + token,
        },
      },
    });
  }

  async ensureFreshToken() {
    let Auth = getAuth();
    let jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
    if (jwtToken !== this.jwt) {
      this.setApiBearerToken(jwtToken);
    }
  }

  getAxiosErrorStatus(error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return error.response.status;
      }
    } else {
      throw (error);
    }
  }

  async getUserprofile(): Promise<interfaces.Userprofile | null> {
    await this.ensureFreshToken();
    try {
      const userprofile = await this.apiAxios.get(urlPrefix + "/userprofile");
      return userprofile.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async putUserprofile(userprofile: interfaces.Userprofile): Promise<interfaces.Userprofile> {
    await this.ensureFreshToken();
    const addedUser = await this.apiAxios.put(urlPrefix + "/userprofile", userprofile);
    return addedUser.data;
  }

  async deleteUserprofile() {
    await this.ensureFreshToken();
    await this.apiAxios.delete(urlPrefix + "/userprofile");
  }

  async getVendor(): Promise<interfaces.Vendor> {
    await this.ensureFreshToken();
    const vendors = await this.apiAxios.get(urlPrefix + "/vendor");
    return vendors.data;
  }

  async putVendor(vendor: interfaces.Vendor, vendorId: string): Promise<interfaces.Vendor> {
    await this.ensureFreshToken();
    const url = urlPrefix + "/vendor?vendorId=" + encodeURIComponent(vendorId);
    const addedVendor = await this.apiAxios.put(url, vendor);
    return addedVendor.data;
  }

  async getSubscription(): Promise<dto.SubscriptionDto | null> {
    await this.ensureFreshToken();
    try {
      const result = await this.apiAxios.get(urlPrefix + "/subscription");
      return result.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getUsersAndSubscriptions(): Promise<dto.UserDto[]> {
    await this.ensureFreshToken();
    const result = await this.apiAxios.get(urlPrefix + "/v/usersAndSubscriptions");
    return result.data;
  }

  async getNewUserRequests(): Promise<dto.UserDto[]> {
    await this.ensureFreshToken();
    const result = await this.apiAxios.get(urlPrefix + "/v/newUsers");
    return result.data;
  }

  async postSubscriptionAsVendor(userId: string, action: interfaces.SubscriptionAction): Promise<interfaces.Subscription> {
    await this.ensureFreshToken();
    const pausedSubscription = await this.apiAxios.post(urlPrefix + "/v/subscription?userId=" + encodeURIComponent(userId), action);
    return pausedSubscription.data;
  }

  async deleteVendorSubscription(id: string) {
    await this.ensureFreshToken();
    const url = urlPrefix + "/v/subscription?userId=" + encodeURIComponent(id);
    await this.apiAxios.delete(url);
  }

  async getUserSubscription(id: string): Promise<interfaces.Subscription | null> {
    await this.ensureFreshToken();
    try {
      const url = urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(id);
      const userSubscription = await this.apiAxios.get(url);
      return userSubscription.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async putUserSubscription(subscription: interfaces.Subscription): Promise<interfaces.Subscription | null> {
    await this.ensureFreshToken();
    try {
      const url = urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(subscription.vendorId);
      const addedSubscription = await this.apiAxios.put(url, subscription);
      return addedSubscription.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 403) {
        return null;
      }
      throw (error);
    }
  }

  async postSubscription(vendorId: string, action: interfaces.SubscriptionAction): Promise<interfaces.Subscription> {
    await this.ensureFreshToken();
    const pausedSubscription = await this.apiAxios.post(urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(vendorId), action);
    return pausedSubscription.data;
  }

  async deleteUserSubscription(id: string) {
    await this.ensureFreshToken();
    const url = urlPrefix + "/u/subscription?vendorId=" + encodeURIComponent(id);
    await this.apiAxios.delete(url);
  }

  async updateApproval(userId: string, approved: boolean, note: string) {
    await this.ensureFreshToken();
    const body = { 
      approved, 
      note 
    };
    await this.apiAxios.patch(urlPrefix + "/userprofile?userId=" + encodeURIComponent(userId), body);
  }

  async getAllVendorsDeliveries(startDate: string, endDate: string): Promise<interfaces.Delivery[] | null> {
    await this.ensureFreshToken();
    try {
      let url = urlPrefix + "/v/deliveries?start=" + startDate + "&end=" + endDate;
      const deliveries = await this.apiAxios.get(url);
      return deliveries.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getAllVendorsDeliveriesSummary(startDate: string, endDate: string): Promise<interfaces.Summary[] | null> {
    await this.ensureFreshToken();
    try {
      let url = urlPrefix + "/v/deliveries?start=" + startDate + "&end=" + endDate + "&summary=true";
      const deliveries = await this.apiAxios.get(url);
      return deliveries.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getOneUsersDeliveries(userId: string, startDate: string, endDate: string): Promise<interfaces.Delivery[] | null> {
    await this.ensureFreshToken();
    try {
      const deliveries = await this.apiAxios.get(urlPrefix + "/v/deliveries?userId=" + encodeURIComponent(userId) + "&start=" + startDate + "&end=" + endDate);
      return deliveries.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async updateDeliveries(deliveries: interfaces.Delivery[]): Promise<interfaces.Delivery[]> {
    await this.ensureFreshToken();
    let changedDeliveries = await this.apiAxios.put(urlPrefix + "/v/deliveries", deliveries);
    return changedDeliveries.data;
  }

  async postNewDeliveries(startDate: string, no: number, userId: string): Promise<interfaces.Delivery[]> {
    await this.ensureFreshToken();
    const url = urlPrefix + "/v/deliveries?startDate=" + startDate + "&no=" + no + "&userId=" + encodeURIComponent(userId);
    const addedDeliveries = await this.apiAxios.post(url);
    return addedDeliveries.data;
  }

  async getAllUsersDeliveries(startDate: string, endDate: string): Promise<interfaces.Delivery[] | null> {
    await this.ensureFreshToken();
    try {
      const deliveries = await this.apiAxios.get(urlPrefix + "/u/deliveries?start=" + startDate + "&end=" + endDate);
      return deliveries.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getNewDeliveryRequests(): Promise<dto.DeliveryRequestDto[] | null> {
    await this.ensureFreshToken();
    try {
      const requests = await this.apiAxios.get(urlPrefix + "/v/deliveryRequests");
      return requests.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getSelectedDeliveryRequests(startDate: string, endDate: string): Promise<dto.DeliveryRequestDto[] | null> {
    await this.ensureFreshToken();
    try {
      const requests = await this.apiAxios.get(urlPrefix + "/v/deliveryRequests?start=" + startDate + "&end=" + endDate);
      return requests.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async getDelivery(vendorId: string, userId: string, time: string): Promise<interfaces.Delivery | null> {
    await this.ensureFreshToken();
    try {
      const url = urlPrefix + "/u/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId) + "&time=" + time;
      const delivery = await this.apiAxios.get(url);
      return delivery.data;
    } catch (error) {
      if (this.getAxiosErrorStatus(error) === 404) {
        return null;
      }
      throw (error);
    }
  }

  async putDelivery(vendorId: string, userId: string, delivery: dto.DeliveryDto): Promise<interfaces.Delivery> {
    await this.ensureFreshToken();
    const url = urlPrefix + "/u/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId);
    const newDelivery = await this.apiAxios.put(url, delivery);
    return newDelivery.data;
  }

  async payDelivery(userId: string, time: string, status: string): Promise<interfaces.Delivery> {
    await this.ensureFreshToken();
    const url = urlPrefix + "/v/delivery?&userId=" + encodeURIComponent(userId) + "&time=" + time + "&status=" + status;
    const updatedDelivery = await this.apiAxios.put(url);
    return updatedDelivery.data;
  }

  async deleteDelivery(vendorId: string, userId: string, time: string) {
    await this.ensureFreshToken();
    const url = urlPrefix + "/u/delivery?vendorId=" + encodeURIComponent(vendorId) + "&userId=" + encodeURIComponent(userId) + "&time=" + time;
    await this.apiAxios.delete(url);
  }

  async getUnpaidDeliveries(userId: string, yearMonth: string): Promise<number> {
    await this.ensureFreshToken();
    let url = urlPrefix + "/unpaidDeliveries?userId=" + encodeURIComponent(userId) + "&yearMonth=" + yearMonth;

    const response = await this.apiAxios.get(url);
    return parseInt(response.data.no);
  }

  async lastDelilveryDate(userId: string): Promise<string> {
    await this.ensureFreshToken();
    const response = await this.apiAxios.get(urlPrefix + "/lastDelivery?userId=" + encodeURIComponent(userId));
    return response.data;
  }

  async getDeliveryDetails(start: string, end: string): Promise<interfaces.DeliveryDetail[]> {
    await this.ensureFreshToken();
    const response = await this.apiAxios.get(urlPrefix + "/v/deliveryDetails?start=" + start + "&end=" + end);
    return response.data;
  }

  async cancelDeliveries(deliveries: interfaces.Delivery[], cancelledBy: string): Promise<boolean> {
    await this.ensureFreshToken();
    const body = {
      deliveries,
      cancelledBy
    }
    const response = await this.apiAxios.post(urlPrefix + "/cancelDeliveries", body);
    return response.status == 200;
  }

  async scheduleToDates(vendorId: string, startDate: string, endDate: string): Promise<interfaces.Delivery[]> {
    await this.ensureFreshToken();
    const deliveries = await this.apiAxios.get(urlPrefix + "/scheduleDates?vendorId=" + encodeURIComponent(vendorId) + "&startDate=" + startDate + "&endDate=" + endDate);
    return deliveries.data;
  }

  async handleDeliveryRequest(action: interfaces.DeliveryReqAction): Promise<interfaces.Delivery> {
    await this.ensureFreshToken();
    const delivery = await this.apiAxios.post(urlPrefix + "/v/deliveryRequests", action);
    return delivery.data;
  }

  async getAbsence(start: string, end: string): Promise<Date[]> {
    await this.ensureFreshToken();
    const absence = await this.apiAxios.get(urlPrefix + "/v/absence?start=" + start + "&end=" + end);
    return absence.data;
  }

  async setAbsence(start: string, end: string): Promise<number> {
    await this.ensureFreshToken();
    const absence = await this.apiAxios.post(urlPrefix + "/v/absence?start=" + start + "&end=" + end);
    return absence.data;
  }

  async deleteAbsence(time: string): Promise<void> {
    await this.ensureFreshToken();
    const absence = await this.apiAxios.delete(urlPrefix + "/v/absence?time=" + time);
    return absence.data;
  }

  async setAway(start: string, end: string): Promise<number> {
    await this.ensureFreshToken();
    const away = await this.apiAxios.post(urlPrefix + "/u/away?start=" + start + "&end=" + end);
    return away.data;
  }

  async getAway(start: string, end: string): Promise<Date[]> {
    await this.ensureFreshToken();
    const absence = await this.apiAxios.get(urlPrefix + "/u/away?start=" + start + "&end=" + end);
    return absence.data;
  }
}

let api = new Api();
export default api;
