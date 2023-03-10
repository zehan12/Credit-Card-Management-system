//Email Check
const isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

//Password Validation
const validatePassword = (password) => {
    if (password.length <= 7 || password === '') {
        return false;
    } return true;
};

//Card Validation
const isValidCard = (input) => {
    var sum = 0;
    var numdigits = input.length;
    var parity = numdigits % 2;
    for (var i = 0; i < numdigits; i++) {
        var digit = parseInt(input.charAt(i))
        if (i % 2 == parity) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
    }
    return (sum % 10) == 0;
};

//Mobile Number Check
const isValidMobile = (mobile) => {
    if (mobile.length <= 9 || mobile === '') {
        return false;
    }
    return true;
}

//Empty Check
const empty = (input) => {
    if (input === undefined || input === '') {
        return true;
    }
    return false;
};

module.exports = {
    isValidEmail,
    isValidCard,
    empty,
    validatePassword,
    isValidMobile
}