const Product = require('../models/Product');
const Farmer = require('../models/Farmer');
const multer = require('multer');
const sharp = require('sharp');
const {v4: uuidv4} = require('uuid');

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

exports.addProduct = async (req, res) => {
    const {name, category, price, quantity, description} = req.body;

    console.log(req.user.userId)
    const userId = req.user.userId
    const farmer = await Farmer.findOne({userId})
    const images = req.files.map(file => ({
        data: file.buffer,
        contentType: file.mimetype,
    }));
    if(!farmer) res.status(404).send('Not Found');
    try {
        const newProduct = new Product({
            farmerId: farmer._id,
            name,
            category,
            price,
            quantity,
            description,
            images,
        });

        await newProduct.save();
        res.status(201).json({message: 'Product added successfully'});
    } catch (err) {
        console.error('addProduct: ' + err.message);
        res.status(500).send('Error adding product');
    }
};

exports.uploadImages = upload.array('images', 5), async (req, res, next) => {
    try {
        const resizedImages = await Promise.all(
            req.files.map(async file => {
                const filename = uuidv4() + '.jpg';
                const resizedImage = await sharp(file.buffer)
                    .resize(800, 800)
                    .toFormat('jpeg')
                    .jpeg({quality: 90})
                    .toBuffer();
                return {data: resizedImage, contentType: 'image/jpeg', filename};
            })
        );
        req.resizedImages = resizedImages;
        next();
    } catch (err) {
        console.error('uploadImages: ' + err.message);
        res.status(500).send('Error uploading images');
    }
};

exports.getProducts = async (req, res) => {
    const userId = req.user.userId
    const farmer = await Farmer.findOne({userId});
    try {
        const products = await Product.find({farmerId: farmer._id});
        res.status(200).json(products);
    } catch (err) {
        console.error('getProducts: ' + err.message);
        res.status(500).send('Error fetching products');
    }
};

exports.updateProduct = async (req, res) => {
    const {productId} = req.params;
    const {name, category, price, quantity, description, status} = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        product.name = name;
        product.category = category;
        product.price = price;
        product.quantity = quantity;
        product.description = description;
        product.status = status;

        await product.save();
        res.status(200).send('Product updated successfully');
    } catch (err) {
        console.error('updateProduct: ' + err.message);
        res.status(500).send('Error updating product');
    }
};

exports.deleteProduct = async (req, res) => {
    const {productId} = req.params;
    try {
        const product = await Product.findByIdAndDelete(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.status(200).send({message: 'Product deleted successfully'});
    } catch (err) {
        console.error('deleteProduct: ' + err.message);
        res.status(500).send('Error deleting product');
    }
};

exports.getLowStockProducts = async (req, res) => {
    const {farmerId} = req.params;
    try {
        const lowStockProducts = await Product.find({farmerId, quantity: {$lt: 10}});
        res.status(200).json(lowStockProducts);
    } catch (err) {
        console.error('getLowStockProducts: ' + err.message);
        res.status(500).send('Error fetching low-stock products');
    }
};
