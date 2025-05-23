import exp, { Response, Request, Express, NextFunction } from "express";
import session from "express-session";
import path from "path";
import http from "http";
import os from "os";
import Client from "./utilityClient";
import { DashOps, ServeOps } from "../interfaces/dash";
import error from "../utils/error";
import { setupConsoleWS } from "../utils/ws";
import { default401, default404, defaultLogin } from "../utils/defaultHtmls";

export default class Dash {
  private app: Express;
  private client: Client;
  private readonly port: number;
  private readonly API_KEY: string;
  private readonly SESSION_SECRET: string;
  private forbiddenPath: string = "default-utility-401-path";

  constructor(obj: DashOps) {
    if (!obj.Client) throw Error("[UTILITY.DJS] INVALID CLIENT PROVIDED");
    if (!obj.env) throw Error("[UTILITY.DJS] INVALID ENV FIELD PROVIDED");
    if (!obj.env.API_KEY) throw Error("[UTILITY.DJS] INVALID API_KEY PROVIDED");
    if (!obj.env.SESSION_SECRET)
      throw Error("[UTILITY.DJS] INVALID SESSION SECRET PROVIDED");
    if (!obj.Port) obj.Port = 8080;

    if (!obj.Client.isReady())
      throw new Error(
        "[UTILITY.DJS] This class should be used after the bot is online",
      );

    this.app = exp();
    this.port = obj.Port;
    this.API_KEY = obj.env.API_KEY;
    this.SESSION_SECRET = obj.env.SESSION_SECRET;
    this.client = obj.Client;
  }

  serve(obj?: ServeOps) {
    this.setUp();

    if (!obj || !obj.getLoginPath) {
      this.getLogin("default-utility-login-path");
    } else {
      this.getLogin(obj.getLoginPath);
    }
    this.postLogin();
    this.postLogout();

    this.postHome();

    if (obj && obj.forbidden401Path) this.forbiddenPath = obj.forbidden401Path;

    this.getDash();

    if (!obj || !obj.get404Path) {
      this.get404("default-utility-404-path");
    } else {
      this.get404(obj.get404Path);
    }

    const server = http.createServer(this.app);
    if (obj?.consoleCommands) {
      setupConsoleWS(server, obj.consoleCommands);
    } else {
      setupConsoleWS(server, [{ name: "test", res: "works" }]);
    }

    /* this.app.listen(this.port, () => {
      console.log(`App is listening on port http://localhost:${this.port}/`);
    }) ; */
    server.listen(this.port, () => {
      console.log(`App is listening on port http://localhost:${this.port}/`);
    });
  }

  private setUp() {
    this.app.use(exp.urlencoded({ extended: true }));
    this.app.use(exp.json());

    this.app.use(
      session({
        secret: this.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          httpOnly: true,
          sameSite: "strict",
          // secure: true, // Uncomment if using HTTPS
          maxAge: 60 * 60 * 1000, // 1 hour
        },
      }),
    );

    this.app.set("view engine", "ejs");
    this.app.set("views", path.join(__dirname, "..", "defaults"));
  }

  private auth(req: Request, res: Response, next: NextFunction) {
    if (req.session.user) return next();
    return res.redirect("/login");
  }

  private postHome() {
    this.app.get("/", (req: Request, res: Response) => {
      res.redirect("/login");
    });
  }

  private getLogin(path: string) {
    if (!path)
      throw Error(
        "[UTIlITY.DJS INTERNAL ERROR] getLogin function of Dashboard class has no Inputted path",
      );
    try {
      if (path == "default-utility-login-path") {
        this.app.get("/login", (req: Request, res: Response) => {
          res.send(defaultLogin());
        });
      } else {
        this.app.get("/login", (req: Request, res: Response) => {
          res.sendFile(path);
        });
      }
    } catch (e: unknown | any) {
      error("high", e);
    }
  }

  private postLogin() {
    this.app.post("/login", (req: Request, res: Response) => {
      const { api_key } = req.body;

      if (api_key != this.API_KEY) return this.send401(res);

      req.session.user = { test: "String sys working" };
      return res.redirect("/dashboard");
    });
  }

  private getDash() {
    const bot = this.client.user;
    this.app.get("/dashboard", this.auth, (req: Request, res: Response) => {
      res.render("dash", {
        botUsername: bot?.username,
        botAvatar: bot?.displayAvatarURL({ extension: "png" }),
      });
    });

    this.app.get(
      "/dashboard/info",
      this.auth,
      (req: Request, res: Response) => {
        const memoryUsage = process.memoryUsage();
        const totalMemoryBytes = os.totalmem();
        const osx = os.type();

        const cpuUsage = os.cpus();
        const totalCpuTime = cpuUsage.reduce(
          (acc, cpu) =>
            acc +
            cpu.times.user +
            cpu.times.nice +
            cpu.times.sys +
            cpu.times.idle,
          0,
        );
        const idleCpuTime = cpuUsage.reduce(
          (acc, cpu) => acc + cpu.times.idle,
          0,
        );
        const cpuUsagePercentage =
          ((totalCpuTime - idleCpuTime) / totalCpuTime) * 100;

        let totalSeconds = this.client.uptime! / 1000;
        const days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        const hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = Math.floor(totalSeconds % 60);
        const uptime = `${days} ${days > 1 ? "Days" : "Day"}, ${hours} ${
          hours > 1 ? "Hours" : "Hour"
        }, ${minutes} ${minutes > 1 ? "Minutes" : "Minute"} & ${seconds} ${
          seconds > 1 ? "Seconds" : "Second"
        }`;
        res.render("info", {
          client: this.client,
          cpuUsage: cpuUsagePercentage.toFixed(2),
          memUsage: `${Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100} MB / ${
            Math.round((totalMemoryBytes / (1024 * 1024 * 1024)) * 100) / 100
          } GB`,
          os: osx,
          uptime: uptime,
        });
      },
    );

    this.app.get(
      "/dashboard/console",
      this.auth,
      (req: Request, res: Response) => {
        res.render("console", {
          botUsername: bot?.username,
          botAvatar: bot?.displayAvatarURL({ extension: "png" }),
        });
      },
    );
  }

  private postLogout() {
    this.app.post("/logout", (req: Request, res: Response) => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login");
      });
    });
  }

  private get404(path: string) {
    if (path == "default-utility-404-path") {
      this.app.use((req: Request, res: Response) => {
        res.status(404).send(default404());
      });
    } else {
      this.app.use((req: Request, res: Response) => {
        res.status(404).sendFile(path);
      });
    }
  }

  private send401(res: Response) {
    if (this.forbiddenPath == "default-utility-401-path")
      res.status(401).send(default401());
    else res.status(401).sendFile(this.forbiddenPath);
  }
}
