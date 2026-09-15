<!-- Generated from docs/product/10-deploying-a-domain-controller.md in the AD Command repository. Do not edit here: see
     docs/site/README.md. The copy that ships inside the product is the source of truth. -->

# Deploying a domain controller

The **Deployment** page promotes this instance, either creating a new forest or adding a controller
to a domain that already exists.

## Before you start

Promotion **restarts the instance**. The console is unavailable while it does, and the deployment
continues on its own afterwards - the product records what it was doing and resumes when the service
comes back. You do not need to keep the browser open.

Have ready:

- The domain name (for a new forest) or the domain to join.
- A Directory Services Restore Mode (DSRM) password. Store it somewhere durable: it grants offline
  access to the directory database, it is not governed by domain password policy, and you cannot
  recover it from the product.
- For adding a controller: credentials able to promote into the existing domain.

## Preflight

The wizard runs a preflight before it changes anything. Blocking results stop the deployment;
warnings do not. The distinction is deliberate - a preflight that blocks on advisory findings gets
bypassed, and one that never blocks gets ignored.

Common blocking results:

| Result | What to do |
| --- | --- |
| The instance already is a domain controller | Nothing to do; use the existing domain. |
| DNS cannot resolve the target domain | Point the instance at a DNS server that serves the domain. |
| Insufficient privilege | Sign in with an account that can promote. |

## During promotion

The page shows the stage: preflight, installing features, configuring, promoting, restarting,
validating. After the restart the product picks up where it left off and finishes with a health
check and a security assessment.

## If it fails

The deployment records why in the words an operator can act on, and the state survives a restart.
Nothing is retried automatically - a half-finished promotion is not something to repeat blindly.
Read the failure, fix the cause, and start again.
