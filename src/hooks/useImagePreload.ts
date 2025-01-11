import { useEffect, useCallback } from 'react';
import { prefectures } from '../data/prefectures';

export const useImagePreload = (currentIndex: number) => {
    const preloadImage = useCallback((index: number) => {
        const img = new Image();
        img.src = `/${prefectures[index].code}.png`;
    }, []);

    useEffect(() => {
        preloadImage(currentIndex);

        const nextIndex = (currentIndex + 1) % prefectures.length;
        preloadImage(nextIndex);

        const nextNextIndex = (currentIndex + 2) % prefectures.length;
        preloadImage(nextNextIndex);
    }, [currentIndex, preloadImage]);
};