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
        <p className="search-message">
          {vehicleQuery ? (
            <>
              I found these compatible tyres for your <strong className="vehicle-name">{vehicleQuery}</strong>
            </>
          ) : (
            message || "Searching for compatible tires..."
          )}
        </p>
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
          font-size: 16px;
          margin-bottom: 0;
          line-height: 1.5;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
        }

        .vehicle-name {
          color: white;
          font-weight: 700;
          font-size: 17px;
        }

        @media (max-width: 768px) {
          .search-header {
            padding: 15px;
            margin-bottom: 20px;
          }

          .search-title {
            font-size: 20px;
          }

          .search-message {
            font-size: 14px;
          }

          .vehicle-name {
            font-size: 15px;
          }
        }
      `}</style>
    </>
  );
}
