# Mockups projets — prompts avec captures d'écran

Workflow : **capture d'écran réelle → IA d'édition d'image → mockup stylisé**.
Tu joins ta capture au prompt ; l'IA construit la mise en scène autour (device, fond, glow).
Compatible **Gemini (Nano Banana)**, **GPT-4o images**, **Firefly**. C'est la méthode utilisée pour Comusphere.

> ⚠️ Règle d'or : l'IA ne doit **jamais réinventer l'interface** — la capture reste telle quelle,
> seul l'habillage est généré. C'est ce qui rend le mockup crédible face à un recruteur.
> Chaque prompt contient une instruction explicite en ce sens.

---

## Style de série (commun à tous)

Pour que les 9 cartes projets soient cohérentes, tous les prompts partagent ce suffixe :

```
STYLE — Keep the screenshot pixel-perfect and unmodified, do not redraw or invent any
UI element. Place it on a deep charcoal background (#0a0a0a) with a soft warm-gold
ambient glow (#C9A96E, ~10% opacity) blooming from behind the device. Subtle film
grain, faint diagonal light streak top-right, premium tech-editorial photography look.
Landscape 16:10, high resolution.
```

Ratio recommandé : **16:10 ou 16:9** (les cartes projets font ~480×280, `object-contain`).

---

## 1 — IDLA Marketplace *(a déjà un vrai screenshot : `/projects/idla-marketplace.jpg`)*

**Capture source :** celle en place (annonces + carte), ou une nouvelle sur `marketplace.investirdanslancien.fr` (pleine page, 1440px).

```
Take this real-estate marketplace screenshot and present it inside a sleek MacBook Pro
16" frame, three-quarter angle, floating over the background. Add a subtle reflection
of the screen on an invisible glass floor. Do not alter the screenshot content.
+ STYLE
```

**Variante duo desktop + mobile** (prends aussi une capture mobile 390px de large) :
```
Compose these two screenshots — desktop marketplace view inside a thin dark browser
window on the left, mobile view inside an iPhone 15 Pro frame slightly overlapping
on the right. Both screens stay pixel-perfect. + STYLE
```

---

## 2 — IDLA Site Vitrine *(a déjà `/projects/idla.jpg`)*

**Capture source :** hero de `investirdanslancien.fr` (celle en place est bien : "+600 projets, 4.9★").

```
Place this website screenshot inside a minimal dark browser window (thin traffic-light
dots, no toolbar clutter), floating at a slight 5° tilt. Behind it, add a large
out-of-focus duplicate of the same screenshot as ambient depth. Screenshot must remain
unmodified. + STYLE
```

---

## 3 — IDLA Back Office & CRM *(aucune image — priorité n°1)*

**Capture source :** lance l'admin en local et capture **le dashboard analytics** et/ou
**le pipeline en kanban**. ⚠️ **Données clients réelles → utilise une base de dev, ou floute
noms/emails/téléphones AVANT de générer le mockup** (l'IA ne doit pas servir d'anonymiseur).

```
Present this internal CRM dashboard screenshot inside a dark browser frame, straight-on
view, floating above the background. Around the browser, add 2–3 small glassmorphism
satellite cards (blank chart shapes only, no readable text) to suggest a rich analytics
suite. The screenshot itself stays pixel-perfect. + STYLE
```

**Variante pipeline :**
```
Show this kanban pipeline screenshot inside a MacBook Pro frame at a slight angle,
with a soft golden glow tracing the column edges. Do not modify the screenshot. + STYLE
```

---

## 4 — Portfolio & Admin CMS *(capture d'avril à rafraîchir)*

**Capture source :** refais 2 captures à jour — le hero public de `www.theivathan.fr` + une vue admin (`/admin` dashboard ou analytics avec la heatmap monde).

```
Compose a split mockup with these two screenshots: left, the public portfolio dark
hero in a browser window; right, the admin analytics dashboard in a second browser
window slightly behind and lower. Symmetric composition, both screenshots untouched.
+ STYLE
```

---

## 5 — Arène Pokémon *(a déjà une capture — mockup pour l'unifier au style)*

**Capture source :** l'écran de combat sur `pokearena-silk.vercel.app`.

```
Place this game battle screenshot inside a dark browser window, floating with a slight
3D tilt. Add faint elemental particle sparks (ember orange, electric yellow) drifting
around the frame edges only — never over the screen. Screenshot stays pixel-perfect.
+ STYLE
```

---

## 6 — Socifun *(a déjà `/projects/socifun.jpg` + logo)*

**Capture source :** le catalogue de jeux (celle en place) ; éventuellement une page jeu en plus.

```
Present this gaming platform screenshot inside a MacBook Pro frame, front view, with
the platform's logo (second attached image) floating as a small glass badge at the
top-left corner of the composition. Do not alter the screenshots. + STYLE
```

---

## 7 — Chatbot IA Discord *(aucune image)*

**Capture source :** ouvre Discord, une conversation où le bot répond (mentionne-le), idéalement avec le bot connecté en vocal visible dans la sidebar. Floute les pseudos si besoin (avant génération).

```
Place this Discord chat screenshot inside a dark desktop app window frame, floating
over the background. Add a subtle audio-waveform motif glowing softly under the window
(suggesting the bot's voice output), Discord blurple (#5865F2) as a secondary accent
in the glow. Screenshot must stay pixel-perfect. + STYLE
```

*Pas de capture possible ?* Fallback génératif honnête : un **diagramme d'architecture** plutôt qu'une fausse UI :
```
Minimal dark architecture diagram: five glassmorphism pill nodes connected by thin
glowing lines — "Discord" → "Node.js bot" → "OpenAI API" → "gTTS" → "Voice channel".
Monospace labels, warm-gold glow on the connections. + STYLE
```

---

## 8 — FabLab *(image générique actuelle à remplacer)*

**Capture source :** si l'IHM PHP tourne encore quelque part, capture la table de gestion des adhérents ou les stats machines. Sinon, photo réelle du matériel (Raspberry Pi + lecteur NFC) si tu l'as.

```
Split composition: left, this web admin screenshot in a dark browser frame; right,
this photo of a Raspberry Pi with NFC reader, softly lit. A thin glowing golden line
connects the two, suggesting hardware-software communication. Neither image may be
altered. + STYLE
```

*Fallback sans aucune capture* (diagramme, pas de fausse UI) :
```
Minimal dark IoT architecture diagram: glassmorphism nodes "NFC badge" → "Raspberry Pi
(C++ UDP server)" → "PHP web admin" → "MySQL", connected by glowing lines, small door
and machine icons, warm-gold accent. Monospace labels. + STYLE
```

---

## Récap priorités

| Projet | État image | Action |
|---|---|---|
| IDLA Back Office | ❌ aucune | **Priorité 1** — capture locale (données anonymisées) |
| Chatbot Discord | ❌ aucune | Capture Discord ou diagramme |
| FabLab | ⚠️ image générique | Capture IHM / photo matériel / diagramme |
| Portfolio & CMS | ⚠️ capture d'avril | Refaire les captures (nouveau design) |
| Marketplace, Vitrine, Pokémon, Socifun | ✓ vraie capture | Mockup optionnel pour unifier le style |

Une fois générés : upload via **`/admin/projects`** (Firebase Storage) — ne pas committer
dans `public/` pour ceux-là, l'admin gère très bien les images distantes.

---

## Alternatives sans IA (rendu propre en 2 minutes)

| Outil | Usage |
|---|---|
| shots.so | Mockup navigateur/device premium |
| screely.com | Frame navigateur en 1 clic |
| brandbird.app | Fond + glow personnalisés |

Workflow : `capture → Screely (frame) → Brandbird (fond #0a0a0a + glow gold)`.
