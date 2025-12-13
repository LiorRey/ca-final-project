import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import StrikethroughS from "@mui/icons-material/StrikethroughS";
import Code from "@mui/icons-material/Code";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import FormatQuote from "@mui/icons-material/FormatQuote";
// import Undo from "@mui/icons-material/Undo";
// import Redo from "@mui/icons-material/Redo";

const MenuBar = ({ editor }) => {
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive("paragraph") ?? false,
        isHeading1: ctx.editor.isActive("heading", { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive("heading", { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive("heading", { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive("heading", { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive("heading", { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive("heading", { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
      };
    },
  });

  if (!editor) {
    return null;
  }

  // Get current heading level or paragraph
  const getCurrentHeading = () => {
    if (editorState.isHeading1) return "1";
    if (editorState.isHeading2) return "2";
    if (editorState.isHeading3) return "3";
    if (editorState.isHeading4) return "4";
    if (editorState.isHeading5) return "5";
    if (editorState.isHeading6) return "6";
    return "paragraph";
  };

  const handleHeadingChange = e => {
    const value = e.target.value;
    if (value === "paragraph") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value);
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="control-group">
      <div className="button-group">
        <select
          value={getCurrentHeading()}
          onChange={handleHeadingChange}
          className="heading-dropdown"
          title="Heading"
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        <div className="button-separator"></div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
          title="Bold"
        >
          <FormatBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
          title="Italic"
        >
          <FormatItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
          title="Strikethrough"
        >
          <StrikethroughS />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? "is-active" : ""}
          title="Inline Code"
        >
          <Code />
        </button>
        <div className="button-separator"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
          title="Bullet List"
        >
          <FormatListBulleted />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
          title="Numbered List"
        >
          <FormatListNumbered />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
          title="Blockquote"
        >
          <FormatQuote />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
          title="Code Block"
        >
          <Code />
        </button>
        {/* <div className="button-separator"></div>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editorState.canUndo}
          title="Undo"
        >
          <Undo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editorState.canRedo}
          title="Redo"
        >
          <Redo />
        </button> */}
      </div>
    </div>
  );
};

export function TextEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    autofocus: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  });

  function handleEditorClick() {
    if (!editor) return;

    if (!editor.isFocused) {
      editor.commands.focus("end");
      editor.commands.insertContent("<p></p>");
    }
  }

  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <div className="text-editor-wrapper" onClick={handleEditorClick}>
        <EditorContent editor={editor} className="text-editor" />
      </div>
    </div>
  );
}
