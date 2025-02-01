export default function allowCORSRequests() {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');

        next();
    }
}