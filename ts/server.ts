import express, { Request } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import AuthService from "../services/AuthService";
import ReiseService from "../services/ReiseService";
import * as OpenApiValidator from "express-openapi-validator";
import { HttpError } from "express-openapi-validator/dist/framework/types";
import { knex as knexDriver } from "knex";
import config from "../knexfile";
import { CustomResponse } from "../services/AuthService"

const app = express()
const port = process.env.PORT || 8080;

const originURL = ['http://127.0.0.1:5500', 'http://127.0.0.1:5555', 'https://travel-addict.netlify.app',
    'https://travel-addict.netlify.app/html/reise.html', 'http://127.0.0.1:5500/html/reise.html',
    'http://127.0.0.1:5555/html/reise.html']

const knex = knexDriver(config);
const authService = new AuthService()
const reiseService = new ReiseService(knex);

app.use(cookieParser());

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

app.use(express.json())

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
        credentials: true
    })
);

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

app.post("/user", (req, res) => {
    const payload = req.body;
    authService.create(payload).then((Response) => {
        if (Response) {
            res.status(200);
            res.send({ message: "successfuly created a user" });
        } else {
            res.status(400);
            res.send({ message: "user email already exist!" });
        }
    });
});

app.get("/user", async (req, res) => {
    authService.getAll().then((total) => {
        res.send(total)
    });
});

app.get("/confirm/:confirmationCode", async (req, res) => {
    const confirmationCode: string = req.params.confirmationCode
    authService.confirmAccount(confirmationCode).then((response) => {
        if (response == CustomResponse.successful) {
            res.status(200)
            res.send({ message: "Email confirmed!" })
        } else if (response == CustomResponse.alreadyConfirmed) {
            res.status(400)
            res.send({ message: "Email already confirmed!" })
        } else if (response == CustomResponse.userNotFound) {
            res.status(400)
            res.send({ message: "User with that confirmation code was not found!" })
        } else if (response == CustomResponse.confirmationCodeExpired) {
            res.status(400)
            res.send({ message: "The confirmation code has expired. Please register again ✌️" })
        } else {
            res.status(400)
            res.send({ message: "Error occured while trying to confirm email" })
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
    console.log(req.userEmail)
    reiseService.add(payload).then((newEntry) => {
        res.status(201);
        res.send(newEntry);
    });
});

app.get("/reisen", checkLogin, async (req, res) => {
    var filteredReisen = []
    reiseService.getAll().then((total) => {
        total.forEach(element => {
            if (element.user_email == req.userEmail) {
                filteredReisen.push(element)
            }
        });
        res.send(filteredReisen)
    });
});

app.get("/reisen/:reiseId", checkLogin, async (req, res) => {
    var filteredReisen = []
    reiseService.getAll().then((total) => {
        total.forEach(element => {
            if (element.id == req.params.reiseId) {
                filteredReisen.push(element)
            }
        });
        res.send(filteredReisen)
    });
});

app.get("/loggedInUserEmail", checkLogin, async (req, res) => {
    console.log(req.userEmail)
    res.send({ 'email': req.userEmail })
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
    } else {
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
    } else {
        res.status(401);
        return res.json({ message: "This reise may only be deleted by its creator" });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})