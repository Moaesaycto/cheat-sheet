import { createContext, useContext, useState, type ReactNode } from "react";

export type Language = "py" | "java" | "js" | "c";

export const Titles = {
    py: "Python",
    java: "Java",
    js: "JavaScript",
    c: "C/C++",
} as const;

export const PrismRefs = {
    py: "python",
    java: "java",
    js: "javascript",
    c: "cpp",
}

interface LanguageContextValue {
    language: Language;
    setLanguage: (language: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>("py");

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguageContext = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error("useLanguageContext must be used within a LanguageProvider");
    return context;
};

export default LanguageContext;
