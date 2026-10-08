# Troubleshooting

Most problems in 365 Command come down to a missing consent, permission or directory role - and the
console is built to tell you which, rather than fail silently. This page collects the common cases.

## A report shows "Unavailable"

The reporting application is missing a read permission in this tenant, or the tenant lacks the
licence that report needs.

- If it names a **permission**, add it to the reporting app registration and use **Refresh
  permissions** on the Tenants page, then allow a minute for the grant to propagate.
- If it names a **licence** - Entra ID P2 for risky users, an Intune licence for devices - that is a
  tenant licensing matter, not a consent one.

See [Permissions](permissions.md) for which report uses which scope.

## An action is disabled

The action's tooltip says what it needs. Usually the management application is missing that action's
permission: add it to the **management** app registration, grant admin consent, and the tenant
re-consents with **Refresh access**. Until then that one action stays disabled and everything else
keeps working.

## An action fails with "insufficient privileges"

The permission is granted but the management application is missing the **directory role** the
operation requires - the permission alone returns `403`.

- Account actions (disable, reset password, onboard, offboard) need **User Administrator**.
- **Reset MFA** needs **Authentication Administrator** (Privileged Authentication Administrator if
  the target is itself an administrator).
- **Assign role** needs **Privileged Role Administrator**.

Assign the role in the customer tenant: Entra admin center → Roles and administrators → the role →
Add assignments → the **InfraSOS Command - Management** application. See
[Permissions → Directory roles](permissions.md#directory-roles).

## Actions work on most users but fail on one

That account almost certainly holds an **administrator** role. Microsoft protects admin accounts
from being modified by lower-privileged roles, so User Administrator cannot change them however the
app is consented. Managing an admin account requires assigning the application a higher role
(Privileged Authentication Administrator), which is a deliberate escalation worth considering
carefully.

## The Intune page says it is not available

Either the reporting app does not yet hold `DeviceManagementManagedDevices.Read.All` in this tenant
(add it and use **Refresh access**, then wait a minute for propagation), or the tenant is **not
licensed for Intune**. The page names which. See [Intune](intune.md).

## A tenant shows "update available"

365 Command has gained a capability that needs a new permission. Choose **Refresh permissions**
(reporting) or **Refresh access** (management) on that tenant to re-run consent and pick up the new
scopes. Nothing you already had stops working while the refresh is pending.

## Alerts or scheduled reports are not arriving

The send itself rarely fails; the usual cause is Microsoft 365 mail filtering deferring or junking
mail from a sender it has not seen before.

- **Allow-list `mail.infrasos.com`** in your mail filtering. New-domain mail is often held back on
  the first bursts and then flows normally.
- Check the recipient addresses on the [profile](alerts.md) or [schedule](scheduled-reports.md).
- For a schedule, use **Run now**; for an alert profile, use **Test**. Both send immediately through
  the real path, so a successful one points the finger at filtering rather than configuration.
- An alert dashboard that is empty is usually correct: a profile raises nothing until its condition
  is met (a threshold is crossed on the next hourly check, or a genuinely new item appears), and the
  first check of a change profile only captures its baseline.

## Still stuck

[Support](../support.md) has how to reach us. Including the tenant, the action, and the exact
message the console showed gets you an answer fastest.
