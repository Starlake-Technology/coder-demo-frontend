# Legal Cases Frontend

A GOV.UK Frontend web application for managing legal cases and clients. Built with Node.js, Express and Nunjucks, it connects to the [Legal Cases API](../demo-api/README.md).

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- The [Legal Cases API](../demo-api/README.md) running and accessible

## Getting started

### 1. Install dependencies

```bash
cd demo-frontend
npm install
```

### 2. Configure environment

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

| Variable        | Default                   | Description                      |
|-----------------|---------------------------|----------------------------------|
| `API_BASE_URL`  | `http://localhost:8080`   | Base URL of the Legal Cases API  |
| `PORT`          | `3000`                    | Port to run the frontend server  |
| `NODE_ENV`      | `development`             | Node environment                 |

### 3. Start the application

**Development** (with auto-reload on file changes):

```bash
npm run dev
```

**Production:**

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Pages

| Page                  | URL                          | Description                                 |
|-----------------------|------------------------------|---------------------------------------------|
| Dashboard             | `/`                          | Overview of clients and cases by status     |
| Clients list          | `/clients`                   | All clients with optional last name search  |
| Add client            | `/clients/new`               | Form to create a new client                 |
| Client detail         | `/clients/:id`               | Client information and their cases          |
| Cases list            | `/cases`                     | All cases with optional status/type filters |
| Add case              | `/cases/new`                 | Form to create a new case                   |
| Case detail           | `/cases/:id`                 | Full case details                           |
| Update case status    | `/cases/:id/status`          | Form to update a case's status              |

## Project structure

```
demo-frontend/
├── app.js                  # Express application entry point
├── package.json
├── .env                    # Local environment config (not committed)
├── .env.example            # Environment variable template
├── routes/
│   ├── index.js            # Dashboard route
│   ├── clients.js          # Client CRUD routes
│   └── cases.js            # Case CRUD routes
├── services/
│   ├── apiClient.js        # Configured Axios instance
│   ├── clientService.js    # Client API calls
│   └── caseService.js      # Case API calls
└── views/
    ├── layout.njk          # Base GOV.UK template
    ├── index.njk           # Dashboard
    ├── error.njk           # Error page
    ├── clients/
    │   ├── list.njk        # Clients list
    │   ├── detail.njk      # Client detail
    │   └── new.njk         # Add client form
    └── cases/
        ├── list.njk        # Cases list
        ├── detail.njk      # Case detail
        ├── new.njk         # Add case form
        └── update-status.njk  # Update case status
```

## Technology stack

| Technology        | Purpose                          |
|-------------------|----------------------------------|
| Node.js           | JavaScript runtime               |
| Express           | Web framework                    |
| Nunjucks          | Templating engine                |
| GOV.UK Frontend   | Design system and UI components  |
| Axios             | HTTP client for API calls        |
| dotenv            | Environment variable loading     |
| nodemon           | Dev server with auto-reload      |
