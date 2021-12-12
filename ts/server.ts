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
const port = 8080

const knex = knexDriver(config);
const authService = new AuthService()
const reiseService = new ReiseService(knex);

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
        origin: true,
        credentials: true,
    })
);

const userA = authService.create({
    email: "user@example.org",
    password: "hunter2",
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

app.get('/reisen', function (req, res)
{
    knex.select().from('reisen')
        .then(function (reise)
        {
            res.send(reise)
        })
})
    
app.get('/reisen/:id', function (req, res)
{
    knex.select().from('reisen').where('id', req.params.id)
        .then(function (reise)
        {
            res.send(reise)
        })
})

app.post("/reisen", (req, res) =>
{
    knex('reisen').insert(
    {
        name: req.body.name,
        startDatum: req.body.startDatum,
        endDatum: req.body.endDatum,
        land: req.body.land
    }).then(function ()
    {
        knex.select().from('reisen').then(function (reisen)
        {
            res.send(reisen)
        })
    })
 })

app.put('/reisen/:id', (req, res) =>
{
     knex('reisen').where('id', req.params.id)
        .update(
        {
            name: req.body.name,
            startDatum: req.body.startDatum,
            endDatum: req.body.endDatum,
            land: req.body.land
        }).then(function ()
        {
            knex.select().from('reisen').then(function (reisen)
            {
                res.send(reisen)
            })
        })
})

app.delete('/reisen/:id', (req, res) =>
{
    knex('reisen').where('id', req.params.id).del()
        .then(function ()
        {
            knex.select().from('reisen').then(function (reisen)
            {
                res.send(reisen)
            })
        })
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})