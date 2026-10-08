# Security and data handling

This page is about how 365 Command itself is built, hosted and secured, and exactly what it stores
and processes. It is the page to read, or to send to a security reviewer, when evaluating the hosted
service.

!!! note "Not the same as the Security report"
    The in-console [Security](security.md) report is about **your tenant's** posture - Secure Score,
    MFA, risky users. This page is about **our** service: where it runs, how it is secured, and what
    it keeps.

## The shape of the service

365 Command is a hosted console. You reach it in a browser at
[command.infrasos.com](https://command.infrasos.com); there is **nothing to install, no agent, and
no inbound access to your network**. Everything it reports is read on demand from **Microsoft
Graph**, using access you grant by admin consent and can withdraw at any time.

The most important consequence for data handling: the product **reads your directory, it does not
copy it**. A report is fetched when you open it and held only briefly in memory to keep paging
responsive. There is no nightly sync and no warehouse of your users sitting in our database.

## Where it runs

| Area | What we use |
| --- | --- |
| **Cloud** | Microsoft Azure |
| **Region** | West Europe (EU) |
| **Compute** | Azure App Service (Linux), always-on behind Microsoft's managed front end |
| **Transport** | HTTPS only, **TLS 1.2 minimum**, HTTP/2; plain HTTP is redirected and FTP is disabled |
| **Secrets** | Azure Key Vault, read at runtime through a managed identity |
| **Email** | Azure Communication Services, from `mail.infrasos.com` |
| **Billing** | Microsoft commercial marketplace (or direct) |

Because the service runs in an EU region, the configuration it stores stays in the EU. Your
**directory data is never relocated** out of Microsoft 365 - it is read in place through Graph.

## How you sign in

Sign-in uses **Microsoft Entra ID** (OpenID Connect). You authenticate against Microsoft, not
against us: **we never see or store your password**, and there is no separate password to manage.
The sign-in application requests only `openid`, `profile`, `email` and `User.Read` - enough to know
who you are and show your name, and nothing more.

## Least-privilege access to your tenants

Reading and managing a tenant are deliberately kept in **separate applications**, so you never turn
on more than the job needs:

- **Reporting** runs through a **read-only** application. It can read directory, usage and policy
  data, and only read.
- **Management** - the actions that change a tenant - runs through a **separate** application that an
  administrator opts into per tenant. Each action is gated on the exact permission it needs, and the
  privileged ones additionally require a directory role you assign explicitly. Nothing writes to a
  tenant you have not enabled management on.

The full permission list, and what each scope is for, is on the [Permissions](permissions.md) page.
Access ends the moment you remove consent in Entra or disconnect the tenant.

## What we store

We keep the configuration the service needs to run, and an audit trail. In our West Europe region:

| We store | Which includes |
| --- | --- |
| **Your subscription** | Plan and status (from the marketplace or a direct arrangement) |
| **Connected tenants** | The tenant IDs and names you have connected, and their consent state |
| **Your team** | The colleagues you invite: name, email, role and tenant scope |
| **Schedules and alert profiles** | What you have set up, and the recipient email addresses on them |
| **Alerts raised** | Each alert's detail, which can include a directory identifier for the item it fired on (a new admin's name, say). Kept for **60 days** |
| **Audit and activity** | A record of management actions (who did what, when) and daily aggregate metric counts for the trend charts |

## What we do not store

- **No credentials or access tokens for your tenants.** Tokens are obtained from Microsoft on demand
  and used in memory; they are never written to disk.
- **No passwords.** Authentication is handled by Microsoft Entra ID.
- **No bulk copy of your directory.** Reports are read live and not retained; the only directory
  detail kept is inside an alert, as above.
- **No secrets in source or configuration.** Application secrets live only in Azure Key Vault.

## How data is protected

- **In transit:** everything is over HTTPS with TLS 1.2 or higher.
- **At rest:** the configuration store is on Azure's encrypted storage; encryption at rest is on by
  default and managed by Azure.
- **Secrets:** held in Azure Key Vault and read at runtime by the application's managed identity, so
  no secret is present in the code, the container image or the app's settings.
- **Access control inside the console:** every person has a role (Admin, Operator or Viewer) and an
  optional per-tenant scope, and **every role and scope check is enforced on the server**, not only
  hidden in the interface. See [Team and delegated access](team-and-access.md).
- **Auditability:** management actions are written to an append-only audit trail, and every scheduled
  send and alert is recorded.

## Who processes your data

The service relies on Microsoft for the platform it runs on and the data it reads:

| Provider | For | Data involved |
| --- | --- | --- |
| **Microsoft Azure** | Hosting, storage, secrets | The configuration we store (above) |
| **Microsoft Graph** | Reading your tenant | Read on demand, not retained |
| **Azure Communication Services** | Sending alerts and scheduled reports | Recipient addresses, and the directory data inside a report attachment |
| **Microsoft commercial marketplace** | Billing, where you buy through it | Subscription identifiers |

## Retention and removal

- **Alerts** are kept for 60 days, then removed automatically.
- **Configuration** (tenants, team, schedules, profiles) is kept while it is in use. Disconnecting a
  tenant, removing a team member, or deleting a schedule removes that record.
- **Ending the service:** cancelling the subscription and removing consent in your tenants stops all
  access. Ask us to purge the remaining configuration and audit records and we will.

## Compliance

365 Command is hosted entirely on **Microsoft Azure**, whose data centres hold the major independent
certifications (ISO 27001, SOC 1/2/3 and others); Microsoft publishes the current list in the
Microsoft Trust Center. As a Microsoft commercial marketplace publisher, InfraSOS follows Microsoft's
publisher and data-handling requirements. For a specific assurance document or questionnaire, see
[Support](../support.md).

## Reporting a security concern

If you believe you have found a security issue, please contact us through [Support](../support.md)
with the detail, and we will respond. Please do not post security issues in public channels.
