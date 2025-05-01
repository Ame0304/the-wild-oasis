# 🏝️ The Wild Oasis

To get the full experience of the app, click [here](https://the-wild-system.netlify.app) and use the following account to log in:

- Username: test@test.com 
- Password: Password

## 🔍 Project Overview

The Wild Oasis is a comprehensive hotel management system designed specifically for hotel employees to streamline daily operations, manage bookings, and track essential metrics. Built with React, this application emphasizes security, user expeience, and efficient workflow management. The system features role-based authentication, real-time dashboard analytics, and intuitive booking management capabilities.

## 🛠 Tech Stack

- **Framework**: React
- **Routing**: React Router v6 for SPA navigation
- **Styling**: Styled Components for component-scoped CSS
- **State Management**:
    - React Query for server state (caching, auto-refetching)
    - Context API with useState for UI state
- **Form Handling**: React Hook Form for form validation and state
- **Data Visualization**: Recharts for analytics dashboards

### Additional Tools

- **UI Components**: React Icons for iconography
- **Notifications**: React Hot Toast for user feedback
- **Date Handling**: date-fns for date manipulations
- **Backend**: Supabase for authentication and data storage
- React Select + React Select country list

## ✨ Features

### 🔐 Secure Authentication & User Management

- Secure, internal-only user registration system
- Profile customization with avatar uploads
- Role-based access control
- Password management and profile editing capabilities

### 🏠 Cabin Management

- Interactive cabin management with photo uploads
- Real-time availability tracking
- Dynamic pricing and discount management

### 📊 Booking System

- Filterable booking table with status tracking (unconfirmed, checked-in, checked-out)
- Comprehensive booking and guest information management
- Integrated payment confirmation system
- Flexible add-on management

### 📈 Analytics Dashboard

- Daily operations overview (check-ins/outs)
- Sales performance metrics, occupancy rate tracking, stay duration analytics
- Customizable time range views

### ⚙️ System Settings

- Configurable booking parameters
- Customizable pricing rules
- Dark mode support

## 🏗 Architecture & Code Organization

### Project Structure

```bash
src/
├── context/            # React Context providers
├── data/               # Mock data
├── features/           # Feature-specific components
├── hooks/              # Part of custom React hooks
├── pages/              # Route components
├── services/           # API and service functions
├── utils/              # Helper functions
├── ui/                 # Reusable UI components
└── styles/             # Global styles and themes
```

### Key Design Patterns

- **Feature-First Organization**: Components grouped by feature rather than type
- **Compound Components**: Used for complex UI elements like Modal and Menus.
- **Custom Hooks**: Encapsulating common logic for bookings, cabins, guests and authentication
- **Provider Pattern**: Global state management with Context API

## 🚀 Performance Optimizations

### Data Management

- Optimistic updates for better user experience
- React Query caching for reduced API calls
- Infinite scrolling for large data sets

### Component Optimizations

- Lazy loading of route components
- Memoization of expensive calculations
- Virtual scrolling for large tables
- Image lazy loading and optimization

### State Management

- Strategic use of local state for UI interactions
- Efficient context usage to prevent unnecessary re-renders
- Debounced search and filter functions
