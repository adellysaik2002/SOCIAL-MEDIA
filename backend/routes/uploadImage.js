
const express = require("express");
const mongoose = require('mongoose');
const multer = require("multer");
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const url = "mongodb://localhost:27017/PostDB";

const router = express.Router();



const conn=mongoose.createConnection(url);
let gfs;
conn.once('open',function(){
    console.log("connected to mongodb posts")
    gfs=Grid(conn.db,mongoose.mongo);
    gfs.collection("photos");
});

  const storage = new GridFsStorage({
    url: url,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-any-name-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: "photos",
            filename: `${Date.now()}-any-name-${file.originalname}`,
        };
    },
});

const upload=multer({storage});

router.post("/upload", upload.single("file"), async (req, res) => {
    if (req.file === undefined) return res.send("you must select a file.");
    const imgUrl = `http://localhost:5000/file/${req.file.filename}`;
    return res.send(imgUrl);
});

router.get("/:filename", async (req, res) => {
    try {
        const file = await gfs.files.findOne({ filename: req.params.filename });
        const readStream = gfs.createReadStream(file.filename);
        readStream.pipe(res);
    } catch (error) {
        res.send("not found");
    }
});

router.delete("/:filename", async (req, res) => {
    try {
        await gfs.files.deleteOne({ filename: req.params.filename });
        res.send("success");
    } catch (error) {
        console.log(error);
        res.send("An error occured.");
    }
});


module.exports = router;

