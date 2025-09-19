# 🌐 GovConnect - Report, Resolve, Reward

A full-stack web application connecting citizens with government officials for faster civic issue resolution. Citizens can report problems like potholes, garbage, streetlights, and drainage issues, while government officials can track, manage, and resolve these complaints efficiently.

## ✨ Features

### 🏠 Landing Page
- **Title**: GovConnect – Report, Resolve, Reward
- **Tagline**: "Connecting citizens with government for faster civic issue resolution"
- **Dual Login System**: Separate portals for citizens and government officials
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

### 👥 Citizen Portal
- **Registration/Login**: Secure authentication with name, email, mobile, password, and optional Aadhaar
- **Dashboard**: Overview of complaint statistics and recent reports
- **Submit Complaints**: Upload photos, add descriptions, and geotag locations using Google Maps API
- **Track Status**: Monitor complaint progress (Pending → Verified → In Progress → Resolved)
- **Reward System**: Earn points for valid reports
- **Profile Management**: Update personal information and view complaint history

### 🏛️ Government Portal
- **Secure Access**: Protected login for government officials
- **Complaint Management**: View and filter complaints by type, status, and priority
- **Map Interface**: Interactive map showing all complaints with Leaflet integration
- **Status Updates**: Update complaint status and add resolution notes
- **Analytics Dashboard**: 
  - Complaint trends over time
  - Area-wise heatmaps
  - Resolution statistics and performance metrics
- **Data Export**: Download complaint data in CSV and PDF formats

### 🔧 Technical Features
- **Frontend**: React.js with Tailwind CSS for modern, responsive UI with glassmorphism design
- **Backend**: Node.js with Express.js REST API
- **Database**: SQLite with Sequelize ORM (ready for production PostgreSQL)
- **Image Storage**: Cloudinary integration for photo uploads
- **Maps**: Google Maps API and Leaflet for geolocation
- **Authentication**: JWT-based secure login system
- **Security**: Rate limiting, CORS, helmet, and input validation
- **Responsive**: Mobile-first design with modern animations and micro-interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- SQLite (included) or PostgreSQL for production
- Cloudinary account (optional for image uploads)
- Google Maps API key (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd govconnect
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=govconnect
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb govconnect
   
   # The application will auto-create tables on first run
   ```

5. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start separately
   npm run server    # Backend on port 5000
   npm run client    # Frontend on port 3000
   ```

## 📁 Project Structure

```
govconnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── middleware/        # Express middleware
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── package.json
│   └── server.js
├── package.json            # Root package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register/citizen` - Citizen registration
- `POST /api/auth/register/government` - Government official registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Citizen Routes
- `GET /api/citizen/profile` - Get citizen profile
- `PUT /api/citizen/profile` - Update citizen profile
- `GET /api/citizen/dashboard` - Get dashboard statistics
- `GET /api/citizen/complaints` - Get citizen's complaints
- `GET /api/citizen/rewards` - Get reward points

### Government Routes
- `GET /api/government/profile` - Get official profile
- `PUT /api/government/profile` - Update official profile
- `GET /api/government/dashboard` - Get government dashboard
- `GET /api/government/complaints-map` - Get complaints for map view
- `GET /api/government/area-stats` - Get area statistics
- `GET /api/government/performance` - Get performance metrics

### Complaints
- `POST /api/complaints` - Submit new complaint
- `GET /api/complaints` - Get all complaints (government)
- `GET /api/complaints/my-complaints` - Get citizen's complaints
- `GET /api/complaints/:id` - Get specific complaint
- `PATCH /api/complaints/:id/status` - Update complaint status
- `DELETE /api/complaints/:id` - Delete complaint

### Analytics
- `GET /api/analytics/trends` - Get complaint trends
- `GET /api/analytics/heatmap` - Get heatmap data
- `GET /api/analytics/resolution-stats` - Get resolution statistics
- `GET /api/analytics/export/csv` - Export to CSV
- `GET /api/analytics/export/pdf` - Export to PDF

## 🎨 Customization

### Styling
- **Colors**: Modify `client/tailwind.config.js` for custom color schemes
- **Components**: Edit React components in `client/src/components/`
- **Layout**: Adjust responsive breakpoints in Tailwind config

### Features
- **Categories**: Add new complaint categories in `server/models/Complaint.js`
- **Rewards**: Modify reward point calculation in complaint submission
- **Validation**: Update input validation rules in route files

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Render/Heroku)
```bash
cd server
npm start
# Set environment variables in your hosting platform
```

### Environment Variables for Production
```env
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.com
DB_HOST=your-production-db-host
DB_PORT=5432
DB_NAME=govconnect_prod
DB_USER=your_prod_username
DB_PASSWORD=your_prod_password
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Password Hashing**: bcrypt for secure password storage
- **SQL Injection Protection**: Sequelize ORM with parameterized queries

## 📱 Mobile Responsiveness

- **Mobile-First Design**: Built with mobile devices in mind
- **Touch-Friendly Interface**: Optimized for touch interactions
- **Responsive Grid**: Flexible layouts that adapt to screen sizes
- **Progressive Web App Ready**: Can be installed on mobile devices

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **Push Notifications**: Real-time updates for complaint status changes
- **AI Integration**: Smart categorization and priority assignment
- **Multi-language Support**: Internationalization for different regions
- **Advanced Analytics**: Machine learning insights and predictions
- **Integration APIs**: Connect with existing government systems

---

**Built with ❤️ for better civic management and citizen engagement**
