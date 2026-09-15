<!-- Generated from docs/product/20-security-assessment.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# The security assessment

The **Security** page evaluates a versioned pack of Active Directory controls against your domain
and scores the result.

## Reading the page

It leads with a count of things to fix rather than a percentage, because the count is what you act
on. Below it is the movement since the last **scheduled** scan - "up from 20% on 8 September,
3 issues fixed" - and one recommended starting point. A scan you run yourself is not recorded, so
running two in a row compares both against the same point rather than against each other.

Findings are listed worst first. Expanding one shows the evidence the product read, how to fix it,
and any caution worth knowing before you do.

## How the score works

Every failing control removes a proportion of what is left, weighted by severity:

| Severity | Removes |
| --- | --- |
| Critical | 40% of the remaining score |
| High | 15% |
| Medium | 5% |
| Low | 1% |

Passing controls never add to the score. That is what stops a large pack of easy checks diluting a
critical failure, and it means adding controls can never quietly raise anybody's score.

Two rules matter when reading a number:

- **A failing Critical control caps the score at 49**, whatever the arithmetic says.
- **A control that could not be evaluated is never a pass.** It is reported as Not evaluated and
  caps the score at 89, because "we could not check" is not "healthy".

A score of **0 means no data**. An assessed domain never reads zero, however bad it is.

The full algorithm is published so you can reproduce any score by hand. See `scoring.md`, shipped
with the product.

## Scores are only comparable within a control-pack version

Adding controls changes what is achievable. Every score carries the pack version that produced it,
and where the version changes the page says so instead of showing a drop that no change to your
domain caused.

## Accepting a risk

Some findings are deliberate: a break-glass account that has never signed in, an old protocol a
particular application still needs. Acknowledge the finding with the reason and an expiry, and it is
recorded with who accepted it.

**Acknowledging does not raise the score.** The score measures the domain, not the team's opinion of
the domain. If acknowledging moved it, any environment could be made green by accepting everything.

## Automatic assessments

The assessment runs once a day by default, so the history builds even on a domain controller nobody
signs into. Change the schedule on the **Settings** page.

It does not run while a deployment is in progress, and it does not run before the instance is a
domain controller - in both cases the findings would describe a machine mid-change.
