
import './SimpleLoader.css';

const SimpleLoader = () => {
  return (
    <div className="loader-container">
      <div className="book-loader"></div>
      <p className="loader-text">Loading books based on genres...</p>
    </div>
  );
};

export default SimpleLoader;