window.SIRB_TEMPLATES = [
  {
    id: "break-frame",
    name: "إعلان كسر الفريم الديناميكي",
    tag: "إعلانات",
    desc: "المنتج يخرج من حدود الإطار ليشد عين المشاهد فوراً، بتوزيع قاعدة الأثلاث وألوان حيوية مثيرة.",
    img: "../img/tpl-frame.jpg",
    base: "dynamic commercial advertisement using the Breaking the Frame technique: the product bursts out of a bold 3D rectangular frame, parts of the product and splashes extend beyond the frame edges toward the viewer with real depth and shadows, rule of thirds composition with the product on one third and clean negative space on the opposite third for the headline, energetic motion, flying droplets and particles, dramatic studio lighting, emotional and exciting high-end ad campaign look, sharp details",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر هو داخل الإعلان" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: هاتف ذكي، حذاء رياضي، كوب قهوة، سيارة", max: 60, tpl: "the advertised product is {v}" },
      { type: "text", key: "headline", label: "العنوان الإعلاني (اختياري)", ph: "مثال: انطلق بلا حدود", max: 40, text: true, tpl: 'large bold headline text that reads exactly "{v}" written in its original language without translation, using one single clean bold font family (Cairo / Almarai style for Arabic), placed in the empty third, perfectly legible and correctly spelled' },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["كوبالت · بينك · أصفر", ["#0047AB", "#FF2D87", "#FFE600"], "color palette: cobalt blue background with hot pink and vivid bright yellow accents"],
        ["أحمر · أسود · ذهبي", ["#D7141A", "#111111", "#E6B422"], "color palette: deep red and black with luxurious gold accents"],
        ["تركواز · برتقالي · أبيض", ["#00B3B3", "#FF7A00", "#FFFFFF"], "color palette: turquoise with tangerine orange and clean white accents"],
        ["بنفسجي · ليموني · سماوي", ["#6A1BFF", "#C6FF00", "#00E5FF"], "color palette: electric violet with lime green and cyan neon accents"],
        ["أسود · أبيض · فضي", ["#0B0B0B", "#F5F5F5", "#BFC5CC"], "color palette: monochrome black and white with silver highlights"]
      ] },
      { type: "choice", key: "mood", label: "الانطباع", opts: [
        ["حماسي", "mood: explosive, energetic, adrenaline"],
        ["فاخر", "mood: premium, elegant, luxurious"],
        ["مرح", "mood: playful, joyful, fun"],
        ["مستقبلي", "mood: futuristic, tech, sleek"],
        ["دافئ", "mood: warm, friendly, inviting"]
      ] },
      { type: "choice", key: "burst", label: "ما الذي يخرج من الفريم", opts: [
        ["رذاذ ألوان", "colorful paint splashes burst out of the frame with the product"],
        ["شظايا زجاج", "shattered glass shards fly out of the frame with the product"],
        ["ماء وقطرات", "water splash and droplets burst out of the frame with the product"],
        ["دخان ملون", "colored smoke clouds burst out of the frame with the product"],
        ["بدون مؤثرات", "only the product breaks out of the frame, clean minimal look"]
      ] }
    ],
    say: "إعلان لـ {item}"
  },
  {
    id: "tech-poster",
    name: "البوستر التقني العصري",
    tag: "تقنية",
    desc: "بوستر تكنولوجي فاخر بأسلوب Glassmorphism وSwiss Design، بشبكة دقيقة تنظم العناصر وهوية تقنية نظيفة بلا مظهر بلاستيكي رخيص.",
    img: "../img/tpl-tech.jpg",
    base: "modern premium technology poster combining Glassmorphism and Swiss Design, frosted translucent glass panels with soft blur, subtle refraction and fine light edges, strict precise grid system organizing all elements with strong visual unity and generous negative space, clean geometric shapes, matte refined realistic materials, soft diffused studio lighting, luxury tech brand identity, clean and sophisticated, never plastic or cheap looking, no glossy toy look, no clutter, editorial high-end poster, sharp details",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك أو شعارك ليظهر داخل البوستر" },
      { type: "text", key: "item", label: "المنتج أو الموضوع (أي شيء)", ph: "مثال: ساعة ذكية، تطبيق، شركة برمجيات، سماعة", max: 60, tpl: "the main subject of the poster is {v}" },
      { type: "text", key: "headline", label: "العنوان (اختياري)", ph: "مثال: المستقبل يبدأ الآن", max: 40, text: true, tpl: 'headline text that reads exactly "{v}" written in its original language without translation, using one single formal geometric font (Dubai / Cocon style geometric Arabic typeface for Arabic), aligned to the grid, perfectly legible and correctly spelled' },
      { type: "choice", key: "grid", label: "نظام الشبكة", opts: [
        ["شبكة معيارية Modular", "layout: Modular Grid, elements arranged in equal precise modules with consistent gutters"],
        ["شبكة محورية Axial", "layout: Axial Grid, elements aligned along one strong central axis with dynamic balance"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["أزرق باهت · بني · بيج", ["#7C93A8", "#6B4A35", "#E8DCC8"], "color palette: muted dusty blue, warm brown and soft beige, luxurious and calm"],
        ["رمادي فحمي · نحاسي · عاجي", ["#2B2F33", "#B87333", "#F3EEE3"], "color palette: charcoal grey, copper accents and ivory"],
        ["كحلي · فضي · ثلجي", ["#14213D", "#C0C7D1", "#F2F6FA"], "color palette: deep navy, silver and icy white"],
        ["أخضر زيتوني · رملي · كريمي", ["#5B6B4E", "#C8B48A", "#F6F1E6"], "color palette: olive green, sand and cream"],
        ["أسود · سماوي · أبيض", ["#0F172A", "#00E5FF", "#E6F7FF"], "color palette: deep black, cyan glow accents and soft white"]
      ] },
      { type: "choice", key: "feel", label: "الشعور (Look and Feeling)", opts: [
        ["فخامة تقنية", "look and feeling: luxurious, refined, premium technology"],
        ["هدوء ونقاء", "look and feeling: calm, pure, minimal, airy"],
        ["قوة واحترافية", "look and feeling: bold, confident, professional corporate tech"],
        ["مستقبلي", "look and feeling: futuristic, innovative, visionary"]
      ] }
    ],
    say: "بوستر تقني لـ {item}"
  },
  {
    id: "mini-world",
    name: "عالم المصغرات الإعلاني",
    tag: "إعلانات",
    desc: "أشخاص صغار جداً يعتنون بتفاصيل منتج ضخم، رسالة بأن البراند يهتم بأدق التفاصيل وأن أثره عميق.",
    img: "../img/tpl-mini.jpg",
    base: "miniature world advertising photography: the product is shown giant like a monument while many tiny miniature people at tilt-shift figurine scale interact with its details (climbing ladders, polishing, inspecting with magnifying glasses, carrying small pieces, building and decorating it), strong dramatic contrast between the tiny human scale and the huge product, conveying meticulous care for every detail and deep brand impact, macro lens, shallow depth of field, realistic soft studio lighting, ultra detailed textures, playful yet premium commercial look",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر هو بحجم ضخم" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: برجر، زجاجة عطر، هاتف، كعكة", max: 60, tpl: "the giant product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: نهتم بكل تفصيلة", max: 40, text: true, tpl: 'headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole text, perfectly legible and correctly spelled, placed in clean empty space' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Ebhaar للمطاعم", "font style: Ebhaar style decorative calligraphic Arabic display font, warm and appetizing, suitable for restaurants and food"],
        ["Foda Kufi للمنتجات", "font style: Foda Kufi style bold geometric Kufi Arabic font, strong and modern, suitable for products"],
        ["خط بسيط نظيف", "font style: clean simple modern sans Arabic font"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["هرمي Pyramid", "composition: Pyramid Composition, the product forms the peak and the tiny people form a stable triangle base guiding the eye upward"],
        ["المثلث الذهبي", "composition: Golden Triangle, diagonal lines lead the eye to the product details where the tiny people work"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["زيتوني · بينك · كريمي", ["#6B7A3A", "#F4A7B9", "#FFF4DF"], "color palette: olive green, soft pink and cream"],
        ["زيتوني · كريمي", ["#6B7A3A", "#FFF4DF", "#A3B07A"], "color palette: olive green tones with cream"],
        ["بينك · كريمي", ["#F4A7B9", "#FFF4DF", "#E07A93"], "color palette: soft and deep pink with cream"],
        ["بينك · زيتوني", ["#F4A7B9", "#6B7A3A", "#3F4A22"], "color palette: pink background with olive green accents"],
        ["كريمي · ذهبي · بني", ["#FFF4DF", "#D4A84B", "#6B4A35"], "color palette: cream, warm gold and brown"]
      ] }
    ],
    say: "عالم مصغرات لـ {item}"
  },
  {
    id: "halftone-retro",
    name: "إعلان الهالف تون الكلاسيكي والتريندات",
    tag: "Gen Z",
    desc: "تصميم شبابي بتأثيرات Halftone وروح Retro يبدو ملموساً ومصنوعاً بيد بشرية، بحركة وحيوية تكسر الملل.",
    img: "../img/tpl-halftone.jpg",
    base: "retro halftone pop advertisement for Gen Z youth: bold halftone dot patterns, vintage printed paper texture, slight ink misregistration, hand-made cut-out collage feel so it looks tangible and human made not dry AI, comic pop-art energy, motion lines, bursts and dynamic shapes, emotional youthful movement, trendy street culture look and feeling, the product is the energetic hero at the focal point, high contrast, crisp details",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر داخل الإعلان" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: سماعة، حذاء، مشروب، تطبيق", max: 60, tpl: "the advertised product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: عيشها بطريقتك", max: 40, text: true, tpl: 'headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole text, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["DG Ghayaty مرح", "font style: DG Ghayaty style playful bold rounded fun Arabic display font with movement"],
        ["VIP Cartoon كرتوني", "font style: VIP Cartoon style bouncy cartoon comic Arabic font, energetic and fun"],
        ["خط جريء بسيط", "font style: bold simple heavy modern Arabic font"]
      ] },
      { type: "choice", key: "grid", label: "نظام التوزيع", opts: [
        ["شبكة قطرية Diagonal", "layout: Diagonal Grid, elements arranged on strong diagonal lines for dynamic energy"],
        ["شبكة شعاعية Radial", "layout: Radial Grid, rays and elements radiate from the product at the center guiding the eye"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["بنفسجي · أسود · سيان", ["#7B2FF7", "#0B0B0B", "#00E5FF"], "color palette: bold purple and black with cyan accents"],
        ["بنفسجي · أسود · أحمر", ["#7B2FF7", "#0B0B0B", "#FF2D2D"], "color palette: bold purple and black with red accents"],
        ["بنفسجي · أسود · سيان · أحمر", ["#7B2FF7", "#0B0B0B", "#00E5FF", "#FF2D2D"], "color palette: bold purple and black with both cyan and red accents"],
        ["أسود · أحمر · كريمي", ["#0B0B0B", "#FF2D2D", "#F3E9D2"], "color palette: black, red and vintage cream paper"]
      ] }
    ],
    say: "إعلان هالف تون لـ {item}"
  },
  {
    id: "corp-edu",
    name: "القالب الرسمي والتعليمي للشركات والمدرسين",
    tag: "شركات وتعليم",
    desc: "تصميم متزن ورصين للشركات والمؤسسات التعليمية والمدرسين، بشبكة مريحة للقراءة وتكوين يعطي الثقة والاستقرار.",
    img: "../img/tpl-corp.jpg",
    base: "professional corporate and educational authority design applying core design and advertising principles: strict balanced grid with comfortable reading hierarchy, clear focal point, visual balance and stability, consistent alignment and spacing, generous calm negative space reserved for text, limited harmonious color palette, strong contrast for legibility, unity and repetition of shapes, realistic matte materials and soft natural lighting, formal trustworthy serious and credible look and feeling, clean and sober, no fantasy elements, no plastic or cartoon look, no clutter, high-end editorial quality",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك أو شعارك", hint: "اختياري: ارفع صورة منتجك أو شعار مؤسستك ليظهر داخل التصميم" },
      { type: "text", key: "item", label: "الموضوع أو العنصر الرئيسي (أي شيء)", ph: "مثال: كورس رياضيات، شركة محاسبة، مدرسة، مؤتمر", max: 60, tpl: "the main subject and focus of the design is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: التسجيل مفتوح الآن", max: 40, text: true, tpl: 'headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design to avoid visual conflict, perfectly aligned to the grid, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Almarai", "font style: Almarai style clean modern Arabic sans font, clear and friendly for education"],
        ["Univers Next Arabic", "font style: Univers Next Arabic style precise neutral corporate Arabic font"],
        ["Cairo", "font style: Cairo style balanced geometric Arabic font, professional and readable"]
      ] },
      { type: "choice", key: "grid", label: "الشبكة", opts: [
        ["أعمدة Column Grid", "layout: Column Grid, content arranged in balanced vertical columns with consistent gutters"],
        ["مخطوطة Manuscript Grid", "layout: Manuscript Grid, one large calm central text block with wide even margins"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["متماثل Symmetrical", "composition: Symmetrical, perfectly mirrored balance around the central axis for stability and trust"],
        ["خطوط موجهة Leading Lines", "composition: Leading Lines, architectural or perspective lines guide the eye calmly to the focal point"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["بيج · أزرق باهت · بني", ["#E8DCC8", "#7C93A8", "#6B4A35"], "color palette: beige, muted dusty blue and brown, formal and calm"],
        ["كحلي · أبيض · ذهبي", ["#14213D", "#FFFFFF", "#C9A44C"], "color palette: navy, white and subtle gold"],
        ["رمادي · أزرق · أبيض", ["#5F6B76", "#2F5D8A", "#F4F6F8"], "color palette: grey, corporate blue and white"],
        ["أخضر غامق · بيج · بني", ["#1F4D3A", "#E8DCC8", "#6B4A35"], "color palette: dark academic green, beige and brown"]
      ] }
    ],
    say: "تصميم رسمي لـ {item}"
  },
  {
    id: "motion-action",
    name: "قالب الحركة والديناميكية الإعلانية",
    tag: "إعلانات",
    desc: "إعلان ينبض بالطاقة والسرعة: إنسان في وضع الحركة، آثار حركة، منظور إجباري يكبّر المنتج، وظلال درامية.",
    img: "../img/tpl-motion.jpg",
    base: "high energy dynamic advertisement inspired by the latest global trends: Human in action, a person in powerful motion interacting with the product, colorful Motion trails and speed streaks, Forced perspective making the product look huge and close to the camera, Shadow-based concept with long dramatic graphic shadows, sharp depth and strong visual movement that breaks monotony, freeze-frame action, splashes and particles, overwhelming energy, speed and direct advertising excitement, professional commercial photography, crisp details",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر داخل الإعلان" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: مشروب طاقة، حذاء جري، دراجة، سماعة", max: 60, tpl: "the advertised product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: أسرع من أي وقت", max: 40, text: true, tpl: 'strong headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design, dynamic placement following the motion, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Palestine قوي", "font style: Palestine style bold strong distinctive Arabic display font for powerful messages"],
        ["Zain-VF عصري", "font style: Zain variable style modern heavy dynamic Arabic font"],
        ["خط جريء مائل", "font style: bold italic slanted heavy Arabic font suggesting speed"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["قطري Diagonal", "composition: Diagonal, the action runs along a sharp diagonal line across the frame"],
        ["خطوط قائدة Leading Lines", "composition: Leading Lines, motion lines and perspective lead the eye to the product"],
        ["طبقات Layering", "composition: Layering, blurred foreground, sharp middle action and deep background for strong depth"]
      ] },
      { type: "choice", key: "act", label: "نوع الحركة", opts: [
        ["جري وانطلاق", "action: sprinting and launching forward"],
        ["قفز في الهواء", "action: jumping high mid-air"],
        ["رقص وتفاعل", "action: dancing and energetic interaction"],
        ["رياضة قوية", "action: intense sport movement like kicking or punching"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان (لون ثالث مثير)", opts: [
        ["بينك · سيان · أصفر فاقع", ["#FF2D87", "#00E5FF", "#FFE600"], "advanced color palette: hot pink with cyan and an exciting vivid bright yellow third color"],
        ["أحمر · أسود · ليموني", ["#E3001B", "#0B0B0B", "#C6FF00"], "advanced color palette: red and black with an exciting lime green third color"],
        ["أزرق · أبيض · برتقالي", ["#0047FF", "#FFFFFF", "#FF6A00"], "advanced color palette: electric blue and white with an exciting orange third color"],
        ["بنفسجي · سيان · مرجاني", ["#6A1BFF", "#00E5FF", "#FF6F61"], "advanced color palette: violet and cyan with an exciting coral third color"]
      ] }
    ],
    say: "إعلان حركة لـ {item}"
  },
  {
    id: "luxury-shadow",
    name: "قالب الفخامة والظلال الإبداعية",
    tag: "فخامة",
    desc: "إعلان فاخر يعتمد على الظل الإبداعي لخلق الغموض والجاذبية، مثالي للعطور والمجوهرات والفاشن.",
    img: "../img/tpl-lux.jpg",
    base: "luxury premium advertisement with a creative Shadow-based concept: dramatic sculpted light casting an artistic meaningful shadow that creates mystery and allure, luxury, elegance, premium, Hierarchical Grid organizing elements by visual importance with the product as the dominant hero, refined clear focal point, deep rich contrast, glossy reflections on noble materials like marble, glass, silk and metal, rich deep tones, absolute elegance and sophisticated attraction, high-end commercial photography, ultra sharp, no cheap or plastic look",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر داخل الإعلان" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: عطر، خاتم ألماس، ساعة، حقيبة", max: 60, tpl: "the advertised luxury product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: أناقة لا تُنسى", max: 40, text: true, tpl: 'elegant headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design, refined placement in the hierarchy, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Alaq Dimashq", "font style: Alaq Dimashq style elegant ornamental Arabic calligraphy font for luxury"],
        ["Aref Ruqaa", "font style: Aref Ruqaa style graceful classic Ruqaa Arabic calligraphy font"],
        ["Muslimah", "font style: Muslimah style soft feminine elegant Arabic font for fashion"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["النسبة الذهبية Golden Ratio", "composition: Golden Ratio with golden spiral placing the product at the spiral focus"],
        ["التأطير Framing", "composition: Framing, an inner frame like an arch, doorway or shadow surrounds the product to highlight its value"]
      ] },
      { type: "choice", key: "shadow", label: "شكل الظل", opts: [
        ["ظل شخص أنيق", "the shadow forms an elegant human silhouette"],
        ["ظل يكشف معنى المنتج", "the shadow forms a creative shape that reveals the meaning or story of the product"],
        ["ظلال نوافذ وأقواس", "dramatic window and arch light patterns with long shadows"],
        ["ظل ناعم غامض", "soft mysterious low-key shadows wrapping the product"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان الفاخرة", opts: [
        ["بنفسجي · أسود · أحمر", ["#4B1460", "#0B0B0B", "#B3122E"], "luxury color palette: deep purple and black with rich red contrast"],
        ["بنفسجي · أسود · سيان خفيف", ["#4B1460", "#0B0B0B", "#7FE9F5"], "luxury color palette: deep purple and black with a subtle cyan touch for chic elegance"],
        ["أسود · ذهبي", ["#0B0B0B", "#C9A44C", "#3A2A12"], "luxury color palette: black with warm gold"],
        ["عنابي · أسود · وردي ذهبي", ["#5C0F1E", "#0B0B0B", "#E3B7A0"], "luxury color palette: burgundy and black with rose gold"]
      ] }
    ],
    say: "إعلان فاخر لـ {item}"
  },
  {
    id: "human-mascot",
    name: "قالب الطابع الإنساني والتمائم الإعلانية",
    tag: "بهجة",
    desc: "إعلان بروح إنسانية دافئة: شخصية تميمة (Mascot) للمنتج، لوحات مقسمة، وأشخاص حقيقيون يتفاعلون بسعادة.",
    img: "../img/tpl-mascot.jpg",
    base: "warm human advertising alternative to dry AI look: a lovable Mascot character inspired by the product, Human-centric elements with real people smiling and interacting warmly, genuine emotion and soul, tactile handmade feel, Baseline Grid ensuring precise consistent spacing between visual and text blocks, the main element fixed at the focal point, joyful happy lively and warm human interaction look and feeling, soft natural light, rich detail, never plastic or artificial looking",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك لتُبنى عليه الشخصية والإعلان" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: عصير، بسكويت، معجون أسنان، تطبيق توصيل", max: 60, tpl: "the advertised product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: طعم السعادة", max: 40, text: true, tpl: 'cheerful headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design, aligned to the baseline grid, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["DG Ghayaty مرح", "font style: DG Ghayaty style playful rounded fun Arabic display font full of joy"],
        ["Foda Kufi طاقة", "font style: Foda Kufi style bold geometric Kufi Arabic font full of energy"],
        ["خط دائري لطيف", "font style: soft rounded friendly Arabic font"]
      ] },
      { type: "choice", key: "layout", label: "شكل الإعلان", opts: [
        ["لوحات مقسمة Split Panels", "layout: Split Panels, two side by side panels, the mascot in one and a real happy person using the product in the other"],
        ["التميمة مع الناس", "layout: the mascot character and real people together in one warm joyful scene"],
        ["التميمة وحدها", "layout: the mascot character alone as the hero with the product"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["متمركز ومتماثل", "composition: Centered Symmetrical, the main element centered for instant focus"],
        ["توازن Balance", "composition: Balance, visual weight evenly distributed for comfortable harmony"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["أصفر · أخضر · بينك", ["#FFD21F", "#3DBE5A", "#FF8FB1"], "cheerful color palette: sunny yellow and fresh green with pink touch"],
        ["أصفر · أخضر · كريمي", ["#FFD21F", "#3DBE5A", "#FFF4DF"], "cheerful color palette: sunny yellow and fresh green with cream"],
        ["برتقالي · سماوي · أبيض", ["#FF8A00", "#4FC3F7", "#FFFFFF"], "cheerful color palette: orange, sky blue and white"],
        ["بينك · ليموني · كريمي", ["#FF8FB1", "#C6FF00", "#FFF4DF"], "cheerful color palette: pink, lime and cream"]
      ] }
    ],
    say: "إعلان مبهج لـ {item}"
  },
  {
    id: "radial-sale",
    name: "قالب العروض الديناميكية والتكوين الإشعاعي",
    tag: "عروض",
    desc: "لافتة عروض وتخفيضات تنفجر بالحماس: أشعة تنطلق من المركز وزوايا ديناميكية توجّه العين فوراً للمنتج والسعر.",
    img: "../img/tpl-sale.jpg",
    base: "explosive dynamic sale and offer advertisement: strong visual movement directing attention powerfully to the products and the price or offer badge, burst rays, confetti, shopping energy, bold attention grabbing price badge area, high contrast vivid advanced three color combination, excitement, strong offers, vitality and instant marketing appeal, breaking the boring traditional banner look, glossy premium commercial render, crisp sharp details",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر في قلب العرض" },
      { type: "text", key: "item", label: "المنتج أو المنتجات (أي شيء)", ph: "مثال: أحذية رياضية، ملابس شتوية، وجبات، إلكترونيات", max: 60, tpl: "the products on offer are {v}" },
      { type: "text", key: "offer", label: "العرض أو السعر (اختياري)", ph: "مثال: خصم 50% أو 199 جنيه", max: 25, text: true, tpl: 'a bold eye-catching price or offer badge that reads exactly "{v}" with the exact same digits and words in their original language without translation, perfectly legible' },
      { type: "text", key: "headline", label: "العنوان (اختياري)", ph: "مثال: عروض الجمعة البيضاء", max: 40, text: true, tpl: 'strong marketing headline text that reads exactly "{v}" written in its original language without translation' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد لكل النصوص)", opts: [
        ["Palestine قوي", "all text uses one single Arabic font family only: Palestine style bold strong distinctive Arabic display font, perfectly legible and correctly spelled"],
        ["Lateef أنيق", "all text uses one single Arabic font family only: Lateef style elegant clear Arabic font, perfectly legible and correctly spelled"],
        ["Zain-VF عصري", "all text uses one single Arabic font family only: Zain variable style modern heavy Arabic font, perfectly legible and correctly spelled"]
      ] },
      { type: "choice", key: "grid", label: "الشبكة", opts: [
        ["شعاعية Radial Grid", "layout: Radial Grid, elements and rays radiate outward from the center where the hero product sits"],
        ["قطرية Diagonal Grid", "layout: Diagonal Grid, elements arranged on bold diagonals leading to the product and price"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["إشعاعي Radial", "composition: Radial, everything bursts from the central focal point"],
        ["زوايا ديناميكية Dynamic angles", "composition: Dynamic angles, tilted camera and slanted elements for instant visual excitement"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان (لون ثالث محفز)", opts: [
        ["بينك · سيان · أصفر فاقع", ["#FF2D87", "#00E5FF", "#FFE600"], "advanced color palette: hot pink and cyan with an exciting vivid bright yellow third color"],
        ["زيتوني · بينك · كريمي", ["#6B7A3A", "#FF8FB1", "#FFF4DF"], "advanced color palette: olive green and pink with a cream third color"],
        ["أحمر · أسود · أصفر", ["#E3001B", "#0B0B0B", "#FFE600"], "advanced color palette: red and black with an exciting yellow third color"],
        ["أزرق · برتقالي · أبيض", ["#0047FF", "#FF6A00", "#FFFFFF"], "advanced color palette: electric blue and orange with white"]
      ] }
    ],
    say: "إعلان عروض لـ {item}"
  },
  {
    id: "editorial",
    name: "قالب المجلات والمطبوعات التحريرية",
    tag: "مجلات",
    desc: "تصميم مجلة أو مطبوعة فاخرة بأسلوب تحريري نظيف، يسلّط الضوء على العنوان والصورة الرئيسية براحة بصرية مطلقة.",
    img: "../img/tpl-editorial.jpg",
    base: "luxury international editorial print design like a premium magazine cover or spread: refined typographic hierarchy, generous calm margins and white space, thin elegant rules, precise alignment of dense text blocks with absolute visual comfort, one strong main photo, fine paper texture, clean sophisticated editorial elegance, high-end print publication look and feeling, any small body text rendered as subtle abstract lines only, no clutter, no cheap or plastic look",
    fields: [
      { type: "photo", key: "product", label: "الصورة الرئيسية أو منتجك", hint: "اختياري: ارفع صورة شخص أو منتج لتكون الصورة الرئيسية في المجلة" },
      { type: "text", key: "item", label: "موضوع المجلة أو الصورة الرئيسية (أي شيء)", ph: "مثال: عارضة أزياء، ساعة فاخرة، مطعم، مقال عن السفر", max: 60, tpl: "the main photo and story subject is {v}" },
      { type: "text", key: "headline", label: "العنوان (اختياري)", ph: "مثال: أناقة الشتاء", max: 40, text: true, tpl: 'large editorial masthead or headline that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design with no other font, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Cairo", "font style: Cairo style balanced geometric Arabic font, editorial and clean"],
        ["Dubai", "font style: Dubai style formal refined modern Arabic font"],
        ["Almarai", "font style: Almarai style clean minimal Arabic sans font"]
      ] },
      { type: "choice", key: "grid", label: "الشبكة", opts: [
        ["مخطوطة Manuscript Grid", "layout: Manuscript Grid, one main text block with wide even classic margins"],
        ["خط الأساس Baseline Grid", "layout: Baseline Grid, every text line and block sits precisely on a consistent baseline rhythm"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["تحريري بسيط Minimalist", "composition: Minimalist Editorial Layout, a single hero image and headline with lots of breathing space"],
        ["توازن غير متماثل Asymmetrical", "composition: Asymmetrical Balance, large photo on one side balanced by text and white space on the other"]
      ] },
      { type: "choice", key: "format", label: "نوع المطبوعة", opts: [
        ["غلاف مجلة", "format: magazine cover"],
        ["صفحتان داخليتان", "format: open magazine double page spread"],
        ["بوستر تحريري", "format: editorial poster print"],
        ["كتيب أو بروشور", "format: premium brochure or booklet page"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["كريمي · بيج · أسود", ["#FFF4DF", "#E8DCC8", "#111111"], "editorial color palette: cream and beige with classic black"],
        ["كريمي · أزرق باهت · أسود", ["#FFF4DF", "#7C93A8", "#111111"], "editorial color palette: cream with muted dusty blue and classic black"],
        ["أبيض · أسود", ["#FFFFFF", "#111111", "#9A9A9A"], "editorial color palette: classic black and white with grey"],
        ["بيج · بني · كريمي", ["#E8DCC8", "#6B4A35", "#FFF4DF"], "editorial color palette: beige, warm brown and cream"]
      ] }
    ],
    say: "تصميم مجلة لـ {item}"
  },
  {
    id: "food-appetite",
    name: "قالب المطاعم والأكلات الشهية",
    tag: "مطاعم",
    desc: "إعلان أكل يفتح النفس: بخار ومكونات طائرة وإضاءة دافئة، بتوزيع قاعدة الأثلاث وخط عربي واحد مناسب للمطاعم.",
    img: "../img/tpl-food.jpg",
    base: "mouthwatering appetizing restaurant food advertisement: the dish as the hero with rich textures, rising steam, fresh ingredients and sauce frozen mid-air, crispy and juicy macro details, warm golden appetizing light, rustic or clean styled table setting, typography chosen for the restaurant audience, strong appetite appeal and warm hospitable look and feeling, professional commercial food photography, ultra sharp, never fake or plastic looking food",
    fields: [
      { type: "photo", key: "product", label: "صورة الطبق أو المنتج", hint: "اختياري: ارفع صورة طبقك أو منتجك ليظهر في الإعلان" },
      { type: "text", key: "item", label: "الأكلة أو المنتج (أي شيء)", ph: "مثال: شاورما، بيتزا، كنافة، قهوة مختصة", max: 60, tpl: "the featured dish or food product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: طعم ما يتنسيش", max: 40, text: true, tpl: 'appetizing headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family with different weights only for the whole design, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Ebhaar شهي", "font style: Ebhaar style decorative warm appetizing Arabic display font for restaurants"],
        ["Lalezar قوي ومرح", "font style: Lalezar style bold playful chunky Arabic font for fast food"],
        ["خط يدوي دافئ", "font style: warm handwritten brush Arabic font for home cooking"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["قاعدة الأثلاث", "composition: Rule of Thirds, the dish on one third with clean space on the opposite third for text"],
        ["قطري Diagonal", "composition: Diagonal, ingredients and dish flow along a dynamic diagonal"],
        ["من أعلى Flat lay", "composition: top down flat lay, a balanced arrangement of the dish and ingredients"]
      ] },
      { type: "choice", key: "style", label: "نوع المكان", opts: [
        ["شعبي دافئ", "setting: warm rustic local street food atmosphere"],
        ["فاخر", "setting: fine dining elegant dark moody setting"],
        ["وجبات سريعة", "setting: energetic bright fast food setting"],
        ["حلويات وكافيه", "setting: cozy soft bakery and cafe setting"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["أحمر طماطم · أصفر مسطردة · كريمي", ["#D7261E", "#E8A317", "#FFF4DF"], "appetizing color palette: tomato red, mustard yellow and cream"],
        ["برتقالي · بني · أخضر طازج", ["#FF7A00", "#6B3E26", "#4CAF50"], "appetizing color palette: warm orange, roasted brown and fresh green"],
        ["زيتوني · بينك · كريمي", ["#6B7A3A", "#F4A7B9", "#FFF4DF"], "color palette: olive green, soft pink and cream"],
        ["أسود · ذهبي · نبيذي", ["#111111", "#C9A44C", "#6D1A2A"], "fine dining color palette: black, gold and wine red"]
      ] }
    ],
    say: "إعلان مطعم لـ {item}"
  },
  {
    id: "heritage",
    name: "قالب الأصالة والتراث العربي",
    tag: "أصالة",
    desc: "تصميم بروح عربية أصيلة: زخارف هندسية إسلامية ومشربيات وإضاءة فوانيس، مثالي لرمضان والمناسبات والمنتجات التراثية.",
    img: "../img/tpl-heritage.jpg",
    base: "authentic Arabic heritage advertisement: intricate Islamic geometric star patterns, arabesque ornaments, mashrabiya woodwork, arches and warm lantern light, noble craftsmanship materials like brass, carved wood, ceramics and fabric, the product placed as a treasured hero, Hierarchical Grid giving clear importance order, timeless authentic noble and warm look and feeling, rich depth, high-end commercial photography, culturally respectful, never kitsch or plastic looking",
    fields: [
      { type: "photo", key: "product", label: "صورة منتجك", hint: "اختياري: ارفع صورة منتجك ليظهر وسط الطابع التراثي" },
      { type: "text", key: "item", label: "المنتج أو العنصر (أي شيء)", ph: "مثال: تمور، قهوة عربية، عطر عود، عباية", max: 60, tpl: "the featured product is {v}" },
      { type: "text", key: "headline", label: "النص (اختياري)", ph: "مثال: رمضان كريم", max: 40, text: true, tpl: 'headline text that reads exactly "{v}" written in its original language without translation, using one single Arabic font family only for the whole design, perfectly legible and correctly spelled' },
      { type: "choice", key: "font", label: "الخط العربي (خط واحد)", opts: [
        ["Reem Kufi كوفي", "font style: Reem Kufi style geometric Kufi Arabic font with heritage spirit"],
        ["Amiri نسخ", "font style: Amiri style classic elegant Naskh Arabic font"],
        ["Aref Ruqaa رقعة", "font style: Aref Ruqaa style traditional Ruqaa Arabic calligraphy font"]
      ] },
      { type: "choice", key: "comp", label: "التكوين", opts: [
        ["متماثل Symmetrical", "composition: perfectly Symmetrical around a central arch for nobility and stability"],
        ["النسبة الذهبية", "composition: Golden Ratio placing the product at the golden spiral focus"],
        ["التأطير Framing", "composition: Framing, the product framed inside an arch or mashrabiya window"]
      ] },
      { type: "choice", key: "occasion", label: "المناسبة", opts: [
        ["بدون مناسبة", "timeless heritage atmosphere"],
        ["رمضان", "Ramadan atmosphere with crescent moon and glowing lanterns"],
        ["العيد", "Eid celebration atmosphere, festive and joyful"],
        ["زفاف وأفراح", "traditional wedding celebration atmosphere"]
      ] },
      { type: "palette", key: "palette", label: "باليت الألوان", opts: [
        ["زمردي · ذهبي عتيق · بيج رملي", ["#0F5132", "#B8902E", "#E8D8B8"], "heritage color palette: deep emerald green, antique gold and sand beige"],
        ["كحلي · ذهبي · عاجي", ["#14213D", "#C9A44C", "#F3EEE3"], "heritage color palette: night navy, gold and ivory"],
        ["عنابي · نحاسي · كريمي", ["#5C0F1E", "#B87333", "#FFF4DF"], "heritage color palette: burgundy, copper and cream"],
        ["تركواز · طيني · رملي", ["#1E8C8C", "#A0522D", "#E8D8B8"], "heritage color palette: turquoise tile, terracotta and sand"]
      ] }
    ],
    say: "تصميم تراثي لـ {item}"
  }
];
