const fs = require('fs');
const { createCanvas } = require('canvas');
const opentype = require('opentype.js');

// Path to your TTF file
const fontPath = 'font.ttf';
// Output image and data paths
const outputPath = 'conchars.png';
const outputDataPath = 'font_data.json';

// Define the character grid
const characterGrid = [
    "                ",
    "  0123456789.   ",
    " !"#$%&'<>×+,-./"
    "0123456789:;<=>?"
    "@ABCDEFGHIJKLMNO",
    "PQRSTUVWXYZ[\]^_",
    "'abcdefghijklmno"
"pqrstuvwxyz{:}~ "
"                "
"  0123456789.   "
" !"#$%&'<>×+,-./"
    "0123456789:;<=>?"
"@ABCDEFGHIJKLMNO"
"PQRSTUVEXYZ[\]^_"
"'abcdefghijklmno"
"pqrstivwxyz{:}~ "// Add more rows as needed
];

// Define the resolution for each character
const characterSize = 32; // Set desired character size

// Calculate canvas size
const canvasWidth = Math.max(...characterGrid.map(row => row.length)) * characterSize;
const canvasHeight = characterGrid.length * characterSize;

opentype.load(fontPath, (err, font) => {
    if (err) {
        console.error('Could not load font: ' + err);
        return;
    }

    const canvas = createCanvas(canvasWidth, canvasHeight);
    const context = canvas.getContext('2d');

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'black';
    
    context.font = `${characterSize}px '${font.getName()}'`;

    const charData = {};

    // Draw characters based on the grid
    characterGrid.forEach((row, rowIndex) => {
        let x = 0;
        const y = rowIndex * characterSize;

        row.split('').forEach(char => {
            const glyph = font.charToGlyph(char);
            const advanceWidth = glyph.advanceWidth * (characterSize / font.unitsPerEm);
            
            // Draw glyph at the calculated position
            glyph.getPath(x, y, characterSize).draw(context);

            // Store character data
            charData[char] = {
                x: x,
                y: y,
                width: advanceWidth,
                height: characterSize,
            };

            // Update x position
            x += advanceWidth;
        });
    });

    // Save the canvas as an image
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    // Save character data
    fs.writeFileSync(outputDataPath, JSON.stringify(charData, null, 2));

    console.log('Font sheet and data created successfully!');
});
