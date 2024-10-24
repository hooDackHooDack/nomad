import dynamic from 'next/dynamic';
import { FieldError } from 'react-hook-form';
import 'react-quill/dist/quill.snow.css';

// react-quill Next SSR 오류. 선개발 후공부.

const QuillWrapper = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <div>로딩중...</div>,
});

interface FormEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: FieldError;
}

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ header: [1, 2, 3, false] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
  ],
};

const formats = ['bold', 'italic', 'underline', 'header', 'list', 'bullet'];

const defaultValue = `<h1>체험 설명</h1>
<p><br></p>
<p><br></p>
<p><br></p>
<h1>찾아오시는 길</h1>
<p><br></p>
<p><br></p>
<p><br></p>
<h1>문의 연락처</h1>
<p><br></p>
<p><br></p>`;

export default function FormEditor({
  value,
  onChange,
  error,
}: FormEditorProps) {
  // 컴포넌트가 마운트될 때 한 번만 기본값 설정
  const editorValue = value || defaultValue;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        설명
      </label>
      <div className="h-96">
        <QuillWrapper
          theme="snow"
          value={editorValue}
          onChange={onChange}
          modules={modules}
          formats={formats}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
