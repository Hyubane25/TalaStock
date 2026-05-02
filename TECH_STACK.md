# TalaStock - Technical Stack

TalaStock is built using a modern, scalable, and high-performance technology stack designed for cross-platform efficiency and premium aesthetics.

## Backend (API & Business Logic)
- **Framework**: ASP.NET Core 9.0 bit / .NET 10.0 Preview
- **Language**: C# 13.0
- **Database**: MySQL 8.0+
- **ORM/Data Access**: ADO.Net (Manual Mapping for Maximum Performance)
- **Security**: 
  - JWT (JSON Web Tokens) for Authentication
  - BCrypt.Net-Next for Password Hashing
- **Architecture**: Repository Pattern with Base Repository abstraction.
- **Middleware**: Global Exception Handling & Custom Response Wrappers.

## Frontend (Web & Core UI)
- **Library**: React 18+
- **Build Tool**: Vite (Ultra-fast Hot Module Replacement)
- **State & Theme Management**: 
    - **React Context**: Centralized theme (Dark/Light) and Auth state.
    - **Persistent State**: LocalStorage used for theme and session retention.
- **Styling**: Vanilla CSS with Design System Tokens (CSS Variables).
- **Hooks**: Strategic use of `useMemo` and `useCallback` for optimized rendering.
- **Icons**: Lucide React.
- **Charts**: Recharts (High-performance SVG charts).
- **API Client**: Native Fetch API with custom wrapper for token injection and 401 handling.
- **Routing**: React Router DOM v6.

## DevOps & Tools
- **Version Control**: Git
- **Package Managers**: NuGet (Backend), NPM (Frontend)
- **Environment**: Visual Studio Code / Visual Studio
