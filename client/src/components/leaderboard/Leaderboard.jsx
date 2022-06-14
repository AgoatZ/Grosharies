import { styled, Container, Typography, Stack, Table, TableBody, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { useEffect, useState } from "react";
import axios from "../../utils/axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.common.white,
      fontSize: 20,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 16,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  useEffect(() => {
    axios.get("/users/topusers/byrank/").then((res) => {
      console.log(res.data.users);
      setLeaderboard(res.data.users);
    });
  }, []);

  return (
    <Stack direction="column" alignItems="center" justifyItems="center" flexWrap="wrap" spacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}>

      <Stack direction="row" spacing={5} alignItems="center" justifyItems="center" flexWrap="wrap" sx={{ mb: 3 }}>
        <Typography variant="h3" >Our Top Savers</Typography>
        <img src="/assets/winner.png" width="150px" height="150px" />
      </Stack>

      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 300 }}>
          <TableHead>
            <TableRow sx={{ background: 'theme' }}>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Rank</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((user, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell >{index + 1}</StyledTableCell>
                <StyledTableCell >{user.firstName + ' ' + user.lastName}</StyledTableCell>
                <StyledTableCell >{user.rank}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </Stack>
  );

};

export default Leaderboard;
