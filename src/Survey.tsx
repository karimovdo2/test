import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from './firebase'
import { QUESTIONS } from './questions'
import type { Question } from './questions'

export default function Survey() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(QUESTIONS.length).fill(''))
  const [code, setCode] = useState<string | null>(null)
  const q: Question | undefined = QUESTIONS[step]

  const handleNext = async () => {
    if (!answers[step]) return alert('Выберите вариант')
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      const randomCode = Math.floor(1000 + Math.random() * 9000).toString()
      await addDoc(collection(db, 'patients'), { code: randomCode, createdAt: Date.now(), answers })
      setCode(randomCode)
    }
  }

  if (code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8 space-y-4 text-center">
          <h1 className="text-2xl font-bold">Спасибо за участие!</h1>
          <p>Ваш код: <b className="font-mono">{code}</b></p>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">SF-36 Опросник</h1>
        <h2 className="text-xl font-semibold mb-4">{q.text}</h2>
        {q.options.map((opt) => (
          <label key={opt} className="block mb-3 cursor-pointer hover:scale-105 transition">
            <input
              type="radio"
              name="answer"
              className="mr-2 accent-indigo-600"
              checked={answers[step] === opt}
              onChange={() => setAnswers(a => { const b=[...a]; b[step]=opt; return b })}
            />
            {opt}
          </label>
        ))}
        <div className="mt-6 flex justify-between items-center">
          <span className="text-sm text-gray-500">Вопрос {step + 1} из {QUESTIONS.length}</span>
          <button onClick={handleNext} className="bg-indigo-600 text-white py-2 px-6 rounded-xl shadow hover:bg-indigo-700 transition">
            {step === QUESTIONS.length - 1 ? 'Завершить' : 'Далее'}
          </button>
        </div>
      </div>
    </div>
  )
}
