import React, { useState } from "react";
import { marked } from "marked";

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState(`# Welcome to the Editor!\n\nType *Markdown* here...`);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📝 Markdown Editor with Live Preview</h1>
      <div style={styles.editorWrapper}>
        <textarea
          style={styles.textarea}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
        />
        <div
          style={styles.preview}
          dangerouslySetInnerHTML={{ __html: marked(markdown) }}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1000px",
    margin: "auto",
    fontFamily: "sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  editorWrapper: {
    display: "flex",
    gap: "20px",
  },
  textarea: {
    width: "50%",
    height: "400px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "none",
  },
  preview: {
    width: "50%",
    height: "400px",
    overflowY: "auto",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#f5f5f5",
  },
};

export default MarkdownEditor;
