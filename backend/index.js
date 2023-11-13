
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initialize = require("./API/initialize");
const transaction = require("./API/transtion");
const statics = require("./API/statistics");
const getBarChart = require("./API/Barchart")
const getCategoryItemsCountByMonth = require("./API/PieChart");
const app = express();
app.use(cors());
app.use(express.json());
const db = require("./config/db");

app.get('/initialize',initialize);
app.get('/transaction',transaction);
app.get('/statics',statics);
app.get('/barChart',getBarChart);
app.get('/pieChart',getCategoryItemsCountByMonth);
app.listen(process.env.PORT,()=>{
    console.log("server is running at :",process.env.PORT);
})