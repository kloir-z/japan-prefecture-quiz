import { memo } from 'react';
import { StudyMode } from '../types/prefecture';

interface MainMenuProps {
    onModeSelect: (mode: StudyMode) => void;
    onShowStats: () => void;
    hasWeakPrefectures: boolean; // 追加
}

export const MainMenu = memo(({ onModeSelect, onShowStats, hasWeakPrefectures }: MainMenuProps) => (
    <div className="flex flex-col items-center gap-8 p-8 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-900">都道府県クイズ</h1>
        <div className="flex flex-col gap-4 w-full max-w-xs">
            <button
                onClick={() => onModeSelect('random')}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl text-lg"
            >
                ランダムモード
            </button>
            <button
                onClick={() => onModeSelect('weak-only')}
                disabled={!hasWeakPrefectures}
                className={`w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-yellow-400 text-white rounded-lg transition-all shadow-lg text-lg
                    ${hasWeakPrefectures
                        ? 'hover:from-amber-600 hover:to-yellow-500 hover:shadow-xl'
                        : 'opacity-50 cursor-not-allowed'}`}
            >
                苦手克服モード
            </button>
            <button
                onClick={onShowStats}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl text-lg"
            >
                学習履歴
            </button>
        </div>
    </div>
));