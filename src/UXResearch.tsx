import { useState, useEffect } from 'react';

// ===== UX RESEARCH TOOLS =====

/**
 * NPS (Net Promoter Score) Survey Component
 */
export function NPSSurvey() {
  const [showSurvey, setShowSurvey] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Show survey after 30 seconds or on exit intent
    const timer = setTimeout(() => {
      const hasResponded = localStorage.getItem('airklim-nps-responded');
      if (!hasResponded) {
        setShowSurvey(true);
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (rating === null) return;

    const surveyData = {
      rating,
      feedback,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Save to localStorage
    localStorage.setItem('airklim-nps-responded', 'true');
    localStorage.setItem('airklim-nps-data', JSON.stringify(surveyData));

    console.log('📊 NPS Survey submitted:', surveyData);
    // In production: send to analytics service
    // fetch('/api/survey/nps', { method: 'POST', body: JSON.stringify(surveyData) });

    setSubmitted(true);
    setTimeout(() => setShowSurvey(false), 3000);
  };

  if (!showSurvey) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-80 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 lg:right-8">
      {submitted ? (
        <div className="text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="text-lg font-bold text-white mb-2">Grazie!</h3>
          <p className="text-sm text-white/60">Il tuo feedback è importante per noi.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Quanto ci consiglieresti?</h3>
            <button
              onClick={() => setShowSurvey(false)}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {Array.from({ length: 11 }, (_, i) => (
              <button
                key={i}
                onClick={() => setRating(i)}
                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-all ${
                  rating === i
                    ? 'bg-sky-500 text-white scale-110'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {i}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-white/40 mb-4">
            <span>Per niente probabile</span>
            <span>Molto probabile</span>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback aggiuntivo (opzionale)..."
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-sky-500 outline-none resize-none mb-3"
            rows={3}
          />

          <button
            onClick={handleSubmit}
            disabled={rating === null}
            className="w-full px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg text-sm font-semibold transition-all"
          >
            Invia Feedback
          </button>
        </>
      )}
    </div>
  );
}

/**
 * User Feedback Widget
 */
export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [type, setType] = useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    const feedbackData = {
      type,
      feedback,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.log('💬 User feedback submitted:', feedbackData);
    // In production: send to feedback service
    // fetch('/api/feedback', { method: 'POST', body: JSON.stringify(feedbackData) });

    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFeedback('');
    }, 2000);
  };

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-72 left-6 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg border border-white/10 transition-all hover:scale-110 lg:left-[280px]"
        aria-label="Feedback"
        title="Invia Feedback"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      </button>

      {/* Feedback Panel */}
      {isOpen && (
        <div className="fixed bottom-72 left-20 z-50 w-80 bg-slate-900 rounded-2xl border border-white/10 shadow-2xl p-6 lg:left-[320px]">
          {submitted ? (
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-white mb-2">Grazie!</h3>
              <p className="text-sm text-white/60">Il tuo feedback è stato inviato.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Invia Feedback</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white/60 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setType('bug')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    type === 'bug'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  🐛 Bug
                </button>
                <button
                  onClick={() => setType('suggestion')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    type === 'suggestion'
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  💡 Suggerimento
                </button>
                <button
                  onClick={() => setType('other')}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    type === 'other'
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  📝 Altro
                </button>
              </div>

              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Descrivi il tuo feedback..."
                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:border-sky-500 outline-none resize-none mb-3"
                rows={4}
              />

              <button
                onClick={handleSubmit}
                disabled={!feedback.trim()}
                className="w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg text-sm font-semibold transition-all"
              >
                Invia Feedback
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Usability Test Recorder
 */
export function UsabilityTestRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [actions, setActions] = useState<Array<{
    type: string;
    target: string;
    timestamp: number;
    data?: any;
  }>>([]);

  useEffect(() => {
    if (!isRecording) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setActions(prev => [...prev, {
        type: 'click',
        target: target.tagName + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : ''),
        timestamp: Date.now(),
        data: { x: e.clientX, y: e.clientY }
      }]);
    };

    const handleScroll = () => {
      setActions(prev => [...prev, {
        type: 'scroll',
        target: 'window',
        timestamp: Date.now(),
        data: { scrollY: window.scrollY }
      }]);
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isRecording]);

  const startRecording = () => {
    setActions([]);
    setIsRecording(true);
    console.log('🎥 Usability test recording started');
  };

  const stopRecording = () => {
    setIsRecording(false);
    console.log('🎥 Usability test recording stopped');
    console.log('📊 Actions recorded:', actions.length);
    
    // Save to localStorage
    localStorage.setItem('airklim-usability-test', JSON.stringify({
      actions,
      duration: actions.length > 0 ? actions[actions.length - 1].timestamp - actions[0].timestamp : 0,
      timestamp: new Date().toISOString()
    }));

    // In production: send to analytics service
    // fetch('/api/usability-test', { method: 'POST', body: JSON.stringify({ actions }) });
  };

  return (
    <>
      {/* Recording Indicator */}
      {isRecording && (
        <div className="fixed top-24 right-6 z-50 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 flex items-center gap-2 lg:right-8">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-red-400 font-semibold">Registrazione attiva</span>
          <button
            onClick={stopRecording}
            className="ml-2 px-3 py-1 bg-red-500 hover:bg-red-400 text-white rounded text-xs font-semibold transition-all"
          >
            Stop
          </button>
        </div>
      )}

      {/* Start Button */}
      {!isRecording && (
        <button
          onClick={startRecording}
          className="fixed top-24 right-6 z-50 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white transition-all lg:right-8"
        >
          🎥 Start Usability Test
        </button>
      )}
    </>
  );
}
