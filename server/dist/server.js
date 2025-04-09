"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const uncaught_exception_util_1 = require("./utils/uncaught-exception.util");
const error_middleware_1 = require("./middlewares/error.middleware");
const logger_config_1 = require("./configs/logger.config");
const security_middleware_1 = require("./middlewares/security.middleware");
const rate_limit_middleware_1 = require("./middlewares/rate-limit.middleware");
const app_config_1 = require("./configs/app.config");
const db_config_1 = require("./configs/db.config");
const static_config_1 = require("./configs/static.config");
const index_1 = __importDefault(require("./routes/index"));
class Server {
    app;
    port;
    constructor() {
        (0, uncaught_exception_util_1.setupUncaughtExceptionHandling)();
        this.app = (0, express_1.default)();
        this.port = app_config_1.APP_CONFIG.PORT;
        this.plugin();
        this.routes();
        this.errors();
    }
    plugin() {
        (0, security_middleware_1.setupSecurityMiddleware)(this.app);
        (0, static_config_1.configureStaticFiles)(this.app);
        this.app.use(express_1.default.json({ limit: "10mb" }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
        this.app.use(logger_config_1.requestLogger);
        this.app.use(rate_limit_middleware_1.apiLimiter);
        this.app.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), app_config_1.APP_CONFIG.UPLOAD_PATH)));
    }
    routes() {
        this.app.use("/api", index_1.default);
    }
    errors() {
        this.app.use(error_middleware_1.errorMiddleware);
    }
    async start() {
        try {
            await (0, db_config_1.connectToDatabase)();
            this.app.listen(this.port, () => {
                logger_config_1.logger.info(`Server berjalan pada port ${this.port} di mode ${app_config_1.APP_CONFIG.NODE_ENV}`);
            });
        }
        catch (error) {
            logger_config_1.logger.error("Failed to start server", { error });
            process.exit(1);
        }
    }
    getApp() {
        return this.app;
    }
}
exports.Server = Server;
const startServer = async () => {
    const server = new Server();
    await server.start();
};
exports.startServer = startServer;
