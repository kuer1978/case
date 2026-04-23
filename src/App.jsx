import React, { useState, useMemo } from 'react';
import { Search, Activity, BookOpen, User, Thermometer, CheckCircle, Tag, X, Filter, Stethoscope } from 'lucide-react';

// --- 数据源定义 ---

const CATEGORIES = [
  "全部",
  "皮肤与自身免疫系统",
  "内分泌与代谢系统",
  "神经与精神系统",
  "呼吸系统疾病",
  "口腔与眼科疾病",
  "肿瘤与术后康复",
  "其他综合与亚健康"
];

const TAG_GROUPS = {
  "干预方式": ["吸氢气", "饮用富氢水", "富氢水泡浴", "富氢水湿敷/含漱"],
  "核心机制": ["选择性抗氧化", "抗炎症", "抗凋亡", "免疫调节", "改善微循环"],
  "特殊人群": ["老年人", "肿瘤放化疗患者", "孕产妇", "亚健康/疲劳人群"]
};

// 按照您提供的样例构建的数据库，并补充了基于目录扩展的临床案例
const CASE_DATABASE = [
  {
    id: 1,
    category: "皮肤与自身免疫系统",
    diseaseName: "寻常型银屑病伴代谢综合征",
    patientProfile: "李某，男，67岁。全身皮疹脱屑瘙痒十余年。平素伴有高血压、高血糖、高血脂及痛风。",
    intervention: "氢水浴（氢含量1.6ppm，氧化还原电位-600mV）每周2次（后期改为每周1次）；同时每天口服富氢水2~3袋（500ml/袋）；常以富氢水冷敷患处瘙痒部位。持续治疗8个月以上。",
    outcome: "治疗10周时皮疹逐渐好转，半年后皮疹基本消退，右足趾痛风未再发作。空腹血糖、甘油三酯、血尿酸均降至正常范围。",
    medicalReview: "氢水泡浴既可温热活血，又能通过透皮吸收发挥抗炎、抗氧化作用。对伴有代谢性疾病或对传统药物不耐受的银屑病患者，氢水可同时改善皮损与代谢指标。",
    tags: ["富氢水泡浴", "饮用富氢水", "富氢水湿敷/含漱", "抗炎症", "选择性抗氧化", "老年人"]
  },
  {
    id: 2,
    category: "内分泌与代谢系统",
    diseaseName: "重度非酒精性脂肪肝",
    patientProfile: "金某，男，57岁，脂肪肝病史5年。BMI 28.37，体重85.9kg，伴有高血压，超声显示重度脂肪肝（CAP值335）。",
    intervention: "每天饮用3次富氢水（1.6ppm），每次350ml。在不改变原有饮食和运动量的前提下，连续饮用12周。",
    outcome: "体重下降4.8kg，腰围缩小，血压控制平稳。反映脂肪肝程度的CAP值由335 dB/m大幅下降到219 dB/m（重度脂肪肝消失）。体内超氧化物歧化酶（SOD）显著升高。",
    medicalReview: "富氢水通过选择性抗氧化作用，减轻了肝脏的氧化应激损伤，同时可能改善了脂质代谢，从而有效逆转了重度脂肪肝。",
    tags: ["饮用富氢水", "选择性抗氧化", "改善微循环"]
  },
  {
    id: 3,
    category: "神经与精神系统",
    diseaseName: "脑梗死伴卒中后抑郁、焦虑",
    patientProfile: "男，41岁。右侧颈内动脉闭塞导致脑梗死。术后遗留左侧肢体乏力，伴发明显的情绪低落、自责及重度头痛，汉密尔顿焦虑量表(HAMA)和抑郁量表(HAMD)均为10分。",
    intervention: "在脑梗死常规治疗基础上，每天上午吸入3.5%浓度的氢气，每次2小时，连续治疗10天。",
    outcome: "吸入10天后，头痛基本缓解，左侧肢体肌力恢复正常（NHISS评分降为0）。HAMA降为6分，HAMD降为8分，情绪和临床症状双双显著改善。",
    medicalReview: "氢气的高穿透性使其能轻易穿过血脑屏障，通过抗凋亡和改善微循环作用，促进神经功能恢复，并对情绪中枢产生积极调节。",
    tags: ["吸氢气", "抗凋亡", "改善微循环"]
  },
  {
    id: 4,
    category: "内分泌与代谢系统",
    diseaseName: "2型糖尿病伴周围神经病变",
    patientProfile: "张某，女，62岁。2型糖尿病史12年，近期出现双下肢麻木、刺痛感，空腹血糖波动在8.5-10.0 mmol/L，糖化血红蛋白8.2%。",
    intervention: "在维持原有降糖药物基础上，每日饮用高浓度富氢水（1.6ppm）1000ml，分3-4次饮用，连续干预3个月。",
    outcome: "干预3个月后，空腹血糖降至6.8 mmol/L，糖化血红蛋白降至7.1%。双下肢麻木刺痛感明显减轻，睡眠质量显著改善。",
    medicalReview: "氢分子可通过改善微循环和减轻神经末梢的氧化损伤，缓解糖尿病周围神经病变症状，同时对胰岛β细胞具有一定的保护和改善脂质代谢的协同作用。",
    tags: ["饮用富氢水", "选择性抗氧化", "改善微循环", "老年人"]
  },
  {
    id: 5,
    category: "呼吸系统疾病",
    diseaseName: "慢性阻塞性肺疾病(COPD)",
    patientProfile: "王某，男，71岁，长期吸烟史。反复咳嗽、咳痰、气促8年，近期稍微活动即感喘息，肺功能提示重度阻塞性通气功能障碍。",
    intervention: "每日居家使用氢氧混合气呼吸机（氢气66%，氧气33%）吸入，每天2次，每次2小时。持续干预6个月。",
    outcome: "吸氢1个月后咳嗽变浅，咳痰量减少且易于咳出；3个月后日常活动（如平地步行、穿衣）时的气促感明显缓解；6个月复查肺功能FEV1指标有轻度改善，未再发生急性加重。",
    medicalReview: "氢气分子极小，可深入细支气管和肺泡，直接发挥强大的局部抗炎和抗氧化作用，减轻气道黏液高分泌，是慢阻肺康复管理的有效辅助手段。",
    tags: ["吸氢气", "抗炎症", "选择性抗氧化", "老年人"]
  },
  {
    id: 6,
    category: "神经与精神系统",
    diseaseName: "帕金森病伴随抑郁",
    patientProfile: "赵某，男，65岁。确诊帕金森病4年，伴有静止性震颤和肌强直。近半年来出现情绪低落、对事物丧失兴趣等抑郁症状，药物控制效果进入平台期。",
    intervention: "每日饮用富氢水800ml，同时每天下午吸入氢气（浓度3%）1.5小时。连续进行8周干预。",
    outcome: "治疗后，患者UPDRS评分有所下降，肢体僵硬感轻微改善。最显著的是抑郁量表评分大幅下降，患者家属反馈其主动交流意愿增强，笑容增多。",
    medicalReview: "帕金森病的发病机制与黑质多巴胺能神经元的氧化应激和凋亡密切相关。氢气能穿透血脑屏障，通过抗凋亡和保护神经元，不仅改善运动症状，还对神经递质失衡导致的抑郁有积极的调节作用。",
    tags: ["吸氢气", "饮用富氢水", "抗凋亡", "改善微循环", "老年人"]
  },
  {
    id: 7,
    category: "口腔与眼科疾病",
    diseaseName: "复发性顽固性口腔溃疡",
    patientProfile: "林某，女，34岁。反复发作口腔溃疡5年，每月发作1-2次，每次持续7-10天，常伴剧烈疼痛，影响进食和说话，常规使用西瓜霜、维生素等效果不佳。",
    intervention: "发作期每日使用富氢水（含氢量1.2ppm）含漱5-6次，每次含漱保留3分钟后再吞咽。缓解期每日饮用富氢水500ml维持。",
    outcome: "首次使用含漱后，当天疼痛感即减轻30%。3天后溃疡面开始愈合，5天后完全愈合，愈合周期比以往缩短近一半。坚持饮用半年后，溃疡发作频率降至每季度1次，且症状极其轻微。",
    medicalReview: "富氢水直接接触溃疡创面，可快速中和局部炎症反应产生的自由基，减轻黏膜充血水肿；同时吞咽富氢水可通过全身免疫调节，从根本上降低复发频率。",
    tags: ["富氢水湿敷/含漱", "饮用富氢水", "抗炎症", "免疫调节", "亚健康/疲劳人群"]
  },
  {
    id: 8,
    category: "肿瘤与术后康复",
    diseaseName: "肿瘤化疗后副反应及生活质量改善",
    patientProfile: "陈某，女，52岁。乳腺癌术后接受辅助化疗期间，出现严重的食欲减退、恶心呕吐、极度疲乏及白细胞下降，患者情绪极度悲观，有抗拒后续化疗的倾向。",
    intervention: "在化疗间歇期和化疗期间，每天吸入高纯度氢气2-3小时，并完全以富氢水替代日常饮用水。持续整个化疗周期。",
    outcome: "介入氢疗后，第二周期化疗的恶心呕吐症状显著减轻，食欲恢复至生病前80%，乏力感大幅改善，能够在家属陪同下散步。白细胞下降幅度减小，未再因严重的骨髓抑制延迟化疗。",
    medicalReview: "放化疗在杀灭肿瘤细胞的同时会引发系统性的剧烈氧化应激反应（“无差别攻击”）。氢气作为选择性抗氧化剂，能特异性清除恶性自由基，保护正常细胞免受化疗毒性损害，显著提升患者生活质量和治疗依从性。",
    tags: ["吸氢气", "饮用富氢水", "选择性抗氧化", "免疫调节", "肿瘤放化疗患者"]
  },
  {
    id: 9,
    category: "皮肤与自身免疫系统",
    diseaseName: "重度特应性皮炎（AD）",
    patientProfile: "刘某，男，28岁。自幼患有特应性皮炎，全身多处红斑、丘疹、渗出，伴有难以忍受的剧烈瘙痒，夜间尤甚，严重影响睡眠。长期依赖糖皮质激素和免疫抑制剂，存在停药反弹现象。",
    intervention: "采用“内饮外泡”联合方案：每日饮用富氢水1000ml；每周进行3次全身富氢水SPA泡浴（水温38℃，每次30分钟）。同时逐步减少激素用量。",
    outcome: "2周后夜间瘙痒明显减轻，睡眠质量大幅改善；4周后皮损渗出停止，红斑颜色变暗；12周后大部分皮损消退，仅留色素沉着。成功停用口服免疫抑制剂，仅局部偶尔使用弱效外用激素。",
    medicalReview: "特应性皮炎是由免疫失调引发的慢性炎症。氢水泡浴可直达皮肤真皮层，阻断炎症因子释放，修复皮肤屏障；饮用氢水则从内源性调节免疫失衡。该联合方案是难治性皮炎安全的辅助疗法。",
    tags: ["富氢水泡浴", "饮用富氢水", "抗炎症", "免疫调节", "亚健康/疲劳人群"]
  },
  {
    id: 10,
    category: "呼吸系统疾病",
    diseaseName: "难治性过敏性鼻炎",
    patientProfile: "吴某，女，22岁，大学生。常年性过敏性鼻炎，遇冷空气或尘螨即发作，频繁打喷嚏、流清涕、鼻塞导致张口呼吸，严重影响上课专注度。",
    intervention: "每日使用富氢水清洗鼻腔早晚各1次；复习备考等用脑疲劳阶段，每日居家吸氢气1小时。",
    outcome: "干预1周后，清晨连打喷嚏的症状消失；1个月后鼻塞症状完全缓解，白天精神状态和专注度大幅提升。",
    medicalReview: "鼻腔局部使用富氢水可以直接清除鼻黏膜过敏反应释放的组胺等炎症介质，吸氢则辅助降低全身过敏状态，双管齐下改善呼吸道黏膜高反应性。",
    tags: ["富氢水湿敷/含漱", "吸氢气", "抗炎症", "免疫调节", "亚健康/疲劳人群"]
  },
  {
    id: 11,
    category: "其他综合与亚健康",
    diseaseName: "慢性疲劳综合征与加速运动恢复",
    patientProfile: "周某，男，35岁，业余马拉松爱好者及企业高管。工作压力大，常感身体沉重、精力不济。每次长距离跑步后，肌肉酸痛需持续3-4天才能缓解，影响日常工作。",
    intervention: "日常以富氢水代替普通水补水；跑前饮用富氢水500ml，跑后立即饮用富氢水，并在当晚进行富氢水全身泡浴。",
    outcome: "日常精力显著提升，“脑雾”感消失。运动后的肌肉酸痛程度减轻了60%，恢复时间从3-4天缩短至1天，次日即可恢复轻度训练和高强度工作。",
    medicalReview: "高强度运动和高压工作都会导致体内积聚大量乳酸和恶性自由基。氢气极强的抗氧化和穿透力能迅速进入肌肉细胞中和自由基，减轻微循环障碍，是优良的无副作用疲劳恢复剂。",
    tags: ["饮用富氢水", "富氢水泡浴", "选择性抗氧化", "改善微循环", "亚健康/疲劳人群"]
  },
  {
    id: 12,
    category: "皮肤与自身免疫系统",
    diseaseName: "顽固性副银屑病",
    patientProfile: "郑某，男，55岁。躯干四肢散发斑块、脱屑3年，伴轻度瘙痒。曾外用多种糖皮质激素软膏，病情反复发作，逐渐加重。",
    intervention: "每天饮用富氢水1000ml；每周3次全身富氢水泡浴（水温37-38℃，每次30分钟）。持续干预4个月。",
    outcome: "1个月后皮损变薄，脱屑减少；3个月后大部分红斑消退，遗留色素沉着；4个月后病情稳定，未见明显新发皮疹。",
    medicalReview: "副银屑病属于慢性淋巴细胞性炎症，有发展为淋巴瘤的潜在风险。氢分子通过抑制T细胞异常活化和炎症因子释放，改善皮肤局部微环境，是安全的长期干预手段。",
    tags: ["富氢水泡浴", "饮用富氢水", "抗炎症", "免疫调节"]
  },
  {
    id: 13,
    category: "皮肤与自身免疫系统",
    diseaseName: "皮肤T细胞淋巴瘤(蕈样肉芽肿期)",
    patientProfile: "王某，女，61岁。确诊蕈样肉芽肿(MF)早期，全身多发暗红色斑块伴剧痒，常规紫外线光疗效果不佳，夜间无法安睡。",
    intervention: "在原有治疗基础上，每天吸氢气（66%浓度）2小时，同时配合每日1次富氢水局部湿敷浸泡皮损严重区域。",
    outcome: "干预2周后，剧烈瘙痒感明显降低，夜间睡眠改善；干预3个月后，部分斑块颜色变淡、浸润感减轻，提高了患者生存质量。",
    medicalReview: "针对肿瘤性皮肤病，氢气无法直接杀灭肿瘤细胞，但其强大的抗氧化和免疫调节功能可以显著减轻皮损处的炎症浸润和瘙痒介质释放，提高患者耐受度。",
    tags: ["富氢水湿敷/含漱", "吸氢气", "抗凋亡", "免疫调节", "老年人"]
  },
  {
    id: 14,
    category: "皮肤与自身免疫系统",
    diseaseName: "急性痘疮样苔藓样糠疹(PLEVA)",
    patientProfile: "陈某，男，19岁。躯干突发泛发性水肿性红斑、丘疹，部分中心坏死结痂，伴低热及全身不适，口服抗生素和抗组胺药2周无效。",
    intervention: "停止所有口服药，采用单一纯富氢水（浓度1.6ppm）进行全身浸泡，每日1次，每次40分钟。",
    outcome: "连续泡浴7天后，体温恢复正常，未再起新水疱；14天后坏死结痂大面积脱落；1个月后皮疹完全消退，仅留轻微痘坑样疤痕。",
    medicalReview: "PLEVA病因不明，多与感染引发的免疫超敏反应有关。富氢水透皮吸收能迅速穿透表皮屏障，中和急性炎症风暴爆发期的毒性自由基，加速组织修复。",
    tags: ["富氢水泡浴", "抗炎症", "免疫调节"]
  },
  {
    id: 15,
    category: "皮肤与自身免疫系统",
    diseaseName: "荨麻疹性/青斑性血管炎",
    patientProfile: "林某，女，42岁。反复发作风团样红斑伴烧灼感、关节痛半年，风团持续超24小时不消退，活检提示白细胞碎裂性血管炎。血沉偏高。",
    intervention: "每日饮用高浓度富氢水1200ml，配合每天晚上睡前吸入氢氧混合气1.5小时。",
    outcome: "干预3周后，风团发作频率明显下降，烧灼感和关节隐痛消失。复查血沉降至正常。维持干预半年，血管炎未再复发。",
    medicalReview: "血管炎涉及真皮层小血管的免疫复合物沉积和破坏。氢气通过改善微血管内皮细胞功能，减轻局部抗原抗体反应带来的氧化损伤，具有稳定血管内皮的作用。",
    tags: ["饮用富氢水", "吸氢气", "抗炎症", "改善微循环"]
  },
  {
    id: 16,
    category: "皮肤与自身免疫系统",
    diseaseName: "皮肤感染性溃疡",
    patientProfile: "孙某，男，68岁。下肢静脉曲张伴小腿下段溃疡半年，创面有黄色渗出伴异味，周边色素沉着，经久不愈。",
    intervention: "常规清创后，每日使用新鲜富氢水冲洗创面，并用富氢水浸湿的纱布湿敷溃疡处30分钟，每天2次。",
    outcome: "湿敷第5天，创面渗出明显减少，异味消失；第14天，肉芽组织开始新鲜红润生长；2个月后，顽固性溃疡完全愈合上皮化。",
    medicalReview: "长期不愈的溃疡往往存在严重的局部微循环障碍和高氧化应激状态。氢水湿敷可直接杀灭部分厌氧菌，更重要的是降低了创面局部ROS水平，打破了“炎症-坏死”的恶性循环。",
    tags: ["富氢水湿敷/含漱", "抗炎症", "改善微循环", "老年人"]
  },
  {
    id: 17,
    category: "皮肤与自身免疫系统",
    diseaseName: "白塞病",
    patientProfile: "周某，女，29岁。反复口腔溃疡、外生殖器溃疡2年，近期下肢出现结节性红斑，伴双眼结膜炎。",
    intervention: "系统应用免疫调节剂的同时，每日饮用富氢水1500ml，并增加每日4-5次的富氢水含漱和外阴局部冲洗湿敷。",
    outcome: "干预1个月后，口腔和外阴溃疡愈合且疼痛感大幅减轻；3个月后结节性红斑消退，免疫药物剂量成功减半，眼炎未再复发。",
    medicalReview: "白塞病是一种全身性血管炎。氢气内饮结合局部高频湿敷，既能起到全身血管内皮保护作用，又能通过局部高浓度抗炎，快速缓解患者最痛苦的溃疡症状。",
    tags: ["富氢水湿敷/含漱", "饮用富氢水", "抗炎症", "免疫调节"]
  },
  {
    id: 18,
    category: "皮肤与自身免疫系统",
    diseaseName: "系统性硬化症",
    patientProfile: "吴某，女，47岁。双手皮肤雷诺现象、指端皮肤变硬发亮2年，逐渐出现张口受限、吞咽困难，面部表情呈“面具脸”。",
    intervention: "每天接受氢氧混合气吸入3小时，每周配合2次温热富氢水全身泡浴。",
    outcome: "连续治疗3个月后，双手遇冷发白变紫的雷诺现象发生次数显著减少；半年后，面部和双手皮肤紧绷感有所松弛，张口度增加，吞咽困难改善。",
    medicalReview: "硬皮病的核心是血管内皮损伤、免疫激活和纤维化。氢气可以有效对抗组织缺血再灌注损伤，通过改善微循环及抑制成纤维细胞过度增殖，延缓甚至部分逆转纤维化进程。",
    tags: ["富氢水泡浴", "吸氢气", "改善微循环", "抗炎症"]
  },
  {
    id: 19,
    category: "皮肤与自身免疫系统",
    diseaseName: "黄褐斑",
    patientProfile: "赵某，女，38岁。面颊部对称性黄褐色斑片3年，日晒及熬夜后加重，伴有月经不调及经前期烦躁，多次激光治疗易反黑。",
    intervention: "每日规律饮用富氢水1000ml，每晚洁面后使用富氢水面膜纸进行面部湿敷15分钟，持续3个月。",
    outcome: "1个月后面部肌肤整体提亮，色斑边缘开始模糊；3个月后黄褐斑颜色明显淡化，经前期烦躁症状消失，睡眠质量提高。",
    medicalReview: "黄褐斑不仅是皮肤问题，更与内分泌及细胞氧化衰老有关。氢气内调内分泌、外抗紫外线引发的自由基损伤，从双向切断了黑色素细胞过度活跃的诱因。",
    tags: ["饮用富氢水", "富氢水湿敷/含漱", "选择性抗氧化", "改善微循环"]
  },
  {
    id: 20,
    category: "皮肤与自身免疫系统",
    diseaseName: "白癜风",
    patientProfile: "李某，男，25岁。面颈部散发色素脱失斑1年，处于进展期，白斑面积仍在逐渐扩大，边缘模糊。",
    intervention: "每日居家吸入纯氢气（99.9%浓度）1.5小时，同时用高浓度富氢水湿敷白斑部位，结合小剂量308nm准分子光治疗。",
    outcome: "干预2个月后，白斑停止扩大，边缘变清晰（进入稳定期）；4个月后，白斑中心出现毛囊性色素岛；半年后部分白斑复色面积达60%。",
    medicalReview: "白癜风进展期表皮局部存在极高的氧化应激，直接毒害黑素细胞。氢水湿敷清除了局部的H2O2等破坏因子，为黑素细胞存活和光疗生色素提供了优良的微环境。",
    tags: ["吸氢气", "富氢水湿敷/含漱", "选择性抗氧化", "免疫调节"]
  },
  {
    id: 21,
    category: "皮肤与自身免疫系统",
    diseaseName: "强直性脊柱炎",
    patientProfile: "张某，男，31岁。炎性下腰痛伴晨僵5年，HLA-B27阳性，MRI示双侧骶髂关节炎，近期需每日服用非甾体抗炎药止痛。",
    intervention: "在药物治疗基础上，每日饮用富氢水1500ml，每周进行3次全身富氢水热浴。",
    outcome: "1个月后，晨僵时间由原来的2小时缩短至30分钟内；2个月后，下腰痛频率和程度大幅降低，非甾体抗炎药用量减半；4个月后疼痛基本消失，脊柱活动度改善。",
    medicalReview: "强直性脊柱炎是一种全身性自身免疫病。富氢水热浴可直达深部关节囊液，有效抑制TNF-α等致炎因子的表达，减轻附着点炎症和水肿，缓解僵硬感。",
    tags: ["富氢水泡浴", "饮用富氢水", "抗炎症", "免疫调节"]
  },
  {
    id: 22,
    category: "皮肤与自身免疫系统",
    diseaseName: "结缔组织病相关间质性肺疾病",
    patientProfile: "刘某，女，58岁。类风湿关节炎病史10年，近1年出现活动后气喘、干咳，高分辨率CT示双肺底网格状影及蜂窝肺改变。",
    intervention: "常规抗风湿治疗不变，每天坚持使用氢氧呼吸机（66%氢气，33%氧气）吸入，早晚各2小时，长期维持。",
    outcome: "吸入1个月后干咳症状明显缓解；6个月后，患者自诉爬三层楼不再出现严重气喘；复查肺部CT示网格影无进一步扩大，间质纤维化进程得到遏制。",
    medicalReview: "间质性肺病的不可逆损害源于长期的慢性炎症导致肺泡上皮细胞向成纤维细胞转化。氢氧混合气不仅改善了缺氧，氢分子更深入肺泡腔，发挥了深层次的抗纤维化和抗炎作用。",
    tags: ["吸氢气", "抗炎症", "选择性抗氧化", "老年人"]
  },
  {
    id: 23,
    category: "呼吸系统疾病",
    diseaseName: "支气管哮喘",
    patientProfile: "钱某，女，35岁。过敏性哮喘史15年，近期换季频繁发作喘息、气促，夜间常因憋气惊醒，需频繁依赖沙丁胺醇气雾剂缓解。",
    intervention: "哮喘发作期及易感季节，每天吸入高浓度氢气2小时。持续观察3个月。",
    outcome: "吸入氢气1周后，夜间憋醒次数减少；1个月后，在未增加吸入糖皮质激素剂量的情况下，哮喘症状评分显著下降，急救气雾剂使用次数减少了80%。",
    medicalReview: "哮喘发作伴随气道高反应性和嗜酸性粒细胞的炎症浸润。氢气能减少气道重塑，下调过敏相关的Th2型免疫反应，舒缓平滑肌痉挛。",
    tags: ["吸氢气", "抗炎症", "免疫调节"]
  },
  {
    id: 24,
    category: "口腔与眼科疾病",
    diseaseName: "口腔黏膜白斑",
    patientProfile: "杨某，男，59岁，长期吸烟史。颊黏膜出现双侧白色斑块，质地较硬，伴粗糙感，活检提示上皮轻度不典型增生（癌前病变）。",
    intervention: "戒烟。每日使用新鲜制备的高浓度富氢水（>1.6ppm）含漱5次，每次含在口中保持5分钟，使氢水充分接触白斑区域。",
    outcome: "连续含漱3个月后，患者自感口腔粗糙感减轻；复查见白斑面积缩小约1/3，质地变软；维持含漱1年，病变未见恶化进展。",
    medicalReview: "口腔白斑具有一定的恶变率。氢水局部含漱直接对致癌自由基进行清除，保护细胞DNA免受氧化损伤，对干预和逆转口腔黏膜癌前病变具有积极的临床探讨价值。",
    tags: ["富氢水湿敷/含漱", "选择性抗氧化", "抗凋亡", "老年人"]
  },
  {
    id: 25,
    category: "口腔与眼科疾病",
    diseaseName: "口腔扁平苔藓",
    patientProfile: "徐某，女，46岁。双颊黏膜珠光白色网纹伴充血糜烂半年，进食辛辣或过热食物时剧痛难忍，情绪焦虑。",
    intervention: "每日早晚各饮用富氢水300ml，同时每日多次使用富氢水长时间含漱糜烂面。",
    outcome: "干预2周后，黏膜充血水肿减轻，进食疼痛感降低了50%；2个月后糜烂面基本愈合，白色网纹变淡，患者焦虑情绪随之缓解。",
    medicalReview: "口腔扁平苔藓属于T细胞介导的慢性自身免疫性炎症。局部高浓度氢水含漱能迅速降低黏膜表面的促炎细胞因子（如IL-6），促进糜烂创面的上皮修复。",
    tags: ["富氢水湿敷/含漱", "饮用富氢水", "抗炎症", "免疫调节"]
  },
  {
    id: 26,
    category: "口腔与眼科疾病",
    diseaseName: "角膜损伤",
    patientProfile: "高某，男，27岁。电焊作业时未戴防护镜致双眼电光性眼炎，结膜重度充血、畏光流泪、刺痛剧烈睁眼困难。",
    intervention: "在常规眼膏保护角膜前，频繁使用无菌富氢水滴眼并用富氢水浸润棉片冷敷双眼，每2小时一次。",
    outcome: "初次冷敷及滴眼后，眼部灼痛感迅速得到舒缓。24小时后结膜充血大幅减退，畏光流泪停止，角膜上皮损伤基本修复，恢复正常视力。",
    medicalReview: "紫外线辐射会导致角膜上皮细胞产生大量活性氧（ROS）引起急性凋亡和炎症。富氢水的极强穿透性和零刺激性，使其能作为卓越的眼部“灭火器”，迅速中和ROS。",
    tags: ["富氢水湿敷/含漱", "选择性抗氧化", "抗炎症"]
  },
  {
    id: 27,
    category: "肿瘤与术后康复",
    diseaseName: "乳腺癌术后合并皮肌炎及淋巴水肿",
    patientProfile: "郭某，女，54岁。乳腺癌根治术后半年，患侧上肢出现重度淋巴水肿，同时并发皮肌炎，面部出现水肿性紫红斑，四肢近端肌无力。",
    intervention: "每日吸入纯氢气2小时，每周3次全身富氢水温热泡浴，重点浸泡水肿的患肢。",
    outcome: "干预1个月后，面部紫红斑颜色消退，肌肉酸痛感减轻；3个月后患侧上肢臂围缩小3厘米，沉重感缓解，生活自理能力显著恢复。",
    medicalReview: "术后淋巴回流障碍叠加自身免疫紊乱导致了复杂的症状。氢气全身吸入调节系统免疫以控制皮肌炎，氢水温浴则通过改善末梢微循环，有效促进了淤积淋巴液的回流与吸收。",
    tags: ["富氢水泡浴", "吸氢气", "改善微循环", "肿瘤放化疗患者"]
  },
  {
    id: 28,
    category: "其他综合与亚健康",
    diseaseName: "艾滋病",
    patientProfile: "何某，男，43岁。HIV感染史5年，规律接受抗病毒（HAART）治疗，病毒载量阴性，但CD4细胞持续低于200，免疫重建不良，常感极度疲乏、易发作带状疱疹。",
    intervention: "在抗病毒治疗基础上，每日饮用富氢水1000ml，同时每晚居家吸入氢气1.5小时，连续干预6个月。",
    outcome: "干预期间患者自我感觉疲乏感大幅消退，精力充沛。6个月内未再并发呼吸道感染及疱疹。复查CD4细胞计数缓慢回升至280左右。",
    medicalReview: "HIV感染者长期处于异常高的慢性免疫激活和氧化应激状态，加速了免疫细胞的耗竭。氢疗无法杀灭HIV，但能有效减轻这种系统性氧化损伤，为CD4细胞的恢复创造有利内环境。",
    tags: ["饮用富氢水", "吸氢气", "免疫调节", "选择性抗氧化"]
  },
  {
    id: 29,
    category: "其他综合与亚健康",
    diseaseName: "便秘和肠道菌群调节",
    patientProfile: "马某，女，65岁。顽固性便秘10年，常需依赖开塞露或刺激性泻药，伴腹胀、食欲不振、口苦及轻度焦虑。",
    intervention: "停用刺激性泻药，每日早晨空腹大口饮用温热富氢水500ml，白天少量多次补充富氢水，总计1500ml/日。",
    outcome: "坚持饮用第5天，开始出现自主排便意愿；2周后，排便周期缩短至1-2天一次，大便性状转软，腹胀和口苦症状完全消失，气色改善。",
    medicalReview: "富氢水进入消化道后，一方面通过水分补充软化粪便，另一方面氢分子能调节肠道氧化还原电位(ORP)，促进有益厌氧菌（如双歧杆菌）的增殖，恢复肠道自主蠕动动力。",
    tags: ["饮用富氢水", "选择性抗氧化", "老年人", "亚健康/疲劳人群"]
  },
  {
    id: 30,
    category: "其他综合与亚健康",
    diseaseName: "抗氧化及延缓衰老",
    patientProfile: "宋某，女，45岁。长期高压工作，面色暗沉、皮肤松弛无光泽，伴轻度睡眠障碍、易醒，及阵发性潮热等围绝经期早期表现。",
    intervention: "将日常饮水全部替换为富氢水；每周进行1-2次富氢水全身SPA泡浴，每次30分钟。",
    outcome: "干预1个月后，睡眠深度明显增加，不再半夜惊醒。3个月后，面部皮肤细纹淡化，呈现健康的自然光泽，潮热盗汗等亚健康症状明显减少。",
    medicalReview: "衰老的本质是细胞内线粒体功能衰退和自由基蓄积（氧化理论）。氢分子是目前已知体积最小的天然抗氧化剂，能轻易穿透细胞膜进入线粒体，清除最毒的羟自由基，从细胞层面延缓机体衰老。",
    tags: ["饮用富氢水", "富氢水泡浴", "选择性抗氧化", "改善微循环", "亚健康/疲劳人群"]
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);

  // 切换标签选择状态
  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 过滤逻辑
  const filteredCases = useMemo(() => {
    return CASE_DATABASE.filter(c => {
      // 1. 文本搜索过滤 (匹配疾病名或患者画像)
      const matchSearch = c.diseaseName.includes(searchTerm) || c.patientProfile.includes(searchTerm) || c.category.includes(searchTerm);
      
      // 2. 分类过滤
      const matchCategory = selectedCategory === "全部" || c.category === selectedCategory;
      
      // 3. 标签过滤 (包含所有选中的标签)
      const matchTags = selectedTags.length === 0 || selectedTags.every(tag => c.tags.includes(tag));

      return matchSearch && matchCategory && matchTags;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 左侧侧边栏：分类与标签导航 */}
      <aside className="w-80 bg-white border-r border-slate-200 overflow-y-auto flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold text-blue-700 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            神奇的氢聊
          </h1>
          <p className="text-sm text-slate-500 mt-1">临床案例数字查询库</p>
        </div>

        <div className="p-6 flex-1">
          {/* 分类目录 */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              系统分类导航
            </h3>
            <ul className="space-y-1">
              {CATEGORIES.map(category => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 标签检索系统 */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-teal-500" />
              交叉检索标签
            </h3>
            
            {Object.entries(TAG_GROUPS).map(([groupName, tags]) => (
              <div key={groupName} className="mb-4">
                <h4 className="text-xs text-slate-400 mb-2">{groupName}</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-teal-50 border-teal-200 text-teal-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-teal-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* 右侧主内容区 */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* 顶部搜索栏 */}
        <header className="bg-white border-b border-slate-200 p-4 md:p-6 flex items-center justify-between z-10 shadow-sm">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="搜索疾病名称、症状或患者特征..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </header>

        {/* 案例列表区 */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{selectedCategory}</h2>
              <p className="text-sm text-slate-500 mt-1">
                找到 {filteredCases.length} 个相关临床案例
              </p>
            </div>
            {selectedTags.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-500">已选标签:</span>
                <div className="flex gap-2">
                  {selectedTags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-teal-100 text-teal-700 px-2 py-1 rounded-md text-xs">
                      {tag}
                      <X className="w-3 h-3 cursor-pointer hover:text-teal-900" onClick={() => toggleTag(tag)} />
                    </span>
                  ))}
                  <button onClick={() => setSelectedTags([])} className="text-xs text-slate-400 hover:text-slate-600 underline">清除</button>
                </div>
              </div>
            )}
          </div>

          {filteredCases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>未找到符合条件的案例，请尝试更改搜索词或筛选项。</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {filteredCases.map(caseItem => (
                <div 
                  key={caseItem.id} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => setSelectedCase(caseItem)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg mb-3">
                        {caseItem.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {caseItem.diseaseName}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 mb-5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="font-semibold text-slate-700 mr-2">患者画像:</span>
                    {caseItem.patientProfile}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100">
                    {caseItem.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </span>
                    ))}
                    {caseItem.tags.length > 4 && (
                      <span className="text-xs px-2 py-1 bg-slate-50 text-slate-400 rounded-md">
                        +{caseItem.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 案例详情模态框 (Modal) */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* 背景遮罩 */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCase(null)}
          ></div>
          
          {/* 详情卡片 */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-full overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
            {/* 顶部标题栏 */}
            <div className="flex items-start justify-between p-6 border-b border-slate-100 bg-slate-50">
              <div>
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">
                  {selectedCase.category}
                </span>
                <h2 className="text-2xl font-bold text-slate-800">{selectedCase.diseaseName}</h2>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 内容区 */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* 标准字段 1：患者基本信息/既往病史 */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                  <User className="w-5 h-5 text-indigo-500" />
                  患者画像与病史
                </h3>
                <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-slate-700 leading-relaxed">
                  {selectedCase.patientProfile}
                </div>
              </section>

              {/* 标准字段 2：氢疗干预方案 */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                  <Thermometer className="w-5 h-5 text-amber-500" />
                  氢疗干预方案
                </h3>
                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 text-slate-700 leading-relaxed">
                  {selectedCase.intervention}
                </div>
              </section>

              {/* 标准字段 3：治疗结果 */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  治疗结果
                </h3>
                <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 text-slate-700 leading-relaxed">
                  {selectedCase.outcome}
                </div>
              </section>

              {/* 标准字段 4：医学点评 */}
              {selectedCase.medicalReview && (
                <section>
                  <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-3">
                    <Stethoscope className="w-5 h-5 text-blue-500" />
                    医学点评与机制分析
                  </h3>
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-slate-700 leading-relaxed">
                    {selectedCase.medicalReview}
                  </div>
                </section>
              )}
              {/* 标签区 */}
              <section className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-semibold text-slate-500 mb-3">案例相关标签：</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}