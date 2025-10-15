# Shipment Tracker App

A full-stack freight shipment tracking dashboard built with Next.js and FastAPI.

## Features

- **Real-time Shipment Tracking**: View active shipments with status indicators
- **Advanced Filtering**: Filter by status and search by ID, destination, or carrier
- **Interactive Maps**: Leaflet-powered route visualization with origin/destination markers
- **CRUD Operations**: Create, read, update shipments with form validation
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Type Safety**: Full TypeScript support with Zod validation
- **State Management**: Zustand for efficient state management
- **Code Splitting**: Lazy loading with React Suspense

## Tech Stack

### Frontend

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Zod** for schema validation
- **Leaflet** for map visualization
- **React Icons** for UI icons

### Backend

- **FastAPI** for REST API
- **SQLAlchemy** for ORM
- **SQLite** for database
- **Pydantic** for data validation

## Project Structure

```
cartage/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── crud.py              # Database operations
│   ├── database.py          # Database configuration
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app router pages
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities and API client
│   │   ├── store/           # Zustand store
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript type definitions
│   └── package.json         # Node.js dependencies
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Seed Database

To populate the database with sample data, make a POST request to:

```bash
curl -X POST http://localhost:8000/api/seed
```

## API Endpoints

- `GET /api/shipments` - Get all shipments (with optional filtering)
- `GET /api/shipments/{id}` - Get specific shipment
- `POST /api/shipments` - Create new shipment
- `PATCH /api/shipments/{id}` - Update shipment
- `POST /api/seed` - Seed database with sample data

## Features Overview

### Shipment Management

- View all shipments in a responsive grid layout
- Filter shipments by status (Pending, In Transit, Delivered)
- Search shipments by ID, origin, destination, or carrier
- Click on any shipment to view detailed information

### Interactive Maps

- Leaflet-powered maps showing route visualization
- Origin and destination markers
- Current location tracking (when available)
- Responsive map component with lazy loading

### Form Validation

- Zod schema validation for all forms
- Real-time error feedback
- Type-safe form handling
- Coordinate input for map display

### State Management

- Zustand store for efficient state management
- Automatic API integration
- Optimistic updates
- Error handling and loading states

## Development Notes

- The app uses React Suspense for code splitting and lazy loading
- All components are fully typed with TypeScript
- Tailwind CSS provides responsive design
- The backend uses SQLite for simplicity (easily upgradeable to PostgreSQL)
- CORS is configured for local development

## Interview Demo

This application demonstrates:

- Full-stack development skills
- Modern React patterns (hooks, suspense, lazy loading)
- Type-safe API integration
- Responsive UI design
- Real-world business logic (logistics/shipping)
- Clean code architecture and separation of concerns
