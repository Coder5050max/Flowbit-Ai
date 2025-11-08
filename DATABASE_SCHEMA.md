# Database Schema Documentation

## Overview

The database is normalized into 6 main tables to handle invoice and vendor data efficiently.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Vendors   │◄────────┤   Invoices   ├────────►│  Customers  │
└─────────────┘         └──────────────┘         └─────────────┘
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────────────┐    ┌─────────────┐
              │ Line Items  │    │  Payments   │
              └─────────────┘    └─────────────┘
```

## Tables

### vendors

Stores vendor/supplier information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique vendor identifier |
| name | String | UNIQUE, NOT NULL | Vendor name |
| email | String | NULLABLE | Vendor email |
| phone | String | NULLABLE | Vendor phone number |
| address | String | NULLABLE | Vendor address |
| tax_id | String | NULLABLE | Tax identification number |
| created_at | DateTime | NOT NULL | Record creation timestamp |
| updated_at | DateTime | NOT NULL | Last update timestamp |

**Relationships:**
- One-to-Many with `invoices`

---

### customers

Stores customer/client information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique customer identifier |
| name | String | UNIQUE, NOT NULL | Customer name |
| email | String | NULLABLE | Customer email |
| phone | String | NULLABLE | Customer phone number |
| address | String | NULLABLE | Customer address |
| tax_id | String | NULLABLE | Tax identification number |
| created_at | DateTime | NOT NULL | Record creation timestamp |
| updated_at | DateTime | NOT NULL | Last update timestamp |

**Relationships:**
- One-to-Many with `invoices`

---

### invoices

Main invoice header table.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique invoice identifier |
| invoice_number | String | UNIQUE, NOT NULL | Invoice number (e.g., INV-2024-001) |
| vendor_id | UUID | FOREIGN KEY, NOT NULL | Reference to vendors.id |
| customer_id | UUID | FOREIGN KEY, NULLABLE | Reference to customers.id |
| issue_date | DateTime | NOT NULL | Invoice issue date |
| due_date | DateTime | NULLABLE | Invoice due date |
| status | String | NOT NULL | Invoice status: 'paid', 'pending', 'overdue', 'draft' |
| subtotal | Decimal(12,2) | NOT NULL | Subtotal amount |
| tax | Decimal(12,2) | NOT NULL, DEFAULT 0 | Tax amount |
| total | Decimal(12,2) | NOT NULL | Total amount (subtotal + tax) |
| currency | String | NOT NULL, DEFAULT 'USD' | Currency code |
| notes | String | NULLABLE | Additional notes |
| created_at | DateTime | NOT NULL | Record creation timestamp |
| updated_at | DateTime | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `vendors`
- Many-to-One with `customers`
- One-to-Many with `line_items`
- One-to-Many with `payments`

**Indexes:**
- `invoice_number` (unique)
- `vendor_id`
- `customer_id`
- `issue_date`
- `status`

---

### line_items

Invoice line items (products/services).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique line item identifier |
| invoice_id | UUID | FOREIGN KEY, NOT NULL | Reference to invoices.id |
| description | String | NOT NULL | Item description |
| category | String | NULLABLE | Item category (e.g., 'Software', 'Services') |
| quantity | Decimal(10,2) | NOT NULL, DEFAULT 1 | Quantity |
| unit_price | Decimal(12,2) | NOT NULL | Price per unit |
| amount | Decimal(12,2) | NOT NULL | Total amount (quantity × unit_price) |
| created_at | DateTime | NOT NULL | Record creation timestamp |
| updated_at | DateTime | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `invoices` (CASCADE DELETE)

**Indexes:**
- `invoice_id`
- `category`

---

### payments

Payment records for invoices.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique payment identifier |
| invoice_id | UUID | FOREIGN KEY, NOT NULL | Reference to invoices.id |
| amount | Decimal(12,2) | NOT NULL | Payment amount |
| payment_date | DateTime | NOT NULL | Date of payment |
| payment_method | String | NOT NULL | Payment method (e.g., 'credit_card', 'bank_transfer', 'check') |
| reference_number | String | NULLABLE | Payment reference number |
| notes | String | NULLABLE | Payment notes |
| created_at | DateTime | NOT NULL | Record creation timestamp |
| updated_at | DateTime | NOT NULL | Last update timestamp |

**Relationships:**
- Many-to-One with `invoices` (CASCADE DELETE)

**Indexes:**
- `invoice_id`
- `payment_date`

---

## Data Types

### Status Values

**Invoice Status:**
- `paid` - Invoice has been fully paid
- `pending` - Invoice is pending payment
- `overdue` - Invoice is past due date
- `draft` - Invoice is a draft/not finalized

### Payment Methods

Common payment methods:
- `credit_card`
- `bank_transfer`
- `check`
- `cash`
- `paypal`
- `other`

### Categories

Common line item categories:
- `Software`
- `Services`
- `Equipment`
- `Marketing`
- `Infrastructure`
- `Other`

## Normalization

The database follows 3NF (Third Normal Form):

1. **First Normal Form (1NF)**: All columns contain atomic values
2. **Second Normal Form (2NF)**: All non-key attributes fully depend on the primary key
3. **Third Normal Form (3NF)**: No transitive dependencies

### Benefits

- **Data Integrity**: Foreign key constraints ensure referential integrity
- **Reduced Redundancy**: Vendor and customer data stored once
- **Flexibility**: Easy to add new invoices, line items, and payments
- **Query Performance**: Indexed columns for fast lookups
- **Maintainability**: Clear relationships and constraints

## Sample Queries

### Get total spend by vendor

```sql
SELECT 
  v.name,
  SUM(i.total) as total_spend
FROM vendors v
JOIN invoices i ON v.id = i.vendor_id
GROUP BY v.id, v.name
ORDER BY total_spend DESC;
```

### Get invoices with line items

```sql
SELECT 
  i.invoice_number,
  i.total,
  COUNT(li.id) as item_count,
  SUM(li.amount) as line_items_total
FROM invoices i
LEFT JOIN line_items li ON i.id = li.invoice_id
GROUP BY i.id, i.invoice_number, i.total;
```

### Get overdue invoices

```sql
SELECT 
  i.invoice_number,
  v.name as vendor,
  i.due_date,
  i.total,
  DATEDIFF(CURRENT_DATE, i.due_date) as days_overdue
FROM invoices i
JOIN vendors v ON i.vendor_id = v.id
WHERE i.status = 'overdue'
  AND i.due_date < CURRENT_DATE
ORDER BY days_overdue DESC;
```

## Migration History

Migrations are managed by Prisma. To view migration history:

```bash
cd apps/api
npx prisma migrate status
```

## Backup & Restore

### Backup

```bash
pg_dump -U postgres -d flowbit_analytics > backup.sql
```

### Restore

```bash
psql -U postgres -d flowbit_analytics < backup.sql
```

## Performance Considerations

1. **Indexes**: Key columns are indexed for fast queries
2. **Cascade Deletes**: Line items and payments are deleted when invoice is deleted
3. **Decimal Precision**: Financial amounts use Decimal(12,2) for accuracy
4. **UUID Primary Keys**: Better for distributed systems

## Future Enhancements

Potential additions:
- `categories` table for normalized category management
- `payment_methods` table for payment method configuration
- `invoice_status_history` table for status tracking
- `attachments` table for invoice documents
- `audit_log` table for change tracking

