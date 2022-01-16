"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const AuthService_1 = __importDefault(require("../services/AuthService"));
const ReiseService_1 = __importDefault(require("../services/ReiseService"));
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const knex_1 = require("knex");
const knexfile_1 = __importDefault(require("../knexfile"));
const AuthService_2 = require("../services/AuthService");
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const originURL = ['http://127.0.0.1:5500', 'http://127.0.0.1:5555', 'https://travel-addict.netlify.app',
    'https://travel-addict.netlify.app/html/reise.html', 'http://127.0.0.1:5500/html/reise.html',
    'http://127.0.0.1:5555/html/reise.html'];
const knex = (0, knex_1.knex)(knexfile_1.default);
const authService = new AuthService_1.default();
const reiseService = new ReiseService_1.default(knex);
app.use((0, cookie_parser_1.default)());
app.options("/*", function (req, res, next) {
    const allowedOrigins = originURL;
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header('Access-Control-Allow-Origin', originURL);
    // res.header('Access-Control-Allow-Origin', 'https://travel-addict.netlify.app');
    // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});
app.use(express_1.default.json());
// install middleware (open api validator)
app.use(OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: false,
}));
app.use((0, cors_1.default)({
    credentials: true
}));
app.use((req, res, next) => {
    const allowedOrigins = originURL;
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return next();
});
const checkLogin = async (req, res, next) => {
    const session = req.cookies.session;
    if (!session) {
        res.status(401);
        return res.json({ message: "You need to be logged in to see this page." });
    }
    const email = await authService.getUserEmailForSession(session);
    if (!email) {
        res.status(401);
        return res.json({ message: "You need to be logged in to see this page." });
    }
    req.userEmail = email;
    next();
};
app.use((err, req, res, next) => {
    // format error
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});
app.post("/user", (req, res) => {
    const payload = req.body;
    authService.create(payload).then((Response) => {
        if (Response) {
            res.status(200);
            res.send({ message: "successfuly created a user" });
        }
        else {
            res.status(400);
            res.send({ message: "user email already exist!" });
        }
    });
});
app.get("/user", async (req, res) => {
    authService.getAll().then((total) => {
        res.send(total);
    });
});
app.get("/confirm/:confirmationCode", async (req, res) => {
    const confirmationCode = req.params.confirmationCode;
    authService.confirmAccount(confirmationCode).then((response) => {
        if (response == AuthService_2.CustomResponse.successful) {
            res.status(200);
            res.send({ message: "Email confirmed!" });
        }
        else if (response == AuthService_2.CustomResponse.alreadyConfirmed) {
            res.status(400);
            res.send({ message: "Email already confirmed!" });
        }
        else if (response == AuthService_2.CustomResponse.userNotFound) {
            res.status(400);
            res.send({ message: "User with that confirmation code was not found!" });
        }
        else {
            res.status(400);
            res.send({ message: "Error occured while trying to confirm email" });
        }
    });
});
app.post("/login", async (req, res) => {
    const payload = req.body;
    if (!payload.email || !payload.password) {
        res.status(400);
        return res.json({ message: "Missing required parameter" });
    }
    const sessionId = await authService.login(payload.email, payload.password);
    if (!sessionId) {
        res.status(401);
        return res.json({ message: "Email not confirmed or wrong credentials" });
    }
    res.cookie("session", sessionId, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : undefined,
        secure: process.env.NODE_ENV === "production",
    });
    res.json({ status: "ok" });
});
app.post("/reisen", checkLogin, (req, res) => {
    const payload = req.body;
    console.log(req.userEmail);
    reiseService.add(payload).then((newEntry) => {
        res.status(201);
        res.send(newEntry);
    });
});
app.get("/reisen", checkLogin, async (req, res) => {
    var filteredReisen = [];
    reiseService.getAll().then((total) => {
        total.forEach(element => {
            if (element.user_email == req.userEmail) {
                filteredReisen.push(element);
            }
        });
        res.send(filteredReisen);
    });
});
app.get("/reisen/:reiseId", checkLogin, async (req, res) => {
    var filteredReisen = [];
    reiseService.getAll().then((total) => {
        total.forEach(element => {
            if (element.id == req.params.reiseId) {
                filteredReisen.push(element);
            }
        });
        res.send(filteredReisen);
    });
});
app.get("/loggedInUserEmail", checkLogin, async (req, res) => {
    console.log(req.userEmail);
    res.send({ 'email': req.userEmail });
});
app.delete("/reisen/:reiseId", checkLogin, async (req, res) => {
    const id = req.params.reiseId;
    const userEmail = await reiseService.getUserEmail(id);
    if (userEmail == '') {
        res.status(400);
        return res.json({ message: "There is no reise with id: " + id });
    }
    if (userEmail == req.userEmail) {
        reiseService.delete(id).then(() => {
            res.status(204);
            res.send();
        });
    }
    else {
        res.status(401);
        return res.json({ message: "This reise may only be deleted by its creator" });
    }
});
app.put("/reisen/:reiseId", checkLogin, async (req, res) => {
    const id = req.params.reiseId;
    const userEmail = await reiseService.getUserEmail(id);
    if (userEmail == '') {
        res.status(400);
        return res.json({ message: "There is no reise with id: " + id });
    }
    if (userEmail == req.userEmail) {
        const payload = req.body;
        reiseService.update(id, payload).then((newEntry) => {
            res.status(200);
            res.send(newEntry);
        });
    }
    else {
        res.status(401);
        return res.json({ message: "This reise may only be deleted by its creator" });
    }
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
