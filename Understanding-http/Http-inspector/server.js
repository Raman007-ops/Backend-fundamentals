
import express from "express";
import { DataLogger } from "./middlewares/DataLogger.js";
import { checkcontent } from "./middlewares/checkContent.js";
import { notfound } from "./middlewares/notfound.js";

const app = express();

app.use(express.json());

app.use(DataLogger);
app.use(checkcontent);
app.use(notfound);


app.get("/", (req, res) => {
    res.send("root route");
});

app.get("/health", (req, res) => {
    console.log("health route hit");
    return res.json({
        status : "ok",
        timeStamp : new Date().toISOString(),
        uptime : process.uptime(),
    })
    
})


app.listen(3000, () => {
    console.log("Http Inspector server Running");
});
