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
    //TODO: Add to leaderboard api/users [{ name: user.firstName + '' + user.lasName, rank: user.rank }..]
    // axios.get("/users/leaderboard").then(res) => {
    //   setLeaderboard(leaderboard);
    // });

    let leaderboard;
    axios.get("/users/").then((res) => {
      leaderboard = res.data.users
        .map((user) => ({ name: user.firstName + ' ' + user.lastName, rank: user.rank, profileImage: user.profileImage }))
        .sort((u1, u2) => (u2.rank - u1.rank));
      setLeaderboard(leaderboard);
    })
  }, []);

  return (
    <Container>
      <Stack direction="row" spacing={5} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h3" >Our Top Savers</Typography>
        <img src="/assets/winner.png" width="150px" height="150px" />
      </Stack>

      <TableContainer component={Paper}>
        <Table stickyHeader sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ background: 'theme' }}>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>User</StyledTableCell>
              <StyledTableCell>Rank</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboard.map((leader, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell >{index + 1}</StyledTableCell>
                <StyledTableCell >{leader.name}</StyledTableCell>
                <StyledTableCell >{leader.rank}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container >
  );

};

export default Leaderboard;
