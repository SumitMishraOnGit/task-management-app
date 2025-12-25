// Frontend/src/components/ui/TagInput.jsx

import React, { useState } from 'react';
import TagChip, { TAG_COLORS } from './TagChip';

const PRESET_COLORS = [
    { hex: '#f43f5e', name: 'Rose' },
    { hex: '#3b82f6', name: 'Blue' },
    { hex: '#10b981', name: 'Green' },
    { hex: '#eab308', name: 'Yellow' },
    { hex: '#a855f7', name: 'Purple' },
    { hex: '#06b6d4', name: 'Cyan' },
];

const TagInput = ({ tags = [], onChange, maxTags = 5 }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].hex);
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleAddTag = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) return;
        if (tags.length >= maxTags) {
            alert(`Maximum ${maxTags} tags allowed`);
            return;
        }
        if (tags.some(tag => tag.name.toLowerCase() === trimmedValue.toLowerCase())) {
            alert('Tag already exists');
            return;
        }

        const newTag = { name: trimmedValue, color: selectedColor };
        onChange([...tags, newTag]);
        setInputValue('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag.name !== tagToRemove.name));
    };

    return (
        <div className="space-y-2">
            {/* Existing tags */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <TagChip
                            key={index}
                            tag={tag}
                            showRemove={true}
                            onRemove={handleRemoveTag}
                            size="md"
                        />
                    ))}
                </div>
            )}

            {/* Input row */}
            <div className="flex gap-2 items-center">
                {/* Color picker button */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-8 h-8 rounded-md border border-neutral-600 flex items-center justify-center"
                        style={{ backgroundColor: selectedColor + '40' }}
                        aria-label="Select tag color"
                    >
                        <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: selectedColor }}
                        />
                    </button>

                    {/* Color dropdown */}
                    {showColorPicker && (
                        <div className="absolute top-10 left-0 bg-neutral-700 rounded-lg p-2 shadow-lg z-10 flex gap-1">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.hex}
                                    type="button"
                                    onClick={() => {
                                        setSelectedColor(color.hex);
                                        setShowColorPicker(false);
                                    }}
                                    className={`w-6 h-6 rounded-full transition-transform hover:scale-110 ${selectedColor === color.hex ? 'ring-2 ring-white ring-offset-1 ring-offset-neutral-700' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                    title={color.name}
                                    aria-label={`Select ${color.name} color`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Text input */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a tag..."
                    className="flex-1 p-2 rounded-md bg-neutral-600 border border-neutral-500 text-neutral-100 text-sm focus:ring-rose-500 focus:border-rose-500"
                    maxLength={20}
                />

                {/* Add button */}
                <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!inputValue.trim() || tags.length >= maxTags}
                    className="px-3 py-2 bg-neutral-600 hover:bg-neutral-500 text-neutral-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>

            {/* Helper text */}
            <p className="text-xs text-neutral-500">
                {tags.length}/{maxTags} tags • Press Enter to add
            </p>
        </div>
    );
};

export default TagInput;
