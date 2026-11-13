# Permissions

365 Command uses three Entra applications, and they are kept separate on purpose: signing in,
reading (reporting), and writing (management) each request only what that job needs, so no one is
ever shown more access than they are actually turning on.

The consent screen Microsoft shows you is always the authoritative list for a given tenant. This
page explains what each permission is for. For how the service is hosted and what it stores, see
[Security and data handling](security-and-data.md).

## Sign-in application

Signing in to the console uses **delegated** permissions only, and grants no access to directory
data:

| Permission | Type | For |
| --- | --- | --- |
| `openid`, `profile`, `email` | Delegated | Signing you in |
| `User.Read` | Delegated | Your own name and email, to show who is signed in |

## Reporting application (read-only)

Every report reads through the **InfraSOS Command** application using **Application** permissions
(app-only). It can read, and only read. These are granted when you connect a tenant.

**Core reporting permissions:**

| Permission | Reads |
| --- | --- |
| `User.Read.All` | Accounts, attributes, status and sign-in activity |
| `Group.Read.All` | Groups, membership and ownership |
| `Directory.Read.All` | Directory objects, roles and app consents |
| `Organization.Read.All` | Tenant and licence information |
| `Reports.Read.All` | Usage and activity reports, MFA registration |
| `AuditLog.Read.All` | Sign-in and directory audit logs |
| `Policy.Read.All` | Conditional Access policies |
| `RoleManagement.Read.Directory` | Directory role assignments (admin exposure) |
| `Sites.Read.All` | SharePoint and OneDrive sites, storage and sharing |

**Added for specific reports** (some also require an Entra ID licence on the tenant):

| Permission | Enables | Note |
| --- | --- | --- |
| `SecurityEvents.Read.All` | Microsoft Secure Score and its history | |
| `IdentityRiskyUser.Read.All` | Risky users and risk detections | Needs Entra ID **P2** |
| `UserAuthenticationMethod.Read.All` | Per-user MFA method detail | |
| `DeviceManagementManagedDevices.Read.All` | Intune managed devices, compliance and at-risk | Needs an Intune licence |
| `SharePointTenantSettings.Read.All` | Tenant-wide SharePoint sharing settings | |
| `ServiceHealth.Read.All` | Microsoft 365 service health incidents and advisories, and the Service Health alert profile | |

!!! note "A missing read permission never breaks the console"
    If a report needs a permission the tenant has not granted - or a licence it does not have - that
    report shows a greyed **Unavailable** panel naming what is missing, and every other report keeps
    working. Add the permission and use **Refresh permissions** on the Tenants page to pick it up.

## Management application (write)

Actions run through the separate **InfraSOS Command - Management** application, consented only when
you turn on management for a tenant. Readiness is computed **per action**: each one is offered only
when the specific permission below is present, so a tenant missing one permission keeps every other
action working.

**Baseline** - granted when you enable management:

| Permission | Actions it enables |
| --- | --- |
| `User.ReadWrite.All` | Disable / enable / update users, require password change, onboard a user |
| `User.RevokeSessions.All` | Revoke sign-in sessions |
| `Group.ReadWrite.All` | Add / remove group members, create and delete groups |
| `DelegatedPermissionGrant.ReadWrite.All` | Revoke OAuth application consents |

**Optional** - add each on the management app registration when you want the actions it unlocks:

| Permission | Actions it enables |
| --- | --- |
| `Device.ReadWrite.All` | Disable or delete devices |
| `Application.ReadWrite.All` | Remove application secrets and certificates |
| `Policy.ReadWrite.ConditionalAccess` | Enable, disable or set a Conditional Access policy to report-only |
| `RoleManagement.ReadWrite.Directory` | Assign or remove directory role assignments |
| `UserAuthenticationMethod.ReadWrite.All` | Reset a user's MFA methods |
| `TeamSettings.ReadWrite.All` | Archive or unarchive teams |
| `TeamMember.ReadWrite.All` | Add members to teams |
| `MailboxSettings.ReadWrite` | Set mailbox auto-replies (out-of-office) |
| `Mail.ReadWrite` | Remove mailbox forwarding inbox rules |
| `Sites.ReadWrite.All` | Remove SharePoint / OneDrive sharing |

Until an optional permission is granted and re-consented, its actions appear disabled with the
reason; nothing else is affected.

## Directory roles

A Graph **permission** lets the management application call an API. For account and role changes,
Entra **also** requires the application's service principal to hold a **directory role** in the
customer tenant - the permission alone returns `403` without it.

| Role | Needed for | Beyond |
| --- | --- | --- |
| **User Administrator** | All baseline user actions (disable, enable, reset password, onboard, offboard) | The baseline. Assign it when you enable management. |
| **Authentication Administrator** | Reset MFA | Use **Privileged** Authentication Administrator if the target account is itself an administrator |
| **Privileged Role Administrator** | Assign or remove a directory role | You can only manage roles at or below your own privilege |

Assign a role in the customer tenant: **Entra admin center → Roles and administrators →** the role
**→ Add assignments →** search for the **InfraSOS Command - Management** application. Admin consent
to the app does **not** assign these roles; it is a separate, deliberate step.

!!! warning "The privileged actions are a bigger ask"
    Reset MFA, Assign role and Remove role need the roles above, which are more privileged than the
    User Administrator baseline. Treat them as advanced, opt-in actions: a customer can run every
    other management action without granting them. When one is attempted without its role, the
    failure names the exact role to assign.

## Exchange Online (Mail) runner

The **Exchange (Mail)** area is powered by a separate **InfraSOS EXO Runner** application. The core
reporting app reads Microsoft Graph, but many Exchange features (message trace, mail-flow rules,
mailbox permissions, protocol exposure, the unified audit log, retention and DLP policies) have no
Graph equivalent, so they are read through Exchange Online and the Microsoft Purview endpoints using
**application (app-only) certificate** authentication. The signing certificate lives on the InfraSOS
side; you never handle a secret or certificate.

There is nothing to install by hand: enabling the runner for a tenant is a one-click step in the
portal, described next. The one extra grant that two of its tabs need follows after.

### Enable Exchange for a tenant

On the **Tenants** page, find the tenant and select **Enable Exchange** in its row:

![The Enable Exchange button on a tenant's row on the Tenants page](../assets/screenshots/365-enable-exchange.png)

You are taken to Microsoft's consent screen to approve the **InfraSOS EXO Runner** application for that
tenant — a Global Administrator approves it, exactly as when connecting the tenant. Select **Accept**.
Back on the Tenants page the tenant shows a green **Exchange** badge (as above) and the Exchange (Mail)
tabs begin returning live data. This grants the runner's Exchange access only; the two Purview tabs
below need one extra role.

### Granting the Security and Compliance role

!!! info "Enable Exchange first"
    These two tabs light up only once the tenant has **[Enable Exchange](#enable-exchange-for-a-tenant)**
    completed **and** the role below assigned. If you have not enabled Exchange for the tenant yet, do
    that first — until then every Exchange tab, these two included, stays on sample data.

Two tabs, **Audit Log** and **Compliance Policies**, read through the Microsoft 365 **Security &
Compliance (Purview)** endpoint rather than Exchange Online, and that endpoint requires a **directory
role** that app consent cannot grant on its own. Until it is assigned, those two tabs show a
"permission required" notice instead of data; every other Exchange tab is unaffected.

Assign the **InfraSOS EXO Runner** application the **Compliance Administrator** role (it includes the
*View-Only Audit Logs* permission the unified audit log search requires):

**Entra admin center → Roles and administrators → Compliance Administrator → Add assignments →**
search for **InfraSOS EXO Runner → Add.**

!!! note "After granting the role"
    Role changes can take a few minutes to take effect; reopen the tab after a short wait. The
    **unified audit log** also has ingestion latency, so recent actions can take 30 minutes or more to
    appear, and **Compliance Policies** is empty until your tenant actually has retention, DLP or
    eDiscovery policies configured.

## Keeping permissions current

When 365 Command adds a capability that needs a new permission, connected tenants are flagged with
an **update available** note. **Refresh permissions** (reporting) or **Refresh access** (management)
re-runs consent and picks up the new scopes, without disturbing what already works.
