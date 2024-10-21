import Link from 'next/link';

interface Props {
  text: string;
  link: string;
  linkText: string;
}

const AuthSwitcher = ({ text, link, linkText }: Props) => {
  return (
    <div className="flex justify-center gap-2 mt-8">
      <p>{text}</p>
      <Link href={link} className="underline text-green-dark">
        {linkText}
      </Link>
    </div>
  );
};

export default AuthSwitcher;
