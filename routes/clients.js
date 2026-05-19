const express = require('express');
const router = express.Router();
const clientService = require('../services/clientService');
const caseService = require('../services/caseService');

router.get('/', async (req, res, next) => {
  try {
    const { lastName } = req.query;
    const clients = await clientService.getClients(lastName);
    res.render('clients/list.njk', {
      pageTitle: 'Clients',
      currentPage: 'clients',
      breadcrumbs: [{ text: 'Dashboard', href: '/' }, { text: 'Clients' }],
      clients,
      searchLastName: lastName || ''
    });
  } catch (err) {
    next(err);
  }
});

router.get('/new', (req, res) => {
  res.render('clients/new.njk', {
    pageTitle: 'Add new client',
    currentPage: 'clients',
    breadcrumbs: [
      { text: 'Dashboard', href: '/' },
      { text: 'Clients', href: '/clients' },
      { text: 'Add new client' }
    ],
    errors: [],
    formData: {}
  });
});

router.post('/', async (req, res, next) => {
  const { firstName, lastName, email, phone, address } = req.body;
  const formData = { firstName, lastName, email, phone, address };

  const errors = [];
  if (!firstName || !firstName.trim()) errors.push({ text: 'Enter a first name', href: '#firstName' });
  if (!lastName || !lastName.trim()) errors.push({ text: 'Enter a last name', href: '#lastName' });
  if (!email || !email.trim()) errors.push({ text: 'Enter an email address', href: '#email' });

  if (errors.length > 0) {
    return res.render('clients/new.njk', {
      pageTitle: 'Add new client',
      currentPage: 'clients',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Clients', href: '/clients' },
        { text: 'Add new client' }
      ],
      errors,
      formData
    });
  }

  try {
    const client = await clientService.createClient(
      { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), phone: phone?.trim() || null, address: address?.trim() || null }
    );
    res.redirect(`/clients/${client.id}`);
  } catch (err) {
    if (err.response && err.response.status === 409) {
      return res.render('clients/new.njk', {
        pageTitle: 'Add new client',
        currentPage: 'clients',
        breadcrumbs: [
          { text: 'Dashboard', href: '/' },
          { text: 'Clients', href: '/clients' },
          { text: 'Add new client' }
        ],
        errors: [{ text: 'A client with this email address already exists', href: '#email' }],
        formData
      });
    }
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const [client, allCases] = await Promise.all([
      clientService.getClient(req.params.id),
      caseService.getCases()
    ]);

    const fullName = `${client.firstName} ${client.lastName}`;
    const clientCases = allCases.filter(c => c.clientName === fullName);

    res.render('clients/detail.njk', {
      pageTitle: fullName,
      currentPage: 'clients',
      breadcrumbs: [
        { text: 'Dashboard', href: '/' },
        { text: 'Clients', href: '/clients' },
        { text: fullName }
      ],
      client,
      cases: clientCases
    });
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(404).render('error.njk', {
        pageTitle: 'Client not found',
        statusCode: 404,
        message: 'The client you are looking for does not exist.'
      });
    }
    next(err);
  }
});

module.exports = router;
