<!-- Generated from docs/product/40-troubleshooting.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# Troubleshooting

## The console will not load

Check the service is running:

```
Get-Service InfraSOSADCommand
```

It starts as Automatic (Delayed Start), so after a reboot it deliberately waits for AD DS, DNS and
Netlogon to settle before starting. Give it a minute.

If it is running and the page does not load, check you are reaching port 8443 from inside the VPC.
The firewall rule permits the instance's VPC ranges and nothing else.

Startup failures are reported to the Windows Application event log, which is readable even when the
console is not.

## The security page says nothing is being recorded

**Monitoring** reads the Windows Security log. If the audit subcategories it depends on are switched
off, there is nothing to read - and an empty list means "nothing is being recorded", not "nothing
happened". The page says which of the two applies.

Finding `SEC-AUDIT-001` on the Security page lists the subcategories that are missing and how to
enable them.

## A finding I fixed still shows

Findings are as fresh as the last scan. Use **Run new scan** on the Security page; it evaluates the
whole pack against the live directory rather than re-reading a cache.

If the finding still shows, the scan is telling you the change did not take effect. Group Policy
settings need to replicate and refresh - `gpupdate /force` on the domain controller, then scan again.

Some findings report a count rather than a pass or fail. Removing three of five over-privileged
accounts leaves the control failing and the score unchanged; the scan reports it as a finding
updated, which is the product telling you the work registered.

## The score dropped and nothing changed

Check the control-pack version. Adding controls lowers scores without anything on the machine
changing, which is why scores are only comparable within one pack version and why the page says so
rather than showing a delta across the change.

## Replication or DNS looks wrong

**Domain Health** reports what the directory says about itself. The product does not modify
replication or DNS - it reads and reports. Use the finding's evidence to work out which controller
disagrees with which, then resolve it with the usual Active Directory tools.

## Collecting evidence for support

**Support** produces a zip with everything the product knows about its own state, including the
logs. Attach it to the request. It is usually the difference between a description of a problem and
a diagnosis of one.
