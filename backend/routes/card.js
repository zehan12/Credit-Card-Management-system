const express= require('express');

const cardFunction = require('../controller/cardController');
const auth= require( '../middleware/auth');

const router = express.Router();

// Cards Routes
router.post('/',auth.verifyToken,  cardFunction.AddCard);
router.get('/:user_id',auth.verifyToken,  cardFunction.getAllCards);
// router.delete('/cards',auth.verifyToken,  cardFunction.deleteCard);
// router.post('/cards/:card_id/statements/:year/:month',  cardFunction.AddStatement);
// router.get('/cards/:card_id/statements/:year/:month',auth.verifyToken,  cardFunction.getAllStatements);
// router.get('/cards/:card_id/statements/:year/:month/summary',auth.verifyToken,  cardFunction.getSummary);
// router.post('/cards/:card_id/pay',auth.verifyToken,  cardFunction.PayBill);

module.exports= router;
