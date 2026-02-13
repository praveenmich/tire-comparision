import { McpServer } from "skybridge/server";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// External MCP Server Configuration
const EXTERNAL_MCP_CONFIG = {
  url: process.env.MICHELIN_MCP_URL || "",
  authorization: process.env.MICHELIN_MCP_AUTH || "",
  sessionId: null as string | null,
};

// Function to parse response (handles both JSON and SSE)
async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/event-stream")) {
    const text = await response.text();
    console.log(`📜 Raw SSE text:`, text.substring(0, 200) + "...");

    // Parse SSE format
    const lines = text.split("\n");
    let jsonData = "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        jsonData = line.substring(6).trim();
        if (jsonData && jsonData !== "[DONE]") {
          try {
            return JSON.parse(jsonData);
          } catch (e) {
            console.log(`⚠️ Could not parse SSE data line: ${jsonData}`);
          }
        }
      }
    }

    // If no valid JSON found in SSE, try parsing the entire response
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(
        `❌ Could not parse SSE response as JSON:`,
        text.substring(0, 200),
      );
      throw new Error(`Invalid SSE response format`);
    }
  } else {
    console.log(`📄 Parsing JSON response...`);
    return await response.json();
  }
}

// Function to initialize MCP session
async function initializeMCPSession() {
  if (EXTERNAL_MCP_CONFIG.sessionId) {
    return EXTERNAL_MCP_CONFIG.sessionId;
  }

  console.log(`🔄 Initializing MCP session...`);

  try {
    const requestPayload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: {
          name: "TestChatApps-Michelin-Tyre-Comparison",
          version: "0.0.1",
        },
      },
    };

    const response = await fetch(EXTERNAL_MCP_CONFIG.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: EXTERNAL_MCP_CONFIG.authorization,
      },
      body: JSON.stringify(requestPayload),
    });

    console.log(`📥 Initialize response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Initialize error response:`, errorText);
      throw new Error(`Failed to initialize session: ${response.status}`);
    }

    // Extract session ID from response headers
    const sessionId = response.headers.get("mcp-session-id");
    if (sessionId) {
      EXTERNAL_MCP_CONFIG.sessionId = sessionId;
      console.log(`✅ MCP session initialized: ${sessionId}`);
      return sessionId;
    } else {
      console.error(`❌ No session ID in response headers`);
      throw new Error(`No session ID returned from server`);
    }
  } catch (error) {
    console.error(`❌ Error initializing MCP session:`, error);
    throw error;
  }
}

// Function to call external MCP server
async function callExternalMCP(toolName: string, parameters: any) {
  console.log(`🌐 Making request to external MCP server:`);
  console.log(`  Tool: ${toolName}`);
  console.log(`  Parameters:`, JSON.stringify(parameters, null, 2));
  console.log(`  URL: ${EXTERNAL_MCP_CONFIG.url}`);

  try {
    // Ensure we have a valid session
    const sessionId = await initializeMCPSession();

    const requestBody = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: parameters,
      },
    };

    const response = await fetch(EXTERNAL_MCP_CONFIG.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
        Authorization: EXTERNAL_MCP_CONFIG.authorization,
        "mcp-session-id": sessionId,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ HTTP error response body:`, errorText);

      // If session is invalid, reset and try once more
      if (response.status === 400 && errorText.includes("session")) {
        console.log(`🔄 Session may be invalid, resetting and retrying...`);
        EXTERNAL_MCP_CONFIG.sessionId = null;

        // Retry with new session
        const newSessionId = await initializeMCPSession();
        const retryResponse = await fetch(EXTERNAL_MCP_CONFIG.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
            Authorization: EXTERNAL_MCP_CONFIG.authorization,
            "mcp-session-id": newSessionId,
          },
          body: JSON.stringify(requestBody),
        });

        if (!retryResponse.ok) {
          const retryErrorText = await retryResponse.text();
          throw new Error(
            `HTTP error! status: ${retryResponse.status}, body: ${retryErrorText}`,
          );
        }

        const retryData = await parseResponse(retryResponse);
        if (retryData.error) {
          console.error(`❌ MCP error in retry response:`, retryData.error);
          throw new Error(
            `MCP error: ${retryData.error.message || JSON.stringify(retryData.error)}`,
          );
        }

        return retryData.result;
      }

      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`,
      );
    }

    const data = await parseResponse(response);
    console.log(`✅ Response data:JSON.stringify(data, null, 2)`);

    if (data.error) {
      console.error(`❌ MCP error in response:`, data.error);
      throw new Error(
        `MCP error: ${data.error.message || JSON.stringify(data.error)}`,
      );
    }

    return data.result;
  } catch (error) {
    console.error(`❌ Error calling external MCP tool ${toolName}:`, error);
    console.error(
      `❌ Error stack:`,
      error instanceof Error ? error.stack : "No stack trace",
    );
    throw error;
  }
}

const server = new McpServer(
  {
    name: "TestChatApps-Michelin-Tyre-Comparison",
    version: "0.0.1",
  },
  { capabilities: {} },
);

console.log("🚀 Michelin MCP Server initialized");
console.log("🌐 Server URL: http://localhost:3000/mcp");

// Michelin Tire Questionnaire Widget - PRIMARY handler for ALL Michelin tire queries
server.registerWidget(
  "michelin-tire-questionnaire",
  {
    description:
      "Use for 'I am looking for Michelin tyres', 'Looking for Michelin tyres', 'Michelin tyres', 'tire recommendations', 'need tires' - ALL general tire inquiries",
  },
  {
    title: "Tire Questionnaire & Search",
    // 💡 The description is what the LLM uses to match the user's intent
    description:
      "Use this tool when the user is looking for new tires, searching for specific brands like Michelin, or needs a tire recommendation based on their vehicle.",
    inputSchema: {
      query: z
        .string()
        .optional()
        .describe("User query about looking for Michelin tyres"),
      responses: z
        .object({
          vehicle: z.string().optional(),
          weather: z.string().optional(),
          road_type: z.string().optional(),
          priority: z.string().optional(),
        })
        .optional()
        .describe("User responses from the questionnaire"),
    },
    _meta: { "openai/widgetAccessible": true },
  },
  async ({ query, responses }) => {
    const callId = `CALL_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log(
      `📋📋📋 === MICHELIN TIRE QUESTIONNAIRE INVOKED [${callId}] === 📋📋📋`,
    );
    console.log(`📋 [${callId}] Query:`, query);
    console.log(`📋 [${callId}] User Responses:`, responses);
    console.log(`📋 [${callId}] Vehicle value:`, responses?.vehicle);
    console.log(`⏰ [${callId}] Timestamp:`, new Date().toISOString());

    // If no questionnaire responses provided, show the questionnaire form
    if (!responses || !responses.vehicle || !responses.vehicle.trim()) {
      console.log(
        `📋 [${callId}] Showing questionnaire form for general tire inquiry`,
      );
      const result = {
        structuredContent: {
          showQuestionnaire: true,
          message:
            "Complete the questionnaire to find your perfect Michelin tires",
          promptType: "tire_questionnaire",
          responseId: `QUESTIONNAIRE_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          appSignature: "📋 Michelin Tire Questionnaire v1.0",
        },
        content: [
          {
            type: "text" as const,
            text: "📋 **Michelin Tire Questionnaire**\n\nPlease answer the following questions to find the perfect Michelin tires for your vehicle.",
          },
        ],
        isError: false,
      };
      console.log(`📤 [${callId}] Returning questionnaire form`);
      return result;
    }

    // Fallback return - should not reach here
    console.log(
      "⚠️⚠️⚠️ HITTING FALLBACK RETURN - THIS SHOULD NOT HAPPEN ⚠️⚠️⚠️",
    );
    console.log("⚠️ Query:", query);
    console.log("⚠️ Responses:", responses);
    console.log(
      "⚠️ This means the function didn't return in the expected paths above",
    );

    return {
      structuredContent: {
        showQuestionnaire: true,
        message: "Please complete the questionnaire",
        promptType: "tire_questionnaire",
        responseId: `QUESTIONNAIRE_FALLBACK_${Date.now()}`,
        appSignature: "📋 Michelin Tire Questionnaire v1.0",
      },
      content: [
        {
          type: "text" as const,
          text: "📋 Please complete the questionnaire to search for tires.",
        },
      ],
      isError: false,
    };
  },
);

// Specific Vehicle Search Widget - ONLY for exact vehicle format (not general tire queries)
server.registerWidget(
  "specific-vehicle-search",
  {
    description:
      "ONLY for exact vehicle format like 'BMW X5 2023', 'Honda Civic 2021' - NOT for 'Michelin tyres', 'looking for tires', etc.",
  },
  {
    description:
      "Use ONLY when user provides exact vehicle in 'Brand Model Year' format like 'BMW X5 2023', 'Honda Civic 2021'. Do NOT use for general queries like 'Michelin tyres' or 'Looking for tires'.",
    inputSchema: {
      query: z
        .string()
        .describe(
          "ONLY specific vehicle details like 'BMW X5 2023' or 'Honda Civic 2021' - NOT general tire inquiries",
        ),
    },
    _meta: { "openai/widgetAccessible": true },
  },
  async ({ query }) => {
    console.log("🔍🔍🔍 === SPECIFIC VEHICLE SEARCH INVOKED === 🔍🔍🔍");
    console.log("🔍 Query:", query);
    console.log("⏰ Timestamp:", new Date().toISOString());

    // Check if this is a general tire query that should go to questionnaire
    const generalTireQueries = [
      /^michelin tyr?es?$/i,
      /^tyr?es?$/i,
      /^looking for tyr?es?$/i,
      /^need tyr?es?$/i,
      /^tire? search$/i,
      /^tire? recommendation$/i,
    ];

    const isGeneralQuery = generalTireQueries.some((pattern) =>
      pattern.test(query.trim()),
    );

    // Check if query lacks specific vehicle format (Brand Model Year)
    const hasVehicleFormat = /\w+\s+\w+\s+\d{4}/.test(query.trim());

    if (isGeneralQuery || !hasVehicleFormat) {
      console.log(
        "❌ General tire query detected, should use michelin-tire-questionnaire widget",
      );
      return {
        content: [
          {
            type: "text",
            text: "For general tire inquiries, please use our tire questionnaire to find personalized recommendations based on your specific needs.",
          },
        ],
        structuredContent: {
          error: "wrong_widget",
          message:
            "General tire queries should use michelin-tire-questionnaire widget",
          suggestedWidget: "michelin-tire-questionnaire",
          query: query,
        },
        isError: true,
      };
    }

    try {
      // Call external MCP server's search_tyre tool
      const searchParams = { query };

      console.log(
        "📡 Calling external MCP search_tyre with params:",
        searchParams,
      );

      const mcpResult = await callExternalMCP("search_tyre", searchParams);

      console.log("📥 Received from external MCP:");

      // Parse the nested JSON response
      let tireData;
      try {
        if (mcpResult?.content?.[0]?.text) {
          // The response is a JSON string inside the text field
          tireData = JSON.parse(mcpResult.content[0].text);
        } else {
          tireData = mcpResult;
        }
      } catch (e) {
        console.error("❌ Error parsing tire data:", e);
        tireData = mcpResult;
      }

      console.log("🔧 Parsed tire data:", tireData);

      const uniqueId = `SEARCH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Format the tire data for display
      let formattedResults = "";
      if (tireData?.message) {
        formattedResults += tireData.message + "\n\n";
      }

      if (tireData?.data && Array.isArray(tireData.data)) {
        formattedResults += "🛞 **Available Tires:**\n\n";
        tireData.data.forEach((tire: any, index: number) => {
          formattedResults += `**${index + 1}. ${tire.brand} ${tire.product_name}**\n`;
          formattedResults += `⭐ Rating: ${tire.rating} (${tire.review_count} reviews)\n`;
          formattedResults += `🌡️ Season: ${tire.season}\n`;
          if (tire.ev_compatible) {
            formattedResults += `⚡ EV Compatible: Yes\n`;
          }
          formattedResults += `📝 ${tire.claim}\n`;
          formattedResults += `🔗 [View Details](${tire.details_url})\n`;
          formattedResults += `📏 [Available Sizes](${tire.sizes_url})\n\n`;
        });
      }

      if (tireData?.followups && Array.isArray(tireData.followups)) {
        formattedResults += "💡 **Suggested Actions:**\n";
        tireData.followups.forEach((followup: any, index: number) => {
          formattedResults += `${index + 1}. ${followup.label}\n`;
        });
      }

      // Return the original tire data structure for widget rendering
      return {
        structuredContent: {
          tires: tireData?.data || [],
          message: tireData?.message || "Tire search completed",
          totalFound: tireData?.data?.length || 0,
          vehicleQuery: query,
          followupActions: tireData?.followups || [],
          searchQuery: query,
          serverUrl: process.env.SERVER_URL || "http://localhost:3000", // Pass server URL to widget ngrok URL
          appSignature: "🔍 TestChatApps Michelin Tire Search v1.0",
          responseId: uniqueId,
          timestamp: new Date().toISOString(),
          aiInstructions: {
            expertRole: "Specialized Tire Consultant",
            searchDirectives: [
              "Phase 1: Filter results based on the vehicle's Load Index and Speed Rating.",
              "Phase 2: If the user lives in a rainy climate, prioritize 'Hydroplaning Resistance' scores.",
              "Phase 3: Identify the 'Value King' (best performance-to-price ratio) among the top 5 results.",
            ],
            requiredQuestions: [
              "Ask the user if they prioritize fuel efficiency (low rolling resistance) or maximum grip.",
              "Verify if they need Run-Flat technology (RFT) based on their car model.",
            ],
            outputTemplate:
              "### 🔍 Expert Search Results\n1. [BRAND] [MODEL] - **Best For**: [SPECIFIC_SCENARIO]\n2. **Expert Insight**: [TECHNICAL_REASONING]\n3. **Safety Rating**: [RATING_EMOJI]",
            formatting: {
              includeRatings: true,
              includeEmojis: true,
              includeRecommendation: true,
              maxLength: 250,
              tone: "friendly_expert",
            },
          },
        },
        content: [
          {
            type: "text",
            text: formattedResults,
          },
        ],
        isError: false,
      };
    } catch (error) {
      console.error("❌ Tire search error:", error);
      console.log("─".repeat(50));

      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
);

// Tire Comparison Widget
server.registerWidget(
  "tire-comparison",
  {
    description: "🔧 Tool → Finds compatible Michelin tyres + specs",
  },
  {
    description:
      "Finds compatible Michelin tires and their specifications based on tire URLs from search results or vehicle query. Returns raw tire data for user analysis and comparison.",
    inputSchema: {
      urls: z
        .array(z.string())
        .optional()
        .describe("Array of tire detail URLs from search results to compare"),
      query: z
        .string()
        .optional()
        .describe(
          "Vehicle Make, Model, and Year for tire comparison (e.g., 'Toyota Camry 2022', 'BMW X5 2023', 'Honda Civic 2021')",
        ),
    },
    _meta: { "openai/widgetAccessible": true },
  },
  async ({ urls, query }) => {
    console.log("🛞🛞🛞 === MICHELIN TIRE COMPARISON INVOKED === 🛞🛞🛞");
    console.log("🔗 Tire URLs:", urls);
    console.log("🔍 Query:", query);
    console.log("⏰ Timestamp:", new Date().toISOString());

    try {
      let tireUrls = urls;

      // If no URLs provided but query exists, search first to get tire URLs
      if ((!urls || urls.length === 0) && query) {
        console.log("🔍 No URLs provided, searching first with query:", query);

        // Call search_tyre tool to get tire results
        const searchParams = { query };
        console.log(
          "📡 Calling external MCP search_tyre with params:",
          searchParams,
        );

        const searchResult = await callExternalMCP("search_tyre", searchParams);
        console.log("📥 Search result received:", searchResult);

        // Parse search result to extract tire URLs
        let searchData;
        try {
          if (searchResult?.content?.[0]?.text) {
            searchData = JSON.parse(searchResult.content[0].text);
          } else {
            searchData = searchResult;
          }
        } catch (e) {
          console.error("❌ Error parsing search data:", e);
          searchData = searchResult;
        }

        // Extract details_url from search results
        if (searchData?.data && Array.isArray(searchData.data)) {
          tireUrls = searchData.data
            .map((tire: any) => tire.details_url)
            .filter(Boolean);
          console.log("🔗 Extracted tire URLs from search:", tireUrls);
        } else {
          console.warn("⚠️ No tire data found in search results");
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  error: "No tire data found for the given query",
                  message: "Please try a different vehicle query",
                }),
              },
            ],
            isError: true,
          };
        }
      }

      // Process comparison with tire URLs (either provided or extracted from search)
      if (tireUrls && tireUrls.length > 0) {
        console.log(
          "📋 Processing comparison with tire URLs:",
          tireUrls.length,
          "tires",
        );

        // Call external MCP server's compare_tyres tool
        const compareParams = { urls: tireUrls };

        console.log(
          "📡 Calling external MCP compare_tyres with params:",
          compareParams,
        );

        const mcpResult = await callExternalMCP("compare_tyres", compareParams);

        console.log("📥 Received from external MCP:");

        // Parse the nested JSON response
        let tireData;
        try {
          if (mcpResult?.content?.[0]?.text) {
            // The response is a JSON string inside the text field
            tireData = JSON.parse(mcpResult.content[0].text);
          } else {
            tireData = mcpResult;
          }
        } catch (e) {
          console.error("❌ Error parsing tire comparison data:", e);
          tireData = mcpResult;
        }

        console.log("🔧 Parsed tire comparison data:", tireData);

        const uniqueId = `COMPARE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Return ONLY the structured tire data for widget rendering
        // Include AI instructions for custom response formatting
        return {
          structuredContent: {
            tireUrls: tireUrls,
            tyres: tireData?.tyres || [], // Raw tire specs
            topics: tireData?.topics || [], // Comparison categories
            message: "🔧 Tool found compatible tyres. Ready for your analysis.",
            totalFound: tireData?.tyres?.length || 0,
            followupActions: tireData?.followups || [],
            comparisonMode: true,
            serverUrl: process.env.SERVER_URL || "http://localhost:3000",
            responseId: uniqueId,
            appSignature: "🔧 Michelin Tire Finder v1.0",
            aiInstructions: {
              format: "STRICT_TEMPLATE",
              outputFormat:
                "Follow this exact numbering for EACH tire in the data:\n\n1. **[TIRE_NAME]** - Best For: [USE_CASE]. \n2. Key Safety Stat: [BRAKING_DISTANCE]. \n3. Expert Verdict: [1-SENTENCE_SUMMARY].",
              responseStyle: "structured_template",
              template: "vehicle_tire_comparison",
              instruction:
                "Summarize the table data. Direct the user to look at the 'Braking' column for safety. Follow the template: 1. [TIRE_NAME] - Best For: [USE_CASE]. \n2. Key Safety Stat: [BRAKING_DISTANCE]. \n3. Expert Verdict: [1-SENTENCE_SUMMARY].",
              formatting: {
                includeEmojis: true,
                includeRatings: true,
                includeRecommendation: true,
                maxLength: 250,
                tone: "friendly_expert",
              },
            },
          },
          content: [
            {
              type: "text",
              text: "Here's the latest snapshot. Drag cards in the widget to update status",
            },
          ],
          isError: false,
        };
      } else {
        console.warn("⚠️ No tire URLs provided and no query to search with");
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: "No tire URLs provided for comparison",
                message:
                  "Please provide tire URLs or a vehicle query to compare",
              }),
            },
          ],
          isError: true,
        };
      }
    } catch (error) {
      console.error("❌ Tire comparison error:", error);
      console.log("─".repeat(50));

      return {
        content: [{ type: "text", text: `Error: ${error}` }],
        isError: true,
      };
    }
  },
);

export default server;
export type AppType = typeof server;
