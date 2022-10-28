const express = require("express");
const router = express.Router();

router.get("/example", async (req, res) => {
    res.send(200);
});

router.get("/example/:password", async (req, res) => {
    let data = req.params.password;
    res.send(200);
});

router.post("/example", async (req, res) => {
    res.send(req.body);
});

module.exports = router;