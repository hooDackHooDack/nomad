interface Props {
  text: string;
  disabled: boolean;
}

const SubmitButton = ({ text, disabled }: Props) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="bg-green-dark text-gray-50 text-lg font-bold py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
    >
      {text}
    </button>
  );
};

export default SubmitButton;
