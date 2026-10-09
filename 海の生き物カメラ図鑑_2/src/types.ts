export interface Species {
  id: string;
  name: string;        // Hiragana: e.g. くまのみ
  kanji: string;       // Kanji with furigana if needed, e.g. 熊の実 or just clean Kanji
  kanjiWithFurigana: { text: string; ruby: string }[]; // Formatted for rendering <ruby>
  englishName: string; // e.g. Clownfish
  category: string;    // e.g. おうぎの なかま
  color: string;       // Theme color for UI (hex)
  bgColor: string;     // Pastel background color for card
  description: string; // Brief description
  niche: string;       // Warm reef, cold open ocean, ocean floor, etc. (for niche checking!)
  tempZone: 'warm' | 'cold' | 'any';
  depthZone: 'shallow' | 'deep' | 'any';
  illustrationType: string;
}

export interface EcologyRelationship {
  type: 'symbiosis' | 'predation' | 'protection' | 'commensalism' | 'neutral' | 'incompatible';
  labelHiragana: string; // なかよし, もぐもぐ, まもられる, わいわい, あわない
  labelKanji: string;    // 共生（きょうせい）, 捕食（ほしょく）, 防衛（ぼうえい）, 共存（きょうぞん）, 生息地ちがい
  title: string;
  explanation: string;   // 100 chars, hiragana center, simple
  scientificFact: string; // scientifically accurate explanation with small ruby
  question: string;      // Parenting question (問いかけ) for child engagement
  animationType: string;  // Type of animation behavior to trigger on canvas
}

export interface ScannedCard {
  id: string;
  scannedAt: number;
}
