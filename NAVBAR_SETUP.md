# Navbar Setup Instructions

The navbar is now implemented as a JavaScript component that can be easily added to all pages.

## How to Use

1. **Add the script tag** before the closing `</body>` tag in each HTML page:
```html
<script src="navbar.js"></script>
</body>
```

2. **Remove the existing static navbar** from each page (if present) and replace with:
```html
<!-- Navbar will be inserted by navbar.js -->
```

3. **That's it!** The navbar will automatically:
   - Insert itself at the top of the page
   - Handle mobile menu toggle
   - Highlight the active page
   - Work on all pages

## Files to Update

Apply the navbar to these pages:
- about.html
- contact.html
- documentation.html
- support.html
- gen-ai-factory.html
- hft.html
- modernization.html
- neural-3000.html
- kinetic-pro.html
- quantum.html
- core.html

## Example

Before:
```html
<header>
  <!-- static navbar code -->
</header>
```

After:
```html
<!-- Navbar will be inserted by navbar.js -->
...
<script src="navbar.js"></script>
</body>
```

