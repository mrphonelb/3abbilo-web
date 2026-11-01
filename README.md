# 3ABBILO — Dealer and Shop Digital Services

This repository contains the customer-facing 3ABBILO web application.

## Local development

1. Install dependencies: `npm install`
2. Create a local `.env` file based on `.env.example`.
3. Set `VITE_API_BASE_URL` to the wholesale API's public base URL.
4. Start development: `npm run dev`
5. Generate a production build: `npm run build`

## White-label presentation

Customer-facing navigation, messages, branch labels, and service receipts must use 3ABBILO branding. Internal accounting mappings, supplier APIs, credentials, and reconciliation logic belong exclusively in the backend and must not be bundled into the browser application.

The wholesale API applies customer-response filtering to hide internal accounting identifiers and internal integration names. This does **not** change the seller identity required on legal invoices or third-party receipts; review those documents and any linked supplier-hosted pages separately before launch.

Always test login, dealer shop creation, branch accounts, wallet balances, product purchases, order status and result popups in staging before deploying publicly.
