<!-- Generated from docs/product/25-users-and-groups.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# Users, groups and reports

The **Users & Groups** page is where the directory is read. It opens on an overview and everything
else is a report behind one of the menus along the top.

## The overview

Counts first - users, groups, computers, organisational units, and four populations worth watching:
disabled accounts, accounts that have never signed in, passwords set never to expire, and accounts
the product believes are service accounts. **Every count is a link** to the report behind it.

Below them, **Needs attention** lists only conditions that currently apply. A check that finds
nothing disappears rather than sitting there as a permanent green row. If the list is empty, it says
so in words - that is a result, not a blank page.

Then proportions. A count on its own does not tell you whether four disabled accounts out of 121 is
normal; the rings do. Beside them, privileged group membership and what changed in the directory in
the last 24 hours.

**Outside an organisational unit does not count the built-ins.** `Administrator`, `Guest` and
`krbtgt` are excluded. Active Directory creates them in `CN=Users` on every domain, so counting them
would mean the report is never empty and always contains the same three rows nobody can act on.
krbtgt in particular **must not** be moved. This is why the number here can be lower than the one
you would count by hand in Active Directory Users and Computers.

## The reports

Grouped by what they are about rather than by how they are implemented.

| Menu | What is behind it |
| --- | --- |
| **Users** | All, enabled, disabled, service accounts, password expiry and age, must-change-at-next-sign-in, locked out, never signed in, inactive, recently created or deleted, expiring, and accounts missing a manager or an email address |
| **Groups** | All, large, empty, no owner, recently changed, nested groups, and accounts that belong to an unusual number of groups |
| **Computers** | All, stale, operating system inventory, and local administrator password (LAPS) coverage |
| **Structure** | Organisational units, what each one holds, objects outside an OU, sites and subnets, duplicate identifiers |
| **Security** | Privileged accounts, privileged group changes, AdminSDHolder residue, Kerberos delegation |

## Working with a report

**Filter** with the controls above the table; the count line always says how many of how many you
are looking at, so a filter can never quietly hide rows.

**Columns** opens a picker. The attributes offered come from the product's own allowlist, so a
column cannot be added that the product does not know how to read safely.

**Click a row** to open the object beside the table - its attributes, its group membership, and
where it sits in the directory.

**CSV** exports what you are looking at, filters and all - not the whole directory. That is
deliberate: an export that quietly contained everything when the screen showed six rows would be
believed over the screen. **PDF** uses your browser's own print dialogue.

Any of these reports can be sent on a schedule - see [Scheduled reports](scheduled-reports.md).

## Risky users

The **Risky Users** page answers a different question: not "which accounts match this condition" but
"which accounts carry more than one". An account that has never signed in is worth a look; an
account that has never signed in, holds domain privilege and has a password that never expires is
worth a look today.

Each row lists the individual risks behind it and the control that found each one, so the severity
is traceable rather than asserted.
