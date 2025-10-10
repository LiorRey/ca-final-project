# Coding Academy React Frontend

Modern React application built with Vite, featuring a complete frontend infrastructure for teaching full-stack development.

## 🚀 Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── assets/
│   └── styles/        # SCSS modules
│       ├── basics/    # Core styles
│       ├── cmps/      # Component styles
│       ├── pages/     # Page styles
│       └── setup/     # SCSS variables & mixins
├── cmps/              # Reusable components
├── pages/             # Route components
├── services/          # API and utility services
└── store/            # Redux state management
    ├── actions/      # Action creators
    └── reducers/     # State reducers
```

## 🎨 Components

### Core Components

- `AppHeader` - Navigation and user menu
- `AppFooter` - Footer with service status
- `UserMsg` - Toast notifications
- `CarList` - Grid display of cars with actions
- `CarFilter` - Search and filter interface
- `ReviewList` - User reviews with CRUD

### Pages

- `CarIndex` - Main car management
- `ReviewIndex` - Review system
- `UserDetails` - User profile
- `AboutUs` - Static content with nested routes
- `Chat` - Real-time messaging

## 🔄 State Management

Using Redux with the following modules:

- `carModule` - Car CRUD operations
- `userModule` - Authentication and user data
- `reviewModule` - Review system
- `systemModule` - App-wide settings

### Example Usage

```jsx
// In component:
const cars = useSelector(state => state.carModule.cars);
const dispatch = useDispatch();

// Action dispatch:
dispatch(loadCars());
```

## 🎯 Services

### REST API Services

- `car.service` - Car CRUD operations
- `user.service` - Authentication & user management
- `review.service` - Review system
- `upload.service` - File uploads

### Utility Services

- `event-bus.service` - Pub/sub messaging
- `socket.service` - WebSocket connection
- `storage.service` - Local storage wrapper
- `util.service` - Common helpers

## 🎨 Styling

Using SCSS modules with:

- CSS Grid for layouts
- Flexbox for component alignment
- CSS Variables for theming
- Responsive breakpoints
- Utility classes

### Example Usage

```scss
.car-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.5em;
}
```

## 🚦 Development Guidelines

1. Component Structure

```jsx
export function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects here
  }, []);

  return <section className="my-component">{/* JSX */}</section>;
}
```

2. State Updates

```jsx
// Correct:
setData(prevData => [...prevData, newItem]);

// Avoid:
setData([...data, newItem]);
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests

## 📄 License

MIT

---

Coding Academy - Built with ❤️ for teaching modern fullstack development
