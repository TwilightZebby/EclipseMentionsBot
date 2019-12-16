---
# EclipseMentions Bot

A small Bot which aims to expand the current Mention system on Discord!

Invite the Bot to your Server by clicking here!

---

## What does this Bot do?

Since the current Mention system is a *bit* weak, I thought I'd try to improve it!

This Bot will expand the "Can everyone `@mention` this Role" Permission on Servers/Guilds.
Now, using the Bot, you can specify *which* Roles can `@mention` other Roles!

**Note:** I should mention that this Bot does NOT affect/change/etc the actual Server Role Settings screen! That would be against Discord's ToS!

**Note 2:** Additionally, any Role you have stored in this Bot's Database *MUST* have its `Allow @mention of this Role` Permission enabled! (Well, the Roles you want to prevent/allow `@mentions` of anyways!)

**Note 3:** Furthermore, the `@everyone` and `@here` Roles/Mentions are NOT SUPPORTED WITH THIS BOT! Well, not at the moment anyways....

---

## Example please!

Say you have 4 Roles - **@everyone**, **Anime Night**, **Mod**, and **Owner**.
You have the "**Anime Night**" Role as a self-assignable Role (through another Bot) - but only want "**Owner**" to be able to `@mention` it.

With the current system, you'd have to allow *everyone* to be able to `@mention` that Role. But with this Bot, you can limit the "`@Anime Night`" mentions to just the Owner Role!

---

## How does this Bot prevent @mentions?

Simple really.

- First the Bot checks if a message contains an `@mention`. *Role Mentions only, not User/Channel!*
> If it does **NOT**, nothing happens.

- Then, it grabs the Roles the User who sent the `@mention` has. *This User is known as the Author*
> The `@everyone` Role is **IGNORED**

- Now, going from *highest* to lowest, the Bot checks each of the Author's Roles against the Database.
> If there are **NO** matches, nothing happens!
> The Bot will take the first match (if any) and goes onto the next step

- Using the first match, the Bot then grabs the database entry containing *both* the Author's Role and the `@mentioned` Role.
- Now, using said entry, the Permission is checked.
> If the saved permission is "allow" - nothing else happens!
> Else if the saved permission is "deny" - the message gets deleted; and the Bot pings one to the Author explaining why.

*Basically, it's a Ladder Permission System. Ones at the top will override below ones if both are saved to the Database.*

---

## Is there going to be a punishment system for blocked Mentions?

I currently don't have plans to add a Punishment System into this Bot.

Currently, the only thing that happens after a `@mention` is deleted, is that the User is sent a message explaining that they do *not* have the permissions to `@mention` that Role.

---

## Ideas/Suggestions

If you want to suggest something, either create a thing in the Issues Tab above (I'll mark it as "Suggestion"); OR throw it my way on Discord/Twitter, and I'll add it there for you.

---

This Bot uses Discord.js v12.

[Official Documentation for Discord.js v12](https://discord.js.org/#/docs/main/master/)

---
