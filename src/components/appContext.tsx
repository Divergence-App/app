import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { AppContextType, SubjectType } from "../types/components";
import { clearSubjects, getDyslexiaMode, getSubjects } from "../lib/storage";

export const AppContext = createContext<AppContextType>(null!);

export const AppContextProvider = ({ children }: PropsWithChildren<object>) => {
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    const [isDyslexiaMode, setIsDyslexiaMode] = useState<boolean>(false);

    useEffect(() => {
        // load subjects from react native storage

        let dyslexiaMode = getDyslexiaMode();

        if (dyslexiaMode) {
            setIsDyslexiaMode(dyslexiaMode);
        }

        let subjects = getSubjects();

        if (subjects) {
            console.log("Subjects loaded from storage", subjects);
            setSubjects(subjects);
        }
    }, []);

    return (
        <AppContext.Provider value={{
            setSubjects: setSubjects,
            subjects: subjects,
            isDyslexiaMode: isDyslexiaMode,
            setIsDyslexiaMode: setIsDyslexiaMode
        }}>
            {children}
        </AppContext.Provider>
    )
}