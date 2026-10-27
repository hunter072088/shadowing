/**
 * EchoShadow 1314 - Curated English Podcast 1314 Phrases & Vocabulary Database
 * High-frequency real-world American spoken English phrases and idioms.
 */

const PODCAST_1314_PHRASES = [
  {
    id: "p1",
    text: "call it a day",
    translation: "今天就到此為止吧 / 收工了",
    category: "職場與工作",
    level: "A2",
    tags: ["高頻必學", "Podcast熱門", "工作收尾"],
    explanation: "「English Podcast 1314」最經典的下班用語！當你和同事或朋友已經努力了一整天，覺得進度差不多了，想要結束工作回家休息時，就會說這句話。口氣輕鬆且非常自然。",
    pronunciation: "連音技巧：call it 連讀為 /kɔː-lɪt/，最後的 a day 輕快帶過。",
    sentence: "We've accomplished a lot today. Let's call it a day and grab some dinner.",
    sentence_translation: "我們今天完成了不少事情。今天就先收工，一起去吃晚餐吧！",
    dialogue: [
      { speaker: "A", line: "We've been staring at this spreadsheet for four hours straight.", translation: "我們已經盯著這個報表整整四個小時了。" },
      { speaker: "B", line: "Yeah, my brain is completely fried. Let's call it a day.", translation: "真的，我的腦袋已經完全燒焦了。今天就收工吧！" }
    ],
    shadowing_tips: "重音落在「day」上，語調在句末溫和下沉，傳達放鬆收尾的感覺。"
  },
  {
    id: "p2",
    text: "hit the nail on the head",
    translation: "一針見血 / 說得完全正確",
    category: "朋友社交",
    level: "B1",
    tags: ["成語", "表達贊同", "讚美"],
    explanation: "字面意思是「把釘子敲得正中靶心」，在口語中用來誇獎對方的分析精闢、完全說中核心要點。在 Podcast 中常用於主持人強烈認同來賓的論點時。",
    pronunciation: "注意 nail on 連讀成 /neɪ-lɒn/，head 短促有力。",
    sentence: "You hit the nail on the head when you mentioned team communication is our biggest hurdle.",
    sentence_translation: "當你提到團隊溝通是我們最大的瓶頸時，你完全說中要害了。",
    dialogue: [
      { speaker: "A", line: "I think people buy this product not for its features, but for the lifestyle it represents.", translation: "我覺得大家買這個產品不是為了功能，而是為了它所代表的生活風格。" },
      { speaker: "B", line: "Exactly! You hit the nail on the head.", translation: "沒錯！你真是一針見血。" }
    ],
    shadowing_tips: "「hit」和「head」是主要重音，中間的 the nail on the 節奏要輕盈快速。"
  },
  {
    id: "p3",
    text: "cut corners",
    translation: "抄捷徑 / 偷工減料 / 圖省事",
    category: "職場與工作",
    level: "B1",
    tags: ["工作態度", "警示", "慣用語"],
    explanation: "指為了省錢或省時間而採取投機取巧的方法，通常帶有負面後果。Podcast 談到品質堅持或創業教訓時經常出現。",
    pronunciation: "cut 的 /t/ 音在 corners 前常做停頓（Glottal stop），聽起來更道地。",
    sentence: "If you cut corners on product safety, you will definitely pay the price later.",
    sentence_translation: "如果你在產品安全上偷工減料，日後一定會付出代價。",
    dialogue: [
      { speaker: "A", line: "Can we skip the final QA testing stage to launch ahead of schedule?", translation: "我們可以跳過最後的品管測試階段，好提前上線嗎？" },
      { speaker: "B", line: "No way. Cutting corners will only lead to major customer complaints.", translation: "門都沒有。偷工減料只會招來客戶的大量投訴。" }
    ],
    shadowing_tips: "「corners」第一音節強烈重音，尾音 /z/ 微微帶出。"
  },
  {
    id: "p4",
    text: "under the weather",
    translation: "身體微恙 / 不太舒服 / 提不起勁",
    category: "情緒與感覺",
    level: "A2",
    tags: ["日常健康", "社交問候", "請假理由"],
    explanation: "不是生大病住院，而是類似輕微感冒、頭痛或宿醉那種「身體懨懨的、不在最佳狀態」。非常溫和且禮貌的表達方式。",
    pronunciation: "the weather 中的 /ð/ 咬舌輕輕拂過即可，不要刻意用力。",
    sentence: "I'm feeling a bit under the weather today, so I think I'll skip the party.",
    sentence_translation: "我今天身體有點不太舒服，所以我想我會缺席聚會。",
    dialogue: [
      { speaker: "A", line: "You look a little pale this morning. Everything okay?", translation: "你今天早上看起來有點臉色蒼白，還好嗎？" },
      { speaker: "B", line: "Just feeling a bit under the weather. A hot tea should fix me up.", translation: "只是有點不太舒服。一杯熱茶應該就能讓我恢復活力。" }
    ],
    shadowing_tips: "「under」和「weather」形成一高一低的旋律感，聽起來充滿柔和的日常口語感。"
  },
  {
    id: "p5",
    text: "it slipped my mind",
    translation: "我一時想不起來 / 我完全忘了",
    category: "日常生活",
    level: "A2",
    tags: ["道歉", "記憶力", "高頻必備"],
    explanation: "比起生硬的「I forgot」，母語人士更喜歡用這句表達「哎呀，事情從我腦子裡溜走了」。給人的感覺是無心之過，非常自然。",
    pronunciation: "slipped 的 /t/ 音自然融入 my，唸成 /slɪp-maɪ/。",
    sentence: "I promised to buy some milk on my way home, but it completely slipped my mind.",
    sentence_translation: "我答應回家路上買牛奶的，但我完全忘得一乾二淨了。",
    dialogue: [
      { speaker: "A", line: "Did you send the updated invoice to Marcus?", translation: "你把更新後的發票寄給馬克思了嗎？" },
      { speaker: "B", line: "Oh shoot, it completely slipped my mind! Doing it right this second.", translation: "哎呀糟糕，我完全忘了！我現在立刻用。" }
    ],
    shadowing_tips: "「slipped」與「mind」是重讀字，說的時候可以帶一點抱歉的生動語氣。"
  },
  {
    id: "p6",
    text: "play it by ear",
    translation: "見機行事 / 看情況再說 / 不預設立場",
    category: "日常生活",
    level: "B1",
    tags: ["聚會相約", "彈性安排", "Podcast愛用"],
    explanation: "源自不看樂譜、單憑聽力彈琴的音樂人。在日常生活中，指沒有嚴格行程計畫，到時候看當下氣氛、天氣或狀態再來決定。",
    pronunciation: "play it 連讀為 /pleɪ-jɪt/，by ear 連讀為 /baɪ-jɪər/。",
    sentence: "We don't know when the meeting will wrap up, so let's just play it by ear tonight.",
    sentence_translation: "我們不知道會議幾點會結束，所以今晚我們就看情況再說吧。",
    dialogue: [
      { speaker: "A", line: "Should we book the outdoor patio for lunch tomorrow?", translation: "我們要預訂明天戶外露台吃午餐嗎？" },
      { speaker: "B", line: "The forecast says it might rain. Let's just play it by ear.", translation: "天氣預報說可能會下雨。我們明天看情況再說吧。" }
    ],
    shadowing_tips: "整個短語節奏很流暢，不要在 it 或 by 中間斷開。"
  },
  {
    id: "p7",
    text: "sleep on it",
    translation: "考慮一晚 / 明天再做決定",
    category: "日常生活",
    level: "A2",
    tags: ["深思熟慮", "建議", "生活智慧"],
    explanation: "面對重大採購、工作轉換或複雜合約時，先不要衝動做決定，睡一覺讓頭腦清醒再來思考。1314 Podcast 的心理與生活主題常談到此句。",
    pronunciation: "sleep on it 三個字連成一氣：/sliː-pɒ-nɪt/。",
    sentence: "Don't make any rash choices tonight. Sleep on it and give me your answer tomorrow.",
    sentence_translation: "今晚別做任何衝動的選擇。好好睡一覺想清楚，明天再給我答覆。",
    dialogue: [
      { speaker: "A", line: "The dealership offered me a huge discount if I sign the contract right now.", translation: "車行說如果我現在馬上簽約，就給我超大折扣。" },
      { speaker: "B", line: "Don't fall for high-pressure sales tactics. Sleep on it first.", translation: "別中強迫推銷的計。先考慮一晚再說。" }
    ],
    shadowing_tips: "「Sleep」要長音 /sliːp/，後面 on it 輕輕滑過去。"
  },
  {
    id: "p8",
    text: "ring a bell",
    translation: "聽起來有點耳熟 / 勾起些許記憶",
    category: "朋友社交",
    level: "B1",
    tags: ["回憶", "熟識度", "聊天日常"],
    explanation: "某個名字、旋律或地點讓你覺得彷彿在哪聽過，但又不能100%確定。口語常用在問句：Does that ring a bell?（你有印象嗎？）",
    pronunciation: "ring a 連讀 /rɪŋ-ə/，bell 舌尖頂在上齒齦發出清晰的 dark L 音。",
    sentence: "Her name rings a bell, but I honestly can't remember where we met before.",
    sentence_translation: "她的名字聽起來挺耳熟的，但我實在記不起我們之前在哪裡見過。",
    dialogue: [
      { speaker: "A", line: "Have you ever heard of a podcast called 'English 1314'?", translation: "你有聽過一個叫做 'English 1314' 的 Podcast 嗎？" },
      { speaker: "B", line: "Yeah, that definitely rings a bell! My friends recommend it all the time.", translation: "有耶，我絕對有印象！我朋友常常跟我推薦。" }
    ],
    shadowing_tips: "「bell」的結尾音要飽滿，問句時語調要微微上揚。"
  },
  {
    id: "p9",
    text: "bite the bullet",
    translation: "咬緊牙關 / 硬著頭皮去面對",
    category: "情緒與感覺",
    level: "B2",
    tags: ["勇氣", "困難抉擇", "Podcast金句"],
    explanation: "以前戰場沒有麻醉藥，傷兵必須咬著子彈忍受手術。現在用來形容終於下定決心去面對一件痛苦但不可避免的事情。",
    pronunciation: "bite the bullet 重音在 bite 和 bullet 的首音節。",
    sentence: "I hated going to the dentist, but I had to bite the bullet and get my tooth pulled.",
    sentence_translation: "我討厭看牙醫，但我不得不咬緊牙關把那顆蛀牙拔掉。",
    dialogue: [
      { speaker: "A", line: "You've been putting off that uncomfortable conversation with your landlord for weeks.", translation: "你已經拖延跟房東攤牌好幾個星期了。" },
      { speaker: "B", line: "I know. It's time to bite the bullet and get it over with.", translation: "我知道。是時候硬著頭皮把這件事解決掉了。" }
    ],
    shadowing_tips: "「bite」要有決心感的爆破音，傳達出毅然決然的心情。"
  },
  {
    id: "p10",
    text: "no biggie",
    translation: "沒什麼大不了 / 小事一樁 / 不用客氣",
    category: "朋友社交",
    level: "A2",
    tags: ["口語短語", "輕鬆隨和", "超高頻"],
    explanation: "「no big deal」極為常見的口語簡化版本！好朋友之間彼此幫忙、道歉或道謝時，說這句顯得非常親切友善。",
    pronunciation: "biggie 發音為 /ˈbɪɡ.i/，尾音輕快上翹。",
    sentence: "Thanks a ton for covering my shift yesterday! — No biggie, happy to help anytime.",
    sentence_translation: "昨天超感謝你幫我代班！—— 小事一樁，隨時樂意幫忙！",
    dialogue: [
      { speaker: "A", line: "I'm so sorry I accidentally spilled a drop of coffee on your notebook!", translation: "超抱歉，我不小心滴了一滴咖啡在你的筆記本上！" },
      { speaker: "B", line: "No biggie at all, it's just rough notes anyway.", translation: "完全沒關係啦，反正這只是隨手草稿而已。" }
    ],
    shadowing_tips: "說這句話時臉上帶點微笑，語音清脆俐落。"
  },
  {
    id: "p11",
    text: "touch base",
    translation: "聯繫一下 / 打個招呼核對進度",
    category: "職場與工作",
    level: "B1",
    tags: ["商務溝通", "定期跟進", "職場必備"],
    explanation: "源自棒球術語，在現代商務與 Podcast 職場主題中，指快速簡短地聯絡一下，確保大家都在同一個步調上。",
    pronunciation: "touch 的 /tʃ/ 和 base 的 /b/ 銜接乾脆，不要拖泥帶水。",
    sentence: "Let's touch base next Monday morning to confirm the final marketing numbers.",
    sentence_translation: "我們下週一早上聯繫一下，確認最終的行銷數據。",
    dialogue: [
      { speaker: "A", line: "I just sent over the draft for the new campaign.", translation: "我剛剛把新活動的初稿寄過去了。" },
      { speaker: "B", line: "Awesome. I'll review it and touch base with you after lunch.", translation: "太棒了。我讀一下，午餐後再跟您聯繫碰個頭。" }
    ],
    shadowing_tips: "商業場合中非常俐落自信的短語，跟讀時注意平穩成熟的語氣。"
  },
  {
    id: "p12",
    text: "hit the spot",
    translation: "正合心意 / 太過癮了 / 完全滿足渴望",
    category: "日常生活",
    level: "A2",
    tags: ["美食分享", "滿意度", "日常生活"],
    explanation: "特別常用在享用美食或清涼飲品後，那種「剛好滿足了我身體與靈魂的渴望」的滿足讚嘆！",
    pronunciation: "hit the 連讀，spot 結尾的 /t/ 做不完全爆破，清脆收尾。",
    sentence: "After that five-mile hike in the sun, an iced lemonade really hit the spot.",
    sentence_translation: "在大太陽下徒步健行五英里後，一杯冰檸檬水真是太過癮了！",
    dialogue: [
      { speaker: "A", line: "How's the steaming hot ramen on this freezing night?", translation: "在這個寒冷的夜晚吃熱騰騰的拉麵感覺如何？" },
      { speaker: "B", line: "Oh man, it completely hits the spot. Best comfort food ever.", translation: "喔天啊，簡直太過癮了。最棒的療癒美食。" }
    ],
    shadowing_tips: "可以帶著享受、滿足的語調發音，讓口語更生動自然。"
  },
  {
    id: "p13",
    text: "on the fence",
    translation: "猶豫不決 / 還在觀望中",
    category: "情緒與感覺",
    level: "B1",
    tags: ["做決定", "中立", "日常糾結"],
    explanation: "想像一個人坐在圍欄上，不知道要跳到左邊還是右邊。形容自己還沒打定主意，持保留態度。",
    pronunciation: "on the fence 中的 fence 發音為 /fens/，氣流摩擦聲飽滿。",
    sentence: "I'm still on the fence about whether to take the promotion or stay in my current role.",
    sentence_translation: "對於是要接受升遷還是留在現有職位，我現在依然猶豫不決。",
    dialogue: [
      { speaker: "A", line: "Have you decided if you're coming to the ski trip this weekend?", translation: "你決定好這週末要不要去滑雪了嗎？" },
      { speaker: "B", line: "I'm still on the fence. Tickets are pricey and my budget is tight.", translation: "我還在猶豫。票價有點貴，我預算吃緊。" }
    ],
    shadowing_tips: "「fence」重讀，語調略帶思索猶豫的拉長音。"
  },
  {
    id: "p14",
    text: "cut someone some slack",
    translation: "放某人一馬 / 別對某人太苛求",
    category: "朋友社交",
    level: "B1",
    tags: ["同理心", "人際相處", "緩解衝突"],
    explanation: "原意是把繩子放鬆一點。在對話中呼籲大家給犯錯的人一點寬容空間，別抓著小毛病不放。",
    pronunciation: "slack 結尾是結實的 /k/ 音。",
    sentence: "He just started this job three days ago; please cut him some slack!",
    sentence_translation: "他三天前才剛開始這份工作，拜託對他寬容一點吧！",
    dialogue: [
      { speaker: "A", line: "Alex made another small typo in the email announcement.", translation: "艾力克斯在全體郵件公告裡又打錯了一個字。" },
      { speaker: "B", line: "Come on, cut him some slack. He worked overtime until midnight yesterday.", translation: "別這樣，放他一馬吧。他昨天加班到半夜耶。" }
    ],
    shadowing_tips: "說「cut him some slack」時通常帶有勸解、同情的語氣。"
  },
  {
    id: "p15",
    text: "off the top of my head",
    translation: "憑現在的記憶 / 不假思索地 / 粗略估計",
    category: "職場與工作",
    level: "B1",
    tags: ["直覺回答", "會議即興", "母語常用"],
    explanation: "當別人突然向你詢問數據或資訊，你手邊沒有文件查證，純憑大腦當下的直覺印象回答時必備的開場白。",
    pronunciation: "連讀：off the top of my head 中的 top of 連成 /tɒ-pəv/。",
    sentence: "Off the top of my head, I'd say the remodel will cost around five thousand dollars.",
    sentence_translation: "憑我現在的記憶粗略估計，這項重新裝潢大約要花五千美元。",
    dialogue: [
      { speaker: "A", line: "Do you know how many active users we gained this month?", translation: "你知道我們這個月增加了多少活躍用戶嗎？" },
      { speaker: "B", line: "Off the top of my head, around three thousand, but I'll double check the dashboard.", translation: "憑記憶大概是三千人左右，不過我等下會再看後台確認一次。" }
    ],
    shadowing_tips: "注意節奏快而自然，傳達出「我隨口說個大致數字」的從容感。"
  },
  {
    id: "p16",
    text: "catch someone's drift",
    translation: "理解某人的言下之意 / 懂對方的意思",
    category: "朋友社交",
    level: "B2",
    tags: ["默契", "非語言溝通", "言外之意"],
    explanation: "很多時候說話不方便說得太直白，點到為止時就會問對方：「Catch my drift?」（你懂我的意思吧？）。",
    pronunciation: "drift 的 /ft/ 要咬清楚。",
    sentence: "I won't say it directly in the meeting, but if you catch my drift, we should prepare a backup plan.",
    sentence_translation: "我不會在會議上把話挑明，但如果你懂我的意思，我們應該準備好備案。",
    dialogue: [
      { speaker: "A", line: "The client kept complimenting our competitor's speed during the lunch.", translation: "客戶在午餐時一直稱讚我們競爭對手的效率。" },
      { speaker: "B", line: "Yeah, I catch their drift. We really need to speed up our delivery.", translation: "嗯，我懂他們的言下之意。我們確實該加快交付速度了。" }
    ],
    shadowing_tips: "常用在低調或有默契的場合，語氣可以神祕或默契十足。"
  },
  {
    id: "p17",
    text: "pull an all-nighter",
    translation: "熬整夜（讀書、加班趕專案）",
    category: "日常生活",
    level: "A2",
    tags: ["熬夜", "學生日常", "加班"],
    explanation: "指整晚不睡覺持續工作或念書。在校園生活或科技公司創業故事中頻率極高的口語！",
    pronunciation: "all-nighter 重音在 nighter 的第一音節 /ˈɔːlˌnaɪ.tər/。",
    sentence: "I had to pull an all-nighter to finish coding before the hackathon deadline.",
    sentence_translation: "我必須通宵熬夜寫代碼，趕在黑客松截止前完成。",
    dialogue: [
      { speaker: "A", line: "You have dark circles under your eyes. Did you sleep at all?", translation: "你黑眼圈好重喔。你昨晚有睡覺嗎？" },
      { speaker: "B", line: "Nope, pulled an all-nighter cramming for the chemistry final.", translation: "完全沒有，熬了一整夜抱佛腳準備化學期末考。" }
    ],
    shadowing_tips: "「all-nighter」連貫有力，跟讀時表現出疲憊但又不得不撐下去的情緒。"
  },
  {
    id: "p18",
    text: "take it with a grain of salt",
    translation: "持保留態度 / 半信半疑 / 別全信",
    category: "日常生活",
    level: "B1",
    tags: ["批判思考", "網路假訊息", "生活提醒"],
    explanation: "古人吃藥或有毒物品時加鹽來解毒。在口語中代表聽別人的八卦或網路消息時，不要全部當成真理，要保持懷疑精神。",
    pronunciation: "grain of salt 連讀為 /ɡreɪ-nəv-sɔːlt/。",
    sentence: "Whatever gossip you read on celebrity tabloids, take it with a grain of salt.",
    sentence_translation: "你在八卦小報上看到的任何傳聞，都請半信半疑、別全信。",
    dialogue: [
      { speaker: "A", line: "This anonymous forum post says the company is being sold next month!", translation: "這個匿名論壇貼文說公司下個月要被賣掉了！" },
      { speaker: "B", line: "Take that with a grain of salt; rumors like that surface every single year.", translation: "半信半疑就好啦；這種謠言每年都會冒出來一次。" }
    ],
    shadowing_tips: "「salt」發音拉長且清晰，提醒聽者要謹慎思考。"
  },
  {
    id: "p19",
    text: "cross that bridge when we come to it",
    translation: "到時候再說 / 船到橋頭自然直",
    category: "日常生活",
    level: "B1",
    tags: ["放鬆心情", "別過度焦慮", "金句"],
    explanation: "安慰朋友不要為還沒發生的潛在問題過度焦慮憂慮。事情遇到了自然有辦法解決。",
    pronunciation: "bridge 的 /dʒ/ 與 when 平滑過渡。",
    sentence: "What if it rains during the wedding? — Don't worry right now; we'll cross that bridge when we come to it.",
    sentence_translation: "萬一婚禮當天下雨怎麼辦？—— 現在先別煩惱，到時候再說吧！",
    dialogue: [
      { speaker: "A", line: "What if our flight gets delayed and we miss the connecting train in Tokyo?", translation: "萬一我們的班機延誤，錯過了東京的接駁火車怎麼辦？" },
      { speaker: "B", line: "Let's cross that bridge when we come to it. First, let's enjoy our flight!", translation: "船到橋頭自然直，到時候看情況應變。我們先好好享受飛行吧！" }
    ],
    shadowing_tips: "這是一句很撫慰人心的表達，跟讀時語調要平穩寬心。"
  },
  {
    id: "p20",
    text: "see eye to eye",
    translation: "意見一致 / 看法完全相同",
    category: "職場與工作",
    level: "B1",
    tags: ["價值觀", "團隊合作", "共識"],
    explanation: "指兩個人在觀念、策略或價值觀上具有高度共識。否定句「don't see eye to eye」也非常高頻。",
    pronunciation: "see eye 連讀成 /siː-jaɪ/，eye to eye 連讀成 /aɪ-tə-waɪ/。",
    sentence: "My business partner and I rarely see eye to eye on social media strategy.",
    sentence_translation: "我和我的創業合夥人在社群媒體策略上很少能達成共識。",
    dialogue: [
      { speaker: "A", line: "Did you and the landlord reach an agreement on the lease renewal?", translation: "你和房東在續租合約上有達成共識嗎？" },
      { speaker: "B", line: "Unfortunately not. We just don't see eye to eye on the monthly rent hike.", translation: "很遺憾沒有。我們在每月租金調漲上完全各執己見。" }
    ],
    shadowing_tips: "練習 eye to eye 的連音，嘴型流暢轉換。"
  },
  {
    id: "p21",
    text: "back to square one",
    translation: "回到原點 / 重新開始",
    category: "職場與工作",
    level: "B1",
    tags: ["砍掉重練", "挫折應對", "專案進度"],
    explanation: "源自早期棋盤遊戲踩到陷阱必須回到第一格。當計畫失敗、檔案遺失或客戶全盤否定時，必須重新開始。",
    pronunciation: "square one 重音在 square 和 one。",
    sentence: "The hard drive crashed without a backup, so our whole animation project is back to square one.",
    sentence_translation: "硬碟在沒有備份的情況下崩潰了，所以我們整個動畫專案又回到了原點。",
    dialogue: [
      { speaker: "A", line: "The investor backed out at the last minute because of market volatility.", translation: "投資人在最後一刻因為市場波動撤資了。" },
      { speaker: "B", line: "Well, looks like we're back to square one. Let's find new pitch partners tomorrow.", translation: "好吧，看來我們回到起點了。明天開始找新的提案合作夥伴吧。" }
    ],
    shadowing_tips: "帶點無奈但重新振作的語調，one 字結尾微落。"
  },
  {
    id: "p22",
    text: "beat around the bush",
    translation: "拐彎抹角 / 說話不著邊際",
    category: "朋友社交",
    level: "B1",
    tags: ["直言不諱", "溝通習慣", "衝突反擊"],
    explanation: "源自古代打獵時獵人敲打灌木叢周圍試探獵物。在口語中用來要求對方直接說重點，不要兜圈子。",
    pronunciation: "bush 發音為 /bʊʃ/，不是 /bʌʃ/。",
    sentence: "Stop beating around the bush and tell me straight up: did I get the job or not?",
    sentence_translation: "別再拐彎抹角了，直接告訴我吧：我到底有沒有拿到這份工作？",
    dialogue: [
      { speaker: "A", line: "Well, we really value your enthusiasm, and the market is shifting...", translation: "嗯…我們非常看重你的熱忱，而且市場目前正在轉變中…" },
      { speaker: "B", line: "Please don't beat around the bush. Just give me the honest feedback.", translation: "請不要拐彎抹角。直接給我最真實的反饋就好。" }
    ],
    shadowing_tips: "「Stop beating around the bush!」可以練習強烈而堅決的口氣。"
  },
  {
    id: "p23",
    text: "hang in there",
    translation: "堅持下去 / 撐住 / 加油",
    category: "情緒與感覺",
    level: "A2",
    tags: ["鼓勵安慰", "暖心話語", "超高頻"],
    explanation: "當朋友面臨失戀、工作高壓、考試挫折時，最道地也最溫暖的打氣用語。比乾巴巴的「Fight!」好上一萬倍。",
    pronunciation: "hang in there 連讀：/hæŋ-ɪn-ðeər/。",
    sentence: "I know final exam week is brutal, but just hang in there! Summer break is almost here.",
    sentence_translation: "我知道期末考週很折磨人，但一定要撐下去！暑假馬上就要到了。",
    dialogue: [
      { speaker: "A", line: "I've been job hunting for six straight months and still getting rejection emails.", translation: "我已經連續找了六個月的工作，卻依然一直在收感謝信。" },
      { speaker: "B", line: "Hang in there, buddy. The right door will open sooner than you think.", translation: "撐下去，兄弟。屬於你的機會一定會比你想像中更快到來。" }
    ],
    shadowing_tips: "語調溫暖、堅定，充滿支持的力量。"
  },
  {
    id: "p24",
    text: "go the extra mile",
    translation: "加倍努力 / 付出額外的心血",
    category: "職場與工作",
    level: "B1",
    tags: ["工作態度", "卓越追求", "讚揚"],
    explanation: "指做的事情超過了別人的期望或合約要求，主動多做一點以達到驚艷的效果。Podcast 討論職涯晉升或優質服務時極常提到。",
    pronunciation: "extra mile 重音落在 ex 和 mile。",
    sentence: "Our hotel concierge always goes the extra mile to make every guest feel like royalty.",
    sentence_translation: "我們飯店的禮賓人員總是加倍用心，讓每一位房客都有賓至如歸的尊榮感受。",
    dialogue: [
      { speaker: "A", line: "Why did your team win the client's annual partner award?", translation: "為什麼你們團隊能拿下客戶的年度最佳合作夥伴獎？" },
      { speaker: "B", line: "Because whenever an emergency cropped up, we always went the extra mile to resolve it.", translation: "因為每當出現突發狀況時，我們總是全力以赴多做一步去解決它。" }
    ],
    shadowing_tips: "「extra」和「mile」要唸得清晰有精神。"
  },
  {
    id: "p25",
    text: "it's a long shot",
    translation: "機會渺茫 / 希望不大但值得一試",
    category: "日常生活",
    level: "B1",
    tags: ["冒險精神", "機率", "嘗試"],
    explanation: "源自遠距離射擊很難命中靶心。形容一件事成功的機率雖然偏低，但如果不試試看就連一絲機會都沒有。",
    pronunciation: "long shot 中間有短暫的停頓，shot 結尾 /t/ 清晰。",
    sentence: "Applying for that prestigious fellowship is a long shot, but I'm submitting my portfolio anyway.",
    sentence_translation: "申請那個頂尖的獎學金雖然希望渺茫，但我無論如何都要提交我的作品集。",
    dialogue: [
      { speaker: "A", line: "The concert is completely sold out tonight. Do you think we can find spare tickets outside?", translation: "今晚演唱會門票全部售罄了。你覺得我們在場外能找到多餘的票嗎？" },
      { speaker: "B", line: "It's a long shot, but it doesn't hurt to drive over and check.", translation: "機會很渺茫，但開車過去看看也沒什麼壞處。" }
    ],
    shadowing_tips: "說「long shot」時可以帶著一種淡定、願意放手一搏的心情。"
  },
  {
    id: "p26",
    text: "hit the sack",
    translation: "去睡覺 / 上床休息",
    category: "日常生活",
    level: "A2",
    tags: ["就寢", "晚安口語", "口語俗稱"],
    explanation: "以前的水手把裝滿乾草的粗布袋當作床墊（sack）。現在是美式口語中非常流行的「睡覺」說法，同義於 hit the hay。",
    pronunciation: "sack 發音是 /sæk/，嘴巴張大。",
    sentence: "It's already past midnight and my eyes are burning; time to hit the sack.",
    sentence_translation: "已經過半夜了，我的眼睛酸澀得不行；該上床睡覺了。",
    dialogue: [
      { speaker: "A", line: "Hey, do you want to play one more multiplayer round?", translation: "嘿，你想要再連線打一局嗎？" },
      { speaker: "B", line: "I wish I could, but I have a 7 AM flight. I've gotta hit the sack.", translation: "我也很想，但我早上七點有飛機。我得去睡了。" }
    ],
    shadowing_tips: "語調輕鬆自然的下沉，傳達出困倦想要立刻躺下的感覺。"
  },
  {
    id: "p27",
    text: "in a nutshell",
    translation: "簡而言之 / 概括來說 / 一句話總結",
    category: "日常生活",
    level: "B1",
    tags: ["總結", "精簡表達", "演講口才"],
    explanation: "小小的堅果殼（nutshell）裝不下很多東西，因此表示「用最簡短的幾句話把核心思想說清楚」。",
    pronunciation: "nutshell 重音在 nut，唸作 /ˈnʌt.ʃel/。",
    sentence: "In a nutshell, our startup helps local artisans sell handmade goods globally.",
    sentence_translation: "一句話總結，我們這家新創公司就是幫助在地手藝人將手作商品賣向全球。",
    dialogue: [
      { speaker: "A", line: "Can you explain this 50-page financial report before the board walks in?", translation: "在董事會走進來之前，你能用幾句話解釋這份50頁的財務報告嗎？" },
      { speaker: "B", line: "In a nutshell: revenue is soaring, but shipping expenses are eating our profit margin.", translation: "簡而言之：營收在飆升，但運費正在吞噬我們的利潤率。" }
    ],
    shadowing_tips: "經常用作句首轉換詞，唸完後稍作停頓再帶出重點。"
  },
  {
    id: "p28",
    text: "speak of the devil",
    translation: "說曹操，曹操到",
    category: "朋友社交",
    level: "A2",
    tags: ["巧合", "社交打趣", "超生動"],
    explanation: "完整諺語是「Speak of the devil and he doth appear」。當你正在跟朋友聊到某個人，而那個人剛好下一秒就走進門或打電話來時使用。",
    pronunciation: "devil 唸 /ˈdev.əl/，重音在前面。",
    sentence: "Speak of the devil! We were literally just admiring photos of your new studio.",
    sentence_translation: "說曹操曹操到！我們剛剛才正在欣賞你新工作室的照片呢！",
    dialogue: [
      { speaker: "A", line: "I wonder if Sarah has arrived back from her vacation in Spain yet.", translation: "我想知道莎拉從西班牙度假回來了沒有。" },
      { speaker: "B", line: "Speak of the devil! She just walked through the front doors right now.", translation: "說曹操曹操到！她現在剛好走進大門了。" }
    ],
    shadowing_tips: "帶有驚喜和巧合的歡快語調，句尾驚嘆上揚。"
  },
  {
    id: "p29",
    text: "cost an arm and a leg",
    translation: "代價極高 / 貴得離譜 / 貴得嚇死人",
    category: "日常生活",
    level: "B1",
    tags: ["消費抱怨", "物價", "誇張生動"],
    explanation: "用「一條手臂加一條腿」來誇飾某個東西貴到像要賣器官一樣。口語比單純說「very expensive」生動數十倍。",
    pronunciation: "arm and a leg 連讀為 /ɑː-mən-də-leɡ/。",
    sentence: "The new flagship smartphone looks gorgeous, but it costs an arm and a leg.",
    sentence_translation: "那款新旗艦智慧型手機看起來超炫，但真的是貴得離譜。",
    dialogue: [
      { speaker: "A", line: "Did you manage to get front-row tickets to Taylor Swift's tour?", translation: "你有搶到泰勒絲巡迴演唱會的第一排門票嗎？" },
      { speaker: "B", line: "Are you kidding? Those resale tickets cost an arm and a leg!", translation: "你開玩笑嗎？那些黃牛票貴得嚇死人！" }
    ],
    shadowing_tips: "「arm」和「leg」都可以加重語氣，表現出對天價的驚訝與震撼。"
  },
  {
    id: "p30",
    text: "rule of thumb",
    translation: "經驗法則 / 慣用準則 / 不成文規定",
    category: "日常生活",
    level: "B1",
    tags: ["實用建議", "生活技巧", "日常經驗"],
    explanation: "指雖然不是法律或嚴格科學公式，但歷經大家實踐驗證證明非常管用的大致標準。",
    pronunciation: "thumb 的結尾 /b/ 不發音，結尾是 /θʌm/。",
    sentence: "As a general rule of thumb, you should drink at least two liters of water daily.",
    sentence_translation: "作為一個大致的經驗法則，你每天至少應該喝兩公升的水。",
    dialogue: [
      { speaker: "A", line: "How much tip should I leave at a sit-down diner in the US?", translation: "在美國的正式餐廳用餐我該留多少小費？" },
      { speaker: "B", line: "A good rule of thumb is between fifteen and twenty percent of the total bill.", translation: "一個好用的經驗法則是總帳單的百分之十五到二十之間。" }
    ],
    shadowing_tips: "「thumb」音要咬準，跟讀時表現出傳授經驗的從容自信。"
  }
];

// Curated high-frequency vocabulary with everyday simple sentences (User requirement: 簡單造句)
const COMMON_WORDS_DB = [
  {
    word: "procrastinate",
    pos: "v. 動詞",
    phonetic: "/prəˈkræs.tə.neɪt/",
    translation: "拖延、拖拖拉拉",
    sentence: "Don't procrastinate on your homework.",
    sentence_translation: "功課不要拖拖拉拉。",
    alternative_sentence: "I always procrastinate when I feel stressed.",
    alternative_translation: "當我壓力大時，我總是習慣拖延。",
    shadowing_tips: "重音在第二音節 cras，練習把音節連貫讀出。"
  },
  {
    word: "overwhelmed",
    pos: "adj. 形容詞",
    phonetic: "/ˌoʊ.vɚˈwelmd/",
    translation: "不知所措的、負擔過重喘不過氣",
    sentence: "I feel overwhelmed by all this work.",
    sentence_translation: "面對所有這些工作，我覺得快喘不過氣了。",
    alternative_sentence: "Take a deep breath if you feel overwhelmed.",
    alternative_translation: "如果你感到負擔太重，就深呼吸一口氣。",
    shadowing_tips: "重音在 whelmed，尾音 /md/ 輕收。"
  },
  {
    word: "awkward",
    pos: "adj. 形容詞",
    phonetic: "/ˈɑː.kwɚd/",
    translation: "尷尬的、彆扭的",
    sentence: "There was an awkward silence in the elevator.",
    sentence_translation: "電梯裡有一陣尷尬的沉默。",
    alternative_sentence: "I felt awkward asking for money.",
    alternative_translation: "開口借錢讓我感到很尷尬。",
    shadowing_tips: "注意 /ɔː/ 與 /w/ 的嘴唇圓滑收縮。"
  },
  {
    word: "spontaneous",
    pos: "adj. 形容詞",
    phonetic: "/spɑːnˈteɪ.ni.əs/",
    translation: "自發的、隨性的、心血來潮的",
    sentence: "We took a spontaneous road trip yesterday.",
    sentence_translation: "我們昨天來了一趟說走就走的公路旅行。",
    alternative_sentence: "She is a very fun and spontaneous person.",
    alternative_translation: "她是一個非常有趣且隨性的人。",
    shadowing_tips: "重音在 tei，音調高昂自然。"
  },
  {
    word: "exhausted",
    pos: "adj. 形容詞",
    phonetic: "/ɪɡˈzɑː.stɪd/",
    translation: "筋疲力盡的、累癱的",
    sentence: "I am completely exhausted after that run.",
    sentence_translation: "慢跑完之後，我整個人累癱了。",
    alternative_sentence: "She went straight to bed because she was exhausted.",
    alternative_translation: "她直接上床睡覺了，因為她實在太累了。",
    shadowing_tips: "ex 讀 /ɪɡz/，重音在 zɑː。"
  },
  {
    word: "hesitate",
    pos: "v. 動詞",
    phonetic: "/ˈhez.ə.teɪt/",
    translation: "猶豫、躊躇",
    sentence: "Don't hesitate to call if you need help.",
    sentence_translation: "需要幫忙的話，千萬別猶豫打給我。",
    alternative_sentence: "He hesitated for a second before answering.",
    alternative_translation: "他在回答之前猶豫了一秒鐘。",
    shadowing_tips: "重音在第一個音節 hez。"
  },
  {
    word: "chill",
    pos: "adj. / v.",
    phonetic: "/tʃɪl/",
    translation: "放鬆的、冷靜的、悠閒放空",
    sentence: "Let's just stay home and chill tonight.",
    sentence_translation: "今晚我們就待在家放鬆放空吧。",
    alternative_sentence: "My new roommate is super chill.",
    alternative_translation: "我的新室友非常隨和好相處。",
    shadowing_tips: "短元音 /ɪ/ 加舌尖捲音 L。"
  },
  {
    word: "reliable",
    pos: "adj. 形容詞",
    phonetic: "/rɪˈlaɪ.ə.bəl/",
    translation: "可靠的、值得信賴的",
    sentence: "He is a very reliable friend.",
    sentence_translation: "他是一個非常靠得住的朋友。",
    alternative_sentence: "This car is old but very reliable.",
    alternative_translation: "這輛車雖然舊，但非常可靠。",
    shadowing_tips: "重音在 li，結尾 ble 輕念。"
  },
  {
    word: "curious",
    pos: "adj. 形容詞",
    phonetic: "/ˈkjʊr.i.əs/",
    translation: "好奇的",
    sentence: "I am curious about what happened next.",
    sentence_translation: "我對接下來發生的事感到很好奇。",
    alternative_sentence: "Kids are always curious about everything.",
    alternative_translation: "小孩子總是對所有事情充滿好奇。",
    shadowing_tips: "重音在 cur，/kjʊr/ 滑向 /i/。"
  },
  {
    word: "grateful",
    pos: "adj. 形容詞",
    phonetic: "/ˈɡreɪt.fəl/",
    translation: "心懷感激的",
    sentence: "I am so grateful for your support.",
    sentence_translation: "我非常感激你的支持。",
    alternative_sentence: "She was grateful to have a warm meal.",
    alternative_translation: "她很感恩能吃到一頓熱呼呼的飯菜。",
    shadowing_tips: "great-ful，重音在前面的 great。"
  }
];

// Comprehensive Built-in High-Frequency English-to-Traditional Chinese Offline Dictionary
const BUILTIN_DICT = {
  // Common Spoken Phrases & Idioms
  "call it a day": "今天就到此為止吧 / 收工了",
  "hit the nail on the head": "一針見血 / 說得完全正確",
  "cut corners": "抄捷徑 / 偷工減料 / 圖省事",
  "under the weather": "身體微恙 / 不太舒服",
  "spill the beans": "洩漏秘密 / 說溜嘴",
  "bite the bullet": "咬緊牙關硬著頭皮做",
  "sleep on it": "考慮一晚 / 明天再決定",
  "see eye to eye": "看法一致 / 達成共識",
  "costs an arm and a leg": "價格昂貴 / 貴得離譜",
  "rule of thumb": "經驗法則 / 實用原則",
  "piece of cake": "小菜一碟 / 輕而易舉",
  "break a leg": "祝你好運 / 演出成功",
  "take it easy": "放輕鬆 / 別太緊張",
  "make sense": "有道理 / 說得通",
  "play it by ear": "見機行事 / 看情況再說",
  "burn the midnight oil": "開夜車 / 熬夜苦讀",
  "on the fence": "優柔寡斷 / 猶豫不決",
  "catch up": "敘舊 / 追趕進度",
  "look forward to": "期待 / 盼望",
  "hang out": "出去晃晃 / 聚聚消磨時間",
  "run out of": "用光 / 耗盡",
  "figure out": "搞清楚 / 想出辦法",
  "give up": "放棄 / 認輸",
  "show off": "炫耀 / 賣弄",
  "come across": "偶然遇見 / 碰巧發現",
  "keep in mind": "記在心上 / 牢記",
  "by the way": "順帶一提 / 話說回來",
  "out of the blue": "出乎意料 / 突然之間",
  "on the same page": "達成共識 / 步調一致",
  "in the long run": "長遠來看 / 終究",
  "so far so good": "到目前為止一切都好",
  "no big deal": "沒什麼大不了 / 小事一樁",
  "better late than never": "遲做總比不做強",
  "step by step": "按部就班 / 一步一步來",
  "sooner or later": "遲早 / 早晚",
  "from scratch": "從零開始 / 從頭白手起家",
  "keep your chin up": "不要氣餒 / 振作起來",
  "count on me": "包在我身上 / 儘管相信我",
  "take your time": "慢慢來 / 不著急",
  "never mind": "沒關係 / 別介意",
  "long time no see": "好久不見",
  "as a matter of fact": "事實上 / 說實在的",
  "at the end of the day": "歸根究底 / 說到底",
  "can i answer in a simple way": "我可以用簡單的方式回答嗎？",
  "how have you been": "你最近過得如何？",
  "what do you mean": "你的意思是什麼？",
  "i have no idea": "我完全沒有頭緒 / 我不知道",
  "it depends": "看情況而定",
  "sounds good": "聽起來很棒 / 好的",
  "no worries": "別擔心 / 沒問題",
  "you bet": "當然 / 一點也沒錯",

  // High Frequency Spoken Words
  "procrastinate": "拖延、拖拖拉拉",
  "overwhelmed": "不知所措的、負擔過重喘不過氣",
  "awkward": "尷尬的、彆扭的",
  "spontaneous": "隨性說走就走的、自發的",
  "exhausted": "筋疲力盡的、累癱的",
  "hesitate": "猶豫、躊躇",
  "chill": "放鬆的、悠閒放空",
  "reliable": "可靠的、值得信賴的",
  "curious": "好奇的",
  "grateful": "心懷感激的、感恩的",
  "ambitious": "有抱負的、雄心勃勃的",
  "generous": "慷慨大方的",
  "resilient": "有韌性的、堅韌適應力強的",
  "empathy": "同理心、感同身受",
  "mindset": "心態、思維模式",
  "vulnerable": "脆弱的、易受傷的",
  "authentic": "真實的、道地的",
  "inspire": "激勵、啟發靈感",
  "motivate": "激勵、促使行動",
  "focus": "專注、集中注意力",
  "effort": "努力、辛勞付出",
  "success": "成功、成就",
  "challenge": "挑戰、考驗",
  "improve": "改善、增進、提高",
  "develop": "發展、培養、拓展",
  "habit": "習慣、習性",
  "routine": "日常例行公事、固定常規",
  "experience": "經驗、體會",
  "frustrated": "感到挫折沮喪的",
  "confused": "困惑不解的",
  "excited": "興奮期待的",
  "nervous": "緊張不安的",
  "proud": "感到驕傲自豪的",
  "jealous": "嫉妒吃醋的",
  "lonely": "孤單寂寞的",
  "bored": "感到無聊厭倦的",
  "anxious": "焦慮擔憂的",
  "surprised": "驚訝詫異的",
  "satisfied": "感到滿意的",
  "disappointed": "感到失望的",
  "embarrassed": "難為情尷尬的",
  "relieved": "鬆了一口氣的、寬慰的",
  "furious": "怒不可遏的、盛怒的",
  "awesome": "棒極了、太厲害了",
  "terrific": "極好的、非常棒的",
  "horrible": "可怕的、糟糕透頂的",
  "wonderful": "美好的、精彩絕倫的",
  "definitely": "絕對地、毫無疑問地",
  "probably": "大概、很可能",
  "actually": "實際上、其實",
  "obviously": "顯然地、明顯地",
  "honestly": "老實說、誠實地",
  "eventually": "最終、到頭來",
  "suddenly": "突然之間",
  "immediately": "立刻、馬上",
  "especially": "特別是、尤其",
  "completely": "完全地、徹底地",
  "absolutely": "絕對如此、當然",
  "convenient": "方便便利的",
  "expensive": "昂貴的、花費高的",
  "affordable": "負擔得起的、平價的",
  "comfortable": "舒適自在的",
  "delicious": "美味可口的",
  "healthy": "健康的、有益健康的",
  "traditional": "傳統的",
  "modern": "現代的、新穎的",
  "unique": "獨一無二的、獨特的",
  "important": "重要的",
  "necessary": "必要的、必須的",
  "possible": "可能的",
  "impossible": "不可能的",
  "simple": "簡單純粹的",
  "difficult": "困難費力的",
  "flexible": "有彈性的、靈活的",
  "practical": "實用的、切合實際的",
  "responsible": "負責任的",
  "independent": "獨立自主的",
  "polite": "有禮貌的、客氣的",
  "rude": "粗魯無禮的",
  "brave": "勇敢堅強的",
  "honest": "誠實正直的",
  "friendly": "友善親切的",
  "calm": "平靜冷靜的",
  "gentle": "溫柔和藹的",
  "smart": "聰明伶俐的",
  "clever": "機靈聰穎的",
  "wise": "明智有智慧的",
  "strong": "堅強強壯的",
  "weak": "虛弱薄弱的",
  "rich": "富有的、豐富的",
  "poor": "貧窮的、可憐的",
  "clean": "乾淨整潔的",
  "messy": "雜亂無章的",
  "busy": "忙碌的",
  "lazy": "偷懶懶惰的",
  "quiet": "安靜恬靜的",
  "noisy": "嘈雜喧鬧的",
  "safe": "安全的、保險的",
  "dangerous": "危險的",
  "famous": "著名的、出名的",
  "popular": "受歡迎的、熱門的",
  "strange": "奇怪陌生的",
  "normal": "正常的、平常的",
  "special": "特別特殊的",
  "general": "普遍一般的",
  "perfect": "完美的、無懈可擊的",
  "terrible": "糟糕可怕的",
  "lucky": "幸運吉祥的",
  "unlucky": "倒楣不幸的",
  "apple": "蘋果",
  "book": "書本 / 預訂登記",
  "water": "水",
  "friend": "朋友",
  "family": "家庭、家人",
  "music": "音樂",
  "travel": "旅行",
  "study": "學習、研究",
  "work": "工作、運轉發揮作用",
  "time": "時間、時代",
  "life": "生活、生命",
  "world": "世界",
  "love": "愛、熱愛",
  "dream": "夢想、做夢",
  "hope": "希望、盼望",
  "peace": "和平、平靜",
  "smile": "微笑",
  "future": "未來、前途"
};

/**
 * Rapid offline translation lookup helper
 */
function getBuiltinTranslation(text) {
  if (!text) return "";
  const clean = text.trim().toLowerCase();
  
  // 1. Direct dictionary match
  if (BUILTIN_DICT[clean]) {
    return BUILTIN_DICT[clean];
  }

  // 2. Check PODCAST_1314_PHRASES
  if (typeof PODCAST_1314_PHRASES !== "undefined") {
    const p = PODCAST_1314_PHRASES.find(item => item.text.toLowerCase() === clean);
    if (p && p.translation) return p.translation;
  }

  // 3. Check COMMON_WORDS_DB
  if (typeof COMMON_WORDS_DB !== "undefined") {
    const w = COMMON_WORDS_DB.find(item => item.word.toLowerCase() === clean);
    if (w && w.translation) return w.translation;
  }

  return "";
}

