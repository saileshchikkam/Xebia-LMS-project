import React, { useState, useMemo } from 'react';
import { Course } from '../types';
import { COURSES } from '../data';
import { Search, SlidersHorizontal, BookOpen, Clock, Star, Award, GraduationCap, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';

interface CourseCatalogProps {
  onEnroll: (courseId: string) => void;
  enrolledCourseIds: string[];
  courseCompletion: Record<string, number>;
  onSelectCourse: (course: Course) => void;
  searchQuery: string;
}

export default function CourseCatalog({
  onEnroll,
  enrolledCourseIds,
  courseCompletion,
  onSelectCourse,
  searchQuery: initialSearchQuery
}: CourseCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  // Categories list
  const categories = ['All', 'Cloud', 'DevOps', 'Agile & Scrum', 'Data & AI', 'Software Engineering', 'Product Management'];
  
  // Levels list
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Sync initial search query if changed
  React.useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  // Filtered courses memo
  const filteredCourses = useMemo(() => {
    return COURSES.filter((course) => {
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
      
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skillsAcquired.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [selectedCategory, selectedLevel, searchQuery]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8" id="catalog-section">
      
      {/* Title block with live animated light theme banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#681D5F]/10 via-purple-50/50 to-indigo-50 border border-purple-100 p-8 mb-10 text-left shadow-sm" id="catalog-header-card">
        {/* Subtle, beautiful live background animation for the catalog */}
        <XebiaLiveBackground variant="light" interactive={false} />
        
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#681D5F]/10 border border-[#681D5F]/20 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#681D5F]">
            Interactive Library
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-slate-900">
            Professional <span className="font-bold bg-gradient-to-r from-[#681D5F] to-purple-600 bg-clip-text text-transparent">Course Library</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-600 font-serif italic max-w-xl">
            Curated by senior Xebia global practitioners to build production-ready digital capabilities, systems architecting, and hands-on engineering excellence.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="space-y-6 lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 xebia-card-shadow h-fit sticky top-20" id="catalog-filters-sidebar">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-[#1A1A1B] flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-xebia-purple" />
              <span>Filter Catalog</span>
            </h3>
            {(selectedCategory !== 'All' || selectedLevel !== 'All' || searchQuery !== '') && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-xebia-orange hover:underline cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search Sub-bar */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Search Courses</label>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type keywords..."
                className="w-full bg-slate-50/50 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-xebia-purple/50 focus:border-xebia-purple/50"
              />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 font-mono">Topic Stream</label>
            <div className="flex flex-wrap lg:flex-col gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-left text-xs font-medium px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FAF0FA] text-xebia-purple font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Levels Select */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono">Expertise Level</label>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`text-center lg:text-left text-xs font-medium px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? 'bg-[#681D5F] text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt/Info Badge */}
          <div className="rounded-xl bg-[#FAF0FA] p-3.5 border border-purple-100/50">
            <span className="block text-xs font-bold text-xebia-purple">Ready to Certify?</span>
            <span className="block text-[10.5px] text-purple-700/80 mt-1 leading-normal font-serif italic">
              Complete any catalog course path to unlock verifiable skills certificates.
            </span>
          </div>
        </div>

        {/* Catalog List Grid */}
        <div className="lg:col-span-3 space-y-6" id="catalog-courses-grid-container">
          <div className="flex items-center justify-between pb-2">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Showing <span className="text-[#1A1A1B] font-bold">{filteredCourses.length}</span> courses
            </p>
          </div>

          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 xebia-card-shadow text-center px-4">
              <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                <Search className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-[#1A1A1B]">No courses match your query</h4>
              <p className="text-xs text-gray-400 max-w-sm mt-1 leading-relaxed font-serif italic">
                Try modifying your search keywords or resetting topic and level filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                  setSearchQuery('');
                }}
                className="mt-4 bg-[#1A1A1B] hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredCourses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  const progress = courseCompletion[course.id] || 0;

                  return (
                    <motion.div
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white xebia-card-shadow xebia-card-hover h-full"
                      id={`course-card-${course.id}`}
                    >
                      {/* Cover image & Category badge */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="rounded-md bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-[#1A1A1B] shadow-sm uppercase tracking-wider">
                            {course.category}
                          </span>
                        </div>
                        {isEnrolled && (
                          <div className="absolute bottom-3 right-3 rounded-lg bg-emerald-500/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-white shadow-sm flex items-center space-x-1">
                            <Check className="h-3 w-3" />
                            <span>Enrolled</span>
                          </div>
                        )}
                      </div>

                      {/* Course Content block */}
                      <div className="flex flex-col flex-1 p-5 text-left">
                        
                        {/* Rating and Level */}
                        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 mb-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            course.level === 'Beginner' ? 'bg-blue-50 text-blue-600' :
                            course.level === 'Intermediate' ? 'bg-amber-50 text-amber-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {course.level}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-[#1A1A1B] font-bold">{course.rating}</span>
                            <span className="text-[10px]">({course.reviewsCount})</span>
                          </div>
                        </div>

                        {/* Course Title */}
                        <h4 className="font-display text-base font-bold text-[#1A1A1B] line-clamp-1 group-hover:text-xebia-purple transition-colors cursor-pointer" onClick={() => onSelectCourse(course)}>
                          {course.title}
                        </h4>

                        {/* Course Description */}
                        <p className="mt-2 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        {/* Duration and lessons count */}
                        <div className="mt-4 flex items-center space-x-4 border-t border-gray-50 pt-3 text-[11px] font-medium text-gray-400">
                          <span className="flex items-center space-x-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{course.duration}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{course.lessonsCount} chapters</span>
                          </span>
                        </div>

                        {/* Skill acquired tags (compact) */}
                        <div className="mt-3 flex flex-wrap gap-1">
                          {course.skillsAcquired.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-gray-50 text-gray-600 text-[9.5px] font-semibold px-2 py-0.5 rounded-md">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Progress Bar if enrolled */}
                        {isEnrolled && (
                          <div className="mt-4">
                            <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1">
                              <span>Completed</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-xebia-purple h-full transition-all duration-300" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Action CTA Buttons */}
                        <div className="mt-5 pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
                          <button
                            onClick={() => onSelectCourse(course)}
                            className="text-xs font-semibold text-gray-500 hover:text-[#1A1A1B] flex items-center space-x-0.5 transition-colors cursor-pointer"
                          >
                            <span>View Syllabus</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>

                          {isEnrolled ? (
                            <button
                              onClick={() => onSelectCourse(course)}
                              className="bg-[#1A1A1B] hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                            >
                              Resume
                            </button>
                          ) : (
                            <button
                              onClick={() => onEnroll(course.id)}
                              className="bg-xebia-purple hover:bg-xebia-purple/95 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm cursor-pointer"
                            >
                              Enroll Now
                            </button>
                          )}
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </section>
  );
}
