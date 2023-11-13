const transaction_schema = require("../Models/transiton_model");

const getBarChart = async (req, res) => {
  const month = Number(req.query.month);

  const priceRanges = [0, 101, 201, 301, 401, 501, 601, 701, 801];

  try {
    const itemBucket = await transaction_schema.aggregate([
      {
        $match: {
          $expr: {
            $eq: [
              { $month: { $toDate: "$dateOfSale" } },
              parseInt(month)
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: priceRanges.map((range, index) => ({
                case: {
                  $and: [
                    { $gte: ["$price", range] },
                    { $lt: ["$price", priceRanges[index + 1] || Infinity] }
                  ]
                },
                then: index
              })),
              default: -1
            }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$price" },
          prices: { $push: "$price" },
         
        }
      },
      {
        $project: {
          _id: 0,
          priceRangeIndex: "$_id",
          count: 1,
          totalAmount: 1,
          prices: 1,
          
        }
      }
    ]);

    return res.send({
      status: 200,
      message: "Successfully fetched grouped data",
      data: itemBucket,
    });
  } catch (err) {
    return res.send({
      status: 500,
      message: "Could not fetch data",
      data: err,
    });
  }
};

module.exports = getBarChart;
