import React from "react";
import { List, ListItemText, ListSubheader } from "@mui/material";

const ProductsList = ({ content }) => {
    return (
        <List>
            <ListSubheader>Products</ListSubheader>
            {content.map((item) => (
                <ListItemText inset key={item.original._id}>
                    <b>•  </b>
                    {item.original.amount + item.original.scale + ' '}
                    <b>{item.original.name} </b>
                    {' packed in a ' + item.original.packing + ' '}
                    <ins >{item.left + ' left'}</ins >
                </ListItemText>
            ))}
        </List>
    )
}

export default ProductsList;