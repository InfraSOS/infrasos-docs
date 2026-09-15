<!-- Generated from docs/product/27-scheduled-reports.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# Scheduled reports

Any report with a CSV export can run unattended and arrive by email. **Scheduled Reports** in the
navigation lists what is scheduled, when it next runs, and whether the last one arrived.

## Before anything can be sent

Two things, both under **Settings**, in the **Report delivery** section.

**An SMTP relay.** Your own - the product never sends mail through anything of ours. Most internal
relays accept unauthenticated submission from a known host, which needs no credential at all and is
the arrangement to prefer. Where one is needed, the password is stored encrypted to that machine and
**cannot be read back out of the console**; the page shows only whether a password is stored.

Port 25 or port 587 with STARTTLS. Port 465 - implicit TLS - is not supported in this version, and
the settings page says so rather than letting you discover it as a timeout.

**Allowed recipient domains.** Reports contain directory data, so where they may be sent is a
deliberate decision. The list starts **empty, which means nothing can be sent** - that is not an
oversight, it is the safe direction for a mistake. Add the domains reports may go to.

## Creating a schedule

Choose the report, name the schedule, pick daily, weekly or monthly and a time, and add recipients.

- Times are **the domain controller's own local time**, and the form says which zone that is.
- A monthly schedule set to a day the month does not have runs on that month's last day rather than
  being skipped.
- A recipient outside the allowed domains is refused when you save, naming the address and the
  setting that governs it.
- **Send now** runs the schedule immediately, through exactly the same path - including the
  recipient check. A test that could reach addresses the schedule cannot would not be a test.

By default a report with no rows is still sent. "Nothing to report" is information, and a report
that only arrives when there is bad news teaches people to ignore the sender. You can turn that off
per schedule, and the list then says "Nothing to report" rather than "Sent".

## Knowing it is still working

The list shows the last result for every schedule: when it ran, how many rows went, and the relay's
own error if it failed. A failed schedule stays enabled and retries at its next time - a relay being
down on Tuesday is not a reason to stop reporting - but it is shown as failing so that a report
which has quietly stopped arriving is visible.

Every send is written to the administrator audit log: who set the schedule up, which report, to whom
and how many rows.

## What arrives

A CSV attachment, with the message naming the domain, the report, the row count and the schedule.
Where the report reuses a snapshot rather than reading the directory on the way out - the security
assessment does - the message says how old that reading is.
