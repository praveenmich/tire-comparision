interface Tire {
  brand: string;
  product_name: string;
  rating: string;
  review_count: number;
  season: string;
  ev_compatible: boolean;
  claim: string;
  image_url: string;
  details_url: string;
  sizes_url: string;
}

interface TireCardProps {
  tire: Tire;
  getImageProxyUrl: (url: string) => string;
}

export function TireCard({ tire, getImageProxyUrl }: TireCardProps) {
  return (
    <>
      <div className="tire-card">
        <div className="tire-image">
          {tire.image_url ? (
            <img
              src={getImageProxyUrl(tire.image_url)}
              alt={`${tire.brand} ${tire.product_name}`}
              onLoad={() => {
                console.log(
                  "✅ Image loaded successfully via proxy:",
                  tire.image_url,
                );
              }}
              onError={(e) => {
                console.error(
                  "❌ Image failed to load via proxy:",
                  tire.image_url,
                );
                const imgElement = e.currentTarget;
                if (!imgElement) {
                  console.error("❌ No image element available for fallback");
                  return;
                }

                // Try original URL as fallback
                const originalUrl = tire.image_url;
                imgElement.src = originalUrl;

                // If original also fails, use placeholder
                imgElement.onerror = () => {
                  console.error(
                    "❌ Original image URL also failed:",
                    originalUrl,
                  );
                  if (imgElement) {
                    imgElement.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5u+PC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2Yzc1N2QiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg==";
                    imgElement.onerror = null; // Prevent infinite loop
                  }
                };
              }}
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <div className="tire-placeholder">
              <svg width="150" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect
                  width="100%"
                  height="100%"
                  fill="#f8f9fa"
                  stroke="#dee2e6"
                  strokeWidth="2"
                />
                <text
                  x="50%"
                  y="40%"
                  fontFamily="Arial"
                  fontSize="16"
                  fill="#6c757d"
                  textAnchor="middle"
                  dy=".3em"
                >
                  🛞
                </text>
                <text
                  x="50%"
                  y="60%"
                  fontFamily="Arial"
                  fontSize="12"
                  fill="#6c757d"
                  textAnchor="middle"
                  dy=".3em"
                >
                  No Image Available
                </text>
              </svg>
            </div>
          )}
        </div>

        <div className="tire-info">
          <div className="tire-content">
            <div className="tire-brand">{tire.brand}</div>
            <div className="tire-name">{tire.product_name}</div>

            <div className="tire-rating">
              ⭐ {tire.rating} ({tire.review_count} reviews)
            </div>

            <div className="tire-details">
              <div className="season">🌡️ {tire.season}</div>
              {tire.ev_compatible && (
                <div className="ev-compatible">⚡ EV Compatible</div>
              )}
            </div>

            <div className="tire-claim">{tire.claim}</div>
          </div>

          <div className="tire-actions">
            <a
              href={tire.details_url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button primary"
            >
              View Details
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .tire-card {
          border: none;
          border-radius: 8px;
          padding: 12px;
          background: white;
          box-shadow: 0 2px 8px rgba(0, 57, 107, 0.08);
          transition: all 0.2s ease;
          border-top: 3px solid #00396B;
          height: 100%;
          width: 100%;
          max-width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          margin: 0;
          box-sizing: border-box;
          overflow: visible;
        }

        @media (min-width: 901px) {
          .tire-card {
            padding: 14px;
          }
        }

        .tire-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 57, 107, 0.2);
          border-top-color: #FFB500;
        }

        .tire-image {
          text-align: center;
          margin-bottom: 10px;
        }

        .tire-image img {
          width: 80px;
          height: 80px;
          object-fit: contain;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          transition: transform 0.2s ease;
        }

        .tire-placeholder {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border-radius: 8px;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
        }

        @media (min-width: 901px) {
          .tire-image img {
            width: 100px;
            height: 100px;
          }
          
          .tire-placeholder {
            width: 100px;
            height: 100px;
          }
        }

        .tire-info {
          text-align: center;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 0;
        }

        .tire-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .tire-brand {
          font-weight: 900;
          font-size: 11px;
          color: #00396B;
          margin-bottom: 3px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: 'Arial', 'Helvetica', sans-serif;
        }

        .tire-name {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin-bottom: 6px;
          line-height: 1.2;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Arial', 'Helvetica', sans-serif;
          text-align: center;
        }

        @media (min-width: 901px) {
          .tire-brand {
            font-size: 12px;
            margin-bottom: 4px;
          }
          
          .tire-name {
            font-size: 14px;
            margin-bottom: 8px;
          }
        }

        .tire-rating {
          color: #00396B;
          font-size: 11px;
          margin-bottom: 6px;
          font-weight: 500;
          line-height: 1.2;
        }

        .tire-claim {
          font-size: 10px;
          color: rgb(26, 26, 26);
          line-height: 1.3;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: center;
          flex: 1;
          padding: 0 4px;
          min-height: 24px;
        }

        @media (min-width: 901px) {
          .tire-rating {
            font-size: 12px;
            margin-bottom: 8px;
          }
          
          .tire-claim {
            font-size: 11px;
            margin-bottom: 12px;
          }
        }

        .tire-details {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 11px;
          justify-content: center;
          flex-wrap: wrap;
          align-items: center;
        }

        .season, .ev-compatible {
          background: #f0f4ff;
          padding: 4px 8px;
          border-radius: 12px;
          color: #00396B;
          font-weight: 600;
          white-space: nowrap;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          line-height: 1.2;
        }

        .ev-compatible {
          background: linear-gradient(135deg, #FFB500 0%, #FF8C00 100%);
          color: rgb(26, 26, 26);
          text-shadow: none;
        }

        .tire-claim {
          font-size: 13px;
          color: #7f8c8d;
          line-height: 1.4;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .tire-actions {
          display: flex;
          gap: 8px;
          margin-top: auto;
          padding-top: 12px;
        }

        .action-button {
          flex: 1;
          padding: 8px 12px;
          text-decoration: none;
          text-align: center;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 600;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .action-button {
          flex: 1;
          padding: 10px 16px;
          text-decoration: none;
          text-align: center;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .action-button.primary {
          background: #00396B;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-button.primary:hover {
          background: #004080;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 57, 107, 0.3);
        }

        .action-button.secondary {
          background: white;
          color: #00396B;
          border: 2px solid #00396B;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .action-button.secondary:hover {
          background: #00396B;
          color: white;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 57, 107, 0.3);
        }

        @media (max-width: 768px) {
          .tire-card {
            padding: 15px;
          }

          .tire-image img, .tire-placeholder {
            width: 120px;
            height: 120px;
          }

          .tire-name {
            font-size: 16px;
            min-height: 40px;
          }

          .tire-actions {
            flex-direction: column;
            gap: 8px;
          }

          .action-button {
            padding: 8px 12px;
          }
        }
      `}</style>
    </>
  );
}
