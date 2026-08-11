# Cryptography Researchers of India (CRIYPT)

[cryptography-research-india.github.io](https://cryptography-research-india.github.io) — a community-driven platform connecting cryptography researchers across India and the Indian diaspora.

The site includes:

- **[People](https://cryptography-research-india.github.io/people/)** — a searchable, filterable directory of researchers, filterable by topic and sector
- **[Labs](https://cryptography-research-india.github.io/labs/)** — researchers grouped by lab/group, derived automatically from the People data (no separate content to maintain)
- **[Positions](https://cryptography-research-india.github.io/positions/)** — open PhD, postdoc, and industry openings
- **[Collaborations](https://cryptography-research-india.github.io/collaborations/)** — community requests for co-authors, implementation partners, students
- **[Posts](https://cryptography-research-india.github.io/posts/)** — community blog
- **[Resources](https://cryptography-research-india.github.io/resources/)** — curated learning material

The homepage also surfaces a **Recent Papers** feed, pulled weekly from the [IACR ePrint Archive](https://eprint.iacr.org/) for anyone listed in the People directory.

For the project's mission and background, see the [About](https://cryptography-research-india.github.io/about/) page.

---

## Contributing

### Adding or editing content

Most content on this site is submitted through GitHub Issue Forms, which trigger an automated workflow that opens a PR for a maintainer to review — no local setup needed. [Open a new issue](https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues/new/choose) and pick a template:

| Template | Use it to |
|---|---|
| **Add Researcher** | Add yourself or a colleague to the People directory |
| **Edit My Profile** | Update or add optional links (ORCID, Scholar, photo, etc.) on an existing listing |
| **Post a Position** | Advertise an open research position |
| **Post a Collaboration Request** | Invite the community to collaborate on something you're working on |
| **Add Resource** | Suggest a resource for the Resources page |
| **Submit Blog Post** | Write a post for the community blog |

Submissions are validated automatically (`.github/scripts/validate_submissions.rb`) before a maintainer merges them.

### Contributing code

For layout, styling, or automation changes, fork the repo, make your changes, and open a pull request against `master`.

**Local development** (via Docker — no local Ruby/Jekyll install needed):

```bash
docker run --rm -it -v "$PWD":/srv/jekyll -p 4000:4000 jekyll/jekyll:4 \
  sh -c "bundle install && bundle exec jekyll serve --host 0.0.0.0"
```

Then open `http://localhost:4000`.

### Repo structure

- `_pages/`, `_layouts/`, `_includes/` — site pages and templates (People, Labs, Positions, Collaborations, Posts, Resources, etc.)
- `_data/*.yml` — structured data backing the People, Labs, and Collaborations pages, plus the controlled vocabularies (`topics.yml`) and the auto-fetched `recent_papers.yml`
- `_plugins/person_filters.rb` — custom Liquid filters used by the People/Labs templates
- `_positions/`, `_resources/` — Jekyll collections
- `assets/css/main.scss`, `assets/js/main.js` — all styling and client-side behavior (custom-built, no external theme)
- `.github/ISSUE_TEMPLATE/` — the submission forms described above
- `.github/workflows/process-submissions.yml` — turns issue submissions into PRs
- `.github/workflows/fetch-recent-papers.yml` — weekly job that opens a PR with new papers from IACR ePrint for the homepage feed
- `.github/workflows/fetch-researcher-photos.yml`, `.github/scripts/fetch_photos.py`, `.github/scripts/resize_photo.py` — download and resize researcher photos submitted via issue forms
- `.github/scripts/validate_submissions.rb` — CI validation run on submission PRs

## Troubleshooting

Questions about Jekyll itself (not specific to this site) are best asked on the [Jekyll Forum](https://talk.jekyllrb.com/) or [Stack Overflow](https://stackoverflow.com/questions/tagged/jekyll). For anything else, [open an issue](https://github.com/cryptography-research-india/cryptography-research-india.github.io/issues) or email cryptography.research.india@gmail.com.
