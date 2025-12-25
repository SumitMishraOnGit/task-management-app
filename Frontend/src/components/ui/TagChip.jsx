// Frontend/src/components/ui/TagChip.jsx

import React from 'react';

const TAG_COLORS = {
    '#f43f5e': { bg: 'bg-rose-500/20', text: 'text-rose-400', border: 'border-rose-500/30' },
    '#3b82f6': { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    '#10b981': { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    '#eab308': { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
    '#a855f7': { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
    '#06b6d4': { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
};

const TagChip = ({ tag, onRemove, showRemove = false, size = 'sm' }) => {
    const colorClasses = TAG_COLORS[tag.color] || TAG_COLORS['#f43f5e'];

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-3 py-1 text-sm';

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border ${colorClasses.bg} ${colorClasses.text} ${colorClasses.border} ${sizeClasses} font-medium`}
        >
            {tag.name}
            {showRemove && onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(tag)}
                    className="ml-1 hover:opacity-70 transition-opacity"
                    aria-label={`Remove ${tag.name} tag`}
                >
                    ×
                </button>
            )}
        </span>
    );
};

export { TAG_COLORS };
export default TagChip;
