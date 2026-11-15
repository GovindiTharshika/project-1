# 📄 Requirements & Domain Specification
### Project 1: B2B Order Management Platform (Arrowstack Internship)

---

## 1. Executive Summary & Real-World Scenario
In a B2B wholesale distribution environment, transactions differ fundamentally from retail B2C e-commerce:
1. **Purchases occur in bulk volume**, requiring strict stock validation so orders do not exceed warehouse capacity.
2. **Payment terms rely on net-due invoicing** rather than immediate consumer credit card checkout.
3. **Multi-role operations are critical**: Buyers place purchase orders, Sales Representatives verify accounts and approve transitions, and Administrators manage stock, pricing, and system integrity.
4. **Audit trails are legally and operationally necessary** to resolve discrepancies in orders, pricing changes, or inventory adjustments.

---

## 2. Primary Stakeholders & User Personas

| Persona | Role | Key Goals & Responsibilities | Success Metrics |
| :--- | :--- | :--- | :--- |
| **Wholesale Buyer (Customer)** | B2B Client | Search catalog, order required office and electronics goods in volume, monitor fulfillment status, retrieve printable invoices for accounting. | Zero ordering errors; real-time visibility into order status. |
| **Sales Representative** | Operations / Sales | Monitor incoming customer orders, verify customer accounts, progress order states from confirmation to shipping. | Sub-24h turnaround time on order confirmations. |
| **Warehouse / Platform Administrator** | Operations Lead | Manage inventory thresholds, restock goods, disable delinquent accounts, audit all transactions. | 0 stock discrepancies, complete traceability of system actions. |

---

## 3. Measurable Business Benefits
- **70% Reduction in manual order entry errors** via automated inventory verification before checkout.
- **Instant invoice creation** linked directly to line-item data upon order placement, cutting billing lag from 3 days to 0.
- **Complete regulatory auditability** by logging every status change, price change, and login event with timestamps.

---

## 4. Functional Requirements Matrix

| ID | Module | Requirement Description | Priority |
| :--- | :--- | :--- | :--- |
| **FR-01** | Authentication | Support credential login and registration with role assignment (Admin, Sales, Customer). | High |
| **FR-02** | Catalog Management | Display products with SKU, title, category, price, and real-time stock levels. | High |
| **FR-03** | Inventory Status | Display badges for "In Stock", "Low Stock" (<= threshold), and "Out of Stock". | High |
| **FR-04** | Cart & Validation | Validate added quantity against live warehouse inventory; prevent over-ordering. | High |
| **FR-05** | Order Placement | Generate unique Order ID, deduct warehouse stock immediately, calculate subtotal and tax. | High |
| **FR-06** | Invoicing | Automatically generate an invoice with net-14 payment due date linked to the order ID. | High |
| **FR-07** | Order Status Workflow | Transition order status through: Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered. | High |
| **FR-08** | Invoice Settlement | Admin capability to mark pending/overdue invoices as Paid. | Medium |
| **FR-09** | User Management | Admin ability to enable/disable user accounts and view company affiliations. | Medium |
| **FR-10** | Audit Logging | Immutable log tracking who performed which action (auth, order, product, invoice, user) and when. | High |
| **FR-11** | Printable Invoices | Clean, standardized invoice template suitable for printing or PDF export. | Medium |
| **FR-12** | Notifications | Real-time notification center highlighting pending orders, overdue invoices, and low-stock alerts. | Low |

---

## 5. Non-Functional Requirements (NFR)
- **Security:** Strict role-based endpoint authorization. Passwords hashed using standard cryptographic algorithms in database schema.
- **Data Integrity:** Relational schema enforces foreign key constraints (`ON DELETE CASCADE` or `RESTRICT`), non-negative numeric constraints on prices and stock.
- **Reliability:** In-memory fallback enables zero-configuration offline execution, while `schema.sql` provides enterprise PostgreSQL migration.
- **Performance:** Sub-100ms API response time on standard queries with database indexing on `customer_id`, `status`, and `sku`.
- **Usability:** Responsive design adapted for desktops, tablets, and mobile devices without horizontal scrolling.

---

## 6. Edge Cases & Risk Controls

| Potential Failure / Edge Case | System Defense & Control |
| :--- | :--- |
| **Attempting to purchase more than available stock** | Frontend buttons disable and clamp to max available; backend rejects orders where `quantity > stock_quantity`. |
| **Out-of-stock items** | Product cards display "Out of Stock" badge and disable "Add to Cart" interactions. |
| **Unauthorized role actions** | Customers cannot view admin panels, edit stock, or update order statuses. |
| **Malformed API payloads** | Request validation checks presence of required fields (`sku`, `price`, `items`) and returns 422 Unprocessable Entity. |
| **Invoice overdue risks** | Automated status calculation flags invoices past due date as "Overdue" in dashboard metrics and notification drawer. |

