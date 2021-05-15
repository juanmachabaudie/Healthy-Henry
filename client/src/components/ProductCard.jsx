import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { findProduct } from "../redux/actions/productActions";
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {Button} from '@material-ui/core'
import {Link} from 'react-router-dom'
import {addToCart} from '../redux/actions/cartActions'

const useStyles = makeStyles((theme) => ({
    
    root: {
      
      maxWidth: 345,
      boxShadow: '0 0 50px rgb(234, 232, 300)',
      marginTop: '20px',
      display: 'flex',
      flexDirection:'column',
      
      },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    avatar: {
      backgroundColor: green[500],
      
    },
    
  }));





export default function ProductCard({ uuid, name, description, image, price, }) {
  const dispatch = useDispatch();
  const history = useHistory();

  function handleClick(e) {
    console.log("from Comp ", e.target.value);
    dispatch(findProduct(e.target.value));
    history.push("/product/detail/" + uuid);
    window.scrollTo(0, 0);
  }
  const classes = useStyles();

  const addProductToCart =() => dispatch(addToCart(uuid))

  return (
   
    <Card  className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} >
            diet
          </Avatar>
        }
       title={name}
      />
      <CardMedia onClick={handleClick}
        className={classes.media}
        image={image}
        title={name}
      />
      <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
          {description} <hr/>
          ${price}
          </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
         <Link to='/cart'> 
        <IconButton onClick={addProductToCart} aria-label="agregar" >
        <AddShoppingCartIcon />
          </IconButton>
          </Link>  
       <Button color='primary' variant='outlined'> COMPRAR </Button>
      </CardActions>
      <Collapse in={classes.expand} timeout="auto" unmountOnExit>
        <CardContent>
        </CardContent>
      </Collapse>
    </Card>
    

  );
}
          
          
         
          
          
