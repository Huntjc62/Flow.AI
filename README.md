# FlowAI V4

V4 is a substantially rebuilt browser prototype of the FlowAI AI Business OS.

## Working in the downloaded prototype
- Overview dashboard
- Leads CRUD
- Jobs CRUD
- Customers CRUD
- Lead status filtering/search
- Calendar
- AI Command Centre with live answers based on current records
- Reports and CSV export
- Settings and custom branding
- Notifications feedback
- Global search + Ctrl/Cmd K
- Reset demo data
- Browser persistence with localStorage
- Responsive mobile navigation

## Turning V4 into the real SaaS
The browser prototype deliberately has no secret API keys. Use:
1. Firebase Authentication
2. Firestore with the included security-rules starting point
3. Firebase Cloud Functions (or another backend) for AI calls
4. Stripe for subscriptions
5. OAuth integrations for Gmail/Outlook/Google Calendar/WhatsApp where appropriate

`firebase-config.example.js` is only a template and contains no real credentials.

## Suggested production collections
users, businesses, leads, jobs, customers, tasks, activities, ai_insights, automations, integrations, subscriptions.

## Important
LocalStorage authentication/data is not secure enough for a real SaaS. This V4 is the product/UI/data-flow prototype and production migration scaffold.


# FlowAI V5 Premium

V5 keeps the V4 functional prototype and gives it a substantially more premium visual system:
- dark executive sidebar
- refined SaaS typography and spacing
- elevated cards and tables
- premium AI Command Centre treatment
- glass/sticky top navigation
- polished forms, badges, buttons and responsive layouts
- subtle interaction and hover motion
- mobile-first responsive behaviour

The underlying V4 prototype behaviour and localStorage persistence are retained.

## Important
This is still a browser prototype. For a real multi-user SaaS:
1. Firebase Authentication for accounts
2. Firestore for business data
3. Firebase Cloud Functions/server for AI API calls
4. Stripe for billing
5. OAuth/integrations for Gmail, Outlook, Calendar and WhatsApp

Never place a private AI API key in GitHub Pages/frontend JavaScript.


# V6 Enterprise Record UX

V6 adds a dedicated record experience inspired by modern enterprise CRMs:
- Every lead, job and customer can have a focused single-record page.
- The record page hides the rest of the CRM while you work on that record.
- Dedicated Overview, Activity, Notes and Files tabs are presented.
- Detailed contact/job/customer information is shown in sections.
- Inline record editing has its own save/cancel workflow.
- AI insight and health panels are surfaced alongside the record.
- URL/hash routes support `#lead/<id>`, `#job/<id>` and `#customer/<id>`.
- Existing V4 localStorage functionality is retained.

For existing V4 list markup, add `data-record-type="lead|job|customer"` and `data-record-id="<id>"` to make a row/card open the dedicated record view.
