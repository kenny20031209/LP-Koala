const catchAsync = require('./../utils/asyncCatch');
const AppError = require('./../utils/appError');


exports.createOne = Model =>
    catchAsync( async (req, res, next) => {
        const result = await Model.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                data: result
            }
        });
    });

exports.createNestObj = (Model, Second) =>
    catchAsync( async (req, res, next) => {
        const {id} = req.params;
        const result = await Model.create(req.body);

        const module = await Second.findById(id);
        if (module.activities){
            module.activities.push(result._id);
        }

        if (module.ratings){
            module.ratings.push(result._id);
        }

        module.save();


        res.status(201).json({
            status: 'success',
            data: {
                data: result
            }
        })
    });

exports.getAll = Model =>
    catchAsync( async (req, res, next) =>{
        const result = await Model.find();

        res.status(200).json({
            status: 'success',
            results: result.length,
            data: {
                data: result
            }
        });
    });

exports.getOne = (Model, option) =>
    catchAsync( async (req, res, next) => {

        let query = Model.findById(req.params.id)

        if (option) query = query.populate({
            path: 'ratings'
        });

        const ans = await query;
        // for (const i of ans.files){
        //
        //     fileData.push({
        //         fileName: i.fileName,
        //         fileData: 12
        //     });
        //     console.log(i.fileId);
        // }

        if (!ans){
            return next(new AppError('No result found with that request ID', 404));
        }
        res.status(200).json({
            status: 'success',
            data: {
                data: ans
            }
        });
    });

exports.deleteOne = Model =>
    catchAsync( async (req, res, next) => {
        const result = await Model.findByIdAndDelete(req.params.id);

        if(!result){
            console.log(req.params)
            return next(new AppError('No such document found with given ID', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    });