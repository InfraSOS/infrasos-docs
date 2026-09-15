# Support

## Before you raise anything

Most problems have an answer in [Troubleshooting](ad-command/troubleshooting.md), which covers the
console not loading, the service not starting, an empty or partial directory view, authentication
refusing an account that should have access, and assessments that do not appear to run.

Two of those are worth naming here because they look like faults and are not:

- **"I am a Domain Admin and the console says Read only."** Windows gave the browser a filtered
  token, which marks your administrative groups deny-only. The product is reading your token
  correctly. [Access and roles](ad-command/operations.md) explains it.
- **"I changed a Group Policy setting and the finding has not cleared."** The assessment reads the
  effective configuration, and some settings are read by Windows only when a service starts. The
  finding tells you which, and how to apply it without a reboot where that is possible.

## The support bundle

The console collects everything a support request needs in one file: **Support → Collect support
bundle**.

It contains the product version and control-pack version, host role and service state, a domain
summary with controllers and replication status, the current security assessment and its recorded
score history, normalised directory changes from the last 24 hours, the product log files, and the
configuration reported from a fixed list of setting names.

**It contains no credentials of any kind.** The configuration is reported from a known list of
setting names rather than by copying the configuration file, so a secret added to that file in a
future release cannot be collected by an older bundle either.

It does, however, describe where your domain is weak - it includes the full security assessment.
Treat it as sensitive and send it the way you would send any other assessment of your directory.

## What to include

The bundle plus one sentence about what you expected to happen and what happened instead. If the
problem is visible in the console, a screenshot of the page saves a round trip.

If the console will not load at all and you cannot collect a bundle, say so - the troubleshooting
guide has the commands to run on the domain controller instead, and their output is enough to start
with.

## How to reach us

Support for AD Command is provided through the support contact on its **AWS Marketplace listing**,
which is the channel tied to your subscription.

## What is not supported

- **Changes to your directory.** AD Command only reads. Nothing it does can alter accounts, groups
  or policy, so a request to undo something it changed has no subject - see
  [AD Command Pro](ad-command-pro.md) for the product that writes.
- **Destructive recovery work.** Forest recovery, authoritative restores and DSRM procedures are
  Microsoft's documented processes and are outside what this product does or advises on.
