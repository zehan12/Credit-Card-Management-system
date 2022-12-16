import React from 'react';
import Cards from 'react-credit-cards';
import { useState } from 'react';
import 'react-credit-cards/es/styles-compiled.css';
import useStyles from './styles';
import { Container, Button, Card, CardMedia, CardContent, Dialog, DialogTitle } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import DeleteIcon from '@material-ui/icons/Delete';
// import { p, useHistory } from 'react-router-dom';
// import UserProfile from '../../UserProfile';
// import axios from 'axios';


const CardItem = ({card}) => {
    const classes = useStyles();
    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzliOGZkZThiNzQwMTUyNDA2ODM2M2EiLCJlbWFpbCI6InplaGFuOTIxMUBnbWFpbC5jb20iLCJuYW1lIjoiemVoYW4ga2hhbiIsImlhdCI6MTY3MTE5MTE4MH0.5LMdJRrgKA8db6JivUvG_P7FbeoRIJakKMuAb9EBgN4`
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFailure, setOpenFailure] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);


    const Success = () => (
      <Dialog className={classes.dialog} open={openSuccess}>
          <DialogTitle ><CheckCircleOutlineIcon style={{color:"green",fontSize:"100px"}}/> <br/>
          Card Successfully Deleted!
          </DialogTitle>
          <Button onClick={()=> window.location.reload(false)} style={{width:"100%"}} variant="contained" color="primary">Okay</Button>
      </Dialog>
    )

    const Failure = () => (
      <Dialog className={classes.dialog} open={openFailure}>
          <DialogTitle style={{textAlign:"center"}}><CancelOutlinedIcon style={{color:"red",fontSize:"100px"}}/> <br/>
          Error!
          </DialogTitle>
          <p to='/cards' style={{textDecoration:"none",color:"white"}}><Button style={{width:"100%"}} variant="contained" color="primary">Okay</Button></p>
      </Dialog>
    )

    const Confirm = () => (
      <Dialog className={classes.dialog} open={openConfirm} >
          <DialogTitle ><HelpOutlineIcon style={{color:"black",fontSize:"100px"}}/> <br/>
          Are you sure you want to delete this card?
          </DialogTitle>
          <Button onClick={handleDelete} variant="contained" color="primary" style={{width:"50%",margin:"10px auto"}}>Delete</Button>
          <p to='/cards' style={{textDecoration:"none",marginBottom:"10px"}}><Button variant="contained" style={{backgroundColor:"#888888"}}>Cancel</Button></p>
      </Dialog>
    )

    const handleDelete = async() => {
      setOpenConfirm(false)
      const userObject = {
        card_id: card.card_id
      };


    //   await axios({
    //     method: 'DELETE',
    //     url: `${process.env.REACT_APP_BACKEND_URL}/cards`,
    //     headers: {
    //       "token": `${token}`,
    //     },
    //     data: userObject
    //     })
    //     .then((res) => {
    //         if(res.status===200){
    //             setOpenSuccess(true)
    //         }
    //     }).catch((error) => {
    //         if(error.response.status===500){
    //             setOpenFailure(true)
    //         }
    //       });
    }

    return(
        <>
        <div>
=        <Cards className={classes.cards}
          expiry={card.expiry_date}
          name={card.name_on_card}
          number={card.card_number}
        />

        <div className={classes.heading}>
        {card.balance==0 ? <h3 style={{color:"whitesmoke",display:"inline"}}>Fully Paid</h3> : <h3 style={{color:"whitesmoke",display:"inline"}}>Due - {card.balance}</h3>}

        <Button size="small" onClick={()=>setOpenConfirm(true)} className={classes.deletebutton}><DeleteIcon style={{color:"grey"}} fontSize="small" /></Button>
        </div>
        <p style={{textDecoration:"none",display:card.balance>0 ? "inline" : "none"}} 
        to={{ pathname: '/pay', state: { balance: card.balance , card_number: card.card_number, id: card.card_id} }}>
          <Button className={classes.paybutton} color="primary" variant="contained" >Pay Bill</Button> 
        </p>

        <p style={{textDecoration:"none"}} 
        to={{ pathname: '/statement', state: { id: card.card_id} }}>
          <Button className={classes.trbutton}  color="primary" variant="contained">Statement</Button>
        </p>
        
        <Confirm open={openConfirm} />
        <Success open={openSuccess}/>
        <Failure open={openFailure}/>
        </div>
        </>
    )
}

export default CardItem;


// {/* <Card style={{width:"100%"}} className={classes.card_container}>
//         {/* <CardMedia> */}
//         <Cards className={classes.cards}
//           expiry={card.expiry_date}
//           name={card.name_on_card}
//           number={card.card_number}
//         />
//         {/* </CardMedia> */}
//         <CardContent>
//         <hr/>
//         <div className= {classes.heading}>
//         {card.balance==0 ? <h3 style={{color:"whitesmoke",display:"inline"}}>Fully Paid</h3> : <h3 style={{color:"whitesmoke",display:"inline"}}>Due - {card.balance}</h3>}

//         <Button size="small" onClick={()=>setOpenConfirm(true)} className={classes.deletebutton}><DeleteIcon style={{color:"grey"}} fontSize="small" /></Button>
//         </div>
//         <p style={{textDecoration:"none",display:card.balance>0 ? "inline" : "none"}} 
//         to={{ pathname: '/pay', state: { balance: card.balance , card_number: card.card_number, id: card.card_id} }}>
//           <Button className={classes.paybutton} color="primary" variant="contained" >Pay Bill</Button> 
//         </p>

//         <p style={{textDecoration:"none"}} 
//         to={{ pathname: '/statement', state: { id: card.card_id} }}>
//           <Button className={classes.trbutton}  color="primary" variant="contained">Statement</Button>
//         </p>
//         </CardContent>
//         </Card> */}