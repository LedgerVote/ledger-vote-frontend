# Blockchain Voting System Frontend

A modern, responsive React frontend for the blockchain-based voting system with Bootstrap styling.

## Features

- **🗳️ Voting Dashboard**: Cast votes for candidates in different sessions
- **📝 Session Management**: Create and manage voting sessions
- **👥 Candidate Management**: Add and view candidates for each session
- **🆔 Voter Management**: Register and manage voters
- **📊 Results**: View real-time voting results with charts and statistics

## Technologies Used

- React 18
- React Bootstrap
- Bootstrap 5
- Axios for API calls
- Font Awesome icons
- Vite for development

## Prerequisites

- Node.js 16+
- npm or yarn
- Backend server running on `http://localhost:8080`

## Installation

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:8080/api`.

You can modify the API base URL in `src/services/api.js`:

```javascript
const API_BASE_URL = "http://localhost:8080/api";
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage Guide

### 1. Voting Dashboard

- Select a voting session
- Enter your voter ID
- Choose a candidate by clicking on their card
- Enter your blockchain private key
- Click "Cast Vote" to submit

### 2. Session Management

- View all voting sessions with their status (upcoming, active, ended)
- Create new sessions with title, start time, and end time
- Sessions are automatically marked as active/ended based on current time

### 3. Candidate Management

- Add new candidates to specific voting sessions
- View all candidates or filter by session
- Candidates are displayed in a card layout with avatars

### 4. Voter Management

- Register new voters with unique voter IDs
- Assign voters to specific sessions
- Track voting status (voted/not voted)
- View voter statistics and turnout rates

### 5. Results

- View overall results across all sessions
- Filter results by specific sessions
- See vote counts, percentages, and leading candidates
- Real-time statistics dashboard

## Component Structure

```
src/
├── components/
│   ├── VotingDashboard.jsx
│   ├── SessionManagement.jsx
│   ├── CandidateManagement.jsx
│   ├── VoterManagement.jsx
│   └── Results.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
├── App.css
└── index.css
```

## API Endpoints Used

- **Sessions**: `/api/session`
- **Candidates**: `/api/candidate`
- **Voters**: `/api/voter`
- **Voting**: `/api/vote`

## Styling Features

- Modern gradient backgrounds
- Hover effects and animations
- Responsive design for mobile/tablet
- Card-based layouts
- Progress bars for vote visualization
- Bootstrap component theming
- Font Awesome icons

## Error Handling

The application includes comprehensive error handling:

- API error messages displayed to users
- Form validation
- Loading states
- Network error handling

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is licensed under the MIT License.
