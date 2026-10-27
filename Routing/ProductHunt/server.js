import express from 'express';
import { ProductRouter } from './routes/ProductsRoute.js';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/api/v1/products", ProductRouter);

app.get('/', (req, res) => {
    res.send('Hello, world');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})