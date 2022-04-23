import { Delivery } from "./interfaces";

export interface UserDto {
  fullname: string,
  address: string,
  deliveryAddress: string,
  phone: string,
  email: string, 
  allergies: string[], 
  note: string,
  approved: "new" | "approved" | "denied",
  isVendor: boolean,
  subscription: SubscriptionDto | null
}

export interface SubscriptionDto {
  userId: string,
  vendorId: string,
  paused: boolean,
  schedule: MenuItemDto[],
  noOfMeals: number,
  box: string,            // TODO: make enum
  lastDeliveryDate: string | null
}

export interface MenuItemDto {
  id: string,
  time: string,
  menu: string,
  day: string
}

export interface DeliveryDto {
  deliverytime: string,
  menuId: string
}

export interface DeliveryRequestDto extends Delivery {
  fullname: string,
  deliveryAddress: string,
  allergies: string[]
}