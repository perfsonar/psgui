// src/components/LoadingOverlay.jsx
import React from "react";

export default function LoadingOverlay({ active, text, children }) {
  return (
    <div>
      {children}

      {active && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(33, 33, 33, 0.7)",
            zIndex: 10,
            color: "rgba(240, 240, 240, 0.7)",

          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              className="spinner-border text-white"
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
