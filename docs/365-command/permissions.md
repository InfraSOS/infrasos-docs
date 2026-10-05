# Permissions

365 Command uses three Entra applications, and they are kept separate on purpose: signing in,
reading (reporting), and writing (management) each request only what that job needs, so no one is
ever shown more access than they are actually turning on.

The consent screen Microsoft shows you is always the authoritative list for a given tenant. This
page explains what each permission is for.

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
| **Privileged Role Administrator** | Assign a directory role | You can only assign roles at or below your own privilege |

Assign a role in the customer tenant: **Entra admin center → Roles and administrators →** the role
**→ Add assignments →** search for the **InfraSOS Command - Management** application. Admin consent
to the app does **not** assign these roles; it is a separate, deliberate step.

!!! warning "The two privileged actions are a bigger ask"
    Reset MFA and Assign role need the roles above, which are more privileged than the User
    Administrator baseline. Treat them as advanced, opt-in actions: a customer can run every other
    management action without granting them. When one is attempted without its role, the failure
    names the exact role to assign.

## Keeping permissions current

When 365 Command adds a capability that needs a new permission, connected tenants are flagged with
an **update available** note. **Refresh permissions** (reporting) or **Refresh access** (management)
re-runs consent and picks up the new scopes, without disturbing what already works.
