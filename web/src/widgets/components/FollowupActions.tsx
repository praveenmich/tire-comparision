interface FollowupAction {
  label: string;
  input: string;
  type?: "compare" | "search" | "filter" | "navigate";
}

interface FollowupActionsProps {
  followupActions: FollowupAction[];
  onAction?: (action: FollowupAction) => void;
}

export function FollowupActions({
  followupActions,
  onAction,
}: FollowupActionsProps) {
  if (!followupActions || followupActions.length === 0) {
    return null;
  }

  const handleActionClick = (action: FollowupAction) => {
    console.log("Executing followup action:", action);

    // Handle different types of actions
    switch (action.type) {
      case "compare":
        handleCompareAction(action);
        break;
      case "search":
        handleSearchAction(action);
        break;
      case "filter":
        handleFilterAction(action);
        break;
      default:
        // Fallback to generic action handler
        if (onAction) {
          onAction(action);
        } else {
          // Default behavior - log for development
          console.log("Generic followup action:", action);
          alert(`Action executed: ${action.label}\nDetails: ${action.input}`);
        }
    }
  };

  const handleCompareAction = (action: FollowupAction) => {
    // Trigger tire comparison functionality
    console.log("🔍 Initiating tire comparison...", action);

    // Use callback if available
    if (onAction) {
      onAction(action);
    } else {
      // Fallback: Log for development purposes
      console.log("No onAction handler available. Action:", action);
      alert(
        `Comparison initiated for: ${action.label}\nQuery: ${action.input}`,
      );
    }
  };

  const handleSearchAction = (action: FollowupAction) => {
    // Trigger new search with refined criteria
    console.log("🔍 Initiating new search...", action);

    // Use callback if available
    if (onAction) {
      onAction(action);
    } else {
      // Fallback: Log for development purposes
      console.log("No onAction handler available. Action:", action);
      alert(`New search initiated: ${action.label}\nQuery: ${action.input}`);
    }
  };

  const handleFilterAction = (action: FollowupAction) => {
    // Apply filter to current results
    console.log("🔽 Applying filter...", action);

    // Use callback if available
    if (onAction) {
      onAction(action);
    } else {
      // Fallback: Log for development purposes
      console.log("No onAction handler available. Action:", action);
      alert(`Filter applied: ${action.label}\nCriteria: ${action.input}`);
    }
  };

  return (
    <>
      <div className="followup-actions">
        <h4>💡 What's Next?</h4>
        <div className="action-buttons">
          {followupActions.map((action, index) => (
            <button
              key={index}
              className="followup-button"
              onClick={() => handleActionClick(action)}
              title={`Execute: ${action.label}`}
            >
              <span className="button-icon">
                {action.type === "compare" && "⚖️"}
                {action.type === "search" && "🔍"}
                {action.type === "filter" && "🔽"}
                {!action.type && "💡"}
              </span>
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .followup-actions {
          text-align: center;
          padding: 20px 16px;
          background: linear-gradient(135deg, #f8fbff 0%, #e8f2ff 100%);
          border-radius: 6px;
          border: 2px solid #00396B;
          margin-top: 20px;
        }

        .followup-actions h4 {
          color: #00396B;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Arial', 'Helvetica', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .followup-button {
          padding: 14px 28px;
          background: linear-gradient(135deg, #00396B 0%, #004080 100%);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          box-shadow: 0 3px 6px rgba(0, 57, 107, 0.2);
          font-family: 'Arial', 'Helvetica', sans-serif;
          display: flex;
          align-items: center;
          gap: 6px;
          justify-content: center;
        }

        .button-icon {
          font-size: 14px;
          line-height: 1;
        }

        .followup-button:hover {
          background: linear-gradient(135deg, #FFB500 0%, #FF8C00 100%);
          box-shadow: 0 6px 12px rgba(255, 181, 0, 0.3);
        }

        .followup-button:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .followup-actions {
            padding: 15px;
          }

          .action-buttons {
            flex-direction: column;
            gap: 10px;
          }

          .followup-button {
            width: 100%;
            padding: 10px 20px;
          }
        }
      `}</style>
    </>
  );
}
