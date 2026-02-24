import "./rich-text.css";

import { Image } from "@tiptap/extension-image";
import { Typography } from "@tiptap/extension-typography";
import { Tiptap, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { useEffect } from "react";

import { FormattingMenu } from "./components/formatting-menu";

const extensions = [
  StarterKit.configure({
    link: { autolink: true, linkOnPaste: true, openOnClick: false },
  }),
  Typography,
  Image.configure({
    HTMLAttributes: {
      class: "rich-text-image",
    },
  }),
];

export function RichTextWidget({ value, onChange, disabled }: RichtTextProps) {
  const editor = useEditor({
    extensions,
    content: value ?? "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "rich-text-field",
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });
  /*
   * Update editor state if it doesn't match
   * the current value.
   */
  useEffect(() => {
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value ?? "");
    }
  }, [value, editor]);

  return (
    <Tiptap editor={editor}>
      <div className="border border-solid rounded-md bg-background focus-within:border-ring">
        <FormattingMenu />
        <div className="max-h-[600px] overflow-y-auto scrollbar">
          <Tiptap.Content />
        </div>
      </div>
    </Tiptap>
  );
}

interface RichtTextProps {
  value?: string | null;
  onChange?(value: string): void;
  disabled?: boolean;
}
