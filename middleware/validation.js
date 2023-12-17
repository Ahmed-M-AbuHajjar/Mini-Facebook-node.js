const validationType = ['body', 'params', 'query', 'headers'];

export const validation = (Schema) => {
    try {
        return (req, res, next) => {
            let validationErrorArr = []
            validationType.forEach((key) => {
                if(Schema[key]) {
                    let valid = Schema[key].validate(req[key], {abortEarly:false});
                    if(valid.error){
                        validationErrorArr.push(valid.error.details)
                    }
                }
            })
            if(validationErrorArr.length){
                res.status(404).json({message:'error',validationErrorArr});
            } else {
                next()
            }
        }
    } catch (error) {
        res.status(404).json({message:'error',error});
    }
   
};