const express = require('express');
const { registerUser, loginUser, registerUserweb, loginUserweb, getalluser, getUser, logout, getAdmin} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();
router.post('/registerUser',registerUser);
router.post('/loginUser',loginUser);
router.post('/registerUserweb',registerUserweb)
router.post('/loginUserweb',loginUserweb)
router.get('/getAdmin',isAdmin,getAdmin)
router.get('/getAllUser',verifyToken,getalluser)
router.get('/getUser',verifyToken,getUser)
router.get('/logout',logout)
module.exports = router