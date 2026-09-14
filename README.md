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
