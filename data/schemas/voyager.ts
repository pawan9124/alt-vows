import { theVoyagerConfig } from '@/components/themes/the-voyager/config';

// Auto-derive the schema from the ThemeConfig format
// The Voyager already has a schema[] defined in its config, so we transform it
// into the flat key-path format the EditorSidebar expects.

export const voyagerSchema = (theVoyagerConfig.schema || []).map((section) => ({
    id: section.section,
    label: section.label,
    fields: section.fields.map((field) => ({
        key: `${section.section}.${field.key}`,
        label: field.label,
        type: field.type,
        placeholder: field.placeholder,
    })),
}));
