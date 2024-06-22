

// List all transactions with search and pagination
// const getAllTransactions = async (req, res) => {
//   const { page = 1, perPage = 10, search = '', month } = req.query;
//   const query = {
//     $or: [
//       { title: { $regex: search, $options: 'i' } },
//       { description: { $regex: search, $options: 'i' } },
//       { price: { $regex: search, $options: 'i' } }
//     ]
//   };
//   if (month) {
//     query.dateOfSale = { $regex: `-${month.padStart(2, '0')}-` };
//   }
//   try {
//     const transactions = await Transaction.find(query)
//       .skip((page - 1) * perPage)
//       .limit(parseInt(perPage));
//     res.json(transactions);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };


const Transaction = require('../models/Transaction');


// List all transactions with search and pagination
const getAllTransactions = async (req, res) => {
  
 const { page = 1, perPage = 5, search = '', month } = req.query;
  const query = {
    $or: [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ]
  };

  if (!isNaN(parseFloat(search)) && isFinite(search)) {
    query.$or.push({ price: parseFloat(search) });
  }

  if (month) {
    const startDate = new Date(`${new Date().getFullYear()}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query.dateOfSale = { $gte: startDate, $lt: endDate };
  }
 
  try {
    const totalCount = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    const totalPages = Math.ceil(totalCount / perPage);

    res.json({
      transactions,
      totalPages,
      currentPage: parseInt(page),
      totalTransactions: totalCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Get statistics
const getStatistics = async (req, res) => {
  const { month } = req.query;
  const query = {};
  
  if (month) {
    const startDate = new Date(`${new Date().getFullYear()}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query.dateOfSale = { $gte: startDate, $lt: endDate };
  }

  try {
    const totalSaleAmount = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$price' } } }
    ]);
    const totalSoldItems = await Transaction.countDocuments({ ...query, sold: true });
    const totalNotSoldItems = await Transaction.countDocuments({ ...query, sold: false });
    res.json({
      totalSaleAmount: totalSaleAmount[0]?.total || 0,
      totalSoldItems,
      totalNotSoldItems
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get bar chart data
const getBarChart = async (req, res) => {
  const { month } = req.query;
  const query = {};
  
  if (month) {
    const startDate = new Date(`${new Date().getFullYear()}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query.dateOfSale = { $gte: startDate, $lt: endDate };
  }

  const ranges = [
    { min: 0, max: 100 },
    { min: 101, max: 200 },
    { min: 201, max: 300 },
    { min: 301, max: 400 },
    { min: 401, max: 500 },
    { min: 501, max: 600 },
    { min: 601, max: 700 },
    { min: 701, max: 800 },
    { min: 801, max: 900 },
    { min: 901, max: Infinity }
  ];
  try {
    const data = await Promise.all(
      ranges.map(async range => {
        const count = await Transaction.countDocuments({
          ...query,
          price: { $gte: range.min, $lte: range.max }
        });
        return { range: `${range.min}-${range.max}`, count };
      })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get pie chart data
const getPieChart = async (req, res) => {
  const { month } = req.query;
  const query = {};
  
  if (month) {
    const startDate = new Date(`${new Date().getFullYear()}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query.dateOfSale = { $gte: startDate, $lt: endDate };
  }

  try {
    const categories = await Transaction.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get combined data
const getCombinedData = async (req, res) => {
  const { month } = req.query;
  const query = {};
  
  if (month) {
    const startDate = new Date(`${new Date().getFullYear()}-${month.padStart(2, '0')}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query.dateOfSale = { $gte: startDate, $lt: endDate };
  }

  try {
    const [transactions, statistics, barChart, pieChart] = await Promise.all([
      Transaction.find(query),
      getStatistics(req, res),
      getBarChart(req, res),
      getPieChart(req, res)
    ]);
    res.json({ transactions, statistics, barChart, pieChart });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData
};
