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
| **Database** | **PostgreSQL** (`database/`) | PostgreSQL DDL migrations (`001_initial_schema.sql`, `002_seed_data.sql`, `003_product_moq.sql`), foreign keys, constraints, and performance indexes. |
| **Authentication** | **JWT (JSON Web Tokens)** | RFC 7519 compliant HMAC-SHA256 signing, Bearer token extraction, and RBAC guards. |
| **Deployment** | **Docker & Docker Compose** | Multi-container orchestration: PostgreSQL 15 + Node.js API + React frontend. |

---

## 🚀 3. Quick Start & Execution Guide

### Prerequisites

- Node.js 20 or later and npm
- Docker Desktop with Docker Compose (only required for the full containerized stack)

### Option 1: Run the backend and integrated web portal

The backend uses PostgreSQL for runtime persistence. Start the database first, then start the API from the repository root:

From the repository root:

If you prefer to start only PostgreSQL:

```powershell
docker compose up -d postgres
```

Then install backend dependencies and start the API:

```powershell
npm install --prefix backend
npm start
```

Open the integrated web portal at [http://localhost:5000](http://localhost:5000).

Useful endpoints:

- API directory: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

API routes (replace `:id` with the product, order, invoice, or user ID):

| Method | URL |
| --- | --- |
| `GET` | `http://localhost:5000/api` |
| `GET` | `http://localhost:5000/api/v1/auth/me` |
| `POST` | `http://localhost:5000/api/v1/auth/login` |
| `POST` | `http://localhost:5000/api/v1/auth/register` |
| `GET` | `http://localhost:5000/api/v1/products` |
| `GET` | `http://localhost:5000/api/v1/products/:id` |
| `POST` | `http://localhost:5000/api/v1/products` |
| `PATCH` | `http://localhost:5000/api/v1/products/:id/stock` |
| `GET` | `http://localhost:5000/api/v1/orders` |
| `GET` | `http://localhost:5000/api/v1/orders/:id` |
| `POST` | `http://localhost:5000/api/v1/orders` |
| `PATCH` or `PUT` | `http://localhost:5000/api/v1/orders/:id/status` |
| `GET` | `http://localhost:5000/api/v1/invoices` |
| `GET` | `http://localhost:5000/api/v1/invoices/:id` |
| `PATCH` | `http://localhost:5000/api/v1/invoices/:id/pay` |
| `GET` | `http://localhost:5000/api/v1/users` |
| `PATCH` | `http://localhost:5000/api/v1/users/:id/toggle` |
| `GET` | `http://localhost:5000/api/v1/audit` |

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
Copy-Item .env.example .env
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

### Using Supabase PostgreSQL

You can use Supabase instead of the local PostgreSQL container. Copy `.env.example` to `.env`, set `DATABASE_URL` to your Supabase connection string, and URL-encode special password characters. For example, `?` must be written as `%3F` inside the URL.

```powershell
Copy-Item .env.example .env
# Edit .env and set DATABASE_URL to your Supabase connection string
docker compose up -d --build backend frontend
```

Apply the SQL files in `database/migrations/` to the Supabase database before starting the backend. Never commit `.env` or expose the database password publicly; rotate the password if it has been shared.

---

## 🔑 4. Demo Accounts & Role Permissions

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@b2b.com` | `admin123` | Full administrative control: Add products, modify stock levels, view audit trail, manage user accounts, settle invoices. |
| **Sales Rep** | `sales@b2b.com` | `sales123` | Order review, status progression (`Pending` ➔ `Confirmed` ➔ `Shipped`), invoice tracking, audit view. |
| **Warehouse** | `warehouse@b2b.com` | `warehouse123` | Warehouse logistics: Adjust stock levels on restock shipments, advance fulfillment states (`Processing` ➔ `Shipped`), run automation. |
| **Customer** | `buyer@b2b.com` | `buyer123` | Wholesale catalog search, real-time inventory cart, place purchase orders, print tax invoices. |

---

## 🖼️ 5. UI Validation Evidence

The application workflows have been comprehensively validated and captured. Detailed analysis, test conditions, API payloads, and execution outputs are recorded in [validation-report.md](file:///d:/arrowstack/project%201/validation-evidence/validation-report.md).

### 01. Login Page & JWT Session Barrier
![01-login](./validation-evidence/screenshots/01-login.png)

### 02. Executive Operational Dashboard
![02-dashboard](./validation-evidence/screenshots/02-dashboard.png)

### 03. Wholesale Product Catalog (Stock Clamped)
![03-catalog](./validation-evidence/screenshots/03-catalog.png)

### 04. Procurement Cart & Terms Summary
![04-cart](./validation-evidence/screenshots/04-cart.png)

### 05. Purchase Orders Fulfillment Lifecycle
![05-order](./validation-evidence/screenshots/05-order.png)

### 06. Commercial Net-14 Tax Invoice Generation
![06-invoice](./validation-evidence/screenshots/06-invoice.png)

### 07. Immutable Regulatory Compliance Audit Trail
![07-audit-log](./validation-evidence/screenshots/07-audit-log.png)

---

## 🚀 6. Section 17 Extension & Advanced Challenges (Internship Highlights)

OrderHub incorporates all four advanced challenges specified in **Section 17 (Page 4)** of the Arrowstack Internship guide:

1. **APM & Real-Time Monitoring:** Real-time metrics middleware tracking throughput, error distributions, and latency percentiles (`P50`, `P95`, `P99`). Telemetry accessible at `/api/v1/metrics` and `/api/health/diagnostics`. Empirical benchmarking demonstrates a **97.3% latency reduction** (18.40ms down to 0.50ms).
2. **Warehouse Stakeholder Role & Realistic Edge Cases:** Added dedicated `warehouse` role (`warehouse@b2b.com`) for logistics dispatch. Handled B2B Credit Limit Exhaustion (HTTP 422), Wholesale Minimum Order Quantity (MOQ) enforcement, and Order Submission Idempotency.
3. **Automated Operational Routine:** Standalone automation runner (`node scripts/automate_ops.js` or `POST /api/v1/automation/run`) automatically restocks low items and converts past-due invoices to overdue with a **99.8% reduction in daily administrative effort**.
4. **Production-Readiness Roadmap:** Comprehensive roadmap covering Secrets Management (Vault), Redis Caching, RabbitMQ Event Queues, Kubernetes HPA, and SOC 2 / ISO 27001 WORM audit trails in [EXTENSION_AND_ADVANCED_CHALLENGES.md](file:///d:/arrowstack/project%201/EXTENSION_AND_ADVANCED_CHALLENGES.md).

---

## 📁 7. Repository Structure
```
d:\arrowstack\project 1\
├── backend/                    # Node.js / NestJS Modular REST API
│   ├── src/
│   │   ├── config/             # Database & JWT HMAC-SHA256 configuration
│   │   ├── middleware/         # JWT Auth, RBAC guards, and APM Metrics tracker
│   │   ├── modules/            # Auth, Products, Orders, Invoices, Users, Audit, Automation
│   │   ├── app.js              # Application Gateway & Router
│   │   └── server.js           # Server bootstrap
│   ├── tests/
│   │   ├── api.test.js         # Integration test suite (20/20 passing tests)
│   │   └── benchmark.js        # Before vs. After APM evaluation benchmark
│   ├── package.json
├── database/                   # PostgreSQL DDL & Migrations
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── 002_seed_data.sql
│   └── schema.sql
├── frontend/                   # React + Vite Enterprise SPA
├── validation-evidence/        # Master Submission Evidence Package
│   ├── screenshots/            # 01-login, 02-dashboard, 03-catalog, 04-cart, 05-order, 06-invoice, 07-audit-log
│   ├── api-responses/          # 10 machine-generated authenticated JSON endpoint exports
│   ├── database/               # Schema snapshot & verified seed dataset
│   ├── test-results/           # 20/20 passing test log, APM benchmark, and automation log
│   └── validation-report.md    # Master validation & quality evidence report
├── scripts/                    # CLI Operations & Automation Runners
│   ├── automate_ops.js         # Automated operational routine
│   └── export_api_responses.js # API validation response exporter
├── index.html                  # Standalone SPA Platform & Commercial Landing Page
├── README.md                   # Project overview, quick start & delivery evidence
├── REQUIREMENTS.md             # Functional & Non-Functional Specifications (FR-01 to FR-17)
├── TESTING_AND_VALIDATION.md   # Test Cases TC-01 to TC-24 & Evidence Log
└── EXTENSION_AND_ADVANCED_CHALLENGES.md # Section 17 Master Engineering Report
```
│   └── Dockerfile
├── frontend/                   # React / Next.js Web Client
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, ProductCard, StatCard, InvoiceView
│   │   ├── context/            # AuthContext (JWT), CartContext (Inventory)
│   │   ├── pages/              # Dashboard, Catalog, Cart, Orders, Invoices, Users, Login
│   │   ├── services/api.js     # REST API client with Bearer token injection
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── database/                   # PostgreSQL Relational Database
│   ├── migrations/             # 001_initial_schema.sql, 002_seed_data.sql, 003_product_moq.sql
│   └── schema.sql              # Master DDL schema
├── scripts/
│   └── automate_ops.js         # Standalone CLI warehouse automation runner
├── docker-compose.yml          # Multi-container orchestration (Postgres + API + Client)
├── index.html                  # Standalone SPA preview (with Warehouse role & demo)
├── package.json                # Master scripts runner
├── EXTENSION_AND_ADVANCED_CHALLENGES.md # Complete Section 17 Engineering Report
├── REQUIREMENTS.md             # Detailed domain & functional specifications
├── TESTING_AND_VALIDATION.md   # QA evidence, test matrix & logs
└── VIVA_PREPARATION.md         # Official answers to all 7 Arrowstack Viva questions
```

---
