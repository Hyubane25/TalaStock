# TalaStock - Features & Functionalities 📦

A comprehensive overview of what TalaStock can do.

## 1. Authentication & Security
- **Secure Login/Register**: Powered by BCrypt hashing and JWT tokens.
- **Role-Based Access Control (RBAC)**: 
  - **Admin**: Full access (Create, Edit, Delete, User Management).
  - **User**: Read-only access or limited mutations.
- **Session Auto-Expiry**: Automatic logout and redirect when tokens expire.

## 2. Inventory Management
- **Full CRUD**: Add, View, Edit, and Delete inventory items.
- **Stock Status**: Real-time "Low Stock" indicators (Red/Green badges).
- **Search & Filter**: Instant filtering of items by name or description.
- **Audit Logs**: Automatic tracking of every stock change (SQL Triggers).

## 3. Advanced Analytics (Dashboard)
- **Inventory Trends**: Area charts showing stock levels over time.
- **Flexible Timeframes**: Switch between 7, 30, and 90-day analytics.
- **Key Metrics**: Real-time cards showing Total Items, Stock Value, and Low Stock count.

## 4. System Management (Admin Only)
- **Comprehensive User Management**: 
    - Full directory of all registered users.
    - Create system users manually.
    - Instantly promote/demote user roles.
    - Delete inactive accounts.
- **Dynamic Category Control**: 
    - Manage product groups (Edit names, Add new, or Delete).
- **Global Currency System**: 
  - Full CRUD for currencies (Add symbols like € or £).
  - One-click **Primary Currency** switch that updates the entire system's symbols instantly.

## 5. Theming System
- **Dark/Light Mode**: User-selectable themes with persistent state.
- **Sleek Toggle Switch**: Premium sidebar control for instant skin switching.
- **Unified Aesthetics**: Consistent colors across tables, charts, and modals in both modes.

## 6. User Experience (UX) & Desktop Integration
- **Glassmorphism Design**: Modern, sleek interface with blur effects and gradients.
- **Native Desktop Integration**: 
    - Custom Electron title bar with high-clearance drag regions.
    - Native macOS window control integration (no overlap with UI).
    - Draggable window environment.
- **Compact Data View**: High-density table system for professional inventory monitoring.
- **Performance Optimized**: Zero-lag interaction using `useMemo` and direct ADO.Net mapping.
- **Clean Interface**: Hidden number spinners and custom-styled scrollbars.
