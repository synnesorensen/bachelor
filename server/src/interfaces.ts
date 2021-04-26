export interface Subscription {
    vendorId?: string,
    userId: string,
    approved: boolean,
    paused: boolean,
    schedule: string[],
    noOfMeals: number,
    box: string
}

export interface ApiSubscription {
    vendorId?: string,
    userId: string,
    approved: boolean,
    paused: boolean,
    schedule: MenuItems[],
    noOfMeals: number,
    box: string
}

export interface Userprofile {
    fullname: string,
    address: string,
    phone: string,
    email: string, 
    allergies: string[]
}

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
    phone: string,
    email: string, 
    allergies: string[]
}

export interface CompanySubscription {
    vendorId: string,
    company: string,
    approved: boolean,
    paused: boolean,
    schedule: string[],
    noOfMeals: number,
    box: string
}

export interface Delivery {
    vendorId: string,
    userId: string,
    deliverytime: string,
    menu: string,
    cancelled: boolean
}

export interface Vendor {
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

