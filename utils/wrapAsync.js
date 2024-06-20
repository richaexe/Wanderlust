module.exports = function (fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next))
            .then(result => {
                // Handle the result if needed
                // For example, send a response
                // res.json(result);
            })
            .catch(err => {
                // Pass the error to the next middleware
                next(err);
            });
    };
};
