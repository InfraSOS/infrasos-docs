# Showing real names in reports

In some reports - **Mail** (mailboxes), **SharePoint** (sites), and **Teams** - user, group and site
names can appear as long codes, for example `A7A9458AEBE1F404B4A591F0973B9011`, instead of real
names. The **All SharePoint Files** browser may also report that a site could not be found.

This is a **Microsoft 365 privacy setting**, not a fault in the app, and it is switched on by default
for every tenant.

## Why it happens

Reports that read Microsoft 365 **usage data** - mailbox usage, SharePoint site usage and Teams
activity - are affected by a tenant setting that Microsoft introduced in 2021:
**"Display concealed user, group, and site names in all reports."** While that setting is off,
Microsoft returns these reports with user, group and site names replaced by pseudonymised codes.

Because the SharePoint site codes are concealed rather than real identifiers, the app cannot use them
to open a site's document library, which is why **All SharePoint Files** can return *"site could not
be found"* for those sites.

!!! note "Your figures are still correct"
    Concealed names affect only the **display of names**. Storage, item counts, activity, trends and
    every other figure in these reports are accurate whether or not names are concealed.

## How to show real names

A Global Administrator can turn concealed names off in a couple of minutes. The change applies to the
whole tenant.

1. Sign in to the **Microsoft 365 admin center** at
   [admin.microsoft.com](https://admin.microsoft.com) as a **Global Administrator**.
2. Go to **Settings** > **Org settings**.
3. On the **Services** tab, open **Reports**.
4. Tick **Display concealed user, group, and site names in all reports**.
5. Select **Save**.

Reports read after the change show real names. Microsoft regenerates its usage data periodically, so
names that were already concealed can take a little while to update; reopen the report, or refresh,
once the change has taken effect.

!!! warning "This is a tenant-wide Microsoft setting"
    It affects **every** usage report in your tenant - Microsoft's own reports and any third-party
    tool - not just IT Admin Pro. Some organizations keep names concealed as a matter of privacy
    policy, so check your policy before changing it.

## Reports this does not affect

Reports that read directory and configuration data directly rather than usage data - **Users**,
**Groups**, **Licences**, **Secure Score**, **Intune** and the management actions - always show real
names and are not governed by this setting.
