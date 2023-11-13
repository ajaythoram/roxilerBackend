const { query } = require("express");
const transaction_schema = require("../Models/transiton_model");

const transaction = async (req, res) => {
  try {
    const search = req.query.search;
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 10;
    const month = req.query.month;
    
    let query = {};
    
    if (search || month) {
      const conditions = [];
    
      if (search) {
        const isNumeric = !isNaN(search);
    
        conditions.push({
          $or: [
            { title: { $regex: new RegExp(search, 'i') } },
            { description: { $regex: new RegExp(search, 'i') } },
            isNumeric ? { price: { $eq: Number(search) } } : {},
          ],
        });
      }
    
      if (month) {
        conditions.push({
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, Number(month)],
          },
        });
      }
      
    
      // Combine conditions with $and
      query = { $and: conditions };
    }
    

    // pagination

    const transaction_data = await transaction_schema
      .find(query)
      .skip(perPage * (page - 1))
      .limit(perPage);

    return res.status(200).send({
      status: 200,
      message: "success",
      data: transaction_data,
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "transaction not successful",
      data: err,
    });
  }
};

module.exports = transaction;
