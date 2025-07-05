# Modern Stock Trading Dashboard

A modern, responsive stock trading platform built with React, Tailwind CSS, and Lucide React icons.

## ✨ Features

### 🎨 Modern UI Design
- **Clean, professional design** with Inter and Poppins fonts
- **Responsive layout** that works on desktop, tablet, and mobile
- **Smooth animations** and transitions using Tailwind CSS
- **Beautiful card-based layout** with shadows and rounded corners

### 🧭 Navigation
- **Collapsible sidebar** with smooth transitions
- **Sticky top navbar** with market indices and user menu
- **Mobile-responsive navigation** with hamburger menu
- **Active state indicators** for current page

### 📊 Dashboard Components
- **Investment summary cards** (Total Investment, Current Value, Returns)
- **Most traded stocks** with price changes and percentages
- **Watchlist management** with search and filtering
- **Products & tools** section with colorful icons

### 📱 Responsive Design
- **Mobile-first approach** with breakpoint-specific layouts
- **Touch-friendly interactions** for mobile devices
- **Adaptive sidebar** that collapses on smaller screens
- **Bottom sheet watchlist** for mobile users

### 🎯 User Experience
- **Hover animations** on cards and buttons
- **Focus states** for accessibility
- **Loading states** and smooth transitions
- **Intuitive navigation** with clear visual hierarchy

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
src/
├── components/
│   ├── Layout.jsx              # Main layout wrapper
│   ├── Sidebar.jsx             # Collapsible navigation sidebar
│   ├── TopNavbar.jsx           # Sticky top navigation
│   ├── ModernSummary.jsx       # Dashboard summary page
│   ├── ModernWatchlist.jsx     # Stock watchlist component
│   └── Dashboard.jsx           # Main dashboard component
├── styles/
│   └── index.css               # Global styles with Tailwind
└── data/
    └── data.jsx                # Mock data for development
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) for main actions and links
- **Success**: Green (#22c55e) for positive changes and gains
- **Danger**: Red (#ef4444) for negative changes and losses
- **Gray**: Neutral grays for text and backgrounds

### Typography
- **Inter** - Primary font for body text
- **Poppins** - Display font for headings and titles

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Consistent styling with focus states
- **Inputs**: Clean design with focus rings
- **Icons**: Lucide React icons throughout

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1280px

## 🔧 Customization

### Adding New Pages
1. Create a new component in `src/components/`
2. Add the route to `Dashboard.jsx`
3. Add navigation item to `Sidebar.jsx`

### Styling
- Use Tailwind CSS classes for styling
- Custom components defined in `src/index.css`
- Follow the design system for consistency

### Icons
- Use Lucide React icons: `import { IconName } from 'lucide-react'`
- Available icons: https://lucide.dev/icons

## 🚀 Deployment

Build for production:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🤝 Contributing

1. Follow the existing code style
2. Use Tailwind CSS for styling
3. Add proper TypeScript types if needed
4. Test on multiple screen sizes
5. Ensure accessibility standards are met

## 📄 License

This project is licensed under the MIT License.
