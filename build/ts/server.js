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
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const knex_1 = require("knex");
const knexfile_1 = __importDefault(require("../knexfile"));
const app = (0, express_1.default)();
const port = 8080;
const knex = (0, knex_1.knex)(knexfile_1.default);
const authService = new AuthService_1.default();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// install middleware (open api validator)
app.use(OpenApiValidator.middleware({
    apiSpec: "./openapi.yaml",
    validateRequests: true,
    validateResponses: false,
}));
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
const userA = authService.create({
    email: "user@example.org",
    password: "hunter2",
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
// app.get('/users', function (req, res) {
//     knex.select().from('users')
//         .then(function (user) {
//             res.send(user)
//         })
// })
// app.get('/users/:id', function (req, res) {
//     knex.select().from('users').where('id', req.params.id)
//         .then(function (user) {
//             res.send(user)
//         })
// })
// app.post("/users", (req, res) => {
//     knex('users').insert({
//         name: req.body.name,
//         email: req.body.email
//     }).then(function () {
//         knex.select().from('users').then(function (users) {
//             res.send(users)
//         })
//     })
// })
// app.put('/users/:id', (req, res) => {
//     knex('users').where('id', req.params.id)
//         .update({
//             name: req.body.name,
//             email: req.body.email
//         }).then(function () {
//             knex.select().from('users').then(function (users) {
//                 res.send(users)
//             })
//         })
// })
// app.delete('/users/:id', (req, res) => {
//     knex('users').where('id', req.params.id).del()
//         .then(function () {
//             knex.select().from('users').then(function (users) {
//                 res.send(users)
//             })
//         })
// })
app.post("/login", async (req, res) => {
    const payload = req.body;
    const sessionId = await authService.login(payload.email, payload.password);
    if (!sessionId) {
        res.status(401);
        return res.json({ message: "Bad email or password" });
    }
    res.cookie("session", sessionId, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
    });
    res.json({ status: "ok" });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
