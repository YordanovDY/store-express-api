import { Router } from "express";

const routes = Router();

routes.get('/', (req, res) => {
    const example = {
        "id": 101,
        "name": "Wireless Bluetooth Headphones",
        "description": "High-quality noise-canceling wireless headphones with up to 20 hours of battery life.",
        "price": 79.99,
        "currency": "USD",
        "category": "Electronics",
        "brand": "SoundX",
        "stock": 150,
        "ratings": {
          "average": 4.5,
          "reviews": 320
        }
    }

    res.send(JSON.stringify(example));
});

export default routes;