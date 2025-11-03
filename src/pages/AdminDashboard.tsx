import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase, Shipment } from '../lib/supabase';
import { ShipmentForm } from '../components/ShipmentForm';

export function AdminDashboard() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    loadShipments();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredShipments(shipments);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredShipments(
        shipments.filter(
          (s) =>
            s.tracking_id.toLowerCase().includes(term) ||
            s.sender_name.toLowerCase().includes(term) ||
            s.recipient_name.toLowerCase().includes(term) ||
            s.status.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, shipments]);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shipments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShipments(data || []);
      setFilteredShipments(data || []);
    } catch (error) {
      console.error('Error loading shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shipment?')) return;

    try {
      const { error } = await supabase.from('shipments').delete().eq('id', id);
      if (error) throw error;
      loadShipments();
    } catch (error) {
      console.error('Error deleting shipment:', error);
      alert('Failed to delete shipment');
    }
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingShipment(null);
    loadShipments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'On hold':
      case 'Missing':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (showForm) {
    return <ShipmentForm shipment={editingShipment} onClose={handleFormClose} />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Admin Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span>Create Shipment</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by tracking ID, sender, recipient, or status..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
          <p className="mt-4 text-slate-600">Loading shipments...</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-slate-200">
          <p className="text-slate-600 text-lg">No shipments found</p>
          {searchTerm && (
            <p className="text-slate-500 mt-2">Try adjusting your search term</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Tracking ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Sender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Speed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-slate-800">{shipment.tracking_id}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {shipment.sender_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {shipment.recipient_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {shipment.shipping_speed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                      {new Date(shipment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(shipment)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(shipment.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
