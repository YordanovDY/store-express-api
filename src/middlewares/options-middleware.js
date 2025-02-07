export const optionsMiddleware = () => {
    return (req, res, next) => {
        if (!req.headers.options) {
            return next();
        }
        
        try {
            const options = JSON.parse(req.headers.options);
            req.options = options.options;
            next();

        } catch (err) {
            return res.status(400).json({ message: err.message, status: 400 });
        }
    }
}