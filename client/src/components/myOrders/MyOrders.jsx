import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import OrderCard from "../myOrders/OrderCard";
import ProductsList from "../myOrders/ProductsList";
import { Typography, Box, CardMedia, Divider, Button, ButtonGroup, Stack, Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemText, Collapse, ListSubheader, Fab } from "@mui/material";
//Icons
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyOrders = () => {
  const [pendingsPosts, setPendingsPosts] = useState([]);
  const [finishedPendings, setFinishedPendings] = useState([]);
  const [cancelledPendings, setCancelledPendings] = useState([]);
  useEffect(() => { loadPendingPosts(); }, []);

  //Pendings from API according to their FINAL status
  const loadPendingPosts = () => {
    axios.get("pendings/collector/current").then((res) => {
      console.log("All Pendings(Orders) Of User", res.data);
      setPendingsPosts(res.data.pendingPosts);
      setFinishedPendings(res.data.finishedPendings);
      setCancelledPendings(res.data.cancelledPendings);
    }).catch(e => console.log("Error getting user's pending posts", e));
  };

  const OrdersAccordion = ({ pendingPosts, finished = false, cancelled = false }) => {
    return (
      pendingPosts.map((pendingPost) => (
        <Accordion key={pendingPost._id} sx={{ mb: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <OrderCard pendingPost={pendingPost} finished={finished} cancelled={cancelled} />
          </AccordionSummary >
          <AccordionDetails>
            <Divider />
            <ProductsList content={pendingPost.content} />
          </AccordionDetails>
        </Accordion >
      ))
    )
  };

  return (
    <Stack spacing={1} sx={{ m: "5%", mb: "1%" }}>
      <Typography variant="h3" sx={{ mb: "5%" }}>My Orders</Typography>
      <Typography variant="h4" >Pending</Typography>
      {pendingsPosts.length > 0 ? <OrdersAccordion pendingPosts={pendingsPosts} /> : <Typography>No Pending Orders</Typography>}
      <Typography variant="h4" >Completed</Typography>
      {finishedPendings.length > 0 ? <OrdersAccordion pendingPosts={finishedPendings} finished /> : <Typography>No Finished Orders</Typography>}
      <Typography variant="h4" >Canceled</Typography>
      {cancelledPendings.length > 0 ? <OrdersAccordion pendingPosts={cancelledPendings} cancelled /> : <Typography>No Canceled Orders</Typography>}
    </Stack>
  );
};

export default MyOrders;
