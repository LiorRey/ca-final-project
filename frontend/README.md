# Note tracking app - Frontend

Modern React application built with Vite, featuring a board management system with cards, lists, labels, and real-time collaboration.

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
│   └── styles/        # CSS modules
│       ├── basics/    # Core styles
│       ├── components/# Component styles
│       ├── pages/     # Page styles
│       └── setup/     # CSS variables & typography
├── components/        # Reusable components
│   ├── board/        # Board-related components
│   ├── card/         # Card-related components
│   ├── auth/         # Authentication components
│   ├── forms/        # Form components
│   └── ui/           # UI primitives
├── pages/            # Route components
├── services/         # API and utility services
│   ├── board/        # Board service
│   ├── user/         # User service
│   └── auth/         # Auth service
├── store/            # Redux state management
│   ├── actions/      # Action creators
│   └── reducers/     # State reducers
├── hooks/            # Custom React hooks
└── theme/            # MUI theme configuration
```

## 🎨 Components

### Core Components

- `Header` - Navigation and user menu
- `Footer` - Footer with service status
- `UserMessage` - Toast notifications
- `Board` - Board container with lists
- `List` - List container with cards
- `Card` - Individual card component
- `CardModal` - Card detail modal
- `CardPopover` - Card action menu
- `FilterMenu` - Card filtering interface
- `LabelMenu` - Label management
- `BoardMenu` - Board actions menu

### Pages

- `BoardIndex` - Board selection and management
- `BoardDetails` - Main board view with lists and cards
- `CardDetails` - Card detail view
- `UserDetails` - User profile
- `AboutUs` - Static content with nested routes
- `Chat` - Real-time messaging
- `LoginPage` / `SignupPage` - Authentication

## 🔄 State Management

Using Redux with the following modules:

- `boards` - Board, list, and card management
- `users` - User data and profiles
- `auth` - Authentication state
- `ui` - UI state and settings

### Example Usage

```jsx
// In component:
const boards = useSelector(state => state.boards.boards);
const currentBoard = useSelector(state => state.boards.board);
const dispatch = useDispatch();

// Action dispatch:
dispatch(loadBoards());
dispatch(addCard(boardId, card, listId));
```

## 🎯 Services

### REST API Services

- `board.service` - Board, list, and card CRUD operations
- `user.service` - Authentication & user management
- `auth.service` - Authentication logic
- `upload.service` - File uploads (Cloudinary)

### Utility Services

- `event-bus.service` - Pub/sub messaging for notifications
- `socket.service` - WebSocket connection for real-time updates
- `async-storage.service` - Local storage wrapper
- `filter.service` - Card filtering utilities
- `util.service` - Common helpers

## 🎨 Styling

Using CSS modules with Material-UI (MUI) for components:

- MUI Theme with Atlassian Design System tokens
- CSS Variables for custom theming
- CSS Modules for component-specific styles
- Responsive breakpoints
- Utility classes

### Example Usage

```css
.board-container {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.card-container {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 0.75rem;
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
