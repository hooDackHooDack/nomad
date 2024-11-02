import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Logo from '/public/logo/logo_col.svg';
import Link from 'next/link';
import Image from 'next/image';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const images = [
    'balloon.png',
    'dance.png',
    'nimo.png',
    'quay.png',
    'river.png',
    'river2.png',
    'sunset.png',
    'sunset2.png',
    'vietnam.png',
    'vr.png',
    'warwick.png',
  ];

  return (
    <div className="relative overflow-hidden min-h-screen">
      <AnimatePresence>
        {isLoaded && (
          <>
            {/* Top scrolling images */}
            <div className="absolute top-0 flex gap-4 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: ['0%', '-50%'] }}
                transition={{
                  opacity: { duration: 0.5 },
                  x: { duration: 15, repeat: Infinity, ease: 'linear' },
                }}
                className="flex gap-4 whitespace-nowrap"
              >
                {images.map((img, index) => (
                  <div key={index} className="w-[120px] h-[120px]">
                    <Image
                      src={`/images/mock/listitem/${img}`}
                      alt={`scroll image ${index}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-full h-full border-2 border-green-dark"
                    />
                  </div>
                ))}
                {images.map((img, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="w-[120px] h-[120px]"
                  >
                    <Image
                      src={`/images/mock/listitem/${img}`}
                      alt={`scroll image ${index}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-full h-full border-2 border-green-dark"
                    />
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Center Content */}
            <motion.div
              className="flex justify-center items-center min-h-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex flex-col items-center rounded-md z-10">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Logo />
                </motion.div>
                <motion.p
                  className="text-xl md:text-2xl mb-8 mt-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  다양한 체험을 경험해보세요
                </motion.p>

                <motion.button
                  className="mt-8 px-8 py-3 bg-green-dark text-gray-50 font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <Link href={'/activities'}>체험 둘러보기</Link>
                </motion.button>
              </div>
            </motion.div>

            {/* Bottom scrolling images */}
            <div className="absolute bottom-0 flex gap-4 overflow-hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: ['-50%', '0%'] }}
                transition={{
                  opacity: { duration: 0.5 },
                  x: { duration: 15, repeat: Infinity, ease: 'linear' },
                }}
                className="flex gap-4 whitespace-nowrap"
              >
                {images.map((img, index) => (
                  <div key={index} className="w-[120px] h-[120px]">
                    <Image
                      src={`/images/mock/listitem/${img}`}
                      alt={`scroll image ${index}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-full h-full border-2 border-green-dark"
                    />
                  </div>
                ))}
                {images.map((img, index) => (
                  <div
                    key={`duplicate-${index}`}
                    className="w-[120px] h-[120px]"
                  >
                    <Image
                      src={`/images/mock/listitem/${img}`}
                      alt={`scroll image ${index}`}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover w-full h-full border-2 border-green-dark"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

LandingPage.hideHeader = true;
export default LandingPage;
