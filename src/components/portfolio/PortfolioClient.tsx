'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, ExternalLink, Code2, Link as LinkIcon, Info, Sparkles } from 'lucide-react'

type Project = {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  image_url: string
  project_url?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.25 }
  }
}

export function PortfolioClient({ initialProjects }: { initialProjects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [selectedProject])

  const categories = useMemo(() => {
    if (!initialProjects) return ['All']
    const cats = Array.from(new Set(initialProjects.map(p => p.category).filter(Boolean)))
    return ['All', ...cats.sort()]
  }, [initialProjects])

  const filteredProjects = useMemo(() => {
    if (!initialProjects) return []
    if (activeCategory === 'All') return initialProjects
    return initialProjects.filter(p => p.category === activeCategory)
  }, [initialProjects, activeCategory])

  if (!initialProjects || initialProjects.length === 0) {
    return (
      <div className="text-center py-20 bg-surface-50 rounded-3xl border-2 border-dashed border-surface-200">
        <Info className="w-10 h-10 text-surface-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-surface-900 mb-2 font-display">No projects found</h3>
        <p className="text-surface-500">Run <code className="text-brand-600">seed-data.sql</code> to populate this page.</p>
      </div>
    )
  }

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-brand-600 to-purple-600 text-white shadow-lg shadow-brand-600/20'
                : 'bg-white text-surface-500 border border-surface-200 hover:border-brand-300 hover:text-brand-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              variants={cardVariants}
              layout
              key={project.id}
              onClick={() => setSelectedProject(project)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-surface-100 hover:border-brand-200/50 transition-all duration-500 flex flex-col relative hover-lift"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-100">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-100">
                    <Code2 className="w-12 h-12 text-surface-300" />
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Hover content */}
                <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
                      <Sparkles className="w-3 h-3" />
                      View Case Study
                    </span>
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-bold text-surface-800 shadow-sm">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-surface-900 mb-2 group-hover:text-brand-600 transition-colors duration-300 font-display">
                  {project.title}
                </h3>
                <p className="text-sm text-surface-500 leading-relaxed mb-5 line-clamp-2 flex-1">
                  {project.description}
                </p>
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-surface-50">
                    {project.tags.slice(0, 4).map((tag: string) => (
                      <span key={tag} className="px-2.5 py-1 bg-surface-50 text-surface-500 text-[11px] font-semibold tracking-wide uppercase rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-surface-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Close */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 z-20 p-2.5 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white rounded-full transition-all duration-200 hover:scale-110"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero Image */}
              <div className="w-full aspect-[21/9] bg-surface-100 relative shrink-0 overflow-hidden">
                {selectedProject.image_url ? (
                  <img
                    src={selectedProject.image_url}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-surface-200">
                    <Code2 className="w-20 h-20 text-surface-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 sm:p-12 w-full">
                  <span className="text-xs font-bold text-brand-300 uppercase tracking-widest bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full inline-block mb-4">
                    {selectedProject.category}
                  </span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-display">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 sm:p-12 overflow-y-auto">
                <div className="grid md:grid-cols-3 gap-10">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold text-surface-900 mb-5 flex items-center gap-2 font-display">
                      <Info className="w-5 h-5 text-brand-600" />
                      About the Project
                    </h3>
                    <div className="prose prose-pink prose-sm sm:prose-base text-surface-600 leading-relaxed whitespace-pre-wrap">
                      {selectedProject.description}
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Tech Stack */}
                    {selectedProject.tags && selectedProject.tags.length > 0 && (
                      <div className="bg-surface-50 p-6 rounded-2xl border border-surface-100">
                        <h4 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
                          <Code2 className="w-4 h-4 text-surface-400" /> Tech Stack
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProject.tags.map(tag => (
                            <span key={tag} className="px-3 py-1.5 bg-white border border-surface-200 text-surface-700 text-xs font-semibold rounded-lg shadow-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    <div className="bg-surface-50 p-6 rounded-2xl border border-surface-100">
                      <h4 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-4 flex items-center gap-2 font-display">
                        <LinkIcon className="w-4 h-4 text-surface-400" /> Links
                      </h4>
                      {selectedProject.project_url ? (
                        <a
                          href={selectedProject.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 px-5 py-3 rounded-xl transition-all duration-300 w-full justify-center shadow-lg shadow-brand-600/20"
                        >
                          Visit Live Project <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <p className="text-sm text-surface-400 italic text-center py-3 bg-surface-100 rounded-xl">Internal Project / N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
