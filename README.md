# Charlie Linville — Personal Portfolio

Personal portfolio site showcasing my journey, projects, and interests in AI systems and quantum computing.

**Live site:** [charlielinville.me](https://charlielinville.me)

## Tech Stack

- Astro, TypeScript, HTML, CSS, and JavaScript
- Deployed on [Vercel](https://vercel.com)

## Notes

The notes wall is currently hidden from the public site. Its page is preserved
in `src/disabled-pages/notes.astro`, outside Astro’s routes, so `/notes` returns
404 and is excluded from the sitemap. All note content, styles, and scripts
remain in the repository.

To restore it, move the page back to `src/pages/notes.astro`, restore the Notes
entry in `NAV` and the homepage/writing links, restore the related-notes block
in the essay template, and change the `/about` redirect back to `/notes`.

Add one Markdown file per idea in
`src/content/notes/`, using `_template.md` as a starting point. Set `draft: false`
when it is ready to appear. `summary` is optional context for the closed card;
the Markdown body appears when a visitor expands it. A one-line thought can
have just a title and date. Tags power the topic filter. If a note
grows into an essay, set `essay` to the internal path of its published post,
such as `/blog/example-slug`. The note and essay will then link to each other.

Run `npm run check` and `npm run build` before publishing.

## Unlisted Dutch lesson

`public/dutch-game-modeling.html` serves `/dutch-game-modeling`, with supporting
files and the supplied PDF under `public/dutch-game-modeling/`. The lesson links
to the PDF and back to the homepage, but the main site never links into it.
It is excluded from the sitemap and carries HTML and HTTP noindex directives;
this discourages indexing, but the URL and PDF are public, not access-controlled.

Run `npm run check:dutch`, `npm run check`, and `npm run build` before publishing.
