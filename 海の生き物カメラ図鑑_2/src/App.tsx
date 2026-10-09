import React, { useState, useEffect, useRef } from "react";
import { Species, EcologyRelationship } from "./types";
import { speciesList, getPredefinedRelationship } from "./speciesData";
import CardPrinter, { renderCuteSVG } from "./components/CardPrinter";
import MagnifyingGlass from "./components/MagnifyingGlass";
import SeaCanvas from "./components/SeaCanvas";
import { oceanBgm } from "./utils/oceanBgm";
import { naturalVoice } from "./utils/naturalVoice";
import { 
  Sparkles, 
  Printer, 
  HelpCircle, 
  Play, 
  Volume2, 
  VolumeX, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Heart, 
  FileText, 
  User, 
  Plus, 
  BookOpen, 
  Tv, 
  Loader2,
  Music
} from "lucide-react";

// Museum-style worksheet trivia list to display during waiting loading time
const loadingWorksheets = [
  {
    question: "くまのみは、どうして イソギンチャクの どくのある てに さされても へっちゃらなのかな？",
    hint: "からだの まわりの『ぬるぬる（ねんえき）』に ひみつが あるよ！"
  },
  {
    question: "うみがめは、どくのある くらげを たべても おなかが いたくならないって ほんとかな？",
    hint: "ほんとだよ！うみがめの おくちの なかは とっても かたくて つよく できているんだ！"
  },
  {
    question: "こばんざめは さめじゃないって ほんと？",
    hint: "ほんとだよ！あたまに『こばん』の かたちをした すいばんを もつ、スズキの なかまなんだ！"
  },
  {
    question: "せかいで いちばん おおきな どうぶつ「くじら」は、なにを たべて いるのかな？",
    hint: "とっても ちいさな『ぷらんくとん』を おおきな おくちで すいこんで たべるよ！"
  },
  {
    question: "らっこは、おなかのうえで かに や かい を どうやって わるのかな？",
    hint: "うみから ひろってきた『おきにいりの いし』を つかって、コンコンと たたくんだよ！"
  }
];

// Worksheet questions specifically related to each creature
const creatureWorksheets: Record<string, { question: string; hint: string }> = {
  clownfish: {
    question: "くまのみは、どうして イソギンチャクの どくのある てに さされても へっちゃらなのかな？",
    hint: "からだの まわりの『ぬるぬる（ねんえき）』に ひみつが あるよ！"
  },
  plankton: {
    question: "ぷらんくとんの なまえの いみは「ただようもの」って ほんと？",
    hint: "ほんとだよ！じぶんの ちからで およぐのが にがてで、おみずの ながれに のって ただようんだ！"
  },
  crab: {
    question: "かには、どうして よこにしか あるけないのかな？",
    hint: "あしの かんせつ（まげるところ）が、よこにしか まがらない ようになっているからだよ！"
  },
  octopus: {
    question: "たこには、しんぞうが なんこ あるとおもう？",
    hint: "なんと ３つも あるんだよ！からだの すみずみまで ちを おくるために、たくさん あるんだ！"
  },
  squid: {
    question: "いかが ピンチの ときにはく『すみ』は、たこの すみと なにが ちがうのかな？",
    hint: "いかの すみは ねばねばしていて、じぶんの『かげ（おとり）』をつくって てきを だますんだよ！"
  },
  jellyfish: {
    question: "くらげの からだは、ほとんど なにで できているのかな？",
    hint: "なんと、９５％以上が『おみず（水分）』で できているんだ！ぷかぷか うくのも なっとくね！"
  },
  sea_turtle: {
    question: "うみがめは、どくのある くらげを たべても おなかが いたくならないって ほんとかな？",
    hint: "ほんとだよ！うみがめの おくちや しょくどうの なかは とっても つよく できているんだ！"
  },
  dolphin: {
    question: "いるかは、およぎながら ねむることができるって ほんとかな？",
    hint: "ほんとだよ！みぎののうと ひだりののうを、かわりばんこに おやすみさせて ねむるんだ！"
  },
  orca: {
    question: "海のさいきょうの ハンター「しゃち」の なまえの 漢字「鯱」には、なんの どうぶつの 字が はいっているかな？",
    hint: "魚（さかな）の となりに「虎（とら）」の 字が かかれているよ！うみの とらみたいに つよいんだね！"
  },
  starfish: {
    question: "ひとでの て（うで）が ちぎれちゃったら、どうなるのかな？",
    hint: "なんと、ちぎれたところから あたらしい てが はえてきて もとどおりに なるんだよ！"
  },
  seahorse: {
    question: "たつのおとしごは、オス（おとうさん）が あかちゃんを うむって ほんと？",
    hint: "ほんとだよ！おとうさんの おなかのふくろ（育児のう）に おかあさんが たまごを うみ、おとうさんが おなかで そだてて うむんだ！"
  },
  manta: {
    question: "まんたの おくちの よこにある、つの みたいな ひれ（頭鰭）は なにに つかうのかな？",
    hint: "およぎながら、えさの ぷらんくとんを おくちの なかに おくりこむ ための スコップなんだよ！"
  },
  penguin: {
    question: "ぺんぎんは 鳥（とり）の なかまだけど、どうしてお空を とべないのかな？",
    hint: "お空をとぶ かわりに、うみの なかを まるで 空をとぶように すいすい はやく およぐんだよ！"
  },
  sea_otter: {
    question: "らっこは、おなかのうえで かに や かい を どうやって わるのかな？",
    hint: "うみから ひろってきた『おきにいりの いし』を つかって、コンコンと たたくんだよ！"
  },
  pufferfish: {
    question: "ふぐは、おどろいたときに どうして まあるく ふくらむのかな？",
    hint: "おみずや くうきを おなかいっぱいに すいこんで、じぶんの からだを おおきく みせて てきをおどろかせるんだ！"
  },
  eel: {
    question: "うつぼの おくちの なかには、もうひとつ おくちが あるって ほんと？",
    hint: "ほんとだよ！『おくの あご（咽頭顎）』があって、つかまえた えさを のどの おくまで ひきずりこむんだ！"
  },
  shrimp: {
    question: "えびは、あぶない てきに おそわれそうになると、どっちに にげるかな？",
    hint: "からだを ぴょーんと まげて、うしろ（うしろむき）に とびはねて にげるんだよ！"
  },
  sunfish: {
    question: "まんぼうは、おひるねを するのが だいすき。どこでおひるね（ひなたぼっこ）するのかな？",
    hint: "うみの ぷかぷか うく『ひょうめん（海面）』に、からだを よこにして うかびながら おひるねするんだよ！"
  },
  hermit_crab: {
    question: "やどかりの からだは、どうして まるっこい かい（貝殻）に ぴったり はいるのかな？",
    hint: "やどかりの おしりは、貝の すきまに あわせて ぐるぐる ねじれた かたちをしているからだよ！"
  }
};

export default function App() {
  const [view, setView] = useState<"main" | "print" | "observe">(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("print") === "true") {
        return "print";
      }
    }
    return "main";
  });
  const [selectedCreatures, setSelectedCreatures] = useState<Species[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentWorksheet, setCurrentWorksheet] = useState<{ question: string; hint: string } | null>(null);
  const [ecologyResult, setEcologyResult] = useState<EcologyRelationship | null>(null);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBgmEnabled, setIsBgmEnabled] = useState(true);

  // Keep track of active SpeechSynthesis timeouts for cancelability
  const voiceTimeoutsRef = useRef<number[]>([]);

  // Duck BGM volume during speech narration so voice is crystal clear
  useEffect(() => {
    oceanBgm.setDucked(isSpeaking);
  }, [isSpeaking]);

  // Unlock and start BGM on first user interaction or launch
  useEffect(() => {
    const handleFirstGesture = () => {
      if (isBgmEnabled) {
        oceanBgm.start();
      }
    };
    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
    };
  }, [isBgmEnabled]);

  // Play natural voice introduction on launch
  useEffect(() => {
    playVoiceGuide("うみの いきもの カメラずかんに ようこそ！ いきものの カードを スキャンして、すいそうに いれてみよう！");
    return () => {
      stopVoiceGuide();
    };
  }, []);

  const playVoiceGuide = (text: string) => {
    if (!isVoiceEnabled) return;
    
    // Stop any ongoing speech and scheduled timers
    stopVoiceGuide();

    naturalVoice.speak(text, {
      rate: 0.78,
      pitch: 1.12,
      onStart: () => setIsSpeaking(true),
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const playEcologyNarration = (title: string, explanation: string, question: string) => {
    if (!isVoiceEnabled) return;

    // Stop current voice & timers
    stopVoiceGuide();

    // Clean text: remove ruby tags
    const cleanTitle = title.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");
    const cleanExplanation = explanation.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");
    const cleanQuestion = `おうちの人と考えよう！ ${question}`.replace(/<rt>.*?<\/rt>/g, "").replace(/<[^>]+>/g, "");

    const segments = [cleanTitle, cleanExplanation, cleanQuestion];
    let currentIndex = 0;

    const playNextSegment = () => {
      if (currentIndex >= segments.length) {
        setIsSpeaking(false);
        return;
      }

      const text = segments[currentIndex];
      naturalVoice.speak(text, {
        rate: 0.78,
        pitch: 1.12,
        onStart: () => setIsSpeaking(true),
        onError: () => setIsSpeaking(false),
        onEnd: () => {
          currentIndex++;
          if (currentIndex < segments.length) {
            // Pause for 2.0 seconds before the next segment so young children can absorb the information
            const timeoutId = window.setTimeout(() => {
              playNextSegment();
            }, 2000);
            voiceTimeoutsRef.current.push(timeoutId);
          } else {
            setIsSpeaking(false);
          }
        },
      });
    };

    playNextSegment();
  };

  const stopVoiceGuide = () => {
    naturalVoice.cancel();
    // Clear all pending delay timeouts
    voiceTimeoutsRef.current.forEach((t) => clearTimeout(t));
    voiceTimeoutsRef.current = [];
    setIsSpeaking(false);
  };

  // Toggle Voice
  const toggleVoice = () => {
    if (isVoiceEnabled) {
      stopVoiceGuide();
      setIsVoiceEnabled(false);
    } else {
      setIsVoiceEnabled(true);
      playVoiceGuide("おんせいを オンにしたよ！");
    }
  };

  // Toggle BGM
  const toggleBgm = () => {
    if (isBgmEnabled) {
      oceanBgm.setMuted(true);
      setIsBgmEnabled(false);
    } else {
      oceanBgm.start();
      oceanBgm.setMuted(false);
      setIsBgmEnabled(true);
    }
  };

  // Add Creature to Water Tank
  const handleAddCreature = (species: Species) => {
    // Check if already exists in tank
    if (selectedCreatures.some((c) => c.id === species.id)) {
      playVoiceGuide(`${species.name}は、もう すいそうに いるよ！`);
      return;
    }

    // Maximum 5 creatures in tank to keep physics rendering stable
    if (selectedCreatures.length >= 5) {
      playVoiceGuide("すいそうが いっぱいに なっちゃった！ いちど からっぽに するか、このまま しらべてみよう！");
      return;
    }

    const updated = [...selectedCreatures, species];
    setSelectedCreatures(updated);
    playVoiceGuide(`${species.name}を すいそうに いれたよ！`);
  };

  // Clear Water Tank
  const handleClearTank = () => {
    setSelectedCreatures([]);
    setEcologyResult(null);
    playVoiceGuide("すいそうを からっぽに したよ！");
  };

  // Remove specific creature from tank
  const handleRemoveCreature = (id: string) => {
    const updated = selectedCreatures.filter((c) => c.id !== id);
    setSelectedCreatures(updated);
    playVoiceGuide("いきものを だしたよ！");
  };

  // Trigger ecology interaction analysis
  const handleObserve = async () => {
    if (selectedCreatures.length < 2) {
      playVoiceGuide("すくなくとも ２ひき 以上の いきものを すいそうに いれてから しらべてね！");
      return;
    }

    // Try to find a worksheet associated with one of the selected creatures
    const matchedWorksheets = selectedCreatures
      .map((c) => creatureWorksheets[c.id])
      .filter(Boolean);
    
    const worksheet = matchedWorksheets.length > 0
      ? matchedWorksheets[Math.floor(Math.random() * matchedWorksheets.length)]
      : loadingWorksheets[Math.floor(Math.random() * loadingWorksheets.length)];

    setCurrentWorksheet(worksheet);
    setIsLoading(true);
    setView("observe");

    // Play worksheet voice-over during loading
    playVoiceGuide(`しらべているあいだに、クイズだよ！ ${worksheet.question}`);

    const creatureIds = selectedCreatures.map((c) => c.id);

    try {
      const response = await fetch("/api/interaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatures: selectedCreatures })
      });

      if (response.ok) {
        const data = await response.json();
        setEcologyResult(data);
        // Play final explanation narration
        setTimeout(() => {
          setIsLoading(false);
          playEcologyNarration(data.title, data.explanation, data.question);
        }, 500); //snappy transition delay
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      console.warn("Gemini API failed, using fallback database:", err);
      // Fallback local relation engine
      const fallbackData = getPredefinedRelationship(creatureIds);
      setEcologyResult(fallbackData);
      
      setTimeout(() => {
        setIsLoading(false);
        if (fallbackData) {
          playEcologyNarration(fallbackData.title, fallbackData.explanation, fallbackData.question);
        }
      }, 500);
    }
  };

  // Close observe results, back to main
  const handleBackToMain = () => {
    stopVoiceGuide();
    setView("main");
    setEcologyResult(null);
    playVoiceGuide("すいそうに もどったよ！ つぎの いきものを スキャンしてみよう！");
  };

  // Open printing card screen
  const handleGoToPrint = () => {
    stopVoiceGuide();
    setView("print");
  };

  // Helper to safely render html string with ruby tags
  const renderMarkup = (htmlString: string) => {
    return <span dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  if (view === "print") {
    return (
      <CardPrinter
        onBack={() => {
          if (typeof window !== "undefined") {
            window.history.replaceState({}, "", window.location.pathname);
          }
          setView("main");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-800 font-sans pb-12 flex flex-col justify-between">
      
      {/* 1. APP HEADER */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#BAE6FD] sticky top-0 z-40 px-4 py-3 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#38BDF8] flex items-center justify-center shadow-inner relative overflow-hidden flex-shrink-0">
              <Sparkles className="text-white animate-pulse" size={20} />
            </div>
            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-black text-[#0284C7] tracking-tight flex items-center gap-1.5 flex-wrap">
                <span className="inline-block whitespace-nowrap">海の生き物カメラ図鑑</span>
                <span className="text-[10px] bg-[#E0F2FE] text-[#0284C7] px-2 py-0.5 rounded-full font-bold whitespace-nowrap">ようじ向け</span>
              </h1>
              <p className="text-[9px] md:text-[10px] text-slate-400 font-medium tracking-wide leading-relaxed">
                <span className="inline-block">「食べる・食べられる・助け合う」を</span>
                <span className="inline-block">カメラでまなぼう！</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            {/* BGM Toggle */}
            <button
              id="btn-toggle-bgm"
              onClick={toggleBgm}
              className={`p-2.5 rounded-full shadow-sm transition-all border cursor-pointer flex items-center justify-center ${
                isBgmEnabled
                  ? "bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7] hover:bg-[#BAE6FD]"
                  : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
              }`}
              title={isBgmEnabled ? "BGM(うみの おんがく)を オフにする" : "BGM(うみの おんがく)を オンにする"}
            >
              <Music size={18} className={isBgmEnabled ? "animate-pulse" : ""} />
            </button>

            {/* Voice Toggle */}
            <button
              id="btn-toggle-voice"
              onClick={toggleVoice}
              className={`p-2.5 rounded-full shadow-sm transition-all border cursor-pointer ${
                isVoiceEnabled
                  ? "bg-[#E0F2FE] border-[#BAE6FD] text-[#0284C7] hover:bg-[#BAE6FD]"
                  : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
              }`}
              title={isVoiceEnabled ? "おんせいを オフにする" : "おんせいを オンにする"}
            >
              {isVoiceEnabled ? <Volume2 size={18} className={isSpeaking ? "animate-bounce" : ""} /> : <VolumeX size={18} />}
            </button>

            {/* Print Screen Navigate */}
            <a
              id="btn-go-to-print"
              href="?print=true"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => stopVoiceGuide()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm transition-colors cursor-pointer no-underline hover:no-underline whitespace-nowrap"
            >
              <Printer size={15} />
              <span>カードをいんさつする</span>
            </a>
          </div>
        </div>
      </header>

      {/* 2. DYNAMIC WORKSPACE BODY */}
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
        
        {view === "main" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left side: Digital Magnifying Glass QR Scanner */}
            <div className="md:col-span-5 bg-white p-6 rounded-3xl shadow-md border border-[#BAE6FD] flex flex-col items-center gap-4">
              <div className="text-center">
                <span className="inline-flex items-center gap-1 bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold px-3 py-1 rounded-full mb-1">
                  <Sparkles size={12} className="animate-spin" />
                  <span className="whitespace-nowrap">カメラでスキャン</span>
                </span>
                <h2 className="text-lg font-extrabold text-slate-800 whitespace-nowrap">デジタルむしめがね</h2>
              </div>

              <MagnifyingGlass 
                onAddCreature={handleAddCreature} 
                selectedCreatures={selectedCreatures} 
              />
            </div>

            {/* Right side: Water Tank Pool representation */}
            <div className="md:col-span-7 flex flex-col gap-4 h-full">
              
              {/* Pool Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                  <h2 className="font-extrabold text-base text-slate-700 whitespace-nowrap">およぐ すいそう ({selectedCreatures.length}/5)</h2>
                </div>
                
                {selectedCreatures.length > 0 && (
                  <button
                    id="btn-clear-tank"
                    onClick={handleClearTank}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-bold bg-red-50 hover:bg-red-100/80 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>からっぽにする</span>
                  </button>
                )}
              </div>

              {/* Real 2D Canvas Pool Window */}
              <div className="w-full h-[280px] md:h-[320px] rounded-3xl overflow-hidden shadow-lg border-4 border-white relative bg-[#E0F2FE]">
                {selectedCreatures.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE]">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm animate-bounce mb-3">
                      🐠
                    </div>
                    <p className="font-extrabold text-[#0284C7] text-base leading-snug">すいそうに だれもいないよ！</p>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                      カードをカメラにかざすか、<br />
                      うえの「えらんで いれる」ボタンからえらんでね！
                    </p>
                  </div>
                ) : (
                  <SeaCanvas creatures={selectedCreatures} isResultMode={false} />
                )}
              </div>

              {/* Scanned/Selected Cards strip inside Water Tank */}
              <div className="bg-white/60 p-3 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  およいでいる いきものたち（タップで だせるよ）
                </p>
                {selectedCreatures.length === 0 ? (
                  <div className="text-xs text-slate-400 italic py-2">いきものが いません</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedCreatures.map((sp) => (
                      <div
                        key={sp.id}
                        onClick={() => handleRemoveCreature(sp.id)}
                        className="flex items-center gap-1.5 bg-white hover:bg-red-50 border border-slate-100 hover:border-red-200 p-1.5 pr-3 rounded-xl shadow-sm transition-all group cursor-pointer"
                      >
                        <svg viewBox="0 0 100 100" className="w-7 h-7">
                          {renderCuteSVG(sp.id, sp.color)}
                        </svg>
                        <span className="text-xs font-bold text-slate-700 group-hover:text-red-500 transition-colors">
                          {sp.name}
                        </span>
                        <span className="text-[9px] text-red-400 font-bold group-hover:inline hidden">ばいばい</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BIG BLUE OBSERVATION BUTTON */}
              <button
                id="btn-observe"
                onClick={handleObserve}
                disabled={selectedCreatures.length < 2}
                className={`w-full py-4 rounded-3xl font-extrabold text-base md:text-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectedCreatures.length >= 2
                    ? "bg-gradient-to-r from-[#0284C7] to-[#38BDF8] hover:from-[#0369A1] hover:to-[#0EA5E9] text-white transform active:scale-[0.98]"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                }`}
              >
                <Sparkles size={22} className={selectedCreatures.length >= 2 ? "animate-pulse" : ""} />
                <span>「かんけい」をしらべる！</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* 3. OBSERVE RESULTS / WAITING WORKSHEET COMPONENT */}
        {view === "observe" && (
          <div className="w-full flex flex-col gap-6 animate-scale-up">
            
            {isLoading ? (
              /* WAITING SCREEN: Museum Worksheet styled interactive trivia */
              <div className="w-full max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-lg border-4 border-dashed border-[#38BDF8] text-center flex flex-col items-center gap-6">
                
                <div className="flex items-center gap-2 bg-[#E0F2FE] px-4 py-2 rounded-full text-xs font-black text-[#0284C7]">
                  <Loader2 className="animate-spin" size={16} />
                  <span>しらべちゅう...</span>
                </div>

                <div className="w-full py-3">
                  <h3 className="text-xl md:text-2xl font-black text-[#0284C7] mb-2">
                    🎒 はくぶつかんの ワークシート
                  </h3>
                  <p className="text-slate-400 text-xs">しらべているあいだに、おうちの人と いっしょにかんがえてみよう！</p>
                </div>

                {/* Big Worksheet Question Box with furigana/ruby support */}
                {currentWorksheet && (
                  <div className="bg-[#F0F9FF] p-6 rounded-2xl border border-[#BAE6FD] w-full text-left relative overflow-hidden">
                    <span className="absolute top-0 right-0 bg-[#38BDF8] text-white text-[10px] font-black px-3 py-1 rounded-bl-xl">
                      もんだい
                    </span>
                    <p className="text-lg md:text-xl font-black text-slate-800 leading-relaxed mb-4">
                      {currentWorksheet.question}
                    </p>
                    <div className="border-t border-dashed border-[#BAE6FD] pt-4 mt-2">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">💡 ヒント</p>
                      <p className="text-sm font-bold text-[#0284C7]">{currentWorksheet.hint}</p>
                    </div>
                  </div>
                )}

                <div className="w-full flex flex-col gap-1 items-center">
                  <div className="w-48 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#0284C7] to-[#38BDF8] animate-pulse w-4/5 rounded-full" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 font-bold">もうすぐ けっかが でるよ！</span>
                </div>
              </div>
            ) : (
              /* RESULTS SCREEN: Complete interactive findings display */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Left side: Beautiful Animation Stage */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-slate-700 flex items-center gap-1.5">
                      <Tv size={18} className="text-[#0284C7]" />
                      <span>うごく アニメーションプール</span>
                    </h3>
                    <span className="text-xs font-bold bg-[#E0F2FE] text-[#0284C7] px-3 py-1 rounded-full">
                      {selectedCreatures.length}匹がおよいでるよ！
                    </span>
                  </div>

                  {/* Physics Canvas for result ecology animation */}
                  <div className="w-full h-[320px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg border-4 border-white relative bg-[#E0F2FE]">
                    <SeaCanvas 
                      creatures={selectedCreatures} 
                      animationType={ecologyResult?.animationType || "neutral_swim"} 
                      isResultMode={true} 
                    />
                  </div>
                </div>

                {/* Right side: Detailed Child-Friendly Narration Card */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  {ecologyResult && (
                    <div className="bg-white p-6 rounded-3xl shadow-md border border-[#BAE6FD] flex flex-col justify-between h-full gap-5">
                      
                      {/* Top Header Card */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Simplified human badge */}
                          <span className="px-3 py-1 bg-[#FEE2E2] text-[#EF4444] rounded-full text-xs font-black flex items-center gap-1">
                            <Heart size={12} fill="#EF4444" />
                            <span>{ecologyResult.labelHiragana}</span>
                          </span>
                          {/* Scientific badge with ruby */}
                          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                            {renderMarkup(ecologyResult.labelKanji)}
                          </span>
                        </div>

                        <h2 className="text-xl md:text-2xl font-black text-[#0284C7] leading-snug tracking-tight">
                          {renderMarkup(ecologyResult.title)}
                        </h2>
                      </div>

                      {/* 5-Year Old Explanation Body (Large typography with Ruby) */}
                      <div className="bg-[#F0F9FF] p-4 rounded-2xl border border-[#BAE6FD] relative">
                        <p className="text-slate-800 text-base md:text-lg font-bold leading-relaxed">
                          {renderMarkup(ecologyResult.explanation)}
                        </p>
                        
                        {/* Audio guide trigger button */}
                        {isVoiceEnabled && (
                          <button
                            id="btn-play-result-voice"
                            onClick={() => {
                              playEcologyNarration(ecologyResult.title, ecologyResult.explanation, ecologyResult.question);
                            }}
                            className="absolute -bottom-3 right-4 flex items-center gap-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white px-3 py-1.5 rounded-full text-xs font-black shadow-md transition-all active:scale-95 cursor-pointer"
                          >
                            <Volume2 size={14} />
                            <span>よみあげる</span>
                          </button>
                        )}
                      </div>

                      {/* Parent Engagement Question Frame */}
                      <div className="bg-[#FEFCE8] p-4 rounded-2xl border border-[#FEF08A]">
                        <span className="text-[10px] bg-[#FEF08A] text-[#A16207] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                          おうちの人と かんがえよう！
                        </span>
                        <p className="text-slate-800 text-sm font-black leading-relaxed mt-2">
                          {renderMarkup(ecologyResult.question)}
                        </p>
                      </div>

                      {/* Parent/Higher Grade Scientific Fact */}
                      <div className="border-t border-slate-100 pt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          💡 おとな・高学年向けのくわしい解説（根拠）
                        </span>
                        <p className="text-slate-600 text-xs leading-relaxed text-left">
                          {renderMarkup(ecologyResult.scientificFact)}
                        </p>
                      </div>

                      {/* Return Control Button */}
                      <button
                        id="btn-back-to-main"
                        onClick={handleBackToMain}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-sm transition-colors border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft size={16} />
                        <span>すいそうに もどる</span>
                      </button>

                    </div>
                  )}
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. FOOTER */}
      <footer className="mt-8 text-center text-slate-400 text-xs py-4 border-t border-slate-100 max-w-5xl w-full mx-auto print:hidden">
        <p className="font-medium">🐳 海の生き物カメラ図鑑 © 2026</p>
        <p className="text-[10px] mt-0.5">信憑性の高いエビデンスに基づき、海洋生態系の生物間相互作用を可視化しています。</p>
      </footer>

    </div>
  );
}
