import React, { useState } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { WATBusinessSettings, TeamMember, StaffRole } from '../../../types/businessSettings';

interface Props {
  settings: WATBusinessSettings;
  updateSettings: (updater: (prev: WATBusinessSettings) => WATBusinessSettings) => void;
  showToast: (msg: string) => void;
  onNavigateSection?: (section: any) => void;
}

export const TeamStaffTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
  onNavigateSection,
}) => {
  const team = settings.team;

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<StaffRole>('Sales');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() || '+254 700 000 000',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      role: newRole,
      status: 'active',
      permissions: {
        viewChats: true,
        sendMessages: true,
        deleteMessages: false,
        manageCustomers: true,
        manageCatalog: newRole === 'Admin' || newRole === 'Manager',
        manageOrders: true,
        managePayments: newRole === 'Admin' || newRole === 'Finance',
        manageCampaigns: newRole === 'Admin' || newRole === 'Marketing',
        viewAnalytics: newRole === 'Admin' || newRole === 'Manager',
        manageStaff: newRole === 'Admin',
        changeBusinessSettings: newRole === 'Admin',
      },
    };

    updateSettings((prev) => ({
      ...prev,
      team: [...prev.team, newMember],
    }));

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setIsAddingMember(false);
    showToast(`Staff member "${newMember.name}" invited!`);
  };

  const handleDeleteMember = (id: string) => {
    updateSettings((prev) => ({
      ...prev,
      team: prev.team.filter((m) => m.id !== id),
    }));
    showToast('Staff member removed');
  };

  const handleTogglePermission = (memberId: string, permKey: keyof TeamMember['permissions']) => {
    updateSettings((prev) => ({
      ...prev,
      team: prev.team.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            permissions: {
              ...m.permissions,
              [permKey]: !m.permissions[permKey],
            },
          };
        }
        return m;
      }),
    }));
    showToast('Staff permissions updated');
  };

  return (
    <div className="space-y-8 animate-fade-in text-neutral-900">
      {/* Team & Permissions Hub */}
      <section className="bg-white rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900">Team Members & Role Permissions</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Control which staff members can view conversations, issue invoices, settle payments, and broadcast.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddingMember(!isAddingMember)}
            className="px-3.5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isAddingMember ? 'Cancel' : 'Invite Staff Member'}</span>
          </button>
        </div>

        {/* Invite Form */}
        {isAddingMember && (
          <form onSubmit={handleAddMember} className="p-4 rounded-2xl bg-white shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">Invite New Team Member</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samuel Mutua"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Email Address</label>
                <input
                  type="email"
                  placeholder="samuel@afroartisan.store"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Phone Number</label>
                <input
                  type="text"
                  placeholder="+254 711 000 000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-600 font-bold">Assigned Role</label>
                <select
                  value={newRole}
                  onChange={(e: any) => setNewRole(e.target.value)}
                  className="w-full mt-1 bg-white rounded-xl px-3 py-2 text-xs text-neutral-900 outline-none"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Manager">Manager</option>
                  <option value="Sales">Sales & Orders</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Finance">Finance & Settlements</option>
                  <option value="Marketing">Marketing & Broadcasts</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs shadow-sm"
            >
              Send Staff Invitation
            </button>
          </form>
        )}

        {/* Staff Members List */}
        <div className="space-y-4">
          {team.map((member) => (
            <div
              key={member.id}
              className="p-4 rounded-2xl bg-white shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-11 h-11 rounded-2xl object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-neutral-900">{member.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-black text-white text-[10px] font-bold">
                        {member.role}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono mt-0.5">
                      <span>{member.email}</span>
                      <span>•</span>
                      <span>{member.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedMember(selectedMember?.id === member.id ? null : member)
                    }
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-200 text-neutral-900 text-xs font-semibold shadow-xs"
                  >
                    {selectedMember?.id === member.id ? 'Hide Permissions' : 'Edit Permissions'}
                  </button>
                  {member.role !== 'Admin' && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMember(member.id)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-rose-600 transition-colors"
                      title="Remove Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Granular Permissions Grid */}
              {selectedMember?.id === member.id && (
                <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 animate-fade-in">
                  {Object.entries(member.permissions).map(([permKey, isAllowed]) => (
                    <button
                      key={permKey}
                      type="button"
                      onClick={() => handleTogglePermission(member.id, permKey as any)}
                      className={`p-2.5 rounded-xl text-xs text-left flex items-center justify-between transition-all ${
                        isAllowed
                          ? 'bg-black text-white'
                          : 'bg-white text-neutral-600 shadow-xs'
                      }`}
                    >
                      <span className="truncate capitalize text-[11px] font-medium">
                        {permKey.replace(/([A-Z])/g, ' $1')}
                      </span>
                      {isAllowed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
