# YieldBondCal

Monorepo with separate backend and frontend applications.

## Project Structure

- `backend/` - NestJS API for bond yield calculations
- `frontend/` - React UI

## Quick Start

### Backend

```bash
cd backend
npm install
npm run serve
```

Backend runs on `http://localhost:8000` (based on backend config).

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`.

## Notes

- Main API endpoint: `POST /bond/calculate`
- Keep backend and frontend running in separate terminals.
