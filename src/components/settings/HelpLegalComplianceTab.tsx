import React, { useState } from 'react';
import { WATUserSettings } from '../../types/watUserSettings';

interface Props {
  settings: WATUserSettings;
  updateSettings: (updater: (prev: WATUserSettings) => WATUserSettings) => void;
  showToast: (msg: string) => void;
}

export const HelpLegalComplianceTab: React.FC<Props> = ({
  settings,
  updateSettings,
  showToast,
}) => {
  const hl = settings.helpAndLegal;
  const [reportText, setReportText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);

  const handleRequestDataExport = () => {
    updateSettings((prev) => ({
      ...prev,
      helpAndLegal: {
        ...prev.helpAndLegal,
        dataExportRequested: true,
        lastExportDate: new Date().toISOString().split('T')[0],
      },
    }));
    showToast('Data export archive generated');
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    showToast('Report submitted');
    setReportText('');
    setShowReportModal(false);
  };

  const handleSaveTab = () => {
    showToast('Settings saved');
  };

  return (
    <div className="space-y-6 text-neutral-900 bg-white">
      {/* Help & Support */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Help & Documentation
          </h2>
          <span className="text-[11px] font-mono text-neutral-500">
            Resources
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="https://matrix.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] flex items-center justify-between transition-colors"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-neutral-900">Protocol Documentation</div>
              <div className="text-[11px] text-neutral-500">Federation and encryption specifications</div>
            </div>
          </a>

          <button
            type="button"
            onClick={() => showToast('Connecting to support...')}
            className="p-4 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] flex items-center justify-between text-left transition-colors"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-neutral-900">Contact Support</div>
              <div className="text-[11px] text-neutral-500">Account assistance and inquiries</div>
            </div>
          </button>
        </div>
      </section>

      {/* Legal & Compliance */}
      <section className="bg-white border border-black/[0.08] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <h2 className="text-sm sm:text-base font-bold text-neutral-900">
            Legal & Compliance
          </h2>
          <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-mono font-semibold">
            POPIA / GDPR
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-black/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-neutral-900">Export Personal Data</div>
            <div className="text-[11px] text-neutral-500">
              Download your profile, contacts, and metadata archive
            </div>
          </div>

          <button
            type="button"
            onClick={handleRequestDataExport}
            className="px-4 py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-colors"
          >
            Request Data Archive
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="p-3.5 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Report a Violation</div>
            <div className="text-[11px] text-neutral-500">Submit a safety or policy report</div>
          </button>

          <button
            type="button"
            onClick={() => showToast('Terms of service displayed')}
            className="p-3.5 rounded-xl bg-white border border-black/[0.08] hover:bg-black/[0.02] text-left transition-colors"
          >
            <div className="text-xs font-bold text-neutral-900">Terms of Service</div>
            <div className="text-[11px] text-neutral-500">Read privacy and usage policies</div>
          </button>
        </div>

        {showReportModal && (
          <form onSubmit={handleSendReport} className="p-4 rounded-xl bg-white border border-black/[0.12] space-y-3">
            <h3 className="text-xs font-bold text-neutral-900">Submit Report</h3>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Describe the issue or violation..."
              rows={3}
              className="w-full bg-white border border-black/[0.12] rounded-lg p-2.5 text-xs text-neutral-900 outline-none"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
              >
                Submit Report
              </button>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="px-4 py-1.5 rounded-lg border border-black/[0.15] text-neutral-700 font-semibold text-xs"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Save / Cancel Footer */}
      <div className="flex items-center justify-end gap-2 pt-2 pb-4">
        <button
          type="button"
          onClick={() => showToast('Changes discarded')}
          className="px-4 py-2 rounded-lg border border-black/[0.15] text-xs font-semibold text-neutral-700 hover:bg-black/[0.04] transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSaveTab}
          className="px-5 py-2 rounded-lg bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-colors shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
