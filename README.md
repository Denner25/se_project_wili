# WILI - Would I Like It?

WILI is a cross-media taste exploration platform that allows users to search, save, and express their preferences across movies, TV shows, anime, music, books, and games. Instead of simple likes or favorites, users mark items with mood tags that build a richer expression of taste and personality.

The app generates interactive grids in the main feed and profile pages based on these mood interactions.

## AI Recommendations Chat (WiliAi)

Using an AI model, the app predicts whether a user would like a suggested item based on their existing liked items across all supported media types.

Chats are persistent and grouped by item and person discussed, supporting follow-up conversations. Users can type free-form messages and Wili responses are aware of full context including both users' taste profiles and shared items.

The AI payload is minimal (titles + mediaType + moods) to ensure efficiency and scalability, and is designed to support future AI providers.

## Privacy System

Users now have full control over item visibility:

- Per-item privacy toggles (public/private)
- Private items are hidden from other users' profiles
- Public profile view respects ownership-based filtering while preserving full access for the owner
- Privacy state is persisted and reflected across all item views and cards

## Top Moods

There is a "Your Top Moods" section that uses React’s wordcloud library to visualize user preferences with proportional sizing, dynamic colors, and randomized layout updates on each visit or change.

Mood tracking remains per-user via nested mood subdocuments, allowing shared items while preserving individual expression.

## Media Type Support

WILI now supports multiple media types:

- Movies
- TV Shows
- Anime
- Music
- Books
- Games

Media type filter pills allow users to browse by category or mix all types together. The word cloud adapts dynamically based on selected filters.

## Deployed application

https://wili.nya.pub

## Backend repository

https://github.com/Denner25/se_project_wili_backend

## Project features

- Reusable functional components
- React Router
- AI recommendations chat
- Multi-media search & tagging system
- Per-item privacy controls
- JavaScript
- API integration
- Flexbox

## Plan on improving the project

- Dynamic ranking of items across all media types
- More advanced privacy controls (lists, collections, sharing rules)
- Improved AI personalization using long-term taste evolution