
```text
for logging in use
email:Admin@example.com
password:Admin@123
┌──────────────┐
│   Frontend   │  (React)
│  react-web   │
└──────┬───────┘
       │ REST API
┌──────▼───────┐
│    Backend   │  (Node.js + Express)
│     API      │
└──────┬───────┘
       │
┌──────▼───────┐
│   PostgreSQL │
│    Database  │
└──────────────┘


(Background Worker)
- Handles scheduled lesson publishing

  --Local setup steps--
1️] Clone the Repository
run these commands in vscode terminal to clone the repo from github
git clone https://github.com/Satvika939/cms_project.git
cd cms_project

2️] Backend Setup
open new terminal and run these commands
cd backend
npm install
npm start

3]Frontend Setup
open new terminal and run these commands
cd ../frontend/react-web
npm install
npm start

Frontend will run on: http://localhost:3000
```text

