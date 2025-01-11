import { memo, useMemo } from 'react';
import { Prefecture, StudyRecord } from '../types/prefecture';
import { Check, AlertTriangle, X, Trash2 } from 'lucide-react';

interface StatsViewProps {
    prefectures: Prefecture[];
    getRecentRecords: (prefCode: string) => StudyRecord[];
    onBack: () => void;
    onClearRecords: () => void;
}

export const StatsView = memo(({ prefectures, getRecentRecords, onBack, onClearRecords }: StatsViewProps) => {
    const stats = useMemo(() =>
        prefectures.map(pref => {
            const records = getRecentRecords(pref.code);
            const total = records.length;
            const goodCount = records.filter(r => r.result === 'good').length;
            const fairCount = records.filter(r => r.result === 'fair').length;
            const poorCount = records.filter(r => r.result === 'poor').length;

            return {
                prefecture: pref,
                total,
                good: goodCount,
                fair: fairCount,
                poor: poorCount
            };
        }),
        [prefectures, getRecentRecords]);

    const handleClearClick = () => {
        if (window.confirm('学習履歴をクリアしますか？')) {
            onClearRecords();
        }
    };

    return (
        <div className="p-4 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold">学習履歴</h2>
                <div className="flex gap-2">
                    <button
                        onClick={handleClearClick}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        戻る
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse min-w-[320px]">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left w-32">都道府県</th>
                            <th className="p-2 text-center w-16">回数</th>
                            <th className="p-2 text-center w-16">
                                <Check className="inline w-5 h-5 text-green-500" />
                            </th>
                            <th className="p-2 text-center w-16">
                                <AlertTriangle className="inline w-5 h-5 text-yellow-500" />
                            </th>
                            <th className="p-2 text-center w-16">
                                <X className="inline w-5 h-5 text-red-500" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.map(({ prefecture, total, good, fair, poor }) => (
                            <tr key={prefecture.code} className="border-b hover:bg-gray-50">
                                <td className="p-2">{prefecture.name}</td>
                                <td className="p-2 text-center">{total}</td>
                                <td className="p-2 text-center font-bold text-green-600">{good || '-'}</td>
                                <td className="p-2 text-center font-bold text-yellow-600">{fair || '-'}</td>
                                <td className="p-2 text-center font-bold text-red-600">{poor || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
