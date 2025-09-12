Redesign notes

Files changed or added:
- `package.json` - metadata updated, added `start` script
- `src/components/Header.jsx` - new header component
- `src/App.jsx` - refactored to use `Header` and simplified layout
- `index.html` - updated title
- removed `src/assets/react.svg` - unused asset

Kept files:
- All core components and styles (`HabitForm`, `HabitList`, `CalendarGrid`, `YearView`, `App.css`) were retained and left mostly unchanged.

Next actions you may want:
- Replace README.md manually if you want a fresh top-level README.
- Run `npm install` and `npm run dev` to validate the app locally.
