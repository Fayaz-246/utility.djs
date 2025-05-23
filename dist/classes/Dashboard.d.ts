import { DashOps, ServeOps } from "../interfaces/dash";
export default class Dash {
    private app;
    private client;
    private readonly port;
    private readonly API_KEY;
    private readonly SESSION_SECRET;
    private forbiddenPath;
    constructor(obj: DashOps);
    serve(obj?: ServeOps): void;
    private setUp;
    private auth;
    private postHome;
    private getLogin;
    private postLogin;
    private getDash;
    private postLogout;
    private get404;
    private send401;
}
