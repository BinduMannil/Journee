# Journee UI Dos and Don’ts

## Core Direction

Journee is a premium, cinematic, emotion-led travel experience. It should feel closer to Aman, Apple, Saint Laurent, Aston Martin, and a luxury editorial magazine than Expedia, Booking.com, Tripadvisor, or a generic SaaS dashboard.

The product starts with feeling, mood, atmosphere, and desire. It must not start with forms, filters, maps, bookings, or generic destination search.

## Typography

### Do

- Use Playfair Display for large editorial headings only.
- Use Montserrat for all body text, navigation, labels, buttons, cards, captions, and supporting copy.
- Keep typography elegant, spacious, and restrained.
- Use generous letter spacing for logo, navigation, and small uppercase labels.
- Use large, confident heading sizes on hero screens.
- Keep body text clean, readable, and premium.

### Don’t

- Do not use Inter.
- Do not use Poppins.
- Do not use Lato.
- Do not use Open Sans.
- Do not use system sans-serif as the visible design choice unless Montserrat fails to load.
- Do not mix random serif fonts.
- Do not use decorative script fonts.
- Do not use playful, startup-style, or SaaS-style typography.

## Visual Style

### Do

- Use full-screen cinematic photography or video.
- Prefer atmospheric destinations, luxury stays, quiet landscapes, architecture, nature, and emotionally rich scenes.
- Use dark overlays for readability.
- Keep UI minimal and spacious.
- Let photography and typography carry the experience.
- Use warm luxury tones: ink, sand, muted gold, soft stone.
- Make the page feel immersive, editorial, and premium.
- Use slow, elegant transitions.
- Use hover states that feel cinematic and intentional.

### Don’t

- Do not use icons on the hero experience cards or mood options.
- Do not use random line icons, hearts, mountains, crowns, bulbs, sparkles, or decorative symbols.
- Do not use numbered cards.
- Do not use emoji.
- Do not use cartoon illustrations.
- Do not use generic travel stock imagery.
- Do not use bright SaaS colors.
- Do not use heavy glassmorphism.
- Do not use loud gradients.
- Do not use cluttered cards.
- Do not make the UI look like Expedia, Booking.com, Tripadvisor, Airbnb clone, or a dashboard.

## Screen 1 Direction

### Do

The first screen must be emotional, not functional.

Preferred structure:

- Full-screen cinematic background.
- Top-left JOURNEE logo.
- Top-right Sign In only.
- Large hero headline:
  “Where do you want to disappear to?”
- Small subtext:
  “Travel begins with a feeling.”
- Mood options displayed as premium expandable typography panels or spacious text-led cards:
  - Recharge
  - Adventure
  - Romance
  - Inspiration
  - Luxury
  - Surprise Me

Each option may include short supporting copy.

Examples:

Recharge  
Quiet places.  
Slow mornings.  
Deep exhale.

Adventure  
Discovery.  
Movement.  
Stories worth telling.

Romance  
Beauty.  
Connection.  
Unforgettable evenings.

### Don’t

- Do not write “cinematic travel intelligence platform” on the hero screen.
- Do not use the phrase “not just places”.
- Do not add About in the top navigation.
- Do not add a hamburger menu unless the full navigation exists.
- Do not add icons inside the mood cards.
- Do not make six cramped equal cards if they do not have enough space.
- Do not make the hero feel like a form.
- Do not start with destination search.
- Do not start with filters.
- Do not start with booking.

## Cards and Interaction

### Do

- Prefer expandable cards or typography-led options.
- Default state may show 3 prominent options and secondary options below.
- On hover, the selected option should expand or become more prominent.
- Other options should gently reduce emphasis.
- Background image or video may change based on hovered option.
- Use smooth crossfades.
- Keep card copy short.
- Make each option feel like an emotional doorway.

### Don’t

- Do not cram six narrow cards into one row on desktop if the text feels tight.
- Do not force all options to be equal if one should be featured.
- Do not use hard borders unless they are subtle and elegant.
- Do not use busy card interiors.
- Do not add CTA buttons inside every card.

## Background Behavior

### Do

- Use a curated set of cinematic background images or videos.
- Background should rotate slowly.
- Recommended timing: every 60 to 90 seconds.
- Use slow crossfade transitions.
- Hovering a mood option may temporarily preview a matching background.
- Keep motion subtle and premium.

### Don’t

- Do not use fast carousel behavior.
- Do not rotate every few seconds.
- Do not use abrupt transitions.
- Do not use loud video cuts.
- Do not use generic slideshow controls.

## Copywriting

### Do

- Use short, elegant, emotionally clear copy.
- Keep language premium and human.
- Use “Travel begins with a feeling.”
- Use “Where do you want to disappear to?”
- Write like a luxury editorial brand.

### Don’t

- Do not use startup buzzwords.
- Do not use AI clichés.
- Do not overexplain the technology.
- Do not say “powered by AI” on Screen 1.
- Do not use generic travel marketplace copy.

## Implementation Rule

Every future UI task must check this file before changes are made.

If a requested UI change conflicts with this file, ask for confirmation before proceeding.

If the design requires a new pattern, update this file first, then implement the UI.
