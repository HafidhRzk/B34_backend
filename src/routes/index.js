const express = require('express');
const router = express.Router();

const { 
    addUser,
    getUsers,
    updateUser,
    deleteUser
} = require('../controllers/user')

const { 
    addCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category')

const { 
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProduct
} = require('../controllers/product')

const { 
    getProfile,
} = require('../controllers/profile')

const { 
    addTransaction,
    getTransactions,
    notification,
} = require('../controllers/transaction')

const { 
    addCart,
    getCart,
    getCarts,
    deleteCart,
} = require('../controllers/cart')

const { register, login, checkAuth } = require('../controllers/auth');
const { auth } = require('../middlewares/auth');
const { uploadFile } = require('../middlewares/uploadFile');

router.post('/user', addUser);
router.get('/users', getUsers);
router.patch('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

router.post('/category', addCategory);
router.get('/categories', getCategories);
router.get('/category/:id', getCategory);
router.patch('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

router.post('/product', auth, uploadFile('image'), addProduct);
router.get('/products', auth, getProducts);
router.get('/product/:id', auth, getProduct);
router.patch('/product/:id', auth, uploadFile('image'), updateProduct);
router.delete('/product/:id', auth, deleteProduct);

router.get("/profile", auth, getProfile);

router.post('/transaction', auth, addTransaction);
router.get('/transactions', auth, getTransactions);
router.post('/notification', notification);

router.post('/cart', auth, addCart);
router.get('/carts', auth, getCarts);
router.get('/cart/:id', auth, getCart);
router.delete('/cart/:id', auth, deleteCart);

router.post('/register', register);
router.post('/login', login);
router.get("/check-auth", auth, checkAuth);

module.exports = router;