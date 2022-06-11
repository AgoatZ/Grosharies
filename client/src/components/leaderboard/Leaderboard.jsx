import { Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState({});
  useEffect(() => {
    axios.get("/api/leaderboards", () => {
      setLeaderboard(leaderboard);
    });
  }, []);

  if (!leaderboard) {
    return (
      <Container>
        <table>
          {leaderboard.map((leader) => {
            return (
              <tr>
                <td>{leader.name} </td>
                <td>{leader.rank} </td>
              </tr>
            );
          })}
        </table>
      </Container>
    );
  }
};

export default Leaderboard;
