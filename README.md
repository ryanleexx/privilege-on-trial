# Privilege on Trial

A choose-your-own-adventure game on s128(2) of the Evidence Act 1893, made for the LPP Seminar Q3(a) presentation.

## Play online

https://ryanleexx.github.io/privilege-on-trial/

## Open it

Keep `index.html` and `content.js` in the same folder and double-click `index.html`. It needs no internet connection, server or install. It works in Chrome and Edge.

If the game fails on the day, present from `backup-slides.md` instead.

## Presenter keys

| Key | Action |
|---|---|
| `1` to `4` | Pick choice A to D (on the home screen: 1 First Email, 2 Second Email, 3 Debrief) |
| `Enter` or `→` | Next (on the debrief screen: reveal the next panel) |
| `←` | Back |
| `R` | Restart the current email |
| `H` | Home |
| `F` | Show or hide the Facts panel |
| `S` | Show or hide the score |
| `T` | Light or dark theme |
| `V` | Vote timer on or off (30 seconds, off by default) |
| `Space` | Restart the vote timer |
| `W` | On the Second Email verdict: open the what-if fork |

## Edit the content

All text is in `content.js`. You never need to touch `index.html`.

- `cards`: blocks of prose. Each segment is `{ text, tag }`, where `tag` is `HOLDING`, `OBITER`, `COMMENTARY` or `STATUTE`. Leave `tag` out for untagged prose.
- `nodes`: each question and its choices. `type` is `CORRECT`, `ARGUABLE`, `DEAD END` or `VALID ROUTE`. A node is either one `CORRECT` choice or a fork of two or more `VALID ROUTE` choices. A `VALID ROUTE` can have `followUp: { label, card }`, which shows the other route on a second screen. `card` lists the card ids shown after a pick. `rebuttal` lists the card ids shown after an `ARGUABLE` pick. `sharedCard` is shown after every pick on that node, with the correct answer highlighted.
- `emails`: the order of nodes in each playthrough, the verdict text, and an optional `whatIf` node opened from the verdict screen. Optional nodes are not scored.
- `italicTerms`: case names, textbook short names and Latin that are italicised automatically wherever they appear.

Strings use backticks, so straight and curly quotes and apostrophes can be typed as normal.

After editing, run both commands from this folder (Node.js required):

```bash
node build-backup.js
```

```bash
node check-content.js
```

`build-backup.js` regenerates `backup-slides.md` from `content.js`. `check-content.js` fails if:

- any card screen has no pinpoint (for example `at [63]` or `at 565`) and no `STATUTE` tag
- any string contains an em dash or a semicolon, or a spaced section reference such as `s 128`
- any node does not have exactly one `CORRECT` choice (or, for a fork, two or more `VALID ROUTE` choices and no `CORRECT`)
- a card id or tag is invalid, or an `ARGUABLE` choice has no rebuttal
- `backup-slides.md` is out of date with `content.js`

One card is exempt from the pinpoint rule because it quotes only the email: First Email, Purpose node, option C (marked `factsOnly: true`).
