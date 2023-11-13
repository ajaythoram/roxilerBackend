const transaction_schema = require("../Models/transiton_model");

const statics = async (req, res) => {
  try {
    const month = req.query.month;

    console.log(`Searching for data in month: ${month}`);

    // Calculate total sale amount
    const totalSaleAmountResult = await transaction_schema.aggregate([
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
      { $group: { _id: null, totalSaleAmount: { $sum: '$price' } } },
    ]);

    const totalSaleAmount = totalSaleAmountResult.length > 0 ? totalSaleAmountResult[0].totalSaleAmount : 0;

    console.log(`Total Sale Amount: ${totalSaleAmount}`);

    // Calculate total sold items
    const totalSoldItemsResult = await transaction_schema.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: { $toDate: "$dateOfSale" } }, parseInt(month)] },
              { $eq: ["$sold", true] }
            ]
          }
        }
      },
      { $group: { _id: null, totalSoldItems: { $sum: 1 } } },
    ]);

    const totalSoldItems = totalSoldItemsResult.length > 0 ? totalSoldItemsResult[0].totalSoldItems : 0;

    console.log(`Total Sold Items: ${totalSoldItems}`);

    // Calculate total unsold items
    const totalUnsoldItemsResult = await transaction_schema.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $month: { $toDate: "$dateOfSale" } }, parseInt(month)] },
              { $eq: ["$sold", false] }
            ]
          }
        }
      },
      { $group: { _id: null, totalUnsoldItems: { $sum: 1 } } },
    ]);

    const totalUnsoldItems = totalUnsoldItemsResult.length > 0 ? totalUnsoldItemsResult[0].totalUnsoldItems : 0;

    console.log(`Total Unsold Items: ${totalUnsoldItems}`);

    return res.status(200).send({
      status: 200,
      message: "Successfully",
      data: { totalSaleAmount, totalSoldItems, totalUnsoldItems },
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send({
      status: 400,
      message: "failed in statics",
      data: err,
    });
  }
};

module.exports = statics;
