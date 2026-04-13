import { useMemo, useState } from 'react'
import { useLogContext } from '../../context/LogContext'
import Modal from '../../components/Modal/Modal'
import ReportModal from '../../components/Report/ReportModal'

const INFO_CONTENT: Record<string, { title: string; body: string }> = {
  privacy: {
    title: '隐私政策',
    body: 'LogLog 非常重视你的隐私。所有健康数据仅存储在服务器数据库中，不会分享给任何第三方。你可以随时删除自己的数据。分享功能始终为手动触发，绝不会自动上传或公开你的任何信息。',
  },
  tips: {
    title: '健康小贴士',
    body: '1. 每天保持充足的水分摄入（建议 1.5-2L）\n\n2. 多吃富含膳食纤维的食物，如蔬菜、水果和全谷物\n\n3. 保持规律的作息时间，减少熬夜\n\n4. 适当运动有助于促进肠道蠕动\n\n5. 减少压力，保持心情愉悦\n\n6. 如果连续出现异常，建议及时就医',
  },
  feedback: {
    title: '反馈',
    body: '我们非常期待听到你的声音！如果你有任何建议、发现了问题或者只是想聊聊，欢迎通过以下方式联系我们：\n\n邮箱：feedback@loglog.app\n\n感谢你使用 LogLog，你的反馈是我们前进的动力。',
  },
  about: {
    title: '关于',
    body: 'LogLog — Give a SHIT to Myself\n\n一款伪装成厕所幽默 App 的健康追踪工具。看似荒诞，实则认真。\n\n我们相信，当记录变得有趣，它就不再是负担，而是一种日常仪式。每一次记录，都是对自己身体的一次关心。\n\n版本：1.0.0',
  },
}

export default function ProfilePage() {
  const { entries } = useLogContext()
  const [reportOpen, setReportOpen] = useState(false)
  const [infoKey, setInfoKey] = useState<string | null>(null)

  const { memberDays, totalPoints } = useMemo(() => {
    if (entries.length === 0) return { memberDays: 0, totalPoints: 0 }

    const firstEntry = new Date(entries[0].timestamp)
    const now = new Date()
    const days = Math.floor((now.getTime() - firstEntry.getTime()) / (1000 * 60 * 60 * 24)) + 1

    let points = 0
    const loggedDates = new Set<string>()
    let hasLoggedBanana = false

    const sortedEntries = [...entries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    for (const entry of sortedEntries) {
      const dateStr = new Date(entry.timestamp).toISOString().slice(0, 10)
      const isFirstOfDay = !loggedDates.has(dateStr)

      if (isFirstOfDay) {
        loggedDates.add(dateStr)
        points += 1

        let streak = 0
        const d = new Date(dateStr)
        while (true) {
          const key = d.toISOString().slice(0, 10)
          if (loggedDates.has(key)) {
            streak++
            d.setDate(d.getDate() - 1)
          } else break
        }
        if (streak === 3) points += 3
        if (streak === 7) points += 7
        if (streak === 30) points += 30
      }

      if (entry.shape === 'banana_bro' && !hasLoggedBanana) {
        hasLoggedBanana = true
        points += 5
      }
    }

    return { memberDays: days, totalPoints: points }
  }, [entries])

  const secondaryItems = [
    { key: 'privacy', label: '隐私政策' },
    { key: 'tips', label: '健康小贴士' },
    { key: 'feedback', label: '反馈' },
    { key: 'about', label: '关于' },
  ]

  const currentInfo = infoKey ? INFO_CONTENT[infoKey] : null

  return (
    <div className="px-5 pt-12">
      <h1 className="font-display text-[34px] font-bold leading-[1.07] tracking-[-0.28px]">
        我的
      </h1>

      {/* User info card */}
      <div className="mt-5 rounded-large bg-white p-5">
        <p className="text-[17px] font-semibold tracking-[-0.374px]">
          LogLog 用户
        </p>
        <p className="mt-0.5 text-[14px] tracking-[-0.224px] text-text-tertiary">
          已加入 {memberDays} 天
        </p>
        <p className="mt-2 font-display text-[24px] font-bold leading-[1.14] text-apple-blue">
          {totalPoints} SHIT Points
        </p>
      </div>

      {/* Primary actions */}
      <div className="mt-4 space-y-2.5">
        <button
          onClick={() => setReportOpen(true)}
          className="w-full rounded-large bg-near-black px-4 py-3.5 text-[17px] font-normal tracking-[-0.374px] text-white transition-colors active:bg-dark-surface-4"
        >
          生成周报
        </button>
        <button className="w-full rounded-large bg-apple-blue px-4 py-3.5 text-[17px] font-normal tracking-[-0.374px] text-white transition-colors active:bg-apple-blue/90">
          领取积分
        </button>
      </div>

      {/* Secondary links */}
      <div className="mt-6 overflow-hidden rounded-large bg-white">
        {secondaryItems.map((item, i) => (
          <button
            key={item.key}
            onClick={() => setInfoKey(item.key)}
            className={`flex w-full items-center justify-between px-5 py-3.5 text-left text-[17px] tracking-[-0.374px] active:bg-light-gray ${
              i < secondaryItems.length - 1 ? 'border-b border-black/5' : ''
            }`}
          >
            <span>{item.label}</span>
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="text-text-tertiary">
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Report modal */}
      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        entries={entries}
      />

      {/* Info modals */}
      <Modal
        open={!!currentInfo}
        onClose={() => setInfoKey(null)}
        title={currentInfo?.title ?? ''}
      >
        <p className="whitespace-pre-line text-[15px] leading-[1.47] tracking-[-0.374px] text-text-secondary">
          {currentInfo?.body}
        </p>
      </Modal>
    </div>
  )
}
