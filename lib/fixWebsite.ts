import { supabase } from './supabase';

/**
 * Fixes a website by copying the corrected theme data from the themes table
 * @param websiteId - The ID of the website to fix (e.g., 'wedding-xlp945')
 * @param themeName - The name of the theme (default: 'Rustic Luxury')
 */
export const fixWebsiteContent = async (websiteId: string, themeName: string = 'Rustic Luxury') => {
  try {
    // Step 1: Get the default_content from the themes table
    const { data: theme, error: themeError } = await supabase
      .from('themes')
      .select('default_content')
      .eq('name', themeName)
      .single();

    if (themeError || !theme) {
      throw new Error(`Theme '${themeName}' not found: ${themeError?.message || 'Unknown error'}`);
    }

    // Step 2: Update the website with the corrected content
    const { error: updateError } = await supabase
      .from('websites')
      .update({ content: theme.default_content })
      .eq('id', websiteId);

    if (updateError) {
      throw new Error(`Failed to update website: ${updateError.message}`);
    }

    return {
      success: true,
      message: `Website ${websiteId} has been updated with corrected theme data from '${themeName}'`,
    };
  } catch (error: any) {
    console.error('Error fixing website:', error);
    return {
      success: false,
      message: error.message || 'Unknown error occurred',
    };
  }
};



