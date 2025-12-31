# Pros/Cons Generator

A web-based tool for generating proficiency and conduct marking statements with keyword banks, customizable templates, and proper formatting for USMC counselings.

## Features

- **Proficiency Statement Builder**: Build proficiency statements with phrase banks organized by performance level
- **Conduct Statement Builder**: Create conduct statements with appropriate language for each marking level
- **Phrase Banks**: Extensive library of approved phrases for marks from 5.0 (Outstanding) to 1.0 (Failing)
- **MOS-Specific Phrases**: Additional phrases tailored to different MOS types
- **Mark Alignment Checker**: Warnings when statement language doesn't match the assigned mark
- **Statement Templates**: Pre-formatted templates for promotion, semi-annual, and adverse counselings
- **Character Counter**: Real-time character counting with limit warnings
- **Draft Saving**: Save and load drafts locally for future editing
- **Copy to Clipboard**: Quick copy functionality for pasting into MOL
- **Offline Support**: Works offline as a Progressive Web App (PWA)
- **Theme Support**: Light, dark, and tactical (night) modes

## References

- MCO P1070.12K (Individual Records Administration Manual - IRAM) - Chapter 4, Para 4005
- MCO P1610.7 (Performance Evaluation System)
- MCO P1400.32D (Promotion Manual)

## Mark Scale

| Mark | Proficiency | Conduct |
|------|-------------|---------|
| 5.0 | Outstanding performance | Outstanding conduct, role model |
| 4.5 | Excellent performance | Excellent conduct |
| 4.0 | Above average | Above average, no issues |
| 3.5 | Slightly above average | Minor issues only |
| 3.0 | Average, meets standards | Acceptable conduct |
| 2.5 | Below average | Below average |
| 2.0 | Poor performance | Conduct issues |
| 1.5 | Very poor | Serious conduct issues |
| 1.0 | Failing | Major misconduct |

## Usage

1. Select the performance level and MOS type
2. Build your proficiency statement using quick phrases or the phrase bank
3. Build your conduct statement
4. Review the mark alignment feedback
5. Set your recommended marks
6. Copy to clipboard for pasting into MOL

## Installation

This is a static web application. Simply serve the files from any web server or open `index.html` directly in a browser.

For PWA functionality, serve over HTTPS.

## Development

```bash
# Clone the repository
git clone https://github.com/jeranaias/pros-cons-generator.git

# Open in browser
open index.html
```

## File Structure

```
pros-cons-generator/
├── index.html           # Main HTML file
├── manifest.json        # PWA manifest
├── service-worker.js    # Service worker for offline support
├── css/
│   └── styles.css       # All styles (design system + tool-specific)
├── js/
│   ├── app.js           # Main application logic
│   ├── phrases.js       # Phrase banks
│   ├── templates.js     # Statement templates
│   ├── alignment.js     # Mark/language alignment checker
│   └── storage.js       # LocalStorage utilities
├── assets/
│   ├── icon-192.png     # PWA icon (192x192)
│   └── icon-512.png     # PWA icon (512x512)
└── README.md
```

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **peternemr** | r/USMC | Requested Pros/Cons counseling generator with keyword/statement bank |
| **jj26meu** | r/USMC & Discord | Confirmed format requirements, offered collaboration on testing |

*This tool exists because Marines took the time to share their pain points. Thank you.*

## License

MIT License - Free to use, modify, and distribute.

## Part of USMC Tools

This tool is part of the [USMC Tools](https://jeranaias.github.io/usmc-tools/) suite - a collection of free, offline-capable web tools built for Marines.
