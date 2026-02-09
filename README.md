# Michelin Tire Comparison ChatGPT App

A ChatGPT MCP App that provides intelligent tire search and comparison functionality for Michelin tires. Built with TypeScript and powered by [Skybridge](https://github.com/alpic-ai/skybridge).

## Features

- 🔍 **Tire Search Widget**: Search for Michelin tires by vehicle make, model, and year
- 🔧 **Tire Comparison Tool**: Compare up to 3 tires side by side with detailed specifications
- 📊 **Interactive UI**: Modern Michelin-styled interface with professional design
- 🖼️ **Image Proxy**: CORS-enabled image handling for tire photos
- 🔒 **Secure API Integration**: Environment-based configuration for Michelin API access
- ⚡ **Real-time Data**: Live tire data, ratings, and specifications

## How to Use

Ask ChatGPT to search for tires using these formats:
- `"Search for tires for Toyota Camry 2023"`
- `"Find Michelin tires for BMW X5 2022"`
- `"Compare tires for Honda Civic 2021"`

## Getting Started

### Prerequisites

- Node.js 24+
- npm or pnpm
- HTTP tunnel such as [ngrok](https://ngrok.com/download)

### Local Development

#### 1. Install Dependencies

```bash
git clone https://gitlab-dcadcx.michelin.net/cxf/future-of-apps/chatgptapps/tire-comparision-chatgptapp.git
cd tire-comparision-chatgptapp
npm install
```

#### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit the `.env` file and update the following variables:
- `MICHELIN_MCP_URL`: MCP server URL (default provided)
- `MICHELIN_MCP_AUTH`: Authorization token for Michelin API
- `SERVER_URL`: Your local server URL (default: http://localhost:3000)
- `PORT`: Server port (default: 3000)

#### 3. Start the Development Server

Run the development server from the root directory:

```bash
npm run dev
```

**Expected output:**
```
🚀 Michelin MCP Server initialized
📛 Server name: TestChatApps-Fortune-Oracle
🔧 Available widgets:
  - michelin-tire-questionnaire: Michelin Tire Questionnaire Tool
  - specific-vehicle-search: Specific Vehicle Search Tool
```

Open DevTools to test your app locally: http://localhost:3000/
MCP server running at: http://localhost:3000/mcp

#### 4. Connect to ChatGPT

- **Set up ngrok** to expose your server publicly:
```bash
ngrok http 3000
```

- **Connect to ChatGPT**:
  1. Copy the ngrok HTTPS URL (e.g., `https://abc123.ngrok-free.app`)
  2. In ChatGPT, go to Settings → Beta Features → Connect Apps
  3. Add your app: `https://abc123.ngrok-free.app/mcp`

## Widget Documentation

### Tire Search Widget
- **Purpose**: Search for Michelin tires based on vehicle specifications
- **Input**: Vehicle make, model, and year
- **Output**: Interactive grid of available tires with ratings and specifications

### Tire Comparison Widget  
- **Purpose**: Compare multiple tire options side by side
- **Input**: Tire URLs or vehicle query
- **Output**: Detailed comparison with specifications, ratings, and recommendations

## API Integration

This app integrates with Michelin's tire search and comparison APIs:
- **Search API**: `search_tyre` - Find tires by vehicle
- **Comparison API**: `compare_tyres` - Compare tire specifications
- **Authentication**: Basic Auth with environment variables

## Development

### Project Structure

```
├── server/
│   ├── src/
│   │   ├── server.ts     # Main MCP server with widget registration
│   │   └── index.ts      # Express server with image proxy
├── web/
│   └── src/
│       └── widgets/
            ├── michelin-tire-questionnaire.tsx  # Tire questionnaire widget
            ├── specific-vehicle-search.tsx      # Specific vehicle search widget
            ├── tire-comparison.tsx              # Tire comparison widget
            └── components/                      # Shared UI components
├── .env.example          # Environment variables template
└── README.md
```

### Environment Variables

Required environment variables:
- `MICHELIN_MCP_URL`: Michelin MCP server endpoint
- `MICHELIN_MCP_AUTH`: Basic auth token for Michelin API
- `SERVER_URL`: Local server URL for development
- `PORT`: Port number for the server

### Testing

Test the widgets locally:
1. Start the development server
2. Open http://localhost:3000/
3. Use the DevTools to test tire search and comparison functionality

## Deployment

1. Ensure environment variables are configured for production
2. Build the application: `npm run build`
3. Start the production server: `npm start`
4. Use a production tunnel service or deploy to cloud platform

## Contributing

1. Clone the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a merge request

## Documentation

- [Skybridge Documentation](https://docs.skybridge.tech)
- [Apps SDK Documentation](https://developers.openai.com/apps-sdk)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [Alpic Documentation](https://docs.alpic.ai/)

## License

Proprietary - Michelin Internal Use