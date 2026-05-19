require('dotenv').config();
const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const indexRouter = require('./routes/index');
const clientsRouter = require('./routes/clients');
const casesRouter = require('./routes/cases');

const app = express();
const PORT = process.env.PORT || 3000;

const env = nunjucks.configure(
  [
    path.join(__dirname, 'views'),
    path.join(__dirname, 'node_modules/govuk-frontend/dist')
  ],
  {
    autoescape: true,
    express: app,
    watch: process.env.NODE_ENV !== 'production'
  }
);

// Custom filters for display formatting
env.addFilter('statusTagClass', (status) => {
  const classes = {
    OPEN: 'govuk-tag--green',
    IN_PROGRESS: 'govuk-tag--blue',
    CLOSED: 'govuk-tag--grey',
    DISMISSED: 'govuk-tag--red'
  };
  return classes[status] || '';
});

env.addFilter('formatStatus', (status) => {
  const labels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In progress',
    CLOSED: 'Closed',
    DISMISSED: 'Dismissed'
  };
  return labels[status] || status;
});

env.addFilter('formatCaseType', (type) => {
  const labels = {
    CRIMINAL: 'Criminal',
    CIVIL: 'Civil',
    FAMILY: 'Family',
    CORPORATE: 'Corporate',
    EMPLOYMENT: 'Employment'
  };
  return labels[type] || type;
});

env.addFilter('formatDate', (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
});

app.set('view engine', 'njk');

// Serve GOV.UK Frontend static assets
app.use('/govuk-frontend', express.static(
  path.join(__dirname, 'node_modules/govuk-frontend/dist')
));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make assetPath available to all templates
app.locals.assetPath = '/govuk-frontend/govuk/assets';

app.use('/', indexRouter);
app.use('/clients', clientsRouter);
app.use('/cases', casesRouter);

app.use((req, res) => {
  res.status(404).render('error.njk', {
    pageTitle: 'Page not found',
    statusCode: 404,
    message: 'If you typed the web address, check it is correct.'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error.njk', {
    pageTitle: 'Sorry, there is a problem with the service',
    statusCode: 500,
    message: 'Try again later.'
  });
});

app.listen(PORT, () => {
  console.log(`Legal Cases Frontend running on http://localhost:${PORT}`);
});

module.exports = app;
