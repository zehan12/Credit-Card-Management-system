const User = require("../model/User");
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
    }
    catch (error) {
        if (error.message.split(" ")[0] === "E11000") {
            errorMessage.error = 'This MOBILE is already registred';
            return res.status(status.conflict).send(errorMessage);
        }
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
};

// login user
const siginUser = async (req, res) => {
    const { email, password } = req.body;
    if (empty(email) || empty(password)) {
        errorMessage.error = 'Email or Password detail is missing';
        return res.status(status.bad).send(errorMessage);
    }
    if (!isValidEmail(email) || !validatePassword(password)) {
        errorMessage.error = 'Please enter a valid Email or Password';
        return res.status(status.bad).send(errorMessage);
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            errorMessage.error = 'User with this email does not exist';
            return res.status(status.notfound).send(errorMessage);
        }
        const verifyPassword = await user.verifyPassword(String(password));
        if (!verifyPassword) {
            errorMessage.error = "The password you provided is incorrect: Invalid Password";
            return res.status(status.bad).send(errorMessage)
        }

        const token = await user.signToken();
        successMessage.login = true
        successMessage.data = user.userJSON(token)
        return res.status(status.success).json(successMessage);
    }
    catch (error) {
        errorMessage.error = 'Operation was not successful';
        return res.status(status.error).send(errorMessage);
    }
}

module.exports = {
    createUser,
    siginUser
}