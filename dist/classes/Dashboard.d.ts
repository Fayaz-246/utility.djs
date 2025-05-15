import Client from './utilityClient';
interface DashOps {
    Client: Client;
    Port?: number;
}
export default class Dash {
    constructor(obj: DashOps);
}
export {};
