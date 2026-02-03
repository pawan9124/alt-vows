export type FieldType = 'text' | 'textarea' | 'image' | 'video' | 'date' | 'color' | 'array' | 'group';

export interface FieldSchema {
    key: string;        // matches the key in 'content' object (e.g. 'title' or 'events')
    label: string;
    type: FieldType;
    placeholder?: string;
    helpText?: string;
    itemSchema?: FieldSchema[]; // For 'array' type, defines the schema of each item
    fields?: FieldSchema[];     // For 'group' type, defines nested fields
}

export interface SectionSchema {
    section: string;    // Key in the root content object (e.g. 'hero')
    label: string;
    fields: FieldSchema[];
}

export interface ThemeConfig {
    id: string;
    name: string;
    defaultContent: any;
    schema?: SectionSchema[]; // Optional for backward compatibility
}
