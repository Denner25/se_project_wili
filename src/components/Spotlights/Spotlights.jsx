import Slider from "react-slick";
import { useEffect, useState } from "react";
import { getLatestItems } from "../../utils/Api";
import "./Spotlights.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Spotlights() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getLatestItems()
      .then((data) => setItems(data))
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0",
    variableWidth: false,
  };

  return (
    <section className="spotlights">
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item._id} className="spotlight-slide">
            <div className="spotlight-content">
              <div className="spotlight__description-container">
                <h1 className="spotlight-title">Latest user additions:</h1>
                <div className="spotlight-description">
                  <h2>{item.title}</h2>
                  <p>{item.mediaType === "movie" ? "Movie" : "TV Show"}</p>
                </div>
              </div>
              <div
                className="spotlight-poster"
                style={{ backgroundImage: `url(${item.poster})` }}
              >
                <div className="poster-overlay" />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
