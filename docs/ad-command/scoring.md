<!-- Generated from docs/scoring.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# InfraSOS AD Command - scoring algorithm

Published so that any customer or auditor can reproduce a score by hand. See
ADR 0005 for why it works this way.

## Algorithm

1. Start with a **retained fraction of 1.0** - the share of a perfect score still standing.
2. For each check whose status is **Failed**, multiply the retained fraction by `1 - weight/100`,
   where the weight comes from severity:

   | Severity | Weight | Removes |
   |---|---|---|
   | Critical | 40 | 40% of what is left |
   | High | 15 | 15% of what is left |
   | Medium | 5 | 5% of what is left |
   | Low | 1 | 1% of what is left |
   | Informational | 0 | nothing |

   A failure removes a **proportion of the remaining score**, not a fixed slice of 100. Ten High
   findings give `0.85^10 = 0.1969`, not `100 - 150`.

3. Multiply by 100 and round half away from zero.
4. If at least one check produced a verdict (`Passed + Failed > 0`), raise the value to a **floor of
   1**. Zero is reserved for the absence of data.
5. If **any** Critical check failed, cap the score at **49**.
6. Otherwise, if **any** check returned Unknown, cap the score at **89**.
7. Assign the band:

   | Score | Band |
   |---|---|
   | 90-100 | Healthy |
   | 70-89 | Good |
   | 50-69 | Needs Attention |
   | 0-49 | Critical |

8. **Override the band** with `Unassessed` if no check produced a verdict - that is, if
   `Passed + Failed == 0`. The numeric value is still computed and returned, so the arithmetic
   stays reproducible, but a caller must not present it as a percentage.

`NotApplicable` checks are excluded entirely and never affect the score.

The bands are **not** an ordinal scale and must never be compared with `<` or `>`. `Unassessed` is
not "worse than Critical" or "better than Healthy": it is the absence of a verdict, which is a
different kind of statement from the other four.

### Worked examples

Reproducible by hand, and asserted by the unit tests named beside each:

| Findings | Arithmetic | Value | Test |
|---|---|---|---|
| 3 High | `0.85^3 = 0.6141` | 61 | `EveryAdditionalFailureLowersTheScore` |
| 7 High | `0.85^7 = 0.3206` | 32 | `FixingAFailureAlwaysMovesTheScore` |
| 10 High | `0.85^10 = 0.1969` | 20 | `FixingAFailureAlwaysMovesTheScore` |
| 20 Low | `0.99^20 = 0.8179` | 82 | `EveryAdditionalFailureLowersTheScore` |
| 1 Critical | `0.60 = 0.60` -> 60, capped | 49 | `ManyPasses_CannotDiluteASingleCriticalFailure` |

## Why proportional deduction and not fixed points

The algorithm originally deducted fixed points from 100, and it saturated. At 15 points per High
finding the seventh floored the score at 0, and the eighth, ninth and tenth changed nothing - so a
customer who fixed three real problems and re-scanned saw **no movement at all**.

This was observed on the lab domain controller: 10 High findings and 9 passing controls reported
**0%**. Beside a list of nine controls that visibly passed, 0% is not read as "very bad", it is read
as "this product is broken".

Proportional deduction has three properties the fixed version lacked, each with a regression test:

- **Every fix moves the number.** No amount of failure saturates the scale, because each deduction
  is taken from what remains (`FixingAFailureAlwaysMovesTheScore`, UNIT-0014).
- **Every additional failure lowers it.** Monotonic in both directions
  (`EveryAdditionalFailureLowersTheScore`, UNIT-0015).
- **An assessed domain never reads 0.** The floor of 1 keeps zero meaning "no data"
  (`AnAssessedDomainNeverReadsZeroHoweverBadItIs`).

Adding controls that most domains pass still cannot raise anybody's score, because passes are not
in the arithmetic at all (`AddingPassingChecksToThePackNeverRaisesAnybodysScore`, UNIT-0016).

## Why deduction and not an average

An average lets breadth hide depth. Fifty passing Low checks alongside one failed Critical check
averages to about 98% - a green dashboard on a domain with a critical exposure. PRD section 9
forbids this, and `ScoreCalculatorTests.ManyPasses_CannotDiluteASingleCriticalFailure` is the
regression test that keeps it forbidden.

## Why "Unknown" is not a pass

A check that could not run has produced no evidence of health. Counting it as a pass would let a
broken collector render a green score - the failure mode most likely to lose a customer's trust.
Unknown is surfaced explicitly and caps the score at Good, so the dashboard can never claim
"verified healthy" on the strength of data it does not have.

## Why a score with no verdicts is not a number

Step 7 exists because steps 1-6 produce a badly misleading answer on their own.

On a standalone server with no directory - which is every customer's first boot, before the wizard
runs - every health check returns Unknown. Nothing is deducted, so the value is 100; the Unknown cap
pulls it to 89; 89 falls in the Good band. The dashboard read **"Domain Health 89% Good"** for a
machine that has no domain at all. The same shape appears whenever every control in a pack is
NotApplicable, because those are excluded from the denominator.

This is the mirror of the rule above. Unknown is never a pass - and a score assembled entirely out
of Unknown must not be presented as a near-pass either. Deduction-from-100 answers "what did we find
wrong?", and when nothing was examined the honest answer is not a high score but no score.

The value is still returned rather than nulled, so the arithmetic remains reproducible by hand and
the counts still explain themselves. It is the **band** that tells the UI and the report to render a
dash instead of a figure, which they both now do.

Regression tests: `ScoreCalculatorTests.EverythingUnknown_IsUnassessedNotGood`,
`EverythingNotApplicable_IsUnassessed`, `NoChecks_IsUnassessedRatherThanAPerfectScore`, and
`ASingleVerdictIsEnoughToBeAssessed` - which guards the other direction, so one real failure among
many unknowns still reports as Critical rather than collapsing to "we do not know".

## Comparability

A score is only meaningful alongside its **control-pack version**. Adding controls to a pack
changes achievable scores, so every `Score`, report and API response carries
`controlPackVersion`, and trend views mark the point where it changed.

## Trend

Every **scheduled** assessment is recorded - value, band, counts and the status of each individual
control - and
each new assessment is reported against the one before it. The comparison is by control, not by
number:

- **Newly passing**: failed on the previous run, passes now.
- **Newly failing**: passed on the previous run, fails now. Reported even when the headline score
  went up, because a domain going backwards is exactly what a single figure hides.
- **Updated**: same verdict, different finding - a *partial* fix. Removing three of five
  over-privileged accounts leaves the control failing, the score identical and the counts
  identical. Compared on status alone, the product answered "nothing has changed" to somebody who
  had just done the work, which reads as "your change did not take". The finding text is therefore
  stored alongside the status and compared with it.
- A control with **no history** - one a newer control pack introduced - counts as neither. Calling
  it "newly failing" would blame a customer for a control the product only just started shipping.

A scan you run yourself from the console is **not** recorded. Only the unattended schedule writes
history, so the series stays evenly spaced whether or not anybody has the page open - a trend built
from points clustered around somebody's working day describes the working day, not the domain. It
also means two on-demand scans in a row compare against the same point, which is the last scheduled
run rather than each other.

The first assessment on a domain has nothing to compare with, and says so; it is not reported as a
delta of zero. History is capped at the most recent 400 runs so a domain controller that is never
tidied cannot fill its disk.

**Only changes are recorded.** The console runs an assessment every time somebody opens it, so an
outcome identical to the last recorded run - same score, same counts, same verdict for every control,
same pack version - is not stored again. The date a reader sees is therefore the last time the
domain was genuinely different, which is what "up from 20% on 8 September" is understood to mean.
Identical totals reached by different controls (one fixed, one broken) are a real change and are
recorded.

Regression tests: `AssessmentHistoryStoreTests` UNIT-0046 to UNIT-0056.
