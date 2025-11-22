const { Log } = require('../models');

const getLogs = async (req, res, next) => {
  try {
    const { limit = 100 } = req.query;
    const logs = await Log.findAll(req.user.orgId, parseInt(limit));
    
    res.json({
      success: true,
      data: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLogs
};