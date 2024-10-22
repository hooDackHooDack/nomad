import { motion } from 'framer-motion';
import Logo from '/public/logo/logo_col.svg';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="flex justify-center mt-40">
      <div className="relative z-10 flex flex-col items-center rounded-md">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <Logo />
        </motion.div>
        <motion.p
          className="text-xl md:text-2xl text-white mb-8 mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
        >
          다양한 체험을 경험해보세요
        </motion.p>

        <motion.button
          className="mt-8 px-8 py-3 bg-green-dark text-gray-50 font-semibold rounded-full shadow-lg hover:bg-opacity-90 transition duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.5 }}
        >
          <Link href={'/list'}>체험 둘러보기</Link>
        </motion.button>
      </div>
    </div>
  );
};
LandingPage.hideHeader = true;
export default LandingPage;
