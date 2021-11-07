export interface SubscriptionDto {
    userId: string,
    vendorId: string,
    paused: boolean,
    schedule: MenuItemDto[],
    noOfMeals: number,
    box: string,                        // TODO: make enum
    lastDeliveryDate: string | null
}

export interface MenuItemDto {
    id: string,
    time: string,
    menu: string,
    day: string
}

export interface User {
    fullname: string,
    address: string,
    deliveryAddress: string,
    phone: string,
    email: string, 
    allergies: string[], 
    approved: boolean,
    isVendor: boolean,
    subscribtion: SubscriptionDto | null
}