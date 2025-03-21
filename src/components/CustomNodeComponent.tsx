import React from "react";
import { ICustomNodeProps } from "miles-tree-map";

// SVG icons for different countries and regions
const icons: Record<string, string> = {
    // Regions
    //   world: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>`,
    asia: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.35 19.65l1.79-1.79c.32-.32.1-.86-.35-.86H7V9c0-.55-.45-1-1-1s-1 .45-1 1v8h-.79c-.45 0-.67.54-.35.85l1.79 1.79c.19.2.51.2.7.01zM12 13v-3c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1s1-.45 1-1zm5.7 4.35l1.79-1.79c.32-.32.1-.86-.35-.86H18V9c0-.55-.45-1-1-1s-1 .45-1 1v6h-.79c-.45 0-.67.54-.35.85l1.79 1.79c.2.2.52.2.71.01z"/></svg>`,
    europe: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4h-4v3h-4V4H8v7H4v6h5v-3h6v3h5v-6h-4V7h4V4z"/></svg>`,
    africa: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-4 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h2l2-2h4l2 2h2v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-4-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z"/></svg>`,

    // Countries
    china: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66l-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0l8.43-4.6c.69-.38.69-1.38 0-1.76L12.96 3.52c-.6-.34-1.32-.34-1.92 0z"/></svg>`,
    india: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0.8 15h-1.6v-1.6h1.6V17zm-0.5-3.08c-0.82-0.27-1.3-1.02-1.3-1.92 0-1.11 0.9-2 2-2s2 0.89 2 2c0 0.9-0.53 1.66-1.3 1.92V14h-1.4v-0.08z"/></svg>`,
    germany: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 4h20v16H2V4zm2 4h16v3H4V8zm0 5h16v3H4v-3z"/></svg>`,
    france: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h6v16H4V4zm8 0h4v16h-4V4zm6 0h2v16h-2V4z"/></svg>`,
    nigeria: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v14H3V5zm3 2h4v10H6V7zm6 0h6v10h-6V7z"/></svg>`,
    egypt: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z"/></svg>`,

    // Cities
    beijing: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 11V5.83c0-.53-.21-1.04-.59-1.41L12 2 9.59 4.41c-.37.38-.59.89-.59 1.42V11l-5 5v2h16v-2l-5-5z"/></svg>`,
    shanghai: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 16h-2v-1h-4v1H9v2h8v-2zm4-13.32L19.32 1 15 5.32 10.68 1 9 2.68 13.32 7 9 11.32 10.68 13 15 8.68 19.32 13 21 11.32 16.68 7 21 2.68z"/></svg>`,
    delhi: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3l2 4h-3l-2-4h-2l2 4H9L7 3H5l2 4H4L3 8l1 1h16l1-1-1-1h-3l2-4h-4z M10 10v8c0 .55.45 1 1 1s1-.45 1-1v-8h2v8c0 .55.45 1 1 1s1-.45 1-1v-8h1V9h-8v1h1z"/></svg>`,
    mumbai: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
    paris: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 4.42 9.92 6.24 12.11.4.48 1.13.48 1.53 0C14.58 18.92 19 13.17 19 9c0-3.87-3.13-7-7-7zm0 10.5c-1.93 0-3.5-1.57-3.5-3.5S10.07 5.5 12 5.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>`,
    berlin: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.61 6.34l-4.25 4.25L8.39 9.6l-1.06 1.06 3.03 3.03 5.3-5.3-1.06-1.06z"/></svg>`,
};

// Get a default icon for names not in our mapping
const defaultIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>`;

// Extended props interface with showIcons prop
interface CustomNodeComponentProps extends ICustomNodeProps {
    showIcons?: boolean;
}

const CustomNodeComponent: React.FC<CustomNodeComponentProps> = ({
    node,
    width,
    height,
    backgroundColor,
    handleBack,
    history,
    showIcons = true
}) => {
    // Get the appropriate icon based on the node name, defaulting to a generic icon
    const getIconSvg = () => {
        const lowerName = node.name.toLowerCase();
        const matchingKey = Object.keys(icons).find(key => lowerName.includes(key.toLowerCase()));
        return matchingKey ? icons[matchingKey] : defaultIcon;
    };

    // Create SVG icon element
    const createIconMarkup = () => {
        return { __html: getIconSvg() };
    };

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxSizing: 'border-box',
                padding: '4px'
            }}
        >
            {showIcons && (
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: `${Math.min(width, height) * 0.6}px`,
                        height: `${Math.min(width, height) * 0.6}px`,
                        opacity: 0.3,
                        zIndex: 1,
                        color: 'rgba(255, 255, 255, 0.7)'
                    }}
                    dangerouslySetInnerHTML={createIconMarkup()}
                />
            )}
            
            {!showIcons && width > 60 && height > 30 && (
                <div 
                    style={{
                        fontSize: Math.max(9, Math.min(14, width / 12)),
                        textAlign: 'center',
                        color: '#fff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '90%'
                    }}
                >
                    {node.name}
                </div>
            )}
            
            {width > 80 && height > 60 && node.value !== undefined && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '4px',
                        left: '4px',
                        right: '4px',
                        fontSize: Math.max(9, Math.min(12, width / 18)),
                        textAlign: 'center',
                        color: '#fff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                        zIndex: 2
                    }}
                >
                    {node.value}
                </div>
            )}
        </div>
    );
};

export default CustomNodeComponent; 