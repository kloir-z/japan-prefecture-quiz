import { useState, useEffect } from 'react';
import { StudyRecord, EvaluationType } from './types/prefecture';
import { prefectures } from './data/prefectures';
import { Check, X } from 'lucide-react';

const TriangleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-8 h-8"
    fill="white"
  >
    <path
      d="M12 4 L21 18 L3 18 Z"
      strokeLinejoin="round"
      strokeWidth="1.5"
      stroke="white"
      fill="white"
    />
  </svg>
);

const PrefectureQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHiragana, setShowHiragana] = useState(false);
  const [showKanji, setShowKanji] = useState(false);
  const [studyRecord, setStudyRecord] = useState<StudyRecord>({});

  useEffect(() => {
    const savedRecord = localStorage.getItem('prefectureStudyRecord');
    if (savedRecord) {
      setStudyRecord(JSON.parse(savedRecord));
    }
  }, []);

  const handleImageClick = () => {
    if (!showHiragana) {
      setShowHiragana(true);
    } else if (!showKanji) {
      setShowKanji(true);
    }
  };

  const handleEvaluation = (result: EvaluationType) => {
    const newRecord = {
      ...studyRecord,
      [prefectures[currentIndex].code]: result
    };
    setStudyRecord(newRecord);
    localStorage.setItem('prefectureStudyRecord', JSON.stringify(newRecord));

    setCurrentIndex((prev) => (prev + 1) % prefectures.length);
    setShowHiragana(false);
    setShowKanji(false);
  };

  return (
    <div className="min-h-screen p-4 flex items-start justify-center">
      <div className="max-w-[530px] w-full flex flex-col items-center">
        {/* 画像コンテナ */}
        <div
          className="w-full cursor-pointer mb-4"
          onClick={handleImageClick}
        >
          <img
            src={`/${prefectures[currentIndex].code}.png`}
            alt="都道府県の形"
            className="w-full h-auto"
          />
        </div>

        {/* テキスト表示エリア - スペースを縮小 */}
        <div className="flex flex-col items-center space-y-2">
          {showHiragana && (
            <div className="text-3xl text-gray-800">
              {prefectures[currentIndex].hiragana}
            </div>
          )}

          {showKanji && (
            <div className="text-4xl font-bold text-gray-900">
              {prefectures[currentIndex].name}
            </div>
          )}
        </div>

        {/* ボタンエリア - ボタンサイズ縮小 */}
        {showKanji && (
          <div className="flex gap-6 mt-4">
            <button
              onClick={() => handleEvaluation('good')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            >
              <Check className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={() => handleEvaluation('fair')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            >
              <TriangleIcon />
            </button>
            <button
              onClick={() => handleEvaluation('poor')}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            >
              <X className="w-8 h-8 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrefectureQuiz;