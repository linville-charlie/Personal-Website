---
title: "Post title goes here"
description: "One or two sentences. This becomes the meta description and the card text on /blog, so keep it under about 155 characters."
pubDate: 2026-08-02
# updatedDate: 2026-09-01
tags: ["AI", "agents"]
draft: true
# Fill these in AFTER you syndicate. Outbound pointers only — this page is
# the canonical home, which is the entire point of publishing here first.
# substackUrl: "https://clinville.substack.com/p/your-post"
# xUrl: "https://x.com/CharlieLinvill2/status/..."
---

Write the post in Markdown. The first paragraph carries the most SEO weight —
lead with the actual claim, not a preamble.

## Use h2 for sections

Aim for 800+ words. Posts shorter than about 300 words read as thin content and
can drag down the whole site's quality signals.

Inline `code` works, and so do fenced blocks:

```python
def hello():
    return "world"
```

> Blockquotes work too.

**Publishing checklist**

1. Set `draft: false`
2. Deploy, and confirm the post is live at `/blog/<filename>`
3. Wait for Google to crawl it — check Search Console, usually a day or two.
   Publishing here first is what establishes this page as the original.
4. Post an **excerpt** to Substack — roughly the first 150–250 words — ending
   with a link back to the full post here.

   Do NOT paste the full text into Substack. Substack hardcodes its own
   `rel="canonical"` and gives you no way to point it at this site, so a full
   copy there becomes a duplicate that outranks this page on the strength of
   Substack's domain. An excerpt has nothing to deduplicate against.
5. Come back and fill in `substackUrl`
