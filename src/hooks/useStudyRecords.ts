import { useState, useEffect } from 'react';
import { StudyRecord, Prefecture, EvaluationType } from '../types/prefecture';
import { RECENT_RECORDS_LIMIT } from '../utils/constants';

export const useStudyRecords = () => {
    const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);

    useEffect(() => {
        const savedRecords = localStorage.getItem('prefectureStudyRecords');
        if (savedRecords) {
            setStudyRecords(JSON.parse(savedRecords));
        }
    }, []);

    const addRecord = (prefCode: string, result: EvaluationType) => {
        try {
            const newRecord: StudyRecord = {
                prefCode,
                result,
                timestamp: Date.now()
            };

            const newRecords = [...studyRecords, newRecord];
            setStudyRecords(newRecords);
            localStorage.setItem('prefectureStudyRecords', JSON.stringify(newRecords));
        } catch (error) {
            console.error('学習記録の保存に失敗しました:', error);
        }
    };

    const clearRecords = () => {
        setStudyRecords([]);
        localStorage.removeItem('prefectureStudyRecords');
    };

    const getRecentRecords = (prefCode: string) => {
        return studyRecords
            .filter(record => record.prefCode === prefCode)
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, RECENT_RECORDS_LIMIT);
    };

    const hasWeakRecords = (prefectures: Prefecture[]): boolean => {
        return prefectures.some(pref => {
            const records = getRecentRecords(pref.code);
            return records.some(record => record.result === 'fair' || record.result === 'poor');
        });
    };

    const getWeakPrefectures = (prefectures: Prefecture[], isLearned: (prefCode: string) => boolean): Prefecture[] => {
        const weakPrefectures = prefectures.filter(pref => {
            const records = getRecentRecords(pref.code);
            return records.some(record => record.result === 'fair' || record.result === 'poor');
        });

        // 学習済みと未学習に分ける
        const [learned, notLearned] = weakPrefectures.reduce<[Prefecture[], Prefecture[]]>(
            (acc, prefecture) => {
                if (isLearned(prefecture.code)) {
                    acc[0].push(prefecture);
                } else {
                    acc[1].push(prefecture);
                }
                return acc;
            },
            [[], []]
        );

        // それぞれをランダムに並び替え
        const shuffleArray = (array: Prefecture[]) =>
            array
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value);

        // 未学習を先に、学習済みを後ろに配置
        return [...shuffleArray(notLearned), ...shuffleArray(learned)];
    };

    return {
        addRecord,
        clearRecords,
        getRecentRecords,
        hasWeakRecords,
        getWeakPrefectures,
    };
};