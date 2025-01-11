import { memo } from 'react';
import { Check } from 'lucide-react';

interface LearnedToggleProps {
    isLearned: boolean;
    onChange: (learned: boolean) => void;
}

export const LearnedToggle = memo(({ isLearned, onChange }: LearnedToggleProps) => (
    <div className="flex items-center gap-2">
        <button
            onClick={() => onChange(!isLearned)}
            className={`
                px-4 py-2 rounded-full flex items-center gap-2 
                transition-all duration-200 ease-in-out
                border border-transparent
                ${isLearned
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 border-gray-200'
                }
            `}
        >
            <div className={`
                w-5 h-5 rounded-full flex items-center justify-center
                transition-all duration-200 
                ${isLearned
                    ? 'bg-white'
                    : 'bg-gray-200'
                }
            `}>
                <Check
                    className={`
                        w-3 h-3 transition-all duration-200
                        ${isLearned
                            ? 'text-green-500 scale-100'
                            : 'text-gray-400 scale-90'
                        }
                    `}
                />
            </div>
            <span className={`
                transition-all duration-200
                ${isLearned
                    ? 'text-white font-medium'
                    : 'text-gray-400'
                }
            `}>
                覚えた
            </span>
        </button>
    </div>
));

LearnedToggle.displayName = 'LearnedToggle';