# Cardly

Create professional business cards in seconds with Cardly - a modern, intuitive business card generator.

🌐 **Live Demo**: [https://cardly-cze7j2ken-elon-jangs-projects.vercel.app](https://cardly-cze7j2ken-elon-jangs-projects.vercel.app)

## ✨ Features

### Core Features
- 🎨 **Multiple Themes**: Choose from 6 beautiful color themes (Light, Dark, Cream, Navy, Pastel, Earth)
- 📐 **Multiple Layouts**: 6 professional layouts (Standard, Bold, Geometric, Elegant, Creative, Organic)
- 🖼️ **Custom Images**: Upload and manage your own images with Supabase storage
- 🎭 **Image Gradient Overlay**: Add soft gradient fades to images
- 💾 **Save Cards**: Store unlimited business cards with your account
- 📥 **Export**: Download cards as PNG or PDF

### User Management
- 🔐 **Authentication**: Secure signup/login with Supabase Auth
- 👤 **User Profiles**: Save your personal information for quick card creation
- 🖼️ **Custom Image Library**: Your uploaded images are saved permanently
- 🚫 **Duplicate Prevention**: Prevents saving duplicate cards and images

### UX Features
- 📱 **Responsive Design**: Works perfectly on mobile and desktop
- 🎯 **Toast Notifications**: Clear feedback for all actions
- 🔄 **Real-time Updates**: Saved cards list updates instantly
- 🎨 **Modern UI**: Clean, polished interface with smooth animations

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: CSS with CSS Variables
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage / localStorage
- **Export**: html-to-image, jsPDF
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/elon-jang/cardly.git
cd cardly
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up the database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the SQL scripts in order:
     - `create_business_cards_table.sql`
     - `create_user_profiles_table.sql`
     - `create_custom_images_table.sql`

5. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
cardly/
├── src/
│   ├── components/       # React components
│   │   ├── CardForm.jsx       # Card input form
│   │   ├── CardPreview.jsx    # Card preview display
│   │   ├── SavedCards.jsx     # Saved cards grid
│   │   ├── UserProfile.jsx    # User profile management
│   │   └── Toast.jsx          # Toast notifications
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── ToastContext.jsx   # Toast notifications state
│   ├── pages/            # Page components
│   │   ├── Login.jsx          # Login page
│   │   └── Signup.jsx         # Signup page
│   ├── utils/            # Utility functions
│   │   ├── cardService.js          # Card CRUD operations
│   │   ├── userProfileService.js   # Profile CRUD operations
│   │   ├── customImageService.js   # Custom image CRUD operations
│   │   └── export.js               # Export to PNG/PDF
│   ├── lib/
│   │   └── supabase.js       # Supabase client
│   ├── App.jsx           # Main app component
│   └── index.css         # Global styles
├── create_*.sql          # Database schema files
└── README.md
```

## 🗄️ Database Schema

### business_cards
Stores saved business cards with all design settings.

### user_profiles
Stores user profile information for quick card creation.

### custom_images
Stores user-uploaded custom images permanently.

## 🚢 Deployment

The app is deployed on Vercel:
- **Production**: [https://cardly-cze7j2ken-elon-jangs-projects.vercel.app](https://cardly-cze7j2ken-elon-jangs-projects.vercel.app)

To deploy your own instance:
```bash
npx vercel --prod
```

## 📝 License

MIT

## 🙏 Acknowledgments

Built with [Claude Code](https://claude.com/claude-code)
