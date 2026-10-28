# stories

Scripted chapter content: one JSON file per chapter, referenced by
`Chapter.script_ref` (relative path from this directory).

## Format

```json
{
  "start_node": "start",
  "nodes": {
    "start": {
      "text": "...",
      "choices": [
        { "text": "...", "next": "node_id", "score_delta": { "affection": 2 } }
      ]
    },
    "some_ending": {
      "text": "...",
      "ending": true
    }
  }
}
```

`score_delta` keys are `affection` / `trust` / `chemistry` (all optional,
default 0). A node with `"ending": true` has no choices and ends the chapter.

Each character currently has one chapter (`<slug>/chapter_1.json`), seeded via
`python -m scripts.seed_chapters`.
