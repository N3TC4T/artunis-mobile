/**
 * App Theme - Colors
 */

const app = {
    background: '#131722',
};

const brand = {
    brand: {
        primary: '#0092d8',
        secondary: '#364150',
    },
};

const text = {
    textPrimary: '#fefeff',
    textSecondary: '#575563',
    headingPrimary: '#0092d8',
    headingSecondary: brand.brand.primary,
};

const buttons = {
    buttonPrimary: '#0896d6',
    buttonSecondary: 'transparent',
};

const borders = {
    border: '#dedfe3',
    buttonPrimaryBorder: '#0896d6',
    buttonSecondaryBorder: '#0896d6',
};

const segment = {
    segmentButton: {
        selectedTextColor: '#364150',
        textColor: '#364150',
        background: '#FCFCFA',
        selectedBackground: '#dedfe3',
        borderColor: '#b3c1c4',
    },
};

export default {
    ...app,
    ...brand,
    ...text,
    ...buttons,
    ...borders,
    ...segment,
};
