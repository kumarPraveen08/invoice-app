# Subscription Plans and Country-Wise Pricing

The following prices are recommended launch prices. They can be updated later based on customer demand, competitors, taxes, and operating costs.

## 1. Plan Overview

| Feature                    |     Free |  Starter |    Growth |  Business |
| -------------------------- | -------: | -------: | --------: | --------: |
| Business profiles          |        1 |        1 |         1 |   Up to 3 |
| Users                      |        1 |        1 |         3 |        10 |
| Invoices per month         |        5 |      100 | Unlimited | Unlimited |
| Customers                  |       25 |      500 | Unlimited | Unlimited |
| Items and catalogues       |       50 |      500 | Unlimited | Unlimited |
| Invoice watermark          |      Yes |       No |        No |        No |
| Logo and signature         |    Basic |      Yes |       Yes |       Yes |
| Invoice templates          |        1 |        2 |         5 | Unlimited |
| CSV import and export      |       No |      Yes |       Yes |       Yes |
| Payment recording          |   Manual |      Yes |       Yes |       Yes |
| Receipts                   |    Basic |      Yes |       Yes |       Yes |
| Email and WhatsApp sharing |  Limited |      Yes |       Yes |       Yes |
| Automatic reminders        |       No |       No |       Yes |       Yes |
| Invoice-open tracking      |       No |       No |       Yes |       Yes |
| Reports                    |    Basic | Standard |  Advanced |  Advanced |
| Report CSV export          |       No |      Yes |       Yes |       Yes |
| Purchases                  |       No |       No |       Yes |       Yes |
| Purchase orders            |       No |       No |       Yes |       Yes |
| Roles and permissions      |       No |       No |     Basic |  Advanced |
| API and webhooks           |       No |       No |        No |       Yes |
| Support                    | Standard |    Email |  Priority |  Priority |

---

## 2. Billing Duration

The platform should provide the following subscription durations:

| Duration        | Recommendation                                           |
| --------------- | -------------------------------------------------------- |
| Free plan       | Free forever with usage limits                           |
| Free trial      | 14 days for Growth plan features                         |
| Monthly plan    | Charged every month; cancel anytime                      |
| Annual plan     | Charged once per year with approximately two months free |
| Enterprise plan | Custom duration and contract                             |

Quarterly subscriptions are not recommended at launch because they make the pricing screen and subscription management more complicated.

---

## 3. Recommended Pricing by Country

### India

| Plan     |    Monthly | Annual Billing | Annual Monthly Equivalent |
| -------- | ---------: | -------------: | ------------------------: |
| Free     |         ₹0 |             ₹0 |                        ₹0 |
| Starter  | ₹199/month |    ₹1,999/year |          About ₹167/month |
| Growth   | ₹499/month |    ₹4,999/year |          About ₹417/month |
| Business | ₹999/month |    ₹9,999/year |          About ₹833/month |

**Recommended display:**

> Growth Plan
> ₹417/month
> Billed ₹4,999 annually
> Save approximately 16%

---

### United States

| Plan     |      Monthly | Annual Billing | Annual Monthly Equivalent |
| -------- | -----------: | -------------: | ------------------------: |
| Free     |           $0 |             $0 |                        $0 |
| Starter  |  $5.99/month |    $59.99/year |            About $5/month |
| Growth   | $11.99/month |   $119.99/year |           About $10/month |
| Business | $24.99/month |   $249.99/year |        About $20.83/month |

**Recommended display:**

> Growth Plan
> $9.99/month
> Billed $119.99 annually
> Save approximately 17%

---

### United Kingdom

| Plan     |      Monthly | Annual Billing | Annual Monthly Equivalent |
| -------- | -----------: | -------------: | ------------------------: |
| Free     |           £0 |             £0 |                        £0 |
| Starter  |  £4.99/month |    £49.99/year |         About £4.17/month |
| Growth   |  £9.99/month |    £99.99/year |         About £8.33/month |
| Business | £19.99/month |   £199.99/year |        About £16.67/month |

**Recommended display:**

> Growth Plan
> £8.33/month
> Billed £99.99 annually
> Save approximately 17%

---

### United Arab Emirates

| Plan     |      Monthly | Annual Billing | Annual Monthly Equivalent |
| -------- | -----------: | -------------: | ------------------------: |
| Free     |        AED 0 |          AED 0 |                     AED 0 |
| Starter  | AED 19/month |   AED 190/year |     About AED 15.83/month |
| Growth   | AED 39/month |   AED 390/year |           AED 32.50/month |
| Business | AED 79/month |   AED 790/year |     About AED 65.83/month |

**Recommended display:**

> Growth Plan
> AED 32.50/month
> Billed AED 390 annually
> Save approximately 17%

---

## 4. Pricing Screen Layout

The application should detect the user's country and display:

- Local currency
- Local monthly price
- Local annual price
- Annual monthly equivalent
- Annual saving percentage
- Applicable taxes
- Plan limits
- Included features

The pricing page should mark the **Growth plan** as:

> Most Popular

The annual option should be selected by default and display:

> Save up to 17% with annual billing

---

## 5. Country and Currency Detection

The platform should determine the displayed country using:

1. App Store or Google Play country
2. User-selected business country
3. Billing address
4. Device region
5. IP-based location as a fallback

The user should be allowed to change the displayed country before purchasing, but the final billing country must match the payment or app-store account where required.

---

## 6. Taxes

Prices should be displayed with a clear tax message.

Examples:

- **India:** Price excludes applicable GST.
- **United States:** Applicable state and local taxes may be added.
- **United Kingdom:** Price excludes VAT unless stated otherwise.
- **United Arab Emirates:** Price excludes applicable VAT.

The final payable amount should be shown before subscription confirmation.

---

## 7. SMS, WhatsApp, and Payment Charges

Subscription prices should not automatically include unlimited SMS, WhatsApp, or payment-processing charges.

These services should use separate usage-based pricing.

Example message-credit pricing:

| Credit Pack           | India | United States | United Kingdom |    UAE |
| --------------------- | ----: | ------------: | -------------: | -----: |
| 100 message credits   |   ₹99 |         $2.99 |          £2.49 |  AED 9 |
| 500 message credits   |  ₹399 |         $9.99 |          £8.99 | AED 35 |
| 1,000 message credits |  ₹699 |        $16.99 |         £14.99 | AED 59 |

Actual prices should be configured according to the SMS or WhatsApp service provider.

Online payment gateway fees should be displayed separately and should not be included in the subscription price.

---

## 8. Additional Users

Additional team users may be sold as add-ons.

| Country        | Additional User Price |
| -------------- | --------------------: |
| India          |        ₹99/user/month |
| United States  |         $2/user/month |
| United Kingdom |      £1.50/user/month |
| UAE            |      AED 7/user/month |

The Business plan may include 10 users. Additional users can be purchased separately.

---

## 9. Launch Recommendation

At launch, the platform should offer:

- Free plan
- Starter plan
- Growth plan
- Business plan
- Monthly and annual billing
- 14-day free Growth trial
- Approximately 17% annual discount
- Localized prices for major countries
- Separate message credits
- Separate payment gateway charges

The Growth plan should be the main promoted plan because it contains the most important automation features, including reminders, invoice tracking, advanced reports, purchases, and purchase orders.
