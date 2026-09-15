# AD Command Pro

**In development.** This page exists so the structure of the site is honest: there is nothing to
download yet, and nothing here describes a product you can buy today.

## What it is

AD Command Pro is AD Command plus the ability to **change** the directory rather than only read it:
unlock, enable, disable and reset accounts, edit group membership and attributes, and the bulk
equivalents of those.

## Why it is a separate product rather than a feature

The difference is not a licence tier, it is **where the software runs**, and that decision is what
makes the write operations safe.

| | AD Command | AD Command Pro |
| --- | --- | --- |
| Runs on | A domain controller | A domain-joined member server |
| Identity | Local SYSTEM | A group Managed Service Account |
| Directory access | Read | Read and write |
| Delivered as | AWS Marketplace AMI | Downloadable MSI |

A service running as SYSTEM **on a domain controller** is bounded only by its own code: Active
Directory cannot meaningfully restrict it, because it is already inside the machine that enforces
the restrictions. Every write it performs is one an attacker who reached the console could also
perform, and the only thing standing in the way is our own authorisation logic.

A service running as a group Managed Service Account **on a member server** holds exactly the rights
somebody delegated to that account, and Active Directory enforces them. A bug in our code cannot
exceed them, and the delegation is visible and auditable using the tools an administrator already
has.

That is the whole argument, and it is why the write features are not simply a button we could have
added to the version you can buy today.

## When

No date. This page will say what it does when there is something to say.
