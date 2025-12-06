import MobileScreen from '@/components/MobileScreen';

export default function MobilePage() {
  return (
    <MobileScreen>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4 px-6">
          <h1 className="text-4xl font-bold text-white">South Flowers</h1>
          <p className="text-primary-300">Mobile Experience</p>
        </div>
      </div>
    </MobileScreen>
  );
}