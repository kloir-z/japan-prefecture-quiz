import { useImagePreload } from './hooks/useImagePreload';
import { useQuizState } from './hooks/useQuizState';
import { prefectures } from './data/prefectures';
import { PrefectureImage } from './components/quiz/PrefectureImage';
import { PrefectureAnswer } from './components/quiz/PrefectureAnswer';
import { EvaluationButtons } from './components/quiz/EvaluationButtons';

const PrefectureQuiz = () => {
  const {
    currentIndex,
    showHiragana,
    showKanji,
    handleImageClick,
    handleEvaluation
  } = useQuizState();

  useImagePreload(currentIndex);

  const currentPrefecture = prefectures[currentIndex];

  return (
    <div className="min-h-screen p-4 flex items-start justify-center">
      <div className="max-w-[530px] w-full flex flex-col items-center">
        <div 
          className="w-full cursor-pointer" 
          onClick={handleImageClick}
        >
          <PrefectureImage prefecture={currentPrefecture} />
          
          {/* インタラクティブエリア */}
          <div className="relative w-full">
            {/* 非表示の時もクリック可能な透明なオーバーレイ */}
            {!showKanji && (
              <div className="absolute inset-0 h-64" />
            )}
            
            {/* 通常のコンテンツ */}
            <PrefectureAnswer
              prefecture={currentPrefecture}
              showHiragana={showHiragana}
              showKanji={showKanji}
            />
          </div>
        </div>

        <div className="mt-4">
          {showKanji && (
            <EvaluationButtons onEvaluate={handleEvaluation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PrefectureQuiz;