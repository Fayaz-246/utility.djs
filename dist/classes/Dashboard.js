"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const error_1 = __importDefault(require("../utils/error"));
const ws_1 = require("../utils/ws");
const defaultHtmls_1 = require("../utils/defaultHtmls");
class Dash {
    app;
    client;
    port;
    API_KEY;
    SESSION_SECRET;
    forbiddenPath = "default-utility-401-path";
    constructor(obj) {
        if (!obj.Client)
            throw Error("[UTILITY.DJS] INVALID CLIENT PROVIDED");
        if (!obj.env)
            throw Error("[UTILITY.DJS] INVALID ENV FIELD PROVIDED");
        if (!obj.env.API_KEY)
            throw Error("[UTILITY.DJS] INVALID API_KEY PROVIDED");
        if (!obj.env.SESSION_SECRET)
            throw Error("[UTILITY.DJS] INVALID SESSION SECRET PROVIDED");
        if (!obj.Port)
            obj.Port = 8080;
        if (!obj.Client.isReady())
            throw new Error("[UTILITY.DJS] This class should be used after the bot is online");
        this.app = (0, express_1.default)();
        this.port = obj.Port;
        this.API_KEY = obj.env.API_KEY;
        this.SESSION_SECRET = obj.env.SESSION_SECRET;
        this.client = obj.Client;
    }
    serve(obj) {
        this.setUp();
        if (!obj || !obj.getLoginPath) {
            this.getLogin("default-utility-login-path");
        }
        else {
            this.getLogin(obj.getLoginPath);
        }
        this.postLogin();
        this.postLogout();
        this.postHome();
        if (obj && obj.forbidden401Path)
            this.forbiddenPath = obj.forbidden401Path;
        this.getDash();
        if (!obj || !obj.get404Path) {
            this.get404("default-utility-404-path");
        }
        else {
            this.get404(obj.get404Path);
        }
        const server = http_1.default.createServer(this.app);
        if (obj?.consoleCommands) {
            (0, ws_1.setupConsoleWS)(server, obj.consoleCommands);
        }
        else {
            (0, ws_1.setupConsoleWS)(server, [{ name: "test", res: "works" }]);
        }
        /* this.app.listen(this.port, () => {
          console.log(`App is listening on port http://localhost:${this.port}/`);
        }) ; */
        server.listen(this.port, () => {
            console.log(`App is listening on port http://localhost:${this.port}/`);
        });
    }
    setUp() {
        this.app.use(express_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.json());
        this.app.use((0, express_session_1.default)({
            secret: this.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            cookie: {
                httpOnly: true,
                sameSite: "strict",
                // secure: true, // Uncomment if using HTTPS
                maxAge: 60 * 60 * 1000, // 1 hour
            },
        }));
        this.app.set("view engine", "ejs");
        this.app.set("views", path_1.default.join(__dirname, "..", "defaults"));
    }
    auth(req, res, next) {
        if (req.session.user)
            return next();
        return res.redirect("/login");
    }
    postHome() {
        this.app.get("/", (req, res) => {
            res.redirect("/login");
        });
    }
    getLogin(path) {
        if (!path)
            throw Error("[UTIlITY.DJS INTERNAL ERROR] getLogin function of Dashboard class has no Inputted path");
        try {
            if (path == "default-utility-login-path") {
                this.app.get("/login", (req, res) => {
                    res.send((0, defaultHtmls_1.defaultLogin)());
                });
            }
            else {
                this.app.get("/login", (req, res) => {
                    res.sendFile(path);
                });
            }
        }
        catch (e) {
            (0, error_1.default)("high", e);
        }
    }
    postLogin() {
        this.app.post("/login", (req, res) => {
            const { api_key } = req.body;
            if (api_key != this.API_KEY)
                return this.send401(res);
            req.session.user = { test: "String sys working" };
            return res.redirect("/dashboard");
        });
    }
    getDash() {
        const bot = this.client.user;
        this.app.get("/dashboard", this.auth, (req, res) => {
            res.render("dash", {
                botUsername: bot?.username,
                botAvatar: bot?.displayAvatarURL({ extension: "png" }),
            });
        });
        this.app.get("/dashboard/info", this.auth, (req, res) => {
            const memoryUsage = process.memoryUsage();
            const totalMemoryBytes = os_1.default.totalmem();
            const osx = os_1.default.type();
            const cpuUsage = os_1.default.cpus();
            const totalCpuTime = cpuUsage.reduce((acc, cpu) => acc +
                cpu.times.user +
                cpu.times.nice +
                cpu.times.sys +
                cpu.times.idle, 0);
            const idleCpuTime = cpuUsage.reduce((acc, cpu) => acc + cpu.times.idle, 0);
            const cpuUsagePercentage = ((totalCpuTime - idleCpuTime) / totalCpuTime) * 100;
            let totalSeconds = this.client.uptime / 1000;
            const days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            const hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = Math.floor(totalSeconds % 60);
            const uptime = `${days} ${days > 1 ? "Days" : "Day"}, ${hours} ${hours > 1 ? "Hours" : "Hour"}, ${minutes} ${minutes > 1 ? "Minutes" : "Minute"} & ${seconds} ${seconds > 1 ? "Seconds" : "Second"}`;
            res.render("info", {
                client: this.client,
                cpuUsage: cpuUsagePercentage.toFixed(2),
                memUsage: `${Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100} MB / ${Math.round((totalMemoryBytes / (1024 * 1024 * 1024)) * 100) / 100} GB`,
                os: osx,
                uptime: uptime,
            });
        });
        this.app.get("/dashboard/console", this.auth, (req, res) => {
            res.render("console", {
                botUsername: bot?.username,
                botAvatar: bot?.displayAvatarURL({ extension: "png" }),
            });
        });
    }
    postLogout() {
        this.app.post("/logout", (req, res) => {
            req.session.destroy(() => {
                res.clearCookie("connect.sid");
                res.redirect("/login");
            });
        });
    }
    get404(path) {
        if (path == "default-utility-404-path") {
            this.app.use((req, res) => {
                res.status(404).send((0, defaultHtmls_1.default404)());
            });
        }
        else {
            this.app.use((req, res) => {
                res.status(404).sendFile(path);
            });
        }
    }
    send401(res) {
        if (this.forbiddenPath == "default-utility-401-path")
            res.status(401).send((0, defaultHtmls_1.default401)());
        else
            res.status(401).sendFile(this.forbiddenPath);
    }
}
exports.default = Dash;
