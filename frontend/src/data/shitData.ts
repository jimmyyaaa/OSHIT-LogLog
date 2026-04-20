import type { ShapeType, ColorType, FeelingType, CauseType, LocationType } from '../types'

export const SHAPES: { code: ShapeType; icon: string; name: string; desc: string }[] = [
  { code: 'type_lumpy', icon: '🐑', name: '羊粪蛋小队', desc: '独立颗粒，有点干涩' },
  { code: 'type_ideal', icon: '🍌', name: '黄金香蕉君', desc: '光滑柔软，标准优等生' },
  { code: 'type_mushy', icon: '🥣', name: '糊糊怪', desc: '松软糊状，边界模糊' },
  { code: 'type_watery', icon: '💧', name: '水枪喷射', desc: '液态状，一泻千里' },
]

export const COLORS: { code: ColorType; icon: string; hex: string; name: string; healthNote: string }[] = [
  { code: 'color_brown', icon: '🍫', hex: '#795548', name: '巧克力棕', healthNote: '正常，完美' },
  { code: 'color_yellow', icon: '🌽', hex: '#fbc02d', name: '玉米黄', healthNote: '正常范围，可能与饮食有关' },
  { code: 'color_green', icon: '🥑', hex: '#689f38', name: '牛油果绿', healthNote: '绿叶菜吃多了？正常' },
  { code: 'color_black', icon: '⚫', hex: '#263238', name: '煤炭黑', healthNote: '提示：若持续出现，建议咨询医生' },
  { code: 'color_red', icon: '🔴', hex: '#c62828', name: '草莓红', healthNote: '提醒：请留意，必要时就医检查' },
]

export const FEELINGS: { code: FeelingType; icon: string; name: string; desc: string }[] = [
  { code: 'feel_smooth', icon: '💧', name: '畅快淋漓', desc: '一气呵成，毫无压力' },
  { code: 'feel_leftover', icon: '🤔', name: '意犹未尽', desc: '感觉没排完' },
  { code: 'feel_struggle', icon: '😤', name: '艰苦卓绝', desc: '费了好大劲' },
  { code: 'feel_explosive', icon: '💥', name: '一泻千里', desc: '速度快到失控' },
  { code: 'feel_stealth', icon: '😶', name: '无感完成', desc: '没什么特别感觉' },
]

export const CAUSES: { code: CauseType; icon: string; name: string }[] = [
  { code: 'cause_spicy', icon: '🌶️', name: '吃了辛辣' },
  { code: 'cause_caffeine_alcohol', icon: '☕', name: '咖啡/酒' },
  { code: 'cause_stress_sleep', icon: '😴', name: '熬夜/压力' },
  { code: 'cause_meds', icon: '💊', name: '药/补剂' },
  { code: 'cause_travel', icon: '✈️', name: '旅行' },
  { code: 'cause_other', icon: '🤷', name: '说不清' },
]

export const PLACES: { code: LocationType; icon: string; name: string }[] = [
  { code: 'place_home', icon: '🏠', name: '家中宝座' },
  { code: 'place_office', icon: '🏢', name: '公司战壕' },
  { code: 'place_public', icon: '🚽', name: '公共厕所' },
  { code: 'place_mall', icon: '🛍️', name: '商场驿站' },
  { code: 'place_transit', icon: '🚗', name: '交通工具上' },
  { code: 'place_outdoor', icon: '🌳', name: '户外野趣' },
]

interface Message {
  id: number
  condition: string
  text: string
}

export const MESSAGES: Message[] = [
  { id: 1, condition: 'type_ideal+feel_smooth', text: '今日出品的🍌香蕉君，标准得像教科书。建议裱起来。' },
  { id: 2, condition: 'type_ideal+place_home+cause_caffeine_alcohol', text: '在家+咖啡=肠道高铁准点发车。今日带薪拉屎KPI已完成。' },
  { id: 3, condition: 'type_lumpy+feel_struggle', text: '🐑羊粪蛋，一颗一颗地来，像老板画的大饼，碎了一地。' },
  { id: 4, condition: 'type_watery+feel_explosive', text: '💦水枪喷射，注意避让。比周一早会还让人措手不及。' },
  { id: 5, condition: 'color_black', text: '⚫煤炭黑出没。如果不是吃铁剂，请把这张截图发给医生。' },
  { id: 6, condition: 'color_red', text: '🔴红色警报！先别发朋友圈，去看医生。' },
  { id: 7, condition: 'color_green+cause_other', text: '🥑绿到发光，昨天吃了多少菠菜？比你的基金还绿。' },
  { id: 8, condition: 'place_office+feel_struggle', text: '🏢带薪拉屎像打仗，你赢了，但老板以为你在会议室对方案。' },
  { id: 9, condition: 'place_public+feel_stealth', text: '🚽公共厕所无声完成，你是忍者。省下的时间，够再摸鱼5分钟。' },
  { id: 10, condition: 'place_outdoor+feel_smooth', text: '🌳野外拉屎，回归自然。比在工位被催进度舒服多了。' },
  { id: 11, condition: 'cause_stress_sleep+feel_leftover', text: '熬夜+压力=拉不干净。身体在说：我想辞职，顺便带薪休假。' },
  { id: 12, condition: 'cause_stress_sleep+type_lumpy', text: '压力大时拉的屎都是一颗颗的，像你未完成的需求清单。' },
  { id: 13, condition: 'cause_travel', text: '✈️旅行便秘/拉稀，肠道在抗议酒店的免费早餐。出差？那是换个地方拉屎。' },
  { id: 14, condition: 'cause_spicy+type_watery', text: '🌶️昨天火锅，今天喷泉。辣得进去，辣得出来。比甲方改需求还刺激。' },
  { id: 15, condition: 'cause_caffeine_alcohol+type_watery', text: '☕咖啡一喝，肠道就开运动会。比钉钉消息还快。' },
  { id: 16, condition: 'cause_meds+color_black', text: '💊吃药拉到黑？别怕，是铁剂在给你上色。停💊就白。' },
  { id: 17, condition: 'cause_meds+type_watery', text: '药效还没到病处，先到马桶。副作用：免费冲洗肠道，还不用请假。' },
  { id: 18, condition: 'cause_travel+type_lumpy', text: '水土不服，屎都害羞得缩成小球。多喝水，它才能像你一样放开摸鱼。' },
  { id: 19, condition: 'cause_other', text: '不知道为啥拉成这样？别纠结，记录完继续打工。' },
  { id: 20, condition: 'feel_stealth', text: '拉完都没感觉，你失去了人生的一大乐趣——冲水前欣赏成果，就像验收项目。' },
  { id: 21, condition: 'feel_smooth', text: '这一拉，拉走了今日所有烦恼。建议列为带薪拉屎标杆案例。' },
  { id: 22, condition: 'feel_leftover', text: '感觉没拉完，就像周五下班前突然来的需求。明天请早。' },
  { id: 23, condition: 'type_ideal+feel_stealth', text: '完美的🍌香蕉君，悄悄来，悄悄走。深藏功与名，就像从不加班的同事。' },
  { id: 24, condition: 'default', text: '记录成功！你的每一次拉屎，都在为打工人的肠道数据做贡献。' },
  { id: 25, condition: 'place_transit+feel_stealth', text: '🚗在交通工具上无感拉完？你是特种兵。下车记得检查座位，别给保洁添麻烦。' },
  { id: 26, condition: 'place_transit+feel_explosive', text: '✈️在飞机/车上喷射？愿上帝保佑你旁边的乘客，以及你的年终奖。' },
]

/**
 * Match the best message based on the selected entry.
 * A message matches if all tokens in its condition appear in the selected codes.
 * Prefer messages with more matching tokens (more specific).
 */
export function matchMessage(selected: {
  shape: ShapeType | null
  color: ColorType | null
  feeling: FeelingType | null
  causes: CauseType[]
  place: LocationType | null
}): string {
  const codes = new Set<string>()
  if (selected.shape) codes.add(selected.shape)
  if (selected.color) codes.add(selected.color)
  if (selected.feeling) codes.add(selected.feeling)
  if (selected.place) codes.add(selected.place)
  for (const c of selected.causes) codes.add(c)

  let best: Message | null = null
  let bestSpecificity = -1

  for (const m of MESSAGES) {
    if (m.condition === 'default') continue
    const tokens = m.condition.split('+')
    const allMatch = tokens.every((t) => codes.has(t))
    if (allMatch && tokens.length > bestSpecificity) {
      best = m
      bestSpecificity = tokens.length
    }
  }

  return best ? best.text : MESSAGES.find((m) => m.condition === 'default')!.text
}
