Here's a clean, professional README ready to copy and paste:

---

# 🛋️ BEBA Furniture - Management Console

A modern, full-stack catalog and order management system built to keep the BEBA Furniture web platform dynamically updated in real-time, completely eliminating the need for manual code updates.

---

## 🚀 The New Approach

**The Old Way:** A static website that quickly became outdated because uploading fresh images of recent works required manual code adjustments, technical overhead, or developer intervention.

**The New Way:** A zero-technical-knowledge-required Admin Dashboard. The business owner can seamlessly manage the entire furniture catalog, upload high-res images, and track incoming custom requests in seconds through an optimized, secure UI.

---

## ✨ Key Features (What's Under the Hood)

Here is everything built into this ecosystem to make management effortless:

- **Zero-Tech CRUD Operations** – Effortlessly add, edit, or delete furniture items from the live catalog without touching a database or a single line of code.

- **Streamlined Media Uploads** – Built-in drag-and-drop imagery system that automatically handles main product covers, detail galleries, and cloud hosting configurations automatically.

- **Native Bilingual Translation (EN / AM)** – A custom tabbed interface optimized to handle product titles, material specifications, pricing models, and descriptions in both English and Amharic natively.

- **Bespoke Custom Order Streams** – A dedicated control panel that instantly pulls, tracks, and manages personalized incoming client requests and custom commissions.

- **Smart Duplicate Prevention** – Built-in verification logic that scans the system for duplicate files, preventing cluttered cloud storage.

- **Ironclad Gatekeeper Authentication** – Secure, role-based session protection powered by Supabase Auth, keeping unauthorized eyes completely locked out of the management suite.

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Lucide React (Icons) |
| **Backend & Security** | Supabase (Database, Auth, and Storage) |
| **Internationalization** | next-intl (Bilingual EN/AM support) |

---

## 📁 Project Structure

```
furniture-app/
├── messages/
│   ├── en.json          # English translations
│   └── am.json          # Amharic translations
├── src/
│   ├── app/
│   │   ├── [locale]/    # Internationalized routes
│   │   │   ├── about-us/
│   │   │   ├── contact/
│   │   │   ├── custom-order/
│   │   │   ├── materials/
│   │   │   └── previous-works/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── Footer.tsx
│   │   ├── FutureVision.tsx
│   │   ├── HandcraftedMasterpieces.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── OrderConfigurator.tsx
│   │   ├── PortfolioGallery.tsx
│   │   ├── ProductDetails.tsx
│   │   └── WelcomeIntro.tsx
│   ├── i18n/            # Internationalization config
│   └── lib/             # Utility functions & Supabase client
├── .env.local           # Environment variables
├── next.config.ts       # Next.js configuration
└── package.json
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Supabase account (for database, auth, and storage)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/furniture-app.git
cd furniture-app
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌍 Internationalization

The application supports both English and Amharic:

- **Default language:** English (`en`)
- **Secondary language:** Amharic (`am`)
- **Translation files:** Located in `/messages/`
- **Framework:** `next-intl`

To add a new translation key:

1. Add the key to both `en.json` and `am.json`
2. Use `useTranslations()` hook in your component

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('YourNamespace');
// Usage: {t('yourKey')}
```

---

## 🔐 Authentication

The admin console uses **Supabase Auth** for secure, role-based access:

- Email/password authentication
- Session management
- Protected routes for admin dashboard
- Unauthorized access is automatically blocked

---

## 🗄️ Database Schema

### Products Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title_en` | TEXT | English title |
| `title_am` | TEXT | Amharic title |
| `description_en` | TEXT | English description |
| `description_am` | TEXT | Amharic description |
| `category` | TEXT | Product category |
| `price` | TEXT | Price in ETB |
| `material` | TEXT | Material used |
| `image_url` | TEXT | Main product image |
| `gallery_images` | TEXT[] | Gallery images |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |

### Orders Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `customer_name` | TEXT | Customer full name |
| `email` | TEXT | Customer email |
| `phone` | TEXT | Customer phone |
| `specifications` | JSONB | Custom order details |
| `status` | TEXT | Order status |
| `created_at` | TIMESTAMP | Creation timestamp |

---

## 📦 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm start
# or
yarn start
```

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/furniture-app)

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Team

- **Project Lead:** [Your Name]
- **Development:** [Your Team]
- **Design:** [Design Team]

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons
- [next-intl](https://next-intl-docs.vercel.app/) - Internationalization

---

## 📧 Contact

For any inquiries or support:

- **Email:** [0mensur01@gmail.com]
- **Website:** [www.bebafurniture.com](https://www.bebafurniture.com)
- **Location:** Arat Kilo, Addis Ababa, Ethiopia

---

**Built with ❤️ in Ethiopia**