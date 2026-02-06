interface SearchHeaderProps {
  message: string;
  vehicleQuery: string;
  totalFound: number;
}

export function SearchHeader({
  message,
  vehicleQuery,
  totalFound,
}: SearchHeaderProps) {
  return (
    <>
      <div className="search-header">
        <div className="michelin-logo">
          <span className="logo-text">MICHELIN</span>
        </div>
        <h1 className="search-title">Tire Search Results</h1>
        <p className="search-message">{message}</p>
        <div className="search-info">
          <div className="info-card vehicle-info">
            <span className="label">Vehicle</span>
            <strong>{vehicleQuery}</strong>
          </div>
          <div className="info-card results-count">
            <span className="label">Found</span>
            <strong>{totalFound} compatible tires</strong>
          </div>
        </div>
      </div>

      <style>{`
        .search-header {
          text-align: center;
          margin-bottom: 24px;
          padding: 20px 20px 16px 20px;
          background: linear-gradient(135deg, #00396B 0%, #004080 100%);
          color: white;
          border-radius: 0;
          box-shadow: 0 2px 8px rgba(0, 57, 107, 0.2);
        }

        .michelin-logo {
          margin-bottom: 12px;
        }

        .logo-text {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 2px;
          color: white;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .search-title {
          color: white;
          font-size: 24px;
          margin: 8px 0 12px 0;
          font-weight: 600;
          font-family: 'Arial', 'Helvetica', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .search-message {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.4;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .search-info {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-top: 16px;
        }

        .info-card {
          background: white;
          color: #00396B;
          padding: 10px 16px;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          min-width: 140px;
        }

        .label {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #666;
          margin-bottom: 3px;
          font-weight: 600;
        }

        .info-card strong {
          color: #00396B;
          font-weight: 700;
          font-size: 14px;
          display: block;
        }

        @media (max-width: 768px) {
          .search-header {
            padding: 15px;
            margin-bottom: 20px;
          }

          .search-header h3 {
            font-size: 24px;
          }

          .search-info {
            flex-direction: column;
            gap: 10px;
            align-items: center;
          }

          .vehicle-info, .results-count {
            font-size: 13px;
            padding: 6px 12px;
          }
        }
      `}</style>
    </>
  );
}
