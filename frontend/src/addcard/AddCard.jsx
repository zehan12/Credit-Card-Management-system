import React from 'react';
import Cards from 'react-credit-cards';
// import { Helmet } from 'react-helmet';
import { useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import useStyles from './styles';
import { TextField, Button, Dialog, DialogTitle, Grid, Paper } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Alert } from '@material-ui/lab';
// import { a } from 'react-router-dom';
// import UserProfile from '../UserProfile';
import axios from 'axios';

const AddCard = () => {
    const classes = useStyles();
    const user_id = UserProfile.getId();
    const token = UserProfile.getToken();
    const [name_on_card, setName] = useState("");
    const [expiry_date, setExpiry] = useState("");
    const [card_number, setNumber] = useState("");
    const [focus, setFocus] = useState("");
    const [open, setOpen] = useState(false);
    const [errDate, setErrdate] = useState(false);
    const [openFailure, setOpenFailure] = useState(false);
    const [errNumber, setErrnumber] = useState(0);

    const handleCardNumber = (text) => {
        let formattedText = text.split(' ').join('');
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        setNumber(formattedText);
    }

    const handleExpiry = (text) => {
        let textTemp = text;
        if (textTemp[0] !== '1' && textTemp[0] !== '0') {
            textTemp = '';
        }
        if (textTemp.length === 2) {
            if (parseInt(textTemp.substring(0, 2)) > 12 || parseInt(textTemp.substring(0, 2)) === 0) {
                textTemp = textTemp[0];
            } else {
                textTemp += '/';
            }
        }
        setExpiry(textTemp)
    }

    const handleBackspace = (e) => {
        if (e.keyCode === 8) {
            if (expiry_date.length === 3) {
                let temp = expiry_date.substring(0, 2);
                setExpiry(temp)
            }
        }
    }


    const Success = () => (
        <Dialog className={classes.dialog} open={open}>
            <DialogTitle ><CheckCircleOutlineIcon style={{ color: "green", fontSize: "100px" }} /> <br />
                Card Successfully Added!
            </DialogTitle>
            <a to='/cards' style={{ textDecoration: "none", color: "white" }}><Button style={{ width: "100%" }} variant="contained" color="primary">Okay</Button></a>
        </Dialog>
    )

    const Failure = () => (
        <Dialog className={classes.dialog} open={openFailure}>
            <DialogTitle style={{ textAlign: "center" }}><CancelOutlinedIcon style={{ color: "red", fontSize: "100px" }} /> <br />
                Error!
            </DialogTitle>
            <a to='/cards' style={{ textDecoration: "none", color: "white" }}><Button style={{ width: "100%" }} variant="contained" color="primary">Okay</Button></a>
        </Dialog>
    )

    // const validate = () => {
    //     let temp_number = card_number.replace(/\s/g,'');
    //     let valid = true

    //     if (expiry_date.length!==5 ||  !(/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry_date))){
    //         setErrdate(true);
    //         valid = false;
    //     }
    //     else {
    //         let month = expiry_date.substring(0,2)
    //         let year = expiry_date.substring(3,5)
    //         const curdate = new Date();
    //         let curmonth = (curdate.getMonth())+1;
    //         if (curmonth<10){
    //             curmonth = '0'+curmonth;
    //         }
    //         else{
    //             curmonth = curmonth.toString();
    //         }
    //         let curyear = curdate.getFullYear().toString().substr(-2);
    //         if ((year<curyear) || (month<curmonth && year===curyear)){
    //             setErrdate(true);
    //             valid = false
    //         }
    //     }
    //     if (temp_number.length!==16 || !(/^\d+$/.test(temp_number))){
    //         setErrnumber(true);
    //         valid = false;
    //     }
    //     return valid

    // }

    const validate = () => {
        let temp_number = card_number.replace(/\s/g, '');
        let valid = true;

        const isValidCard = (input) => {
            let sum = 0;
            let numdigits = input.length;
            let parity = numdigits % 2;
            for (let i = 0; i < numdigits; i++) {
                let digit = parseInt(input.charAt(i))
                if (i % 2 == parity) digit *= 2;
                if (digit > 9) digit -= 9;
                sum += digit;
            }
            return (sum % 10) == 0;
        };

        // Check expiry date
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry_date)) {
            setErrdate(true);
            valid = false;
        } else {
            const expiry = new Date(`20${expiry_date.substring(3, 5)}-${expiry_date.substring(0, 2)}-01`);
            if (expiry < new Date()) {
                setErrdate(true);
                valid = false;
            }
        }

        // Check card number
        if (!/^\d{16}$/.test(temp_number) || !isValidCard(temp_number)) {
            setErrnumber(true);
            valid = false;
        }

        // Check card type
        if (!/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(temp_number)) {
            setErrtype(true);
            valid = false;
        }

        // Check card issuer
        if (!/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(temp_number)) {
            setErrissuer(true);
            valid = false;
        }

        return valid;
    };

    const onSubmit = async (e) => {

        e.preventDefault()
        setErrdate(false);
        setErrnumber(0);

        if (validate()) {
            let card_no = card_number.replace(/\s/g, '');
            const userObject = {
                name_on_card: name_on_card,
                card_number: card_no,
                expiry_date: expiry_date,
            };
            await axios({
                method: 'POST',
                url: `${"http://localhost:8081/api"}/cards`,
                headers: {
                    authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzliOGZkZThiNzQwMTUyNDA2ODM2M2EiLCJlbWFpbCI6InplaGFuOTIxMUBnbWFpbC5jb20iLCJuYW1lIjoiemVoYW4ga2hhbiIsImlhdCI6MTY3MTE5MTE4MH0.5LMdJRrgKA8db6JivUvG_P7FbeoRIJakKMuAb9EBgN4`,
                },
                data: userObject
            })
                .then((res) => {
                    if (res.status === 201) {
                        setOpen(true)
                    }
                }).catch((error) => {
                    if (error.response.status === 400) {
                        setErrnumber(1);
                    }
                    if (error.response.status === 409) {
                        setErrnumber(2);
                    }
                    if (error.response.status === 500) {
                        setErrnumber(2);
                    }
                });

        }

    }

    return (
        <>
            {/* <Helmet><title>Add Card</title></Helmet> */}
            <div className={classes.main}>
                <Paper className={classes.paper}>
                    <div className={classes.carddiv}>
                        <Cards
                            expiry={expiry_date}
                            name={name_on_card}
                            number={card_number}
                            focused={focus}
                        />
                    </div>

                    <form onSubmit={onSubmit} className={classes.form}>

                        <div className={classes.input}>
                            <TextField
                                id="standard-input"
                                label="Name on Card"
                                onChange={(e) => { setName(e.target.value) }}
                                onFocus={(e) => { setFocus(e.target.name) }}
                                size="small"
                                InputLabelProps={{
                                    required: false,
                                    className: classes.fields,
                                }}
                                InputProps={{
                                    className: classes.fields,
                                }}
                                required
                            />
                        </div>

                        <div className={classes.input}>
                            <TextField
                                id="card-number"
                                label="Card Number"
                                value={card_number}
                                onChange={(e) => { handleCardNumber(e.target.value) }}
                                onFocus={(e) => { setFocus(e.target.name) }}
                                inputProps={{ maxLength: 19 }}
                                InputLabelProps={{
                                    className: classes.fields,
                                    required: false
                                }}

                                InputProps={{
                                    className: classes.fields,
                                }}
                                size="small"
                                placeholder="XXXX-XXXX-XXXX-XXXX"
                                required
                                error={errNumber}
                                helperText={errNumber == 0 ? "" : errNumber == 1 ? "Invalid card number" : "Card already registered"}
                            />
                        </div>



                        <div className={classes.input}>
                            <TextField
                                id="expiry-date"
                                label="Expiry Date"
                                value={expiry_date}
                                onChange={(e) => { handleExpiry(e.target.value) }}
                                onKeyDown={(e) => { handleBackspace(e) }}
                                onFocus={(e) => { setFocus(e.target.name) }}
                                size="small"
                                InputLabelProps={{
                                    className: classes.fields,
                                    required: false
                                }}
                                InputProps={{
                                    className: classes.fields,
                                }}

                                inputProps={{ maxLength: 5 }}
                                placeholder="MM/YY"
                                required
                                error={errDate}
                                helperText={errDate ? "Enter Valid Date" : ""}
                            />
                        </div>

                        <div className={classes.buttondiv}>
                            <Button className={classes.submitbutton} type="submit" color="primary" variant="contained">Add Card</Button>
                        </div>
                        <div className={classes.buttondiv}>
                            <a style={{ textDecoration: "none", color: "black" }} to='/cards'><Button variant="contained" >Cancel</Button></a>
                        </div>
                    </form>
                    <Success open={open} />
                    <Failure open={openFailure} />
                </Paper>
            </div>
        </>
    )
}

export default AddCard;


const UserProfile = (function () {
    var user_name = "";
    var user_id = "";
    var token = "";

    const getName = function () {
        user_name = window.sessionStorage.getItem('username')
        return user_name;
    };

    const setName = function (name) {
        window.sessionStorage.setItem('username', name)

    };

    const getId = function () {
        user_id = window.sessionStorage.getItem('userid')
        return user_id;
    };

    const setId = function (id) {
        window.sessionStorage.setItem('userid', id)
    };

    const getToken = function () {
        token = window.sessionStorage.getItem('token')
        return token;
    };

    const setToken = function (token) {
        window.sessionStorage.setItem('token', token)
    };

    const logout = function () {
        window.sessionStorage.removeItem('userid')
        window.sessionStorage.removeItem('username')
        window.sessionStorage.removeItem('token')
    };


    return {
        getName: getName,
        setName: setName,
        getId: getId,
        setId: setId,
        getToken: getToken,
        setToken: setToken,
        logout: logout
    }

})();
