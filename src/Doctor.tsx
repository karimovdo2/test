import { useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import { QUESTIONS } from './questions'

export default function Doctor() {
  const [code, setCode] = useState('')
  const [answers, setAnswers] = useState<string[] | null>(null)

  const fetchAnswers = async () => {
    const q = query(collection(db, 'patients'), where('code', '==', code))
    const snap = await getDocs(q)
    if (snap.empty) return alert('Ничего не найдено')
    const data = snap.docs[0].data() as any
    setAnswers(data.answers as string[])
  }

  const score = answers ? answers.reduce((n, a) => n + (a ? 1 : 0), 0) : 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center">Результаты</h1>
        <div className="flex space-x-2">
          <input value={code} onChange={e => setCode(e.target.value)} className="border p-2 flex-1 rounded" placeholder="Код пациента" />
          <button onClick={fetchAnswers} className="bg-indigo-600 text-white px-4 rounded">Поиск</button>
        </div>
        {answers && (
          <div className="space-y-2">
            <div className="font-semibold">Баллы: {score}</div>
            {answers.map((a, i) => (
              <div key={i}>{i + 1}. {QUESTIONS[i].text} — <b>{a}</b></div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
