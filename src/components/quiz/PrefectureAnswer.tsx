import { memo } from 'react';
import { Prefecture } from '../../types/prefecture';

interface PrefectureAnswerProps {
    prefecture: Prefecture;
    showHiragana: boolean;
    showKanji: boolean;
}

export const PrefectureAnswer = memo(({ prefecture, showHiragana, showKanji }: PrefectureAnswerProps) => (
    <div className="flex flex-col items-center space-y-2">
        {showHiragana && (
            <div className="text-3xl text-gray-800">
                {prefecture.hiragana}
            </div>
        )}

        {showKanji && (
            <div className="text-4xl font-bold text-gray-900">
                {prefecture.name}
            </div>
        )}
    </div>
));

PrefectureAnswer.displayName = 'PrefectureAnswer';