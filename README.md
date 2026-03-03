# Shoppin - Dynamic Shopping Website

Modern light-theme shopping website with:

- Multi-page React frontend
- Smooth navigation and animated scroll sections
- Modern cards and soft shadow effects
- Loading interface and route transitions
- Demo payment gateway integration (DemoPay)
- Local SQLite database to store products, orders, and payment records

## Tech Stack

- Frontend: React + Vite + Tailwind CSS + Framer Motion
- Backend: Node.js + Express
- Database: SQLite (`backend/shopping.db`)

## Run the project

From workspace root:

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Useful commands

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run start
```

## Data storage

Shopping data is stored locally in:

- `backend/shopping.db`

You can view saved orders on the **Orders** page in the app.
