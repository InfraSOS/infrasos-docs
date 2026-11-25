# Exchange (Mail)

The **Mail** area brings Exchange Online into 365 Command: mailboxes, mail flow, message trace,
distribution lists, delegation, holds, and email security, as reports you can read and actions you
can run, from the same console as the rest of the product.

Like [Management actions](management-actions.md), everything that changes a tenant is off until you
turn it on, granted per tenant, and every change is confirmed and recorded. Reads work as soon as a
tenant is connected; writes need the Exchange runner to be enabled for that tenant.

## How Mail is powered

Graph does not expose the Exchange management surface, so the Mail area is served by the **InfraSOS
Exchange runner**, an isolated, app-only Exchange Online connection scoped to the roles you grant it.
Turning Exchange on for a tenant is a one-time consent, covered in
[Connecting tenants](connecting-tenants.md). Until it is on, the Mail tabs show clearly labelled
sample data so you can see how a tab looks before you connect.

A tab that needs a role the runner does not hold says so in a banner, with the role to assign, rather
than failing silently. The reads keep working; only the part that needs the missing role is affected.

## What is in the Mail area

The area is organised into tabs, grouped into reporting and management:

- **Mailboxes, activity and shared mailboxes.** Who has a mailbox, mail activity, forwarding, shared
  and room mailboxes, and authentication methods.
- **Mail flow.** Message trace, quarantine, mail flow (transport) rules, and connectors.
- **Recipients.** Aliases and proxy addresses, distribution lists, dynamic distribution groups, mail
  contacts, and delegation.
- **Holds and retention.** Litigation holds, the mailbox archive, and in-place holds.
- **Email security (Pro).** Email security posture and recent detections, the email security
  policies, the tenant allow/block list, the unified audit log, and the compliance policies.

## Plans

- The **Mail** area is included from the **Standard** plan up: the reports, and the mailbox, mail
  flow, recipient and delegation management.
- The **email security and compliance** tabs (email security policies, the tenant allow/block list,
  the unified audit log, and DLP, retention and eDiscovery) are a **Pro** feature. On a lower plan
  those tabs show sample data with an upgrade prompt, so you can see what they do before you buy.

See [Plans and billing](plans-and-billing.md) for the full comparison.

## How Mail actions stay safe

The Mail actions run through the same pipeline as every other management action, so the same
guarantees apply:

- **Opt-in per tenant.** Nothing changes a tenant until Exchange is consented for it.
- **Role-aware.** Each write needs a matching Exchange role on the runner (below). A tenant missing
  one keeps every other action working and sees only that one fail, with the role to assign named in
  the message.
- **Portal-role gated.** Writes need an Operator or Admin portal role; Viewers are read-only. The
  higher-impact actions are Admin-only (marked below).
- **Confirmed.** A destructive action asks first and spells out the consequence.
- **Recorded.** Every attempt is written to the per-tenant [audit trail](management-actions.md#the-audit-trail),
  success or failure, and the trail cannot be edited or deleted.

## Recipients and mailboxes

| Action | What it does | Notes |
| --- | --- | --- |
| **Add email alias** | Adds a proxy (alias) address to a mailbox. | Operator+. |
| **Remove email alias** | Removes a proxy address. The primary address cannot be removed this way. | Destructive. Operator+. |
| **Set primary address** | Promotes an alias to the primary reply address; the old primary stays as an alias. | Destructive (changes the reply address). Operator+. |
| **Hide or show in the address list** | Hides a recipient from, or shows it in, the global address list. | Operator+. |
| **Grant mailbox delegation** | Grants Full Access, Send As, or Send on Behalf on a mailbox. | Operator+. |
| **Remove mailbox delegation** | Revokes a delegation. | Destructive. Operator+. |
| **Enable or disable the archive** | Turns the in-place archive mailbox on or off. | Disabling is blocked by Microsoft while the mailbox is under a hold (the message explains). Operator+. |
| **Place or remove a litigation hold** | Puts a mailbox on, or releases it from, litigation hold. | Destructive. Admin-only. Needs an Exchange Online Plan 2 (or E3/E5) licence on the mailbox. |

Directory-synced (on-premises) recipients are read-only in the cloud; those actions are not offered
for them.

## Distribution lists and groups

| Action | What it does | Notes |
| --- | --- | --- |
| **Add distribution list member** | Adds a member to a distribution list. | Operator+. |
| **Remove distribution list member** | Removes a member. | Destructive. Operator+. |
| **Edit distribution list** | Changes list properties (name, moderation, external senders, and so on). | Admin-only. |
| **Set distribution list owner** | Adds or changes the list owner. | Admin-only. |
| **Edit dynamic distribution group** | Changes a dynamic group's properties. | Admin-only. |

Microsoft 365 groups are managed through Graph where that is cleaner; mail-enabled security groups
and on-premises-synced groups have no app-only write path and are read-only.

## Mail flow

| Action | What it does | Notes |
| --- | --- | --- |
| **Message trace details** | Opens the delivery detail for a traced message. | Read-only. |
| **Enable or disable a mail flow rule** | Turns a transport rule on or off. | Admin-only. |
| **Delete a mail flow rule** | Removes a transport rule. | Destructive. Admin-only. |
| **Release quarantined message** | Releases a quarantined message to its recipients. | Admin-only. |
| **Release message and allow sender** | Releases the message and adds its sender to the allow list. | Admin-only. |
| **Deny quarantined message** | Deletes a quarantined message. | Destructive. Admin-only. |
| **Download quarantined message** | Downloads the original message for inspection. | Admin-only. |

## Tenant allow/block list (Pro)

The tenant allow/block list is how you override filtering for a specific sender, domain, URL or file.

| Action | What it does | Notes |
| --- | --- | --- |
| **Add allow/block entry** | Adds an allow or block entry for a sender, URL or file. | Admin-only. Pro. |
| **Remove allow/block entry** | Removes an entry. | Destructive. Admin-only. Pro. |
| **Convert allow/block entry** | Flips an entry between allow and block (Exchange removes and re-creates it; the original is restored if the re-create fails). | Destructive. Admin-only. Pro. |

## Email security policies (Pro)

The **Email security policies** tab manages the Exchange Online Protection (EOP) policies that filter
inbound and outbound mail: anti-spam, anti-malware, anti-phishing, outbound spam, and connection
filtering. It shows each policy's coverage, a gaps list against Microsoft's recommended baseline, and
the per-category protection status.

Two things it cannot manage, because the cmdlets are not available to an app-only connection, are
**Safe Links** and **Safe Attachments** (Microsoft Defender for Office 365). Those appear in the
posture view but cannot be created or changed here.

### Apply baseline

**Apply baseline** writes Microsoft's recommended **Standard preset** settings to your existing
**default** anti-spam, anti-malware, anti-phishing and outbound-spam policies: for example, quarantine
high-confidence phishing, move spam to Junk, turn on zero-hour auto-purge (ZAP) and the safety tips,
and set a sensible bulk threshold. It changes how mail is filtered, so it confirms first, and it
reports per-category exactly what was applied and what, if anything, was not. Admin-only, Pro.

### Create policy

**Create policy** makes a new policy of a chosen type with a preset, and a rule that scopes it:

- **Type:** anti-spam, anti-malware, anti-phishing or outbound spam. (Connection filtering has only
  a single default policy and no custom policies; Safe Links and Safe Attachments are Defender-only.)
- **Preset:** Standard or Strict. Strict quarantines more aggressively.
- **Applies to:** all users, specific recipient domains, or specific groups. When you choose groups,
  you pick from a live, searchable list of the tenant's mail-enabled groups, so the rule binds to a
  real group rather than a typed name. Outbound policies scope by sender; the others by recipient.

The policy and its rule are created together; if the policy is created but its scope cannot be
applied, that is reported as a warning so you can fix the scope without losing the policy. Admin-only,
Pro.

### Per-policy manage

Open a policy to manage it from its detail panel:

- **Apply baseline** writes the Standard preset to that one policy.
- **Enable or disable** turns a custom policy on or off by toggling its rule. The default policy has
  no rule and is always on, so it cannot be disabled (the panel says so).
- **Edit** opens the policy's settings in place (for example the spam, phishing and bulk actions, the
  zero-hour auto-purge toggles, or the phishing threshold) and saves only what you change.
- **Clone** copies the policy's settings into a new policy, with a rule for the scope you choose.
- **Delete** removes a custom policy and its rule. The default policy cannot be deleted.

All are offered only for the four manageable types above, Admin-only, Pro.

## What the runner needs

Each group of actions maps to an Exchange role on the runner application. Granting a role is a change
you make once, in the tenant's Exchange admin centre, on the runner's service principal.

| Actions | Exchange role |
| --- | --- |
| All reads | Global Reader |
| Aliases, delegation, archive, hide from address list, mailbox properties | Mail Recipients |
| Distribution list membership and properties | Distribution Groups |
| Quarantine, mail flow rules, tenant allow/block, email security policies | Transport Hygiene |
| Unified audit log, DLP, retention, eDiscovery | A Microsoft Purview role (Compliance Administrator, plus the eDiscovery role group for cases) |

Global Reader is read-only, so a tenant can connect, read every Mail report, and grant the write
roles only for the actions it actually wants to use.

## The audit trail

Every Mail action is written to the same per-tenant
[action history](management-actions.md#the-audit-trail) as the rest of management, in the portal
under **InfraSOS Log**: who did it, what, to whom, and whether it succeeded. The trail is immutable,
so delegating Mail management to a team never means losing track of who changed what. The
**Entra Audit Log** view covers directory-level auditing beyond 365 Command.
