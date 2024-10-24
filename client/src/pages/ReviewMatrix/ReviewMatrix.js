import React, { useEffect, useState } from 'react';
import './ReviewMatrix.css';
const API_URL = process.env.REACT_APP_API_URL;

const ReviewMatrix = () => {
  const [matrixData, setMatrixData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatrixData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/recommendations/get-matrix`);
        const data = await response.json();
        setMatrixData(data.data);
      } catch (err) {
        setError('Failed to load matrix data');
        console.error('Error fetching matrix data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrixData();
  }, []);

  const getRatingClass = (rating) => {
    if (rating === 0) return 'get-matrix-unrated';
    if (rating <= 2) return 'get-matrix-low-rating';
    if (rating <= 3) return 'get-matrix-medium-rating';
    return 'get-matrix-high-rating';
  };

  if (loading) {
    return <div className="get-matrix-loading">Loading...</div>;
  }

  if (error) {
    return <div className="get-matrix-error">{error}</div>;
  }

  return (
    <div className="get-matrix-container">
      <h2 className="get-matrix-title">Book Ratings Matrix</h2>

      <div className="get-matrix-wrapper">
        <table className="get-matrix-table">
          <thead>
            <tr>
              <th className="get-matrix-header-cell get-matrix-user-header">Users</th>
              {matrixData?.columnHeaders.map((header, index) => (
                <th key={index} className="get-matrix-header-cell get-matrix-book-header">
                  <div title={header}>
                    {header}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrixData?.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="get-matrix-user-cell">{row.username}</td>
                {row.ratings.map((rating, colIndex) => (
                  <td 
                    key={colIndex} 
                    className={`get-matrix-rating-cell ${getRatingClass(rating)}`}
                  >
                    {rating > 0 ? rating : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="get-matrix-legend">
        <span className="get-matrix-legend-title">Legend:</span>
        <div className="get-matrix-legend-item">
          <div className="get-matrix-legend-color get-matrix-unrated"></div>
          <span>Unrated</span>
        </div>
        <div className="get-matrix-legend-item">
          <div className="get-matrix-legend-color get-matrix-low-rating"></div>
          <span>Low Rating (1-2)</span>
        </div>
        <div className="get-matrix-legend-item">
          <div className="get-matrix-legend-color get-matrix-medium-rating"></div>
          <span>Medium Rating (3)</span>
        </div>
        <div className="get-matrix-legend-item">
          <div className="get-matrix-legend-color get-matrix-high-rating"></div>
          <span>High Rating (4-5)</span>
        </div>
      </div>
    </div>
  );
};

export default ReviewMatrix;