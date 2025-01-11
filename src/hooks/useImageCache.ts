// hooks/useImageCache.ts
import { useState, useEffect, useRef } from 'react';
import { prefectures } from '../data/prefectures';

interface ImageCache {
    [key: string]: string;
}

export const useImageCache = () => {
    const [imageCache, setImageCache] = useState<ImageCache>({});
    const [isLoading, setIsLoading] = useState(true);
    const isLoadingRef = useRef(true);
    const cachedUrlsRef = useRef<string[]>([]);

    useEffect(() => {
        let isMounted = true;
        isLoadingRef.current = true;
        setIsLoading(true);

        const loadImages = async () => {
            const cache: ImageCache = {};
            const newCachedUrls: string[] = [];

            try {
                await Promise.all(
                    prefectures.map(async (prefecture) => {
                        const response = await fetch(`/${prefecture.code}.png`);
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        cache[prefecture.code] = url;
                        newCachedUrls.push(url);
                    })
                );

                if (isMounted) {
                    setImageCache(cache);
                    cachedUrlsRef.current = newCachedUrls;
                    isLoadingRef.current = false;
                    setIsLoading(false);
                } else {
                    // コンポーネントがアンマウントされていた場合、URLを解放
                    newCachedUrls.forEach(url => URL.revokeObjectURL(url));
                }
            } catch (error) {
                console.error('Failed to load images:', error);
                if (isMounted) {
                    isLoadingRef.current = false;
                    setIsLoading(false);
                }
            }
        };

        loadImages();

        return () => {
            isMounted = false;
            // 既存のURLを解放
            cachedUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
            cachedUrlsRef.current = [];
        };
    }, []);

    return { imageCache, isLoading: isLoading || isLoadingRef.current };
};