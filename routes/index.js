const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const caseService = require('../services/caseService');

router.get('/', async (req, res, next) => {
  try {
    const [clients, cases] = await Promise.all([
      clientService.getClients(),
      caseService.getCases()
    ]);

    const stats = {
      totalClients: clients.length,
      openCases: cases.filter(c => c.status === 'OPEN').length,
      inProgressCases: cases.filter(c => c.status === 'IN_PROGRESS').length,
      closedCases: cases.filter(c => c.status === 'CLOSED').length,
      dismissedCases: cases.filter(c => c.status === 'DISMISSED').length,
      totalCases: cases.length
    };

    res.render('index.njk', {
      pageTitle: 'Dashboard',
      currentPage: 'dashboard',
      stats,
      recentCases: cases.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
