(function () {
  'use strict';

  const LIGHT = { name: 'الإضاءة', opts: [
    ['استوديو', 'professional studio lighting, softbox key light'],
    ['شمس', 'natural sunlight, bright daylight'],
    ['الساعة الذهبية', 'golden hour warm sunlight'],
    ['الساعة الزرقاء', 'blue hour twilight light'],
    ['نيون', 'neon lighting, cyan and magenta glow'],
    ['ضوء خلفي', 'rim light, strong backlight silhouette edges'],
    ['ناعمة', 'soft diffused light, no harsh shadows'],
    ['درامية', 'dramatic chiaroscuro lighting, deep shadows'],
    ['شموع', 'warm candlelight'],
    ['ليلية', 'moonlight, night ambience']
  ] };
  const ANGLE = { name: 'زاوية التصوير', opts: [
    ['أمامية', 'front view, eye level'],
    ['خلفية', 'back view from behind'],
    ['جانبية', 'side profile view'],
    ['45 درجة', 'three-quarter view at 45 degree angle'],
    ['من فوق', 'top-down overhead flat lay view'],
    ['من تحت', 'low angle shot looking up'],
    ['عين الطائر', 'bird eye aerial view'],
    ['قريبة جداً', 'extreme close-up macro shot'],
    ['لقطة واسعة', 'wide establishing shot']
  ] };
  const LENS = { name: 'العدسة', opts: [
    ['35mm', '35mm lens'],
    ['50mm', '50mm lens'],
    ['85mm', '85mm portrait lens, shallow depth of field, bokeh'],
    ['واسعة', '16mm ultra wide lens'],
    ['ماكرو', '100mm macro lens'],
    ['تيلي', '200mm telephoto lens, compressed background']
  ] };
  const MOOD = { name: 'الجو العام', opts: [
    ['هادئ', 'calm serene mood'],
    ['فخم', 'luxury elegant premium mood'],
    ['مبهج', 'cheerful vibrant mood'],
    ['غامض', 'mysterious moody atmosphere'],
    ['سينمائي', 'cinematic film still, color graded'],
    ['قديم', 'vintage retro film look']
  ] };
  const STYLE = { name: 'الأسلوب', opts: [
    ['واقعي', 'photorealistic, ultra detailed, 8k'],
    ['سينمائي', 'cinematic, dramatic, film grain'],
    ['أنمي', 'anime style, vibrant colors'],
    ['رسم رقمي', 'digital painting, concept art'],
    ['ثلاثي الأبعاد', '3d render, octane render'],
    ['زيتي', 'oil painting, visible brush strokes'],
    ['ألوان مائية', 'watercolor illustration'],
    ['بكسل', 'pixel art'],
    ['أبيض وأسود', 'black and white photography'],
    ['لعبة', 'video game art, unreal engine 5 render'],
    ['كرتون', 'cartoon illustration, bold outlines'],
    ['خطوط', 'line art, clean ink outlines']
  ] };

  const V_CAM = { name: 'حركة الكاميرا', opts: [
    ['ثابتة', 'static locked-off camera, no camera movement'],
    ['تقريب بطيء', 'slow push-in dolly toward the subject'],
    ['ابتعاد', 'slow pull-back dolly out revealing the scene'],
    ['دوران حول الهدف', 'smooth orbit camera circling around the subject'],
    ['متابعة', 'tracking shot following the subject'],
    ['من الأعلى بطائرة مسيّرة', 'aerial drone flyover shot'],
    ['صعود', 'camera crane rising up'],
    ['حركة يد', 'handheld camera, natural slight shake'],
    ['بانوراما', 'slow horizontal pan across the scene']
  ] };
  const V_SPEED = { name: 'السرعة', opts: [
    ['عادية', 'natural real-time motion'],
    ['تصوير بطيء', 'slow motion, high frame rate'],
    ['سريعة', 'fast dynamic energetic motion'],
    ['تايم لابس', 'timelapse, time passing quickly']
  ] };
  const V_LOOK = { name: 'الإحساس', opts: [
    ['سينمائي', 'cinematic film look, anamorphic, color graded'],
    ['إعلان', 'high-end commercial advertisement look'],
    ['وثائقي', 'documentary realistic footage'],
    ['حلم', 'dreamy ethereal soft glow'],
    ['أكشن', 'intense action movie look'],
    ['ريترو', 'vintage 16mm film footage, grain'],
    ['أنمي', 'anime animation style'],
    ['ثلاثي الأبعاد', '3d animated render, pixar style']
  ] };
  const V_TIME = { name: 'وقت المشهد', opts: [
    ['نهار', 'bright daytime'], ['غروب', 'golden sunset light'], ['ليل', 'night scene with city lights'], ['مطر', 'rain falling, wet reflections'], ['ضباب', 'drifting fog and haze']
  ] };
  const V_TRANS = { name: 'التحول', opts: [
    ['بدون', 'single continuous shot'],
    ['يتحرك للحياة', 'still scene coming to life with subtle motion'],
    ['يظهر تدريجياً', 'subject gradually appearing'],
    ['يتغير الجو', 'atmosphere gradually changing over time']
  ] };
  const VCATS = [
    { id: 'free', name: 'حر', icon: 'free', groups: [V_CAM, V_SPEED, V_LOOK, V_TIME, V_TRANS] },
    { id: 'personal', name: 'شخصي', icon: 'personal', base: 'video of a person', groups: [
      { name: 'الحركة', opts: [
        ['يمشي', 'walking naturally toward the camera'], ['يتحدث', 'talking to the camera with natural gestures'], ['يبتسم', 'turning head and smiling'], ['يرقص', 'dancing'], ['يركض', 'running'], ['شعر يتطاير', 'hair and clothes moving in the wind']
      ] }, V_CAM, V_SPEED, V_LOOK, V_TIME
    ] },
    { id: 'product', name: 'منتج', icon: 'product', base: 'product commercial video', groups: [
      { name: 'العرض', opts: [
        ['يدور', 'product slowly rotating 360 degrees on a turntable'], ['معلق', 'product floating and gently spinning in mid air'], ['رذاذ ماء', 'water splash in slow motion around the product'], ['تفكيك', 'parts assembling together'], ['ضوء يمر', 'light sweep gliding across the surface']
      ] }, V_CAM, V_SPEED, V_LOOK
    ] },
    { id: 'landscape', name: 'طبيعة', icon: 'landscape', base: 'nature footage', groups: [
      { name: 'الحركة', opts: [
        ['سحب متحركة', 'clouds moving across the sky'], ['موج', 'waves crashing on the shore'], ['أشجار تتمايل', 'trees swaying in the wind'], ['مياه جارية', 'flowing river water'], ['نجوم تدور', 'stars rotating in the night sky']
      ] }, V_CAM, V_SPEED, V_TIME, V_LOOK
    ] },
    { id: 'food', name: 'أكل', icon: 'food', base: 'food commercial video', groups: [
      { name: 'الحركة', opts: [
        ['صب', 'sauce or drink being poured'], ['بخار', 'steam rising'], ['تقطيع', 'being sliced'], ['نزول مكونات', 'ingredients falling in slow motion']
      ] }, V_CAM, V_SPEED, V_LOOK
    ] },
    { id: 'animal', name: 'حيوانات', icon: 'animal', base: 'wildlife footage', groups: [
      { name: 'الحركة', opts: [
        ['يركض', 'running'], ['يطير', 'flying'], ['يلعب', 'playing'], ['ينظر إلى الكاميرا', 'turning to look at the camera']
      ] }, V_CAM, V_SPEED, V_TIME
    ] },
    { id: 'game', name: 'ألعاب', icon: 'game', base: 'video game cinematic trailer', groups: [
      { name: 'المشهد', opts: [
        ['شخصية تتحرك', 'character idle animation and pose'], ['معركة', 'epic battle action'], ['عالم اللعبة', 'flythrough of the game world'], ['ظهور الشعار', 'dramatic title reveal']
      ] }, V_CAM, V_LOOK
    ] }
  ];
  const RATIO_NOTE = 'high quality, sharp focus';

  const CATS = [
    { id: 'free', name: 'حر', icon: 'free', groups: [STYLE, LIGHT, MOOD] },
    { id: 'personal', name: 'شخصي', icon: 'personal', base: 'portrait photography of a person', groups: [
      { name: 'نوع اللقطة', opts: [
        ['بورتريه وجه', 'headshot portrait'],
        ['نصف الجسم', 'half body shot'],
        ['الجسم كامل', 'full body shot'],
        ['صورة رسمية', 'professional corporate headshot, business attire'],
        ['صورة شخصية لوسائل التواصل الاجتماعي', 'lifestyle social media portrait'],
        ['أزياء', 'fashion editorial photoshoot']
      ] },
      LIGHT, ANGLE, LENS,
      { name: 'الخلفية', opts: [
        ['سادة', 'plain seamless studio backdrop'],
        ['ضبابية', 'blurred bokeh background'],
        ['مدينة', 'urban city street background'],
        ['طبيعة', 'outdoor nature background'],
        ['مكتب', 'modern office background'],
        ['بحر', 'beach and sea background']
      ] },
      { name: 'التعبير', opts: [
        ['ابتسامة', 'smiling, friendly expression'],
        ['جاد', 'serious confident expression'],
        ['تفكير', 'thoughtful pensive look'],
        ['ضحك', 'laughing naturally']
      ] },
      MOOD
    ] },
    { id: 'product', name: 'منتج', icon: 'product', base: 'commercial product photography', groups: [
      { name: 'الخلفية', opts: [
        ['أبيض', 'pure white seamless background'],
        ['أسود', 'solid black background'],
        ['لون سادة', 'solid pastel color background'],
        ['تدرج', 'smooth gradient background'],
        ['رخام', 'on white marble surface'],
        ['خشب', 'on rustic wooden table'],
        ['منصة', 'on a minimal geometric podium pedestal'],
        ['مياه', 'with water splashes and droplets'],
        ['طبيعة', 'surrounded by leaves and natural elements'],
        ['مطبخ', 'in a modern kitchen setting'],
        ['حمام', 'in a clean spa bathroom setting'],
        ['فضاء', 'floating in a futuristic space scene']
      ] },
      LIGHT, ANGLE,
      { name: 'العرض', opts: [
        ['معلق في الهواء', 'product levitating floating in mid air'],
        ['مع انعكاس', 'glossy reflection on the surface'],
        ['مع ظل ناعم', 'soft natural drop shadow'],
        ['في يد', 'held in a hand'],
        ['مجموعة', 'arranged group composition'],
        ['إعلان', 'advertising campaign hero shot']
      ] },
      LENS, MOOD
    ] },
    { id: 'landscape', name: 'طبيعة', icon: 'landscape', base: 'landscape photography', groups: [
      { name: 'المكان', opts: [
        ['جبال', 'majestic mountains'], ['صحراء', 'desert dunes'], ['بحر', 'ocean coastline'],
        ['غابة', 'dense forest'], ['شلال', 'waterfall'], ['ثلج', 'snowy landscape']
      ] },
      { name: 'الوقت', opts: [
        ['شروق', 'at sunrise'], ['ظهر', 'at midday'], ['غروب', 'at sunset'], ['ليل مرصع بالنجوم', 'at night with starry sky, milky way']
      ] },
      { name: 'الطقس', opts: [
        ['صافي', 'clear sky'], ['ضباب', 'misty fog'], ['مطر', 'rainy weather'], ['عاصفة', 'stormy dramatic clouds']
      ] },
      ANGLE, STYLE
    ] },
    { id: 'food', name: 'أكل', icon: 'food', base: 'professional food photography', groups: [
      { name: 'التقديم', opts: [
        ['طبق مطعم', 'fine dining plating'], ['منزلي', 'homemade rustic serving'], ['مشروب', 'beverage in a glass'], ['حلويات', 'dessert']
      ] },
      { name: 'الخلفية', opts: [
        ['خشب', 'on wooden table'], ['رخام', 'on marble surface'], ['داكنة', 'dark moody background'], ['فاتحة', 'bright airy background']
      ] },
      LIGHT, ANGLE,
      { name: 'لمسات', opts: [
        ['بخار', 'steam rising'], ['قطرات', 'fresh water droplets'], ['مكونات محيطة', 'scattered fresh ingredients around']
      ] }
    ] },
    { id: 'arch', name: 'معماري', icon: 'arch', base: 'architectural photography', groups: [
      { name: 'النوع', opts: [
        ['واجهة', 'building exterior facade'], ['داخلي', 'interior design'], ['غرفة نوم', 'bedroom interior'], ['صالة', 'living room interior'], ['مكتب', 'office interior']
      ] },
      { name: 'الطراز', opts: [
        ['حديث', 'modern minimalist'], ['إسلامي', 'islamic architecture, arabesque details'], ['كلاسيك', 'classic neoclassical'], ['مستقبلي', 'futuristic'], ['صناعي', 'industrial loft']
      ] },
      LIGHT, ANGLE
    ] },
    { id: 'animal', name: 'حيوانات', icon: 'animal', base: 'wildlife photography', groups: [
      { name: 'اللقطة', opts: [
        ['قريبة', 'close-up portrait'], ['في الحركة', 'in motion action shot'], ['في بيئته', 'in its natural habitat'], ['حيوان أليف في المنزل', 'cute pet at home']
      ] },
      LIGHT, ANGLE, LENS, STYLE
    ] },
    { id: 'game', name: 'ألعاب', icon: 'game', base: 'video game concept art', groups: [
      { name: 'النوع', opts: [
        ['شخصية', 'game character design, full body'], ['خريطة', 'game level environment'], ['سلاح أو أداة', 'game item asset, isolated'], ['غلاف لعبة', 'game cover key art'], ['أيقونة', 'game app icon']
      ] },
      { name: 'الأسلوب', opts: [
        ['واقعي', 'AAA photorealistic, unreal engine 5'], ['بكسل', '16-bit pixel art'], ['كرتوني', 'stylized cartoon, fortnite style'], ['أنمي', 'anime game style, cel shaded'], ['لو بولي', 'low poly 3d']
      ] },
      LIGHT, ANGLE, MOOD
    ] },
    { id: 'art', name: 'فن', icon: 'art', base: 'artwork', groups: [
      STYLE,
      { name: 'الألوان', opts: [
        ['زاهية', 'vibrant saturated colors'], ['باستيل', 'soft pastel palette'], ['داكنة', 'dark muted palette'], ['لون واحد', 'monochrome palette']
      ] },
      { name: 'التكوين', opts: [
        ['بسيط', 'minimalist composition'], ['مليء بالتفاصيل', 'intricate highly detailed'], ['متماثل', 'symmetrical composition'], ['خيالي', 'surreal fantasy']
      ] },
      MOOD
    ] }
  ];

  window.SirbPresets = { CATS, VCATS, NOTE: RATIO_NOTE, VNOTE: 'smooth natural motion, high quality, consistent' };
})();
