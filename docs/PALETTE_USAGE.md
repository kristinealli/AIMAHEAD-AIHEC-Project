# FMD Project — palette and chart conventions

## Color Palette

| Role | Name | Hex |
|---|---|---|
| Accent | Rose | `#c98389` |
| Population | Burgundy | `#954e4b` |
| Accent | Peach | `#febd97` |
| Missing category | Sand | `#d6c6bc` |
| Accent | Gold | `#c3a052` |
| Other/unknown race and model | Mauve | `#82667a` |
| Accent/model | Turquoise | `#33c2b1` |
| Population | Evergreen | `#125238` |
| Model/reference | Rust | `#aa663c` |

**Primary color convention (used everywhere):**

- AI/AN alone = **turquoise `#33c2b1`**
- Other identified single-race = **rust `#aa663c`**
- Unresolved/multiracial = **gold `#c3a052`**, only where shown


**Model colors:** logistic rust, LASSO turquoise, random forest gold,
prevalence-only baseline evergreen. Model identity also stays fixed across the 2023
selection and 2025 evaluation charts. Where a plot compares observed and
predicted rates, population is now the fill color. The `Missing` category
always uses sand.
