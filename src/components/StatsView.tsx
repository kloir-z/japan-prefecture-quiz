import { memo, useMemo, useState } from 'react';
import { Prefecture, StudyRecord } from '../types/prefecture';
import { Check, AlertTriangle, X, Trash2 } from 'lucide-react';

interface StatsViewProps {
    prefectures: Prefecture[];
    getRecentRecords: (prefCode: string) => StudyRecord[];
    onBack: () => void;
    onClearRecords: () => void;
    isLearned: (prefCode: string) => boolean;
}

type SortKey = 'prefCode' | 'prefecture' | 'total' | 'good' | 'fair' | 'poor';
type SortDirection = 'asc' | 'desc';

const NUMERIC_COLUMNS: SortKey[] = ['total', 'good', 'fair', 'poor'];

export const StatsView = memo(({ prefectures, getRecentRecords, onBack, onClearRecords, isLearned }: StatsViewProps) => {
    const [sortKey, setSortKey] = useState<SortKey>('prefCode');  // Changed default sort key
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');  // Default to ascending for prefCode

    const stats = useMemo(() =>
        prefectures.map(pref => {
            const records = getRecentRecords(pref.code);
            const total = records.length;
            const goodCount = records.filter(r => r.result === 'good').length;
            const fairCount = records.filter(r => r.result === 'fair').length;
            const poorCount = records.filter(r => r.result === 'poor').length;
            const learned = isLearned(pref.code);
            return {
                prefecture: pref,
                prefCode: pref.code,
                total,
                good: goodCount,
                fair: fairCount,
                poor: poorCount,
                learned
            };
        }),
        [prefectures, getRecentRecords, isLearned]);

    const sortedStats = useMemo(() => {
        return [...stats].sort((a, b) => {
            let compareValue: number;
            if (sortKey === 'prefecture') {
                compareValue = a.prefecture.name.localeCompare(b.prefecture.name);
            } else if (sortKey === 'prefCode') {
                compareValue = parseInt(a.prefCode) - parseInt(b.prefCode);
            } else {
                compareValue = (a[sortKey] || 0) - (b[sortKey] || 0);
            }
            return sortDirection === 'asc' ? compareValue : -compareValue;
        });
    }, [stats, sortKey, sortDirection]);

    const handleHeaderClick = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection(NUMERIC_COLUMNS.includes(key) ? 'desc' : 'asc');
        }
    };

    const handleClearClick = () => {
        if (window.confirm('学習履歴をクリアしますか？')) {
            onClearRecords();
        }
    };

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return null;
        return (
            <span className="ml-1 inline-block">
                {sortDirection === 'asc' ? '▲' : '▼'}
            </span>
        );
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
                            <th
                                className="p-2 text-left w-16 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('prefCode')}
                            >
                                コード{getSortIcon('prefCode')}
                            </th>
                            <th
                                className="p-2 text-left w-32 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('prefecture')}
                            >
                                都道府県{getSortIcon('prefecture')}
                            </th>
                            <th
                                className="p-2 text-center w-16 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('total')}
                            >
                                回数{getSortIcon('total')}
                            </th>
                            <th
                                className="p-2 text-center w-16 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('good')}
                            >
                                <Check className="inline w-5 h-5 text-green-500" />
                                {getSortIcon('good')}
                            </th>
                            <th
                                className="p-2 text-center w-16 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('fair')}
                            >
                                <AlertTriangle className="inline w-5 h-5 text-yellow-500" />
                                {getSortIcon('fair')}
                            </th>
                            <th
                                className="p-2 text-center w-16 cursor-pointer hover:bg-gray-200"
                                onClick={() => handleHeaderClick('poor')}
                            >
                                <X className="inline w-5 h-5 text-red-500" />
                                {getSortIcon('poor')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStats.map(({ prefecture, prefCode, total, good, fair, poor, learned }) => (
                            <tr key={prefecture.code} className="border-b hover:bg-gray-50">
                                <td className="p-2">{prefCode}</td>
                                <td className="p-2">{prefecture.name}</td>
                                <td className="p-2 text-center">{total}</td>
                                <td className="p-2 text-center font-bold text-green-600">{good || '-'}</td>
                                <td className={`p-2 text-center font-bold ${learned ? 'text-yellow-200' : 'text-yellow-600'}`}>
                                    {fair || '-'}
                                </td>
                                <td className={`p-2 text-center font-bold ${learned ? 'text-red-200' : 'text-red-600'}`}>
                                    {poor || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});

export default StatsView;