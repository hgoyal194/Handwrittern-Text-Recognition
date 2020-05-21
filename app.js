const fs = require("fs");
const express = require("express");
const multer = require("multer");
const path = require("path");
const rootPath = path.dirname(require.main.filename);
process.env.GOOGLE_APPLICATION_CREDENTIALS = `${rootPath}/g_client.json`;

const app = express();
const port = process.env.PORT || 3000;
const gVision = require("./public/js/gVision");

// SETUP APP
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MAIN CONSTANT FOR UPLOAD IMAGE
const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/upload/');
        },
        filename: (req, file, cb) => {
            const ext = file.mimetype.split('/')[1];
            cb(null, file.originalname);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            console.log("photo uploaded");
            cb(null, true);
        } else {
            console.log("file not supported");
            cb(null, false);
        }
    }
}).single('photo');

/* ROUTES */
app.get("/", async(req, res, next) => {
    res.status(200).render("index.html");
});

app.post("/upload", upload, async(req, res, next) => {
    const text = await gVision(req.file.path);
    // fs.unlink(req.file.path, err => {
    //     if (err) return console.log(err);
    //     console.log('photo deleted');
    // });
    res.status(200).json({
        text, 
        filename: req.file.filename
    });
});

app.post("/delete", async (req, res, next) => {
    await fs.unlink(`public/${req.query.filename}`, err => {
        if (err) return console.log(err);
        console.log('photo deleted');
    });
    res.status(200).json({
        status: 'success'
    });
});

// RUN SERVER
app.listen(port, () => console.log(`Server listening on port ${port}`));
