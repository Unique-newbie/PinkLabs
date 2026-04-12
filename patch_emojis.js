const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
const replacements = {
    'What We Do': 'What We Do 🚀',
    'How We Work': 'How We Work ✨',
    'Portfolio': 'Portfolio 💼',
    'Testimonials': 'Testimonials 💬',
    'Pricing': 'Pricing 🏷️',
    'FAQ': 'FAQ ❓',
    'Our Values': 'Our Values 💎',
    'Our Story': 'Our Story 📖',
    'Our Team': 'Our Team 👥',
    'Reach Out': 'Reach Out 📬',
    "Let's Connect": "Let's Connect 🤝",
    "Services": "Services 🛠️",
    'All Projects': 'All Projects 📂',
    'Privacy': 'Privacy 🔒'
};

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    for (const [k, v] of Object.entries(replacements)) {
        // Regex to match exact tag text, with or without existing emojis
        const regex = new RegExp('<span class="section-tag">' + k + '( [\\u{1F300}-\\u{1F64F}\\u{1F680}-\\u{1F6FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{1F900}-\\u{1F9FF}\\u{1F1E6}-\\u{1F1FF}])?</span>', 'gu');
        text = text.replace(regex, '<span class="section-tag">' + v + '</span>');
    }
    fs.writeFileSync(file, text);
    console.log('Updated ' + file);
});
