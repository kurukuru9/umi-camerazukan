import { Species, EcologyRelationship } from "./types";

export const speciesList: Species[] = [
  {
    id: "clownfish",
    name: "くまのみ",
    kanji: "隈之実",
    kanjiWithFurigana: [
      { text: "隈", ruby: "くま" },
      { text: "之", ruby: "の" },
      { text: "実", ruby: "み" }
    ],
    englishName: "Clownfish",
    category: "スズキの なかま",
    color: "#FF8A3D",
    bgColor: "#FFF0E5",
    description: "いそぎんちゃくの どくのある てを すりぬけて、なかよく くらします。てきから みを まもってもらいます。",
    niche: "さんごしょう（あたたかい うみ）",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "clownfish"
  },
  {
    id: "anemone",
    name: "いそぎんちゃく",
    kanji: "磯巾着",
    kanjiWithFurigana: [
      { text: "磯", ruby: "いそ" },
      { text: "巾", ruby: "きん" },
      { text: "着", ruby: "ちゃく" }
    ],
    englishName: "Sea Anemone",
    category: "イソギンチャクの なかま",
    color: "#FF69B4",
    bgColor: "#FFE5F0",
    description: "どくのある てを もっています。くまのみが おびきよせてくれた えさを たべたり、からだを そうじしてもらいます。",
    niche: "さんごしょう（あたたかい うみ）",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "anemone"
  },
  {
    id: "shark",
    name: "さめ",
    kanji: "鮫",
    kanjiWithFurigana: [{ text: "鮫", ruby: "さめ" }],
    englishName: "Great White Shark",
    category: "ナンコツウオの なかま",
    color: "#7E90A3",
    bgColor: "#EEF2F6",
    description: "うみの おうじゃです。するどい はを もっていて、いわしなどの むれを もぐもぐ たべます。こばんざめが くっつくこともあります。",
    niche: "ひろい うみ（あたたかい〜つめたい）",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "shark"
  },
  {
    id: "anchovies",
    name: "いわしのむれ",
    kanji: "鰯の群れ",
    kanjiWithFurigana: [
      { text: "鰯", ruby: "いわし" },
      { text: "の", ruby: "" },
      { text: "群", ruby: "む" },
      { text: "れ", ruby: "" }
    ],
    englishName: "School of Anchovies",
    category: "ニシンの なかま",
    color: "#60A5FA",
    bgColor: "#EFF6FF",
    description: "たくさんの いわしが あつまって、おおきな さかなに みせて てきをおどろかせます。でも、さめや くじらに たべられちゃいます。",
    niche: "ひろい うみ（あたたかい〜つめたい）",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "anchovies"
  },
  {
    id: "whale",
    name: "くじら",
    kanji: "鯨",
    kanjiWithFurigana: [{ text: "鯨", ruby: "くじら" }],
    englishName: "Blue Whale",
    category: "ホニュウルイの なかま",
    color: "#3B82F6",
    bgColor: "#E0F2FE",
    description: "ちきゅうで いちばん おおきな どうぶつです。およぐのが はやく、ぷらんくとんや いわしの むれを おおきな くちで すいこみます。",
    niche: "ひろい うみ（あたたかい〜つめたい）",
    tempZone: "any",
    depthZone: "any",
    illustrationType: "whale"
  },
  {
    id: "remora",
    name: "こばんざめ",
    kanji: "コバンザメ",
    kanjiWithFurigana: [
      { text: "コ", ruby: "こ" },
      { text: "バ", ruby: "ば" },
      { text: "ン", ruby: "ん" },
      { text: "ザ", ruby: "ざ" },
      { text: "メ", ruby: "め" }
    ],
    englishName: "Remora",
    category: "スズキの なかま",
    color: "#5A738E",
    bgColor: "#F0F4F8",
    description: "あたまに おおきな すいばん（こばん）をもっていて、じんべえざめや さめの おなかに くっついて たびを します。えさの おこぼれを もらいます。",
    niche: "あたたかい ひろい うみ",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "remora"
  },
  {
    id: "whale_shark",
    name: "じんべえざめ",
    kanji: "甚兵衛鮫",
    kanjiWithFurigana: [
      { text: "甚", ruby: "じん" },
      { text: "兵", ruby: "べえ" },
      { text: "鮫", ruby: "ざめ" }
    ],
    englishName: "Whale Shark",
    category: "ナンコツウオの なかま",
    color: "#1E3A8A",
    bgColor: "#DBEAFE",
    description: "いちばん おおきな さかなですが、とっても おっとりしています。ちいさな ぷらんくとんを おおきな くちで すいこんで たべます。",
    niche: "あたたかい ひろい うみ",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "whale_shark"
  },
  {
    id: "plankton",
    name: "ぷらんくとん",
    kanji: "浮遊生物",
    kanjiWithFurigana: [
      { text: "浮", ruby: "ふ" },
      { text: "遊", ruby: "ゆう" },
      { text: "生", ruby: "せい" },
      { text: "物", ruby: "ぶつ" }
    ],
    englishName: "Plankton",
    category: "びせいぶつの なかま",
    color: "#10B981",
    bgColor: "#D1FAE5",
    description: "うみじゅうに ただよっている、ちいさな ちいさな いきものです。くじらや じんべえざめ、いわしたちの だいじな ごちそう（えさ）です。",
    niche: "うみの どこにでも いる",
    tempZone: "any",
    depthZone: "any",
    illustrationType: "plankton"
  },
  {
    id: "crab",
    name: "かに",
    kanji: "蟹",
    kanjiWithFurigana: [{ text: "蟹", ruby: "かに" }],
    englishName: "Crab",
    category: "コウカクルイの なかま",
    color: "#EF4444",
    bgColor: "#FEE2E2",
    description: "ハサミを チョキチョキ うごかします。うみの そこをおよぎ、やどかりと ちかくで くらします。たこに ねらわれることもあります。",
    niche: "あさい うみの そこ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "crab"
  },
  {
    id: "octopus",
    name: "たこ",
    kanji: "蛸",
    kanjiWithFurigana: [{ text: "蛸", ruby: "たこ" }],
    englishName: "Octopus",
    category: "トウソクルイの なかま",
    color: "#EC4899",
    bgColor: "#FCE7F3",
    description: "あたまが まるく、てが ８ぽん あります。かにや かいを もぐもぐ たべますが、うつぼや さめが とっても にがてです。",
    niche: "うみの そこ・さんごしょう",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "octopus"
  },
  {
    id: "squid",
    name: "いか",
    kanji: "烏賊",
    kanjiWithFurigana: [
      { text: "烏", ruby: "い" },
      { text: "賊", ruby: "か" }
    ],
    englishName: "Squid",
    category: "トウソクルイの なかま",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    description: "からだが ほそながく、てが １０ぽん あります。くらげを たべたり、いわしを たべます。およぐのが とても はやいです。",
    niche: "ひろい うみ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "squid"
  },
  {
    id: "jellyfish",
    name: "くらげ",
    kanji: "水母",
    kanjiWithFurigana: [
      { text: "水", ruby: "くら" },
      { text: "母", ruby: "げ" }
    ],
    englishName: "Jellyfish",
    category: "シポウルイの なかま",
    color: "#A78BFA",
    bgColor: "#EDE9FE",
    description: "ふあふあ うみの なかを ただよっています。どくのある てを のばして ぷらんくとんを つかまえます。うみがめの だいこうぶつです。",
    niche: "ひろい うみの どこでも",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "jellyfish"
  },
  {
    id: "sea_turtle",
    name: "うみがめ",
    kanji: "海亀",
    kanjiWithFurigana: [
      { text: "海", ruby: "うみ" },
      { text: "亀", ruby: "がめ" }
    ],
    englishName: "Sea Turtle",
    category: "ハチュウルイの なかま",
    color: "#10B981",
    bgColor: "#E6F4EA",
    description: "かたい こうらをもっていて、およぐのが とっても じょうず。くらげや かいなどを たべます。あたたかい さんごしょうが だいすきです。",
    niche: "さんごしょう（あたたかい うみ）",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "sea_turtle"
  },
  {
    id: "dolphin",
    name: "いるか",
    kanji: "海豚",
    kanjiWithFurigana: [
      { text: "海", ruby: "いる" },
      { text: "豚", ruby: "か" }
    ],
    englishName: "Dolphin",
    category: "ホニュウルイの なかま",
    color: "#38BDF8",
    bgColor: "#E0F2FE",
    description: "とても かしこい うみの どうぶつです。「きゅーっ」と なきながら、なかま同士で おしゃべりして、いわしを かこんで たべます。",
    niche: "あたたかい〜すこし つめたい うみ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "dolphin"
  },
  {
    id: "orca",
    name: "しゃち",
    kanji: "鯱",
    kanjiWithFurigana: [{ text: "鯱", ruby: "しゃち" }],
    englishName: "Orca",
    category: "ホニュウルイの なかま",
    color: "#334155",
    bgColor: "#F1F5F9",
    description: "うみの さいきょうの ハンターです。とても かしこく、さめや ぺんぎんを チームワークで おそって たべます。",
    niche: "つめたい うみ・ひろい うみ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "orca"
  },
  {
    id: "starfish",
    name: "ひとで",
    kanji: "人手",
    kanjiWithFurigana: [
      { text: "人", ruby: "ひと" },
      { text: "手", ruby: "で" }
    ],
    englishName: "Starfish",
    category: "キョクヒドウブツの なかま",
    color: "#F43F5E",
    bgColor: "#FFE4E6",
    description: "ほしの かたちを しています。うみの そこを ゆっくり あるき、かいや かにを たべます。うしなわれた うでを はやすことができます。",
    niche: "うみの そこ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "starfish"
  },
  {
    id: "seahorse",
    name: "たつのおとしご",
    kanji: "竜の落とし子",
    kanjiWithFurigana: [
      { text: "竜", ruby: "たつ" },
      { text: "の", ruby: "" },
      { text: "落", ruby: "お" },
      { text: "とし", ruby: "" },
      { text: "子", ruby: "ご" }
    ],
    englishName: "Seahorse",
    category: "トゲウオの なかま",
    color: "#F59E0B",
    bgColor: "#FEF3C7",
    description: "たつ（りゅう）の こどもの ような かたち。おをと もかいそうに まきつけて、ぷらんくとんを すいこんで たべます。",
    niche: "あたたかい さんごしょう",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "seahorse"
  },
  {
    id: "manta",
    name: "まんた",
    kanji: "オニイトマキエイ",
    kanjiWithFurigana: [
      { text: "オ", ruby: "お" },
      { text: "ニ", ruby: "に" },
      { text: "イ", ruby: "い" },
      { text: "ト", ruby: "と" },
      { text: "マ", ruby: "ま" },
      { text: "キ", ruby: "き" },
      { text: "エ", ruby: "え" },
      { text: "イ", ruby: "い" }
    ],
    englishName: "Manta Ray",
    category: "ナンコツウオの なかま",
    color: "#6366F1",
    bgColor: "#EEF2FF",
    description: "とっても おおきな エイの なかま。うみの なかを まるで とぶように およぎ、ちいさな ぷらんくとんを すいこんで たべます。",
    niche: "あたたかい ひろい うみ",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "manta"
  },
  {
    id: "penguin",
    name: "ぺんぎん",
    kanji: "人鳥",
    kanjiWithFurigana: [
      { text: "人", ruby: "ぺん" },
      { text: "鳥", ruby: "ぎん" }
    ],
    englishName: "Penguin",
    category: "チョウルイの なかま",
    color: "#0F172A",
    bgColor: "#F1F5F9",
    description: "とべない とりですが、うみの なかでは さかなの ように はやく およげます。いわしや いかを もぐもぐ たべます。しゃちに ねらわれます。",
    niche: "つめたい うみ・なんきょく",
    tempZone: "cold",
    depthZone: "shallow",
    illustrationType: "penguin"
  },
  {
    id: "sea_otter",
    name: "らっこ",
    kanji: "猟虎",
    kanjiWithFurigana: [
      { text: "猟", ruby: "らっ" },
      { text: "虎", ruby: "こ" }
    ],
    englishName: "Sea Otter",
    category: "ホニュウルイの なかま",
    color: "#78350F",
    bgColor: "#FEF3C7",
    description: "つめたい 海に すんでいます。おなかの うえに いしを おいて、かたい かい や かにを コンコンと わって たべます。",
    niche: "つめたい うみ・かいそうのもり",
    tempZone: "cold",
    depthZone: "shallow",
    illustrationType: "sea_otter"
  },
  {
    id: "pufferfish",
    name: "ふぐ",
    kanji: "河豚",
    kanjiWithFurigana: [
      { text: "河", ruby: "ふ" },
      { text: "豚", ruby: "ぐ" }
    ],
    englishName: "Pufferfish",
    category: "フグの なかま",
    color: "#FBBF24",
    bgColor: "#FEF3C7",
    description: "おどろくと おなかを ぷーっと ふくらませて、からだの トゲを たてて てきを おどろかせます。つよい どくを からだに もっています。",
    niche: "あたたかい さんごしょう",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "pufferfish"
  },
  {
    id: "eel",
    name: "うつぼ",
    kanji: "鱓",
    kanjiWithFurigana: [{ text: "鱓", ruby: "うつぼ" }],
    englishName: "Moray Eel",
    category: "ウナギの なかま",
    color: "#166534",
    bgColor: "#DCFCE7",
    description: "いわの すきまに かくれて くらします。するどい はを もっていて たこが だいこうぶつです。えびにおそうじ（そうじ共生）してもらいます。",
    niche: "さんごしょう（いわば）",
    tempZone: "warm",
    depthZone: "shallow",
    illustrationType: "eel"
  },
  {
    id: "shrimp",
    name: "えび",
    kanji: "海老",
    kanjiWithFurigana: [
      { text: "海", ruby: "え" },
      { text: "老", ruby: "び" }
    ],
    englishName: "Shrimp",
    category: "コウカクルイの なかま",
    color: "#F472B6",
    bgColor: "#FCE7F3",
    description: "「クリーナーシュリンプ」とよばれる えびは、うつぼの くちの なかや からだを おそうじして、えさを もらう「なかよし」です。",
    niche: "いわば・さんごしょうの すきま",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "shrimp"
  },
  {
    id: "sunfish",
    name: "まんぼう",
    kanji: "翻車魚",
    kanjiWithFurigana: [
      { text: "翻", ruby: "まん" },
      { text: "車", ruby: "ぼ" },
      { text: "魚", ruby: "う" }
    ],
    englishName: "Ocean Sunfish",
    category: "フグの なかま",
    color: "#93C5FD",
    bgColor: "#EFF6FF",
    description: "とっても まるくて ふしぎな かたち。ぷかぷか うかんで くらげを たべます。からだに たくさん ついた むしを とってもらいます。",
    niche: "ひろい うみ・あたたかい〜つめたい",
    tempZone: "any",
    depthZone: "any",
    illustrationType: "sunfish"
  },
  {
    id: "hermit_crab",
    name: "やどかり",
    kanji: "宿借",
    kanjiWithFurigana: [
      { text: "宿", ruby: "やど" },
      { text: "借", ruby: "かり" }
    ],
    englishName: "Hermit Crab",
    category: "コウカクルイの なかま",
    color: "#D97706",
    bgColor: "#FEF3C7",
    description: "ほかのかいの からを せおって くらします。いそぎんちゃくを からのうえに のせて、てきから からだを まもってもらいます（きょうせい）。",
    niche: "うみの そこ・いそべ",
    tempZone: "any",
    depthZone: "shallow",
    illustrationType: "hermit_crab"
  }
];

export const getPredefinedRelationship = (ids: string[]): EcologyRelationship | null => {
  if (ids.length < 2) return null;
  
  // 3 or more creatures dynamic combined relationship builder
  if (ids.length >= 3) {
    const specs = ids.map(id => speciesList.find(s => s.id === id)).filter(Boolean) as Species[];
    
    const relationsList: string[] = [];
    const pairedIds = new Set<string>();
    
    // Find all pairwise relationships inside the selected set
    for (let i = 0; i < specs.length; i++) {
      for (let j = i + 1; j < specs.length; j++) {
        const id1 = specs[i].id;
        const id2 = specs[j].id;
        const subRel = getPredefinedRelationship([id1, id2]);
        if (subRel && subRel.type !== "neutral" && subRel.type !== "incompatible") {
          relationsList.push(`${specs[i].name}と${specs[j].name}は『${subRel.title.replace(/！|!/g, "")}』`);
          pairedIds.add(id1);
          pairedIds.add(id2);
        }
      }
    }
    
    // For any species not covered by special relationships, add their behavior
    const unpairedSpecs = specs.filter(s => !pairedIds.has(s.id));
    const unpairedList = unpairedSpecs.map(s => `${s.name}が ${s.description.split("。")[0]}`);
    
    let combinedExplanation = "";
    if (relationsList.length > 0) {
      combinedExplanation = relationsList.join("。また、") + "。";
      if (unpairedList.length > 0) {
        combinedExplanation += `そのちかくでは、${unpairedList.join("、")}。みんなおなじ海でつながっています。`;
      }
    } else {
      combinedExplanation = specs.map(s => `${s.name}（${s.description.split("。")[0]}）`).join("や、") + "たちが、うみのなかで いっしょに のんびり くらしています。";
    }

    // Keep it short for children
    if (combinedExplanation.length > 180) {
      combinedExplanation = combinedExplanation.substring(0, 175) + "など、みんなおなじ海でつながっています。";
    }

    // Compose scientific facts
    const factsList: string[] = [];
    specs.forEach(s => {
      factsList.push(`${s.name}は主に${s.niche}に生息する${s.category}です。`);
    });
    const combinedScientific = factsList.slice(0, 3).join(" ") + " 生態系においてそれぞれが異なる食物網や役割を担い、共存しています。";

    return {
      type: "neutral",
      labelHiragana: "わいわい",
      labelKanji: "<ruby>生物多様性<rt>せいぶつたようせい</rt></ruby>",
      title: "みんなで にぎやか！海のつながり！",
      explanation: combinedExplanation,
      scientificFact: combinedScientific,
      question: `${specs.map(s => s.name).join("と ")}たちが、同じ海で いっしょに およぐと、どんな おはなしをしてるかな？`,
      animationType: "neutral_swim_multiple"
    };
  }

  const sorted = [...ids].sort();

  // clownfish + anemone (Mutualism)
  if (sorted.includes("clownfish") && sorted.includes("anemone")) {
    return {
      type: "symbiosis",
      labelHiragana: "なかよし",
      labelKanji: "相利共生（そうりきょうせい）",
      title: "おたがいに たすけあう なかよし！",
      explanation: "くまのみはいそぎんちゃくに まもってもらい、いそぎんちゃくはくまのみがおそうじして 食べのこしをあげます。",
      scientificFact: "くまのみのからだを覆う粘液は、イソギンチャクの毒針を刺激しない特殊な成分になっています。くまのみは安全に触手（しょくしゅ）に隠れて外敵から身を守り、イソギンチャクはクマノミの排泄物（はいせつぶつ）から栄養を得ています。",
      question: "もし、くまのみが いそぎんちゃくから いなくなったら、くまのみは どうなるかな？",
      animationType: "clownfish_anemone"
    };
  }

  // shark + remora (Commensalism)
  if (sorted.includes("shark") && sorted.includes("remora")) {
    return {
      type: "commensalism",
      labelHiragana: "わいわい",
      labelKanji: "偏利共生（へんりきょうせい）",
      title: "さめの おなかに ピタッ！おこぼれ ちょうだい！",
      explanation: "こばんざめは さめのおなかに くっついて たびをします。さめがたべた えさの おこぼれをもらいます。",
      scientificFact: "コバンザメの頭部には小判（こばん）型の吸盤（きゅうばん）があり、大型のシャークやジンベエザメに吸着します。移動のエネルギーを節約し、宿主の食べ残しや寄生虫（きせいちゅう）を食べます。宿主には害も利益もほとんどありません。",
      question: "こばんざめは、どうやって さめに くっついているのかな？ あたまを みてみよう！",
      animationType: "shark_remora"
    };
  }

  // whale_shark + remora (Commensalism)
  if (sorted.includes("whale_shark") && sorted.includes("remora")) {
    return {
      type: "commensalism",
      labelHiragana: "わいわい",
      labelKanji: "偏利共生（へんりきょうせい）",
      title: "おおきな おともだちと およごう！",
      explanation: "こばんざめは じんべえざめの おなかに くっついて らくちんドライブ！おそうじも してあげます。",
      scientificFact: "コバンザメはジンベエザメの体表にくっつき、食べ残しのプランクトンや寄生虫を掃除します。お互いに害を及ぼさず、のんびりと泳ぎます。",
      question: "じんべえざめの ドライブは どんな きぶんだとおもう？",
      animationType: "whale_shark_remora"
    };
  }

  // eel + shrimp (Cleaning Mutualism)
  if (sorted.includes("eel") && sorted.includes("shrimp")) {
    return {
      type: "symbiosis",
      labelHiragana: "なかよし",
      labelKanji: "掃除共生（そうじきょうせい）",
      title: "はい、お口を あけて！おそうじ えび！",
      explanation: "えびは うつぼの おくちの なかを おそうじして、むしば（きせいちゅう）を たべて おなか いっぱいに なります。",
      scientificFact: "アカシマモエビなどの『クリーナーシュリンプ』は、ウツボの口内や体表の寄生虫や古い皮膚を食べます。ウツボはえびを食べずに口を開けてサービスを受け、健康を維持します。",
      question: "どうして うつぼは じぶんを おそうじしてくれる えびを たべないのかな？",
      animationType: "eel_shrimp"
    };
  }

  // anemone + hermit_crab (Protection Mutualism)
  if (sorted.includes("anemone") && sorted.includes("hermit_crab")) {
    return {
      type: "symbiosis",
      labelHiragana: "なかよし",
      labelKanji: "相利共生（そうりきょうせい）",
      title: "どくの ぼうしを かぶった やどかり！",
      explanation: "やどかりは、いそぎんちゃくを からのうえに のせて てきから まもってもらい、いそぎんちゃくは お引越しができます。",
      scientificFact: "ヤドカリの一部はイソギンチャクを貝殻（かいがら）の上にのせ、天敵であるタコなどから身を守ります。イソギンチャクは移動範囲が広がり、餌（えさ）を捕らえる機会が増えます。",
      question: "やどかりの おうち（かいがら）のうえに のっているのは だれかな？",
      animationType: "anemone_hermit_crab"
    };
  }

  // shark + anchovies (Predation)
  if (sorted.includes("shark") && sorted.includes("anchovies")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "うわぁ！おおきな おくちが せまってくるぞ！",
      explanation: "さめは いわしの むれを おいかけて、もぐもぐ たべちゃいます。いわしは むれを つくって にげようとします。",
      scientificFact: "イワシは集団（しゅうだん）行動（スイミングスクール）をすることで、単体としての被捕食率（食べられる確率）を下げようとしますが、シャークなどの上位捕食者にはまとめて効率（こうりつ）的に狩られます。",
      question: "いわしたちは、どうして みんなで いっしょに およんでいるのかな？",
      animationType: "shark_anchovies"
    };
  }

  // whale + plankton (Predation)
  if (sorted.includes("whale") && sorted.includes("plankton")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "せかい一 おおきな おくちで パクリ！",
      explanation: "くじらは とっても おおきいけれど、ちいさな ぷらんくとんが だいこうぶつ！お水といっしょに すいこみます。",
      scientificFact: "ヒゲクジラ類は海洋の基礎（きそ）生産者である動物プランクトン（オキアミなど）を、クジラひげ（ろ過器）を使って海水ごと濾（こ）し取って大量に摂食（せっしょく）します。",
      question: "こんなに おおきな くじらが、こんなに ちいさな ぷらんくとんを たべるのって、おもしろいね！",
      animationType: "whale_plankton"
    };
  }

  // whale_shark + plankton (Predation)
  if (sorted.includes("whale_shark") && sorted.includes("plankton")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "おっとり じんべえざめも ぷらんくとんが すき！",
      explanation: "じんべえざめは ひとを たべません。ちいさな ぷらんくとんを おおきな くちを あけて すいこみます。",
      scientificFact: "ジンベエザメは世界最大の魚類（ぎょるい）ですが、クジラ同様にプランクトンや小魚を海水ごと飲み込み、エラで濾過して摂食します（濾過摂食）。",
      question: "じんべえざめの おくちは どんな かたちを している？ ひらいてみて！",
      animationType: "whale_shark_plankton"
    };
  }

  // eel + octopus (Predation)
  if (sorted.includes("eel") && sorted.includes("octopus")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "いわばの すきまから にゅっ！たこ あぶない！",
      explanation: "うつぼは、いわの すきまに かくれている たこを みつけて、するどい はで もぐもぐ たべちゃいます。",
      scientificFact: "ウツボの天敵（てんてき）はサメなどですが、タコにとっては天敵であり好物（こうぶつ）です。岩隙（がんげき）に潜むウツボは、同じく岩場に生息するタコを強力な顎（あご）と鋭い歯で捕食します。",
      question: "たこは、うつぼから どうやって にげるかな？ すみを はくのかな？",
      animationType: "eel_octopus"
    };
  }

  // octopus + crab (Predation)
  if (sorted.includes("octopus") && sorted.includes("crab")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "たこの うでが にゅーっ！かに ピンチ！",
      explanation: "たこは、かたい こうらをもった かにが だいすき！あたまの いい たこは かにを つかまえて たべます。",
      scientificFact: "タコは非常に高い知能（ちのう）を持ち、甲殻類（こうかくるい）であるカニを触手（しょくしゅ）で捕らえ、鋭いクチバシ（カラストンビ）で殻を破り、唾液腺（だえきせん）の毒で麻痺させて食べます。",
      question: "かには ハサミを もっているけれど、たこに かてるかな？",
      animationType: "octopus_crab"
    };
  }

  // sea_turtle + jellyfish (Predation)
  if (sorted.includes("sea_turtle") && sorted.includes("jellyfish")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "どくのある くらげも パクリ！うみがめの ごちそう！",
      explanation: "うみがめは、どくをもつ くらげに さされても へっちゃら！くらげを パクパク おやつみたいに たべます。",
      scientificFact: "ウミガメ（特にオサガメやアオウミガメ）はクラゲを多く食します。ウミガメの食道は角質（かくしつ）の突起（とっき）で覆われており、クラゲの毒刺胞（どくしほう）が刺さりにくい構造になっています。",
      question: "うみがめは、くらげを たべても おなかが いたくならないんだって！ ふしぎだね！",
      animationType: "sea_turtle_jellyfish"
    };
  }

  // sea_otter + crab (Predation)
  if (sorted.includes("sea_otter") && sorted.includes("crab")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "おなかの うえで コンコン！かに たべちゃうぞ！",
      explanation: "らっこは おなかのうえに おいた いしを つかって、かたい かに や かいをおなかの上で コンコンして たべます。",
      scientificFact: "ラッコは道具（石）を使う稀（まれ）な哺乳類です。冷たい海で体温を保つために大量の食料を必要とし、カニやウニ、貝類を石で割って貪欲（どんよく）に捕食します（キーストーン種）。",
      question: "らっこは、おなかを テーブルにして ごはんを たべるんだよ。まねできるかな？",
      animationType: "sea_otter_crab"
    };
  }

  // orca + penguin (Predation)
  if (sorted.includes("orca") && sorted.includes("penguin")) {
    return {
      type: "predation",
      labelHiragana: "もぐもぐ",
      labelKanji: "捕食（ほしょく）",
      title: "つめたい うみの はやい およぎっこ！",
      explanation: "しゃちは とても あたまがよく、つめたい うみで およぐ ぺんぎんを なかまと きょうりょくして つかまえます。",
      scientificFact: "シャチ（オルカ）は氷の上のペンギンを、波を起こして落とすなど高度なチーム狩猟を行います。アデリーペンギンやコウテイペンギンは高速に泳いで逃げようとします。",
      question: "しゃちは どんな「さくせん」で ぺんぎんを おいかけるかな？",
      animationType: "orca_penguin"
    };
  }

  // Niche incompatibility checks (e.g., Clione vs. Warm Coral, but here cold/warm niche mismatch)
  const first = speciesList.find(s => s.id === ids[0]);
  const second = speciesList.find(s => s.id === ids[1]);

  if (first && second) {
    if (
      (first.tempZone === "warm" && second.tempZone === "cold") ||
      (first.tempZone === "cold" && second.tempZone === "warm")
    ) {
      return {
        type: "incompatible",
        labelHiragana: "あわない",
        labelKanji: "生息地（せいそくち）ちがい",
        title: "すんでいる おみずの おんどが ちがうよ！",
        explanation: `${first.name}は「${first.niche}」にすんでいて、${second.name}は「${second.niche}」にすんでいます。であうことは ありません。`,
        scientificFact: `生物地理学（せいぶつちりがく）の観点から、${first.name}は${first.tempZone === "warm" ? "温暖（おんだん）な熱帯海域（さんご礁）" : "極地（きょくち）などの寒帯海域"}に、${second.name}は${second.tempZone === "warm" ? "さんご礁海域" : "極地海域"}に適応（てきおう）しています。生息水温や生態的（せいたいてき）地位（ニッチ）が全く異なるため、自然環境下で交わることはありません。`,
        question: `あたたかい うみ（${first.tempZone === "warm" ? first.name : second.name}）と、つめたい うみ（${first.tempZone === "cold" ? first.name : second.name}）、どっちの およぎが つよそうかな？`,
        animationType: "niche_mismatch"
      };
    }
  }

  // Default neutral interaction if no specific relationship pre-defined
  const mainSpec = first || speciesList[0];
  const secondSpec = second || speciesList[1];
  return {
    type: "neutral",
    labelHiragana: "わいわい",
    labelKanji: "共存（きょうぞん）",
    title: "うみの なかで いっしょに およぐよ！",
    explanation: `${mainSpec.name}と ${secondSpec.name}は、おたがいに けんかを しないで、うみの なかで のんびり 暮らしています。`,
    scientificFact: `${mainSpec.name}（${mainSpec.category}）と${secondSpec.name}（${secondSpec.category}）は、同じ海洋生態系（せいたいけい）のなかにいますが、お互いの食物網（しょくもつもう）において直接（ちょくせつ）的な利害（りがい）関係や捕食関係を持たないため、平和的に共存しています。`,
    question: `${mainSpec.name}と ${secondSpec.name}は、うみの なかで どんな おはなしをしているとおもう？`,
    animationType: "neutral_swim"
  };
};
