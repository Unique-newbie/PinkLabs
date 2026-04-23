'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FAQ({ faqs }: { faqs: any[] }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <section id="faq" className="py-28 bg-white relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto w-fit">FAQ</div>
          <h2 className="section-title mb-5">Common Questions</h2>
          <p className="section-subtitle mx-auto">Everything you need to know about starting your project with us.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.id || i} question={faq.question} answer={faq.answer} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AccordionItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen 
          ? 'border-brand-200/50 bg-brand-50/30 shadow-sm shadow-brand-500/5' 
          : 'border-surface-100 bg-surface-50/50 hover:border-surface-200 hover:bg-surface-50'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
      >
        <h3 className={`text-base font-semibold pr-4 transition-colors duration-200 font-display ${
          isOpen ? 'text-brand-700' : 'text-surface-900'
        }`}>
          {question}
        </h3>
        <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${
          isOpen ? 'rotate-180 text-brand-500' : 'text-surface-400'
        }`} />
      </button>
      
      <div className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}>
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-surface-600 text-sm leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
