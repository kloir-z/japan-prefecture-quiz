import { useState, useEffect } from 'react';
import { StudyRecord, EvaluationType } from '../types/prefecture';
import { prefectures } from '../data/prefectures';

export const useQuizState = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showHiragana, setShowHiragana] = useState(false);
    const [showKanji, setShowKanji] = useState(false);
    const [studyRecord, setStudyRecord] = useState<StudyRecord>({});

    useEffect(() => {
        const savedRecord = localStorage.getItem('prefectureStudyRecord');
        if (savedRecord) {
            setStudyRecord(JSON.parse(savedRecord));
        }
    }, []);

    const handleImageClick = () => {
        if (!showHiragana) {
            setShowHiragana(true);
        } else if (!showKanji) {
            setShowKanji(true);
        }
    };

    const handleEvaluation = (result: EvaluationType) => {
        const newRecord = {
            ...studyRecord,
            [prefectures[currentIndex].code]: result
        };
        setStudyRecord(newRecord);
        localStorage.setItem('prefectureStudyRecord', JSON.stringify(newRecord));

        setCurrentIndex((prev) => (prev + 1) % prefectures.length);
        setShowHiragana(false);
        setShowKanji(false);
    };

    return {
        currentIndex,
        showHiragana,
        showKanji,
        studyRecord,
        handleImageClick,
        handleEvaluation
    };
};