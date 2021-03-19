interface Customer {
    approved: boolean,
    email: string
}

export async function getCustomers():Promise<Array<Customer>> {
    let response = await fetch ("http://localhost:3000/dev/customers");
    return await response.json();
}