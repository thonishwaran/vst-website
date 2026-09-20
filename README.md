# VST Tech Solutions 2.0

A redesigned, premium digital-engineering website plus a production-oriented Node/Express + MySQL backend scaffold.

## Frontend
Open `frontend/index.html` directly for the static preview. For GitHub Pages, publish the `frontend/` folder contents.

## Backend
1. Create MySQL database.
2. Run `database/schema.sql` then `database/seed.sql`.
3. Copy `backend/.env.example` to `backend/.env` and set credentials.
4. `cd backend && npm install && npm start`.
5. Replace `https://YOUR-BACKEND` in `frontend/js/main.js` with your deployed API URL.

## Security
Do not commit `.env`, database credentials, production client data, or passwords. Add authentication before exposing admin endpoints.
