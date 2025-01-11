import { memo, useState } from 'react';
import { Prefecture } from '../../types/prefecture';

interface PrefectureImageProps {
    prefecture: Prefecture;
    cachedImageUrl?: string;
}

export const PrefectureImage = memo(({ prefecture, cachedImageUrl }: PrefectureImageProps) => {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="w-full mb-4 select-none">
            <img
                src={cachedImageUrl || `/${prefecture.code}.png`}
                alt={`${prefecture.name}の形状`}
                className="w-full h-auto"
                draggable={false}
                onError={() => setHasError(true)}
                style={hasError ? { display: 'none' } : undefined}
            />
            {hasError && (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                    画像を読み込めませんでした
                </div>
            )}
        </div>
    );
});

PrefectureImage.displayName = 'PrefectureImage';