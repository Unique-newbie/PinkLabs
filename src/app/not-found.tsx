import Link from 'next/link'
import { ArrowLeft, Home, Code2 } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern-dark" />
      <div className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full bg-brand-600/15 blur-[150px] animate-glow-pulse" />
      
      <div className="text-center max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl p-3">
            <Code2 className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-8xl font-black text-gradient-animated font-display mb-4 leading-none">404</div>
        <h1 className="text-3xl font-extrabold text-white mb-3 font-display">Page not found</h1>
        <p className="text-surface-400 mb-10 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold rounded-full hover:from-brand-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-brand-600/20 hover:-translate-y-0.5"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 glass-panel-dark text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
}
