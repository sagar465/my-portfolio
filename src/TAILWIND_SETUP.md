# Tailwind CSS v4 Setup Instructions

Your portfolio is using **Tailwind CSS v4** (alpha), which has a different setup process than the stable v3. Follow these steps to ensure Tailwind styles work correctly:

## 🚀 Quick Fix Steps

### 1. **Install the correct Tailwind dependencies**
```bash
npm install -D tailwindcss@4.0.0-alpha.25 @tailwindcss/vite@4.0.0-alpha.25
```

### 2. **Clear node_modules and reinstall** (if styles still don't work)
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. **Start the development server**
```bash
npm run dev
```

## ✅ Verification

Your portfolio should now display with proper styling including:
- Clash Display font family
- Dark/light mode toggle working
- Responsive layout and spacing
- Card backgrounds and borders
- Animation effects

## 🔧 Troubleshooting

### If styles are still not working:

1. **Check browser console** for any errors
2. **Verify Vite dev server is running** on http://localhost:5173
3. **Check if CSS is loading** in browser DevTools > Network tab
4. **Try hard refresh** (Ctrl+Shift+R / Cmd+Shift+R)

### Common Issues:

**Issue**: Classes like `bg-background`, `text-foreground` not working
**Solution**: Ensure you're using Tailwind v4 alpha (not v3)

**Issue**: Dark mode not switching properly
**Solution**: Check if the `dark` class is being added to `<html>` element

**Issue**: Animations not smooth
**Solution**: Verify Motion/Framer Motion is installed: `npm list motion`

## 📋 What Makes This Setup Special

### Tailwind v4 Features Used:
- **CSS Custom Properties**: All colors defined as CSS variables
- **Inline Theme**: Uses `@theme inline` syntax instead of config file
- **Vite Plugin**: Direct integration with Vite (no PostCSS config needed)
- **Modern CSS**: Uses OKLCH color space for better color accuracy

### Custom Design System:
- **Clash Display Font**: Professional typography
- **Dark/Light Themes**: Comprehensive color system
- **Performance Optimized**: CSS variables for instant theme switching
- **Consistent Spacing**: Design tokens for layout consistency

## 🎨 Customizing Colors

To change theme colors, edit `/styles/globals.css`:

```css
:root {
  --primary: #your-color;
  --background: #your-bg-color;
  /* ... other variables */
}

.dark {
  --primary: #your-dark-color;
  --background: #your-dark-bg-color;
  /* ... other dark variables */
}
```

## 🚨 Important Notes

1. **No tailwind.config.js**: Tailwind v4 uses CSS-based configuration
2. **No PostCSS config**: The Vite plugin handles everything
3. **Alpha version**: Some features may change in future releases
4. **Browser support**: Modern browsers only (Chrome 90+, Firefox 88+, Safari 14+)

If you continue to have issues, the fallback is to downgrade to Tailwind v3, but v4 provides significant performance benefits for this portfolio.