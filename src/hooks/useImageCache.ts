import { useState, useEffect } from 'react';
import { prefectures } from '../data/prefectures';

interface ImageCache {
    [key: string]: string;
}

interface CacheItem {
    id: string;
    data: Blob;
    timestamp: number;
}

export const useImageCache = () => {
    const [imageCache, setImageCache] = useState<ImageCache>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const cacheVersion = '1';

        const initializeDB = () => {
            return new Promise<IDBDatabase>((resolve, reject) => {
                const request = indexedDB.open('prefectureQuizDB', 1);

                request.onerror = () => reject(request.error);
                request.onsuccess = () => resolve(request.result);

                request.onupgradeneeded = (event) => {
                    const db = (event.target as IDBOpenDBRequest).result;
                    if (!db.objectStoreNames.contains('images')) {
                        db.createObjectStore('images', { keyPath: 'id' });
                    }
                };
            });
        };

        const loadImages = async () => {
            try {
                const db = await initializeDB();
                const cache: ImageCache = {};

                // 画像を1つずつ処理
                for (const prefecture of prefectures) {
                    try {
                        const transaction = db.transaction('images', 'readonly');
                        const store = transaction.objectStore('images');

                        const request = store.get(`${prefecture.code}-${cacheVersion}`);
                        const result = await new Promise<CacheItem | undefined>((resolve) => {
                            request.onsuccess = () => resolve(request.result as CacheItem);
                        });

                        if (result?.data) {
                            if (isMounted) {
                                cache[prefecture.code] = URL.createObjectURL(result.data);
                            }
                        } else {
                            // キャッシュになければ新しく取得
                            const writeTransaction = db.transaction('images', 'readwrite');
                            const writeStore = writeTransaction.objectStore('images');

                            const response = await fetch(`/${prefecture.code}.png`);
                            const blob = await response.blob();

                            if (isMounted) {
                                cache[prefecture.code] = URL.createObjectURL(blob);

                                // 新しいトランザクションで保存
                                writeStore.put({
                                    id: `${prefecture.code}-${cacheVersion}`,
                                    data: blob,
                                    timestamp: Date.now()
                                });
                            }
                        }

                        // 途中経過を反映
                        if (isMounted) {
                            setImageCache(prevCache => ({ ...prevCache, [prefecture.code]: cache[prefecture.code] }));
                        }
                    } catch (error) {
                        console.warn(`Failed to process prefecture ${prefecture.code}:`, error);
                    }
                }

                if (isMounted) {
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Failed to initialize image cache:', error);
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadImages();

        return () => {
            isMounted = false;
            Object.values(imageCache).forEach(url => {
                try {
                    URL.revokeObjectURL(url);
                } catch (error) {
                    console.warn('Failed to revoke object URL:', error);
                }
            });
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { imageCache, isLoading };
};