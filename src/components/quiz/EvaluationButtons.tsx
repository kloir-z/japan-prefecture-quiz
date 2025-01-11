import { memo } from 'react';
import { Check, X } from 'lucide-react';
import { EvaluationType } from '../../types/prefecture';

const TriangleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-8 h-8" fill="white">
        <path
            d="M12 4 L21 18 L3 18 Z"
            strokeLinejoin="round"
            strokeWidth="1.5"
            stroke="white"
            fill="white"
        />
    </svg>
);

interface EvaluationButtonsProps {
    onEvaluate: (result: EvaluationType) => void;
}

export const EvaluationButtons = memo(({ onEvaluate }: EvaluationButtonsProps) => (
    <div className="flex gap-6 mt-4" role="group" aria-label="学習評価ボタン">
        <button
            onClick={() => onEvaluate('good')}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 hover:bg-green-600 transition-colors"
            aria-label="できた"
        >
            <Check className="w-8 h-8 text-white" aria-hidden="true" />
        </button>
        <button
            onClick={() => onEvaluate('fair')}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
            aria-label="漢字が書けなかった"
        >
            <TriangleIcon aria-hidden="true" />
        </button>
        <button
            onClick={() => onEvaluate('poor')}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500 hover:bg-red-600 transition-colors"
            aria-label="できなかった"
        >
            <X className="w-8 h-8 text-white" aria-hidden="true" />
        </button>
    </div>
));

EvaluationButtons.displayName = 'EvaluationButtons';