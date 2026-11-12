# Velle Navidad 2026: Scenes to Generate

Nov 9, 2026 · Companion to [navidad-2026-creative-plan.md](navidad-2026-creative-plan.md)

The full, current list (including V11's N1, N2, N2b, PRAY and V4's S1) with sketches and copyable prompts is in the [Navidad 2026 Storyboards](https://claude.ai/artifact/RjAAqjy8NbNfrhtgMeRaAK) page. This file keeps the first scenes for reference.

V1–V4 already have a first cut made from the existing clips (see `Ads/Campaña Noviembre 2026/Edits/out`). The scenes below fill the gaps. Make each still in Gemini, then animate it in ads-generator → Simple Scene Generation (Kling 3.0, 5 s, Standard, about $0.70 each). Reference images are in `Edits/refs`.

Always attach `PRODUCT_off_on.webp` (or `PRODUCT_lit.jpg`) in Gemini so the artwork matches the real frame: unlit = white print, a small child walking alone, "Siempre estaré contigo. Salmo 73:23"; lit = golden light, Jesus holding the child's hand. The frame is small: 17.5 × 23.5 cm, about the size of a sheet of paper folded once. Ask for a vertical 9:16 image every time.

## Needed

### 1. ON-G: grandma switch-on close-up (V1, V5)

Fills the cut between "Apagado…" and "…encendido" in V1. Use Kling with a **start and an end image**, so the light comes on exactly as the product does.

- **Gemini, start image.** Attach `G3_grandma_unlit.png` and `PRODUCT_off_on.webp`. Prompt: *"Vertical 9:16 close-up of the same scene: the elderly woman's wrinkled hands hold the unlit wooden frame on the white dresser. A young woman's hand in an olive-green knit sleeve reaches in and rests her finger on the small round button on the frame's white cable. Same warm, dim room, candle and cotton branch softly out of focus. Phone-camera look, natural skin, no text added."*
- **Gemini, end image.** Same chat: *"Now the same image with the frame switched on: it glows warm gold from inside and shows Jesus holding the child's hand, exactly like the attached product photo. The glow lights up her hands and face. Nothing else changes."*
- **Kling prompt (start + end image):** *"Static close-up. The finger presses the button on the cable and the frame lights up from within with a warm golden glow. The elderly hands stay still, the light spreads softly over them. No camera movement."*
- **Used as:** 2 s of it, between G3 and G4.

### 2. ON-P: grandpa switch-on close-up (V2, V5)

- **Gemini, start image.** Attach `P4_grandpa_table_unlit.png` and `PRODUCT_off_on.webp`. Prompt: *"Vertical 9:16 close-up of the unlit wooden frame on the same wooden side table with dried flowers and small photo frames, soft daylight from the window. A woman's hand in a beige cardigan sleeve rests her finger on the small round button on the frame's white cable. Phone-camera look, no text added."*
- **Gemini, end image.** *"Same image with the frame switched on, glowing warm gold, Jesus holding the child's hand, exactly like the attached product photo."*
- **Kling prompt (start + end image):** *"Static close-up. The finger presses the button and the frame lights up from within with a warm golden glow. Soft daylight, no camera movement."*
- **Used as:** 2 s, between P4 and P6.

## Recommended

### 3. XMAS: Christmas end card (all videos)

None of the current clips look like Christmas. One shot under every end card fixes that.

- **Gemini.** Attach `PRODUCT_lit.jpg`. Prompt: *"Vertical 9:16 photo of the lit frame (exactly like the attached product) standing on a wooden sideboard in a Spanish living room at night. Beside it a small Christmas tree with warm fairy lights, a simple wooden nativity figurine and two gifts wrapped in kraft paper with red ribbon. Warm, cosy, phone-camera look, slightly soft focus in the background. Leave the top third calm and dark enough for text."*
- **Kling prompt:** *"Very slow push-in toward the glowing frame. The fairy lights twinkle softly. Nothing else moves."*

### 4. K1 again in 9:16

The kid clip (`scene-213a014a`) is 4:5, so in Reels it plays over a blurred band. Ask Gemini to extend the original still to 9:16 (*"Extend this image to a vertical 9:16 frame, adding more of the same room above and below. Change nothing else."*), then animate it with the same Kling prompt as before.

## Optional, for more montage moments

### 5. GIFT: wrapping it under the tree (V3 hook c)

- **Gemini:** *"Vertical 9:16, overhead view of a woman's hands wrapping the unlit frame in kraft paper with a red ribbon, on a wooden floor next to a lit Christmas tree. Phone-camera look."*
- **Kling:** *"Her hands fold the paper over the frame and tie the ribbon. Slight handheld movement."*
- **Hook text:** "Ya tengo el regalo de toda la familia"

### 6. PRAY: mother and son praying at bedtime (V4)

- **Gemini:** attach the K2 still so the room and child match. *"Same bedroom and boy. His mother sits on the bed beside him; they hold hands with eyes closed, praying. The lit frame on the bedside table is the only light."*
- **Kling:** *"They pray quietly, the boy opens one eye and smiles at his mother. Static camera."*
- **Caption:** "Rezamos juntos antes de dormir"

## When a scene is done

Save the MP4 in `Campaña Noviembre 2026` and add it to the ad's file in `Edits/cuts/` (see `Edits/README.md`), or send it to Claude to place and re-render.
