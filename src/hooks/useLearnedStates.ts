import { useState, useEffect } from 'react';

export const useLearnedStates = () => {
    const [learnedStates, setLearnedStates] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const saved = localStorage.getItem('prefectureLearnedStates');
        if (saved) {
            setLearnedStates(JSON.parse(saved));
        }
    }, []);

    const setLearned = (prefCode: string, learned: boolean) => {
        const newStates = {
            ...learnedStates,
            [prefCode]: learned
        };
        setLearnedStates(newStates);
        localStorage.setItem('prefectureLearnedStates', JSON.stringify(newStates));
    };

    const isLearned = (prefCode: string): boolean => {
        return learnedStates[prefCode] || false;
    };

    const clearLearnedStates = () => {
        setLearnedStates({});
        localStorage.removeItem('prefectureLearnedStates');
    };

    return {
        setLearned,
        isLearned,
        clearLearnedStates
    };
};