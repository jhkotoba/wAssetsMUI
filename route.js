const express = require("express");
const path = require("path");
const router = express.Router();
const fs = require("fs");
const cors = require("cors");

//페이지 이동
router.get("/assets", (request, response) => {
    if(UTIL.isGatewayReq(request)){       
        fs.readFile(path.join(__dirname, "src", "assets", "index.html"), "UTF-8", (err, text) => response.send(text));
    }else{
        response.status(404).send("Assets MO 404");
    }
});

//페이지 이동
router.get("/assets/:pattern", (request, response) => {
    if(UTIL.isGatewayReq(request)){
        try{
            fs.readFile(
                path.join(
                    __dirname,
                    "src",
                    "assets",
                    request.params.pattern,
                    request.params.pattern + ".html"
                    ),
                "UTF-8", (err, text) => {
                    console.log(err);
                    console.log(text);
                response.send(text)
            });
        }catch{
            fs.readFile(path.join(__dirname, "src", "assets", "index.html"), "UTF-8", (err, text) => response.send(text));
        }
    }else{
        response.status(404).send("Assets MO 404");
    }
});
module.exports = router;