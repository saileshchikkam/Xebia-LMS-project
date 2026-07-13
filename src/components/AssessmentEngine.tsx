import React, { useState } from 'react';
import { SKILL_ASSESSMENTS } from '../data';
import { AssessmentQuestion, SkillAssessment } from '../types';
import { Award, BookOpen, Clock, CheckCircle, AlertTriangle, ChevronRight, ArrowLeft, Trophy, Star, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import XebiaLogo from './XebiaLogo';
import XebiaLiveBackground from './XebiaLiveBackground';

interface AssessmentEngineProps {
  onAssessmentCompleted: (category: string) => void;
  isAuthenticated: boolean;
  onOpenAuth?: (role: 'Student' | 'Admin') => void;
}

export default function AssessmentEngine({ 
  onAssessmentCompleted,
  isAuthenticated,
  onOpenAuth
}: AssessmentEngineProps) {
  const [selectedAssessment, setSelectedAssessment] = useState<SkillAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [examFinished, setExamFinished] = useState<boolean>(false);
  const [showExplanations, setShowExplanations] = useState<boolean>(false);

  // Score Calculation
  const correctCount = selectedAssessment
    ? selectedAssessment.questions.reduce((acc, q, index) => {
        const selected = selectedAnswers[q.id];
        return selected === q.correctIndex ? acc + 1 : acc;
      }, 0)
    : 0;

  const handleStartExam = (assessment: SkillAssessment) => {
    setSelectedAssessment(assessment);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setExamFinished(false);
    setShowExplanations(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIndex });
  };

  const handleNext = () => {
    if (selectedAssessment) {
      if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setExamFinished(true);
        // Complete the assessment on the parent state
        onAssessmentCompleted(selectedAssessment.category);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8" id="assessment-engine-root">
      
      {/* HEADER SECTION */}
      {!selectedAssessment && (
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 mb-10 text-left border border-slate-800 shadow-xl" id="assessment-header-card">
          {/* Subtle live background animation */}
          <XebiaLiveBackground variant="dark" interactive={false} />
          
          <div className="relative z-10 max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#FF5A36]">
              Verified Credentials
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-white flex items-center space-x-3">
              <Award className="h-8 w-8 text-[#FF5A36] shrink-0" />
              <span>Interactive <span className="font-bold bg-gradient-to-r from-purple-300 to-[#FF5A36] bg-clip-text text-transparent">Certification Hub</span></span>
            </h2>
            <p className="text-xs md:text-sm text-slate-300 font-serif italic max-w-xl">
              Validate your specialized expertise. Take gamified diagnostic compliance tests, unlock verifiable credentials, and review comprehensive practitioner explanations.
            </p>
          </div>
        </div>
      )}

      {/* ASSESSMENT SELECTION VIEW */}
      {!selectedAssessment ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="assessment-list-grid">
          {SKILL_ASSESSMENTS.map((assess) => (
            <div
              key={assess.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 xebia-card-shadow xebia-card-hover text-left flex flex-col justify-between h-full"
              id={`assessment-card-${assess.id}`}
            >
              <div className="space-y-4">
                <span className="inline-flex rounded-lg bg-[#FAF0FA] px-3 py-1 text-xs font-bold text-xebia-purple uppercase tracking-widest font-mono">
                  {assess.category} Practice
                </span>
                <h3 className="font-display text-base font-bold text-[#1A1A1B]">{assess.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-serif italic">
                  Rigorous mock assessment covering VPC topology, IAM profiles, agile retrospectives, scheduling constraints, or container network indices.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 flex items-center space-x-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{assess.questionsCount} Multiple Choice Questions</span>
                </span>
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      onOpenAuth?.('Student');
                    } else {
                      handleStartExam(assess);
                    }
                  }}
                  className="bg-xebia-purple hover:bg-xebia-purple/95 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ACTIVE TEST RUNNER OR RESULTS VIEW */
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-100 xebia-card-shadow overflow-hidden text-left" id="active-assessment-container">
          
          {/* Header of Test Runner */}
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <button
              onClick={() => setSelectedAssessment(null)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quit Assessment</span>
            </button>
            <span className="text-xs font-bold text-xebia-orange uppercase tracking-wider">
              {selectedAssessment.category} Assessment
            </span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            
            {/* EXAM COMPLETED / RESULT VIEW */}
            {examFinished ? (
              <div className="space-y-6 text-center" id="assessment-finished-pane">
                <div className="py-4 space-y-3">
                  <div className="mx-auto h-20 w-20 rounded-full bg-purple-50 border-4 border-purple-100 flex items-center justify-center text-xebia-purple shadow-inner">
                    <Trophy className="h-10 w-10 text-xebia-orange fill-xebia-orange animate-bounce" />
                  </div>
                  <h3 className="font-display text-xl font-extrabold text-slate-900">Assessment Complete!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    You have successfully finalized the {selectedAssessment.title}. Here are your diagnostics.
                  </p>
                </div>

                {/* Score display board */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 max-w-md mx-auto">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correct Answers</span>
                    <span className="block text-3xl font-black text-xebia-purple mt-1">{correctCount} / {selectedAssessment.questions.length}</span>
                  </div>
                  <div className="text-center border-l border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Grade Status</span>
                    <span className={`block text-xs font-extrabold px-3 py-1.5 rounded-full mt-2 mx-auto w-fit uppercase ${
                      correctCount >= 4 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {correctCount >= 4 ? 'Distinguished Master' : 'Competency Approved'}
                    </span>
                  </div>
                </div>

                {/* Explanations collapsible */}
                <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Detailed Explanations & Rationale</span>
                    <button
                      onClick={() => setShowExplanations(!showExplanations)}
                      className="text-xs font-bold text-xebia-purple hover:underline cursor-pointer"
                    >
                      {showExplanations ? 'Hide rationales' : 'View rationales'}
                    </button>
                  </div>

                  <AnimatePresence>
                    {showExplanations && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-slate-100 pt-2"
                      >
                        {selectedAssessment.questions.map((q, idx) => {
                          const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                          
                          return (
                            <div key={q.id} className="py-3 text-xs space-y-2">
                              <div className="flex items-start space-x-2">
                                {isCorrect ? (
                                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                                )}
                                <span className="font-bold text-slate-800">Q{idx + 1}: {q.question}</span>
                              </div>
                              <p className="text-slate-500 leading-normal pl-6 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <strong>Rationale:</strong> {q.explanation}
                              </p>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Final action */}
                <button
                  onClick={() => setSelectedAssessment(null)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Finalize and Claim Badge
                </button>
              </div>
            ) : (
              /* ACTIVE QUESTION FLOW VIEW */
              <div className="space-y-6" id="active-questions-runner">
                
                {/* Step indicator progress bar */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-500">
                    <span>PROGRESS BAR</span>
                    <span>Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-xebia-purple h-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question typography block */}
                <div className="space-y-4 text-left">
                  <div className="flex items-center space-x-2 text-xebia-purple">
                    <HelpCircle className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Multiple Choice Challenge</span>
                  </div>
                  <h4 className="font-display text-base font-bold text-slate-800 leading-snug">
                    {selectedAssessment.questions[currentQuestionIndex].question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {selectedAssessment.questions[currentQuestionIndex].options.map((option, idx) => {
                    const isSelected = selectedAnswers[selectedAssessment.questions[currentQuestionIndex].id] === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(selectedAssessment.questions[currentQuestionIndex].id, idx)}
                        className={`w-full text-left text-xs p-4 rounded-xl border transition-all flex items-start space-x-3 cursor-pointer ${
                          isSelected
                            ? 'border-xebia-purple bg-purple-50/50 text-purple-950 font-semibold shadow-sm'
                            : 'border-slate-150 hover:bg-slate-50 text-slate-600 bg-white'
                        }`}
                      >
                        <span className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 text-[10px] font-bold ${
                          isSelected ? 'bg-xebia-purple text-white border-xebia-purple' : 'border-slate-300 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Prev / Next controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous Question
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={selectedAnswers[selectedAssessment.questions[currentQuestionIndex].id] === undefined}
                    className={`px-5 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center space-x-1 ${
                      selectedAnswers[selectedAssessment.questions[currentQuestionIndex].id] !== undefined
                        ? 'bg-xebia-purple text-white shadow-md cursor-pointer'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <span>
                      {currentQuestionIndex === selectedAssessment.questions.length - 1 ? 'Finish Exam' : 'Next Question'}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
