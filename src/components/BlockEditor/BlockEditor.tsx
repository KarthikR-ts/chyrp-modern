import { useCallback, useEffect, useMemo } from "react";
import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface BlockEditorProps {
  initialContent?: string;
  documentId: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export default function BlockEditor({ 
  initialContent, 
  documentId, 
  onChange, 
  readOnly = false 
}: BlockEditorProps) {
  // Create Yjs document for real-time collaboration
  const doc = useMemo(() => new Y.Doc(), []);
  
  // Create WebSocket provider for collaboration (using Supabase WebSocket endpoint)
  const provider = useMemo(() => {
    return new WebsocketProvider(
      `wss://${window.location.host}/ws`, // This would need to be configured
      documentId,
      doc
    );
  }, [documentId, doc]);

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: "User", // This should come from auth
        color: "#ff0000", // Random color for each user
      },
    },
  });

  const handleChange = useCallback(() => {
    if (onChange && !readOnly) {
      const content = JSON.stringify(editor.document);
      onChange(content);
    }
  }, [editor, onChange, readOnly]);

  useEffect(() => {
    editor.onChange(handleChange);
  }, [editor, handleChange]);

  useEffect(() => {
    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [provider, doc]);

  return (
    <div className="min-h-[300px] bg-background border border-border rounded-lg overflow-hidden">
      <BlockNoteView 
        editor={editor} 
        editable={!readOnly}
        theme="light"
        className="block-editor"
      />
    </div>
  );
}