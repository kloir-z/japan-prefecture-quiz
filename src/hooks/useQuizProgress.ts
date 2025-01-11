import { useState, useEffect } from 'react';
import { Prefecture, StudyMode } from '../types/prefecture';

interface QuizProgress {
    mode: StudyMode;
    prefectures: Prefecture[];
    currentIndex: number;
}

export const useQuizProgress = () => {
    const [savedProgress, setSavedProgress] = useState<QuizProgress | null>(null);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('quizProgress');
            if (saved) {
                setSavedProgress(JSON.parse(saved));
            }
        } catch (error) {
            console.error('進行状況の読み込みに失敗しました:', error);
        }
    }, []);

    const saveProgress = (mode: StudyMode, prefectures: Prefecture[], currentIndex: number) => {
        try {
            const progress: QuizProgress = {
                mode,
                prefectures,
                currentIndex
            };
            localStorage.setItem('quizProgress', JSON.stringify(progress));
            setSavedProgress(progress);
        } catch (error) {
            console.error('進行状況の保存に失敗しました:', error);
        }
    };

    const clearProgress = () => {
        try {
            localStorage.removeItem('quizProgress');
            setSavedProgress(null);
        } catch (error) {
            console.error('進行状況のクリアに失敗しました:', error);
        }
    };

    return {
        savedProgress,
        saveProgress,
        clearProgress
    };
};