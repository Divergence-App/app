export interface SubjectType {
    id: string;
    name: string;
    teacher: string;
    colour: string;
    startsAt: string;
    endsAt: string;
    date: string;
    repeats?: boolean;
    description?: string;
    notes?: SubjectNotesProps[]
}

export interface SubjectNotesProps {
    content: string;
    date: string;
}

export interface AppContextType {
    // user: User;
    // setUser: (user: User) => void;

    isDyslexiaMode: boolean;
    setIsDyslexiaMode: (isDyslexiaMode: boolean) => void;
    
    subjects: SubjectType[];
    setSubjects: React.Dispatch<React.SetStateAction<SubjectType[]>>;
}