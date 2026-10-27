# IT Admin Pro

IT Admin Pro by InfraSOS brings **Microsoft 365 administration and reporting into Microsoft Teams**.
You add it as a tab in Teams, grant access once, and work on your tenant without leaving Teams or
opening the Microsoft 365 admin center - there is nothing to install, and no agent, script or
connector runs anywhere in your environment.

It is a **free admin app with paid upgrades**. The free tier covers the everyday work: view-only
reports across your whole tenant, and the common single-user helpdesk actions. Automation, bulk
operations and multi-tenant management are part of the paid plans, which share one subscription with
[365 Command](../365-command/index.md), the web console - subscribe once and use either surface.

It is a natural replacement for Microsoft's built-in Teams admin app, which Microsoft is retiring.

## What it does

### Free

- **Reporting.** View-only across your whole tenant: users, licences, groups, mailboxes and mail
  flow, Teams, SharePoint and OneDrive, Secure Score and security posture, Intune devices and guests
  - filterable, with chooseable columns.
- **Everyday management**, one user at a time: block or unblock sign-in, require a password change,
  reset MFA, assign or remove licences, set or clear a manager, create a group, add a member or
  owner, and add someone to a team. Every change confirms first and is written to an audit trail.

### Paid

Included with a 365 Command subscription:

- **Export** every report to CSV, HTML or PDF.
- **Bulk operations** - run an action against a whole list of users at once.
- **Onboarding and offboarding** wizards for starters and leavers.
- **Alerts** and **scheduled reports**.
- **MSP Global View** and multi-tenant management.

On the free tier these appear as a preview with sample data behind an upgrade prompt, so you can see
exactly what each one does before you subscribe.

The features themselves behave exactly as they do in the web console, so the detailed guides live
under 365 Command: [Reporting](../365-command/reporting.md), [Security](../365-command/security.md),
[Management actions](../365-command/management-actions.md), [Intune](../365-command/intune.md),
[Scheduled reports](../365-command/scheduled-reports.md), [Alerts](../365-command/alerts.md) and
[MSP Global View](../365-command/global-view.md).

## What it deliberately does not do

- **It does not change anything until you opt in.** The app is read-only when you add it. Management
  actions run through a separate application that an administrator consents to per tenant, and each
  action is gated on the exact permission it needs - so an action you have not enabled shows disabled
  with its reason rather than failing.
- **It runs nowhere near your network.** Everything is read on demand through Microsoft Graph. There
  is no connector to deploy, no service account to create and no inbound access to grant.
- **It does not invent data.** A figure it cannot compute - because a permission is missing, a
  licence is absent, or Graph returned nothing - renders as a greyed **Unavailable** or sample value
  with the reason, never as a zero or an estimate.

## Getting started

1. In Microsoft Teams, add **IT Admin Pro** from the Teams app store (or have it deployed to your
   organization from the Teams admin center).
2. Open the app and choose **Grant access**. A Global Administrator approves the read-only
   permissions once for your organization, and your reports load straight away.
3. To use management actions, enable management for the tenant when prompted - this is a second,
   separate consent, so you are never shown a write-access screen you did not ask for.

Until a tenant has granted access, reports show **sample data** so you can see what the app looks
like. Once access is granted, they switch to your real tenant on the next load.

## Where to start

- Names in some reports showing as long codes, or **All SharePoint Files** reporting a site could
  not be found: [Showing real names in reports](showing-real-names.md).
- The full feature guides: under [365 Command](../365-command/index.md).
- How permissions and the read/manage split work: [365 Command Permissions](../365-command/permissions.md).
