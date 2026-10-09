import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn("WARNING: GEMINI_API_KEY is not defined. Falling back to predefined relationships.");
}

// API endpoint for Marine Life Interaction Analysis
app.post("/api/interaction", async (req, res) => {
  const { creatures } = req.body; // Array of objects with name, englishName, niche, tempZone, etc.

  if (!creatures || !Array.isArray(creatures) || creatures.length < 2) {
    return res.status(400).json({ error: "少なくても2匹以上の生き物を選んでね！" });
  }

  const names = creatures.map(c => c.name).join("、");
  const englishNames = creatures.map(c => c.englishName).join(", ");
  const listDetails = creatures.map(c => 
    `・${c.name} (${c.englishName}): 生息地域=${c.niche}, 温度帯=${c.tempZone}, 水深=${c.depthZone}, 分類=${c.category}`
  ).join("\n");

  if (!ai) {
    return res.json({
      fallback: true,
      message: "APIキーが設定されていないため、ローカルの図鑑データで解説します。"
    });
  }

  try {
    const prompt = `あなたは幼児教育（5歳児向け）と海洋生物学の専門家です。
以下の海の生き物たち(${creatures.length}匹)について、それらが同じ海の中でどのように関わり合っているか（生物間相互作用：共生、捕食、防衛、あるいは生息地ちがいによる不干渉など）を分析し、5歳児とその親御さんが一緒に学べる解説を生成してください。

選択された生き物たち:
${listDetails}

【重要ルール】
1. 生態学的・学術的な正確さに完全に基づき、でっち上げや架空の関係を作らないこと。
   - 例えば、冷水にすむ生き物(らっこ等)と、暖かいサンゴ礁にすむ生き物(くまのみ等)のように、生息地（水温やニッチ）が全く異なり自然界で接触しない場合は、関係タイプを「incompatible（あわない/生息地ちがい）」とし、それぞれの地理的・温度的生息域の違いを正確に説明すること。
   - 共生、捕食、防衛、共存、生息地ちがいのいずれかに当てはめること。
2. 幼児向け解説(explanation)は、ひらがな中心で、小学校低学年以下でもわかる優しい言葉、130文字以内でまとめること。
3. 漢字を使用する場合は、漢字の上にふりがなを表示できるように、HTMLの <ruby>タグ（例: <ruby>捕食<rt>ほしょく</rt></ruby>）を必ず使ってすべての漢字にふりがなを振ること。
4. 科学的解説(scientificFact)は、親御さんや小学校高学年が読んで納得できる科学的根拠（触手の構造、清掃行動、食物網、温度適応など）を含め、こちらもすべての漢字に <ruby>漢字<rt>かんじ</rt></ruby> タグを適用すること。
5. 親子の会話のきっかけとなる「これ、何に見える？」「もし〜だったらどうなるかな？」といった問いかけ(question)を含めること。
6. 今回選ばれたすべての生き物（${creatures.length}匹：${englishNames}）が登場するアニメーションの様子を想像し、指示文(animationType)に指定すること。
7. 【3匹以上のときの超重要ルール】
   - 今回は ${creatures.length} 匹（${names}）の生き物が選択されています。3匹以上の生き物が選ばれている場合、解説（explanation）および科学的解説（scientificFact）の両方で、**選択されたすべての生き物（${names}）について必ず言及し、それぞれの関係性・つながりを説明してください**。どれか1匹でも説明から絶対に漏らさないようにしてください。
   - 例：ジンベエザメ、コバンザメ、プランクトンが選ばれた場合、コバンザメとジンベエザメの共生関係だけでなく、ジンベエザメとプランクトンの捕食関係も含め、3匹が同じ海でどのように関わっているのかを漏れなく1つのつながりとして解説してください。

回答は以下のJSONフォーマットに厳密に従ってください。

{
  "type": "symbiosis" | "predation" | "protection" | "commensalism" | "neutral" | "incompatible",
  "labelHiragana": "なかよし" | "もぐもぐ" | "まもられる" | "わいわい" | "あわない",
  "labelKanji": "関係性の名前（例: 相利共生（そうりきょうせい）、捕食（ほしょく）など。すべての漢字にrubyタグを適用してください）",
  "title": "こどもがワクワクする15文字以内のタイトル（すべての漢字にrubyタグを適用してください）",
  "explanation": "5歳児向けの100文字以内のひらがな中心のやさしい解説（すべての漢字にrubyタグを適用してください）",
  "scientificFact": "親向けの科学的な根拠に基づく詳しい解説（すべての漢字にrubyタグを適用してください）",
  "question": "親子の会話を促す問いかけ（ひらがな中心。すべての漢字にrubyタグを適用してください）",
  "animationType": "アニメーションの指示タグ（登場するすべての生き物が関わる様子を英単語やアンダースコアで表現、例: 'clownfish_anemone_crab' や 'neutral_swim_three_creatures' など）"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING },
            labelHiragana: { type: Type.STRING },
            labelKanji: { type: Type.STRING },
            title: { type: Type.STRING },
            explanation: { type: Type.STRING },
            scientificFact: { type: Type.STRING },
            question: { type: Type.STRING },
            animationType: { type: Type.STRING },
          },
          required: ["type", "labelHiragana", "labelKanji", "title", "explanation", "scientificFact", "question", "animationType"],
        },
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      return res.json(data);
    } else {
      throw new Error("Empty response from Gemini");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Geminiでの解析に失敗したよ。でも大丈夫、ローカル図鑑で解説するね！" });
  }
});

// Vite middleware and static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
