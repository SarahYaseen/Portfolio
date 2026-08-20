# Sarah Yaseen | WordPress Developer & Elementor Specialist Portfolio

A modern, responsive, and fully functional personal portfolio website showcasing selected WordPress and Elementor projects.

## Project Structure
- `index.html` - Homepage containing Hero, About, Services, Interactive Portfolio filters, Skills, Work Process, Client Testimonials, FAQ accordion, and Contact form.
- `project-*.html` - Individual project case study pages, designed with consistent headers, mobile overlay menus, and footers.
- `server.js` - Local Node.js server serving files and handling contact inquiries via POST requests.
- `script.js` - Client-side javascript managing sticky header, overlay menu toggles, active section scroll highlights, portfolio filters, skill-meter triggers, accordion toggles, cross-page smooth scroll, and contact form validation and submission.
- `styles.css` - Visual design stylesheets built with a modern slate purple dark theme, spring green highlights, rotating hover shadows, and custom mock elements.
- `submissions.json` - Local JSON file database where valid form inquiries are appended.

## Running Locally

1. Ensure [Node.js](https://nodejs.org/) is installed on your system.
2. Clone the repository or download files.
3. Open a terminal in the project directory and start the server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to `http://localhost:8080/`.
