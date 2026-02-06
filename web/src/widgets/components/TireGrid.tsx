import { TireCard } from "./TireCard";

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

interface TireGridProps {
  tires: Tire[];
  serverUrl?: string;
}

export function TireGrid({ tires, serverUrl }: TireGridProps) {
  // Helper function to get the correct server URL for image proxy
  const getImageProxyUrl = (imageUrl: string) => {
    // Use the server URL passed from the server data, fallback to localhost for development
    const baseServerUrl = serverUrl || "http://localhost:3000";
    const proxyUrl = `${baseServerUrl}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    return proxyUrl;
  };

  return (
    <>
      <div className="tire-grid">
        {tires.map((tire, index) => (
          <TireCard
            key={index}
            tire={tire}
            getImageProxyUrl={getImageProxyUrl}
          />
        ))}
      </div>

      <style>{`
        .tire-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 16px 0 24px 0;
          padding: 0 12px;
          align-items: stretch;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 400px) {
          .tire-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 0 12px;
            margin: 12px 0 20px 0;
          }
        }

        @media (min-width: 401px) and (max-width: 600px) {
          .tire-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 0 10px;
          }
        }

        @media (min-width: 601px) and (max-width: 900px) {
          .tire-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            padding: 0 12px;
          }
        }

        @media (min-width: 901px) {
          .tire-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            padding: 0 20px;
            max-width: 1200px;
          }
        }
      `}</style>
    </>
  );
}
