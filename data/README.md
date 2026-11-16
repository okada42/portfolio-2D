# Adding projects (works.csv)

Edit `works.csv` in Excel, Google Sheets or any text editor. One row = one project.
Push to `main`, and the site rebuilds automatically. The build stops with a clear error message if a value is wrong, so a typo never reaches the live site.

| Column | Required | What to write |
|---|---|---|
| `id` | yes | Short unique name in English, used in links: `clinic-booking` |
| `service` | yes | `web` · `system` · `game` · `mobile` |
| `industry` | yes | `medical` `beauty` `food` `realestate` `construction` `manufacturing` `retail` `education` `professional` `it` `hospitality` `logistics` `staffing` `entertainment` `public` `personal` `other` |
| `siteType` | web only | `hp` `corporate` `lp` `ec` `booking` `media` `recruit` `portal`. Several: `corporate\|booking` |
| `skills` | | Separate with `\|`: `WordPress\|PHP\|MySQL` (new skills appear in the filter automatically). Skill groups (development / design & no-code tools) are listed in `src/taxonomy.js` |
| `year` | | `2025` |
| `featured` | | `yes` to show on the homepage (up to 8, newest first) |
| `sample` | | `yes` shows a "Sample" badge. Leave empty for real projects |
| `thumb` | | Image path, e.g. `works/clinic-booking.webp` (put the file in `public/works/`). Empty = auto-generated placeholder |
| `url` | | Live site link (optional) |
| `title_ja` / `title_en` | ja required | Project title |
| `summary_ja` / `summary_en` | | One or two sentences |
| `role_ja` / `role_en` | | What you did |
| `result_ja` / `result_en` | | Outcome (numbers work best) |

English columns can be left empty; the Japanese text is used instead.
Industry, site type and service names (in both languages) are defined in `src/taxonomy.js`.

**Thumbnails:** 1200×750 px (16:10), WebP or JPG, under 200 KB.
