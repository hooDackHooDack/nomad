import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { FieldError } from 'react-hook-form';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  Heading,
} from 'lucide-react';

interface FormEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
}

const defaultValue = `<h1>체험 설명</h1><p></p><p></p><h1>찾아오시는 길</h1><p></p><p></p><h1>문의 연락처</h1><p></p><p></p>`;

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 p-2 border-b border-gray-200">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        <Bold className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        <Italic className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('underline') ? 'bg-gray-100' : ''
        }`}
      >
        <UnderlineIcon className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-2 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''
        }`}
      >
        <Heading className="w-5 h-5" />
      </button>
      <div className="w-px h-6 bg-gray-200 mx-2 self-center" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bulletList') ? 'bg-gray-100' : ''
        }`}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
};

export default function FormEditor({
  value,
  onChange,
  error,
}: FormEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: value || defaultValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div>
      <label className="block text-lg font-regular text-black mb-2">설명</label>
      <div className="border rounded-lg overflow-hidden">
        <MenuBar editor={editor} />
        <div className="min-h-[384px] p-4 [&_.ProseMirror]:outline-none">
          <EditorContent
            editor={editor}
            className="prose max-w-none
              [&_.ProseMirror_h1]:text-3xl 
              [&_.ProseMirror_h1]:font-bold 
              [&_.ProseMirror_h1]:mb-4
              [&_.ProseMirror_h1]:text-gray-800
              [&_.ProseMirror_p]:text-base
              [&_.ProseMirror_p]:mb-2
              [&_.ProseMirror_p]:text-gray-600
              [&_.ProseMirror_ul]:list-disc 
              [&_.ProseMirror_ul]:ml-4
              [&_.ProseMirror]:min-h-[300px]
              [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]
              [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-gray-400
              [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left
              [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
