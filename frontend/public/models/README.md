# models

VRM character models and animations go here.

No `.vrm` files are seeded in this repo — the app falls back to a simple
procedural placeholder avatar (see `components/3d/placeholder-avatar.tsx`)
until real models are supplied. To add one:

1. Create or source a licensed VRM model (e.g. via VRoid Studio, or a
   licensed asset you have rights to use). Keep it non-sexualized and not
   based on a real person's likeness - matches this project's content
   policy (see root `README.md` Safety section).
2. Place the `.vrm` file here, e.g. `public/models/ananya.vrm`.
3. Set that character's `vrm_model_url` in the database (e.g.
   `/models/ananya.vrm`) - `CharacterAvatar` will load it automatically and
   map our emotion strings to the model's VRM expression presets
   (`happy`/`relaxed`/`neutral`/`sad`/`surprised`/`angry`).
