import "./Support.css";

function Support() {
  return (
    <section className="support">
      <h1 className="support__title">Frequently asked questions:</h1>
      <h2 className="support__question">What is WILI?</h2>
      <p className="support__answer">
        WILI stands for "Would I Like It?" It's a platform that allows you to
        not only list your movies and animes, but what you like about them.
      </p>
      <h2 className="support__question">
        Why is my item not showing in my profile?
      </h2>
      <p className="support__answer">
        You must select at least one of the item's available moods in order for
        it to appear on your profile.
      </p>
      <h2 className="support__question">I can't find the item I want.</h2>
      <p className="support__answer">
        You can add the year in front of the item's name in the search box to
        increase the chance of finding what you're looking for.
      </p>
      <h2 className="support__question">
        Why are my items still showing in the main page after I logged out?
      </h2>
      <p className="support__answer">
        The initial idea was to build a fun and diverse collection of everyone's
        items on the main page, with the "All users' moods" tab displaying a
        word cloud highlighting the moods that get marked most often.
      </p>
    </section>
  );
}

export default Support;
