import { memo } from 'react';
import { Prefecture } from '../../types/prefecture';

interface PrefectureImageProps {
    prefecture: Prefecture;
}

export const PrefectureImage = memo(({ prefecture }: PrefectureImageProps) => (
    <div className="w-full mb-4">
        <img
            src={`/${prefecture.code}.png`}
            alt="都道府県の形"
            className="w-full h-auto"
            draggable={false}
        />
    </div>
));

PrefectureImage.displayName = 'PrefectureImage';