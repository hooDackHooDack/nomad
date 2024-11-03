import PopularActivitiesSection from '@/components/acitivitesSection/popular/PopularActivitiesSection';
import AllActivitiesSection from '@/components/acitivitesSection/allActivites/AllActivitiesSection';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PopularActivitiesSection />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AllActivitiesSection />
      </div>
    </div>
  );
}
