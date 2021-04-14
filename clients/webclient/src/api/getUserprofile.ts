import {urlPrefix} from '../../../../common/settings'
interface Customer {
    approved: boolean,
    email: string
}

export async function getProfile():Promise<Array<Customer>> {
    let response = await fetch (urlPrefix + "/customers");
    return await response.json();
}