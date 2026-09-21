# 3ABBILO Frontend
Modern React/Vite frontend foundation for 3abbilo.com.

## Local
npm install
npm run dev

## Build
npm run build

## Render Static Site
Build command: npm install && npm run build
Publish directory: dist

Set environment variable:
VITE_API_BASE_URL=https://api.3abbilo.com

## v4 changes
- Private portal: `/` is the sign-in page.
- Sign in uses **email + password** and sends `{ email, password }` to the wholesale auth API.
- Light login and light Dealer/Shop dashboard theme.
- Dealer and Shop profit screens remain included.
