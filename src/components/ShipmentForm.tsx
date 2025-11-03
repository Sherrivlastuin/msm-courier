import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase, Shipment } from '../lib/supabase';

interface ShipmentFormProps {
  shipment: Shipment | null;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  'Processing',
  'In Transit',
  'Pending',
  'Custom clearance',
  'On hold',
  'Missing',
  'Delivered',
];

const SHIPPING_SPEED_OPTIONS = ['Local', 'Standard', 'Express', 'International', 'Offshore'];

export function ShipmentForm({ shipment, onClose }: ShipmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tracking_id: '',
    status: 'Processing',
    shipping_speed: 'Standard',
    sender_name: '',
    sender_email: '',
    sender_phone: '',
    sender_address: '',
    sender_city: '',
    sender_country: '',
    recipient_name: '',
    recipient_email: '',
    recipient_phone: '',
    recipient_address: '',
    recipient_city: '',
    recipient_country: '',
    package_description: '',
    package_weight: '',
    package_quantity: '1',
    notes: '',
    estimated_delivery: '',
  });

  useEffect(() => {
    if (shipment) {
      setFormData({
        tracking_id: shipment.tracking_id,
        status: shipment.status,
        shipping_speed: shipment.shipping_speed,
        sender_name: shipment.sender_name,
        sender_email: shipment.sender_email,
        sender_phone: shipment.sender_phone,
        sender_address: shipment.sender_address,
        sender_city: shipment.sender_city,
        sender_country: shipment.sender_country,
        recipient_name: shipment.recipient_name,
        recipient_email: shipment.recipient_email,
        recipient_phone: shipment.recipient_phone,
        recipient_address: shipment.recipient_address,
        recipient_city: shipment.recipient_city,
        recipient_country: shipment.recipient_country,
        package_description: shipment.package_description,
        package_weight: shipment.package_weight.toString(),
        package_quantity: shipment.package_quantity.toString(),
        notes: shipment.notes || '',
        estimated_delivery: shipment.estimated_delivery
          ? new Date(shipment.estimated_delivery).toISOString().split('T')[0]
          : '',
      });
    }
  }, [shipment]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shipmentData = {
        tracking_id: formData.tracking_id,
        status: formData.status,
        shipping_speed: formData.shipping_speed,
        sender_name: formData.sender_name,
        sender_email: formData.sender_email,
        sender_phone: formData.sender_phone,
        sender_address: formData.sender_address,
        sender_city: formData.sender_city,
        sender_country: formData.sender_country,
        recipient_name: formData.recipient_name,
        recipient_email: formData.recipient_email,
        recipient_phone: formData.recipient_phone,
        recipient_address: formData.recipient_address,
        recipient_city: formData.recipient_city,
        recipient_country: formData.recipient_country,
        package_description: formData.package_description,
        package_weight: parseFloat(formData.package_weight),
        package_quantity: parseInt(formData.package_quantity),
        notes: formData.notes,
        estimated_delivery: formData.estimated_delivery || null,
        updated_at: new Date().toISOString(),
      };

      if (shipment) {
        const { error } = await supabase
          .from('shipments')
          .update(shipmentData)
          .eq('id', shipment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('shipments').insert([shipmentData]);
        if (error) throw error;
      }

      onClose();
    } catch (error) {
      console.error('Error saving shipment:', error);
      alert('Failed to save shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            {shipment ? 'Edit Shipment' : 'Create New Shipment'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tracking ID *
              </label>
              <input
                type="text"
                name="tracking_id"
                value={formData.tracking_id}
                onChange={handleChange}
                placeholder="MSM123456789"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Shipping Speed *
              </label>
              <select
                name="shipping_speed"
                value={formData.shipping_speed}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                required
              >
                {SHIPPING_SPEED_OPTIONS.map((speed) => (
                  <option key={speed} value={speed}>
                    {speed}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Estimated Delivery
              </label>
              <input
                type="date"
                name="estimated_delivery"
                value={formData.estimated_delivery}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sender Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="sender_name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="sender_email"
                  value={formData.sender_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="sender_phone"
                  value={formData.sender_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  name="sender_city"
                  value={formData.sender_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="sender_address"
                  value={formData.sender_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="sender_country"
                  value={formData.sender_country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recipient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="recipient_name"
                  value={formData.recipient_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="recipient_email"
                  value={formData.recipient_email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="recipient_phone"
                  value={formData.recipient_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  name="recipient_city"
                  value={formData.recipient_city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
                <input
                  type="text"
                  name="recipient_address"
                  value={formData.recipient_address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="recipient_country"
                  value={formData.recipient_country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Package Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  name="package_description"
                  value={formData.package_description}
                  onChange={handleChange}
                  placeholder="Electronics, Clothes, etc."
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="package_weight"
                  value={formData.package_weight}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="package_quantity"
                  value={formData.package_quantity}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes or special instructions..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : shipment ? 'Update Shipment' : 'Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
