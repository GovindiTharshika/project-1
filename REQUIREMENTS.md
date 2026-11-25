# OrderHub B2B Order Management Platform

## Requirements, Architecture, Acceptance Criteria, and Delivery Plan

**Project:** Arrowstack Full Stack Development Internship — Project 1
**Document status:** Project specification and implementation guide
**Version:** 1.0
**Last reviewed:** 25 November 2026
**Primary implementation:** Node.js REST API, React web client, PostgreSQL, Docker Compose

---

## 1. Purpose and product summary

OrderHub is a web application for a wholesale distributor. It supports a customer company buying products in bulk, operations staff handling order fulfillment, warehouse staff maintaining stock, and administrators managing accounts and financial records. The application brings catalog, inventory, purchasing, fulfillment, invoicing, and activity history into one workflow.

This document defines the intended users, project boundaries, requirements, measurable success criteria, system design, implementation workflow, acceptance criteria, validation evidence, limitations, and delivery checklist. It is the reference for implementation and review. Where implementation and this document differ, record the difference as a decision or limitation and update the relevant artifacts.

## 2. Target users and stakeholders

| User / stakeholder | Primary needs | Responsibilities in the system |
|---|---|---|
| Wholesale buyer (customer) | Find products, place accurate bulk orders, see order progress, retrieve invoices | Browse catalog, maintain cart, submit purchase orders, review own orders and invoices |
| Sales representative | Review submitted orders and communicate fulfillment progress | View customer orders and progress permitted order states |
| Warehouse operator | Keep inventory accurate and fulfill approved orders | Record stock adjustments and advance permitted fulfillment states |
| Platform administrator | Maintain access, catalog and financial integrity; investigate activity | Manage users and products, settle invoices, inspect audit records, run supported operations |
| Distributor operations lead / product owner | Reduce manual work and errors while retaining control | Set policy, approve workflow, review operational metrics and acceptance evidence |
| Developer / reviewer | Build and maintain a traceable system | Implement, validate, document decisions, and maintain deployment configuration |

Access must be authorized by the server according to a user's role and account status. Hiding an interface control is not an authorization boundary.

## 3. Goals, scope, and boundaries

### 3.1 Project goals

1. Provide an end-to-end wholesale order workflow from catalog browsing to order, fulfillment, and invoice review.
2. Prevent invalid orders through server-side stock, minimum-order-quantity (MOQ), and customer credit checks.
3. Maintain traceable records for important business state changes.
4. Provide a repeatable local development and review workflow, with PostgreSQL and a containerized deployment option.
5. Demonstrate full-stack design, implementation, and validation in a clearly organized, version-controlled repository.

### 3.2 Included in scope

- Role-based sign-in and registration, account status checks, and protected API routes.
- Product catalog, product details, stock levels, low-stock thresholds, and MOQ.
- Cart and order submission with server-side price, stock, MOQ, and credit validation.
- Order identifiers, inventory deduction, tax calculation, and linked Net-14 invoices.
- Order status and invoice status workflows, with role-based permissions.
- User administration, inventory adjustment, audit history, and printable invoice view.
- Operational automation endpoints for supported restock and overdue-invoice tasks.
- API health and performance diagnostics where implemented.
- Responsive web interface, local setup instructions, schema/migrations, and automated API validation.

### 3.3 Out of scope for this project

- Live card/bank payment collection, payment gateway reconciliation, or real money movement.
- Production-grade multi-warehouse allocation, shipping carrier integrations, and returns/refunds.
- Jurisdiction-specific tax advice or configurable tax compliance across countries.
- Enterprise identity federation, formal regulatory certification, or a production security audit.
- Guaranteed high availability, disaster recovery, and production service-level commitments.
- Claims of measured business savings until supported by a baseline and a measured pilot.

## 4. Inputs, outputs, assumptions, and constraints

### 4.1 Inputs

- User credentials and company affiliation.
- Product identifiers, quantities, and customer order notes.
- Product attributes, unit prices, stock counts, restock thresholds, and MOQ values.
- Account credit limit and outstanding invoice balances.
- Authorized order, inventory, user, and invoice status changes.
- Environment configuration such as database URL, JWT secret, and API port.

All client-supplied prices, totals, roles, and account identifiers are untrusted. The server derives or validates these values from authorized records.

### 4.2 Outputs

- Authenticated session/token and role-appropriate application views.
- Catalog data and inventory status indicators.
- Accepted orders, order status, order totals, and inventory changes.
- Linked invoices with issue date, due date, amount, and payment status.
- Validation and authorization errors with useful HTTP status codes and messages.
- Audit events, operational notifications/automation results, health information, and metrics.

### 4.3 Assumptions and constraints

- The initial business model is one distributor with customer companies and a shared catalog/stock pool.
- Net-14 means the invoice due date is fourteen calendar days after issue; final business policy should confirm date and holiday handling.
- Tax is a configurable business rule; current demo behavior uses 10% and must not be represented as universally correct tax treatment.
- The repository currently contains a Node.js modular API, React/Vite client, PostgreSQL schema/migrations, and Docker assets. It is not a NestJS backend or a Next.js frontend.
- Local development and demo credentials are for non-production use. Secrets and real customer data must not be committed.

## 5. Success measures

The following are acceptance targets or pilot measures, not verified business outcomes. Establish a baseline and record sample size, period, and measurement method before claiming improvement.

| Measure | Target / definition | How to verify |
|---|---|---|
| Order validation correctness | All submitted orders are checked against current stock, MOQ, credit limit, and account status on the server | Automated API cases for accepted and rejected boundary values |
| Duplicate submission safety | A repeated request with the same idempotency key and payload creates at most one order and one invoice | Retry test; verify order, invoice, and stock deltas |
| Role enforcement | Every protected operation rejects unauthorized roles, including direct API requests | Positive and negative RBAC integration cases for each route |
| Traceability | Every supported state-changing action records actor, action, entity, and timestamp | Inspect audit records after representative operations |
| Order processing time | Sales confirmation target: within one business day of submission | Pilot timestamps; report median and 90th percentile |
| Order entry error rate | Establish baseline, then target 70% fewer errors after a representative pilot | Compare documented baseline with post-launch order corrections; define error consistently |
| Invoice creation lag | Invoice is persisted with its order in the same successful order operation | Integration check and database relationship inspection |
| API latency | Target p95 below 100 ms for standard read endpoints under a declared local benchmark load | Benchmark report with environment, sample count, and route; do not infer production capacity |
| Responsive usability | Core workflows usable at supported desktop, tablet, and mobile viewport widths | Manual viewport review and documented screenshots/findings |

## 6. Functional requirements

Priorities: **Must** = required for acceptance; **Should** = expected if supported by current project scope; **Could** = useful follow-on.

| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Users can register/sign in with credentials; passwords are stored as secure hashes and sessions are validated server-side. | Must |
| FR-02 | The API enforces role and active-account permissions on every protected operation. | Must |
| FR-03 | Authorized users can browse/search products with SKU, name, category, unit price, available stock, and MOQ. | Must |
| FR-04 | Product inventory is non-negative; catalog status distinguishes in-stock, low-stock, and out-of-stock using configured thresholds. | Must |
| FR-05 | Buyers can create and edit a cart; quantity must be a positive integer and satisfy product MOQ and stock availability at submission. | Must |
| FR-06 | The server calculates order line totals, subtotal, tax, and grand total from canonical product prices and configured tax policy. | Must |
| FR-07 | The order operation validates customer status, stock, MOQ, and credit exposure, then creates one order and invoice and deducts stock consistently. | Must |
| FR-08 | Order creation supports an idempotency key so network retries cannot create duplicate orders or double-deduct inventory. | Must |
| FR-09 | Orders have unique identifiers, customer ownership, line-item snapshots, totals, timestamps, and a controlled status lifecycle. | Must |
| FR-10 | Buyers can view only their company's permitted orders and invoices; authorized operations roles can view operational records. | Must |
| FR-11 | Successful order placement creates a linked invoice with issue date, due date, amount, and status. Default terms are Net-14. | Must |
| FR-12 | Invoice views provide readable line details and a print-friendly layout. | Should |
| FR-13 | Authorized administrators can mark eligible unpaid invoices as paid; the change is auditable. | Must |
| FR-14 | Authorized administrators can manage user account status and product catalog records. | Must |
| FR-15 | Authorized warehouse/operations roles can adjust stock; adjustments are validated and auditable. | Must |
| FR-16 | Authorized roles can advance orders through permitted fulfillment states; invalid transitions are rejected. | Must |
| FR-17 | The system records actor, action, entity, timestamp, and relevant outcome for sensitive state changes. | Must |
| FR-18 | The system identifies overdue invoices and low-stock items; supported notifications/automation should surface these conditions. | Should |
| FR-19 | Operations can invoke supported automation for low-stock restock recommendations, overdue escalation, and reconciliation. | Should |
| FR-20 | Health and metrics endpoints report the implemented operational signals without exposing secrets or personal data. | Should |
| FR-21 | Validation failures return consistent client errors; malformed JSON and unexpected server/database failures do not expose stack traces or secrets. | Must |

## 7. Business rules and edge-case behavior

| Condition | Required behavior |
|---|---|
| Quantity is missing, non-numeric, fractional, zero, or negative | Reject the request with a client validation error; do not change stock, order, invoice, or audit state except an optional safe rejection event. |
| Requested quantity exceeds available stock | Reject the entire order; report the unavailable item/quantity where safe; do not partially deduct stock. |
| Stock is zero | Mark the item out of stock and prevent order submission for it. |
| Quantity is below MOQ or not a valid MOQ multiple (if the product defines increments) | Reject the order and explain the applicable MOQ rule. The product model must state whether MOQ is a minimum only or a pack multiple. |
| Customer account is inactive | Deny order submission and other restricted operations. |
| Outstanding exposure plus new order exceeds credit limit | Reject order; calculate exposure on the server and state the limit condition without leaking another customer's data. |
| Same idempotency key is retried with same payload | Return the original result; do not create another order/invoice or deduct more stock. |
| Same idempotency key is reused with a different payload | Reject as a conflict; do not return a misleading cached response. |
| Concurrent requests compete for the last units | Only orders that can be committed against current inventory may succeed; use database transactions/locking or an equivalent atomic strategy. |
| Order status skips a required state or is terminal | Reject the transition unless an explicitly documented role/policy permits it. Cancellation/restock policy must be explicit before implementation. |
| Invoice is already paid or cannot be settled | Reject duplicate/ineligible settlement; preserve a single payment state and audit the attempt as policy permits. |
| Product/user/order identifier does not exist | Return not found without mutating related records. |
| Database is unavailable or transaction fails | Return a safe service error and roll back related order, invoice, and stock changes. |
| Automation runs more than once | Operations must be safe to repeat; avoid duplicate restock actions/escalations using stable keys or state checks. |
| Date boundary/timezone or leap day | Store timestamps consistently (UTC); display using a documented timezone; due-date rule must be deterministic. |

## 8. Non-functional requirements

- **Security:** Hash passwords with a recognized password hashing library; keep signing secrets outside source control; use least privilege and server-side RBAC; validate and constrain all input; avoid logging credentials, tokens, or payment secrets.
- **Integrity:** Use database constraints for required relationships, unique identifiers, non-negative values, and valid enumerations. Use transactions for order/invoice/stock changes.
- **Reliability:** Errors must leave related records in a consistent state. Database-backed operation is the authoritative persistence mode; any in-memory/demo mode must be clearly identified and must not imply durable storage.
- **Performance:** Establish a reproducible workload before assessing latency. Add indexes for observed access paths such as customer, status, SKU, and foreign keys.
- **Usability/accessibility:** Responsive layouts, clear validation feedback, keyboard-operable controls, readable contrast, and no reliance on color alone to convey status.
- **Maintainability:** Keep routing, authorization, business logic, persistence, and UI responsibilities organized. Use repeatable migrations and document configuration.
- **Observability:** Provide safe health/diagnostic information and record actionable errors without exposing sensitive values.
- **Portability:** A developer should be able to start the documented stack using supported Node.js/npm and Docker versions, with environment-specific settings supplied outside committed source.

## 9. Acceptance criteria

The project is ready for review when all applicable criteria below have recorded evidence.

1. A buyer can sign in, find an available product, submit a valid order, and see the resulting order and linked invoice.
2. Stock decreases exactly once after a successful order; failed orders cause no partial inventory change.
3. The order API rejects invalid quantities, MOQ violations, insufficient stock, inactive accounts, and credit-limit breaches.
4. Retrying an idempotent order request does not duplicate the order, invoice, or stock deduction; key reuse with a different payload is rejected.
5. Each role can perform only its authorized operations; direct API requests verify the boundary.
6. Permitted order transitions work, invalid transitions fail, and state changes appear in the audit history with actor and timestamp.
7. An authorized administrator can settle an eligible invoice; unauthorized or duplicate settlement is rejected.
8. Core screens render and remain operable at representative desktop and narrow mobile widths; invoice print styling is reviewed.
9. Database schema/migrations and startup instructions match the actual repository and configuration.
10. Validation results, environment, command, date, known failures, and limitations are retained in `TESTING_AND_VALIDATION.md` or an equivalent review artifact.

## 10. Architecture and data model

### 10.1 Current repository architecture

```text
React + Vite client (frontend/) ── HTTP/JSON ── Node.js REST API (backend/src/)
                                                   │
                                                   ├── Authentication / role middleware
                                                   ├── Product, order, invoice, user, audit modules
                                                   ├── Metrics and operational automation
                                                   └── PostgreSQL (schema and migrations)

Docker Compose coordinates the database, API, and web client for local stack use.
The root index.html is also an integrated/demo portal artifact and should be treated separately from the React client when validating behavior.
```

The implementation is modular Node.js, not NestJS. The frontend is React/Vite, not Next.js. PostgreSQL is the intended persistent store. Review any fallback/demo persistence separately and document its durability limits.

### 10.2 Core entities and relationships

| Entity | Important fields / rules | Relationships |
|---|---|---|
| User | id, email (unique), password hash, role, active status, company/customer reference, credit limit | One customer/company can own many orders and invoices; actions appear in audit events |
| Product | id, SKU (unique), name, category, unit price, stock quantity, low-stock threshold, MOQ, active status | Appears in order line snapshots; stock adjustments are auditable |
| Order | id/public order number, customer, status, subtotal/tax/total, currency, created time, idempotency key | Belongs to a customer; has one or more lines and a linked invoice |
| Order line | order, product reference, SKU/name/price snapshot, quantity, line total | Belongs to one order; preserves the price and description used at purchase time |
| Invoice | id/public invoice number, order, customer, amount, issue/due dates, status, settlement metadata | Linked to one order and customer; settlement is auditable |
| Audit event | actor, action, entity type/id, timestamp, safe details/outcome | Append-oriented record of sensitive actions |
| Idempotency record | key, authenticated customer/context, request fingerprint, response/result, expiry policy | Ensures one order operation per key and matching request |

Database constraints and the implemented schema are authoritative. This conceptual model does not assert that every field/table is already present; reconcile it with `database/schema.sql` and migrations during implementation review.

### 10.3 Order transaction boundary

The order workflow should run as one database transaction: validate current account and product state; reserve/decrement all required stock atomically; calculate totals from server-owned values; enforce credit exposure; insert order and immutable line snapshots; insert linked invoice; persist idempotency result and audit event; commit. Any failure rolls back all transactional changes. Concurrency and key uniqueness must be enforced at the persistence layer, not only in the UI.

## 11. Repeatable implementation and review workflow

Use the following cycle for each requirement group: **Plan → Change → Validate → Record → Review**.

1. **Research and define:** Confirm target user, problem, stakeholders, assumptions, inputs, outputs, scope boundaries, dependencies, and measurable success criteria. Record unresolved policy questions as assumptions or risks.
2. **Specify:** Update this requirements document with requirement IDs and acceptance criteria. Link each requirement to implementation files and validation cases as work progresses.
3. **Design:** Inspect the existing repository; agree on API boundaries, role rules, entity relationships, state transitions, failure semantics, and data migration approach before changing behavior.
4. **Implement in small increments:** Keep each change focused. Prefer server-side validation and transactional business rules. Update UI, API, schema/migrations, and documentation together where applicable.
5. **Validate:** Run the relevant automated suite and representative negative/boundary cases. Review UI manually at supported sizes. Capture command, environment, date, result, and any deviations in the validation artifact.
6. **Review and deliver:** Check access control, data integrity, migration safety, error handling, documentation, and repository status. Update the decision log and delivery checklist; report limitations honestly.

### 11.1 Traceability

Use IDs in commit/PR notes, test names, and review notes where practical. Maintain a compact mapping in `TESTING_AND_VALIDATION.md`:

| Requirement | Implementation | Acceptance / test evidence | Status |
|---|---|---|---|
| FR-07, FR-08 | Order service and persistence layer | Order transaction, stock boundary, retry, conflict cases | To verify / link evidence |
| FR-02 | Auth and role middleware | Positive and negative role checks for protected routes | To verify / link evidence |
| FR-17 | Audit module and business services | Audit event inspection after each state change | To verify / link evidence |

Do not mark an item passed based only on a requirement description or an unexecuted test plan.

### 11.2 Decision log

Record material choices in `DECISIONS.md` (create it if the project needs a durable log) using this template:

| ID / date | Context | Decision | Alternatives considered | Consequence / follow-up |
|---|---|---|---|---|
| D-001 / YYYY-MM-DD | Business or technical question | Chosen approach and reason | Viable alternatives | Trade-off, owner, or review date |

Log changes to authentication, persistence, order atomicity, tax/credit policy, status transitions, and external integrations. Keep routine implementation details in commits rather than overloading the decision log.

## 12. Validation plan and evidence retention

Validation should cover unit/service behavior where present, API integration, authorization, database integrity, frontend usability, and deployment setup. At minimum, include these representative cases:

| Case | Input / action | Expected evidence |
|---|---|---|
| Valid order | Active customer, in-stock product, MOQ met, credit available | Success response; one order, one invoice, exact stock decrement |
| Quantity boundaries | Zero, negative, fraction, missing quantity; exactly MOQ; below MOQ | Invalid cases rejected without mutation; boundary behavior matches rule |
| Inventory boundary | Quantity equals stock; quantity exceeds stock; concurrent last-unit requests | Correct accept/reject behavior and no negative stock |
| Credit boundary | Exposure exactly at limit; exposure one smallest currency unit above | Policy-consistent result and no mutation on rejection |
| Idempotency | Same key/same payload retry; same key/different payload | Original response reused once; payload conflict rejected |
| RBAC and ownership | Each role accesses permitted and prohibited actions; customer requests another customer's record | Correct success/403/404 behavior and no data leakage |
| Workflow | Valid next state, skipped state, terminal state, unauthorized actor | Valid transition recorded; invalid/unauthorized transition rejected |
| Invoice | Net-14 boundary, overdue calculation, eligible/duplicate settlement | Correct due date/status and audit event |
| Failure handling | Database disconnect or transaction failure during order creation | Safe error response and no partial order/invoice/stock mutation |
| Interface | Desktop and mobile catalog, cart, orders, invoice print view | Review notes/screenshots and any accessibility issues retained |

Store actual execution evidence in `TESTING_AND_VALIDATION.md`: command or procedure, software/database versions, test date, pass/fail counts, relevant output or artifact location, and unresolved failures. Redact tokens, passwords, connection strings, and personal data. Separate manual observations from automated results. Benchmark claims require environment and workload details.

## 13. Risks and limitations

| Risk / limitation | Impact | Practical next step |
|---|---|---|
| Demo or fallback storage may not persist or coordinate concurrent writes | Lost updates or data loss outside a single process | Make PostgreSQL the sole authoritative mode for shared or production use; exercise transactions and constraints |
| Order and inventory correctness depends on transaction and locking behavior | Overselling under concurrent requests | Add PostgreSQL transaction/row-lock or atomic conditional-update coverage under concurrent load |
| Tax, credit, cancellation, and MOQ policies need business confirmation | Financial totals or inventory restoration may not match distributor policy | Obtain written policy decisions; make rates, currency, and lifecycle rules configurable where appropriate |
| Payment is simulated by invoice status change | No proof of funds or reconciliation | Integrate a payment provider with verified signed webhooks and idempotent reconciliation |
| Printable browser invoice is not a managed archival PDF | Layout/browser differences; no immutable issued artifact | Add server-side PDF generation and immutable invoice versioning if required |
| Audit records in the application database may be alterable by privileged operators | Limited evidentiary strength | Restrict database access, protect backups, and consider append-only external audit storage |
| Metrics and local benchmarks do not establish production capacity | Misleading performance expectations | Run load tests in a production-like environment with documented workload and resource limits |
| Demo credentials and sample data are public in documentation/source | Unsafe if reused in a deployed environment | Disable demo accounts, rotate secrets, and provision credentials securely for deployment |
| Localization, currency, tax jurisdiction, and timezone rules are limited | Incorrect interpretation for international customers | Define supported region/currency and implement locale-aware formatting and business calendars |
| Browser-only UI checks can miss accessibility and cross-browser defects | Some users/devices may have barriers | Add keyboard, screen reader, automated accessibility, and cross-browser review |

## 14. Recommended next improvements

1. Confirm and document tax, currency precision, MOQ increments, credit exposure, cancellation/restock, and date/timezone policies.
2. Verify all order creation paths use one PostgreSQL transaction with concurrency-safe stock handling and idempotency constraints.
3. Expand automated tests for malformed input, inactive users, ownership isolation, transaction rollback, idempotency conflicts, and concurrent orders.
4. Add structured request IDs and safe operational logs; define retention and backup/restore procedures.
5. Add CI checks for tests, frontend build, schema/migration validation, and dependency/security review.
6. Conduct accessibility and cross-browser reviews, then add payment integration and durable invoice PDFs only if required by the business.
7. Run a small operational pilot to establish baselines before publishing error reduction, processing-time, or administrative-effort improvements.

## 15. Delivery checklist

- [ ] Target users, stakeholders, scope, assumptions, and success measures agreed.
- [ ] Requirements and acceptance criteria reviewed against current code and schema.
- [ ] Architecture and data model documented; material decisions recorded.
- [ ] Server-side validation, RBAC, transactions, and edge cases implemented or explicitly listed as gaps.
- [ ] Schema/migrations and environment examples updated; secrets excluded from version control.
- [ ] Automated and manual validation executed; evidence retained with environment and date.
- [ ] Known limitations, risks, and next improvements documented.
- [ ] README setup commands and API documentation verified against the actual project.
- [ ] Final repository diff reviewed; no unintended files or sensitive values included.

## 16. Related project artifacts

- `README.md` — setup, commands, API overview, and demo guidance.
- `TESTING_AND_VALIDATION.md` — test strategy, cases, and recorded execution evidence.
- `EXTENSION_AND_ADVANCED_CHALLENGES.md` — optional extensions and advanced work.
- `VIVA_PREPARATION.md` — project presentation and review preparation.
- `database/schema.sql` and `database/migrations/` — relational structure and migration history.
- `backend/src/` — API modules, middleware, configuration, and service logic.
- `frontend/src/` — React client; root `index.html` is an additional integrated/demo artifact.

