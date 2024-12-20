const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: 'available' }).populate('farmerId', 'farmDetails.location');
        res.status(200).json(products);
    } catch (err) {
        console.error('getAllProducts: ' + err.message);
        res.status(500).send('Error fetching products');
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { buyerId, products, totalAmount } = req.body;

        for (const product of products) {
            const { productId, quantity } = product;
            const dbProduct = await Product.findById(productId);

            if (!dbProduct || dbProduct.quantity < quantity) {
                return res.status(400).json({ message: `Product ${productId} is out of stock or not available` });
            }
        }

        const order = new Order({
            buyerId,
            products,
            totalAmount,
        });

        await order.save();

        for (const product of products) {
            const { productId, quantity } = product;
            await Product.findByIdAndUpdate(productId, { $inc: { quantity: -quantity } });
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const groupProductsByCategory = (products) => {
    return products.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});
};


exports.getProductDetails = async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await Product.findById(productId).populate('farmerId', 'farmDetails.*');
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('getProductDetails: ' + err.message);
        res.status(500).send('Error fetching product details');
    }
};


exports.searchProducts = async (req, res) => {
    const { query } = req.query;
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } },
                { 'farmerId.farmDetails.location': { $regex: query, $options: 'i' } },
            ],
            status: 'available',
        }).populate('farmerId', 'farmDetails.location');
        res.status(200).json(products);
    } catch (err) {
        console.error('searchProducts: ' + err.message);
        res.status(500).send('Error searching products');
    }
};

exports.filterProducts = async (req, res) => {
    const { category, priceRange, farmLocation, sortBy } = req.query;
    const filter = { status: 'available' };

    if (category) filter.category = category;
    if (priceRange) {
        const [minPrice, maxPrice] = priceRange.split('-');
        filter.price = { $gte: minPrice, $lte: maxPrice };
    }
    if (farmLocation) filter['farmerId.farmDetails.location'] = { $regex: farmLocation, $options: 'i' };

    try {
        let products = await Product.find(filter).populate('farmerId', 'farmDetails.location');

        if (sortBy) {
            const sortOptions = {
                priceLowToHigh: { price: 1 },
                priceHighToLow: { price: -1 },
                newest: { createdAt: -1 },
                popularity: { popularity: -1 },
            };
            products = products.sort(sortOptions[sortBy]);
        }

        res.status(200).json(products);
    } catch (err) {
        console.error('filterProducts: ' + err.message);
        res.status(500).send('Error filtering products');
    }
};
