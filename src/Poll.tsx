import { useState } from 'react'
import './Poll.css'

interface Question {
  text: string
  options: string[]
}

const questions: Question[] = [
  {
    text: 'Как часто вы пользуетесь интернетом?',
    options: ['Ежедневно', 'Несколько раз в неделю', 'Раз в неделю', 'Реже'],
  },
  {
    text: 'Какую соцсеть вы используете чаще всего?',
    options: ['VK', 'Telegram', 'Instagram', 'Другое'],
  },
]

export default function Poll() {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [selected, setSelected] = useState('')

  const handleNext = () => {
    if (!selected) {
      alert('Пожалуйста, выберите вариант ответа.')
      return
    }
    const newAnswers = [...answers]
    newAnswers[current] = selected
    setAnswers(newAnswers)
    setSelected('')

    if (current < questions.length - 1) {
      setCurrent(current + 1)
    } else {
      setCurrent(current + 1) // move past last question to show results
    }
  }

  if (current >= questions.length) {
    return (
      <div className="poll">
        <h1 className="title">Спасибо за прохождение опроса!</h1>
        {answers.map((ans, i) => (
          <p key={i} className="result">
            {i + 1}. {questions[i].text} — {ans}
          </p>
        ))}
        <div className="progress">✔ Опрос завершён</div>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="poll">
      <h1 className="title">Опросник</h1>
      <h2 className="question">{q.text}</h2>
      {q.options.map((opt) => (
        <label key={opt} className="option-label">
          <input
            type="radio"
            name="answer"
            value={opt}
            checked={selected === opt}
            onChange={() => setSelected(opt)}
            className="option-input"
          />
          {opt}
        </label>
      ))}
      <div className="controls">
        <div className="progress">
          Вопрос {current + 1} из {questions.length}
        </div>
        <button id="next" onClick={handleNext}>
          {current === questions.length - 1 ? 'Завершить' : 'Далее'}
        </button>
      </div>
    </div>
  )
}
