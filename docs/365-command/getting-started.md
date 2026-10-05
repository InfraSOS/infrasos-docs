# Getting started

365 Command runs in the browser at [command.infrasos.com](https://command.infrasos.com). There is
nothing to install. Getting going is three steps: sign in, start a subscription, and connect your
first tenant.

## What you need

- A **Microsoft 365 work or school account** to sign in with. A personal Microsoft account cannot be
  used.
- To connect a tenant, someone who can **grant admin consent** in that tenant - a Global
  Administrator, or a Privileged Role Administrator. This can be you, or an administrator you send
  the consent link to. You do not need to be an administrator of your own tenant just to sign in.

!!! note "Reporting vs management"
    Signing in and connecting a tenant gives you **reporting** (read-only). Turning on
    **management** actions is a separate, optional consent covered in
    [Connecting tenants](connecting-tenants.md). You can run the whole product read-only and never
    enable management at all.

## Sign in

Browse to [command.infrasos.com](https://command.infrasos.com) and sign in with your Microsoft work
account. The first time, Microsoft asks you to approve the sign-in application reading your basic
profile (your name, email and nothing else). This is the sign-in step only - it grants no access to
any directory data.

## Start your subscription

New accounts begin a **30-day free trial** automatically, with no card required. If you reached
365 Command through the Microsoft commercial marketplace, your subscription is activated from the
marketplace instead and billed on your Microsoft invoice.

You can report on and manage tenants throughout the trial. When it ends, the console keeps your
connected tenants and settings and simply asks you to choose a plan to carry on.

## Connect your first tenant

With no tenants connected yet, the console opens on the **Tenants** page and prompts you to add one.
Connecting a tenant is an admin-consent step in that tenant's own Microsoft sign-in - it grants
365 Command read access and makes the tenant's reports available. The full walkthrough, including
how to connect tenants you are not an administrator of, is in
[Connecting tenants](connecting-tenants.md).

## Finding your way around

- The **left rail** lists the reports and tools: the overview, Users, Groups, Licences, Mail,
  SharePoint, Teams, Devices, the Security pages, Intune, and - for managing - the Management
  console. Managing more than one tenant adds the **Global View** across all of them.
- The **tenant switcher** at the top selects which connected tenant you are looking at. Every report
  and action applies to the tenant selected there.
- Reports load live from Microsoft Graph. A short cache keeps paging and tab-switching fast; the
  **Refresh** control on a report re-reads it.

## Next

- [Connecting tenants](connecting-tenants.md) - the consent flow in detail, enabling management, and
  connecting customer tenants as an MSP.
- [Permissions](permissions.md) - every permission each application requests, and why.
