<!-- Generated from docs/product/30-operations.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# Operations

## Where the product keeps things

| What | Where |
| --- | --- |
| Program files | `C:\Program Files\InfraSOS\AD Command` |
| Database, settings and logs | `C:\ProgramData\InfraSOS\AD Command` |

The data directory is restricted to SYSTEM and Administrators, and the service re-applies that
restriction every time it starts.

## Who can do what

You sign in with Windows Integrated Authentication - the account you are already using. The product
has no separate password, no user database and nothing to reset.

| Role | Can |
| --- | --- |
| Administrator | Everything: deploy a controller, change settings, collect a support bundle |
| Operator | Run assessments, generate reports, accept a risk against a finding |
| ReadOnly | Read everything. Change nothing |

Administrator is granted by membership of `BUILTIN\Administrators`, `Domain Admins` or
`Enterprise Admins`. Every other authenticated account gets ReadOnly.

To delegate without granting domain-level privilege, name your own groups in `appsettings.json` on
the domain controller:

```
"Authentication": {
  "AdministratorGroup": "InfraSOS Admins",
  "OperatorGroup": "InfraSOS Operators"
}
```

Either value may be a group name, `DOMAIN\Group`, or a SID. **Prefer the SID.** A group that is
renamed silently stops granting the role, which locks out the people who were meant to have it while
the setting still looks correct.

These are configured on the server rather than from the console, deliberately: a setting that
decides who may change settings should not sit behind the same door. The groups in force are written
to the product log at every service start, so a typo is findable.

### There is no login page, and no sign-out

The console shows the account you are signed in to Windows with, in the top right. Open it to see
the full account name, how you authenticated, and which of the three roles the product has given
you. If you hold none of the groups above, the console says so in a banner rather than leaving you
to discover it: everything is visible, and the controls you cannot use are switched off with the
role they need written on them.

There is no sign-out button because there is no session to end. Your browser re-authenticates from
the Windows token it already holds on every request, so a sign-out control would appear to work and
change nothing. To use a different account, sign in to Windows as that account, or open the console
in a separate browser profile.

## Monitoring more than one domain controller

The Monitoring page reads the Windows Security log on the controller the product is installed on.
That is a real limit and worth understanding before you rely on it.

**Active Directory replicates the directory, not the event log.** A group membership changed on
DC02 is written to DC02's Security log. DC01 receives the resulting directory object through
replication and writes no audit event for it, because the "Directory Service Changes" subcategory
audits originating writes rather than inbound replication. So a product reading only its own log
reports the changes made on its own host and says nothing about the rest - which on a domain with
four controllers is most of them.

### What to do in this release

**Install InfraSOS AD Command on each domain controller.** Each installation is authoritative for
its own host: its Monitoring page shows that controller's events, and its security assessment
checks that controller's local configuration - the firewall profiles, the Print Spooler, LSASS
protection and LDAP signing are all per-machine settings that can and do differ between
controllers. One console per controller is therefore not only the available answer, it is the
accurate one.

### What is deliberately not recommended

**Do not make a domain controller a Windows Event Forwarding collector.** It works, and it is the
wrong shape. A collector holds the Security logs of every controller in the domain, which makes it
one of the highest-value targets in the estate; putting that role on a domain controller adds
inbound collection surface and continuous log write activity to the most privileged machine you
own. Keep collection off your controllers.

If this host already receives forwarded events for reasons of your own, the product reads the
`ForwardedEvents` log as well as `Security` and merges the two, and the Domain controller column
names the origin of each event. That is there so existing forwarding is not ignored, not as a
recommendation to set it up.

### What is coming

A single domain-wide view belongs to the planned **member server** deployment mode
(`docs/adr/0007-member-server-deployment-mode.md`), where the product runs on a domain-joined member
server, the controllers are configured as Windows Event Forwarding **sources** by Group Policy, and
the member server is the collector. No software is installed on any controller, nothing needs inbound
access to them, and the collector is an ordinary member server that can be rebuilt without touching
the directory.

## Backing it up

The product holds no directory data of its own - the directory is the record, and this product reads
it live. What is worth backing up is `C:\ProgramData\InfraSOS\AD Command`:

- `infrasos-ad-command.db` - assessment history, accepted risks and the administrator audit log.
- `settings.json` - your settings, if you have changed any.

Losing them costs you the history and the record of who accepted what. It does not affect the domain.

## Upgrading

Install the newer MSI over the existing installation. The database and settings are preserved; a
downgrade is refused. Settings live outside Program Files precisely so an upgrade cannot revert them.

## Logs

Written to `C:\ProgramData\InfraSOS\AD Command\Logs`, one JSON object per line, rolling at 10 MB and
keeping the most recent 14 files by default. The service also reports its lifecycle to the Windows
Application event log, which is where to look first if it will not start.

Change the level and retention on the **Settings** page. Trace and Debug are deliberately not offered
there: on a domain controller they write directory reads at volume into a file that support bundles
send onward.

## Raising a support request

**Support** collects a single zip containing the product's own view of itself: version, host role,
domain summary, controllers, replication, the current assessment and its history, recent directory
changes, and the log files.

It contains **no credentials of any kind**. Settings are reported from a fixed list of names rather
than by copying the configuration file, so a secret added to that file in a future release cannot
reach the bundle by being overlooked.

It does contain your security findings and the names of your domain controllers - together, a
description of where the domain is weak. Send it over a channel you would be willing to send the
security report over.

## The management endpoint

Bound to port 8443 and restricted at the Windows Firewall to the instance's VPC ranges. The rule is
re-evaluated at every service start, so it follows the instance if it moves VPC.

Check **AWS Integration** for whether it is genuinely restricted. A firewall rule attached to a
disabled firewall profile achieves nothing while looking like protection, so the page reports the
rule and the effective restriction separately.
