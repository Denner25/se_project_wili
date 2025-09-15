import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="spinner-wrapper">
      <div className="spinner-container">
        <div className="spinner-base"></div>
        <div className="spinner-anim"></div>
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
}
