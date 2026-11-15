# 🏢 B2B Order Management Platform (OrderHub)
### Arrowstack 1-Month Full Stack Development Internship — Project 1

[![React/Next.js](https://img.shields.io/badge/React%20%2F%20Next.js-v18+-61DAFB.svg)](https://react.dev)
[![Node.js/NestJS](https://img.shields.io/badge/Node.js%20%2F%20NestJS-Modular%20Architecture-E0234E.svg)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-336791.svg)](https://www.postgresql.org)
[![JWT](https://img.shields.io/badge/JWT-RFC%207519%20HMAC--SHA256-000000.svg)](https://jwt.io)
[![Docker](https://img.shields.io/badge/Docker-Multi--Container-2496ED.svg)](https://www.docker.com)
[![Build Status](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen.svg)]()


---

## 📌 1. Project Scenario & Objective
This project delivers a multi-role **B2B Order Management Platform** for an enterprise wholesale distributor. The system coordinates operations across wholesale buyers, sales representatives, and warehouse administrators.

### Core Capabilities:
- **Role-Based Access Control (RBAC):** Customer / Buyer, Sales Representative, and Administrator roles with JWT session protection.
- **Real-Time Inventory & Stock Engine:** Live stock tracking, automated out-of-stock and low-stock indicators, and atomic stock deductions upon order placement.
- **Wholesale Procurement & Cart:** Real-time quantity clamping, tax calculations (10% VAT), and instant PO generation.
- **Automated Net-14 Invoicing:** Auto-generates printable tax invoices with line items, due dates, and settlement tracking.
- **Fulfillment Lifecycle Workflow:** Orders advance from `Pending` ➔ `Confirmed` ➔ `Processing` ➔ `Shipped` ➔ `Delivered` / `Cancelled`.
- **Immutable Audit Trail:** Comprehensive logs recording all authentication events, catalog changes, order submissions, and status transitions.

---

## 🛠️ 2. Technology Stack Mapping (Arrowstack Recommended Stack)

| Component | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | **React / Next.js Client** (`frontend/`) | React 18 component hierarchy, Context API state management (`AuthContext`, `CartContext`), responsive CSS design system. |
| **Backend** | **Node.js / NestJS Architecture** (`backend/`) | Modular architecture with Controllers, Services, DTO validation, and centralized Router Gateway. |
| **Database** | **PostgreSQL** (`database/`) | PostgreSQL DDL migrations (`001_initial_schema.sql`, `002_seed_data.sql`), foreign keys, constraints, and performance indexes. |
| **Authentication** | **JWT (JSON Web Tokens)** | RFC 7519 compliant HMAC-SHA256 signing, Bearer token extraction, and RBAC guards. |
| **Deployment** | **Docker & Docker Compose** | Multi-container orchestration: PostgreSQL 15 + Node.js API + React frontend. |

---

## 🚀 3. Quick Start & Execution Guide

### Prerequisites

- Node.js 20 or later and npm
- Docker Desktop with Docker Compose (only required for the full containerized stack)

### Option 1: Run the backend and integrated web portal

The backend uses an in-memory data store by default, so PostgreSQL is not required for a quick local run.

From the repository root:

```powershell
npm install --prefix backend
npm start
```

Open the integrated web portal at [http://localhost:5000](http://localhost:5000).

Useful endpoints:

- API directory: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

To stop the server, press `Ctrl+C`.

For automatic restart during development, use:

```powershell
npm run dev
```

### Option 2: Run the Vite React frontend separately

Use this option when developing the React client in `frontend/`:

```powershell
npm install --prefix frontend
npm run dev --prefix frontend
```

Vite will print the local URL, normally [http://localhost:5173](http://localhost:5173). Keep the backend running on port `5000`; the frontend API client is configured to use that server.

To create and preview a production frontend build:

```powershell
npm run build --prefix frontend
npm run preview --prefix frontend
```

### Option 3: Run the automated API test suite

The test suite starts its own server on port `5003` and validates the health check, JWT login, RBAC, products, orders, invoices, and audit endpoints:

```powershell
npm test
```

The equivalent direct command is:

```powershell
node backend/tests/api.test.js
```

### Option 4: Run the full Docker Compose stack

Docker Compose starts PostgreSQL, the backend API, and the Nginx-served React frontend:

```powershell
docker compose up --build
```

Open:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- PostgreSQL: `localhost:5432`, database `b2b_orderhub`, user `b2b_admin`

Run the stack in the background with `docker compose up --build -d`, and stop it with:

```powershell
docker compose down
```

The PostgreSQL data is stored in the Docker volume `pgdata`. To remove the volume as well, use `docker compose down -v`.

---

## 🔑 4. Demo Accounts & Role Permissions

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@b2b.com` | `admin123` | Full administrative control: Add products, modify stock levels, view audit trail, manage user accounts, settle invoices. |
| **Sales Rep** | `sales@b2b.com` | `sales123` | Order review, status progression (`Pending` ➔ `Confirmed` ➔ `Shipped`), invoice tracking, audit view. |
| **Customer** | `buyer@b2b.com` | `buyer123` | Wholesale catalog search, real-time inventory cart, place purchase orders, print tax invoices. |

---

## 📁 5. Repository Structure
```
d:\arrowstack\project 1\
├── backend/                    # Node.js / NestJS Modular REST API
│   ├── src/
│   │   ├── config/             # Database & JWT HMAC-SHA256 configuration
│   │   ├── middleware/         # JWT Auth & Role-Based Access Control guards
│   │   ├── modules/            # Auth, Products, Orders, Invoices, Users, Audit
│   │   ├── app.js              # Application Gateway & Router
│   │   └── server.js           # Server bootstrap
│   ├── tests/api.test.js       # Integration test suite (100% passing)
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # React / Next.js Web Client
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, ProductCard, StatCard, InvoiceView
│   │   ├── context/            # AuthContext (JWT), CartContext (Inventory)
│   │   ├── pages/              # Dashboard, Catalog, Cart, Orders, Invoices, Users
│   │   ├── services/api.js     # REST API client with Bearer token injection
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── database/                   # PostgreSQL Relational Database
│   ├── migrations/             # 001_initial_schema.sql, 002_seed_data.sql
│   └── schema.sql              # Master DDL schema
├── docker-compose.yml          # Multi-container orchestration (Postgres + API + Client)
├── index.html                  # Standalone SPA preview
├── package.json                # Master scripts runner
├── REQUIREMENTS.md             # Detailed domain & functional specifications
├── TESTING_AND_VALIDATION.md   # QA evidence, test matrix & logs
└── VIVA_PREPARATION.md         # Official answers to all 7 Arrowstack Viva questions
```

---
