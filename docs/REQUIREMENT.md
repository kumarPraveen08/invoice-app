# Functional and Non-Functional Requirements

## Invoice and Business Management Platform

## 1. Purpose

The platform will help businesses manage customers, products or services, invoices, payments, receipts, purchases, reports, and subscriptions.

The system will be available as a web or mobile application.

---

# 2. Functional Requirements

## 2.1 Business Profile

The user should be able to:

- Create and update business details
- Add or change the business name, phone number, email, tax number, website, and address
- Upload or remove a business logo
- Upload or remove an authorized signature
- Add bank account and payment details
- Add default invoice notes
- Add default terms and conditions
- Configure currency, tax, date format, and invoice numbering

The platform should collect basic business information through an onboarding survey and use it to create the initial business profile.

---

## 2.2 Catalogue and Item Management

The user should be able to:

- Create, view, update, delete, or archive catalogues
- Create, view, update, delete, or archive items
- Add products or services to a catalogue
- Search and filter catalogues and items
- Import catalogues and items from a CSV file
- Export catalogues and items to a CSV file

An item may include:

- Name
- Code or SKU
- Description
- Category
- Selling price
- Purchase price
- Tax
- Discount
- Unit
- Product or service type
- Status

Before importing a CSV file, the platform should validate the file and show invalid or duplicate records.

---

## 2.3 Customer Management

The user should be able to:

- Create, view, update, delete, or archive customers
- Search and filter customers
- Import customers from a CSV file
- Export customers to a CSV file
- Create a customer from the device contact list
- View customer invoices, payments, receipts, and outstanding balances

Customer information may include:

- Customer name
- Business name
- Phone number
- Email address
- Billing address
- Shipping address
- Tax number
- Contact person
- Notes

The platform should request permission before accessing phone contacts.

The platform should warn the user when a possible duplicate customer is found.

---

## 2.4 Invoice Management

The user should be able to:

- Create an invoice
- Save an invoice as a draft
- View and update an invoice
- Delete a draft invoice
- Cancel or void an issued invoice
- Duplicate an existing invoice
- Download or print an invoice
- Search and filter invoices

An invoice may include:

- Invoice number
- Customer
- Invoice date
- Due date
- Items
- Quantity
- Price
- Tax
- Discount
- Additional charges
- Notes
- Terms and conditions
- Payment instructions
- Attachments

The platform should automatically calculate:

- Subtotal
- Discount
- Tax
- Additional charges
- Total amount
- Paid amount
- Outstanding amount

Invoice statuses should include:

- Draft
- Sent
- Opened
- Partially paid
- Paid
- Overdue
- Cancelled
- Void

---

## 2.5 Invoice Template Customization

The user should be able to:

- Select an invoice template
- Add a business logo
- Add a signature
- Add business and bank details
- Change colors and fonts
- Show or hide invoice fields
- Add default notes and terms
- Preview the template
- Set a default template

Invoices created under the free plan should contain a platform watermark.

The watermark should be removed for eligible paid plans.

---

## 2.6 Invoice Sharing and Tracking

The user should be able to send invoices through:

- Email
- WhatsApp
- SMS
- Secure invoice link

The platform should record whether the invoice message was:

- Sent
- Delivered
- Failed
- Opened, where supported

The platform should record the date and time when the customer opens the invoice.

The platform should also maintain invoice communication history.

Invoice-open tracking may not always be accurate because of email privacy settings, link previews, or blocked tracking content.

---

## 2.7 Payment Management

The user should be able to:

- Record full or partial invoice payments
- Record multiple payments against one invoice
- Use different payment methods
- Add new payment methods
- Update or disable payment methods
- Reverse an incorrect payment
- Add a payment reference, note, or attachment

Supported payment methods may include:

- Cash
- Bank transfer
- Credit card
- Debit card
- Cheque
- Digital wallet
- Online payment gateway
- Custom payment method

The platform should automatically update the invoice status after payment.

Where online payment is enabled, the customer should be able to pay through a secure payment link.

---

## 2.8 Receipt Management

The platform should generate a receipt after a payment is recorded.

The user should be able to:

- View a receipt
- Download a receipt
- Print a receipt
- Send a receipt through email, WhatsApp, or SMS
- Search and filter receipts

A receipt should include:

- Receipt number
- Invoice number
- Customer
- Payment date
- Payment amount
- Payment method
- Payment reference
- Remaining balance

---

## 2.9 Payment Reminders

The platform should identify unpaid, partially paid, and overdue invoices.

The user should be able to:

- Send a manual payment reminder
- Configure automatic reminders
- Choose reminder channels
- Customize the reminder message
- View reminder history

Reminders may be sent:

- Before the due date
- On the due date
- After the due date
- At regular intervals until payment is completed

Automatic reminders should stop when the invoice is paid, cancelled, or voided.

---

## 2.10 Reports

The user should be able to view reports for:

- Invoices
- Payments
- Outstanding invoices
- Overdue invoices
- Customers
- Items
- Catalogues
- Receipts
- Purchases
- Purchase orders
- Taxes
- Platform usage

Reports should support filters such as:

- Date range
- Customer
- Item
- Invoice status
- Payment status
- Payment method
- Amount range
- User

The user should be able to export report results to a CSV file.

The dashboard may show:

- Total sales
- Payments received
- Outstanding amount
- Overdue amount
- Number of invoices
- Number of customers
- Recent invoices
- Recent payments
- Subscription usage

---

## 2.11 Purchase Management

The user should be able to:

- Create, view, update, delete, or archive purchases
- Add suppliers and purchased items
- Record purchase amounts, tax, discounts, and payment status
- Search and filter purchases
- Export purchases to a CSV file

---

## 2.12 Purchase Order Management

The user should be able to:

- Create a purchase order
- View and update a purchase order
- Send a purchase order to a supplier
- Cancel or close a purchase order
- Convert a purchase order into a purchase
- Export purchase orders to a CSV file

Purchase order statuses may include:

- Draft
- Sent
- Partially fulfilled
- Fulfilled
- Cancelled
- Closed

---

## 2.13 CSV Import and Export

The platform should provide CSV templates for imports.

The CSV process should support:

- File validation
- Column mapping
- Import preview
- Duplicate detection
- Error reporting
- Import confirmation
- Export based on selected filters

CSV files should use UTF-8 encoding and should work with common spreadsheet applications.

---

## 2.14 Subscription and In-App Purchase

The platform should support:

- Free plan
- Monthly paid plans
- Annual paid plans
- In-app purchases
- Web subscription payments
- Plan upgrades
- Plan downgrades
- Subscription cancellation
- Purchase restoration
- Failed-payment grace periods

The user should be able to view:

- Current plan
- Renewal date
- Plan limits
- Current usage
- Subscription status
- Payment history

The platform should enable or disable features according to the active subscription plan.

---

# 3. Suggested Plan Features

| Feature              | Free Plan              | Paid Plan           |
| -------------------- | ---------------------- | ------------------- |
| Business profiles    | 1                      | More based on plan  |
| Invoices             | Limited                | Higher or unlimited |
| Invoice watermark    | Yes                    | No                  |
| Customers            | Limited                | Higher or unlimited |
| Catalogues and items | Limited                | Higher or unlimited |
| CSV import           | Limited or unavailable | Available           |
| CSV export           | Limited                | Available           |
| Invoice templates    | Basic                  | Custom templates    |
| Payment methods      | Basic                  | Custom methods      |
| Reports              | Basic                  | Detailed            |
| Report export        | Limited                | Available           |
| Invoice tracking     | Limited                | Available           |
| Payment reminders    | Manual                 | Automatic           |
| Email, SMS, WhatsApp | Limited                | Higher limits       |
| Purchases            | Limited or unavailable | Available           |
| Purchase orders      | Limited or unavailable | Available           |
| Team members         | 1                      | Multiple            |
| Storage              | Limited                | Higher              |
| Support              | Standard               | Priority            |

The exact limits should be configurable by the platform administrator.

The system should notify users when they are close to reaching a plan limit.

Existing data should not be deleted when a subscription expires or is downgraded.

---

# 4. User Roles and Permissions

The platform may support the following roles:

## Business Owner

Can manage:

- Business details
- Subscription
- Users
- Customers
- Items
- Invoices
- Payments
- Reports
- Templates

## Administrator

Can manage most business records and settings based on assigned permissions.

## Staff Member

Can manage customers, items, invoices, payments, and purchases based on assigned permissions.

## Customer

Can:

- View an invoice
- Download an invoice
- Pay an invoice
- View a receipt

The platform should prevent users from accessing data without permission.

---

# 5. Business Rules

- Every invoice should have a unique invoice number.
- An invoice should contain at least one item.
- Invoice totals should not be negative.
- A payment amount should be greater than zero.
- The outstanding amount should equal the invoice total minus valid payments.
- An invoice should be marked as paid when the outstanding amount becomes zero.
- An invoice should be marked as overdue after the due date when an amount is still unpaid.
- Reversed payments should not be included in paid totals.
- Completed financial records should not be permanently deleted.
- All important financial changes should be recorded in an audit log.

---

# 6. Non-Functional Requirements

## 6.1 Performance

- Common pages should load within three seconds under normal conditions.
- Search and filter results should normally appear within three seconds.
- Invoice generation should normally complete within five seconds.
- Large imports, exports, and reports should show progress.

## 6.2 Security

- All data should be encrypted during transmission.
- Sensitive stored data should be encrypted where required.
- Passwords should be securely hashed.
- The platform should use role-based access control.
- Users should only access authorized business data.
- Uploaded files should be validated.
- Payment card details should not be stored directly unless required security standards are met.
- The platform should protect against common web and mobile security attacks.

## 6.3 Privacy

- The platform should request permission before accessing phone contacts.
- Customer information should only be available to authorized users.
- Invoice-open tracking should follow applicable privacy laws.
- The platform should support data export and deletion requests where required.

## 6.4 Reliability

- The platform should target 99.9% monthly availability.
- Confirmed invoices and payments should not be lost.
- Financial operations should be processed safely and consistently.
- Duplicate payment requests or callbacks should not create duplicate payments.

## 6.5 Scalability

- The platform should support increasing numbers of users, businesses, invoices, customers, and payments.
- Large reports and imports should not block normal invoice operations.

## 6.6 Usability

- The interface should be simple and consistent.
- Forms should show clear validation messages.
- Important actions such as deletion or payment reversal should require confirmation.
- Invoice and payment statuses should be easy to understand.

## 6.7 Accessibility

- The web application should follow WCAG 2.1 Level AA guidelines.
- The interface should support keyboard navigation.
- Text should have sufficient contrast.
- Status should not be shown using color alone.

## 6.8 Compatibility

- The web application should support current major browsers.
- The mobile application should support the selected Android and iOS versions.
- PDF invoices should open in common PDF readers.
- CSV files should work with common spreadsheet applications.

## 6.9 Backup and Recovery

- Business data should be backed up regularly.
- Backups should be encrypted.
- Data restoration should be tested.
- Recovery targets should be defined before production release.

## 6.10 Audit and Monitoring

The platform should record important activities, including:

- User login
- Customer changes
- Invoice changes
- Payment changes
- Subscription changes
- Permission changes

The platform should also monitor:

- System errors
- Payment failures
- Message delivery failures
- Database failures
- Security events

Sensitive information such as passwords and payment tokens should not appear in system logs.

---

# 7. Recommended Development Phases

## Phase 1

- Business profile
- Customers
- Catalogues and items
- Invoices
- Manual payments
- Receipts
- Basic reports
- Basic subscription plans

## Phase 2

- CSV import and export
- Contact-list customer creation
- Email, WhatsApp, and SMS sharing
- Payment reminders
- Invoice-open tracking
- Advanced reports

## Phase 3

- Online payments
- Purchases
- Purchase orders
- Team roles and permissions
- Advanced invoice customization

## Phase 4

- Recurring invoices
- Credit notes
- Inventory management
- Accounting integrations
- Customer portal
- Public APIs and webhooks
