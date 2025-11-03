import { Ship, Plane, Truck, Package, Globe, TrendingUp } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'track') => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-12">
      <section className="text-center py-16 bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl shadow-2xl text-white">
        <h1 className="text-5xl font-bold mb-6">Welcome to MSM COURIER</h1>
        <p className="text-xl mb-8 text-slate-200">
          Your trusted partner in global logistics and shipping solutions
        </p>
        <button
          onClick={() => onNavigate('track')}
          className="bg-white text-slate-800 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Track Your Parcel
        </button>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
          Our Shipping Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Ship className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Sea Freight</h3>
            <p className="text-slate-600">
              Cost-effective shipping solutions for large cargo and international deliveries.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Plane className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Air Freight</h3>
            <p className="text-slate-600">
              Fast and reliable air shipping for time-sensitive packages worldwide.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all border border-slate-200">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Truck className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Ground Transport</h3>
            <p className="text-slate-600">
              Efficient local and regional delivery services with real-time tracking.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200">
        <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">
          Why Choose MSM COURIER?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Package className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Secure Handling</h3>
            <p className="text-slate-600">
              Your packages are handled with the utmost care and security throughout the journey.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <Globe className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Global Reach</h3>
            <p className="text-slate-600">
              We deliver to over 200 countries and territories worldwide.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
              <TrendingUp className="w-8 h-8 text-slate-700" />
            </div>
            <h3 className="font-bold text-lg mb-2 text-slate-800">Real-Time Tracking</h3>
            <p className="text-slate-600">
              Track your shipments in real-time with our advanced tracking system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
