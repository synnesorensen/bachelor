export interface Userprofile {
  fullname: string,
  address: string,
  deliveryAddress: string,
  phone: string,
  email: string, 
  allergies: string[], 
  approved: UserStatus,
  isVendor: boolean, 
  note?: string
}

export interface Subscription {
  vendorId: string,
  userId: string,
  paused: boolean,
  datePaused?: string,
  outstandingDeliveries?: number,
  schedule: string[],
  noOfMeals: number,
  box: string, 
  lastDeliveryDate?: string
}

// Used on admin pages: Returns all subscribers that a vendor/company has. 
export interface UserSubscription {
  vendorId: string,
  userId: string,
  approved: boolean,
  paused: boolean,
  schedule: MenuItems[],
  noOfMeals: number,
  box: string,
  fullname: string,
  address: string,
  deliveryAddress: string,
  phone: string,
  email: string, 
  allergies: string[],
  lastDeliveryDate?: string
}

export interface Delivery {
  vendorId?: string,
  userId: string,
  deliverytime: string,
  menuId: string,
  cancelled: boolean,
  deliveryType: "sub" | "single",
  paid: "paid" | "unpaid", 
  approved: "new" | "approved" | "denied", 
  cancelledBy?: string,
  noOfMeals: number
}

export interface DeliveryDetail extends Delivery {
  paused: boolean,
  noOfMeals: number,
  box: string,
  fullname: string,
  address: string,
  deliveryAddress: string,
  phone: string,
  email: string, 
  allergies: string[]
}

export interface Vendor {
  vendorId: string,
  company: string,
  fullname: string,
  address: string,
  phone: string,
  email: string,
  schedule: MenuItems[]
}

export interface MenuItems {
  id: string,
  time: string,
  menu: string,
  day: string
}

export interface WeekTime {
  menuId?: string,
  day: number,
  time: number
}

export interface DateWithMenuId {
  date: Date,
  menuId?: string
}

export interface Summary {
  menuId: string,
  date: string,
  count: number, 
  cancelled: number
}

export interface SubscriptionAction {
  action: "pause" | "unpause",
  time: string
}

export interface DeliveryReqAction {
  action:  "deny" | "approve",
  deliverytime: string,
  userId: string
}

export type UserStatus = "new" | "approved" | "denied";