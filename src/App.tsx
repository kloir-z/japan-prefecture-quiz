import { useState, useCallback, useMemo } from 'react';
import { useStudyRecords } from './hooks/useStudyRecords';
import { useLearnedStates } from './hooks/useLearnedStates';
import { prefectures } from './data/prefectures';
import { PrefectureImage } from './components/quiz/PrefectureImage';
import { PrefectureAnswer } from './components/quiz/PrefectureAnswer';
import { EvaluationButtons } from './components/quiz/EvaluationButtons';
import { LearnedToggle } from './components/quiz/LearnedToggle';
import { MainMenu } from './components/MainMenu';
import { StatsView } from './components/StatsView';
import { EvaluationType, StudyMode, Prefecture } from './types/prefecture';
import { useQuizProgress } from './hooks/useQuizProgress';
import { ShuffleButton } from './components/quiz/ShuffleButton';
import { useImageCache } from './hooks/useImageCache';
import { LoadingScreen } from './components/LoadingScreen';

const PrefectureQuiz = () => {
  const [mode, setMode] = useState<StudyMode | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHiragana, setShowHiragana] = useState(false);
  const [showKanji, setShowKanji] = useState(false);
  const { addRecord, clearRecords, getRecentRecords, getWeakPrefectures, hasWeakRecords } = useStudyRecords();
  const { savedProgress, saveProgress, clearProgress } = useQuizProgress();
  const { imageCache, isLoading } = useImageCache();
  const { setLearned, isLearned, clearLearnedStates } = useLearnedStates();

  const [quizPrefectures, setQuizPrefectures] = useState<Prefecture[]>([]);

  const hasWeakPrefectures = useMemo(() =>
    hasWeakRecords(prefectures),
    [hasWeakRecords]
  );

  const handleModeSelect = useCallback((selectedMode: StudyMode) => {
    let newPrefectures: Prefecture[] = [];

    if (savedProgress && savedProgress.mode === selectedMode) {
      newPrefectures = savedProgress.prefectures;
      setCurrentIndex(savedProgress.currentIndex);
    } else {
      if (selectedMode === 'weak-only') {
        newPrefectures = getWeakPrefectures(prefectures, isLearned);
      } else {
        newPrefectures = [...prefectures]
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      }

      setCurrentIndex(0);
      saveProgress(selectedMode, newPrefectures, 0);
    }

    setQuizPrefectures(newPrefectures);
    setMode(selectedMode);
    setShowHiragana(false);
    setShowKanji(false);
  }, [getWeakPrefectures, savedProgress, saveProgress, isLearned]);

  const handleImageClick = () => {
    if (!showHiragana) {
      setShowHiragana(true);
    } else if (!showKanji) {
      setShowKanji(true);
    }
  };

  const handleEvaluation = (result: EvaluationType) => {
    const currentPrefecture = quizPrefectures[currentIndex];
    addRecord(currentPrefecture.code, result);

    if (currentIndex === quizPrefectures.length - 1) {
      clearProgress();
      setMode(null);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (mode) {
        saveProgress(mode, quizPrefectures, nextIndex);
      }
    }

    setShowHiragana(false);
    setShowKanji(false);
  };

  const handleBackToMenu = () => {
    if (window.confirm('メインメニューに戻りますか？\n(進行状況は保存されます)')) {
      setMode(null);
      setShowHiragana(false);
      setShowKanji(false);
    }
  };

  const handleShuffle = useCallback(() => {
    if (window.confirm('問題順序をシャッフルしますか？')) {
      let newPrefectures: Prefecture[] = [];

      if (mode === 'weak-only') {
        newPrefectures = getWeakPrefectures(prefectures, isLearned);
      } else {
        newPrefectures = [...prefectures]
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
      }

      setQuizPrefectures(newPrefectures);
      setCurrentIndex(0);
      setShowHiragana(false);
      setShowKanji(false);

      if (mode) {
        saveProgress(mode, newPrefectures, 0);
      }
    }
  }, [mode, getWeakPrefectures, saveProgress, isLearned]);

  const handleClearAllData = () => {
    if (window.confirm('全てのデータ（学習履歴・進行状況・覚えた状態）をクリアしますか？')) {
      clearRecords();
      clearProgress();
      clearLearnedStates();
      setMode(null);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showStats) {
    return (
      <StatsView
        prefectures={prefectures}
        getRecentRecords={getRecentRecords}
        onBack={() => setShowStats(false)}
        onClearRecords={handleClearAllData}
        isLearned={isLearned}
      />
    );
  }

  if (!mode) {
    return (
      <MainMenu
        onModeSelect={handleModeSelect}
        onShowStats={() => setShowStats(true)}
        hasWeakPrefectures={hasWeakPrefectures}
      />
    );
  }

  const currentPrefecture = quizPrefectures[currentIndex];

  if (!currentPrefecture) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center select-none">
      <div className="w-full max-w-[530px] flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <button
            onClick={handleBackToMenu}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 active:bg-gray-700 transition-colors"
          >
            戻る
          </button>
          <ShuffleButton onShuffle={handleShuffle} />
          <div className="text-lg font-bold text-gray-700">
            {currentIndex + 1} / {quizPrefectures.length}
          </div>
        </div>

        <div
          className="w-full cursor-pointer touch-manipulation"
          onClick={handleImageClick}
        >
          <PrefectureImage
            prefecture={currentPrefecture}
            cachedImageUrl={imageCache[currentPrefecture.code]}
          />
          <div className="relative w-full">
            {!showKanji && <div className="absolute inset-0 h-64" />}
            <PrefectureAnswer
              prefecture={currentPrefecture}
              showHiragana={showHiragana}
              showKanji={showKanji}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          {showKanji && (
            <>
              <EvaluationButtons onEvaluate={handleEvaluation} />
              {mode === 'weak-only' && (
                <LearnedToggle
                  isLearned={isLearned(currentPrefecture.code)}
                  onChange={(learned) => setLearned(currentPrefecture.code, learned)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrefectureQuiz;