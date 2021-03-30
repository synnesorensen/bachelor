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
    email: string
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
    email: string
}

export interface Delivery {
    time: string,
    menu: string,
    cancelled: boolean
}

export interface Vendor {
    fullname: string,
    address: string,
    phone: string,
    schedule: string[]
}

