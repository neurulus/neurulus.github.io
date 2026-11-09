# Neurulus D3HW Server family / GitHub static hosting

A static product page for installation in the website repository at `/server/`. No build system and no dependencies beyond HTML, CSS and JS. All documents and product imagery are bundled locally; the CSS requests the Google DM Sans font, falling back to Arial.

## Install
Copy **the contents of this folder** to your GitHub Pages repository under `/server/`. Commit and publish through the site's existing deployment workflow. The resulting URL is `https://neurulus.com/server/` if that repository serves the custom domain and folder path.

## Content and verification
- Ten exact model identifiers transcribed from the BIS letter.
- All ten have differentiated *proposed reference configurations* in `models.json` and `script.js`. For the static site, `script.js` embeds the product data; change both if editing data manually or regenerate the JS from models.json.
- ICCCVMS uses the PDF configuration: Intel Core i7 4C/8T, 32GB RAM, 10TB HDD, dual GbE and 450W supply.
- Other configurations are **illustrative proposals only**, not backed by BOM/test results or BIS approval for those exact hardware combinations. Do not publish as validated SKUs until reviewed by engineering and regulatory staff.
- Asterisks in some network/memory specifications indicate extra hardware or board-level dependency.
- Actual chassis dimensions and rear I/O should be checked on assembled hardware.
- Product image is illustrative from the customer's supplied asset.
- BIS licence original is downloadable. Licence effective 09 Oct 2026 to 08 Oct 2031 subject to annual compliance.
- The generic brochure remains the previous version.

## Site design note
The live website was consulted for information architecture, editorial copy and brand tone. Direct access to the site's source CSS, SVG sprite/icon system or GitHub repository was **not available**, so this bundle contains a close, self-contained implementation rather than an exact copy of the live stylesheet. For pixel-perfect sharing of its original CSS, put the actual original design tokens/font/assets into this package from the website repository, or import the site’s documented shared stylesheet.

## Files
- `index.html` page content
- `styles.css` visual system and responsive layout
- `script.js` model catalog/filter/detail interaction
- `models.json` editable model configuration source
- `assets/server-tower.png` product image
- `docs/` PDFs of model datasheet, generic brochure, BIS licence
