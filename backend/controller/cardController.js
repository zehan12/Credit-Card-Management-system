const Card = require("../model/Card");
const User = require("../model/User");

const {
    empty,
    isValidCard
} = require('../utils/validator');
const {
    errorMessage,
    successMessage,
    status,
} = require('../helpers/status');


//Add a Card
const AddCard = async (req, res) => {
    const { card_number, expiry_date, name_on_card } = req.body;
    const user_id = req.user.userId
    if (empty(card_number) || empty(expiry_date) || empty(name_on_card)) {
        errorMessage.error = 'Card Number, Expiry Date and Name on Card field cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidCard((""+card_number).trim().split(" ").join(""))) {
        errorMessage.error = 'Please Enter a Valid Card Number';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const card = await Card.create({
            card_number, expiry_date, name_on_card, user_id
        })
        successMessage.data = card
        return res.status(status.created).json(successMessage);
    }
    catch (error) {
        if (error ) {
            errorMessage.error = 'Card Number is taken already';
            return res.status(status.conflict).send(errorMessage);
        } else {
        errorMessage.error = 'Unable to add card';
        return res.status(status.error).send(errorMessage); }
    }
};

const getAllCards = async (req, res) => {
    const { user_id } = req.params;
    try {
        const cards = await Card.find({user_id:user_id}).sort({_id:-1})
        if (!cards) {
            errorMessage.error = 'You have no cards';
            return res.status(status.notfound).send(errorMessage);
        }
        successMessage.data = cards;
        return res.status(status.success).send(successMessage);
    } catch (error) {
        errorMessage.error = 'An error Occured';
        console.log(error.message)
        return res.status(status.error).send(errorMessage.error);
    }
};

// // Get All Statements
// const getAllStatements = async (req, res) => {
//     const { card_id, year, month } = req.params;
//     try {
//         const { rows } = await pool.query(getAllStatementsQuery, [card_id, year, month]);
//         const dbResponse = rows;
//         if (dbResponse[0] === undefined) {
//             errorMessage.error = 'You have no transactions for given Year and Month';
//             return res.status(status.notfound).send(errorMessage);
//         }
//         successMessage.data = dbResponse;
//         return res.status(status.success).send(successMessage);
//     } catch (error) {
//         errorMessage.error = 'An error Occured';
//         return res.status(status.error).send(errorMessage);
//     }
// };

// //Pay Bill
// const PayBill = async (req, res) => {
//     const { card_id } = req.params;
//     const { amount_to_pay } = req.body;
//     try {
//         const { rows } = await pool.query(OrigAmountFetchQuery, [card_id]);
//         const dbResponse = rows[0];
//         const orig_balance = dbResponse.balance;
//         if (orig_balance > amount_to_pay)
//             new_balance = orig_balance - amount_to_pay;
//         else {
//             new_balance = amount_to_pay - orig_balance;
//             new_balance *= -1;
//         }
//         const rows_ = await pool.query(UpdateBalanceQuery, [new_balance, card_id]);
//         const dbReseponseForBalance = rows_.rows[0];
//         successMessage.data = dbReseponseForBalance.balance;
//         return res.status(status.success).send(successMessage);
//     }
//     catch (error) {
//         return res.status(status.error).send(error);
//     }
// };

module.exports = {
    AddCard,
    getAllCards
}