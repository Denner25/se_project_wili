const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL_W92 = "https://image.tmdb.org/t/p/w92";
const IMAGE_BASE_URL_W500 = "https://image.tmdb.org/t/p/w500";

const BUTTONS = {
  SAVE: "Save",
  CANCEL: "Cancel",
  DELETE: "Delete",
  CLOSE: "Close",
  CONFIRM: "Confirm",
};

const ERROR_MESSAGES = {
  FETCH_SUGGESTIONS_FAILED: "Failed to fetch suggestions.",
  FETCH_DETAILS_FAILED: "Failed to fetch details.",
};

const IMAGE_SIZES = {
  SMALL: "w92",
  MEDIUM: "w342",
  LARGE: "w500",
};

export {
  BUTTONS,
  BASE_URL,
  IMAGE_BASE_URL_W500,
  IMAGE_BASE_URL_W92,
  ERROR_MESSAGES,
  IMAGE_SIZES,
};
