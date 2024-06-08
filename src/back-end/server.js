const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const {GridFsStorage} = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const multer = require("multer");
const mongodb = require("mongodb");
const fs = require("fs");
const { Readable } = require('stream');

const app = require("./app");
const fileModel = require('./models/fileModel');
const mime = require('mime-types');

// Load configuration file
dotenv.config({ path: "./config.env" });



// Obtain server connection details from configuration file
const database = process.env.DATABASE || 'mongodb+srv://hello:qweqwe123@cluster0.phkbgab.mongodb.net/lp-database';
const port = process.env.PORT || 3000;


let bucket;
let upload;

async function initialization(){
    mongoose
        .connect(database)
        .then(() => {
            console.log("Connect to database successfully.");
        });
}





app.get("/test/file/findAll", (req, res) => {
    const cursor = bucket.find({});
    const files = []
    cursor.toArray()
        .then(docs => {
            // 遍历文档数组
            for (const doc of docs) {
                console.log(doc._id);
                let filename = doc.filename;
                let fileId = doc._id;
                files.push({filename, fileId});
            }
            res.status(200).json({
                status : 'success',
                data : files
            })
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'server is busy now, please try again later.'
            })
            console.error('Error fetching documents:', err);
        });
});

app.delete("/test/file/:id", (req,res) => {
    if (req.params.id.length !== 24) {
        res.status(404).json({
            status: 'fail',
            message: 'No such file with the given document ID'
        })
        return
    }

    bucket.delete(new mongodb.ObjectId(req.params.id)).then(() =>{
        const query = {fileId : `${req.params.id}`};
        fileModel.deleteOne(query).then((temp)=>{
            console.log(temp);
            res.status(200).json({
                status: 'success',
                message: 'delete successfully'
        })

    })}).catch( err => {
        res.status(404).json({
            status: 'fail',
            message: 'No such file with the given document ID'
        })
    });




})

app.get("/test/file/:id", (req, res) =>{
    if (req.params.id.length !== 24) {
        res.status(404).json({
            status: 'fail',
            message: 'No such file with the given document ID'
        })
        return
    }
    const cursor = bucket.find({_id:new mongodb.ObjectId(req.params.id)})
    cursor.toArray()
        .then(docs => {
            if (docs.length === 0){
                res.status(404).json({
                    status: 'fail',
                    message: 'No such file with the given document ID'
                })
                return
            }
            const downloadStream = bucket.openDownloadStream(new mongodb.ObjectId(req.params.id))

            const doc = docs[0].filename;
            const type = mime.lookup(doc);
            downloadStream.once('data', data => {
                res.set({
                    'Content-Type': `${type}`,
                    'Content-Disposition': `attachment; filename="${doc}"`
                });
            });


            downloadStream.pipe(res);

            downloadStream.on('error', err => {
                console.error('error occurred while reading file.：', err);
                res.status(500).json({
                    status : 'fail',
                    message: 'error occurred while reading file.'
                });
            });
        })
        .catch(err => {
            res.status(500).json({
                status: 'fail',
                message: 'server is busy now, please try again later.'
            })
            console.error('Error fetching documents:', err);
        });
})


initialization().then(() => {
    const client = mongoose.connection.getClient();
    const db = client.db("lp-database");
    bucket = new mongodb.GridFSBucket(db, {
        bucketName : "myBucket"
    });
    upload = multer({ storage: multer.memoryStorage() });

    app.post("/test/file/upload", upload.single('file'), (req, res) => {
        const file = req.file;
        const readableStream = new Readable();
        readableStream.push(file.buffer);
        readableStream.push(null);


        const uploadStream = bucket.openUploadStream(file.originalname, {
            chunkSizeBytes: 1048576,
            metadata: { originalName: file.originalname }
        });

        readableStream.pipe(uploadStream)
            .on('finish', () => {
                console.log('File uploaded to GridFS');
                fileModel.create({
                    fileName: uploadStream.filename,
                    fileId: uploadStream.id
                }).then((doc) =>{
                    res.status(201).json({
                        status: 'success',
                        fileId: uploadStream.id,
                        referenceId: doc._id,
                        message: 'File uploaded successfully'
                    });
                }).catch(err => {
                    console.error('Error uploading file:', err);
                    res.status(500).json({
                        status: 'fail',
                        message: 'server is busy now, please try again later'
                    });
                });

            })
            .on('error', (err) => {
                console.error('Error uploading file:', err);
                res.status(500).json({
                    status: 'fail',
                    message: 'server is busy now, please try again later'
                });
            });


    });


    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
})

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
});

