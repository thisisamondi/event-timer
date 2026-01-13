# Event Timer Refactor (split into multiple files)

This folder contains a refactor of the original single-file React component into a maintainable structure.

## How to use

Copy the folders into your Next.js project root:

- `app/`
- `components/`
- `hooks/`
- `lib/`

The code assumes:
- Next.js App Router
- Tailwind CSS (classes are used heavily)
- `lucide-react` installed (icons used in Setup/Moderator views)

## Notes

- This refactor keeps the original single-page "view switch" behavior via `view` state.
- When you later move to `/display` and `/moderator` routes, you will want a shared store (e.g. Zustand) or a realtime backend to persist state across routes.
