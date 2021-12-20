import express, { Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthService from "../services/AuthService";
import ReiseService from "../services/ReiseService";
import * as OpenApiValidator from "express-openapi-validator";
import { HttpError } from "express-openapi-validator/dist/framework/types";
import { knex as knexDriver } from "knex";
import config from "../knexfile";

const app = express()
const port = process.env.PORT || 8080;

const knex = knexDriver(config);
const authService = new AuthService()
const reiseService = new ReiseService(knex);

app.options("/*", function (req, res, next) {
    const allowedOrigins = ['http://127.0.0.1:5500', 'https://travel-addict.netlify.app/'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

app.use(express.json())
app.use(cookieParser());

// install middleware (open api validator)
app.use(
    OpenApiValidator.middleware({
        apiSpec: "./openapi.yaml",
        validateRequests: true,
        validateResponses: false,
    })
);

app.use(
    cors({
        origin: 'http://127.0.0.1:5500',
        credentials: true
    })
);

// app.options('/login', cors()) // enable pre-flight request for login post request

const checkLogin = async (
    req: Request,
    res: express.Response,
    next: express.NextFunction
) => {
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

app.use(
    (
        err: HttpError,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        // format error
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    }
);

app.post("/login", async (req, res) => {
    const payload = req.body;
    if (!payload.email || !payload.password) {
        res.status(400);
        return res.json({ message: "Missing required parameter" });
    }
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

app.post("/reisen", checkLogin, (req, res) => {
    const payload = req.body;
    reiseService.add(payload).then((newEntry) => {
        res.status(201);
        res.send(newEntry);
    });
});

app.get("/reisen", async (req, res) => {
    reiseService.getAll().then((total) => res.send(total));
});

app.delete("/reisen/:reiseId", checkLogin, (req, res) => {
    const id = req.params.reiseId;
    reiseService.delete(id).then(() => {
        res.status(204);
        res.send();
    });
});

app.patch("/reisen/:reiseId", checkLogin, (req, res) => {
    const id = req.params.reiseId;
    const payload = req.body;
    reiseService.update(id, payload).then((newEntry) => {
        res.status(200);
        res.send(newEntry);
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})