// Natural Human-like Friendly Japanese Voice Synthesis Engine
// Designed for children's educational marine app with warm cadence and human-like natural tone.

class NaturalVoiceEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized = false;

  constructor() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.initVoices();
      };
    }
  }

  private initVoices() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.selectedVoice = this.findBestFriendlyVoice();
    this.isInitialized = true;
  }

  // Find the highest quality, most natural and friendly female Japanese voice available (Kindergarten Teacher Style)
  private findBestFriendlyVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) return null;

    // Filter Japanese voices
    const jaVoices = this.voices.filter((v) => {
      const lang = v.lang ? v.lang.replace("_", "-").toLowerCase() : "";
      return lang.startsWith("ja");
    });

    if (jaVoices.length === 0) return null;

    // Priority list favoring gentle female voices for kindergarten teacher narration
    const priorityKeywords = [
      "Nanami",                        // Microsoft Nanami (Warm gentle female child-friendly voice)
      "Google 日本語",                  // Google Japanese high-quality natural female voice
      "Kyoko",                         // Apple Kyoko (Standard friendly female voice)
      "Yuina",                         // Apple Yuina (Gentle female voice)
      "Sakura",                        // Apple Sakura (Soft female voice)
      "Aoi",                           // Microsoft Aoi
      "Shiori",                        // Microsoft Shiori
      "Mayu",                          // Microsoft Mayu
      "Ayumi",                         // Microsoft Ayumi
      "Natural",                       // Neural / Natural female voices
      "Neural",
      "Online",
    ];

    for (const keyword of priorityKeywords) {
      const match = jaVoices.find((v) => v.name.includes(keyword) && !v.name.includes("Male") && !v.name.includes("Otoya") && !v.name.includes("Hattori"));
      if (match) return match;
    }

    // Fallback to local default Japanese voice
    return jaVoices.find((v) => v.default) || jaVoices[0];
  }

  // Pre-process Japanese text to insert gentle breathing pauses, remove parenthetical notes, and accurately map topic particle 'は' to 'わ' phonetically without corrupting word stems
  private sanitizeText(text: string): string {
    let clean = text
      .replace(/<rt>.*?<\/rt>/g, "") // Strip ruby phonetic tags
      .replace(/<[^>]+>/g, "")       // Strip any HTML tags
      .replace(/[（\(][^）\)]*[）\)]/g, ""); // Strip text inside full-width and half-width parentheses （） ()

    // 1. Convert compound particles where 'は' is always pronounced 'わ'
    clean = clean
      .replace(/には/g, "にわ")
      .replace(/では/g, "でわ")
      .replace(/からは/g, "からわ")
      .replace(/までは/g, "までわ")
      .replace(/とは/g, "とわ")
      .replace(/としては/g, "としてわ")
      .replace(/のは/g, "のわ")
      .replace(/ては/g, "てわ");

    // 2. Convert topic particle 'は' following known creature names, pronouns, or common nouns
    clean = clean.replace(
      /(くまのみ|いそぎんちゃく|さめ|いわし|いわしのむれ|くじら|こばんざめ|じんべえざめ|ぷらんくとん|かに|たこ|いか|くらげ|うみがめ|いるか|しゃち|ひとで|たつのおとしご|まんた|ぺんぎん|らっこ|ふぐ|うつぼ|えび|まんぼう|やどかり|みんな|だれ|どれ|これ|それ|なに|じぶん|からだ|あたま|おなか|おくち|てき|なかま|おともだち|うみ|ひみつ|ピンチ|ハンター|あと|とき)は/g,
      "$1わ"
    );

    // 3. Convert standalone topic particle 'は' when followed by punctuation, whitespace, or at end of clause
    clean = clean.replace(/([0-9a-zA-Zぁ-んァ-ヶ亜-熙]{2,})は([、。！？\s　]|$)/g, "$1わ$2");

    // 4. Restore word stems where 'は' is part of the word and MUST be pronounced 'ha'
    clean = clean
      .replace(/おわなし/g, "おはなし")
      .replace(/わなれ/g, "はなれ")
      .replace(/ごわん/g, "ごはん")
      .replace(/わさみ/g, "はさみ")
      .replace(/ワサミ/g, "ハサミ")
      .replace(/わやす/g, "はやす")
      .replace(/わやく/g, "はやく")
      .replace(/わやい/g, "はやい")
      .replace(/わね/g, "はね")
      .replace(/わこ/g, "はこ")
      .replace(/わじめ/g, "はじめ")
      .replace(/するどい[ 　]?わ/g, "するどい は");

    // 5. Add unhurried breathing pauses for kindergarten teacher narration
    return clean
      .replace(/([！!？?])([^\s])/g, "$1　$2") // Add gentle breath pause
      .replace(/([。、])/g, "$1　");   // Ensure unhurried natural pauses
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    }
  ): SpeechSynthesisUtterance | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;

    // Refresh voices if not initialized yet
    if (!this.selectedVoice || this.voices.length === 0) {
      this.initVoices();
    }

    const cleanText = this.sanitizeText(text);
    if (!cleanText.trim()) return null;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "ja-JP";

    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Gentle, warm female kindergarten teacher tone: unhurried (rate 0.78), soft elevated warmth (pitch 1.12)
    utterance.rate = options?.rate ?? 0.78;   // Gentle, unhurried, slow reading speed for young children
    utterance.pitch = options?.pitch ?? 1.12; // Warm & sweet teacher voice pitch
    utterance.volume = 1.0;

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
    return utterance;
  }

  public cancel() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getVoiceName(): string {
    return this.selectedVoice ? this.selectedVoice.name : "デフォルト音声";
  }
}

export const naturalVoice = new NaturalVoiceEngine();
