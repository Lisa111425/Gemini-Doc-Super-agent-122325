
import React from 'react';
import { ArtistStyle } from './types';

export const ARTIST_STYLES: Record<string, ArtistStyle> = {
  "Van Gogh": { name: "Van Gogh", bg: "#203254", accent: "#f9d71c", text: "#ffffff", font: "Georgia", grad: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" },
  "Claude Monet": { name: "Claude Monet", bg: "#eef5ff", accent: "#7fa99b", text: "#2d545e", font: "Verdana", grad: "linear-gradient(to right, #e1eec3, #f05053)" },
  "Pablo Picasso": { name: "Pablo Picasso", bg: "#f0ede5", accent: "#d94528", text: "#1a1a1a", font: "Courier New", grad: "linear-gradient(45deg, #232526 0%, #414345 100%)" },
  "Salvador Dalí": { name: "Salvador Dalí", bg: "#d4c5b3", accent: "#8b4513", text: "#2b2b2b", font: "Palatino", grad: "radial-gradient(circle, #d4c5b3, #5d4037)" },
  "Leonardo da Vinci": { name: "Leonardo da Vinci", bg: "#3d3225", accent: "#c5a059", text: "#f5e6be", font: "Times New Roman", grad: "linear-gradient(to bottom, #3d3225, #1a150f)" },
  "Andy Warhol": { name: "Andy Warhol", bg: "#ff00ff", accent: "#00ff00", text: "#000000", font: "Impact", grad: "linear-gradient(90deg, #ff00ff, #ffff00, #00ffff)" },
  "Edvard Munch": { name: "Edvard Munch", bg: "#2e1a47", accent: "#ff4e00", text: "#ecf0f1", font: "Garamond", grad: "linear-gradient(180deg, #2e1a47 0%, #7209b7 100%)" },
  "Gustav Klimt": { name: "Gustav Klimt", bg: "#1a1a1a", accent: "#d4af37", text: "#ffffff", font: "Optima", grad: "linear-gradient(135deg, #bf953f, #fcf6ba, #b38728)" },
  "Katsushika Hokusai": { name: "Katsushika Hokusai", bg: "#f8f1e5", accent: "#1c3d5a", text: "#0b1622", font: "Garamond", grad: "linear-gradient(to top, #1c3d5a, #f8f1e5)" },
  "Frida Kahlo": { name: "Frida Kahlo", bg: "#006d5b", accent: "#e91e63", text: "#ffffff", font: "Arial", grad: "linear-gradient(45deg, #006d5b, #ffeb3b)" },
  "Jackson Pollock": { name: "Jackson Pollock", bg: "#ffffff", accent: "#000000", text: "#000000", font: "Arial", grad: "url('https://www.transparenttextures.com/patterns/black-thread.png'), #fff" },
  "Piet Mondrian": { name: "Piet Mondrian", bg: "#ffffff", accent: "#e74c3c", text: "#000000", font: "Helvetica", grad: "linear-gradient(90deg, #e74c3c 5%, #ffffff 5%, #ffffff 95%, #3498db 95%)" },
  "Yayoi Kusama": { name: "Yayoi Kusama", bg: "#ffcc00", accent: "#000000", text: "#000000", font: "Verdana", grad: "radial-gradient(circle, #000 10%, transparent 11%) 0 0 / 30px 30px, #fc0" },
  "Banksy": { name: "Banksy", bg: "#333333", accent: "#ff0000", text: "#ffffff", font: "Impact", grad: "linear-gradient(transparent, rgba(0,0,0,0.8)), url('https://www.transparenttextures.com/patterns/brick-wall.png'), #333" },
  "Jean-Michel Basquiat": { name: "Jean-Michel Basquiat", bg: "#121212", accent: "#ffd700", text: "#ffffff", font: "Arial", grad: "linear-gradient(to right, #8e2de2, #4a00e0)" },
  "Johannes Vermeer": { name: "Johannes Vermeer", bg: "#0a2342", accent: "#e3b04b", text: "#fffdf0", font: "Baskerville", grad: "radial-gradient(circle at 70%, #214066, #0a2342)" },
  "Rembrandt": { name: "Rembrandt", bg: "#1a0f00", accent: "#996515", text: "#d4bc8d", font: "Times New Roman", grad: "radial-gradient(ellipse at center, #3d2b1f 0%, #1a0f00 100%)" },
  "Georgia O'Keeffe": { name: "Georgia O'Keeffe", bg: "#f4e4d4", accent: "#d98c8c", text: "#5c4033", font: "Verdana", grad: "linear-gradient(to top, #f4e4d4, #ffafbd)" },
  "Caravaggio": { name: "Caravaggio", bg: "#000000", accent: "#800000", text: "#c0c0c0", font: "Times New Roman", grad: "linear-gradient(to bottom, #434343 0%, #000000 100%)" },
  "Michelangelo": { name: "Michelangelo", bg: "#e2d1c3", accent: "#8e735b", text: "#2c3e50", font: "Georgia", grad: "linear-gradient(to top, #e2d1c3 0%, #fdfcfb 100%)" }
};

export const FILE_ANALYSIS_PROMPT = `
You are a Lead Strategic Analyst. Your task is to provide a **comprehensive, deep-dive summary** of the provided document.
Output MUST be in Traditional Chinese (繁體中文).
The summary should be very detailed, aiming for a high word count. 
Structure:
1. Executive Summary (Extremely detailed)
2. Detailed Chapter/Section Breakdown (Deep analysis of every point)
3. Technical Specifications & Entities Table (using Markdown)
4. SWOT Analysis based on the content
5. Risk Assessment & Strategic Recommendations
6. Conclusion
Use professional, academic tone. Use Markdown headers and tables.
Please make it as long as possible to reach approximately 2500 words.
`;

export const ARTISTS_LIST = Object.keys(ARTIST_STYLES);
