# Distribute the identity as a shadcn registry, not an npm package

The point of this repo is that the author's apps stop drifting apart visually, yet the Registry ships source that the shadcn CLI copies into each app rather than a dependency to import. Each app therefore owns its copy and can edit it, nothing is needed at runtime, and the only supported variation is the two Knobs (`--primary`, `--radius`).

The trade-off: fixes do not propagate by version bump, so apps re-run `shadcn add` to pick them up. We accept that to avoid a published package, peer-dependency coupling with each app's React/Tailwind versions, and runtime lock-in. The built JSON in `public/r` is committed, and CI fails if rebuilding it changes the output, so the served Registry always matches the source.
