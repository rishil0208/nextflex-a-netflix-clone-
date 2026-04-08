NEXTFLEX : STREAMING MEDIA PLATFORM

INTRODUCTION
Nextflex is a comprehensive Streaming Media Platform designed to provide users with a rich, interactive environment for discovering, watching, and tracking movies and TV shows. Built with the modern Next.js ecosystem (React, Tailwind CSS, Firebase, and Next.js App Router), Nextflex provides a centralized platform where administrators can manage content logic and users can explore premium entertainment. The platform distinguishes itself through a captivating "glass-morphism" dark-themed user interface, dynamic 3D backgrounds, and a frictionless viewing workflow ensuring that the user experience is both efficient and visually stunning.

NEXTFLEX PROJECT STRUCTURE
Overview of the project structure for the NEXTFLEX Streaming Media System. The project is built using a full-stack Next.js architecture where the Backend (API Routes) and Frontend (React Pages/Components) coexist in a unified repository.

Root Directory
Folder/File Explanation
app/ Contains the core application, including both backend API routes and frontend user-facing pages following the Next.js App Router structure.
components/ Houses the reusable React-based user interface blocks, cards, and client-side design assets.
lib/ Custom utility functions, configuration logic (like Firebase setup), and context providers that bridge the front and back ends.
public/ Static assets, such as icons, images, and fonts delivered directly to the client.
tailwind.config.ts Specifies the styling framework logic, themes, and design tokens for the UI.

App Directory (/app)
The Next.js App Router acts as both frontend structural roots and backend API endpoints.
Folder/File Explanation
api/ Contains server-side code (the backend controllers), separating logic for Admin configurations, user specific My-List logic, and Search features.
home/ The main authenticated dashboard showing top movies, carousels, and dynamically loaded hero sections.
login/ & signup/ The user authentication gateways, managing session states and communicating with backend authentication systems.
layout.tsx The root layout file that wraps every page, initializing metadata and global contexts (like user sessions).

Components Directory (/components)
The frontend is a modern React application utilizing functional components, hooks, and modular UI.
Folder/File Explanation
Navbar.tsx The core navigation shell containing branding, profile drop-downs, and search fields.
MovieCard.tsx A complex interactive component handling hover states, video play triggers, and listing functions for media items.
Top10Card.tsx A specialized card component displaying styling logic for ranking top-rated shows globally.
MovieInfoModal.tsx The overlay pop-up window fetching and displaying detailed statistics (casts, ratings, genres) for a selected item.


DETAILED FOLDER STRUCTURE
NEXTFLEX/
├── app/
│   ├── admin/                    # Admin dashboard for content control
│   ├── admin-login/              # Secure gateway for system administrators
│   ├── api/                      # Backend API Routes (Controllers)
│   │   ├── admin/                # Backend logic for managing global content
│   │   ├── movies/               # Backend logic for fetching/sorting media
│   │   ├── mylist/               # Backend logic for managing personalized lists
│   │   └── search/               # Search algorithms and query endpoints
│   ├── home/                     # Authenticated Main Page (Content explorer)
│   ├── login/                    # Standard User Login Page
│   ├── signup/                   # Standard User Registration Page
│   ├── movies/                   # Categorized movies-only page
│   ├── tv-shows/                 # Categorized TV-shows-only page
│   ├── layout.tsx                # App layout mapping & configuration
│   ├── page.tsx                  # Public Landing Page (Vanta.js animations)
│   └── globals.css               # Global stylesheets & design system constants
│
├── components/                   # Frontend UI Building Blocks
│   ├── Navbar.tsx                # App navigation shell
│   ├── MovieCard.tsx             # Interactive media posters
│   ├── Top10Card.tsx             # Ranked media display logic
│   └── MovieInfoModal.tsx        # Statistical overlay modal
│
├── lib/
│   ├── auth/
│   │   └── AuthContext.tsx       # Authentication context & provider
│   └── firebase/
│       └── config.ts             # Database connection & credentials
│
├── public/                       # Assets & media imagery
├── tailwind.config.ts            # Styling configuration
└── package.json                  # Application dependencies


BACKEND

config.ts (Firebase)
The `lib/firebase/config.ts` file is responsible for establishing a secure connection to the Google Firebase backend systems using project credentials and initialization functions. It ensures the frontend can speak with the Auth and Firestore products seamlessly.

API Controllers (app/api)
1) auth/AuthContext.tsx (Authentication Logic)
While Firebase handles the main backend logic, the `AuthContext` file acts as the central middleware for user validation. It manages user authentication processes such as registration, email/password validation, and Google OAuth. It ensures that only authorized users can access protected resources like `app/home`.

2) api/admin
This directory acts as the administrative backend controller. It handles operations such as fetching administrative privileges, or pushing new media (Movies/TV Shows) directly into the global database, ensuring validation of incoming request bodies.

3) api/mylist
This directory acts as the user-specific database controller. It manages personalized event/media registrations. It allows the system to read and write records defining which user has added which specific movie ID to their private "My List".

4) api/search
The search controller intercepts user search queries, connects to the database or an external repository (like TMDB), and filters responses returning tailored arrays of content matched by string comparisons.


FRONTEND

layout.tsx
The `layout.tsx` file is the entry point of the React layout logic. It renders the fundamental structure of the HTML, configures `html` and `body` tags, and injects global context wrappers (like `<AuthProvider>`) securing and feeding data to every route in the system.

globals.css
The `globals.css` file contains global styling for the application. It defines themes, root CSS variables for light/dark mode tracking, glass-morphism classes (`.glass-card`), and custom animations ensuring a premium user interface.

Components
1) Navbar.tsx
The `Navbar.tsx` component acts as the main layout wrapper for navigation. It includes common UI elements such as routing links, the system logo, search triggers, and dynamic drop-downs linked directly to the session logout functionality.

2) MovieCard.tsx
This component represents individual media entries. It contains complex `onMouseEnter` logic configuring CSS overlays, ensuring users have quick-access buttons to "Play", "Add", or view "Info".

3) MovieInfoModal.tsx
This component overlays the entire screen, freezing the background, acting as a deep-dive hub for an event/movie. It fetches deeper metrics from the backend (like IMDB ratings and Cast arrays) and organizes them structurally for the user.

Pages
1) page.tsx (Landing)
The public gateway. Contains advanced WebGL 3D background rendering via Vanta.js and structural components funneling anonymous users into the authentication pipeline.

2) login/page.tsx & signup/page.tsx
These serve as the entry points for user authentication. They render the glass panels for credentials, communicate with Firebase interfaces, and display conditional error validation messages on failed requests.

3) home/page.tsx
The `UserEvents` equivalent. This displays available content matrices to users. It fetches dynamic collections of media from the backend and splits them into logical carousels (Trending, Top 10, TV, Movies).

4) admin/page.tsx
This page provides administrators with forms and controls for managing adding content structurally to the active Firestore database.


DATABASE

Database Overview
The NEXTFLEX Platform relies on Google Firebase (Firestore natively) as its database. The non-relational database consists of targeted collections designed to store documents structured around users, media, and personalized associations.

Database Collections
The database relies on the following primary collections:

1) Users Collection
Stores user account details.
Fields include: UID, Email, DisplayName, PhotoURL.
Function: Core representation of identity used consistently for session logic and list management.

2) Movies Collection
Stores detailed information about available streaming media.
Fields include: id, title, description, poster, backdrop, releaseYear, type (movie/tv), imdbRating, genres (Array).
Function: Functions as the single source of truth for rendering application content across Home, Movies, and TV-Shows views.

3) MyList Collection (User Sub-Collections)
Stores relational configurations for personalized content tracking.
Fields include: movieID, addedAt.
Function: Tracks which specific pieces of content a user has opted to "save for later".

4) Admin Collection
Stores privilege details.
Fields include: UID, role.
Function: Prevents regular application users from utilizing backend administrative controllers and altering the streaming database.


OUTPUTS

LOGIN PAGE
[Insert your Login Page Screenshot Here]

CREATING ACCOUNT (SIGNUP)
[Insert your Signup Page Screenshot Here]

ADMIN CONTROLS
[Insert your Admin Dashboard Screenshot Here]

HOME PAGE DASHBOARD
[Insert your Home Page Screenshot Here]

VIEWING INFO MODAL (MOVIE DETAILS)
[Insert your MovieInfoModal Pop-up Screenshot Here]

USER NAVIGATION (NAVBAR)
[Insert your Dropdown/Navbar Screenshot Here]
