const express = require("express")
const app = express()
const port = 3000

app.use(express.json())

function charInString(char: string, text: string): number {
    var summe: number = 0;
    char.toLowerCase;
    for (let i = 0; i < text.length; i++) {
        if (text[i] == char) {
            summe++;
        }
    }
    return summe;
}

app.get('/hello/:name', (req, res) => {
    res.send('Hallo ${req.params.name}')
})

app.post("/count", (req, res) => {
    const text: string | undefined = req.body.text;
    if (text === undefined) {
        res.status(400)
        return res.json({ "message": "bad request" })
    }
    res.json({ "count": charInString("a", text) })
})

app.listen(port, () => {
    console.log("Example app listening at http://localhost:${port}")
})