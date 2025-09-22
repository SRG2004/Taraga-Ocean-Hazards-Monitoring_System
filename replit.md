# Taranga Ocean Hazard Monitor

## Overview

Taranga is a comprehensive ocean hazard monitoring and reporting platform that enables real-time crowdsourced data collection, social media monitoring, and emergency response coordination for India's coastal regions. The platform serves multiple user roles including citizens, volunteers, officials, and analysts, providing both web and mobile interfaces for hazard reporting, resource management, and situational awareness.

The system integrates Firebase for backend services, interactive mapping capabilities, sentiment analysis for social media monitoring, and a complete donation management system to support disaster response efforts.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### September 22, 2025
- **Complete GitHub Import Setup**: Successfully imported and configured the Taranga Ocean Hazard Monitor project for Replit environment
- **Dependencies**: Installed all npm dependencies for both frontend and backend
- **Firebase Integration**: Configured real Firebase credentials as secure environment variables
  - All Firebase services (Auth, Firestore, Storage) properly initialized
  - Backend reports: "✅ Firebase initialized successfully" and all services connected
- **Dual Server Architecture**:
  - Frontend (React + Vite) running on port 5000 with proxy configuration for API calls
  - Backend (Node.js + Express) running on port 3001 bound to 0.0.0.0 for external access
- **Development & Production Setup**:
  - Vite proxy configured for seamless frontend-backend integration in development
  - Production build created successfully (dist/ folder with optimized assets)
  - Backend properly serves static files only in production mode
- **Resolved Issues**:
  - Fixed all Git merge conflicts in InteractiveMap.jsx and InteractiveMap.css
  - Configured proper host binding and API routing
  - Set up deployment configuration for autoscale target
- **Testing**: Both servers running successfully with health check endpoint responding correctly
- **Project Status**: Fully functional and ready for development and deployment

## System Architecture

### Frontend Architecture
- **React 18.2.0** web application built with Vite for fast development and optimized builds
- **Component-based architecture** with modular CSS files for each major page/component
- **Client-side routing** using React Router DOM for navigation between different dashboards
- **Responsive design** optimized for both desktop and mobile web browsers
- **TypeScript configuration** available for type safety (though currently using JSX)

### Authentication & User Management
- **Firebase Authentication** for user registration, login, and session management
- **Role-based access control** supporting four user types: Citizens, Volunteers, Officials, and Analysts
- **User profile management** with Firestore document storage for extended user data
- **Automatic role-based dashboard routing** after successful authentication

### Data Storage & Backend
- **Firebase Firestore** as the primary NoSQL database for storing:
  - User profiles and authentication data
  - Hazard reports with geolocation and media attachments
  - Volunteer registrations and task assignments
  - Donation records and campaign data
  - Social media monitoring data and sentiment analysis
  - Real-time notifications and alerts
- **Firebase Storage** for media file uploads (photos, videos) attached to hazard reports
- **Real-time data synchronization** using Firestore listeners for live updates

### Mapping & Geospatial Features
- **Dual mapping support** with both Leaflet and Mapbox GL implementations
- **Geolib library** for distance calculations and geospatial operations
- **Interactive hazard visualization** with dynamic hotspot generation based on report density
- **Location-based filtering** and search capabilities
- **Geolocation services** for automatic location detection and tagging

### Analytics & Social Media Monitoring
- **Sentiment analysis** using the Sentiment.js library for social media content
- **Natural language processing** with Compromise.js for text analysis
- **Keyword extraction** for ocean hazard-related content identification
- **Social media trend visualization** and dashboard analytics
- **Real-time data processing** for incoming social media feeds

### Notification System
- **React Hot Toast** for real-time in-app notifications
- **Firebase-based notification storage** for persistent messaging
- **Priority-based alert system** with different urgency levels
- **Multi-channel notification delivery** for critical alerts

### Mobile App Generation
- **React Native compatibility** with build scripts for mobile app generation
- **Capacitor integration** configured for cross-platform mobile deployment
- **Offline capability** planning with sync mechanisms for remote areas
- **Mobile-optimized UI** components and responsive design patterns

## External Dependencies

### Firebase Services
- **Firebase Authentication** - User registration, login, and session management
- **Firebase Firestore** - Primary database for all application data
- **Firebase Storage** - Media file storage for report attachments
- **Firebase Hosting** - Potential deployment target for web application

### Mapping & Location Services
- **Mapbox GL JS** - Primary mapping solution with advanced visualization capabilities
- **Leaflet** - Alternative mapping solution for broader browser compatibility
- **React-Leaflet** - React components for Leaflet integration
- **React-Map-GL** - React wrapper for Mapbox GL

### Data Processing & Analytics
- **TanStack React Query** - Server state management and caching
- **Axios** - HTTP client for API requests
- **Sentiment** - JavaScript sentiment analysis library
- **Natural** - Natural language processing toolkit
- **Compromise** - Text processing and linguistic analysis
- **Geolib** - Geospatial calculations and utilities

### UI & User Experience
- **React Router DOM** - Client-side routing and navigation
- **React Hot Toast** - Toast notification system
- **Date-fns** - Date manipulation and formatting utilities

### Development & Build Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type checking and development tooling
- **Vitejs Plugin React** - React integration for Vite

### Planned Social Media Integrations
- **Twitter API** - For monitoring tweets related to ocean hazards
- **Facebook Graph API** - For analyzing public posts about coastal events
- **YouTube API** - For processing comments on weather/disaster-related videos

### Mobile Development
- **React Native** - Cross-platform mobile app development
- **Capacitor** - Native mobile app wrapper and plugin system
- **Gradle** - Android build system for APK generation