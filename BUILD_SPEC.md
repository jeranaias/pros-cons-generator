# Pros & Cons Counseling Generator - Build Specification

## Overview

**Repo Name:** `pros-cons-generator`
**Purpose:** Generate proficiency and conduct marking statements with keyword banks, customizable templates, and proper formatting. Helps NCOs write meaningful counselings instead of recycling the same phrases.
**Target Users:** NCOs counseling E-1 through E-4, SNCOs reviewing marks, officers assigning marks

---

## Design System

**CRITICAL:** Use the shared design system from `DESIGN_SYSTEM.md`. All colors, typography, spacing, and components must match exactly for suite consistency.

---

## References

- MCO P1070.12K (Individual Records Administration Manual - IRAM) - Chapter 4, Para 4005
- MCO P1610.7 (Performance Evaluation System)
- MCO P1400.32D (Promotion Manual)

---

## Background: Proficiency & Conduct Marks

### Who Gets Them
- Privates (E-1) through Corporals (E-4)
- Assigned by Commanding Officer
- Recommended by supervising NCOs/SNCOs

### When Assigned (Para 4005.4 IRAM)
- Semi-annually (31 Jan and 31 Jul) - Active Duty
- Annually - Reservists
- Upon: promotion, transfer, discharge, reduction, school completion, TAD completion, primary duty change

### Mark Scale (0.0 to 5.0)
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
| 0.0 | Declared deserter | Declared deserter |

### Impact of Marks
- **Promotions:** Composite score calculation for Cpl/Sgt
- **Reenlistment:** Minimum 4.0/4.0 average required
- **Special Duty:** Minimum 4.2-4.6 depending on assignment
- **Characterization:** 3.0 Pro / 4.0 Con minimum for honorable discharge

---

## Features Required

### 1. Proficiency Statement Builder
- Keyword/phrase bank organized by category
- Performance level selector (Outstanding → Failing)
- MOS-type suggestions (Admin, Combat Arms, Aviation, etc.)
- Character counter with limit warning
- Auto-formatting to proper style

### 2. Conduct Statement Builder
- Conduct attributes checklist
- Positive/negative tone selector
- Character counter
- Disciplinary mention helper (NJP, counselings, etc.)

### 3. Mark Recommendation Helper
- Show what marks typically correspond to what language
- Warning when mark/language mismatch
- Guidance on when to counsel vs. document

### 4. Output Options
- Copy to clipboard (primary - for MOL paste)
- Print formatted statement
- Save as draft
- Template library for common situations

---

## Proficiency Attributes to Evaluate (Para 4005.3a IRAM)

### Primary Duty Performance
- MOS proficiency
- Technical knowledge
- Mission accomplishment
- Quality of work
- Reliability
- Initiative

### Leadership (Considered for all ranks)
- Sets the example
- Develops subordinates
- Takes charge when needed
- Decision making
- Mentorship

### Additional Skills
- Second language ability
- Computer proficiency
- Special qualifications
- PME completion
- Self-improvement

### Physical Fitness
- PFT/CFT performance
- Physical conditioning
- Promotes fitness in others

---

## Conduct Attributes to Evaluate (Para 4005.3b IRAM)

### Personal Qualities
- Military bearing
- Personal appearance
- Courtesy
- Tact
- Self-discipline
- Morals and ethics

### Reliability
- Dependability
- Punctuality
- Trustworthiness
- Follows orders

### Influence on Others
- Sobriety
- Positive example
- Team player
- Respects others

### Compliance
- Adherence to regulations
- Respect for authority
- Lawful behavior

---

## Keyword/Phrase Banks

### Proficiency - Outstanding (5.0)
```
- "Performs all duties in an exemplary manner"
- "Consistently exceeds standards in all areas"
- "Demonstrates exceptional technical proficiency"
- "Produces work of the highest quality"
- "Displays superior knowledge of MOS"
- "Takes charge and leads effectively"
- "Mentors junior Marines beyond expectations"
- "Achieves exceptional results consistently"
- "Expert-level proficiency in primary duties"
- "Outstanding initiative and resourcefulness"
- "Exceptional problem-solving abilities"
- "Completes all assignments ahead of schedule"
- "Work quality is consistently flawless"
- "Superior performer in all aspects"
```

### Proficiency - Excellent (4.5)
```
- "Exceeds standards in performance of duties"
- "Highly proficient in MOS skills"
- "Produces high-quality work consistently"
- "Strong technical knowledge"
- "Reliable and effective performer"
- "Takes initiative without prompting"
- "Excellent work ethic"
- "Demonstrates leadership potential"
- "Eager to accept additional responsibilities"
- "Thorough and detail-oriented"
```

### Proficiency - Above Average (4.0)
```
- "Performs duties well above average"
- "Solid technical proficiency"
- "Consistent quality of work"
- "Reliable performer"
- "Meets and often exceeds standards"
- "Good initiative"
- "Professional approach to duties"
- "Completes tasks efficiently"
```

### Proficiency - Average (3.0-3.5)
```
- "Performs duties satisfactorily"
- "Meets minimum standards"
- "Adequate technical knowledge"
- "Acceptable work quality"
- "Requires occasional supervision"
- "Generally reliable"
- "Satisfactory performer"
- "Meets basic requirements"
```

### Proficiency - Below Average (2.0-2.5)
```
- "Fails to meet standards consistently"
- "Requires frequent supervision"
- "Work quality is inconsistent"
- "Technical knowledge is lacking"
- "Does not take initiative"
- "Performance needs improvement"
- "Struggles with basic duties"
- "Below expectations for grade"
```

### Proficiency - Poor (1.0-1.5)
```
- "Consistently fails to meet minimum standards"
- "Unable to perform basic duties"
- "Requires constant supervision"
- "Significant performance deficiencies"
- "Has not responded to corrective guidance"
- "Detrimental to unit readiness"
```

### Conduct - Outstanding (5.0)
```
- "Exemplary conduct in all regards"
- "Sets the standard for junior Marines"
- "Outstanding military bearing"
- "Impeccable personal appearance"
- "Role model for peers and subordinates"
- "Exceptional self-discipline"
- "Positive influence on entire unit"
- "Highest moral and ethical standards"
- "Perfect adherence to regulations"
```

### Conduct - Excellent (4.5)
```
- "Excellent conduct and bearing"
- "Strong positive influence on others"
- "Professional demeanor at all times"
- "Highly reliable and trustworthy"
- "Maintains high standards"
- "Positive attitude"
- "Respects authority"
```

### Conduct - Above Average (4.0)
```
- "Good conduct and military bearing"
- "Professional appearance"
- "Reliable and punctual"
- "Positive influence on peers"
- "Follows orders without issue"
- "Good self-discipline"
```

### Conduct - Average (3.0-3.5)
```
- "Satisfactory conduct"
- "Generally follows regulations"
- "Adequate military bearing"
- "Acceptable appearance"
- "Minor issues only"
- "Requires occasional reminder of standards"
```

### Conduct - Below Average (2.0-2.5)
```
- "Conduct issues noted"
- "Has received counseling for behavior"
- "Requires frequent correction"
- "Negative influence on peers"
- "Military bearing needs improvement"
- "Does not consistently follow regulations"
```

### Conduct - Poor (1.0-1.5)
```
- "Serious conduct deficiencies"
- "Has received NJP/disciplinary action"
- "Consistent disregard for regulations"
- "Detrimental influence on unit"
- "Does not respond to corrective measures"
```

---

## Action Verbs Bank

### Leadership
- Leads, directs, guides, mentors, coaches, develops, supervises, manages, coordinates, organizes, delegates, motivates, inspires, influences

### Performance
- Performs, executes, accomplishes, achieves, completes, delivers, produces, maintains, ensures, demonstrates, exhibits, displays

### Initiative
- Initiates, volunteers, seeks, pursues, identifies, recognizes, anticipates, proposes, recommends, implements

### Technical
- Masters, operates, repairs, troubleshoots, analyzes, evaluates, assesses, inspects, verifies, calibrates

### Support
- Assists, supports, aids, helps, contributes, participates, cooperates, collaborates

---

## Template Scenarios

### Template 1: Promotion Statement
```
[Rank] [Name] is [recommended/not recommended] for promotion to [next rank]. 

Proficiency: [Statement describing duty performance, technical skills, leadership, physical fitness]

Conduct: [Statement describing bearing, behavior, influence, compliance]

Recommended marks: Pro [X.X] / Con [X.X]
```

### Template 2: Semi-Annual Counseling
```
During the period [date] to [date], [Rank] [Name] demonstrated [level] performance in assigned duties.

Proficiency observations: [2-3 specific examples]

Conduct observations: [1-2 specific examples]

Areas for improvement: [If applicable]

Recommended marks: Pro [X.X] / Con [X.X]
```

### Template 3: Adverse Counseling Setup
```
[Rank] [Name] has displayed [specific deficiency] requiring formal counseling.

Incident/Pattern: [Description]

Impact: [How this affects performance/unit]

Required corrective action: [Specific steps]

Failure to improve may result in: [Consequences]
```

---

## UI Structure

### Main Screen Layout
```
┌─────────────────────────────────────┐
│     PROS/CONS GENERATOR             │
├─────────────────────────────────────┤
│ Performance Level: [Above Avg ▼]    │
│ MOS Type: [Combat Arms ▼]           │
├─────────────────────────────────────┤
│ PROFICIENCY STATEMENT               │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │ [Textarea for statement]        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Characters: 0/500    [Clear]        │
│                                     │
│ Quick Phrases: [+ Add phrase]       │
│ • Exceeds standards consistently    │
│ • Strong technical proficiency      │
│ • Takes initiative without prompting│
├─────────────────────────────────────┤
│ CONDUCT STATEMENT                   │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │ [Textarea for statement]        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ Characters: 0/500    [Clear]        │
│                                     │
│ Quick Phrases: [+ Add phrase]       │
│ • Professional demeanor             │
│ • Positive influence on peers       │
│ • Excellent military bearing        │
├─────────────────────────────────────┤
│ Recommended: Pro [4.3▼] Con [4.4▼]  │
│ ⚠️ Mark/language alignment: Good    │
├─────────────────────────────────────┤
│ [Copy to Clipboard]  [Save Draft]   │
└─────────────────────────────────────┘
```

### Phrase Bank Modal
```
┌─────────────────────────────────────┐
│     PHRASE BANK - PROFICIENCY       │
│     [Outstanding ▼]                 │
├─────────────────────────────────────┤
│ □ Performs duties in exemplary      │
│   manner                            │
│ □ Exceeds standards in all areas    │
│ □ Exceptional technical proficiency │
│ □ Superior knowledge of MOS         │
│ □ Takes charge and leads            │
│   effectively                       │
│ □ Mentors junior Marines beyond     │
│   expectations                      │
├─────────────────────────────────────┤
│ [Add Selected]           [Cancel]   │
└─────────────────────────────────────┘
```

---

## Mark Alignment Logic

### Warning System
Display warnings when the language tone doesn't match the mark:

```javascript
function checkAlignment(statement, mark) {
  const positiveWords = ['outstanding', 'exceptional', 'superior', 'excellent', 'exemplary'];
  const negativeWords = ['fails', 'lacking', 'deficient', 'poor', 'inadequate', 'requires improvement'];
  
  const hasPositive = positiveWords.some(word => statement.toLowerCase().includes(word));
  const hasNegative = negativeWords.some(word => statement.toLowerCase().includes(word));
  
  if (mark >= 4.5 && hasNegative) {
    return { status: 'warning', message: 'Statement contains negative language but mark is high' };
  }
  if (mark <= 3.0 && hasPositive && !hasNegative) {
    return { status: 'warning', message: 'Statement is positive but mark is low' };
  }
  return { status: 'good', message: 'Mark and language align' };
}
```

---

## Technical Implementation

### Files
```
pros-cons-generator/
├── index.html
├── manifest.json
├── service-worker.js
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── phrases.js          # Keyword/phrase banks
│   ├── templates.js        # Statement templates
│   ├── alignment.js        # Mark/language checking
│   └── storage.js          # Draft saving
├── assets/
│   ├── icon-192.png
│   └── icon-512.png
├── README.md
└── LICENSE
```

### Key Functions

```javascript
// Build proficiency statement
function buildProficiencyStatement(level, mosType, selectedPhrases, customText) {
  // Returns formatted statement
}

// Build conduct statement
function buildConductStatement(level, selectedPhrases, customText) {
  // Returns formatted statement
}

// Check character limit
function checkCharacterLimit(text, limit = 500) {
  return {
    count: text.length,
    remaining: limit - text.length,
    isOver: text.length > limit
  };
}

// Copy to clipboard
async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

// Save draft
function saveDraft(name, proStatement, conStatement, proMark, conMark) {
  const draft = { name, proStatement, conStatement, proMark, conMark, date: new Date() };
  Storage.save(`draft_${Date.now()}`, draft);
}
```

---

## Saved Drafts Feature

Allow users to:
- Save statements as drafts with Marine's name
- Load previous drafts
- Delete old drafts
- View draft history

---

## Testing Checklist

- [ ] All phrase banks load correctly by level
- [ ] Phrases insert into textarea correctly
- [ ] Character counter updates in real-time
- [ ] Mark dropdown works (0.0 to 5.0 in 0.1 increments)
- [ ] Alignment warnings display appropriately
- [ ] Copy to clipboard works on mobile
- [ ] Drafts save and load correctly
- [ ] Clear button resets form
- [ ] Mobile responsive layout works
- [ ] Night mode functions properly
- [ ] Works offline after first load

---

## Community Attribution

This tool was inspired by feedback from the r/USMC community:

| Contributor | Platform | Contribution |
|-------------|----------|--------------|
| **peternemr** | r/USMC | Requested Pros/Cons counseling generator with keyword/statement bank |
| **jj26meu** | r/USMC & Discord | Confirmed format requirements, offered collaboration on testing |

*This tool exists because Marines took the time to share their pain points. Thank you.*

---

## Deployment

1. Push to GitHub repo `jeranaias/pros-cons-generator`
2. Enable GitHub Pages from main branch
3. Test at `https://jeranaias.github.io/pros-cons-generator/`

---

## Git Commit Guidelines

**IMPORTANT:** Do NOT include any Claude, Anthropic, or AI attribution in commit messages. Keep commits professional and human-authored in tone:

```
# GOOD commit messages:
git commit -m "Add proficiency statement templates"
git commit -m "Implement character counter with warning states"
git commit -m "Fix conduct marking dropdown options"

# BAD commit messages (do not use):
git commit -m "Generated by Claude..."
git commit -m "AI-assisted implementation of..."
```

---

*Spec Version 1.0 - December 2025*
