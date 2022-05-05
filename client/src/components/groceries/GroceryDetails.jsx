import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import Posts from '../posts/Posts';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
    LinearScale,
    BarElement,
    Title,
} from 'chart.js';


const GroceryDetails = () => {
    const [posts, setPosts] = useState([]);
    useEffect(() => { loadPostsByGroceries(); }, []);
    const grocery = useLocation().state;

    const loadPostsByGroceries = () => {
        axios.post('/api/posts/bygroceries', {
            groceries: [grocery.name]
        }).then(res => {
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
                position: 'top',
            },
            title: {
                display: true,
                text: "Amount of " + grocery.name,
            },
        },
    };

    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const barData = {
        labels,
        datasets: [
            {
                label: 'Dataset 1',
                data: labels.map((_, index) => index * 200),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels.map((_, index) => index * 200),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    //#endregion

    //#region doughnut-Graph
    const doughnutData = {
        labels: ['Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: '# of Votes',
                data: [3, 5, 2, 3],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };
    //#endregion

    return (
        <>
            <div style={{ display: "flex", margin: "5% 3%", justifyContent: "space-evenly", alignItems: "center" }}>
                <div style={{ width: "25%" }}>
                    <Doughnut data={doughnutData} />
                </div>
                <div style={{ width: "40%" }}>
                    <Bar options={options} data={barData} />
                </div>
            </div>

            <Container sx={{ marginBottom: '20px' }}>
                {(posts.length === 0) ?
                    (<h1>There's no posts related to that grocery</h1>) : <Posts posts={posts} />
                }
            </Container>
        </>
    );
}

export default GroceryDetails;