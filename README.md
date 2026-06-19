# Chinese Character Alchemy

Static browser game prototype for merging Chinese characters.

## Run Locally

From this folder:

```powershell
python -m http.server 5173
```

Then open:

```text
http://localhost:5173/
```

If `python` is not on PATH on Windows, try:

```powershell
py -m http.server 5173
```

The checked-in `dist/` files are what the page loads. If you edit the TypeScript in `src/`, rebuild with a local/global TypeScript compiler:

```powershell
tsc -p .
```
