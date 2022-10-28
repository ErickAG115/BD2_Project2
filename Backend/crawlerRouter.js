const express = require("express");
const router = express.Router();

router.get("/example", async (req, res) => {
    res.send(200);
});

router.get("/example/:name", async (req, res) => {
    let data = req.params.name;
    res.send(200);
});

router.post("/example", async (req, res) => {
    res.send(req.body);
});

module.exports = router;