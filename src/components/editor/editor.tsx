"use client";

import { type PartialBlock } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import { uploadFiles } from "@/lib/uploadthing";

interface EditorProps {
  initialContent?: PartialBlock[];
  onChange?: (content: PartialBlock[]) => void;
  editable?: boolean;
}

const DEFAULT_BLOCK: PartialBlock[] = [{ type: "paragraph", content: "" }];

export default function Editor({
  initialContent,
  onChange,
  editable = true,
}: EditorProps) {
  const { resolvedTheme } = useTheme();
  const editor = useCreateBlockNote({
    initialContent:
      initialContent && initialContent.length > 0
        ? initialContent
        : DEFAULT_BLOCK,
    uploadFile: async (file: File) => {
      const [res] = await uploadFiles("imageUploader", { files: [file] });
      return res?.ufsUrl ?? "";
    },
  });

  // Handler to bridge BlockNoteView's onChange (no args) to our prop (with content)
  const handleChange = () => {
    if (onChange) {
      onChange(editor.document);
    }
  };

  return (
    <div className="-mx-[54px] my-4">
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleChange}
        editable={editable}
        className="editor-content"
      />
    </div>
  );
}
