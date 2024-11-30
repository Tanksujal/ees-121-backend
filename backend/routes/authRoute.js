const express = require('express');
const { registerUser, loginUser, registerUserweb, loginUserweb, getalluser, getUser, logout, getAdmin, updateProfile} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const router = express.Router();
router.post('/registerUser',registerUser);
router.post('/loginUser',loginUser);
router.post('/registerUserweb',registerUserweb)
router.post('/loginUserweb',loginUserweb)
router.post('/updateProfile',updateProfile)
router.get('/getAdmin',isAdmin,getAdmin)
router.get('/getAllUser',getalluser)
router.get('/getUser',verifyToken,getUser)
router.get('/logout',logout)
module.exports = router