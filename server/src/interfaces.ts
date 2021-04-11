export interface Subscription {
    vendorId?: string,
    userId: string,
    approved?: boolean,
    paused?: boolean,
    schedule?: string[]
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
    schedule: string[],
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
    schedule: string[]
}

export interface Delivery {
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
    schedule: string[]
}

