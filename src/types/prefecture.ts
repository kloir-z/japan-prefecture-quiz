export interface Prefecture {
    code: string;
    name: string;
    hiragana: string;
}

export interface StudyRecord {
    [prefCode: string]: 'good' | 'fair' | 'poor';
}

export type EvaluationType = 'good' | 'fair' | 'poor';