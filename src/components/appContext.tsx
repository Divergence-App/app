import {createContext, PropsWithChildren, useEffect, useState} from 'react';
import {AppContextType, SubjectType} from '../types/components';
import {getDyslexiaMode, getSubjects} from '../lib/storage';

// Create a context to share state across components
// The initial value is set to null! since it will be provided by the AppContextProvider
export const AppContext = createContext<AppContextType>(null!);

/**
 * Provider component that wraps the app to share global state
 * Manages subjects and dyslexia mode settings across the application
 * 
 * @param {PropsWithChildren<object>} props - React children to be wrapped by the provider
 * @returns {JSX.Element} Context Provider wrapping children components
 */
export const AppContextProvider = ({children}: PropsWithChildren<object>) => {
    // State for managing list of subjects
    const [subjects, setSubjects] = useState<SubjectType[]>([]);
    
    // State for managing dyslexia mode toggle
    const [isDyslexiaMode, setIsDyslexiaMode] = useState<boolean>(false);

    /**
     * Effect hook that runs on component mount to:
     * 1. Load dyslexia mode preference from storage
     * 2. Load saved subjects from storage
     */
    useEffect(() => {
        // Get dyslexia mode setting from storage
        let dyslexiaMode = getDyslexiaMode();
        if (dyslexiaMode) {
            setIsDyslexiaMode(dyslexiaMode);
        }

        // Get subjects from storage
        let subjects = getSubjects();
        if (subjects) {
            console.log('Subjects loaded from storage', subjects);
            setSubjects(subjects);
        }
    }, []); // Empty dependency array means this runs once on mount

    // Provide context values to children components
    return (
        <AppContext.Provider
            value={{
                setSubjects: setSubjects,      // Function to update subjects
                subjects: subjects,            // Current subjects array
                isDyslexiaMode: isDyslexiaMode, // Current dyslexia mode state
                setIsDyslexiaMode: setIsDyslexiaMode, // Function to toggle dyslexia mode
            }}>
            {children}
        </AppContext.Provider>
    );
};