import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  QrCode,
  Camera,
  Flashlight,
  RefreshCw,
  Upload,
  CheckCircle2,
  DollarSign,
  Smartphone,
  CreditCard,
  Building2,
  ShieldCheck,
  Receipt,
  Printer,
  Sparkles,
  Zap,
  ArrowRight,
  Sliders,
  Share2,
} from 'lucide-react';
import { soundEngine } from '../../utils/audioSynth';
import { BusinessActivity } from './businessTypes';

interface Props {
  onBack: () => void;
  onPaymentCollected: (activity: BusinessActivity) => void;
  onViewTransaction?: (activity: BusinessActivity) => void;
}

interface ScannedCustomerData {
  customerName: string;
  customerHandle: string;
  customerAvatar: string;
  method: 'M-Pesa' | 'MTN MoMo' | 'Wave' | 'Card' | 'WAT Escrow';
  suggestedAmount: string;
  currency: 'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR';
  itemsDescription: string;
}

export const BusinessScanQRPage: React.FC<Props> = ({
  onBack,
  onPaymentCollected,
  onViewTransaction,
}) => {
  const [activeMode, setActiveMode] = useState<'scan' | 'till'>('scan');
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Scanned payload & payment confirmation
  const [detectedPayload, setDetectedPayload] = useState<ScannedCustomerData | null>(null);
  const [chargeAmount, setChargeAmount] = useState('');
  const [chargeCurrency, setChargeCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR'>('USD');
  const [chargeNotes, setChargeNotes] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Success state
  const [completedActivity, setCompletedActivity] = useState<BusinessActivity | null>(null);

  // Till Code generation state (Mode 2)
  const [tillAmount, setTillAmount] = useState('50.00');
  const [tillCurrency, setTillCurrency] = useState<'USD' | 'KES' | 'NGN' | 'GHS' | 'ZAR'>('USD');
  const [tillNote, setTillNote] = useState('Artisan Goods & Coffee');
  const [copiedLink, setCopiedLink] = useState(false);

  // Quick Demo / Simulated Customer Presets
  const DEMO_CUSTOMERS: ScannedCustomerData[] = [
    {
      customerName: 'Kwame Mensah',
      customerHandle: '@kwamem:wat.chat',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      method: 'M-Pesa',
      suggestedAmount: '65.00',
      currency: 'USD',
      itemsDescription: '2x Kente Patterned Throw Pillow',
    },
    {
      customerName: 'Amina Diallo',
      customerHandle: '@amina.crafts:wat.chat',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      method: 'Wave',
      suggestedAmount: '42.50',
      currency: 'USD',
      itemsDescription: 'Handcrafted Terracotta Carafe',
    },
    {
      customerName: 'Tariq Touré',
      customerHandle: '@tariq.gh:wat.chat',
      customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      method: 'MTN MoMo',
      suggestedAmount: '120.00',
      currency: 'USD',
      itemsDescription: 'Shea Butter Organic Body Crème (Wholesale)',
    },
    {
      customerName: 'Sara Al-Mansoor',
      customerHandle: '@sara.dxb:wat.chat',
      customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      method: 'Card',
      suggestedAmount: '89.00',
      currency: 'USD',
      itemsDescription: 'Beaded Leather Artisan Satchel',
    },
  ];

  // Initialize Camera when in scan mode
  useEffect(() => {
    let isMounted = true;
    if (activeMode === 'scan' && !detectedPayload && !completedActivity) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [activeMode, detectedPayload, completedActivity]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsCameraActive(true);
      } else {
        setCameraError('Camera access not supported on this browser/device.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera permission blocked or unavailable. You can use the quick customer presets or photo upload below.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Toggle torch / flash
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !isTorchOn }],
        });
        setIsTorchOn(!isTorchOn);
      } catch {
        setIsTorchOn(!isTorchOn);
      }
    } else {
      setIsTorchOn(!isTorchOn);
    }
  };

  // Trigger customer selection / QR recognition
  const handleSelectCustomerPayload = (data: ScannedCustomerData) => {
    soundEngine.playPop();
    setDetectedPayload(data);
    setChargeAmount(data.suggestedAmount);
    setChargeCurrency(data.currency);
    setChargeNotes(data.itemsDescription);
    stopCamera();
  };

  // Handle Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate reading QR code from uploaded image
      const randomPreset = DEMO_CUSTOMERS[Math.floor(Math.random() * DEMO_CUSTOMERS.length)];
      handleSelectCustomerPayload(randomPreset);
    }
  };

  // Confirm and Charge
  const handleConfirmCharge = () => {
    if (!detectedPayload) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      soundEngine.playChime();
      const newActivity: BusinessActivity = {
        id: `tx_qr_${Date.now()}`,
        type: 'payment_received',
        title: `Payment from ${detectedPayload.customerName}`,
        subtitle: `Instant QR settlement via ${detectedPayload.method}`,
        amount: `$${parseFloat(chargeAmount || detectedPayload.suggestedAmount).toFixed(2)}`,
        status: 'Settled',
        statusColor: 'emerald',
        timestamp: 'Just now',
        customerName: detectedPayload.customerName,
        customerAvatar: detectedPayload.customerAvatar,
        referenceId: `WAT-POS-${Math.floor(100000 + Math.random() * 900000)}`,
        paymentMethod: detectedPayload.method,
        items: chargeNotes || detectedPayload.itemsDescription,
      };

      onPaymentCollected(newActivity);
      setCompletedActivity(newActivity);
      setIsProcessingPayment(false);
    }, 900);
  };

  // Reset to Scan Next
  const handleResetScan = () => {
    setDetectedPayload(null);
    setCompletedActivity(null);
    setChargeAmount('');
    setChargeNotes('');
    startCamera();
  };

  // Simulate payment for dynamic Till mode
  const handleSimulateTillPayment = () => {
    soundEngine.playChime();
    const newActivity: BusinessActivity = {
      id: `tx_till_${Date.now()}`,
      type: 'payment_received',
      title: 'Till Payment Received',
      subtitle: `Customer scanned Till QR via Lipa Na M-Pesa`,
      amount: `$${parseFloat(tillAmount || '50').toFixed(2)}`,
      status: 'Settled',
      statusColor: 'emerald',
      timestamp: 'Just now',
      customerName: 'Verified Mobile Money Payer',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      referenceId: `TILL-QR-${Math.floor(100000 + Math.random() * 900000)}`,
      paymentMethod: 'M-Pesa / Mobile Money',
      items: tillNote || 'Artisan Goods Checkout',
    };

    onPaymentCollected(newActivity);
    setCompletedActivity(newActivity);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-black/[0.06] shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-black transition-all active:scale-95"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black text-neutral-900 tracking-tight">
                Merchant QR Payment Terminal
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>Instant POS</span>
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Scan customer QR code or display your merchant Till code for instant zero-fee settlement.
            </p>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1 bg-neutral-100 rounded-2xl border border-black/[0.04] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveMode('scan');
              setDetectedPayload(null);
              setCompletedActivity(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeMode === 'scan'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-white/50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Scan Customer QR</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('till');
              setDetectedPayload(null);
              setCompletedActivity(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              activeMode === 'till'
                ? 'bg-black text-white shadow-sm'
                : 'text-neutral-600 hover:text-black hover:bg-white/50'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Merchant Till Code</span>
          </button>
        </div>
      </div>

      {/* VIEW A: PAYMENT COMPLETED RECEIPT SCREEN */}
      {completedActivity ? (
        <div className="max-w-xl mx-auto bg-white rounded-3xl border border-black/[0.08] shadow-xl p-6 sm:p-8 space-y-6 text-center animate-scale-up">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200 uppercase tracking-wider">
              Payment Settled Successfully
            </span>
            <h2 className="text-3xl font-black text-neutral-900 mt-3">
              {completedActivity.amount}
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Received via {completedActivity.paymentMethod}
            </p>
          </div>

          {/* Itemized Audit Box */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] text-left text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-black/[0.04]">
              <span className="text-neutral-500">Customer</span>
              <span className="font-bold text-neutral-900">{completedActivity.customerName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/[0.04]">
              <span className="text-neutral-500">Transaction ID</span>
              <span className="font-mono font-bold text-neutral-900">{completedActivity.referenceId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/[0.04]">
              <span className="text-neutral-500">Items / Description</span>
              <span className="font-medium text-neutral-800 text-right max-w-[240px] truncate">
                {completedActivity.items || 'Artisan Goods'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-black/[0.04]">
              <span className="text-neutral-500">Platform Fee</span>
              <span className="font-bold text-emerald-600">0.00 (WAT Zero-Fee)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-neutral-500">Settlement Protocol</span>
              <span className="font-bold text-neutral-900">Matrix Olm/Megolm Escrow</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onViewTransaction) {
                  onViewTransaction(completedActivity);
                } else {
                  onBack();
                }
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-black hover:bg-neutral-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>View Statement</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="w-full sm:w-auto py-3 px-4 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Receipt</span>
            </button>

            <button
              type="button"
              onClick={handleResetScan}
              className="w-full sm:flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Next Transaction</span>
            </button>
          </div>
        </div>
      ) : activeMode === 'scan' ? (
        /* VIEW B: LIVE CAMERA SCANNER & CONFIRMATION */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Camera Viewfinder & Presets (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative rounded-3xl bg-neutral-950 overflow-hidden aspect-[4/3] sm:aspect-[16/10] flex items-center justify-center border border-black/10 shadow-lg">
              {/* Real Video Element */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className={`absolute inset-0 w-full h-full object-cover ${
                  isCameraActive ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Viewfinder Overlay & Framing Box */}
              <div className="relative z-10 w-64 h-64 sm:w-72 sm:h-72 border-2 border-dashed border-emerald-400/70 rounded-3xl flex flex-col items-center justify-between p-4 pointer-events-none">
                {/* Corner Brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl -mt-1 -ml-1" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl -mt-1 -mr-1" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl -mb-1 -ml-1" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl -mb-1 -mr-1" />

                {/* Animated Laser Scanning Line */}
                <div className="absolute inset-x-3 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10B981] animate-bounce top-1/2 -translate-y-1/2" />

                <div className="text-[11px] font-bold text-white/80 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm">
                  Align Customer QR Code
                </div>

                <div className="text-[10px] text-emerald-400 font-mono bg-black/60 px-2.5 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Optical Sensor Active</span>
                </div>
              </div>

              {/* Camera Controls Overlay */}
              <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between pointer-events-auto">
                <button
                  type="button"
                  onClick={toggleTorch}
                  className={`p-3 rounded-2xl backdrop-blur-md border text-xs font-bold flex items-center gap-2 transition-all ${
                    isTorchOn
                      ? 'bg-amber-400 text-black border-amber-300 shadow-lg shadow-amber-400/30'
                      : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                  }`}
                >
                  <Flashlight className="w-4 h-4" />
                  <span>{isTorchOn ? 'Torch On' : 'Torch Off'}</span>
                </button>

                <label className="p-3 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Upload QR Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Error or Fallback Warning */}
              {cameraError && (
                <div className="absolute inset-x-6 top-6 z-20 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>

            {/* Quick Demo Customer QR Simulation Presets */}
            <div className="bg-white p-5 rounded-3xl border border-black/[0.06] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                    Instant Demo Presets (Simulated Scans)
                  </h3>
                </div>
                <span className="text-[11px] text-neutral-400 font-medium">Click to simulate customer scan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DEMO_CUSTOMERS.map((cust) => (
                  <button
                    key={cust.customerName}
                    type="button"
                    onClick={() => handleSelectCustomerPayload(cust)}
                    className="p-3 rounded-2xl border border-black/[0.06] hover:border-emerald-500/60 hover:bg-emerald-50/40 text-left transition-all group flex items-center gap-3 active:scale-[0.98]"
                  >
                    <img
                      src={cust.customerAvatar}
                      alt={cust.customerName}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 truncate">
                          {cust.customerName}
                        </span>
                        <span className="text-xs font-black text-neutral-900">
                          ${cust.suggestedAmount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 mt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-700">
                          {cust.method}
                        </span>
                        <span className="truncate">{cust.itemsDescription}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Scanned Customer Data & Instant Charge Terminal (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 space-y-6 sticky top-6">
              <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900">Payment Authorization</h3>
                    <p className="text-[11px] text-neutral-500">Review & finalize customer charge</p>
                  </div>
                </div>

                {detectedPayload && (
                  <button
                    type="button"
                    onClick={() => {
                      setDetectedPayload(null);
                      startCamera();
                    }}
                    className="text-[11px] font-bold text-neutral-500 hover:text-black underline"
                  >
                    Rescan
                  </button>
                )}
              </div>

              {detectedPayload ? (
                <div className="space-y-5">
                  {/* Verified Customer Card */}
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] flex items-center gap-3">
                    <img
                      src={detectedPayload.customerAvatar}
                      alt={detectedPayload.customerName}
                      className="w-12 h-12 rounded-2xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-neutral-900 truncate">
                          {detectedPayload.customerName}
                        </h4>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-neutral-500 font-mono truncate">
                        {detectedPayload.customerHandle}
                      </p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-black/[0.06] text-neutral-700">
                        Method: {detectedPayload.method}
                      </span>
                    </div>
                  </div>

                  {/* Charge Amount Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Settlement Amount
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-lg font-black text-neutral-400">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        value={chargeAmount}
                        onChange={(e) => setChargeAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-9 pr-24 py-3 rounded-2xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:ring-2 focus:ring-emerald-500 text-xl font-black text-neutral-900 outline-none transition-all"
                      />
                      <div className="absolute right-2 flex items-center gap-1">
                        {(['USD', 'KES', 'NGN'] as const).map((curr) => (
                          <button
                            key={curr}
                            type="button"
                            onClick={() => setChargeCurrency(curr)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                              chargeCurrency === curr
                                ? 'bg-black text-white'
                                : 'text-neutral-500 hover:bg-neutral-200'
                            }`}
                          >
                            {curr}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Quick increment pills */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {[10, 25, 50, 100].map((add) => (
                        <button
                          key={add}
                          type="button"
                          onClick={() => {
                            const cur = parseFloat(chargeAmount || '0');
                            setChargeAmount((cur + add).toFixed(2));
                          }}
                          className="px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold transition-colors"
                        >
                          +${add}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Items / Reference Notes */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                      Items / Transaction Note
                    </label>
                    <input
                      type="text"
                      value={chargeNotes}
                      onChange={(e) => setChargeNotes(e.target.value)}
                      placeholder="e.g. 2x Handcrafted Jewelry & Coffee"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-black/[0.08] focus:bg-white focus:ring-2 focus:ring-emerald-500 text-xs font-medium text-neutral-900 outline-none"
                    />
                  </div>

                  {/* Final Charge Action Button */}
                  <button
                    type="button"
                    onClick={handleConfirmCharge}
                    disabled={isProcessingPayment || !chargeAmount || parseFloat(chargeAmount) <= 0}
                    className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
                  >
                    {isProcessingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying with Escrow...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept & Collect ${parseFloat(chargeAmount || '0').toFixed(2)}</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-neutral-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by Matrix Olm/Megolm zero-chargeback escrow</span>
                  </p>
                </div>
              ) : (
                <div className="py-12 px-4 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-700">Waiting for QR Code Scan</h4>
                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    Point your camera at a customer's WAT or Mobile Money QR code, or click any demo preset on the left.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* VIEW C: MERCHANT TILL QR CODE (Mode 2) */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-black/[0.06] shadow-sm p-6 sm:p-8 space-y-6 text-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
              <QrCode className="w-3.5 h-3.5" />
              <span>Official Merchant Till Code</span>
            </div>
            <h2 className="text-xl font-black text-neutral-900">
              Show QR Code to Customer
            </h2>
            <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
              Customers can scan this code with their smartphone camera, M-Pesa app, Wave, or WAT messenger.
            </p>
          </div>

          {/* Amount Config */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-neutral-50 border border-black/[0.05] text-left space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-700">Set Amount to Request</label>
              <div className="flex items-center gap-1">
                {(['USD', 'KES', 'NGN', 'GHS'] as const).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTillCurrency(c)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      tillCurrency === c ? 'bg-black text-white' : 'text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative flex items-center">
              <span className="absolute left-3.5 text-base font-bold text-neutral-400">$</span>
              <input
                type="number"
                value={tillAmount}
                onChange={(e) => setTillAmount(e.target.value)}
                placeholder="50.00"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-black/[0.08] text-base font-black text-neutral-900 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-600 block mb-1">Items / Note</label>
              <input
                type="text"
                value={tillNote}
                onChange={(e) => setTillNote(e.target.value)}
                placeholder="Order Reference"
                className="w-full px-3 py-1.5 rounded-xl bg-white border border-black/[0.08] text-xs font-medium text-neutral-800 outline-none"
              />
            </div>
          </div>

          {/* High-Resolution QR Graphic */}
          <div className="relative inline-block p-6 bg-white rounded-3xl border-2 border-black/[0.08] shadow-md">
            {/* SVG Simulated Authentic Pan-African Merchant QR */}
            <svg
              className="w-56 h-56 mx-auto"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="200" height="200" rx="16" fill="white" />
              {/* Corner Position Targets */}
              <rect x="20" y="20" width="45" height="45" rx="8" fill="#171717" />
              <rect x="27" y="27" width="31" height="31" rx="4" fill="white" />
              <rect x="34" y="34" width="17" height="17" rx="3" fill="#10B981" />

              <rect x="135" y="20" width="45" height="45" rx="8" fill="#171717" />
              <rect x="142" y="27" width="31" height="31" rx="4" fill="white" />
              <rect x="149" y="34" width="17" height="17" rx="3" fill="#10B981" />

              <rect x="20" y="135" width="45" height="45" rx="8" fill="#171717" />
              <rect x="27" y="142" width="31" height="31" rx="4" fill="white" />
              <rect x="34" y="149" width="17" height="17" rx="3" fill="#10B981" />

              {/* QR Data Matrix Bits */}
              <rect x="75" y="24" width="10" height="10" rx="2" fill="#262626" />
              <rect x="95" y="24" width="10" height="10" rx="2" fill="#262626" />
              <rect x="115" y="24" width="10" height="10" rx="2" fill="#262626" />
              <rect x="75" y="44" width="20" height="10" rx="2" fill="#262626" />
              <rect x="105" y="44" width="15" height="10" rx="2" fill="#262626" />

              <rect x="24" y="75" width="15" height="10" rx="2" fill="#262626" />
              <rect x="44" y="75" width="15" height="15" rx="2" fill="#262626" />
              <rect x="75" y="75" width="20" height="20" rx="4" fill="#10B981" />
              <rect x="105" y="75" width="15" height="10" rx="2" fill="#262626" />
              <rect x="135" y="75" width="20" height="10" rx="2" fill="#262626" />
              <rect x="165" y="75" width="10" height="10" rx="2" fill="#262626" />

              <rect x="24" y="95" width="10" height="20" rx="2" fill="#262626" />
              <rect x="44" y="95" width="20" height="10" rx="2" fill="#262626" />
              <rect x="135" y="95" width="15" height="20" rx="2" fill="#262626" />
              <rect x="160" y="95" width="15" height="10" rx="2" fill="#262626" />

              <rect x="75" y="115" width="15" height="15" rx="2" fill="#262626" />
              <rect x="100" y="115" width="20" height="10" rx="2" fill="#262626" />
              <rect x="135" y="125" width="20" height="10" rx="2" fill="#262626" />

              <rect x="75" y="145" width="10" height="20" rx="2" fill="#262626" />
              <rect x="95" y="145" width="20" height="10" rx="2" fill="#262626" />
              <rect x="125" y="145" width="10" height="10" rx="2" fill="#262626" />
              <rect x="145" y="145" width="15" height="20" rx="2" fill="#262626" />
              <rect x="170" y="145" width="10" height="10" rx="2" fill="#262626" />

              <rect x="75" y="170" width="25" height="10" rx="2" fill="#262626" />
              <rect x="110" y="170" width="15" height="10" rx="2" fill="#262626" />
              <rect x="135" y="170" width="20" height="10" rx="2" fill="#262626" />

              {/* Central WAT Brand Badge */}
              <rect x="80" y="80" width="40" height="40" rx="12" fill="#000000" />
              <text
                x="100"
                y="105"
                textAnchor="middle"
                fill="#34D399"
                fontSize="12"
                fontWeight="900"
                fontFamily="sans-serif"
              >
                WAT
              </text>
            </svg>

            {/* Merchant Identifier */}
            <div className="mt-3 font-mono text-xs font-bold text-neutral-800">
              Till #WAT-8829-PAY • ${parseFloat(tillAmount || '0').toFixed(2)}
            </div>
          </div>

          {/* Test Action Simulation Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSimulateTillPayment}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>Simulate Customer Payment Received (${tillAmount})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(
                  `https://wat.chat/pay/merchant-8829?amount=${tillAmount}&note=${encodeURIComponent(
                    tillNote
                  )}`
                );
                setCopiedLink(true);
                soundEngine.playPop();
                setTimeout(() => setCopiedLink(false), 2500);
              }}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedLink ? 'Copied Payment Link!' : 'Copy Payment Link'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
