import React, { useEffect, useState } from "react";
import { Container, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Posts from "../posts/Posts";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

const GroceryDetails = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    loadPostsByGroceries();
  }, []);
  const grocery = useLocation().state;
  console.log(JSON.stringify(grocery));
  const loadPostsByGroceries = () => {
    axios
      .post("/api/posts/bygroceries", {
        groceries: [grocery.name],
      })
      .then((res) => {
        console.log(res.data.posts);
        setPosts(res.data.posts);
      });
  };

  ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  // https://react-chartjs-2.js.org/examples/vertical-bar-chart/

  //#region Bar-Graph
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Amount of " + grocery.name,
      },
    },
  };

  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
  ];

  const barData = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map((_, index) => index * 200),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map((_, index) => index * 200),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  //#endregion

  //#region doughnut-Graph
  const doughnutOptionsShowLabels = {
    options: {
      plugins: {
        legend: {
          display: true,
        },
      },
    },
  };

  const doughnutOptionsHideLabels = {
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  };

  const doughnutData = {
    data: {
      labels: ["Yellow", "Green", "Orange"],
      datasets: [
        {
          label: "# of Votes",
          data: [3, 5, 3],
          backgroundColor: [
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
  };
  //#endregion

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          component="img"
          sx={{
            height: "250px",
            width: "250px",
            justifyContent: "center",
            alignItems: "center",
          }}
          alt={grocery.name}
          src="/assets/logo.png"
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontFamily: "Roboto",
        }}
      >
        <h1>{grocery.name}</h1>
      </div>
      <Box
        sx={{
          display: "flex",
          margin: "5% 3%",
          justifyContent: "space-evenly",
          alignItems: "center",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            width: "25%",
            display: {
              xs: "none",
              md: "flex",
              l: "flex",
              xl: "flex",
            },
          }}
        >
          <Doughnut
            options={doughnutOptionsShowLabels.options}
            data={doughnutData.data}
          />
        </Box>
        <Box
          sx={{
            width: "25%",
            display: { xs: "flex", md: "none", l: "none", xl: "none" },
            mb: "6%",
          }}
        >
          <Doughnut
            options={doughnutOptionsHideLabels.options}
            data={doughnutData.data}
          />
        </Box>
        <Box
          sx={{
            height: { xs: "300px" },
            width: { xs: "90%", md: "40%", l: "40%", xl: "40%" },
          }}
        >
          <Bar options={options} data={barData} />
        </Box>
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          fontFamily: "Roboto",
        }}
      >
        <h2>Related Posts</h2>
      </div>

      <Container sx={{ marginBottom: "20px" }}>
        {posts.length === 0 ? (
          <h1>There's no posts related to that grocery</h1>
        ) : (
          <Posts posts={posts} noBorder />
        )}
      </Container>
    </>
  );
};

export default GroceryDetails;
