import React, { useState, useEffect } from "react";
import { List, ListItemButton, ListItemText, ListSubheader } from "@mui/material";

//Pending Post products list
const ProductsList = ({ content, role = "collector" }) => {
    const viewdByCollector = (role === "collector");
    const viewdByPublisher = (role === "publisher");

    return (
        <List disablePadding>
            <ListSubheader hidden={viewdByPublisher}>Items</ListSubheader>
            {content.map((item) => (
                <ListItemText inset key={item._id}>
                    {item.amount + item.scale + ' '}
                    <b>{item.name} </b>
                    {viewdByCollector ? (' packed in a ' + item.packing) : null}
                </ListItemText>
            ))}
        </List>
    )
}

export default ProductsList;