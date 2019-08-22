export interface CardStore{
    id: number;
    front: string;
    back: string;
    picture?: string;
    tags?: string[];

    created: number;
    updated: number;
    
    // 复习等级
    readLevel: number;
    spellLevel: number;
    recallLevel: number;

    // 最后复习时间的时间戳
    lastRead: number;
    lastSpell: number;
    lastRecall: number;
}



export interface KVStore {
    readViewInfo: string[]
    spellViewInfo: string[]
    recallViewInfo: string[]
}