
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGODB_URL)
.then((res) => {
    console.log("MongoDB Connected!");
  })
  .catch((err) => {
    console.log(err);
  });