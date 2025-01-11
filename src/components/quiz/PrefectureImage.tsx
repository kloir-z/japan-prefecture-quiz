import { memo } from 'react';
import { Prefecture } from '../../types/prefecture';

interface PrefectureImageProps {
    prefecture: Prefecture;
    onClick: () => void;
}

export const PrefectureImage = memo(({ prefecture, onClick }: PrefectureImageProps) => (
    <div className="w-full cursor-pointer mb-4" onClick={onClick}>
        <img
            src={`/${prefecture.code}.png`}
            alt="都道府県の形"
            className="w-full h-auto"
        />
    </div>
));

PrefectureImage.displayName = 'PrefectureImage';