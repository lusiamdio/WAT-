import React, { useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { SocialLink } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, updateUserProfile } = useChat();

  const [name, setName] = useState(currentUser.name || '');
  const [handle, setHandle] = useState(currentUser.handle || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [statusMessage, setStatusMessage] = useState(currentUser.statusMessage || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [website, setWebsite] = useState(currentUser.website || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [location, setLocation] = useState(currentUser.location || '');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(
    currentUser.socialLinks ? [...currentUser.socialLinks] : []
  );

  const [newPlatform, setNewPlatform] = useState<SocialLink['platform']>('twitter');
  const [newUrl, setNewUrl] = useState('');
  const [newLabel, setNewLabel] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSocialLink = () => {
    if (!newUrl.trim()) return;
    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink: SocialLink = {
      platform: newPlatform,
      url: formattedUrl,
      label: newLabel.trim() || undefined,
    };

    setSocialLinks([...socialLinks, newLink]);
    setNewUrl('');
    setNewLabel('');
  };

  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, idx) => idx !== index));
  };

  const handleSave = () => {
    updateUserProfile({
      name: name.trim(),
      handle: handle.trim(),
      avatar: avatar.trim(),
      statusMessage: statusMessage.trim(),
      bio: bio.trim(),
      website: website.trim(),
      phone: phone.trim(),
      email: email.trim(),
      location: location.trim(),
      socialLinks: socialLinks,
    });
    onClose();
  };

  return (
    <div
      id="edit-profile-modal-page"
      className="fixed inset-0 z-50 bg-white flex flex-col w-full h-full text-neutral-900 select-none overflow-hidden"
    >
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 bg-white border-b border-black/[0.08] flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-neutral-900">
            Edit Profile
          </h1>
          <p className="text-xs text-neutral-500">
            Update personal details and photo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-1.5 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Avatar upload */}
          <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Profile Picture</h2>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={name}
                className="w-24 h-24 rounded-full object-cover border border-black/[0.1] shadow-sm"
              />
              <div className="space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Upload New Photo
                </button>
                <p className="text-[11px] text-neutral-500">
                  Supports JPG, PNG, WEBP, or GIF
                </p>
              </div>
            </div>
          </section>

          {/* Basic Info */}
          <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Personal Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Handle / Matrix ID</label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-mono outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-900">Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-neutral-900">Status Quote</label>
              <input
                type="text"
                value={statusMessage}
                onChange={(e) => setStatusMessage(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-900">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Tell others about yourself..."
                className="w-full bg-white border border-black/[0.12] rounded-lg p-2.5 text-xs text-neutral-900 outline-none focus:border-black"
              />
            </div>
          </section>

          {/* Social Links */}
          <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-sm font-bold text-neutral-900">Social Links</h2>
            <div className="space-y-2">
              {socialLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-black/[0.08] bg-white flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-neutral-900 capitalize">{link.platform}</span>
                    <p className="text-[11px] text-neutral-500 font-mono truncate max-w-sm">{link.url}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSocialLink(idx)}
                    className="px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <select
                value={newPlatform}
                onChange={(e) => setNewPlatform(e.target.value as any)}
                className="bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 font-medium outline-none"
              >
                <option value="twitter">Twitter / X</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="instagram">Instagram</option>
                <option value="website">Website</option>
              </select>
              <input
                type="text"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="flex-1 bg-white border border-black/[0.12] rounded-lg px-3 py-2 text-xs text-neutral-900 outline-none"
              />
              <button
                type="button"
                onClick={handleAddSocialLink}
                className="px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Add Link
              </button>
            </div>
          </section>

          {/* Footer Save / Cancel */}
          <div className="flex items-center justify-end gap-2 pt-2 pb-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
