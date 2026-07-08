import express from 'express'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    return res.send("hello");
});

app.listen(3000, () => {
    console.log("Server is running...");
})