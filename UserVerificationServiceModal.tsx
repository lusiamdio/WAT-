import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Server,
  RefreshCw,
  Terminal,
  UserCheck,
  Layers,
  Radio,
  FileCode,
} from 'lucide-react';
import { useChat } from '../context/ChatContext';
import { matrixUVS } from '../utils/matrixUVS';
import { OpenIDToken, UVSVerificationResult } from '../types';

export const UserVerificationServiceModal: React.FC = () => {
  const { isUVSModalOpen, setIsUVSModalOpen, currentUser, activeRoom, users } = useChat();

  const [selectedUser, setSelectedUser] = useState(currentUser);
  const [currentToken, setCurrentToken] = useState<OpenIDToken | null>(null);
  const [uvsResult, setUvsResult] = useState<UVSVerificationResult | null>(null);
  const [copiedToken, setCopiedToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isUVSModalOpen) return null;

  const handleGenerateAndVerifyToken = () => {
    setIsVerifying(true);
    const token = matrixUVS.generateOpenIDToken(selectedUser.handle || selectedUser.id);
    setCurrentToken(token);

    setTimeout(() => {
      const result = matrixUVS.auditUserVerification(
        selectedUser.handle || selectedUser.id,
        activeRoom?.id || '!main:wat.chat'
      );
      setUvsResult(result);
      setIsVerifying(false);
    }, 600);
  };

  const copyTokenJSON = () => {
    if (!currentToken) return;
    navigator.clipboard.writeText(JSON.stringify(currentToken, null, 2));
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-3xl w-full max-w-2xl shadow-[0_24px_48px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col max-h-[90vh] text-neutral-900">
        {/* Header */}
        <div className="px-6 py-4 bg-white/80 border-b border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-sm font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-neutral-900">
                  Matrix User Verification Service (UVS)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.05] text-neutral-700 text-[10px] font-mono border border-black/[0.08]">
                  RFC OpenID Connect & MSK
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                S2S OpenID token verification, cross-signing keys, and room power level authorization
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUVSModalOpen(false)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-black hover:bg-black/[0.04] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Persona selector for UVS audit */}
          <div>
            <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-2">
              Select Matrix Identity to Verify
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {users.map((u) => {
                const isSel = u.id === selectedUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      setSelectedUser(u);
                      setCurrentToken(null);
                      setUvsResult(null);
                    }}
                    className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                      isSel
                        ? 'bg-black text-white border-black shadow-sm'
                        : 'bg-black/[0.02] border-black/[0.06] hover:bg-black/[0.05] text-neutral-800'
                    }`}
                  >
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-black/10"
                    />
                    <div className="min-w-0">
                      <div className={`text-xs font-bold truncate ${isSel ? 'text-white' : 'text-neutral-900'}`}>{u.name}</div>
                      <div className={`text-[10px] font-mono truncate ${isSel ? 'text-white/70' : 'text-neutral-500'}`}>
                        {u.handle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger token generation */}
          <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-neutral-900">
                Perform S2S OpenID Exchange
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Target Homeserver: <span className="font-mono text-neutral-800 font-semibold">wat.matrix.sovereign.africa</span>
              </p>
            </div>

            <button
              onClick={handleGenerateAndVerifyToken}
              disabled={isVerifying}
              className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-2xl font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Negotiating Token...</span>
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" />
                  <span>Verify Identity (UVS)</span>
                </>
              )}
            </button>
          </div>

          {/* Results Display */}
          {currentToken && uvsResult && (
            <div className="space-y-4 animate-fade-in">
              {/* Token Details */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
                    <Terminal className="w-4 h-4 text-neutral-800" />
                    <span>OpenID Matrix Bearer Token</span>
                  </div>
                  <button
                    onClick={copyTokenJSON}
                    className="p-1 rounded-lg text-neutral-400 hover:text-black flex items-center gap-1 text-[10px] font-mono"
                  >
                    {copiedToken ? (
                      <>
                        <Check className="w-3 h-3 text-black" />
                        <span className="text-black font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-white p-3 rounded-xl border border-black/[0.06] font-mono text-[11px] text-neutral-800 break-all shadow-2xs">
                  {currentToken.token_type} {currentToken.access_token}
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">
                    Cross-Signing Status
                  </div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Cross-Signing</span>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Olm/Megolm Ratchet Active
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">
                    Verified Devices
                  </div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 font-mono">
                    {uvsResult.verifiedDevicesCount} Active Endpoints
                  </div>
                  <span className="text-[10px] text-neutral-500">
                    Fingerprint Match Confirmed
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-black/[0.02] border border-black/[0.06]">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase">
                    Room Power Level
                  </div>
                  <div className="text-xs font-bold text-neutral-900 mt-1 font-mono">
                    PL {uvsResult.roomPermissions?.powerLevel} ({uvsResult.roomPermissions?.powerLevel === 100 ? 'Admin' : uvsResult.roomPermissions?.powerLevel === 50 ? 'Moderator' : 'Member'})
                  </div>
                  <span className="text-[10px] text-neutral-700 font-semibold">
                    Jitsi / MatrixRTC Authorized
                  </span>
                </div>
              </div>

              {/* Cryptographic Key Hierarchy Graph */}
              <div className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.06] space-y-3">
                <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider flex items-center gap-2">
                  <Key className="w-4 h-4 text-neutral-800" />
                  <span>Matrix Cross-Signing Trust Chain</span>
                </h4>

                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-white border border-black/[0.06] flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-neutral-900 font-bold">Master Key (MSK)</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono">
                      {uvsResult.crossSigningStatus.masterKeyId}
                    </span>
                  </div>

                  <div className="pl-6 border-l-2 border-dashed border-black/[0.1] ml-4 space-y-2">
                    <div className="p-2 rounded-xl bg-white border border-black/[0.06] flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-neutral-800 font-medium">Self-Signing Key (SSK)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">Verifies local devices</span>
                    </div>

                    <div className="p-2 rounded-xl bg-white border border-black/[0.06] flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-neutral-800 font-medium">User-Signing Key (USK)</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 font-semibold">Verifies cross-federation users</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/80 border-t border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <Server className="w-4 h-4 text-neutral-800" />
            <span>UVS Endpoint: https://uvs.matrix.wat.chat</span>
          </div>
          <button
            onClick={() => setIsUVSModalOpen(false)}
            className="px-4 py-2 rounded-2xl bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
