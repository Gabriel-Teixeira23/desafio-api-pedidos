require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/desafio_pedidos';
mongoose.connect(dbURI)
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

const itemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
    creationDate: { type: Date, required: true },
    items: [itemSchema]
});

const Order = mongoose.model('Order', orderSchema);

const mapOrderData = (payload) => {
    return {
        orderId: payload.numeroPedido,
        value: payload.valorTotal,
        creationDate: payload.dataCriacao,
        items: payload.items.map(item => ({
            productId: item.idItem,
            quantity: item.quantidadeItem,
            price: item.valorItem
        }))
    };
};

app.post('/order', async (req, res) => {
    try {
        const payload = req.body;

        if (!payload.numeroPedido || !payload.items) {
            return res.status(400).json({ error: 'Dados incompletos no corpo da requisição.' });
        }

        const mappedData = mapOrderData(payload);
        const newOrder = new Order(mappedData);
        await newOrder.save();

        res.status(201).json({ 
            message: 'Pedido criado com sucesso!', 
            order: newOrder 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ error: 'Um pedido com este numeroPedido já existe.' });
        }
        res.status(500).json({ error: 'Erro interno no servidor.', details: error.message });
    }
});

app.get('/order/:id', async (req, res) => {
    try {
        const orderIdParams = req.params.id;
        const order = await Order.findOne({ orderId: orderIdParams });

        if (!order) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.status(200).json(order);

    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar pedido.', details: error.message });
    }
});

app.get('/order/list', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar pedidos.' });
    }
});

app.put('/order/:id', async (req, res) => {
    try {
        const orderIdParams = req.params.id;
        const payload = req.body;

        const mappedData = mapOrderData(payload);

        const updatedOrder = await Order.findOneAndUpdate(
            { orderId: orderIdParams },
            mappedData,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.status(200).json({
            message: 'Pedido atualizado com sucesso!',
            order: updatedOrder
        });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar pedido.', details: error.message });
    }
});

app.delete('/order/:id', async (req, res) => {
    try {
        const orderIdParams = req.params.id;
        
        const deletedOrder = await Order.findOneAndDelete({ orderId: orderIdParams });

        if (!deletedOrder) {
            return res.status(404).json({ error: 'Pedido não encontrado.' });
        }

        res.status(200).json({ message: 'Pedido deletado com sucesso!' });

    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar pedido.', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
});