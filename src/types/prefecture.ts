export interface Prefecture {
    readonly code: string;
    readonly name: string;
    readonly hiragana: string;
}

export interface StudyRecord {
    readonly prefCode: string;
    readonly result: EvaluationType;
    readonly timestamp: number;
}

export type EvaluationType = 'good' | 'fair' | 'poor';

export type StudyMode = 'random' | 'weak-only';