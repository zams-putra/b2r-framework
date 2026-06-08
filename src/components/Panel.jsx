import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 text-xs px-2 py-1 rounded transition-all duration-200"
      style={{
        fontFamily: "monospace",
        background: copied ? "#22c55e22" : "#ffffff0f",
        color: copied ? "#22c55e" : "#666",
        border: `1px solid ${copied ? "#22c55e44" : "#333"}`,
      }}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}

export default function Panel({ node, onClose }) {
    

  return (
    <AnimatePresence>
      {node && <PanelContent key="panel" node={node} onClose={onClose} />}
    </AnimatePresence>
  );
}


function PanelContent({ node, onClose }) {
  const { name, content } = node;

  return (
    <>
      {/* Mobile backdrop */}
      <motion.div
        className="fixed inset-0 z-40 md:hidden"
        style={{ background: "rgba(0,0,0,0.6)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed z-50 overflow-y-auto bottom-0 left-0 right-0 h-[80vh] md:top-0 md:right-0 md:bottom-0 md:left-auto md:h-full md:w-1/4 md:min-w-[320px]"
        style={{
          fontFamily: "monospace",
          background: "#0a0a0a",
          borderLeft: "1px solid #1f1f1f",
          borderTop: "1px solid #1f1f1f",
        }}
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 sticky top-0"
          style={{
            background: "#0a0a0a",
            borderBottom: "1px solid #1a1a1a",
          }}
        >
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{
                background: "#22c55e18",
                color: "#22c55e",
                border: "1px solid #22c55e33",
              }}
            >
              NODE
            </span>
            <h2
              className="text-sm font-bold tracking-widest uppercase"
              style={{ color: "#e5e5e5" }}
            >
              {name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded transition-all duration-150"
            style={{
              background: "#ffffff08",
              border: "1px solid #2a2a2a",
              color: "#555",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = "#e5e5e5";
              e.currentTarget.style.borderColor = "#444";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = "#555";
              e.currentTarget.style.borderColor = "#2a2a2a";
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-6">

          {/* Description */}
          <p className="text-xs leading-relaxed" style={{ color: "#888" }}>
            {content.description}
          </p>

          {/* Commands */}
          {content.commands?.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-xs tracking-widest uppercase" style={{ color: "#444" }}>
                — commands
              </span>

              {content.commands.map((item, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <span className="text-xs" style={{ color: "#22c55e99" }}>
                    {item.label}
                  </span>
                  <div
                    className="flex items-start gap-2 rounded p-3"
                    style={{ background: "#0f0f0f", border: "1px solid #1a1a1a" }}
                  >
                    <pre
                      className="text-xs flex-1 overflow-x-auto leading-relaxed"
                      style={{ color: "#c8c8c8", margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}
                    >
                      {item.cmd}
                    </pre>
                    <CopyButton text={item.cmd} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Notes */}
          {content.notes && (
            <div
              className="flex gap-3 rounded p-3"
              style={{ background: "#0d1a0d", border: "1px solid #1a2e1a" }}
            >
              <span style={{ color: "#22c55e", fontSize: 12 }}>›</span>
              <p className="text-xs leading-relaxed" style={{ color: "#4a7a4a" }}>
                {content.notes}
              </p>
            </div>
          )}

        </div>
      </motion.div>
    </>
  );
}