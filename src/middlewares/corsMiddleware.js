export default function allowCORSRequests(options = {}) {
    return (req, res, next) => {
        if (Object.keys(options).length === 0) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            return next();
        }

        for (const key in options) {
            res.setHeader(key, options[key]);
        }

        next();
    }
}