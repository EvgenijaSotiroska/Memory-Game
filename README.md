# Memory Match 

A simple memory card game built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and a **Django REST API** backend for user authentication and score persistence.

## Prerequisites
- Node.js 18+ (includes npm). If you don't have it:
  - Download and install the LTS version from the official Node.js website.
- Python 3.10+ with Django and Django REST Framework
- SQLite
## Setup

### Backend (Django)

1. Navigate to your backend folder:
```bash
cd backend
```

2. Create a virtual environment and activate it:
```bash
python -m venv venv
```
```bash
-source venv/bin/activate  # Linux/Max
-venv\Scripts\activate     # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Apply migrations:
```bash
python manage.py migrate
```

5. Run the Django development server:
```bash
python manage.py runserver
```
By default, the backend will run at http://127.0.0.1:8000.

## Install
```bash
npm install
```

## Run dev server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Build for production
```bash
npm run build
npm start
```

## Gameplay
- All cards start face-down.
- Click two cards:
  - If they match, they stay face-up.
  - If not, they flip back down.
- Continue until all pairs are matched.
- Use the pairs selector to change difficulty; use Restart to reshuffle.

## Tech
- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Backend: Django, Django REST Framework, JWT Authentication
- Database: SQLite







