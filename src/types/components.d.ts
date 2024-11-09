export interface SubjectType {
    name: string;
    teachers: string[];
    colour: string;
    time: string;
    date: string;
    repeats?: boolean;
    description?: string;
}

export interface AppContextType {
    // user: User;
    // setUser: (user: User) => void;

    isDyslexiaMode: boolean;
    setIsDyslexiaMode: (isDyslexiaMode: boolean) => void;
    
    subjects: SubjectType[];
    setSubjects: (subjects: SubjectType[]) => void;
}