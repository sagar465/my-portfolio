# Portfolio Setup Instructions

Welcome to your modern portfolio website! This guide will help you get started and customize the site with your own information.

## 🚀 Quick Setup (5 minutes)

### Step 1: Environment Setup
1. **Install Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org)
   - Verify installation: `node --version`

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - You should see your portfolio running!

## 📝 Customizing Your Portfolio

### Update Your Personal Information

**Primary file to edit: `/data/resume-data.ts`**

#### 1. Profile Section
```typescript
profile: {
  name: "Your Full Name",
  title: "Your Professional Title",
  tagline: "Your professional tagline or elevator pitch",
  avatar: "path/to/your/photo.jpg", // See avatar setup below
  location: "Your City, State",
  email: "your.email@example.com",
  links: {
    linkedin: "https://linkedin.com/in/your-profile",
  },
}
```

#### 2. Professional Experience
Update the `experience` array with your work history:
```typescript
experience: [
  {
    company: "Company Name",
    role: "Your Role",
    Location: "City, State/Country",
    period: "MM/YYYY – Present",
    stack: ["Technology", "Stack", "Used"],
    achievements: [
      "Your key achievements",
      "Quantify impact where possible",
      "Focus on results and technologies"
    ],
  },
  // Add more experiences...
]
```

#### 3. Skills Section
Organize your technical skills by category:
```typescript
skills: {
  backend: ["Java", "Node.js", "Python", "..."],
  frontend: ["React", "Angular", "Vue.js", "..."],
  cloud: ["AWS", "Azure", "Docker", "..."],
  aiTools: ["GitHub Copilot", "Cursor", "..."],
}
```

#### 4. Projects
Showcase your best work:
```typescript
projects: [
  {
    name: "Project Name",
    description: "Brief description of the project and its impact",
    tech: ["React", "TypeScript", "Node.js"],
    image: "project-hero-image-url",
    link: "https://project-demo-url.com",
    screenshots: [
      "screenshot-1-url",
      "screenshot-2-url",
      // Add 3-4 screenshots
    ],
  },
]
```

### 🖼 Setting Up Your Avatar

#### Option 1: Use Your Own Photo (Recommended)
1. **Prepare your photo**:
   - Square aspect ratio (1:1) works best
   - High resolution (at least 400x400px)
   - Professional headshot style
   - Good lighting and clean background

2. **Upload to a reliable image host**:
   - **GitHub**: Create a repo, upload image, use raw URL
   - **Imgur**: Upload and get direct image URL
   - **Cloudinary**: Free tier with optimization
   - **Your own website**: If you have hosting

3. **Update the avatar URL**:
   ```typescript
   avatar: "https://your-image-host.com/your-photo.jpg",
   ```

#### Option 2: Professional Stock Photo (Temporary)
The current setup includes a professional stock photo that you can use while preparing your own image.

### 🎨 Customizing Design & Colors

#### Update Brand Colors
Edit `/styles/globals.css` to change the color scheme:

```css
:root {
  --primary: #your-brand-color;
  --secondary: #your-accent-color;
  --background: #your-bg-color;
  /* ... other color variables */
}
```

#### Change Typography
The site uses Clash Display font. To use a different font:

1. **Update the font import**:
   ```css
   @import url('https://fonts.googleapis.com/css2?family=Your+Font:wght@300;400;500;600;700&display=swap');
   ```

2. **Update the font-family**:
   ```css
   body {
     font-family: 'Your Font', -apple-system, BlinkMacSystemFont, sans-serif;
   }
   ```

### 📱 Content Customization

#### Section Titles & Subtitles
Edit `/App.tsx` to customize section headings:
```tsx
<Section 
  id="skills" 
  title="Your Custom Title" 
  subtitle="Your custom subtitle"
>
```

#### Adding/Removing Sections
In `/App.tsx`, you can:
- Comment out sections you don't need
- Reorder sections by moving the JSX blocks
- Add new sections by creating components

#### Hobbies with Photos
Update the hobbies section with your interests:
```typescript
hobbies: {
  items: [
    {
      name: "Your Hobby",
      description: "Description of your hobby and why you enjoy it",
      images: [
        "hobby-photo-1-url",
        "hobby-photo-2-url",
        // Add 3-4 related images
      ],
    },
  ],
}
```

## 🔧 Advanced Customization

### Background Animation
The Matrix-style background can be customized:

1. **Change tech icons**: Edit `/components/TechBackgroundSVG.tsx`
2. **Adjust animation speed**: Modify duration values
3. **Change colors**: Update the gradient and glow effects

### Animation Settings
Modify animation behaviors in individual components:
- Scroll trigger thresholds
- Animation durations
- Easing functions
- Stagger delays

### Performance Settings
Adjust performance features in `/App.tsx`:
```typescript
// Background fallback timing
setTimeout(() => {
  setUseSimpleBackground(true);
}, 3000); // Adjust timeout

// Device-based background selection
const shouldUseSimple = window.innerWidth < 768 || navigator.hardwareConcurrency < 4;
```

## 📤 Deployment

### Option 1: Netlify (Recommended)
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag the `dist` folder to netlify.com
   - Or connect your GitHub repo for automatic deployments

### Option 2: Vercel
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

### Option 3: GitHub Pages
1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script** to `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. **Deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

## 📊 SEO & Analytics

### Meta Tags
Update meta information in the HTML head:
- Title tag
- Description
- Open Graph tags
- Twitter Card tags

### Analytics Setup
Add your analytics tracking:
1. Google Analytics 4
2. Google Tag Manager
3. Other tracking tools

## 🔍 Testing Your Changes

### Local Testing
1. **Development server**:
   ```bash
   npm run dev
   ```

2. **Production build test**:
   ```bash
   npm run build
   npm run preview
   ```

### Cross-browser Testing
Test your portfolio on:
- Chrome, Firefox, Safari, Edge
- Mobile devices (iOS Safari, Chrome Mobile)
- Different screen sizes and orientations

### Performance Testing
- Lighthouse audit in Chrome DevTools
- PageSpeed Insights
- Web Vitals measurement

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
- Check Node.js version (18+ required)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run type-check`

#### Images Not Loading
- Verify image URLs are accessible
- Check CORS policies for external images
- Use direct image URLs, not Google Drive share links

#### Animations Not Working
- Check browser support for Motion/Framer Motion
- Verify Intersection Observer support
- Test on different devices and browsers

#### Performance Issues
- Reduce animation complexity
- Enable simple background fallback
- Optimize image sizes and formats

### Getting Help

1. **Check the console** for error messages
2. **Review the DEVELOPMENT.md** for technical details
3. **Test on different browsers** to isolate issues
4. **Check network requests** in browser DevTools

## 🚀 Production Checklist

Before deploying your portfolio:

### Content Review
- [ ] All personal information updated
- [ ] Professional photo uploaded
- [ ] Work experience details accurate
- [ ] Project links working
- [ ] Contact information correct

### Technical Review
- [ ] Build process successful
- [ ] No console errors
- [ ] All images loading
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility verified

### Performance Review
- [ ] Lighthouse score 90+
- [ ] Page load time under 3 seconds
- [ ] Images optimized
- [ ] Animation performance smooth

### SEO Review
- [ ] Meta tags updated
- [ ] Proper heading structure
- [ ] Alt text for images
- [ ] Semantic HTML used

## 🎉 You're Ready!

Your modern portfolio website is now ready to showcase your professional experience and technical expertise. The combination of thoughtful design, smooth animations, and comprehensive content will help you stand out to potential employers and clients.

Remember to:
- Keep your content updated as you gain new experience
- Regularly test the site on different devices
- Monitor performance and user feedback
- Update dependencies periodically

Good luck with your portfolio! 🚀