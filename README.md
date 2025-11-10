# Weather Alarm Service (날씨 알람)

Mobile-optimized web application providing daily weather notifications with location-based alarm management.

## Features

- User authentication (register, login, password reset)
- Alarm management (create, edit, delete, toggle)
- Location-based weather notifications (Korean locations)
- PWA support with push notifications
- Responsive mobile-first design
- TypeScript for type safety

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **PWA**: next-pwa

### Key Dependencies
```json
{
  "next": "^14.2.0",
  "react": "^18.3.0",
  "typescript": "^5.4.0",
  "tailwindcss": "^3.4.0",
  "axios": "^1.7.0",
  "next-pwa": "^5.6.0"
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page (redirects to login/alarms)
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── reset-password/    # Password reset page
│   └── alarms/            # Alarm management pages
│       ├── layout.tsx     # Protected layout with AlarmsProvider
│       ├── page.tsx       # Alarm list page
│       ├── new/           # Create alarm page
│       └── [id]/edit/     # Edit alarm page
├── components/            # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   ├── Card.tsx
│   ├── LoadingSpinner.tsx
│   ├── Toast.tsx
│   ├── LocationSelector.tsx
│   ├── DaySelector.tsx
│   └── ProtectedRoute.tsx
├── context/               # React Context providers
│   ├── AuthContext.tsx
│   └── AlarmsContext.tsx
├── services/              # API services
│   ├── api.ts            # Axios client with interceptors
│   ├── auth.ts           # Authentication API
│   ├── alarms.ts         # Alarms CRUD API
│   └── push.ts           # Push notification service
├── hooks/                 # Custom React hooks
│   ├── useToast.ts
│   └── useLocationData.ts
├── utils/                 # Utility functions
│   ├── validation.ts     # Form validation
│   └── storage.ts        # LocalStorage wrapper
├── constants/             # Static data and constants
│   ├── index.ts          # App constants
│   └── locations.json    # Korean location data
└── types/                 # TypeScript types
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository:
```bash
git clone https://github.com/JokerTrickster/weather_alarm.git
cd weather_alarm
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key_here
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

### Code Quality

Run linter:
```bash
npm run lint
```

Run type checking:
```bash
npm run type-check
```

Format code:
```bash
npm run format
```

Check formatting:
```bash
npm run format:check
```

## Architecture Decisions

### 1. Next.js 14 App Router
- **Why**: Built-in routing, server components, better performance
- **Benefits**: SEO optimization, code splitting, API routes for service worker logic
- **Trade-off**: Newer API, smaller community compared to Pages Router

### 2. TypeScript
- **Why**: Type safety, better IDE support, catch errors at compile time
- **Benefits**: Fewer runtime errors, better documentation, easier refactoring
- **Trade-off**: Additional build step, learning curve

### 3. Tailwind CSS
- **Why**: Utility-first, mobile-first, fast development
- **Benefits**: Small bundle size, consistent design, responsive utilities
- **Trade-off**: HTML can look verbose, learning curve for utility classes

### 4. React Context API (not Redux)
- **Why**: Simple state management for this scope
- **Benefits**: No extra dependencies, built-in, sufficient for 2-alarm limit
- **Trade-off**: Not suitable for large-scale state management

### 5. Axios (not Fetch)
- **Why**: Better error handling, interceptors, request/response transformation
- **Benefits**: Automatic token injection, centralized error handling
- **Trade-off**: Additional dependency (small)

### 6. PWA with next-pwa
- **Why**: Push notification support, offline capability
- **Benefits**: Native app-like experience, installable, background sync
- **Trade-off**: Service worker complexity, browser compatibility

## API Integration

This frontend expects the following backend API endpoints:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/reset-password` - Send password reset email
- `POST /auth/update-password` - Update password with reset token

### Alarms
- `GET /alarms` - List user alarms
- `POST /alarms` - Create new alarm
- `PUT /alarms/:id` - Update alarm
- `DELETE /alarms/:id` - Delete alarm
- `PUT /alarms/:id/toggle` - Toggle alarm enabled status

### Notifications
- `POST /notifications/subscribe` - Register push subscription
- `POST /notifications/unsubscribe` - Unregister push subscription

### Request/Response Format

**Request (with auth):**
```json
{
  "headers": {
    "Authorization": "Bearer <jwt_token>",
    "Content-Type": "application/json"
  },
  "body": { /* request data */ }
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "error": "error message if failed",
  "message": "optional message"
}
```

## Browser Support

- Chrome 90+ (desktop and mobile)
- Safari 14+ (desktop and iOS)
- Samsung Internet 14+
- Progressive Web App (PWA) capable browsers

## Push Notifications

Push notifications require:
1. HTTPS connection (except localhost)
2. User permission grant
3. Service worker registration
4. VAPID keys configuration
5. Backend push notification server

### Setup VAPID Keys

Generate VAPID keys using:
```bash
npx web-push generate-vapid-keys
```

Add public key to `.env.local`:
```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<your_public_key>
```

## Mobile-First Design

- Viewport: 320px-1920px
- Touch targets: Minimum 44x44px
- Responsive breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

## Accessibility

- WCAG 2.1 Level A minimum compliance
- Keyboard navigation support
- Screen reader friendly
- Proper ARIA labels
- Semantic HTML

## Production Considerations

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<production_vapid_key>
NODE_ENV=production
```

### Security
- HTTPS only in production
- Secure token storage (localStorage with HttpOnly consideration)
- CORS configuration on backend
- Rate limiting on API endpoints
- Input sanitization

### Performance
- Code splitting by route
- Image optimization with Next.js Image
- PWA caching strategy
- API response caching
- Lazy loading components

## Known Limitations

1. **2-Alarm Limit**: Enforced on frontend and backend
2. **Korea Only**: Location data limited to Korean administrative divisions
3. **No Offline Mode**: Requires internet connection for API calls
4. **Push Notification Browser Support**: May not work on older browsers
5. **No Dark Mode**: Light theme only in v1.0
6. **No Internationalization**: Korean language only

## Future Enhancements

- Conditional alarms (notify only if rain/snow)
- Weather charts and trends
- Dark mode support
- Email/SMS notifications
- User profile settings
- Notification history
- Multiple language support

## Contributing

1. Follow existing code style (ESLint + Prettier)
2. Write TypeScript with proper types
3. Mobile-first responsive design
4. Accessibility compliance
5. No partial implementations
6. Test before committing

## License

[License information]

## Contact

[Contact information]
