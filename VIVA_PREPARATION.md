# 🎓 Viva & Interview Preparation Guide
### Project 1: B2B Order Management Platform (Arrowstack Internship)

This guide provides articulate, structured answers to the **7 official Viva / Interview questions** defined in the Arrowstack Internship handbook (Section 16). Use these points during mentor reviews, project presentations, and technical interviews.

---

### Q1: What business or user problem does the project solve, and how did you define success?
**Answer:**
> "The project solves the operational friction and inventory inaccuracies inherent in B2B wholesale distribution. Unlike retail e-commerce, wholesale transactions deal with high item counts, net-due credit terms, and multi-department approvals. Without a centralized system, distributors experience order inaccuracies, stock-outs, delayed billing, and lack of visibility into fulfillments.
> 
> **How success was defined:**
> 1. **Zero over-ordering errors:** Customers cannot place orders exceeding current stock.
> 2. **Instant billing turnaround:** Automated generation of net-14 invoices upon order creation.
> 3. **Role separation:** Strict boundaries between buyer purchasing, sales fulfillment, and administrative oversight.
> 4. **100% auditability:** Every status transition and stock change is timestamped and attributed to an authenticated user."

---

### Q2: Which design, technical, analytical or research decision had the biggest impact on the result?
**Answer:**
> "The most impactful technical decision was the **relational data model with decoupled state management**. 
> By designing a normalized relational schema (`schema.sql`) with foreign keys linking users, orders, line-items, invoices, and audit logs, we ensured data integrity at the database layer. 
> Simultaneously, implementing a zero-dependency in-memory fallback in `server.js` and a reactive client-side store in `index.html` ensured that mentors could test and verify the entire platform immediately in any browser or environment without being blocked by local PostgreSQL installation complexities."

---

### Q3: How did you validate the quality or correctness of your work?
**Answer:**
> "Validation was carried out through three structured layers:
> 1. **Automated Integration Testing:** An automated test suite (`test.js`) executes verification against the health endpoint, authentication security, role authorization, catalog querying, and order submission.
> 2. **Boundary & Negative Testing:** Tested edge cases such as invalid login attempts (verifying 401 response), attempting to purchase out-of-stock items (verifying disabled controls and stock clamping), and submitting malformed payloads (verifying validation errors).
> 3. **Role-Based Simulation:** Tested all workflows from the perspective of each persona:
>    - Customer placing orders and viewing generated invoices.
>    - Sales representative updating order lifecycle statuses.
>    - Administrator adjusting warehouse stock levels and inspecting audit trails."

---

### Q4: What edge cases, limitations or risks did you identify?
**Answer:**
> "We identified and handled four critical edge cases:
> 1. **Inventory depletion during ordering:** Products at zero stock are dynamically flagged with 'Out of Stock' badges and purchase actions are blocked.
> 2. **Stock quantity clamping:** Quantity selectors are bounded between 1 and the maximum available units in the warehouse.
> 3. **Invoice Overdue Flagging:** Invoices with due dates preceding current date are dynamically categorized as overdue and surfaced in notifications.
> 4. **Access control violations:** Sensitive views (User management, stock modifications, audit logs) are hidden and restricted from customer-role sessions.
> 
> **Known limitation:** High-concurrency race conditions (simultaneous multi-user checkout of the last remaining stock item) should be backed by row-level database locks in a production cluster."

---

### Q5: What would you change if this solution had to support 10× the users, data, or workload?
**Answer:**
> "To scale the platform 10× (e.g., handling 100,000+ orders and 10,000+ concurrent users), I would introduce the following architecture upgrades:
> 1. **Caching Layer (Redis):** Cache high-read endpoints like product catalogs and stock statuses to reduce database load.
> 2. **Message Queue for Asynchronous Processing (RabbitMQ / BullMQ):** Offload invoice generation, email notifications, and audit logging to asynchronous worker jobs.
> 3. **Database Concurrency Controls:** Implement database transactions with `SELECT ... FOR UPDATE` or optimistic locking using version columns to safely handle concurrent stock deductions.
> 4. **Database Read Replicas:** Route heavy analytical and reporting queries (e.g., sales dashboards, audit log searches) to read-only database replicas.
> 5. **Container Orchestration (Kubernetes / ECS):** Horizontally scale the Node.js application containers behind an NGINX load balancer."

---

### Q6: How would you explain the project to a non-technical stakeholder?
**Answer:**
> "Think of this platform as a digital control center for a wholesale warehouse. 
> For our customers, it works like a professional business portal where they can browse available products, see exactly what is in stock, place bulk orders, and print tax invoices with 14-day payment terms.
> For our internal team, sales reps can track shipments and advance orders from confirmation to delivery, while management has a real-time dashboard showing total revenue, pending orders, and a complete security record of every transaction that took place. It eliminates paperwork and prevents selling products that aren't on the shelves."

---

### Q7: Which part of the project required the most independent problem-solving?
**Answer:**
> "The most challenging aspect was orchestrating the **interdependent lifecycle between shopping cart, stock deduction, order generation, and invoice creation**. 
> When a buyer clicks 'Place Order', multiple actions must occur simultaneously without creating data inconsistencies:
> - Validate that the ordered quantities do not exceed available warehouse stock.
> - Calculate subtotal and tax.
> - Generate a unique order record.
> - Atomically decrement the inventory counts.
> - Create an accompanying invoice with a net-14 payment due date.
> - Record an immutable audit log entry.
> 
> Designing this transaction sequence so that it functions seamlessly both in the interactive frontend and across the REST API required careful architectural planning and state synchronisation."

