import Visitor from '../models/Visitor.js';

// Track a visitor page visit
export const trackVisitor = async (req, res) => {
  try {
    const { page } = req.body;
    const sessionId = req.headers['x-session-id'] || `anonymous_${Date.now()}`;
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '';

    if (!page) {
      return res.status(400).json({ error: 'Page name is required' });
    }

    // Create visitor record
    const visitor = new Visitor({
      sessionId,
      page,
      userAgent,
      ipAddress,
    });

    await visitor.save();

    res.status(201).json({
      success: true,
      message: 'Visitor tracked successfully',
      data: {
        sessionId,
        page,
      },
    });
  } catch (error) {
    console.error('Error tracking visitor:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
};

// Get visitor statistics
export const getVisitorStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const stats = await Visitor.aggregate([
      {
        $match: {
          timestamp: { $gte: daysAgo },
        },
      },
      {
        $group: {
          _id: '$page',
          visitCount: { $sum: 1 },
          uniqueSessions: { $addToSet: '$sessionId' },
        },
      },
      {
        $project: {
          page: '$_id',
          visitCount: 1,
          uniqueVisitors: { $size: '$uniqueSessions' },
          _id: 0,
        },
      },
      { $sort: { visitCount: -1 } },
    ]);

    const totalVisitors = await Visitor.estimatedDocumentCount();
    const totalVisits = await Visitor.countDocuments({
      timestamp: { $gte: daysAgo },
    });

    res.status(200).json({
      success: true,
      data: {
        period: `${days} days`,
        totalVisits,
        totalVisitors,
        pageStats: stats,
      },
    });
  } catch (error) {
    console.error('Error getting visitor stats:', error);
    res.status(500).json({ error: 'Failed to get visitor statistics' });
  }
};

// Get all visitors with pagination
export const getAllVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const visitors = await Visitor.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Visitor.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        visitors,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalVisitors: total,
          limit: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error('Error getting all visitors:', error);
    res.status(500).json({ error: 'Failed to get visitors' });
  }
};

// Delete old visitors (cleanup)
export const deleteOldVisitors = async (req, res) => {
  try {
    const { days = 90 } = req.body;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const result = await Visitor.deleteMany({
      timestamp: { $lt: cutoffDate },
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} old visitor records`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    console.error('Error deleting old visitors:', error);
    res.status(500).json({ error: 'Failed to delete old visitor records' });
  }
};
