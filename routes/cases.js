const express = require('express');
const router = express.Router();
const caseService = require('../services/caseService');
const clientService = require('../services/clientService');

const CASE_STATUSES = ['OPEN', 'IN_PROGRESS', 'CLOSED', 'DISMISSED'];
const CASE_TYPES = ['CRIMINAL', 'CIVIL', 'FAMILY', 'CORPORATE', 'EMPLOYMENT'];

router.get('/', async (req, res, next) => {
  try {
    const { status, caseType } = req.query;
    const cases = await caseService.getCases({ status, caseType });
    res.render('cases/list.njk', {
      pageTitle: 'Cases',
      currentPage: 'cases',
      breadcrumbs: [{ text: 'Dashboard', href: '/' }, { text: 'Cases' }],
      cases,
      selectedStatus: status || '',
      selectedCaseType: caseType || '',
      caseStatuses: CASE_STATUSES,
      caseTypes: CASE_TYPES
    });
  } catch (err) {
    next(err);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    const clients = await clientService.getClients();
    res.render('cases/new.njk', {
      pageTitle: 'Add new case',
      currentPage: 'cases',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Cases', href: '/cases' },
        { text: 'Add new case' }
      ],
      errors: [],
      formData: {},
      clients,
      caseTypes: CASE_TYPES
    });
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { caseNumber, title, description, caseType, clientId } = req.body;
  const formData = { caseNumber, title, description, caseType, clientId };

  const errors = [];
  if (!caseNumber || !caseNumber.trim()) errors.push({ text: 'Enter a case number', href: '#caseNumber' });
  if (!title || !title.trim()) errors.push({ text: 'Enter a case title', href: '#title' });
  if (!caseType) errors.push({ text: 'Select a case type', href: '#caseType' });

  if (errors.length > 0) {
    const clients = await clientService.getClients().catch(() => []);
    return res.render('cases/new.njk', {
      pageTitle: 'Add new case',
      currentPage: 'cases',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Cases', href: '/cases' },
        { text: 'Add new case' }
      ],
      errors,
      formData,
      clients,
      caseTypes: CASE_TYPES
    });
  }

  try {
    const caseData = {
      caseNumber: caseNumber.trim(),
      title: title.trim(),
      description: description?.trim() || null,
      caseType
    };
    if (clientId) caseData.clientId = parseInt(clientId, 10);

    const newCase = await caseService.createCase(caseData);
    res.redirect(`/cases/${newCase.id}`);
  } catch (err) {
    if (err.response && err.response.status === 409) {
      const clients = await clientService.getClients().catch(() => []);
      return res.render('cases/new.njk', {
        pageTitle: 'Add new case',
        currentPage: 'cases',
        breadcrumbs: [
          { text: 'Dashboard', href: '/' },
          { text: 'Cases', href: '/cases' },
          { text: 'Add new case' }
        ],
        errors: [{ text: 'A case with this case number already exists', href: '#caseNumber' }],
        formData,
        clients,
        caseTypes: CASE_TYPES
      });
    }
    next(err);
  }
});

router.get('/:id/status', async (req, res, next) => {
  try {
    const legalCase = await caseService.getCase(req.params.id);
    res.render('cases/update-status.njk', {
      pageTitle: `Update status – Case ${legalCase.caseNumber}`,
      currentPage: 'cases',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Cases', href: '/cases' },
        { text: legalCase.caseNumber, href: `/cases/${legalCase.id}` },
        { text: 'Update status' }
      ],
      case: legalCase,
      errors: [],
      caseStatuses: CASE_STATUSES
    });
  } catch (err) {
    next(err);
  }
});

router.post('/:id/status', async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    try {
      const legalCase = await caseService.getCase(req.params.id);
      return res.render('cases/update-status.njk', {
        pageTitle: `Update status – Case ${legalCase.caseNumber}`,
        currentPage: 'cases',
        breadcrumbs: [
          { text: 'Dashboard', href: '/' },
          { text: 'Cases', href: '/cases' },
          { text: legalCase.caseNumber, href: `/cases/${legalCase.id}` },
          { text: 'Update status' }
        ],
        case: legalCase,
        errors: [{ text: 'Select a status', href: '#status' }],
        caseStatuses: CASE_STATUSES
      });
    } catch (err) {
      return next(err);
    }
  }

  try {
    await caseService.updateCaseStatus(req.params.id, status);
    res.redirect(`/cases/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const legalCase = await caseService.getCase(req.params.id);
    res.render('cases/detail.njk', {
      pageTitle: `Case ${legalCase.caseNumber}`,
      currentPage: 'cases',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Cases', href: '/cases' },
        { text: legalCase.caseNumber }
      ],
      case: legalCase
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).render('error.njk', {
        pageTitle: 'Case not found',
        statusCode: 404,
        message: 'The case you are looking for does not exist.'
      });
    }
    next(err);
  }
});

module.exports = router;
