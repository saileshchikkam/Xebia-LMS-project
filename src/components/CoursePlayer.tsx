import React, { useState } from 'react';
import { Course, UserProgress } from '../types';
import { PlayCircle, FileText, CheckCircle, HelpCircle, ArrowLeft, ChevronRight, Check, MessageSquare, BookOpen, Clock, StickyNote, HelpCircle as HelpIcon, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CoursePlayerProps {
  course: Course;
  userProgress: UserProgress;
  onMarkLessonComplete: (lessonId: string, complete: boolean) => void;
  onBackToCatalog: () => void;
}

export default function CoursePlayer({
  course,
  userProgress,
  onMarkLessonComplete,
  onBackToCatalog
}: CoursePlayerProps) {
  // Find first uncompleted lesson, or default to first lesson
  const allLessons = course.syllabus.flatMap(mod => mod.lessons);
  const firstUncompleted = allLessons.find(les => !userProgress.completedLessons.includes(les.id)) || allLessons[0];
  
  const [activeLesson, setActiveLesson] = useState(firstUncompleted || allLessons[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'discussion'>('overview');
  const [notesText, setNotesText] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(`xebia-lms-notes-${course.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [currentNote, setCurrentNote] = useState(notesText[activeLesson.id] || '');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<string | null>(null);

  // Sync notes when active lesson changes
  React.useEffect(() => {
    setCurrentNote(notesText[activeLesson.id] || '');
    setQuizSubmitted(null);
    setQuizAnswers({});
  }, [activeLesson]);

  // Handle Note Save
  const handleSaveNote = () => {
    const updated = { ...notesText, [activeLesson.id]: currentNote };
    setNotesText(updated);
    localStorage.setItem(`xebia-lms-notes-${course.id}`, JSON.stringify(updated));
  };

  const isLessonCompleted = (lessonId: string) => userProgress.completedLessons.includes(lessonId);

  const handleNextLesson = () => {
    // Mark current lesson as completed first if it's not
    if (!isLessonCompleted(activeLesson.id)) {
      onMarkLessonComplete(activeLesson.id, true);
    }
    
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(allLessons[currentIndex - 1]);
    }
  };

  // Quick 3 questions for mini quizzes
  const mockQuizQuestions = [
    { question: 'What is the main driver behind Scrum empiricism?', options: ['Detailed plans', 'Rigid sprint milestones', 'Transparency, Inspection, and Adaptation', 'Command structures'], correct: 2 },
    { question: 'Which AWS element routes internet traffic safely into public subnets?', options: ['NAT Gateway', 'Internet Gateway', 'VPC Peering', 'IAM Security Group'], correct: 1 },
    { question: 'What rendering optimization hook does React 19 introduce automatically?', options: ['useMemo', 'useCallback', 'The React Compiler engine', 'useActionState'], correct: 2 }
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="course-player-container">
      
      {/* Back to Catalog Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          id="player-back-to-catalog"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Library Catalog</span>
        </button>
        <span className="text-xs text-slate-400 font-medium">
          Category: <span className="text-slate-700 font-bold uppercase">{course.category}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Video Player, Reader Panel & Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Content Window */}
          <div className="bg-white rounded-2xl border border-slate-100 xebia-card-shadow overflow-hidden text-left" id="player-active-window">
            
            {/* Header of Active Lesson */}
            <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="rounded-lg bg-white/10 p-2">
                  {activeLesson.type === 'video' ? (
                    <PlayCircle className="h-5 w-5 text-xebia-orange" />
                  ) : activeLesson.type === 'quiz' ? (
                    <HelpCircle className="h-5 w-5 text-amber-400" />
                  ) : (
                    <FileText className="h-5 w-5 text-purple-400" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] text-purple-400 uppercase font-extrabold tracking-wider">
                    Now Studying ({activeLesson.type})
                  </span>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{activeLesson.title}</h3>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-400">{activeLesson.duration}</span>
                {isLessonCompleted(activeLesson.id) && (
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 text-[10px] font-bold flex items-center space-x-1">
                    <Check className="h-3 w-3" />
                    <span>Done</span>
                  </span>
                )}
              </div>
            </div>

            {/* Content Switcher body */}
            <div className="p-6 md:p-8 min-h-[380px] bg-slate-50/50 flex flex-col justify-between">
              
              {/* VIDEO TYPE */}
              {activeLesson.type === 'video' && (
                <div className="space-y-6">
                  {/* Mock Video Aspect-ratio box */}
                  <div className="relative aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 overflow-hidden group shadow-lg">
                    {/* Abstract tech waves as placeholder background */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(94,38,229,0.15),transparent)] pointer-events-none" />
                    
                    {/* Centered play icon */}
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white group-hover:scale-110 transition-transform cursor-pointer">
                      <PlayCircle className="h-8 w-8 text-xebia-orange fill-xebia-orange" />
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-white/80 text-xs">
                      <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md font-mono">0:00 / {activeLesson.duration}</span>
                      <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-md font-semibold flex items-center space-x-1">
                        <Sparkles className="h-3 w-3 text-xebia-orange" />
                        <span>HD (1080p)</span>
                      </span>
                    </div>
                  </div>

                  <div className="prose prose-slate max-w-none">
                    <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Lecture Notes Summary</h5>
                    <p className="text-xs text-slate-500 leading-relaxed bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
                      {activeLesson.content || 'This lecture explores core engineering principles, production designs, and industrial case studies validated by Xebia mentors.'}
                    </p>
                  </div>
                </div>
              )}

              {/* READING TYPE */}
              {activeLesson.type === 'reading' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center space-x-2 text-xebia-purple">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Required Technical Reading</span>
                  </div>

                  <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                    <p className="font-bold text-slate-800 text-sm">Overview of Core Architectures</p>
                    <p>
                      {activeLesson.content || 'Enterprise applications require rigorous architectural structures, thorough configuration audits, and solid fault-tolerance designs.'}
                    </p>
                    <p>
                      When implementing this pattern, teams must strictly segregate control variables, avoid static cross-resource bindings, and ensure stateless scaling boundaries. This is standard practice in cloud-native paradigms.
                    </p>
                    <div className="bg-orange-50/50 border-l-4 border-xebia-orange p-3.5 rounded-r-lg text-slate-700 text-[11px] font-medium leading-normal">
                      <strong>Xebia Insight:</strong> Always keep monitoring, configuration, and state storage strictly separated. Combining these usually leads to high-friction single-point-of-failure issues.
                    </div>
                  </div>
                </div>
              )}

              {/* QUIZ TYPE */}
              {activeLesson.type === 'quiz' && (
                <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
                  <div className="flex items-center space-x-2 text-amber-500">
                    <HelpIcon className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Lecture Quiz Assessment</span>
                  </div>

                  {quizSubmitted ? (
                    <div className="text-center py-6 space-y-4">
                      <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-800">Quiz Completed Successfully!</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Excellent job! You answered the module review check correctly. This chapter is now unlocked in your learning registry.
                      </p>
                      <button
                        onClick={() => {
                          setQuizSubmitted(null);
                          setQuizAnswers({});
                          onMarkLessonComplete(activeLesson.id, true);
                        }}
                        className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        Confirm completion
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4 text-left">
                      <span className="block text-xs font-bold text-slate-700">
                        Question: {mockQuizQuestions[0].question}
                      </span>
                      <div className="space-y-2">
                        {mockQuizQuestions[0].options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setQuizAnswers({ ...quizAnswers, 'q1': i })}
                            className={`w-full text-left text-xs p-3.5 rounded-xl border transition-all cursor-pointer ${
                              quizAnswers['q1'] === i
                                ? 'border-xebia-purple bg-purple-50 text-purple-950 font-semibold'
                                : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (quizAnswers['q1'] !== undefined) {
                            setQuizSubmitted('done');
                          }
                        }}
                        disabled={quizAnswers['q1'] === undefined}
                        className={`w-full font-bold text-xs py-3 rounded-xl transition-all ${
                          quizAnswers['q1'] !== undefined
                            ? 'bg-xebia-purple text-white cursor-pointer shadow-md'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Lower Navigation Controls */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={handlePrevLesson}
                  disabled={allLessons.findIndex(l => l.id === activeLesson.id) === 0}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous Chapter
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onMarkLessonComplete(activeLesson.id, !isLessonCompleted(activeLesson.id))}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isLessonCompleted(activeLesson.id)
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {isLessonCompleted(activeLesson.id) ? (
                      <span className="flex items-center space-x-1">
                        <Check className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span>Mark Complete</span>
                    )}
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="px-4 py-2 text-xs font-bold rounded-lg bg-xebia-purple text-white hover:bg-xebia-purple/95 transition-all shadow-sm flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Tabbed Interactive Information (Overview, Notes, Discussions) */}
          <div className="bg-white rounded-2xl border border-slate-100 xebia-card-shadow overflow-hidden text-left" id="player-notes-discussions-card">
            
            <div className="border-b border-slate-100 bg-slate-50/50 flex p-1.5 gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Course Overview
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'notes' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Study Notes
              </button>
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex-1 rounded-lg py-2.5 text-xs font-bold text-center transition-all cursor-pointer ${
                  activeTab === 'discussion' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Discussions
              </button>
            </div>

            <div className="p-6 text-xs text-slate-600">
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Course Description</h4>
                    <p className="mt-1 text-slate-500 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4">
                    <div>
                      <span className="block text-slate-400 font-medium">Instructor</span>
                      <span className="block text-slate-800 font-bold text-sm mt-0.5">{course.instructor}</span>
                      <span className="block text-[10.5px] text-slate-500">{course.instructorTitle}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-medium">Skills Gained</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {course.skillsAcquired.map((sk, id) => (
                          <span key={id} className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Scratchpad</h4>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">Your study notes are saved locally for this lesson.</p>
                    </div>
                    <button
                      onClick={handleSaveNote}
                      className="bg-xebia-purple hover:bg-xebia-purple/95 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                    >
                      Save Notes
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Type notes, code snippets, or formulas here..."
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs font-mono text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-xebia-purple/50 focus:border-xebia-purple/50 focus:bg-white"
                  />
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm">Squad Discussion Forum</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-purple-100 text-xebia-purple flex items-center justify-center font-bold text-[10px]">
                        SC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">Sophia Chen</span>
                          <span className="text-[9px] text-slate-400 font-medium">2 hours ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                          Did anyone encounter scaling boundaries on VPC subnet splits? The lecture is super useful!
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-orange-100 text-xebia-orange flex items-center justify-center font-bold text-[10px]">
                        AB
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700">Alex Van Der Berg (Instructor)</span>
                          <span className="text-[9px] text-xebia-orange font-bold">1 hour ago</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-normal font-medium">
                          Hi Sophia! Check out standard Subnet Calculator lists and VPC peering guidelines in the resources section.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Right Side: Syllabus Directory Navigation */}
        <div className="lg:col-span-1 space-y-6" id="player-syllabus-sidebar">
          
          <div className="bg-white rounded-2xl border border-gray-100 xebia-card-shadow overflow-hidden text-left">
            <div className="bg-gray-50/50 border-b border-gray-100 px-5 py-4">
              <span className="text-[10px] text-xebia-purple uppercase font-bold tracking-widest font-mono">Course Syllabus</span>
              <h4 className="font-display text-sm font-bold text-[#1A1A1B] mt-0.5 line-clamp-1">{course.title}</h4>
            </div>

            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {course.syllabus.map((module, mIndex) => (
                <div key={mIndex} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1A1A1B]">
                      {module.title}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {module.duration}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {module.lessons.map((lesson) => {
                      const isActive = activeLesson.id === lesson.id;
                      const isDone = isLessonCompleted(lesson.id);

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#FAF0FA] text-xebia-purple border border-[#831B84]/10 font-semibold'
                              : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {isDone ? (
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className="h-4 w-4 text-slate-400 shrink-0" />
                            ) : lesson.type === 'quiz' ? (
                              <HelpCircle className="h-4 w-4 text-amber-500 shrink-0" />
                            ) : (
                              <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                            <span className="text-xs line-clamp-1">{lesson.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono ml-2 shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
