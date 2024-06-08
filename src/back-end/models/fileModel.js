const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    fileName :{
        type: String,
        required: [true, 'it must have a name']
    },
    fileId :{
        type: String,
        required: [true, 'it must have an ID']
    }
})

const fileModel = mongoose.model("fileModel", fileSchema);

module.exports = fileModel;