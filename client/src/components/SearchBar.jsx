import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { searchProducts } from "../redux/actions/productActions";
//----------- ↓ Import Styles ↓ -----------
import { makeStyles } from "@material-ui/core/styles";
import {
  form,
  IconButton,
  Input,
  InputAdornment,
} from "@material-ui/core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyle = makeStyles();

export default function SearchBar() {
  const classes = useStyle();

  const [product, setProduct] = useState("");

  const dispatch = useDispatch();

  const history = useHistory();

  function handleChange(event) {
    event.preventDefault();
    setProduct(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (product === "") {
      return;
    }
    dispatch(searchProducts(product));
    history.push(`/product/search?name=${product}`);
    setProduct("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input 
        placeholder="Buscar..."
        onChange={(event) => handleChange(event)}
        endAdornment={
          <InputAdornment position="end">
            <IconButton >
              <FontAwesomeIcon icon={faSearch} color="#404040" />
            </IconButton>
          </InputAdornment>
        }
      />
    </form>
  );
}
