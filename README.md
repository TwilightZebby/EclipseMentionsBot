---
# EclipseRoles Bot

A small Bot which aims to expand the current Mention system on Discord!

---

## What does this Bot do?

Since the current Mention system is a *bit* weak, I thought I'd try to improve it!

This Bot will expand the "Can everyone `@mention` this Role" Permission on Servers/Guilds.
Now, using the Bot, you can specify *which* Roles can `@mention` other Roles!

**Note:** I should mention that this Bot does NOT affect/change/etc the actual Server Role Settings screen! That would be against Discord's ToS!

**Note 2:** Additionally, any Role you have stored in this Bot's Database *MUST* have its `Allow @mention of this Role` Permission enabled! (Well, the Roles you want to prevent/allow `@mentions` of anyways!)

---

## Example please!

Say you have 4 Roles - **@everyone**, **Anime Night**, **Mod**, and **Owner**.
You have the "**Anime Night**" Role as a self-assignable Role (through another Bot) - but only want "**Owner**" to be able to `@mention` it.

With the current system, you'd have to allow *everyone* to be able to `@mention` that Role. But with this Bot, you can limit the "`@Anime Night`" mentions to just the Owner Role!

---

## How does this Bot prevent @mentions?

Simple really.

- The Bot listens out for a `@mention`, specifically one mentioning a *Role*.
- It then checks the *highest Role* of the User which sent that `@mention`.
- (It also checks *which* Role was `@mention`ed)
- Then, it checks the settings saved by the Owner of the Server.
- If the author Role of the Mention is granted permission to `@mention` the sent Mention, then nothing else happens.
- If the author Role of the Mention is *denied* permission, then the Bot deletes the Message containing the `@mention`.
- *If an `@mention` is deleted, then the Bot will dump a message for the sender. This can also assist in deleting those Ghost Pings!*

---

## Is there going to be a punishment system for blocked Mentions?

I currently don't have plans to add a Punishment System into this Bot.

Currently, the only thing that happens after a `@mention` is deleted, is that the User is sent a message explaining that they do *not* have the permissions to `@mention` that Role.

---

## Ideas/Suggestions

If you want to suggest something, either create a thing in the Issues Tab above (I'll mark it as "Suggestion"); OR throw it my way on Discord/Twitter?

I have a personal Ideas list [over here](https://github.com/TwilightZebby/EclipseRolesBot/wiki) at the Wiki of this Repo.

---

This Bot uses Discord.js v12.

[Official Documentation for Discord.js v12](https://discord.js.org/#/docs/main/master/)

---
