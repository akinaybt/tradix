# Tradix

**A modern web-based stock trading and portfolio management platform with real-time market data, intuitive UI, and comprehensive analytics.**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [License](#license)

---

## Overview

Tradix is a full-stack web application that empowers users to:
- **Track portfolios** with real-time stock market data
- **Search and explore** stocks across multiple exchanges
- **Analyze performance** with interactive charts and trends
- **Access market insights** with localized pricing and currency conversion
- **Manage profiles** with personalized user settings

Built with a modern tech stack combining **Express.js** backend and responsive **HTML/CSS/JavaScript** frontend, Tradix provides a seamless experience for both novice and experienced traders.

---

## Features

### Home Dashboard
- Welcome greeting with user profile
- Total portfolio value display with daily gains/losses
- Portfolio performance charts (1D, 1W, 1M, 1Y timeframes)
- Personalized watchlist with real-time stock prices

### Markets Page
- Browse and search stocks across all exchanges
- Real-time pricing and percentage changes
- Trend indicators (up/down/flat)
- Advanced market snapshot retrieval

### Portfolio Management
- View all holdings and positions
- Track portfolio performance over time
- Analyze individual stock performance
- Portfolio value distribution and allocation

### User Profile
- User authentication and account management
- Profile customization
- Settings and preferences
- Session management with auth guards

### Stock Detail View
- Comprehensive stock information and metrics
- Historical price charts (EOD and intraday data)
- Volume and trend analysis
- Support for multiple timeframes (1D, 1M, 3M, 1Y)

### Localization Features
- Automatic location detection by IP
- Multi-currency conversion support (USD, EUR, GBP, JPY, etc.)
- Country-specific market data
- Real-time FX rate conversion

### UI Features
- Dark/Light theme toggle
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility-focused components

---

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and gradients
- **JavaScript (ES6+)** - Interactive UI and client-side logic
- **Bootstrap 5** - Responsive grid and components
- **Google Fonts (Inter)** - Professional typography

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External APIs
- **MarketStack** - Real-time and EOD stock market data
- **Twelve Data** - Intraday candlestick data
- **Frankfurter** - Foreign exchange rates
- **IP-API** - Geolocation and country detection
- **Supabase** - User authentication and database (if configured)

### Deployment
- Static file serving via Express
- Containerization ready with Node.js


## 📁 Project Structure
