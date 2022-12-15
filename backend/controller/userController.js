const User = require("../model/User");
const { MongoError } = require("mongoose");
const {
    status,
    successMessage,
    errorMessage
} = require("../helpers/status");
const {
    empty,
    isValidEmail,
    validatePassword,
    isValidMobile
} = require("../utils/validator")

//Create a User
const createUser = async (req, res) => {
    const { email, name, password, mobile } = req.body;
    if (empty(email) || empty(name) || empty(mobile) || empty(password)) {
        errorMessage.error = 'Email, password,  name and mobile field cannot be empty';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email)) {
        errorMessage.error = 'Please enter a valid Email';
        return res.status(status.bad).send(errorMessage);
    }
    if (!validatePassword(password)) {
        errorMessage.error = 'Password must be more than seven(7) characters';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidMobile(mobile)) {
        errorMessage.error = 'Mobile number must be of 10 digits';
        return res.status(status.bad).send(errorMessage);
    }

    // const hashedPassword = hashPassword(password);
    // const values = [
    //     email,
    //     name,
    //     hashedPassword,
    //     mobile
    // ];
    try {
        const userExit = await User.findOne({ email });

        if (userExit) {
            const token = await userExit.signToken();
            errorMessage.error = "user already exist"
            res.status(status.conflict).json(errorMessage);
        } else {
            var user = await User.create(req.body);
            const token = await user.signToken();
            successMessage.user = user.userJSON(token)
            res.status(status.created).json(successMessage);
        }

        // const { rows } = await pool.query(createUserQuery, values);
        // const dbResponse = rows[0];
        // delete dbResponse.password;
        // return res.sendStatus(status.created);
    }
    catch (error) {
        if (error.message.split(" ")[0] === "E11000") {
            errorMessage.error = 'User with that EMAIL/MOBILE already exist';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

const siginUser = () => {

}

module.exports = {
    createUser,
    siginUser
}