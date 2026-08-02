---
title: "I got tired of giving daily context to my AI assistant. So I stopped."
description: "Giving Claude a sense it's never had."
pubDate: 2026-04-16
tags:
  - "AI Agents"
  - "MCP"
  - "Claude"
  - "Geolocate Me"
draft: false
substackUrl: "https://clinville.substack.com/p/i-got-tired-of-giving-daily-context"
---

This morning I asked Claude where I’d been. Not what was on my calendar — where my body had actually been.

It gave me a map. Told me I’d been stationary near home until 10:47, went up through Randwick and Moore Park to Surry Hills, and spent 75 minutes on Bourke Street that it described as *“likely a coffee shop or a focused work session.”* It was right — I’d been at a cafe (Artificer Coffee… really good stop if you like specialty coffee), then walked over to the train station, which is where it caught my last ping.

I didn’t tell it any of that.

A month ago I would have had to.

![I got tired of giving daily context to my AI assistant. So I stopped.](/blog/ai-assistant-location-context/img-1.jpg)

---

### Why this exists

I’d spent about a month trying to use an OpenClaw bot as an actual personal assistant. It was good at almost everything — drafting messages, planning my week, giving me reminders, etc. The one thing it could not do was gather any interday or intraday context.

So every morning I typed where I was going. Every evening I typed what I’d done. And during the day I would need to fill it in if I was pulling an audible on my plans. Every meeting, every walk across the city, every coffee, I narrated to a thing that was supposed to be saving me time. The assistant was *pretty* smart but I was its only connection to the real world.

After a few weeks I got annoyed enough to fix it.

### What the fix is

I made Geolocate Me. It is a small iOS and Android app that pings your location in the background and makes it available to any LLM that speaks MCP. No dashboard to open. No app to check. You ask your AI; your AI answers.

That’s the whole product — and it saves tons of time while increasing the usefulness of your AI assistant.

---

### The three things I stopped telling my AI

#### Where I am.

I used to start most requests by typing my location. *“I’m in Surry Hills — where’s the closest place to grab coffee before my 2pm class?”* Now I just ask the second half. The model fills in the first.

#### Where I went.

Yesterday I stopped at a small grocery on the walk back from coffee and couldn’t remember the name. I asked Ella — an agent I run through Discord — *“What grocery did I stop in after going to coffee this morning?”* She traced the route, checked what’s on Crown Street near where I’d paused, and told me: Maloney’s. A block south of the café I'd been at.

I couldn’t have Googled that — I didn’t know the name and I barely knew the street.

#### What I was doing.

This is the one that surprised me. The morning summary above wasn’t just retrieval. The 75-minute block on Bourke Street didn’t come tagged *“coffee.”* The model saw the coordinates, the duration, the time of day, checked against what’s at that address, and knowing me it guessed coffee shop or work session. It was right — and the fact that my last ping was five minutes away at a train station made the story readable rather than contradictory. The model could see I’d had coffee, then left.

That’s the move. Location data by itself is coordinates. Location data inside a reasoning model is narrative. It’s the first time my own data has felt like it was *doing* something instead of sitting in a dashboard waiting for me to look at it.

![I got tired of giving daily context to my AI assistant. So I stopped.](/blog/ai-assistant-location-context/img-2.jpg)

### About the data

Worth saying clearly, because the default assumption for this kind of product is justified and cynical:

No accounts. No email. No ads. Credentials are hashed. Your data expires on the schedule you pick.

This is not Strava. This is not Google Timeline. This is not an ad product that happens to know where you sleep. It’s a row in a database keyed to a token only you have — email [support@guleki.com](mailto:support@guleki.com) and it's gone.

I built it this way because I wanted to use it.

### Try it

You already pay for the intelligence. You’re paying for intelligence without context. A $1.99 a month closes the gap — 30 days of history at Basic, 90 at Standard, a full year at Pro.

[Install for iOS](https://apps.apple.com/us/app/geolocate-me/id6761958740) — [Install for Android](https://play.google.com/store/apps/details?id=com.guleki.geolocateme)

---

[Geolocate Me Website](https://guleki.com/geolocate-me)

[Personal Website](https://charlielinville.me/)
