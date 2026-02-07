const reportService = require('../services/report.service');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const stats = await reportService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

exports.getChartData = async (req, res, next) => {
  try {
    const chartData = await reportService.getChartData();
    res.json({ success: true, data: chartData });
  } catch (error) {
    next(error);
  }
};

exports.getOperationalStats = async (req, res, next) => {
  try {
    const stats = await reportService.getOperationalStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

