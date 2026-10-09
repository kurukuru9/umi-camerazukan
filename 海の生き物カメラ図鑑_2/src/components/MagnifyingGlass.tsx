import React, { useRef, useEffect, useState } from "react";
import jsQR from "jsqr";
import { speciesList } from "../speciesData";
import { Species } from "../types";
import { Camera, RefreshCw, Check, AlertCircle, Sparkles, HelpCircle } from "lucide-react";
import { renderCuteSVG } from "./CardPrinter";

interface MagnifyingGlassProps {
  onAddCreature: (species: Species) => void;
  selectedCreatures: Species[];
}

export default function MagnifyingGlass({ onAddCreature, selectedCreatures }: MagnifyingGlassProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedSpecies, setScannedSpecies] = useState<Species | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showManualSelect, setShowManualSelect] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // Quick feedback animations/flash
  const [showFlash, setShowFlash] = useState(false);

  // Initialize Camera Stream
  useEffect(() => {
    if (!isFrozen) {
      startCamera(facingMode);
    }
    return () => {
      stopCamera();
    };
  }, [isFrozen, facingMode]);

  const startCamera = async (currentMode: "environment" | "user") => {
    stopCamera();
    setErrorMessage("");
    try {
      // Try requesting stream with specific facingMode preference (mobile rear camera)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: currentMode, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
      setStream(mediaStream);
      setHasCameraPermission(true);
    } catch (err: any) {
      console.warn(`Camera access with mode ${currentMode} failed, trying fallback mode...`, err);
      try {
        // Fallback to the other facingMode (e.g. user/front camera on PC/mobile)
        const altMode = currentMode === "environment" ? "user" : "environment";
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: altMode, width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false
        });
        setFacingMode(altMode);
        setStream(mediaStream);
        setHasCameraPermission(true);
      } catch (fallbackErr) {
        console.warn("Alternative facing mode failed, trying general video constraint...", fallbackErr);
        try {
          // Ultimate fallback: open any available camera without facingMode constraints
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
          setStream(mediaStream);
          setHasCameraPermission(true);
        } catch (finalErr) {
          console.warn("All camera initialization attempts failed:", finalErr);
          setHasCameraPermission(false);
          setShowManualSelect(true); // Default to interactive simulation list if camera blocked
        }
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Bind stream to video element whenever stream is available or updated
  useEffect(() => {
    let active = true;
    const video = videoRef.current;
    if (video) {
      if (stream) {
        try {
          video.srcObject = stream;
          video.play().catch((err) => {
            if (active) {
              console.warn("Video play failed or aborted:", err);
            }
          });
        } catch (err) {
          console.warn("Failed to set video stream srcObject:", err);
        }
      } else {
        video.srcObject = null;
      }
    }
    return () => {
      active = false;
    };
  }, [stream]);

  // QR Processing Loop
  useEffect(() => {
    let animationFrameId: number;

    const processFrame = () => {
      if (!isScanning || isFrozen || !videoRef.current || !canvasRef.current) {
        animationFrameId = requestAnimationFrame(processFrame);
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        // Draw video frame to our hidden analysis canvas
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Scan for QR code
        try {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code && code.data) {
            // Found QR! Let's match it with our species List
            const matched = speciesList.find((sp) => sp.id === code.data.trim());
            if (matched) {
              handleFoundSpecies(matched);
            }
          }
        } catch (e) {
          console.warn("QR Code processing error", e);
        }
      }

      animationFrameId = requestAnimationFrame(processFrame);
    };

    if (hasCameraPermission && isScanning && !isFrozen) {
      animationFrameId = requestAnimationFrame(processFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasCameraPermission, isScanning, isFrozen]);

  const handleFoundSpecies = (species: Species) => {
    // Shutter sound / Audio beep
    playBeepSound();
    // Shutter freeze
    setIsFrozen(true);
    setScannedSpecies(species);
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 300);
  };

  const playBeepSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be blocked or unsupported, fail silently
    }
  };

  const handleManualSelect = (species: Species) => {
    handleFoundSpecies(species);
  };

  const handleConfirmAdd = () => {
    if (scannedSpecies) {
      // Play high pitch success beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
      } catch (e) {}

      onAddCreature(scannedSpecies);
      setScannedSpecies(null);
      setIsFrozen(false);
    }
  };

  const handleRetry = () => {
    setScannedSpecies(null);
    setIsFrozen(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* Dynamic scan flash effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-50 pointer-events-none animate-fade-out" />
      )}

      {/* Main Visual: Digital Magnifying Glass & Camera Frame */}
      <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
        {/* Camera Toggle Button (Flip front/back) - sleek and modern, perfect for mobile & PC */}
        {hasCameraPermission === true && !isFrozen && (
          <button
            onClick={() => setFacingMode((prev) => (prev === "environment" ? "user" : "environment"))}
            className="absolute top-2 right-2 bg-white hover:bg-slate-50 text-[#0284C7] hover:text-[#0EA5E9] p-2.5 rounded-full shadow-lg border-2 border-[#38BDF8]/40 z-30 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
            title="カメラの むきを きりかえる"
          >
            <RefreshCw size={16} className="animate-pulse" />
          </button>
        )}

        {/* Camera Canvas Inner Frame */}
        <div className="w-[91%] h-[91%] rounded-full overflow-hidden relative bg-slate-950 flex items-center justify-center z-10 border-4 border-[#38BDF8]/20 shadow-inner">
          {/* Real Camera Stream - Rendered unconditionally to prevent React Ref race condition */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${
              hasCameraPermission === true && !isFrozen ? "block" : "hidden"
            }`}
          />

          {/* Hidden Canvas for QR parsing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Frozen / Captured image simulation */}
          {isFrozen && scannedSpecies && (
            <div className="absolute inset-0 bg-[#E0F2FE] flex flex-col items-center justify-center p-4 z-10 animate-scale-up">
              <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-md border-4 border-dashed border-[#38BDF8] mb-3 animate-bounce">
                <svg viewBox="0 0 100 100" className="w-20 h-20">
                  {renderCuteSVG(scannedSpecies.id, scannedSpecies.color)}
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-[#0284C7] tracking-tight">{scannedSpecies.name}</h3>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-mono font-bold mt-0.5">{scannedSpecies.englishName}</p>
              <div className="mt-2 flex items-center gap-1 bg-[#F0F9FF] border border-[#BAE6FD] px-3 py-1 rounded-full text-[10px] text-slate-600 font-bold">
                <Sparkles size={12} className="text-yellow-500 animate-spin" />
                <span>スキャンせいこう！</span>
              </div>
            </div>
          )}

          {/* Scanner Overlay Guide Lines - Hidden when frozen or if camera blocked */}
          {!isFrozen && hasCameraPermission === true && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              {/* Scan box bracket indicator */}
              <div className="w-36 h-36 border-4 border-dashed border-white/60 rounded-3xl relative animate-pulse flex items-center justify-center">
                <div className="absolute top-2 left-2 w-3 h-3 border-t-4 border-l-4 border-white" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t-4 border-r-4 border-white" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b-4 border-r-4 border-white" />
                {/* scanning laser beam */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#38BDF8] shadow-lg shadow-[#38BDF8]/60 animate-scan-beam" />
              </div>
              <span className="absolute bottom-10 bg-slate-900/80 text-white text-xs px-4 py-1.5 rounded-full font-bold">
                カードのQRコードをうつしてね！
              </span>
            </div>
          )}

          {/* Camera Starting / Loading Indicator */}
          {hasCameraPermission === null && !isFrozen && (
            <div className="absolute inset-0 bg-[#E0F2FE] flex flex-col items-center justify-center p-6 text-center z-10 animate-pulse">
              <Camera size={44} className="text-[#38BDF8] mb-3 animate-bounce" />
              <p className="text-sm font-extrabold text-[#0284C7] leading-snug">
                カメラを じゅんびしているよ...
              </p>
            </div>
          )}

          {/* Fallback View: Camera blocked or missing */}
          {hasCameraPermission === false && !isFrozen && (
            <div className="absolute inset-0 bg-[#E0F2FE] flex flex-col items-center justify-center p-6 text-center z-10">
              <Camera size={44} className="text-[#38BDF8] mb-2 animate-bounce" />
              <p className="text-sm font-bold text-slate-700 leading-snug">
                カメラを つかわずに<br />
                カードを えらんで あそべるよ！
              </p>
              <button
                id="btn-open-manual-select"
                onClick={() => setShowManualSelect(true)}
                className="mt-3 px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer"
              >
                いきものリストをひらく
              </button>
            </div>
          )}
        </div>

        {/* Outer Rim of the Magnifying Glass Overlay */}
        <div className="absolute inset-0 rounded-full border-[14px] border-[#38BDF8] shadow-2xl z-20 pointer-events-none flex items-center justify-center overflow-hidden">
          {/* Glass glare effect */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/20 via-white/5 to-transparent rotate-45 transform origin-bottom-right" />
        </div>
      </div>

      {/* Freeze Review Action Controls */}
      {isFrozen && scannedSpecies && (
        <div className="flex items-center gap-3 w-full max-w-[320px] animate-fade-in">
          <button
            id="btn-retry-scan"
            onClick={handleRetry}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-extrabold rounded-full transition-all text-sm shadow-sm cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>もういちど</span>
          </button>
          <button
            id="btn-confirm-scan"
            onClick={handleConfirmAdd}
            className="flex-[1.5] flex items-center justify-center gap-1.5 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold rounded-full transition-all text-sm shadow-md cursor-pointer"
          >
            <Check size={18} />
            <span>すいそうに いれる</span>
          </button>
        </div>
      )}

      {/* Manual Selection / Simulation Tray Toggle Button */}
      {!isFrozen && (
        <button
          id="btn-toggle-manual-select"
          onClick={() => setShowManualSelect(!showManualSelect)}
          className="flex items-center gap-1.5 text-xs text-[#0284C7] hover:text-[#0EA5E9] font-bold py-1 px-3 bg-white/60 hover:bg-white rounded-full border border-[#BAE6FD] transition-all cursor-pointer"
        >
          <HelpCircle size={14} />
          <span>{showManualSelect ? "カメラ画面だけにする" : "いきものを えらんで いれる"}</span>
        </button>
      )}

      {/* Super Cute Manual Selection Grid for simulation (Crucial for iframe playability!) */}
      {showManualSelect && !isFrozen && (
        <div className="w-full bg-white/80 p-4 rounded-2xl border border-[#BAE6FD] shadow-inner max-h-[220px] overflow-y-auto animate-fade-in">
          <p className="text-[11px] font-bold text-slate-500 mb-2 text-center">
            👇 カードをタップすると、カメラにかざしたのとおなじになるよ！
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {speciesList.map((sp) => {
              const isAdded = selectedCreatures.some((c) => c.id === sp.id);
              return (
                <button
                  key={sp.id}
                  id={`btn-select-species-${sp.id}`}
                  onClick={() => handleManualSelect(sp)}
                  disabled={isAdded}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-between text-center transition-all relative cursor-pointer ${
                    isAdded
                      ? "bg-slate-50 border-slate-200 opacity-40 cursor-not-allowed"
                      : "bg-white border-slate-100 hover:border-[#38BDF8] hover:shadow-sm"
                  }`}
                >
                  <svg viewBox="0 0 100 100" className="w-10 h-10 mb-1">
                    {renderCuteSVG(sp.id, sp.color)}
                  </svg>
                  <span className="text-[10px] font-bold text-slate-700 leading-tight block break-words w-full">
                    {sp.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
