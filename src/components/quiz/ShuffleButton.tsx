import { Shuffle } from 'lucide-react';

interface ShuffleButtonProps {
    onShuffle: () => void;
}

export const ShuffleButton = ({ onShuffle }: ShuffleButtonProps) => (
    <button
        onClick={onShuffle}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center gap-2"
        title="問題をシャッフル"
        aria-label="問題をシャッフル"
    >
        <Shuffle className="w-4 h-4" aria-hidden="true" />
    </button>
);