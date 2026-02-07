# SubsManager

A subscription management platform built with React.js and Tailwind CSS.

## Features

- **Admin Portal**: Full access to manage products, plans, subscriptions, and invoices
- **Internal Portal**: View and manage subscriptions and invoices  
- **Customer Portal**: Self-service for customers to view their subscriptions, pay invoices, and manage profile

## Role-Based Access

- **Admin**: `/admin/*` - Complete control over all entities
- **Internal**: `/internal/*` - Read/update access to subscriptions and invoices
- **Customer**: `/portal/*` - View own subscriptions, pay invoices, manage profile

## Tech Stack

- React.js with functional components and hooks
- React Router v6 for navigation
- Tailwind CSS for styling
- Radix UI for accessible components
- Lucide React for icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── data/           # Mock data and constants
├── lib/            # Utility functions
├── pages/          # Page components
│   ├── admin/      # Admin portal pages
│   ├── internal/   # Internal portal pages
│   └── portal/     # Customer portal pages
├── routes/         # Route configuration
└── styles/         # Global styles and theme
```

## Demo Credentials

- **Admin**: admin@example.com / password
- **Internal**: internal@example.com / password
- **Customer**: customer@example.com / password
