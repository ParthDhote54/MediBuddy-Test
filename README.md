# MediPharma

A simple React + Vite medicine search app built for the FDA label API. It lets users search by brand name, view matching medicines as cards, and open a detail view for each medicine.

## Features

- Search medicines by brand name
- Fetch data from the FDA drug label API
- Show loading, empty, error, and missing-data states
- View medicine details in a separate route
- Preserve the selected medicine in `sessionStorage` so direct visits and refreshes do not crash
- Use a debounce, request cancellation, and a small in-memory query cache

## Tech Stack

- React
- Vite
- JavaScript
- React Router
- CSS
- FDA Open Data API

## How to Run Locally

1. Install dependencies:
   npm install
2. Start the app:
   npm run dev
3. Open the local Vite URL shown in the terminal.

## API Used

The app uses the FDA drug label API:

https://api.fda.gov/drug/label.json?search=openfda.brand_name:"SEARCH_INPUT"&limit=20

## Performance Decisions

This project intentionally keeps the optimization simple and appropriate for the assignment:

- Debounce: prevents API requests on every keystroke
- Request cancellation: aborts stale requests when a new search starts
- Simple query caching: reuses previously fetched results for the same normalized search term
- No unnecessary memoization or state management: the result set is small enough that plain React rendering stays readable and efficient
