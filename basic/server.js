import express from 'express';

const app = express();

app.get("/", (req, res) => {
    res.send("Hi from server")
})

app.listen(3000, ()=>{
    console.log("Server started successfully on port 3000");
})