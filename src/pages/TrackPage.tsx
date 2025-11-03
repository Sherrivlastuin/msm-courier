import { useState } from 'react';
import { Search, Package, MapPin, Clock, CheckCircle } from 'lucide-react';
import { supabase, Shipment } from '../lib/supabase';

export function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID');
      return;
    }

    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('shipments')
        .select('*')
        .eq('tracking_id', trackingId.trim())
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!data) {
        setError('Tracking ID not found. Please check and try again.');
      } else {
        setShipment(data);
      }
    } catch (err) {
      setError('An error occurred while tracking your parcel. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'On hold':
      case 'Missing':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-200">
        <h1 className="text-3xl font-bold mb-6 text-slate-800 flex items-center">
          <Package className="w-8 h-8 mr-3 text-slate-700" />
          Track Your Parcel
        </h1>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label htmlFor="tracking-id" className="block text-sm font-medium text-slate-700 mb-2">
              Enter Tracking ID
            </label>
            <div className="flex gap-3">
              <input
                id="tracking-id"
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g., MSM123456789"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center"
              >
                <Search className="w-5 h-5 mr-2" />
                {loading ? 'Tracking...' : 'Track'}
              </button>
            </div>
          </div>
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </form>
      </div>

      {shipment && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Shipment Details</h2>
              <span
                className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(
                  shipment.status
                )}`}
              >
                {shipment.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tracking ID</p>
                <p className="text-lg font-semibold text-slate-800">{shipment.tracking_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Shipping Speed</p>
                <p className="text-lg font-semibold text-slate-800">{shipment.shipping_speed}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Created On</p>
                <p className="text-lg text-slate-800 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  {new Date(shipment.created_at).toLocaleDateString()}
                </p>
              </div>
              {shipment.estimated_delivery && (
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Estimated Delivery</p>
                  <p className="text-lg text-slate-800 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {new Date(shipment.estimated_delivery).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-700" />
                Sender Information
              </h3>
              <div className="space-y-2 text-slate-700">
                <p className="font-semibold">{shipment.sender_name}</p>
                <p>{shipment.sender_email}</p>
                <p>{shipment.sender_phone}</p>
                <p className="text-sm">
                  {shipment.sender_address}, {shipment.sender_city}, {shipment.sender_country}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-700" />
                Recipient Information
              </h3>
              <div className="space-y-2 text-slate-700">
                <p className="font-semibold">{shipment.recipient_name}</p>
                <p>{shipment.recipient_email}</p>
                <p>{shipment.recipient_phone}</p>
                <p className="text-sm">
                  {shipment.recipient_address}, {shipment.recipient_city}, {shipment.recipient_country}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-xl font-bold mb-4 text-slate-800 flex items-center">
              <Package className="w-5 h-5 mr-2 text-slate-700" />
              Package Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Description</p>
                <p className="text-slate-800">{shipment.package_description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Weight</p>
                <p className="text-slate-800">{shipment.package_weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Quantity</p>
                <p className="text-slate-800">{shipment.package_quantity} package(s)</p>
              </div>
            </div>
            {shipment.notes && (
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-slate-700 bg-slate-50 p-3 rounded-lg">{shipment.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
