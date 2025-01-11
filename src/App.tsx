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
        <PrefectureImage
          prefecture={currentPrefecture}
          onClick={handleImageClick}
        />

        <PrefectureAnswer
          prefecture={currentPrefecture}
          showHiragana={showHiragana}
          showKanji={showKanji}
        />

        {showKanji && (
          <EvaluationButtons onEvaluate={handleEvaluation} />
        )}
      </div>
    </div>
  );
};

export default PrefectureQuiz;