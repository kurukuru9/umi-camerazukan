import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { speciesList } from "../speciesData";
import { Printer, ArrowLeft, Info } from "lucide-react";

interface CardPrinterProps {
  onBack: () => void;
}

export default function CardPrinter({ onBack }: CardPrinterProps) {
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});
  const [printError, setPrintError] = useState(false);

  useEffect(() => {
    const generateQRs = async () => {
      const urls: Record<string, string> = {};
      for (const sp of speciesList) {
        try {
          // Generate a clean QR code data URL encoding just the species ID
          const url = await QRCode.toDataURL(sp.id, {
            margin: 1,
            width: 120,
            color: {
              dark: "#0F172A",
              light: "#FFFFFF",
            },
          });
          urls[sp.id] = url;
        } catch (err) {
          console.error("Failed to generate QR for", sp.id, err);
        }
      }
      setQrCodes(urls);
    };

    generateQRs();
  }, []);

  const handlePrint = () => {
    setPrintError(false);
    try {
      window.print();
    } catch (err) {
      console.warn("Print trigger blocked or failed in sandbox:", err);
      setPrintError(true);
    }
  };

  return (
    <div id="card-printer" className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 print:p-0 print:bg-white text-slate-800 font-sans">
      {/* Navigation Header - Hidden in Print */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <button
          id="btn-back-from-print"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-sm text-slate-600 transition-colors font-medium w-fit"
        >
          <ArrowLeft size={18} />
          <span>ずかんへ もどる</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-trigger-print"
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-[#38BDF8] hover:bg-[#0EA5E9] text-white rounded-full shadow-md font-semibold transition-transform active:scale-95 cursor-pointer animate-pulse"
          >
            <Printer size={20} />
            <span>カードを いんさつする (A4)</span>
          </button>
        </div>
      </div>

      {/* Printing Error Banner - Only visible if window.print failed */}
      {printError && (
        <div className="max-w-4xl mx-auto mb-6 bg-red-50 border-2 border-red-200 p-4 rounded-2xl text-red-800 text-sm font-bold print:hidden animate-bounce">
          ⚠️ プレビュー画面のセキュリティ制限のため、印刷画面がひらけませんでした。<br />
          がめんの右上にある<span className="bg-red-100 px-1.5 py-0.5 rounded text-red-700 mx-1">「新しいタブで開く（右上矢印 ↗）」</span>ボタンをおして、あたらしく開いたがめんで「カードをいんさつする」ボタンをもういちどおしてみてね！
        </div>
      )}

      {/* Intro info card - Hidden in Print */}
      <div className="max-w-4xl mx-auto mb-8 bg-white p-5 rounded-2xl shadow-sm border border-[#BAE6FD] flex gap-3 print:hidden">
        <Info className="text-[#0EA5E9] shrink-0" size={24} />
        <div className="text-sm text-slate-600 leading-relaxed">
          <p className="font-bold text-[#0284C7] text-base mb-1">🖨️ いきものカードの あそびかた</p>
          <p>このカードをいんさつ（A4サイズ）して、ハサミできりとって あそべます。スマホやタブレットのカメラでQRコードをうつすと、カメラにいきものが とびだすよ！</p>
          <p className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
            💡 <strong>印刷画面がひらかないとき：</strong><br />
            アプリのプレビュー画面のせいげんにより、印刷がひらかないことがあります。そのばあいは、がめんの右上にある<strong>「新しいタブで開く（↗）」</strong>ボタンをおしてから、もういちど「カードをいんさつする」をおしてね！
          </p>
        </div>
      </div>

      {/* Grid wrapper for Cards */}
      <div className="max-w-5xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 print:border-none print:shadow-none print:p-0">
        <div className="text-center mb-8 print:mb-4">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0284C7] tracking-tight">
            🐳 うみのいきものカメラずかん カードシート
          </h1>
          <p className="text-slate-500 text-sm mt-1 print:hidden">
            A4サイズ・よこ向きでの印刷がおすすめです
          </p>
        </div>

        {/* 25 species grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 print:gap-4 print:grid-cols-3">
          {speciesList.map((sp) => (
            <div
              key={sp.id}
              className="relative border-4 border-dashed rounded-2xl p-4 flex flex-col items-center justify-between min-h-[250px] transition-all bg-white break-inside-avoid print:border-slate-300 print:p-3"
              style={{ borderColor: sp.color + "55" }}
            >
              {/* Cute Badge/Category */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 print:border"
                style={{ backgroundColor: sp.bgColor, color: sp.color, border: `1px solid ${sp.color}33` }}
              >
                {sp.category}
              </span>

              {/* Character Illustration SVG */}
              <div className="w-24 h-24 flex items-center justify-center relative mb-2">
                <div
                  className="absolute inset-0 rounded-full scale-90"
                  style={{ backgroundColor: sp.bgColor + "99" }}
                />
                {/* Embedded SVG illustration based on type */}
                <svg viewBox="0 0 100 100" className="w-20 h-20 relative z-10">
                  {renderCuteSVG(sp.id, sp.color)}
                </svg>
              </div>

              {/* Names and QR code split */}
              <div className="w-full flex items-end justify-between gap-2 border-t pt-3 border-slate-100 mt-2">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                    {sp.englishName}
                  </span>
                  <span className="text-base font-extrabold text-slate-800 tracking-tight">
                    {sp.name}
                  </span>
                </div>

                {/* QR Code */}
                <div className="w-14 h-14 bg-slate-50 p-1 rounded-lg border border-slate-100 flex items-center justify-center shrink-0">
                  {qrCodes[sp.id] ? (
                    <img
                      src={qrCodes[sp.id]}
                      alt="QR"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-200 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Small cut guidelines */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-slate-300" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-slate-300" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-slate-300" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-slate-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Highly stylized, cute vector SVG drawings matching the user's uploaded layout style
export function renderCuteSVG(id: string, color: string) {
  switch (id) {
    case "clownfish":
      return (
        <g>
          {/* Orange Body with black-edged fins */}
          <ellipse cx="50" cy="50" rx="36" ry="24" fill="#FF8A3D" />
          {/* White stripes with black outlines */}
          <path d="M 38 27 Q 44 50 38 73 L 46 71 Q 50 50 46 29 Z" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 66 31 Q 68 50 66 69 L 72 67 Q 74 50 72 33 Z" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          {/* Back Fin with black tips */}
          <path d="M 14 50 L 2 36 L 4 64 Z" fill="#FF8A3D" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 3 45 Q 6 50 3 55" stroke="black" strokeWidth="2.5" fill="none" />
          {/* Dorsal fin with black tip */}
          <path d="M 32 28 Q 50 14 64 28" stroke="#1E293B" strokeWidth="2.5" fill="#FF8A3D" />
          <path d="M 42 20 Q 52 16 58 22" stroke="black" strokeWidth="2" fill="none" />
          {/* Little Fin with black edge */}
          <path d="M 52 64 Q 60 74 54 80 Q 48 74 52 64" fill="#FF8A3D" stroke="#1E293B" strokeWidth="2" />
          <path d="M 54 75 Q 56 78 52 79" stroke="black" strokeWidth="2" fill="none" />
          {/* Eye */}
          <circle cx="76" cy="45" r="7" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="78" cy="45" r="3.5" fill="#1E293B" />
          <circle cx="80" cy="43" r="1.2" fill="white" />
          {/* Mouth */}
          <path d="M 84 54 Q 80 57 76 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "anemone":
      return (
        <g>
          {/* Pink pedestal */}
          <path d="M 25 78 L 75 78 L 70 56 L 30 56 Z" fill="#F472B6" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Waving layered tentacles with contrasting tips */}
          <path d="M 28 56 Q 16 26 10 16 Q 20 26 30 56" fill="#EC4899" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 36 56 Q 30 20 26 10 Q 36 20 40 56" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 50 56 Q 50 16 50 6 Q 58 20 56 56" fill="#D946EF" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 64 56 Q 70 20 74 10 Q 64 20 60 56" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 72 56 Q 84 26 90 16 Q 80 26 70 56" fill="#EC4899" stroke="#1E293B" strokeWidth="1.5" />
          {/* Layer 2 tentacles foreground */}
          <path d="M 32 56 Q 24 35 20 25 M 42 56 Q 44 32 46 22 M 58 56 Q 56 32 54 22 M 68 56 Q 76 35 80 25" stroke="#1E293B" strokeWidth="2" fill="none" />
          {/* Colorful round tips */}
          <circle cx="10" cy="16" r="3.5" fill="#F43F5E" stroke="#1E293B" strokeWidth="1" />
          <circle cx="26" cy="10" r="3.5" fill="#E879F9" stroke="#1E293B" strokeWidth="1" />
          <circle cx="50" cy="6" r="3.5" fill="#F472B6" stroke="#1E293B" strokeWidth="1" />
          <circle cx="74" cy="10" r="3.5" fill="#E879F9" stroke="#1E293B" strokeWidth="1" />
          <circle cx="90" cy="16" r="3.5" fill="#F43F5E" stroke="#1E293B" strokeWidth="1" />
          {/* Symbiotic Clownfish peek */}
          <g transform="translate(18, 48) scale(0.4)">
            <ellipse cx="50" cy="50" rx="20" ry="14" fill="#FF8A3D" stroke="#1E293B" strokeWidth="2" />
            <path d="M 45 38 Q 48 50 45 62" stroke="#1E293B" strokeWidth="2" fill="none" />
            <circle cx="58" cy="46" r="3.5" fill="white" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="59" cy="46" r="1.5" fill="black" />
          </g>
          {/* Face */}
          <circle cx="38" cy="64" r="1.5" fill="#1E293B" />
          <circle cx="62" cy="64" r="1.5" fill="#1E293B" />
          <path d="M 46 68 Q 50 71 54 68" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "shark":
      return (
        <g>
          {/* Shark body with distinct white belly */}
          <path d="M 12 55 Q 35 22 68 32 Q 85 43 92 48 Q 75 66 55 63 Q 32 61 12 55 Z" fill="#7E90A3" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 32 59 Q 55 62 68 53 Q 78 48 82 47 Q 70 58 55 58 Z" fill="white" />
          {/* Tall sharp dorsal fin */}
          <path d="M 40 31 L 48 8 L 56 29 Z" fill="#7E90A3" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Back tail with tall upper lobe */}
          <path d="M 12 55 L 2 34 L 6 54 L 0 68 Z" fill="#7E90A3" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Gills */}
          <line x1="58" y1="42" x2="58" y2="49" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="61" y1="43" x2="61" y2="48" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64" y1="44" x2="64" y2="47" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="76" cy="40" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="77" cy="40" r="2.5" fill="#1E293B" />
          {/* Mouth open showing cute sharp triangle teeth */}
          <path d="M 72 51 Q 80 57 86 50 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.5" />
          <polygon points="75,51 77,54 79,51" fill="white" />
          <polygon points="79,51 81,54 83,51" fill="white" />
          <polygon points="83,51 85,54 87,51" fill="white" />
        </g>
      );
    case "anchovies":
      return (
        <g>
          {/* 5 shiny anchovies with signature silver lateral stripes */}
          {[
            { x: 8, y: 12, s: 0.9, f: "#60A5FA" },
            { x: 38, y: 22, s: 1.1, f: "#3B82F6" },
            { x: 12, y: 44, s: 1.0, f: "#93C5FD" },
            { x: 42, y: 56, s: 0.8, f: "#2563EB" },
            { x: 10, y: 68, s: 0.95, f: "#60A5FA" }
          ].map((fish, i) => (
            <g key={i} transform={`translate(${fish.x}, ${fish.y}) scale(${fish.s})`}>
              {/* Fish body */}
              <ellipse cx="28" cy="15" rx="15" ry="6.5" fill={fish.f} stroke="#1E293B" strokeWidth="1.5" />
              {/* Silver lateral stripe */}
              <path d="M 15 15 Q 28 14 41 15" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Tail fin */}
              <path d="M 14 15 L 6 9 L 8 15 L 6 21 Z" fill={fish.f} stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Eye */}
              <circle cx="36" cy="13" r="2.2" fill="white" stroke="#1E293B" strokeWidth="1" />
              <circle cx="36.5" cy="13" r="1" fill="black" />
            </g>
          ))}
        </g>
      );
    case "whale":
      return (
        <g>
          {/* Whale body */}
          <path d="M 10 65 Q 20 26 52 24 Q 85 26 92 46 Q 88 68 55 66 Q 25 68 10 65 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="2.5" />
          {/* Baleen Throat grooves */}
          <path d="M 40 66 C 50 66 70 63 80 53" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          <path d="M 44 61 C 52 61 68 58 76 50" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          <path d="M 48 56 C 54 56 66 53 72 47" stroke="#93C5FD" strokeWidth="1.5" fill="none" />
          {/* Spout spray with droplets */}
          <path d="M 52 24 Q 52 8 60 6 M 52 24 Q 46 10 38 8" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="60" cy="6" r="1.5" fill="#38BDF8" />
          <circle cx="38" cy="8" r="1.5" fill="#38BDF8" />
          <circle cx="48" cy="5" r="1.2" fill="#38BDF8" />
          {/* Tail fin horizontal style */}
          <path d="M 12 62 Q -2 55 4 45 Q 12 55 12 62 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" />
          <path d="M 12 62 Q -2 70 4 80 Q 12 65 12 62 Z" fill="#3B82F6" stroke="#1E293B" strokeWidth="2" />
          {/* Flipper */}
          <path d="M 48 62 Q 52 78 60 74 Q 56 62 48 62" fill="#2563EB" stroke="#1E293B" strokeWidth="2" />
          {/* Eye */}
          <circle cx="78" cy="38" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="79.5" cy="38" r="2.5" fill="#1E293B" />
          {/* Cute Smile */}
          <path d="M 85 48 Q 80 52 75 47" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );
    case "remora":
      return (
        <g>
          {/* Remora body with dark lateral stripe */}
          <ellipse cx="50" cy="54" rx="38" ry="12" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
          {/* Dark lateral stripe */}
          <path d="M 14 54 Q 50 53 86 54" stroke="#334155" strokeWidth="3.5" fill="none" />
          {/* Koban coin suction pad on head */}
          <ellipse cx="64" cy="46" rx="14" ry="5.5" fill="#475569" stroke="#1E293B" strokeWidth="1.5" />
          {/* Grid lines inside Koban pad */}
          <line x1="53" y1="46" x2="75" y2="46" stroke="#E2E8F0" strokeWidth="1.2" />
          <line x1="56" y1="44" x2="72" y2="44" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="56" y1="48" x2="72" y2="48" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="59" y1="42" x2="69" y2="42" stroke="#E2E8F0" strokeWidth="1" />
          <line x1="59" y1="50" x2="69" y2="50" stroke="#E2E8F0" strokeWidth="1" />
          {/* Tail */}
          <path d="M 12 54 L 2 44 L 4 54 L 2 64 Z" fill="#64748B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Eye */}
          <circle cx="78" cy="52" r="4" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="79" cy="52" r="1.8" fill="black" />
        </g>
      );
    case "whale_shark":
      return (
        <g>
          {/* Whale shark body */}
          <path d="M 10 52 Q 32 18 66 20 Q 88 26 92 46 Q 80 70 52 66 Q 28 63 10 52 Z" fill="#1E3A8A" stroke="#1E293B" strokeWidth="2.5" />
          {/* Checkerboard lines */}
          <path d="M 32 30 Q 52 30 72 32 M 35 40 Q 55 40 75 42 M 38 50 Q 55 50 72 51" stroke="#E2E8F0" strokeWidth="1" fill="none" opacity="0.75" />
          <path d="M 36 24 L 36 56 M 46 22 L 46 59 M 56 22 L 56 61 M 66 23 L 66 59 M 76 26 L 76 51" stroke="#E2E8F0" strokeWidth="1" fill="none" opacity="0.75" />
          {/* Rows of white dots */}
          <circle cx="41" cy="27" r="1.5" fill="white" />
          <circle cx="51" cy="26" r="1.5" fill="white" />
          <circle cx="61" cy="27" r="1.5" fill="white" />
          <circle cx="41" cy="35" r="1.5" fill="white" />
          <circle cx="51" cy="35" r="1.5" fill="white" />
          <circle cx="61" cy="36" r="1.5" fill="white" />
          <circle cx="71" cy="37" r="1.5" fill="white" />
          <circle cx="41" cy="45" r="1.5" fill="white" />
          <circle cx="51" cy="45" r="1.5" fill="white" />
          <circle cx="61" cy="46" r="1.5" fill="white" />
          <circle cx="71" cy="46" r="1.5" fill="white" />
          {/* Extremely wide friendly smile at front tip */}
          <path d="M 82 46 Q 88 53 92 46" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Double Dorsal fin */}
          <path d="M 40 21 L 48 6 L 54 20" fill="#1E3A8A" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 24 32 L 28 20 L 32 30" fill="#1E3A8A" stroke="#1E293B" strokeWidth="1.5" />
          {/* Tail fin */}
          <path d="M 12 52 L 2 34 L 5 51 L 2 68 Z" fill="#1E3A8A" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Gills */}
          <line x1="78" y1="34" x2="78" y2="40" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="80" y1="34" x2="80" y2="39" stroke="#E2E8F0" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Eye */}
          <circle cx="84" cy="33" r="4" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="85" cy="33" r="1.8" fill="#1E293B" />
        </g>
      );
    case "plankton":
      return (
        <g>
          {/* Zooplankton: Copepod with segmented body & long antennae & red single eye */}
          <g transform="translate(15, 15)">
            {/* Segmented body */}
            <path d="M 25 15 C 25 5 45 5 45 15 C 45 22 35 32 32 42 L 28 42 C 25 32 25 22 25 15 Z" fill="#34D399" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="27" y1="20" x2="43" y2="20" stroke="#1E293B" strokeWidth="1" />
            <line x1="29" y1="27" x2="41" y2="27" stroke="#1E293B" strokeWidth="1" />
            <line x1="30" y1="34" x2="38" y2="34" stroke="#1E293B" strokeWidth="1" />
            {/* Extremely long antennae */}
            <path d="M 31 10 Q 20 2 8 8" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 39 10 Q 50 2 62 8" stroke="#1E293B" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Single bright red eye in middle of forehead */}
            <circle cx="35" cy="11" r="2.5" fill="#EF4444" />
            <circle cx="35.5" cy="10.5" r="0.8" fill="white" />
            {/* Swimming feather tail */}
            <path d="M 30 42 L 26 49 L 30 46 L 34 49 L 30 42" fill="#10B981" stroke="#1E293B" strokeWidth="1" />
          </g>
          {/* Phytoplankton: Beautiful glowing green-yellow star cell (Diatom) */}
          <g transform="translate(58, 48)">
            <path d="M 15 0 L 18 10 L 28 8 L 20 15 L 28 22 L 18 20 L 15 30 L 12 20 L 2 22 L 10 15 L 2 8 L 12 10 Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="15" cy="15" r="6" fill="#A7F3D0" stroke="#1E293B" strokeWidth="1" />
            <circle cx="15" cy="15" r="2" fill="#10B981" />
          </g>
        </g>
      );
    case "crab":
      return (
        <g>
          {/* Red body */}
          <ellipse cx="50" cy="58" rx="26" ry="18" fill="#EF4444" stroke="#1E293B" strokeWidth="2.5" />
          {/* Jointed legs */}
          <path d="M 28 68 Q 18 78 12 73" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 26 58 Q 12 62 8 55" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 72 68 Q 82 78 88 73" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 74 58 Q 88 62 92 55" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Asymmetric claws (pincers) - one giant pincer */}
          <path d="M 28 46 Q 8 36 18 16 Q 30 28 32 46" fill="#EF4444" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 12 24 Q 22 18 20 16" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 72 46 Q 84 38 76 22 Q 68 32 68 46" fill="#EF4444" stroke="#1E293B" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M 82 28 Q 74 24 76 22" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes on stalks */}
          <line x1="42" y1="42" x2="42" y2="34" stroke="#1E293B" strokeWidth="2" />
          <line x1="58" y1="42" x2="58" y2="34" stroke="#1E293B" strokeWidth="2" />
          <circle cx="42" cy="30" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="42" cy="30" r="2.5" fill="#1E293B" />
          <circle cx="58" cy="30" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="58" cy="30" r="2.5" fill="#1E293B" />
          {/* Smile */}
          <path d="M 44 60 Q 50 64 56 60" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      );
    case "octopus":
      return (
        <g>
          {/* Octo head */}
          <ellipse cx="50" cy="40" rx="24" ry="22" fill="#EC4899" stroke="#1E293B" strokeWidth="2.5" />
          {/* Eyes */}
          <circle cx="40" cy="40" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="40" cy="40" r="2.5" fill="#1E293B" />
          <circle cx="60" cy="40" r="5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="60" cy="40" r="2.5" fill="#1E293B" />
          {/* Blush */}
          <ellipse cx="34" cy="46" rx="3.5" ry="1.5" fill="#DB2777" opacity="0.4" />
          <ellipse cx="66" cy="46" rx="3.5" ry="1.5" fill="#DB2777" opacity="0.4" />
          {/* Siphon tube blowing bubbles */}
          <path d="M 50 48 Q 54 54 48 56 Z" fill="#D01C7A" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="46" cy="62" r="1.5" fill="#BAE6FD" opacity="0.8" />
          <circle cx="44" cy="68" r="2.5" fill="#BAE6FD" opacity="0.6" />
          {/* Wavy tentacles with distinct circular suction cups */}
          <path d="M 32 58 Q 20 68 28 82 Q 34 82 34 72 Q 34 58 32 58" fill="#EC4899" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 44 61 Q 38 78 44 85 Q 50 82 46 72 Q 44 61 44 61" fill="#EC4899" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 56 61 Q 62 78 56 85 Q 50 82 54 72 Q 56 61 56 61" fill="#EC4899" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 68 58 Q 80 68 72 82 Q 66 82 66 72 Q 66 58 68 58" fill="#EC4899" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Suction cups */}
          <circle cx="20" cy="72" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="24" cy="78" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="39" cy="78" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="43" cy="83" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="61" cy="83" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
          <circle cx="80" cy="72" r="2" fill="white" stroke="#1E293B" strokeWidth="0.8" />
        </g>
      );
    case "squid":
      return (
        <g>
          {/* Squid head/body pointing up with Chromatophore spots */}
          <path d="M 50 15 L 70 38 L 62 72 L 38 72 L 30 38 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Chromatophore dots */}
          <circle cx="44" cy="42" r="1.2" fill="#D97706" />
          <circle cx="56" cy="45" r="1" fill="#D97706" />
          <circle cx="48" cy="50" r="1.5" fill="#D97706" />
          <circle cx="60" cy="38" r="1.2" fill="#D97706" />
          <circle cx="38" cy="44" r="1" fill="#D97706" />
          {/* Top fin */}
          <path d="M 50 15 L 68 18 L 50 30 L 32 18 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Big eyes */}
          <circle cx="40" cy="60" r="6" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="40" cy="60" r="3" fill="#1E293B" />
          <circle cx="60" cy="60" r="6" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="60" cy="60" r="3" fill="#1E293B" />
          {/* Wavy tentacles - including two long ones with paddle ends (feeding clubs) */}
          <path d="M 42 72 Q 35 85 40 92" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 58 72 Q 65 85 60 92" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Regular tentacles */}
          <path d="M 46 72 L 46 90" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 50 72 L 50 91" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          <path d="M 54 72 L 54 90" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          {/* 2 very long feeding tentacles */}
          <path d="M 38 72 Q 30 84 34 96" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 62 72 Q 70 84 66 96" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 31 95 Q 34 98 37 95 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 63 95 Q 66 98 69 95 Z" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
        </g>
      );
    case "jellyfish":
      return (
        <g>
          {/* Translucent umbrella dome */}
          <path d="M 22 50 C 22 23 78 23 78 50 L 72 52 C 65 52 62 48 50 48 C 38 48 35 52 28 52 Z" fill="#C084FC" fillOpacity="0.8" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Frilly lacy oral arms in center */}
          <path d="M 44 48 Q 48 65 42 82 Q 48 85 46 95" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M 54 48 Q 50 65 56 82 Q 50 85 52 95" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
          {/* Fine thread-like stinging tentacles */}
          <path d="M 28 52 Q 22 72 28 90" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 36 50 Q 32 70 38 92" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 64 50 Q 68 70 62 92" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M 72 52 Q 78 72 72 90" stroke="#C084FC" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Sparkles of bioluminescence */}
          <path d="M 14 36 L 16 38 L 14 40 L 12 38 Z" fill="#FDE047" />
          <path d="M 82 32 L 84 34 L 82 36 L 80 34 Z" fill="#FDE047" />
          {/* Face */}
          <circle cx="42" cy="38" r="2.2" fill="#1E293B" />
          <circle cx="58" cy="38" r="2.2" fill="#1E293B" />
          <path d="M 47 42 Q 50 45 53 42" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        </g>
      );
    case "sea_turtle":
      return (
        <g>
          {/* Long flippers with scale patterns */}
          <path d="M 30 42 Q 8 26 6 36 Q 18 54 32 50" fill="#10B981" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 70 42 Q 92 26 94 36 Q 82 54 68 50" fill="#10B981" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="12" cy="34" r="1" fill="#047857" />
          <circle cx="15" cy="38" r="1.2" fill="#047857" />
          <circle cx="88" cy="34" r="1" fill="#047857" />
          <circle cx="85" cy="38" r="1.2" fill="#047857" />
          {/* Hexagonal mosaic shell pattern */}
          <ellipse cx="50" cy="52" rx="24" ry="20" fill="#047857" stroke="#1E293B" strokeWidth="2.5" />
          <ellipse cx="50" cy="52" rx="14" ry="10" fill="none" stroke="#34D399" strokeWidth="1.8" />
          <line x1="36" y1="52" x2="26" y2="52" stroke="#34D399" strokeWidth="1.8" />
          <line x1="64" y1="52" x2="74" y2="52" stroke="#34D399" strokeWidth="1.8" />
          <line x1="50" y1="32" x2="50" y2="42" stroke="#34D399" strokeWidth="1.8" />
          <line x1="50" y1="62" x2="50" y2="72" stroke="#34D399" strokeWidth="1.8" />
          {/* Head */}
          <circle cx="50" cy="27" r="9" fill="#10B981" stroke="#1E293B" strokeWidth="2" />
          <circle cx="47" cy="24" r="1.8" fill="#1E293B" />
          <circle cx="53" cy="24" r="1.8" fill="#1E293B" />
          <path d="M 48 30 Q 50 32 52 30" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          {/* Back little flippers & tail */}
          <path d="M 38 68 Q 32 80 38 80" fill="#10B981" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 62 68 Q 68 80 62 80" fill="#10B981" stroke="#1E293B" strokeWidth="1.5" />
          <path d="M 50 72 L 50 77" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
        </g>
      );
    case "dolphin":
      return (
        <g>
          {/* Dolphin curved body jumping */}
          <path d="M 12 60 C 22 45 42 22 68 28 C 84 32 94 48 90 52 C 78 48 62 52 48 58 Q 30 65 12 60 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 44 48 Q 58 45 74 38" stroke="#E0F2FE" strokeWidth="2" fill="none" />
          {/* Blowhole with steam spray */}
          <ellipse cx="64" cy="27" rx="1.5" ry="0.8" fill="#1E293B" />
          <path d="M 64 26 Q 66 16 70 14" stroke="#BAE6FD" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Tail fin */}
          <path d="M 12 60 L 2 52 L 4 60 L 2 68 Z" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Fins */}
          <path d="M 52 28 Q 56 12 62 18" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
          <path d="M 58 52 L 52 66 L 46 54" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
          {/* Snout */}
          <path d="M 88 44 Q 96 46 95 50 Q 88 52 86 50" fill="#38BDF8" stroke="#1E293B" strokeWidth="2" />
          {/* Eye winking */}
          <path d="M 75 39 Q 78 36 80 40" stroke="#1E293B" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      );
    case "orca":
      return (
        <g>
          {/* Orca body */}
          <path d="M 10 55 C 22 30 48 20 74 28 C 88 34 94 46 92 50 C 80 56 62 56 46 62 Q 28 65 10 55 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" />
          {/* White patch bottom */}
          <path d="M 28 61 C 45 61 68 56 78 48 C 84 45 84 46 76 43 Q 62 48 46 51 Z" fill="white" />
          {/* Signature White eye spot */}
          <ellipse cx="76" cy="34" rx="7" ry="3.5" fill="white" transform="rotate(-15, 76, 34)" />
          {/* Grey saddle patch behind dorsal fin */}
          <path d="M 52 30 Q 56 32 50 36 C 47 36 48 32 52 30" fill="#64748B" opacity="0.6" />
          {/* Towering dorsal fin */}
          <path d="M 45 23 L 42 1 L 55 18" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Tail */}
          <path d="M 10 55 L 2 45 L 4 55 L 2 65 Z" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Eye */}
          <circle cx="82" cy="40" r="3.5" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="83" cy="40" r="1.5" fill="black" />
        </g>
      );
    case "starfish":
      return (
        <g>
          {/* Star shape */}
          <path d="M 50 5 L 62 34 L 92 38 L 70 58 L 76 88 L 50 72 L 24 88 L 30 58 L 8 38 L 38 34 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Tiny bumpy dots (spines) for texture */}
          <circle cx="50" cy="18" r="1" fill="white" />
          <circle cx="50" cy="26" r="1" fill="white" />
          <circle cx="42" cy="33" r="1" fill="white" />
          <circle cx="58" cy="33" r="1" fill="white" />
          <circle cx="28" cy="38" r="1" fill="white" />
          <circle cx="72" cy="38" r="1" fill="white" />
          <circle cx="35" cy="56" r="1" fill="white" />
          <circle cx="65" cy="56" r="1" fill="white" />
          <circle cx="32" cy="74" r="1" fill="white" />
          <circle cx="68" cy="74" r="1" fill="white" />
          {/* Smiley eyes */}
          <circle cx="42" cy="46" r="4.5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="42" cy="46" r="2" fill="#1E293B" />
          <circle cx="58" cy="46" r="4.5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="58" cy="46" r="2" fill="#1E293B" />
          <ellipse cx="36" cy="51" rx="2.5" ry="1.2" fill="#BE123C" opacity="0.4" />
          <ellipse cx="64" cy="51" rx="2.5" ry="1.2" fill="#BE123C" opacity="0.4" />
          {/* Smile */}
          <path d="M 46 54 Q 50 58 54 54" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>
      );
    case "seahorse":
      return (
        <g>
          {/* Seahorse head with crown coronet */}
          <path d="M 44 20 Q 42 10 50 8 Q 58 8 60 18 Q 54 22 56 26 L 68 28 L 66 33 L 56 31" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Crown coronet spikes */}
          <polygon points="46,8 44,4 49,7" fill="#FBBF24" stroke="#1E293B" strokeWidth="1" />
          <polygon points="50,8 49,3 53,7" fill="#FBBF24" stroke="#1E293B" strokeWidth="1" />
          {/* Bony segment plates & curly body */}
          <path d="M 50 24 C 44 32 40 44 48 54 C 54 62 52 72 44 76 Q 38 78 38 70 Q 44 64 42 52" fill="#F59E0B" stroke="#1E293B" strokeWidth="2" fillRule="evenodd" />
          {/* Bony segment lines */}
          <line x1="45" y1="34" x2="52" y2="34" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="43" y1="42" x2="50" y2="42" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="44" y1="50" x2="51" y2="50" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="46" y1="58" x2="52" y2="58" stroke="#1E293B" strokeWidth="1.5" />
          {/* Brood pouch on belly */}
          <path d="M 46 54 C 51 54 53 64 47 68" stroke="#D97706" strokeWidth="2" fill="none" />
          {/* Baby tail peeking out of pouch */}
          <path d="M 49 61 Q 53 62 51 65" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
          {/* Transparent dorsal fin */}
          <path d="M 40 42 Q 30 40 34 48 Q 40 46 40 42" fill="#FBBF24" fillOpacity="0.7" stroke="#1E293B" strokeWidth="1.5" />
          {/* Fully coiled spiral tail */}
          <path d="M 44 76 Q 48 83 41 87 Q 35 84 39 79 Q 42 77 40 81" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          {/* Eye */}
          <circle cx="54" cy="14" r="3.5" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="55" cy="14" r="1.5" fill="black" />
        </g>
      );
    case "manta":
      return (
        <g>
          {/* Manta Diamond wing body */}
          <path d="M 50 82 L 92 48 L 50 24 L 8 48 Z" fill="#4F46E5" stroke="#1E293B" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Distinct white shoulder markings */}
          <path d="M 46 25 Q 40 32 30 40 L 36 43 Q 44 34 46 25" fill="white" opacity="0.8" />
          <path d="M 54 25 Q 60 32 70 40 L 64 43 Q 56 34 54 25" fill="white" opacity="0.8" />
          {/* Cephalic horns (lobes) for scooping plankton */}
          <path d="M 40 24 Q 37 12 43 14 Z" fill="#4F46E5" stroke="#1E293B" strokeWidth="1.8" />
          <path d="M 60 24 Q 63 12 57 14 Z" fill="#4F46E5" stroke="#1E293B" strokeWidth="1.8" />
          {/* Wide open smile mouth */}
          <ellipse cx="50" cy="25" rx="5" ry="1.5" fill="#1E293B" />
          {/* Whipping long tail */}
          <line x1="50" y1="82" x2="50" y2="98" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
          {/* Eyes on extreme outer edges */}
          <circle cx="10" cy="47" r="3" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="10" cy="47" r="1.2" fill="black" />
          <circle cx="90" cy="47" r="3" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="90" cy="47" r="1.2" fill="black" />
        </g>
      );
    case "penguin":
      return (
        <g>
          {/* Penguin body - Emperor style chick */}
          <ellipse cx="50" cy="55" rx="20" ry="26" fill="#1E293B" stroke="#1E293B" strokeWidth="2.5" />
          {/* White Chest with soft texture */}
          <ellipse cx="50" cy="59" rx="13" ry="18" fill="white" />
          {/* Yellow neck patches */}
          <path d="M 33 42 Q 36 48 42 42 Z" fill="#F59E0B" />
          <path d="M 67 42 Q 64 48 58 42 Z" fill="#F59E0B" />
          {/* Flipper wings held wide */}
          <path d="M 30 50 Q 14 58 20 68 Q 30 64 31 56" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          <path d="M 70 50 Q 86 58 80 68 Q 70 64 69 56" fill="#1E293B" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Beak */}
          <polygon points="46,38 54,38 50,44" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
          {/* Eyes */}
          <circle cx="43" cy="32" r="3.2" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="43" cy="32" r="1.5" fill="black" />
          <circle cx="57" cy="32" r="3.2" fill="white" stroke="#1E293B" strokeWidth="1.5" />
          <circle cx="57" cy="32" r="1.5" fill="black" />
          {/* Feet */}
          <ellipse cx="42" cy="80" rx="5.5" ry="3" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
          <ellipse cx="58" cy="80" rx="5.5" ry="3" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
        </g>
      );
    case "sea_otter":
      return (
        <g>
          {/* Floating on back horizontally */}
          <g transform="translate(5, 5) rotate(15, 45, 45)">
            {/* Otter long body */}
            <ellipse cx="45" cy="55" rx="30" ry="16" fill="#78350F" stroke="#1E293B" strokeWidth="2.5" />
            {/* Fluffy cream face looking up */}
            <circle cx="70" cy="45" r="13" fill="#F5E0C9" stroke="#1E293B" strokeWidth="2" />
            {/* Little rounded ears */}
            <circle cx="62" cy="35" r="3.5" fill="#78350F" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="78" cy="35" r="3.5" fill="#78350F" stroke="#1E293B" strokeWidth="1.5" />
            {/* Cute wiggling feet sticking up */}
            <path d="M 20 62 Q 14 68 18 72 Z" fill="#541D02" stroke="#1E293B" strokeWidth="1.5" />
            <path d="M 28 62 Q 22 68 26 72 Z" fill="#541D02" stroke="#1E293B" strokeWidth="1.5" />
            {/* Long flat tail floating */}
            <path d="M 16 58 Q 0 60 4 64 Q 16 62 16 58" fill="#78350F" stroke="#1E293B" strokeWidth="1.5" />
            {/* Clam & stone on chest */}
            <circle cx="45" cy="48" r="4.5" fill="#94A3B8" stroke="#1E293B" strokeWidth="1.2" /> {/* Stone */}
            <path d="M 40 43 L 50 43 L 47 48 L 43 48 Z" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" strokeLinejoin="round" /> {/* Shell */}
            {/* Hands holding it */}
            <ellipse cx="38" cy="47" rx="3" ry="4" fill="#78350F" stroke="#1E293B" strokeWidth="1.5" />
            <ellipse cx="52" cy="47" rx="3" ry="4" fill="#78350F" stroke="#1E293B" strokeWidth="1.5" />
            {/* Eyes & Nose */}
            <circle cx="67" cy="43" r="1.5" fill="#1E293B" />
            <circle cx="73" cy="43" r="1.5" fill="#1E293B" />
            <polygon points="69,46 71,46 70,48" fill="#1E293B" />
            <path d="M 68 50 Q 70 51 72 50" stroke="#1E293B" strokeWidth="1" fill="none" />
            {/* Whiskers */}
            <line x1="58" y1="46" x2="52" y2="45" stroke="#1E293B" strokeWidth="0.8" />
            <line x1="82" y1="46" x2="88" y2="45" stroke="#1E293B" strokeWidth="0.8" />
          </g>
        </g>
      );
    case "pufferfish":
      return (
        <g>
          {/* Perfectly round yellow puffer body */}
          <circle cx="50" cy="50" r="26" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.5" />
          {/* Big surprised eyes */}
          <circle cx="66" cy="44" r="6.5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="67" cy="44" r="3" fill="#1E293B" />
          <circle cx="34" cy="44" r="6.5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="33" cy="44" r="3" fill="#1E293B" />
          {/* Hilarious puckered beak mouth */}
          <circle cx="50" cy="58" r="3" fill="none" stroke="#1E293B" strokeWidth="2.5" />
          <circle cx="48" cy="64" r="1" fill="#BAE6FD" />
          <circle cx="46" cy="70" r="1.5" fill="#BAE6FD" />
          {/* Spikes sticking out in all directions */}
          <path d="M 28 34 L 20 28" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 24 50 L 14 50" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 28 66 L 20 72" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 50 76 L 50 86" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 72 66 L 80 72" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 76 50 L 86 50" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 72 34 L 80 28" stroke="#1E293B" strokeWidth="2" fill="none" />
          <path d="M 50 24 L 50 14" stroke="#1E293B" strokeWidth="2" fill="none" />
          {/* Vibrating transparent side fins */}
          <path d="M 25 44 C 20 44 22 40 25 44" stroke="#1E293B" strokeWidth="1.5" fill="none" />
          {/* Tail */}
          <path d="M 24 50 L 10 44 L 14 50 L 10 56 Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
        </g>
      );
    case "eel":
      return (
        <g>
          {/* Rock Cave */}
          <path d="M 15 80 Q 15 25 50 25 Q 85 25 85 80 Z" fill="#64748B" stroke="#1E293B" strokeWidth="2" />
          <path d="M 25 80 Q 25 35 50 35 Q 75 35 75 80 Z" fill="#1E293B" />
          {/* Moray Eel with leopard spots peeking from cave */}
          <g transform="translate(15, 10)">
            {/* Spotted neck */}
            <path d="M 30 70 Q 25 55 35 45 Q 45 35 38 25" stroke="#FBBF24" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M 30 70 Q 25 55 35 45 Q 45 35 38 25" stroke="#1E293B" strokeWidth="14" strokeLinecap="round" fill="none" style={{ mixBlendMode: 'difference' }} opacity="0" />
            {/* Leopard spots on eel body */}
            <circle cx="28" cy="60" r="2" fill="#78350F" />
            <circle cx="34" cy="52" r="2.2" fill="#78350F" />
            <circle cx="30" cy="44" r="1.8" fill="#78350F" />
            <circle cx="38" cy="38" r="2" fill="#78350F" />
            {/* Head pointing forward with wide open mouth */}
            <path d="M 38 25 L 54 22 Q 58 28 52 32 L 38 31 Z" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
            {/* Sharp small teeth inside open mouth */}
            <line x1="44" y1="24" x2="44" y2="26" stroke="#1E293B" strokeWidth="1.2" />
            <line x1="48" y1="23" x2="48" y2="25" stroke="#1E293B" strokeWidth="1.2" />
            <line x1="52" y1="23" x2="51" y2="25" stroke="#1E293B" strokeWidth="1.2" />
            {/* Sharp eyes */}
            <circle cx="44" cy="18" r="3.2" fill="white" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="45" cy="18" r="1.5" fill="black" />
          </g>
        </g>
      );
    case "shrimp":
      return (
        <g>
          {/* Curved segmented body */}
          <path d="M 25 55 Q 38 42 55 48 Q 72 54 84 45" stroke="#1E293B" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          {/* Overlapping scales & stripes */}
          <path d="M 38 49 C 39 42 45 42 46 49" stroke="#EF4444" strokeWidth="2.5" fill="none" />
          <path d="M 50 49 C 51 42 57 42 58 49" stroke="#EF4444" strokeWidth="2.5" fill="none" />
          <path d="M 62 52 C 63 45 69 45 70 52" stroke="#EF4444" strokeWidth="2.5" fill="none" />
          {/* Fan tail */}
          <polygon points="25,55 12,49 16,56 12,63" fill="#F472B6" stroke="#1E293B" strokeWidth="1.5" />
          {/* Extremely long delicate double antennae sweeping backward */}
          <path d="M 80 44 Q 85 24 98 18" stroke="#E2E8F0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 80 44 Q 92 48 99 44" stroke="#E2E8F0" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Walking legs under body */}
          <line x1="42" y1="51" x2="38" y2="59" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="50" y1="51" x2="46" y2="59" stroke="#1E293B" strokeWidth="1.5" />
          <line x1="58" y1="53" x2="54" y2="61" stroke="#1E293B" strokeWidth="1.5" />
          {/* Eye */}
          <circle cx="78" cy="45" r="2.2" fill="black" />
        </g>
      );
    case "sunfish":
      return (
        <g>
          {/* Sunfish tall flat plate body */}
          <ellipse cx="50" cy="50" rx="24" ry="28" fill="#93C5FD" stroke="#1E293B" strokeWidth="2.5" />
          {/* Tall wavy dorsal fin */}
          <path d="M 44 23 L 42 2 L 56 22" fill="#60A5FA" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Tall wavy anal fin */}
          <path d="M 44 77 L 42 98 L 56 78" fill="#60A5FA" stroke="#1E293B" strokeWidth="2" strokeLinejoin="round" />
          {/* Scalloped rudder-like Clavus instead of tail */}
          <path d="M 26 50 C 22 36 28 50 C 22 64 26 50" fill="#93C5FD" stroke="#1E293B" strokeWidth="2" />
          <circle cx="25" cy="38" r="2" fill="#60A5FA" />
          <circle cx="24" cy="46" r="2" fill="#60A5FA" />
          <circle cx="24" cy="54" r="2" fill="#60A5FA" />
          <circle cx="25" cy="62" r="2" fill="#60A5FA" />
          {/* Surprised eyes & tiny circular mouth */}
          <circle cx="64" cy="45" r="5.5" fill="white" stroke="#1E293B" strokeWidth="2" />
          <circle cx="65.5" cy="45" r="2.5" fill="#1E293B" />
          <circle cx="74" cy="56" r="2.5" fill="none" stroke="#1E293B" strokeWidth="2.5" />
        </g>
      );
    case "hermit_crab":
      return (
        <g>
          {/* Spiral seashell with ridges */}
          <path d="M 28 52 C 28 32 60 32 60 52 C 60 62 48 70 36 70 C 26 70 28 62 28 52 Z" fill="#F5E0C9" stroke="#1E293B" strokeWidth="2.2" />
          <path d="M 44 38 Q 36 48 44 58" stroke="#D1B89D" strokeWidth="1.8" fill="none" />
          <path d="M 52 42 Q 46 52 52 62" stroke="#D1B89D" strokeWidth="1.5" fill="none" />
          {/* Orange crab peeping out with asymmetric claws */}
          <g transform="translate(14, 12)">
            {/* Claws: One giant protective claw, one small claw */}
            <path d="M 38 42 Q 22 30 36 22 Q 44 30 38 42" fill="#D97706" stroke="#1E293B" strokeWidth="1.8" />
            <path d="M 44 44 Q 52 38 48 30 Q 42 36 44 44" fill="#F59E0B" stroke="#1E293B" strokeWidth="1.5" />
            {/* Stalk eyes looking around */}
            <line x1="40" y1="24" x2="38" y2="18" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="46" y1="26" x2="48" y2="20" stroke="#1E293B" strokeWidth="1.5" />
            <circle cx="38" cy="18" r="2.5" fill="white" stroke="#1E293B" strokeWidth="1" />
            <circle cx="38" cy="18" r="1.2" fill="black" />
            <circle cx="48" cy="20" r="2.5" fill="white" stroke="#1E293B" strokeWidth="1" />
            <circle cx="48" cy="20" r="1.2" fill="black" />
          </g>
        </g>
      );
    default:
      return (
        <circle cx="50" cy="50" r="30" fill={color} stroke="#1E293B" strokeWidth="2" />
      );
  }
}
