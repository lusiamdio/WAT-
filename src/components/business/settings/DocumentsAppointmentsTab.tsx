import React, { useState } from 'react';
import {
  Calendar,
  FileText,
  Clock,
  DollarSign,
  User,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { WATBusinessSettings, AppointmentService } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const DocumentsAppointmentsTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const appointments = settings.appointments;
  const documents = settings.documents;

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(45);
  const [newPrice, setNewPrice] = useState(0);
  const [newStaff, setNewStaff] = useState('Nia Kiprono');
  const [isAddingService, setIsAddingService] = useState(false);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newSvc: AppointmentService = {
      id: `svc-${Date.now()}`,
      title: newTitle.trim(),
      durationMinutes: newDuration,
      bufferMinutes: 15,
      price: newPrice,
      currency: 'USD',
      assignedStaff: newStaff,
      description: 'Consultation with certified specialist',
    };

    updateSettings((prev) => ({
      ...prev,
      appointments: {
        ...prev.appointments,
        services: [...prev.appointments.services, newSvc],
      },
    }));

    setNewTitle('');
    setIsAddingService(false);
    showToast(`Appointment service "${newSvc.title}" added!`);
  };

  const handleDeleteService = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      appointments: {
        ...prev.appointments,
        services: prev.appointments.services.filter((s) => s.id !== id),
      },
    }));
    showToast('Service removed');
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-200">
      {/* 16. Appointments & Bookings */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-neutral-100">16. 📅 Appointments & Showroom Consultations</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Allow clients to schedule styling consultations, bespoke fittings, and wholesale review meetings in chat.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingService(!isAddingService)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>{isAddingService ? 'Cancel' : 'New Bookable Service'}</span>
          </button>
        </div>

        {/* Add Service Form */}
        {isAddingService && (
          <form onSubmit={handleAddService} className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 space-y-3">
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Create Bookable Service</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Service Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Artisan Showroom Fitting"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(parseInt(e.target.value) || 30)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Price ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-bold">Assigned Stylist / Staff</label>
                <input
                  type="text"
                  value={newStaff}
                  onChange={(e) => setNewStaff(e.target.value)}
                  className="w-full mt-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md"
            >
              Publish Service to Calendar
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {appointments.services.map((svc) => (
            <div
              key={svc.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-100">{svc.title}</span>
                  <span className="text-xs font-bold font-mono text-amber-400">
                    {svc.price === 0 ? 'FREE' : `$${svc.price}`}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{svc.description}</p>
                <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" /> {svc.durationMinutes} mins
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-neutral-500" /> {svc.assignedStaff}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold">✓ In-Chat Booking Link Enabled</span>
                <button
                  type="button"
                  onClick={() => handleDeleteService(svc.id)}
                  className="text-neutral-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 18. Business Documents & Invoicing Templates */}
      <section className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-neutral-100">18. 📄 Business Documents & Legal Templates</h3>
          </div>
          <span className="text-xs font-mono text-emerald-400">ISO-AFRICRAFT COMPLIANT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {documents.templates.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-900 text-amber-400">
                  {doc.type}
                </span>
                <div className="text-xs font-bold text-neutral-200 mt-2">{doc.title}</div>
                <div className="text-[10px] text-neutral-500 font-mono mt-1">Code: {doc.templateCode}</div>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">Used {doc.lastUsed}</span>
                <button
                  type="button"
                  onClick={() => showToast(`Previewing ${doc.title}`)}
                  className="text-[11px] font-bold text-emerald-400 hover:underline"
                >
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
