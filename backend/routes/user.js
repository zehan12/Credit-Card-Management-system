const router = require('express').Router();
const userFunction =require('../controller/userController')

// users Routes
router.post('/signup',userFunction.createUser);
router.post('/login', userFunction.siginUser);

module.exports= router;