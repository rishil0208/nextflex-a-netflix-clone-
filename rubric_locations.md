# Grading Rubric Implementation Locations

This document maps the components mentioned in the grading rubric to their specific locations and implementations within the Nextflex codebase.

| Component | Description | Locations in Codebase |
| :--- | :--- | :--- |
| **HTML Implementation** | Correct use of tags (form, table, semantic tags, images, links, divisions) | - `app/layout.tsx` and `app/page.tsx` (Core layout & semantic divisions)<br>- `components/Navbar.tsx` (`<nav>`, `<ul>`, `<li>`, links)<br>- `app/login/page.tsx` and `app/signup/page.tsx` (`<form>`, inputs) |
| **CSS Styling/Bootstrap** | Styling, responsiveness, layout techniques (flex/grid) | - `tailwind.config.ts`, `postcss.config.mjs`, and `app/globals.css` (The project uses modern **Tailwind CSS** instead of legacy Bootstrap for styling).<br>- Extensive use of layout utilities like `flex` and `grid` inside all Next.js component files (`.tsx`) for fully responsive design. |
| **Functionality (JavaScript/jQuery)** | Working features (forms, buttons, navigation links), validation, dynamic behaviour, interactivity | - `app/login/page.tsx` and `app/signup/page.tsx` (Client-side form validation and submission logic).<br>- `components/MovieCard.tsx`, `components/Top10Card.tsx` and `components/MovieInfoModal.tsx` (Dynamic state-driven interactivity, modal toggling).<br>- *Note: Project uses modern React state (JavaScript/TypeScript) instead of legacy jQuery.* |
| **Content & Creativity** | Originality, meaningful content, design creativity | - `public/` directory (Contains static assets, logos, and images to enhance visuals).<br>- `app/home/page.tsx`, `app/movies/page.tsx`, `app/tv-shows/page.tsx` (Brings meaningful, categorized content to the frontend mirroring high-quality Netflix UI patterns). |
| **Server and Database** | Server and Database connections | - `lib/firebase/config.ts` and `lib/firebase/firestore.ts` (Firebase and Firestore database connections).<br>- `lib/firebase/admin.ts` (Secure server-side database administration).<br>- `app/api/` folder (Next.js server backend routes).<br>- `lib/auth/AuthContext.tsx` (Manages authenticated sessions). |
| **Advancements** | Node, express, ReactJS, AngularJS | - Built purely utilizing **ReactJS** with **Next.js** framework (App Router architecture).<br>- Entire application executes within a **Node.js** runtime environment. |
| **Viva / Explanation** | Student understanding and explanation | - *Demonstrated through your in-person technical explanation and knowledge of files like previously created `project_overview.md`.* |
