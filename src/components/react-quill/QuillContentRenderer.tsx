interface QuillContentRendererProps {
  content: string;
}

const QuillContentRenderer: React.FC<QuillContentRendererProps> = ({
  content,
}) => {
  if (!content) return null;

  return (
    <div
      className="text-gray-700 quill-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default QuillContentRenderer;
