// src/components/LoadingOverlay.jsx
import React from "react";

export default function LoadingOverlay({ active, text, children }) {
  return (
    <div style={{ position: "relative" }}>
      {children}

      {active && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(112,112,112,0.7)",
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner-border text-primary"
              role="status"
              aria-label="Loading"
            />
            {text && <div style={{ marginTop: 8 }}>{text}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
