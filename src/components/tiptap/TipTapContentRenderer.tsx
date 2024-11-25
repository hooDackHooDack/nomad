import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TipTapContentRendererProps {
  content: string;
}

const TipTapContentRenderer: React.FC<TipTapContentRendererProps> = ({
  content,
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable: false,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!content) return null;

  return (
    <div className="prose max-w-none text-gray-700">
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTapContentRenderer;
