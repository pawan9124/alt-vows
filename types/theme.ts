// Theme type definitions used by DynamicEditor and legacy EditorSidebar

export interface FieldSchema {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image' | 'video' | 'color' | 'select' | 'array' | 'group';
    placeholder?: string;
    options?: string[];
    itemSchema?: FieldSchema[];
    fields?: FieldSchema[];
}

export interface SectionSchema {
    section: string;
    label: string;
    fields: FieldSchema[];
}
