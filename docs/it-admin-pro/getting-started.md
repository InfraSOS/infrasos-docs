# Getting started

IT Admin Pro runs as a tab inside Microsoft Teams. There is nothing to install on any machine and
no agent, script or connector runs in your environment. Getting going is two steps: add the app and
sign in, and have an administrator grant access once so your reports show live data.

## What you need

- **Microsoft Teams** and a **Microsoft 365 work or school account** to sign in with. A personal
  Microsoft account cannot be used.
- To turn on live data, someone who can **grant admin consent** in your tenant, a Global
  Administrator. This is done once for the whole organisation, not by every user.

!!! note "Reporting vs management"
    Granting access gives you **reporting** (read-only). Turning on **management** actions
    (onboarding, resets, licence changes and the rest) is a separate, optional consent, covered
    below. You can run the whole app read-only and never enable management at all.

## Add the app and sign in

Add **IT Admin Pro by InfraSOS** in Teams and open its tab. The first time, Microsoft asks you to
approve the sign-in application reading your basic profile (your name and email, nothing else). This
is the sign-in step only, and grants no access to any directory data.

The app opens straight away. There is no paywall: a tenant with no subscription lands on the
**Free** tier, which includes every read-only report across the whole tenant plus a set of everyday
single-user management actions. The paid features (export, bulk operations, onboarding and
offboarding, alerts, scheduled reports and multi-tenant management) appear as a preview with an
upgrade prompt.

## Grant access for live data

Until an administrator grants access, the report pages show **sample data**, and the left rail shows
an amber **Setup Guide** button. To switch to your real tenant data, a **Global Administrator** opens
it and chooses **Grant Access**. That is a single admin-consent step in your tenant's own Microsoft
sign-in: it grants IT Admin Pro its read-only Microsoft Graph permissions and registers your
organisation. From then on every page shows live data, fetched from Microsoft Graph on demand, with
nothing stored by InfraSOS.

!!! tip "Setup Guide vs Manage Tenant"
    That left-rail button is the same entry in both states. Before access is granted it is the amber
    **Setup Guide**; once your tenant is connected it becomes **Manage Tenant** (a gear icon). Both
    open the same page, where you can re-run admin consent, check the connection, or remove the
    tenant. Seeing **Manage Tenant** means your tenant is already connected and showing live data.

## Who needs to grant access

Access is granted **once, for the whole tenant**, not per person.

- A Global Administrator grants access one time, as above.
- After that, **any employee who adds the app and signs in sees your live data automatically**. They
  do not grant access again, and they do not need to be an administrator. The data they see is your
  organisation's, resolved from their Microsoft sign-in.

!!! warning "Who can see the reports"
    Once access is granted, the reports are available to **any signed-in user in your tenant** who
    opens the app, not only administrators. The reports include tenant-wide information such as
    users, licences, groups and security posture. Only **management actions** (changes) are
    restricted to Global Administrators. If you want to limit who can see the reports, control who
    is allowed to add and use the app with your Teams **app permission and setup policies** in the
    Teams admin center.

## Enable management actions (optional)

To do more than the free single-user actions, a Global Administrator enables management from the
**Tenants** page with **Enable management**. This consents a separate write application and is
optional, so you can report for as long as you like before anyone turns on changes. The status pills
at the top of the **Management** page show whether actions are ready, and prompt you to enable them
if they are not. Management consent is shared with the [365 Command](../365-command/index.md) web
console, so a tenant you have enabled in one works in the other.

## Unlock the paid features (optional)

The paid features share one subscription with [365 Command](../365-command/index.md): subscribe
once and use either surface. Start a free trial or subscribe from **Pick a plan** in the app, which
opens the Microsoft commercial marketplace listing, or from the 365 Command web console. The Teams
app picks up the subscription automatically, usually within a few minutes.

## Good to know

- **Some insights need Microsoft Entra ID P1 or P2** (authentication methods, sign-in threats, risky
  users and Secure Score history). On a tenant without a premium licence, those pages show a clear
  "requires Entra ID Premium" message rather than empty or sample data.
- **Hashed names in reports** (codes like `A7A9458...` instead of real names) come from a Microsoft
  tenant privacy setting, not from IT Admin Pro. See
  [Showing real names in reports](showing-real-names.md) to switch it on.

## Next

- [Showing real names in reports](showing-real-names.md)
- [IT Admin Pro overview](index.md)
