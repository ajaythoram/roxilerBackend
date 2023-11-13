
 const transaction_schema = require("../Models/transiton_model")
const getCategoryItemsCountByMonth = async (req, res) => {
    const month = Number(req.query.month); 
   
    if (isNaN(month) || month < 1 || month > 12) {
        return res.send({
            status: 400,
            message: "Invalid month parameter",
        });
    }
    try {
      const categoryItemsCount = await transaction_schema.aggregate([
        {
          $group: {
            _id: "$category",
            count: {
              $sum: {
                $cond: {
                  if: {
                    $eq: [
                      { $month: "$dateOfSale" },
                      month
                    ]
                  },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        }
      ]);
  
      console.log(categoryItemsCount); // Add this line for logging
  
      return res.send({
        status: 200,
        message: `Successfully fetched item counts for month ${month} grouped by category`,
        data: categoryItemsCount,
      });
    } catch (err) {
      console.error("Aggregation error:", err);
      return res.send({
        status: 400,
        message: "Failed to fetch category item counts",
        data: err,
      });
    }
  };
  
  module.exports = getCategoryItemsCountByMonth;
  