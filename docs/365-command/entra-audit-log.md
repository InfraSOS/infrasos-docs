# Entra Audit Log

The **Entra Audit Log** answers "who changed what, and when" in your directory. It surfaces the
directory audit events Entra ID records for every administrative change, so a new admin assignment, a
deleted account, a Conditional Access policy edit or a group membership change is traceable to the
person who made it, from the same console as the rest of 365 Command.

It is read-only and needs no permission beyond the reporting consent.

## What it shows

Each event carries:

- **Who** - the actor who made the change, and the IP address they acted from.
- **What** - the activity (for example *Add member to group*, *Update conditional access policy*,
  *Delete user* or *Consent to application*) and its result.
- **To what** - the target object or objects the change touched.
- **Before and after** - for a property change, the old value and the new value, side by side.

Typical questions it answers: who added a user to a privileged group, who created or deleted an
account, who changed a Conditional Access policy, who consented to an application, and when each
happened.

## Filtering and search

The view loads the most recent directory audit events and lets you narrow them:

- **Initiated by** - a searchable picker of the actors in the loaded window, to isolate one admin.
- **Target** - a searchable picker of the objects that were changed.
- **Category**, **Result** and a **date range**, plus free-text **search**.

!!! note "Microsoft retains directory audits for 30 days"
    Entra ID keeps directory audit events for about **30 days** (the Microsoft default on most
    licences), so the Entra Audit Log reflects that window. The view loads the most recent events; use
    the filters to find a specific actor, target or change within it. For longer retention, export
    regularly or forward the logs to your own SIEM.

## Export

Any single event exports to **CSV** or **PDF** from its detail, with the full before-and-after of
every changed property flattened into field-and-value rows, so you can attach the evidence to a ticket
or a change record. The table exports alongside the rest of the reports.

## How it relates to the Exchange Unified Audit Log

The Entra Audit Log is **directory-level**: identity, group, role, policy and application changes,
read from Microsoft Graph. The [Exchange (Mail)](exchange.md) area has a separate **Unified Audit
Log** that covers **mailbox and Exchange-level** activity through Microsoft Purview, which needs a
Compliance role on the Exchange runner. Use the Entra Audit Log for directory change forensics, and
the Unified Audit Log for mailbox and content activity.

## Permission

The Entra Audit Log reads Microsoft Graph directory audit logs through the reporting application's
`AuditLog.Read.All` permission, granted when you connect a tenant. There is nothing extra to consent.
See [Permissions](permissions.md#reporting-application-read-only).
