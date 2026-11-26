export interface EncounterContent {
  heading: string
  description: string
  hero?: string
  gallery: { image: string; caption: string }[]
  highlights: { title: string; description: string; image?: string }[]
  days: { title: string; steps: { time: string; title: string; description: string }[] }[]
  included: string[]
  excluded: string[]
  faq: { question: string; answer: string }[]
}

export const encounterContent: Partial<Record<string, EncounterContent>> = {
  "beijing-tcm-pulse-acupuncture": {
    "heading": "The Doctor WhoReads Your Wrist",
    "description": "50 seconds of silence. Three fingers on your wrist. Pulse diagnosis, acupuncture, and cupping at a renowned TCM hospital in Beijing.",
    "hero": "detail/tcm-pulse",
    "gallery": [
      {
        "image": "detail/tcm-pulse",
        "caption": "Pulse Diagnosis · 把脉"
      },
      {
        "image": "detail/tcm-acupuncture",
        "caption": "Acupuncture · 针灸"
      },
      {
        "image": "detail/tcm-cupping",
        "caption": "Cupping · 拔罐"
      },
      {
        "image": "detail/tcm-moxibustion",
        "caption": "Moxibustion · 艾灸"
      }
    ],
    "highlights": [
      {
        "title": "Pulse Diagnosis",
        "description": "Three fingers on your wrist. 12 pulse positions, each mapped to an organ system. In 50 seconds, she reads your constitution and imbalances.",
        "image": "detail/tcm-pulse"
      },
      {
        "title": "Acupuncture",
        "description": "10-15 hair-thin needles along meridians from your diagnosis. A dull ache, then warmth, then deep rest. 20 minutes. The doctor stays throughout.",
        "image": "detail/tcm-acupuncture"
      },
      {
        "title": "Cupping & Moxibustion",
        "description": "Fire cups on your back to release tension and draw out toxins. Then moxibustion to warm meridians. Marks fade in a week — relief lasts longer.",
        "image": "detail/tcm-cupping"
      }
    ],
    "days": [
      {
        "title": "Your visit",
        "steps": [
          {
            "time": "14:00 · Arrival",
            "title": "Meet your guide at the hospital",
            "description": "Bilingual LVYV guide at the International Department entrance. Pre-registered — no queue. 国际部入口集合 · 预先登记"
          },
          {
            "time": "14:15 · Consultation",
            "title": "50-second pulse diagnosis",
            "description": "Three fingers on your wrist. 12 positions, each mapped to an organ. She explains what she found — in English. 把脉 · 12个脉搏位置 · 对应脏腑"
          },
          {
            "time": "14:30 · Treatment",
            "title": "Acupuncture + cupping",
            "description": "10-15 personalized acupuncture points, 20 min rest. Then fire cupping — 6-8 cups for 10 min. 针灸 · 10-15穴位 · 留针20分钟 · 拔罐"
          },
          {
            "time": "15:30 · Report & Aftercare",
            "title": "English report + 7-day support",
            "description": "Written English report on your phone — diagnosis, treatment, recommendations. Herbal tea in the recovery lounge. 7-day WhatsApp aftercare. 英文报告 · 7天随访支持"
          }
        ]
      }
    ],
    "included": [
      "Pulse diagnosis by licensed TCM doctor",
      "Acupuncture — personalized point selection",
      "Cupping + moxibustion therapy",
      "English-speaking guide throughout",
      "English diagnosis report same day",
      "7-day aftercare via WhatsApp",
      "Hospital registration pre-arranged"
    ],
    "excluded": [
      "Flights and visas (240-hour transit visa-free available)",
      "Hotel accommodation (partner hotels nearby)",
      "Herbal prescriptions to take home",
      "Additional therapies beyond the 3 included",
      "Personal travel insurance"
    ],
    "faq": [
      {
        "question": "Does it hurt?",
        "answer": "Needles are 0.2mm — thinner than a human hair. Most feel a brief dull ache, then warmth. Cupping marks are painless and fade in 7 days. 90% of first-timers say it hurt less than expected."
      },
      {
        "question": "Do I need to speak Chinese?",
        "answer": "No. Your LVYV guide translates everything. The final report is in English."
      },
      {
        "question": "Is this a real hospital?",
        "answer": "We partner with one of Beijing's most renowned TCM hospitals. The doctors are licensed practitioners with years of clinical experience and a dedicated international department."
      },
      {
        "question": "Can I use the report back home?",
        "answer": "Yes. The English report includes diagnosis, treatment, and recommendations. Many clients share it with their GP as a preventative care roadmap."
      }
    ]
  },
}
