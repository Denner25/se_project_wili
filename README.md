# WILI - Would I Like It?

This is the 16th and final project of the Software Engineering program at TripleTen as well as my first creative project. It's an application where, by using the TMDB API, I allow users to search for their favorite movies and animes, and mark mood and genre descriptive boxes describing the specific aspects they like about their items, allowing for a deeper level of expression than just a list, it generates a grid that appears in main and profile. Cards are generated through engaging with the mood boxes rather than a like or favorite button. Per-user separation of moods was achieved in the backend through a nested mood subdocument consisting of an object with the mood name string and an array of all users who marked that mood.
There is a "Your top moods" section where I utilized react's wordcloud library to create a fun display that highlights the user's most marked moods in proportional size, random colors and arrangement upon every visit or change.
AI Recommendations (WiliAi): Using an AI model (currently Gemini API), the app predicts whether a user would like a suggested item based on their existing liked items. The AI payload is minimal — only title and media type — ensuring efficiency. The system is designed to allow other AI providers in the future.

## Deployed application

https://wili.nya.pub

## Backend repository

https://github.com/Denner25/se_project_wili_backend

## Project features

- Reusable functional components
- React Router
- AI recommendations
- JavaScript
- API integration
- Flexbox

## Plan on improving the project

- Dynamic posters based on popularity or latest user additions.
