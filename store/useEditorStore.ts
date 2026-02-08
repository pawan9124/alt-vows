import { create } from 'zustand';

// Helper: Get nested value (e.g. "hero.title")
export const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

// Helper: Set nested value immutably
const setNestedValue = (obj: any, path: string, value: any) => {
    const newObj = JSON.parse(JSON.stringify(obj)); // Deep clone
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), newObj);
    if (lastKey) target[lastKey] = value;
    return newObj;
};

interface EditorState {
    activeTheme: any;
    isOpen: boolean;
    setTheme: (theme: any) => void;
    toggleEditor: () => void;
    updateField: (path: string, value: any) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
    activeTheme: null,
    isOpen: false,

    setTheme: (theme) => set({ activeTheme: theme }),
    toggleEditor: () => set((state) => ({ isOpen: !state.isOpen })),

    updateField: (path, value) => set((state) => ({
        activeTheme: setNestedValue(state.activeTheme, path, value)
    }))
}));
