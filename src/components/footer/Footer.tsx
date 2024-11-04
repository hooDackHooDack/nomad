import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const socialLinks = [
    {
      name: 'Facebook',
      icon: '/icons/social/facebook.svg',
      url: 'https://github.com/hooDackHooDack/nomad',
    },
    {
      name: 'Twitter',
      icon: '/icons/social/twitter.svg',
      url: 'https://github.com/hooDackHooDack/nomad',
    },
    {
      name: 'YouTube',
      icon: '/icons/social/youtube.svg',
      url: 'https://github.com/hooDackHooDack/nomad',
    },
    {
      name: 'Instagram',
      icon: '/icons/social/instar.svg',
      url: 'https://github.com/hooDackHooDack/nomad',
    },
  ];

  return (
    <footer className="w-full h-[92px] bg-green-dark pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <span className="text-white">
          &copy; clyde&ddol9 - {new Date().getFullYear()}
        </span>
        <div className="text-white flex gap-2">
          <Link
            href="https://github.com/hooDackHooDack/nomad"
            className=" hover:underline"
          >
            Privacy Policy
          </Link>
          <Link
            href="https://github.com/hooDackHooDack/nomad"
            className="hover:underline"
          >
            FAQ
          </Link>
        </div>

        <div className="flex items-center gap-1">
          {socialLinks.map((social) => (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:opacity-80 transition-opacity"
            >
              <Image
                src={social.icon}
                alt={social.name}
                className="w-6 h-6"
                width={24}
                height={24}
              />
              <span className="sr-only">{social.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
