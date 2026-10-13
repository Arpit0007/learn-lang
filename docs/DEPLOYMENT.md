# Deployment

The build is a folder of static files, so any static host works. It only has
to send unknown paths to `index.html`, and send a 404 for files that should
exist but don't.

## Build

```bash
npm ci
npm run build                  # → dist/learn-language/browser
```

The output includes `/pglite/`: `pglite.wasm`, `pglite.data` and
`initdb.wasm`. The build copies them from `node_modules/@electric-sql/pglite`.
Together they are about 17 MB, or about 4 MB compressed. A browser downloads
them only when its visitor runs a first SQL example.

## Static hosting

Set up the host to:

1. Serve `index.html` for any path that is not a file, so a link such as
   `/css/flexbox` also works after a reload.
2. Answer **404**, not `index.html`, for a missing file under `/pglite/` or
   `/assets/`. If the host sends `index.html` instead, PostgreSQL fails to start
   with an error such as "Invalid FS bundle size".
3. Compress `.wasm` and `.data` files (`application/wasm` and
   `application/octet-stream`). That turns the 17 MB PostgreSQL download into
   about 4 MB.

The JS and CSS files have hashed names and can be cached for a long time. The
names of the `/pglite/` files don't change between versions, so cache those for
days, not forever.

## Outside services

The page loads its fonts and icons from Google Fonts (`fonts.googleapis.com`
and `fonts.gstatic.com`). If those are blocked, the site still works, but with
fallback fonts, and its icons show as words (such as `dark_mode`). Nothing else
comes from other hosts: PostgreSQL runs from the site's own `/pglite/` folder.
