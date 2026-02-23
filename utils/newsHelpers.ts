import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

/**
 * Format a date string for news display
 * @param dateString - ISO date string or null
 * @returns Formatted date string or empty string
 */
export const formatNewsDate = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
        return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
};

/**
 * Calculate estimated read time for content
 * @param content - HTML content string
 * @param t - Translation function
 * @returns Formatted read time string
 */
export const calculateReadTime = (
    content: string,
    t: (key: string) => string
): string => {
    const text = stripHtml(content);
    const words = text.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 200)); // Average reading speed
    return `${minutes} ${t('read.minutes') || 'phút'}`;
};

/**
 * Get excerpt from content
 * @param content - HTML content string
 * @param length - Maximum length of excerpt
 * @returns Truncated text excerpt
 */
export const getExcerpt = (content: string, length: number = 150): string => {
    const text = stripHtml(content);
    return text.length > length ? text.substring(0, length).trim() + '...' : text;
};

/**
 * Strip HTML tags from content
 * @param html - HTML string
 * @returns Plain text string
 */
const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Format relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string
 * @param t - Translation function
 * @returns Relative time string
 */
export const formatRelativeTime = (
    dateString: string | null,
    t: (key: string) => string
): string => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
        return t('time.just_now') || 'Just now';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} ${t('time.minutes_ago') || 'minutes ago'}`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} ${t('time.hours_ago') || 'hours ago'}`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} ${t('time.days_ago') || 'days ago'}`;
    }

    return formatNewsDate(dateString);
};

/**
 * Truncate text to specific length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export const truncateText = (
    text: string,
    maxLength: number,
    suffix: string = '...'
): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Get placeholder image URL
 * @param width - Image width
 * @param height - Image height
 * @param text - Placeholder text
 * @returns Placeholder image URL
 */
export const getPlaceholderImage = (
    width: number = 800,
    height: number = 450,
    text: string = 'News'
): string => {
    return `https://placehold.co/${width}x${height}?text=${encodeURIComponent(text)}`;
};
