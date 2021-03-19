interface Customer {
    approved: boolean,
    email: string
}

export async function getCustomers():Promise<Array<Customer>> {
    let response = await fetch ("https://27o2alv2kk.execute-api.eu-north-1.amazonaws.com/customers");
    return await response.json();
}