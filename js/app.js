/**
 * Pros/Cons Generator - Main Application
 * USMC Proficiency & Conduct Marking Statement Builder
 */

(function() {
  'use strict';

  // ===========================================
  // Theme Management
  // ===========================================
  const ThemeManager = {
    STORAGE_KEY: 'usmc-tools-theme',
    themes: ['light', 'dark', 'night'],

    init() {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.setTheme(saved);
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        this.setTheme('dark');
      }
      this.updateIcon();
    },

    setTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(this.STORAGE_KEY, theme);
      this.updateIcon();
    },

    toggle() {
      const current = this.getCurrent();
      const nextIndex = (this.themes.indexOf(current) + 1) % this.themes.length;
      this.setTheme(this.themes[nextIndex]);
    },

    getCurrent() {
      return document.documentElement.getAttribute('data-theme') || 'light';
    },

    updateIcon() {
      const theme = this.getCurrent();
      const sunIcon = document.querySelector('.icon--sun');
      const moonIcon = document.querySelector('.icon--moon');
      const tacticalIcon = document.querySelector('.icon--tactical');

      if (sunIcon) sunIcon.classList.toggle('hidden', theme !== 'light');
      if (moonIcon) moonIcon.classList.toggle('hidden', theme !== 'dark');
      if (tacticalIcon) tacticalIcon.classList.toggle('hidden', theme !== 'night');
    }
  };

  // ===========================================
  // DOM Elements
  // ===========================================
  const elements = {
    // Marine Info
    marineName: document.getElementById('marineName'),
    marineRank: document.getElementById('marineRank'),
    marineUnit: document.getElementById('marineUnit'),
    markingPeriod: document.getElementById('markingPeriod'),

    // Dropdowns
    performanceLevel: document.getElementById('performanceLevel'),
    mosType: document.getElementById('mosType'),
    proMark: document.getElementById('proMark'),
    conMark: document.getElementById('conMark'),

    // Textareas
    proficiencyStatement: document.getElementById('proficiencyStatement'),
    conductStatement: document.getElementById('conductStatement'),

    // Character counters
    proCharCount: document.getElementById('proCharCount'),
    conCharCount: document.getElementById('conCharCount'),

    // Buttons
    loadExample: document.getElementById('loadExample'),
    openProPhraseBank: document.getElementById('openProPhraseBank'),
    openConPhraseBank: document.getElementById('openConPhraseBank'),
    clearPro: document.getElementById('clearPro'),
    clearCon: document.getElementById('clearCon'),
    copyToClipboard: document.getElementById('copyToClipboard'),
    exportPDF: document.getElementById('exportPDF'),
    saveDraft: document.getElementById('saveDraft'),
    loadDraft: document.getElementById('loadDraft'),
    resetForm: document.getElementById('resetForm'),
    themeToggle: document.getElementById('themeToggle'),

    // Quick phrases
    proQuickPhrasesList: document.getElementById('proQuickPhrasesList'),
    conQuickPhrasesList: document.getElementById('conQuickPhrasesList'),

    // Alignment warning
    alignmentWarning: document.getElementById('alignmentWarning'),
    alignmentMessage: document.getElementById('alignmentMessage'),

    // Preview
    previewPanel: document.querySelector('.preview-panel'),
    previewDocument: document.getElementById('previewDocument'),
    togglePreview: document.getElementById('togglePreview'),
    togglePreviewFormat: document.getElementById('togglePreviewFormat'),
    previewFormatLabel: document.getElementById('previewFormatLabel'),

    // Toast
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),

    // Phrase Bank Modal
    phraseBankModal: document.getElementById('phraseBankModal'),
    phraseBankTitle: document.getElementById('phraseBankTitle'),
    phraseLevel: document.getElementById('phraseLevel'),
    phraseList: document.getElementById('phraseList'),
    closeModal: document.getElementById('closeModal'),
    cancelPhrases: document.getElementById('cancelPhrases'),
    addSelectedPhrases: document.getElementById('addSelectedPhrases'),

    // Save Draft Modal
    saveDraftModal: document.getElementById('saveDraftModal'),
    draftName: document.getElementById('draftName'),
    closeSaveModal: document.getElementById('closeSaveModal'),
    cancelSave: document.getElementById('cancelSave'),
    confirmSave: document.getElementById('confirmSave'),

    // Load Draft Modal
    loadDraftModal: document.getElementById('loadDraftModal'),
    draftList: document.getElementById('draftList'),
    noDrafts: document.getElementById('noDrafts'),
    closeLoadModal: document.getElementById('closeLoadModal'),
    cancelLoad: document.getElementById('cancelLoad'),

    // Export PDF Modal
    exportPdfModal: document.getElementById('exportPdfModal'),
    closeExportModal: document.getElementById('closeExportModal'),
    cancelExport: document.getElementById('cancelExport'),
    exportWorksheet: document.getElementById('exportWorksheet'),
    exportCard: document.getElementById('exportCard')
  };

  // Current phrase bank type being edited
  let currentPhraseType = 'proficiency';

  // Preview format: 'worksheet' or 'card'
  let previewFormat = 'worksheet';

  // ===========================================
  // Initialization
  // ===========================================
  function init() {
    // Initialize theme
    ThemeManager.init();

    // Populate mark dropdowns
    populateMarkDropdowns();

    // Set up event listeners
    setupEventListeners();

    // Load initial quick phrases
    updateQuickPhrases();

    // Initialize character counts
    updateCharCount('proficiency');
    updateCharCount('conduct');

    // Initialize preview
    updatePreview();
  }

  // ===========================================
  // Populate Mark Dropdowns
  // ===========================================
  function populateMarkDropdowns() {
    const marks = [];
    for (let i = 50; i >= 0; i--) {
      const mark = (i / 10).toFixed(1);
      marks.push(mark);
    }

    [elements.proMark, elements.conMark].forEach(select => {
      select.innerHTML = '';
      marks.forEach(mark => {
        const option = document.createElement('option');
        option.value = mark;
        option.textContent = mark;
        if (mark === '4.0') option.selected = true;
        select.appendChild(option);
      });
    });
  }

  // ===========================================
  // Event Listeners
  // ===========================================
  function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', () => ThemeManager.toggle());

    // Load example button
    if (elements.loadExample) {
      elements.loadExample.addEventListener('click', loadExample);
    }

    // Marine info changes
    [elements.marineName, elements.marineRank, elements.marineUnit, elements.markingPeriod].forEach(el => {
      if (el) el.addEventListener('input', updatePreview);
    });

    // Performance level change
    elements.performanceLevel.addEventListener('change', () => {
      updateQuickPhrases();
      syncMarksToLevel();
      updatePreview();
    });

    // MOS type change
    elements.mosType.addEventListener('change', () => {
      updateQuickPhrases();
      updatePreview();
    });

    // Statement input handlers
    elements.proficiencyStatement.addEventListener('input', () => {
      updateCharCount('proficiency');
      checkAlignment();
      updatePreview();
    });

    elements.conductStatement.addEventListener('input', () => {
      updateCharCount('conduct');
      checkAlignment();
      updatePreview();
    });

    // Mark change handlers
    elements.proMark.addEventListener('change', () => {
      checkAlignment();
      updatePreview();
    });
    elements.conMark.addEventListener('change', () => {
      checkAlignment();
      updatePreview();
    });

    // Clear buttons
    elements.clearPro.addEventListener('click', () => {
      elements.proficiencyStatement.value = '';
      updateCharCount('proficiency');
      checkAlignment();
      updatePreview();
    });

    elements.clearCon.addEventListener('click', () => {
      elements.conductStatement.value = '';
      updateCharCount('conduct');
      checkAlignment();
      updatePreview();
    });

    // Phrase bank buttons
    elements.openProPhraseBank.addEventListener('click', () => openPhraseBank('proficiency'));
    elements.openConPhraseBank.addEventListener('click', () => openPhraseBank('conduct'));

    // Modal close handlers
    elements.closeModal.addEventListener('click', closePhraseBank);
    elements.cancelPhrases.addEventListener('click', closePhraseBank);
    elements.addSelectedPhrases.addEventListener('click', addSelectedPhrases);
    elements.phraseLevel.addEventListener('change', populatePhraseList);

    // Save draft modal
    elements.saveDraft.addEventListener('click', openSaveDraftModal);
    elements.closeSaveModal.addEventListener('click', closeSaveDraftModal);
    elements.cancelSave.addEventListener('click', closeSaveDraftModal);
    elements.confirmSave.addEventListener('click', saveCurrentDraft);

    // Load draft modal
    elements.loadDraft.addEventListener('click', openLoadDraftModal);
    elements.closeLoadModal.addEventListener('click', closeLoadDraftModal);
    elements.cancelLoad.addEventListener('click', closeLoadDraftModal);

    // Export PDF modal
    elements.exportPDF.addEventListener('click', openExportPdfModal);
    elements.closeExportModal.addEventListener('click', closeExportPdfModal);
    elements.cancelExport.addEventListener('click', closeExportPdfModal);
    elements.exportWorksheet.addEventListener('click', () => generatePDF('worksheet'));
    elements.exportCard.addEventListener('click', () => generatePDF('card'));

    // Copy to clipboard
    elements.copyToClipboard.addEventListener('click', copyToClipboard);

    // Reset form
    elements.resetForm.addEventListener('click', resetForm);

    // Preview controls
    if (elements.togglePreview) {
      elements.togglePreview.addEventListener('click', togglePreviewPanel);
    }
    if (elements.togglePreviewFormat) {
      elements.togglePreviewFormat.addEventListener('click', togglePreviewFormat);
    }

    // Template buttons
    document.querySelectorAll('[data-template]').forEach(btn => {
      btn.addEventListener('click', () => applyTemplate(btn.dataset.template));
    });

    // Close modals on overlay click
    [elements.phraseBankModal, elements.saveDraftModal, elements.loadDraftModal, elements.exportPdfModal].forEach(modal => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.remove('modal-overlay--active');
          }
        });
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        closePhraseBank();
        closeSaveDraftModal();
        closeLoadDraftModal();
        closeExportPdfModal();
      }
    });
  }

  // ===========================================
  // Preview Functions
  // ===========================================
  function updatePreview() {
    if (!elements.previewDocument) return;

    const data = getFormData();
    const hasContent = data.proStatement || data.conStatement || data.marineName;

    if (!hasContent) {
      elements.previewDocument.innerHTML = `
        <div class="preview-placeholder">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>Start entering information<br>to see live preview</p>
          <span class="preview-hint">or click "Load Example" to see a sample</span>
        </div>
      `;
      return;
    }

    if (previewFormat === 'worksheet') {
      elements.previewDocument.classList.remove('card-format');
      elements.previewDocument.innerHTML = generateWorksheetHTML(data);
    } else {
      elements.previewDocument.classList.add('card-format');
      elements.previewDocument.innerHTML = generateCardHTML(data);
    }
  }

  function generateWorksheetHTML(data) {
    const today = new Date().toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase();

    return `
      <div class="doc-header">
        <div class="doc-title">Proficiency and Conduct Marks</div>
        <div class="doc-subtitle">Counseling Worksheet</div>
      </div>

      ${(data.marineName || data.marineRank || data.marineUnit || data.markingPeriod) ? `
      <div class="marine-info">
        ${data.marineName ? `<div class="marine-info-row"><span class="marine-info-label">Name:</span> ${escapeHtml(data.marineName)}</div>` : ''}
        ${data.marineRank ? `<div class="marine-info-row"><span class="marine-info-label">Rank:</span> ${escapeHtml(data.marineRank)}</div>` : ''}
        ${data.marineUnit ? `<div class="marine-info-row"><span class="marine-info-label">Unit:</span> ${escapeHtml(data.marineUnit)}</div>` : ''}
        ${data.markingPeriod ? `<div class="marine-info-row"><span class="marine-info-label">Period:</span> ${escapeHtml(data.markingPeriod)}</div>` : ''}
      </div>
      ` : ''}

      <div class="section">
        <div class="section-title">
          Proficiency <span class="mark-display">${data.proMark}</span>
        </div>
        <div class="section-content">
          ${data.proStatement ? escapeHtml(data.proStatement) : '<em style="color: #999;">No proficiency statement entered</em>'}
        </div>
      </div>

      <div class="section">
        <div class="section-title">
          Conduct <span class="mark-display">${data.conMark}</span>
        </div>
        <div class="section-content">
          ${data.conStatement ? escapeHtml(data.conStatement) : '<em style="color: #999;">No conduct statement entered</em>'}
        </div>
      </div>

      <div class="signature-section">
        <div class="signature-block">
          <div class="signature-line">Counseling NCO/SNCO Signature</div>
          <div class="date-line signature-line">Date: ________________</div>
        </div>
        <div class="signature-block">
          <div class="signature-line">Marine's Signature</div>
          <div class="date-line signature-line">Date: ________________</div>
        </div>
      </div>
    `;
  }

  function generateCardHTML(data) {
    return `
      <div class="statement-block">
        <div class="statement-label">Proficiency</div>
        <div class="statement-text">
          ${data.proStatement ? escapeHtml(data.proStatement) : '<em style="color: #999;">No statement</em>'}
        </div>
      </div>

      <div class="statement-block">
        <div class="statement-label">Conduct</div>
        <div class="statement-text">
          ${data.conStatement ? escapeHtml(data.conStatement) : '<em style="color: #999;">No statement</em>'}
        </div>
      </div>

      <div class="marks-row">
        <div class="mark-item">
          <div class="mark-label">PRO</div>
          <div class="mark-value">${data.proMark}</div>
        </div>
        <div class="mark-item">
          <div class="mark-label">CON</div>
          <div class="mark-value">${data.conMark}</div>
        </div>
      </div>
    `;
  }

  function togglePreviewPanel() {
    if (elements.previewPanel) {
      elements.previewPanel.classList.toggle('hidden');
    }
  }

  function togglePreviewFormat() {
    previewFormat = previewFormat === 'worksheet' ? 'card' : 'worksheet';
    if (elements.previewFormatLabel) {
      elements.previewFormatLabel.textContent = previewFormat === 'worksheet' ? 'Worksheet' : 'Card';
    }
    updatePreview();
  }

  // ===========================================
  // PDF Generation
  // ===========================================
  function openExportPdfModal() {
    elements.exportPdfModal.classList.add('modal-overlay--active');
  }

  function closeExportPdfModal() {
    elements.exportPdfModal.classList.remove('modal-overlay--active');
  }

  function generatePDF(format) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = getFormData();

    if (format === 'worksheet') {
      generateWorksheetPDF(doc, data);
    } else {
      generateCardPDF(doc, data);
    }

    // Generate filename
    const filename = data.marineName
      ? `proscons_${data.marineName.replace(/[^a-z0-9]/gi, '_')}.pdf`
      : 'proscons_worksheet.pdf';

    doc.save(filename);
    closeExportPdfModal();
    showToast('PDF downloaded successfully!');
  }

  function generateWorksheetPDF(doc, data) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;

    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFICIENCY AND CONDUCT MARKS', pageWidth / 2, y, { align: 'center' });
    y += 7;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Counseling Worksheet', pageWidth / 2, y, { align: 'center' });
    y += 10;

    // Divider line
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Marine Info Box
    if (data.marineName || data.marineRank || data.marineUnit || data.markingPeriod) {
      doc.setFillColor(245, 245, 245);
      doc.rect(margin, y, contentWidth, 30, 'F');
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, y, contentWidth, 30, 'S');

      y += 7;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');

      if (data.marineName) {
        doc.text('Name:', margin + 5, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data.marineName, margin + 25, y);
        doc.setFont('helvetica', 'bold');
      }
      if (data.marineRank) {
        doc.text('Rank:', margin + 100, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data.marineRank, margin + 118, y);
      }

      y += 7;
      doc.setFont('helvetica', 'bold');
      if (data.marineUnit) {
        doc.text('Unit:', margin + 5, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data.marineUnit, margin + 20, y);
        doc.setFont('helvetica', 'bold');
      }
      if (data.markingPeriod) {
        doc.text('Period:', margin + 100, y);
        doc.setFont('helvetica', 'normal');
        doc.text(data.markingPeriod, margin + 122, y);
      }

      y += 20;
    }

    // Proficiency Section
    y += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFICIENCY', margin, y);

    // Mark box
    doc.setFillColor(255, 255, 255);
    doc.rect(pageWidth - margin - 25, y - 5, 25, 10, 'FD');
    doc.setFontSize(11);
    doc.text(data.proMark, pageWidth - margin - 12.5, y + 2, { align: 'center' });

    y += 5;
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;

    // Proficiency text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.proStatement) {
      const proLines = doc.splitTextToSize(data.proStatement, contentWidth - 10);
      doc.text(proLines, margin + 5, y);
      y += (proLines.length * 5) + 10;
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('No proficiency statement entered', margin + 5, y);
      doc.setTextColor(0, 0, 0);
      y += 15;
    }

    // Conduct Section
    y += 5;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDUCT', margin, y);

    // Mark box
    doc.rect(pageWidth - margin - 25, y - 5, 25, 10, 'FD');
    doc.setFontSize(11);
    doc.text(data.conMark, pageWidth - margin - 12.5, y + 2, { align: 'center' });

    y += 5;
    doc.line(margin, y, pageWidth - margin, y);
    y += 7;

    // Conduct text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.conStatement) {
      const conLines = doc.splitTextToSize(data.conStatement, contentWidth - 10);
      doc.text(conLines, margin + 5, y);
      y += (conLines.length * 5) + 10;
    } else {
      doc.setTextColor(150, 150, 150);
      doc.text('No conduct statement entered', margin + 5, y);
      doc.setTextColor(0, 0, 0);
      y += 15;
    }

    // Signature Section
    y += 20;
    const sigWidth = (contentWidth - 20) / 2;

    // Left signature block
    doc.line(margin, y, margin + sigWidth, y);
    doc.setFontSize(9);
    doc.text('Counseling NCO/SNCO Signature', margin, y + 5);
    doc.text('Date: _______________', margin, y + 12);

    // Right signature block
    doc.line(margin + sigWidth + 20, y, pageWidth - margin, y);
    doc.text("Marine's Signature", margin + sigWidth + 20, y + 5);
    doc.text('Date: _______________', margin + sigWidth + 20, y + 12);
  }

  function generateCardPDF(doc, data) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 30;

    // Simple header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROS/CONS STATEMENT', pageWidth / 2, y, { align: 'center' });
    y += 15;

    if (data.marineName) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(data.marineName, pageWidth / 2, y, { align: 'center' });
      y += 10;
    }

    // Proficiency box
    y += 5;
    doc.setFillColor(139, 0, 0);
    doc.rect(margin, y, 4, 30, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, y, contentWidth, 30, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('PROFICIENCY', margin + 8, y + 7);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.proStatement) {
      const proLines = doc.splitTextToSize(data.proStatement, contentWidth - 15);
      doc.text(proLines.slice(0, 3), margin + 8, y + 14);
    }

    y += 35;

    // Conduct box
    doc.setFillColor(139, 0, 0);
    doc.rect(margin, y, 4, 30, 'F');
    doc.rect(margin, y, contentWidth, 30, 'S');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('CONDUCT', margin + 8, y + 7);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    if (data.conStatement) {
      const conLines = doc.splitTextToSize(data.conStatement, contentWidth - 15);
      doc.text(conLines.slice(0, 3), margin + 8, y + 14);
    }

    y += 40;

    // Marks display
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    const centerX = pageWidth / 2;

    // PRO mark
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('PRO', centerX - 25, y, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(data.proMark, centerX - 25, y + 12, { align: 'center' });

    // CON mark
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('CON', centerX + 25, y, { align: 'center' });
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(data.conMark, centerX + 25, y + 12, { align: 'center' });
  }

  // ===========================================
  // Get Form Data
  // ===========================================
  function getFormData() {
    return {
      marineName: elements.marineName ? elements.marineName.value.trim() : '',
      marineRank: elements.marineRank ? elements.marineRank.value : '',
      marineUnit: elements.marineUnit ? elements.marineUnit.value.trim() : '',
      markingPeriod: elements.markingPeriod ? elements.markingPeriod.value.trim() : '',
      proStatement: elements.proficiencyStatement.value.trim(),
      conStatement: elements.conductStatement.value.trim(),
      proMark: elements.proMark.value,
      conMark: elements.conMark.value,
      performanceLevel: elements.performanceLevel.value,
      mosType: elements.mosType.value
    };
  }

  // ===========================================
  // Character Count
  // ===========================================
  function updateCharCount(type) {
    const textarea = type === 'proficiency' ?
      elements.proficiencyStatement : elements.conductStatement;
    const counter = type === 'proficiency' ?
      elements.proCharCount : elements.conCharCount;

    const count = textarea.value.length;
    const limit = 500;

    counter.textContent = `${count}/${limit}`;
    counter.classList.remove('char-counter--warning', 'char-counter--error');

    if (count > limit) {
      counter.classList.add('char-counter--error');
    } else if (count > limit * 0.9) {
      counter.classList.add('char-counter--warning');
    }
  }

  // ===========================================
  // Quick Phrases
  // ===========================================
  function updateQuickPhrases() {
    const level = elements.performanceLevel.value;
    const mosType = elements.mosType.value;

    // Update proficiency quick phrases
    const proPhrases = PhraseBanks.getQuickPhrases('proficiency', level);
    const mosPhrases = PhraseBanks.getMosPhrases(mosType);
    const allProPhrases = [...proPhrases, ...mosPhrases.slice(0, 2)];

    elements.proQuickPhrasesList.innerHTML = '';
    allProPhrases.forEach(phrase => {
      const btn = createQuickPhraseButton(phrase, 'proficiency');
      elements.proQuickPhrasesList.appendChild(btn);
    });

    // Update conduct quick phrases
    const conPhrases = PhraseBanks.getQuickPhrases('conduct', level);
    elements.conQuickPhrasesList.innerHTML = '';
    conPhrases.forEach(phrase => {
      const btn = createQuickPhraseButton(phrase, 'conduct');
      elements.conQuickPhrasesList.appendChild(btn);
    });
  }

  function createQuickPhraseButton(phrase, type) {
    const btn = document.createElement('button');
    btn.className = 'quick-phrase';
    btn.textContent = phrase;
    btn.addEventListener('click', () => insertPhrase(phrase, type));
    return btn;
  }

  function insertPhrase(phrase, type) {
    const textarea = type === 'proficiency' ?
      elements.proficiencyStatement : elements.conductStatement;

    const currentText = textarea.value.trim();
    if (currentText) {
      // Add phrase with proper spacing
      const needsSpace = !currentText.endsWith('.') && !currentText.endsWith(' ');
      const separator = currentText.endsWith('.') ? ' ' : (needsSpace ? '. ' : '');
      textarea.value = currentText + separator + phrase + '.';
    } else {
      textarea.value = phrase + '.';
    }

    updateCharCount(type);
    checkAlignment();
    updatePreview();
    textarea.focus();
  }

  // ===========================================
  // Sync Marks to Performance Level
  // ===========================================
  function syncMarksToLevel() {
    const level = elements.performanceLevel.value;
    elements.proMark.value = level;
    elements.conMark.value = level;
    checkAlignment();
  }

  // ===========================================
  // Phrase Bank Modal
  // ===========================================
  function openPhraseBank(type) {
    currentPhraseType = type;
    elements.phraseBankTitle.textContent = `Phrase Bank - ${type === 'proficiency' ? 'Proficiency' : 'Conduct'}`;
    elements.phraseLevel.value = elements.performanceLevel.value;
    populatePhraseList();
    elements.phraseBankModal.classList.add('modal-overlay--active');
  }

  function closePhraseBank() {
    elements.phraseBankModal.classList.remove('modal-overlay--active');
  }

  function populatePhraseList() {
    const level = elements.phraseLevel.value;
    const phrases = PhraseBanks.getPhrases(currentPhraseType, level);

    elements.phraseList.innerHTML = '';

    if (phrases.length === 0) {
      elements.phraseList.innerHTML = '<p class="text-secondary text-sm">No phrases available for this level.</p>';
      return;
    }

    phrases.forEach((phrase, index) => {
      const item = document.createElement('div');
      item.className = 'phrase-item';
      item.innerHTML = `
        <input type="checkbox" id="phrase-${index}" value="${escapeHtml(phrase)}">
        <label for="phrase-${index}">${escapeHtml(phrase)}</label>
      `;
      elements.phraseList.appendChild(item);
    });
  }

  function addSelectedPhrases() {
    const checkboxes = elements.phraseList.querySelectorAll('input[type="checkbox"]:checked');

    if (checkboxes.length === 0) {
      showToast('Please select at least one phrase');
      return;
    }

    checkboxes.forEach(cb => {
      insertPhrase(cb.value, currentPhraseType);
    });

    closePhraseBank();
    showToast(`Added ${checkboxes.length} phrase${checkboxes.length > 1 ? 's' : ''}`);
  }

  // ===========================================
  // Alignment Checking
  // ===========================================
  function checkAlignment() {
    const result = Alignment.checkBothStatements(
      elements.proficiencyStatement.value,
      elements.proMark.value,
      elements.conductStatement.value,
      elements.conMark.value
    );

    if (result.status === 'warning' && result.messages.length > 0) {
      elements.alignmentWarning.classList.remove('hidden');
      elements.alignmentWarning.className = 'alert alert--warning mt-4';
      elements.alignmentMessage.textContent = result.messages.join(' ');
    } else if (result.status === 'good') {
      elements.alignmentWarning.classList.remove('hidden');
      elements.alignmentWarning.className = 'alert alert--success mt-4';
      elements.alignmentMessage.textContent = result.messages[0] || 'Mark and language align.';
    } else {
      elements.alignmentWarning.classList.add('hidden');
    }
  }

  // ===========================================
  // Templates
  // ===========================================
  function applyTemplate(templateId) {
    const template = Templates.applyTemplate(templateId);
    const suggestedMarks = Templates.getSuggestedMarks(templateId);

    if (template.proficiency) {
      elements.proficiencyStatement.value = template.proficiency;
      updateCharCount('proficiency');
    }

    if (template.conduct) {
      elements.conductStatement.value = template.conduct;
      updateCharCount('conduct');
    }

    elements.proMark.value = suggestedMarks.pro;
    elements.conMark.value = suggestedMarks.con;

    checkAlignment();
    updatePreview();
    showToast(`Applied ${Templates.getTemplate(templateId).name} template`);
  }

  // ===========================================
  // Copy to Clipboard
  // ===========================================
  async function copyToClipboard() {
    const data = getFormData();

    if (!data.proStatement && !data.conStatement) {
      showToast('Please enter at least one statement');
      return;
    }

    let text = '';

    if (data.marineName) {
      text += `${data.marineRank ? data.marineRank + ' ' : ''}${data.marineName}\n`;
      if (data.markingPeriod) text += `Period: ${data.markingPeriod}\n`;
      text += '\n';
    }

    if (data.proStatement) {
      text += `PROFICIENCY (${data.proMark}):\n${data.proStatement}\n\n`;
    }

    if (data.conStatement) {
      text += `CONDUCT (${data.conMark}):\n${data.conStatement}`;
    }

    try {
      await navigator.clipboard.writeText(text.trim());
      showToast('Copied to clipboard!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text.trim();
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
      } catch (e) {
        showToast('Failed to copy. Please copy manually.');
      }
      document.body.removeChild(textArea);
    }
  }

  // ===========================================
  // Save Draft Modal
  // ===========================================
  function openSaveDraftModal() {
    const data = getFormData();
    elements.draftName.value = data.marineName || '';
    elements.saveDraftModal.classList.add('modal-overlay--active');
    elements.draftName.focus();
  }

  function closeSaveDraftModal() {
    elements.saveDraftModal.classList.remove('modal-overlay--active');
  }

  function saveCurrentDraft() {
    const name = elements.draftName.value.trim();

    if (!name) {
      showToast('Please enter a name for the draft');
      elements.draftName.focus();
      return;
    }

    const data = getFormData();
    data.name = name;

    Storage.saveDraft(name, data);
    closeSaveDraftModal();
    showToast('Draft saved successfully!');
  }

  // ===========================================
  // Load Draft Modal
  // ===========================================
  function openLoadDraftModal() {
    const drafts = Storage.getAllDrafts();

    elements.draftList.innerHTML = '';

    if (drafts.length === 0) {
      elements.noDrafts.classList.remove('hidden');
      elements.draftList.classList.add('hidden');
    } else {
      elements.noDrafts.classList.add('hidden');
      elements.draftList.classList.remove('hidden');

      drafts.forEach(draft => {
        const item = document.createElement('div');
        item.className = 'draft-item';
        item.innerHTML = `
          <div class="draft-item__info">
            <div class="draft-item__name">${escapeHtml(draft.name)}</div>
            <div class="draft-item__date">${Storage.formatDate(draft.date)}</div>
          </div>
          <div class="draft-item__actions">
            <button class="btn btn--sm btn--primary load-draft-btn" data-id="${draft.id}">Load</button>
            <button class="btn btn--sm btn--danger delete-draft-btn" data-id="${draft.id}">Delete</button>
          </div>
        `;
        elements.draftList.appendChild(item);
      });

      // Add event listeners to buttons
      elements.draftList.querySelectorAll('.load-draft-btn').forEach(btn => {
        btn.addEventListener('click', () => loadDraft(btn.dataset.id));
      });

      elements.draftList.querySelectorAll('.delete-draft-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteDraft(btn.dataset.id);
        });
      });
    }

    elements.loadDraftModal.classList.add('modal-overlay--active');
  }

  function closeLoadDraftModal() {
    elements.loadDraftModal.classList.remove('modal-overlay--active');
  }

  function loadDraft(id) {
    const draft = Storage.loadDraft(id);

    if (!draft) {
      showToast('Draft not found');
      return;
    }

    // Load marine info
    if (elements.marineName) elements.marineName.value = draft.marineName || '';
    if (elements.marineRank) elements.marineRank.value = draft.marineRank || '';
    if (elements.marineUnit) elements.marineUnit.value = draft.marineUnit || '';
    if (elements.markingPeriod) elements.markingPeriod.value = draft.markingPeriod || '';

    // Load statements and marks
    elements.proficiencyStatement.value = draft.proStatement || '';
    elements.conductStatement.value = draft.conStatement || '';
    elements.proMark.value = draft.proMark || '4.0';
    elements.conMark.value = draft.conMark || '4.0';
    elements.performanceLevel.value = draft.performanceLevel || '4.0';
    elements.mosType.value = draft.mosType || 'general';

    updateCharCount('proficiency');
    updateCharCount('conduct');
    updateQuickPhrases();
    checkAlignment();
    updatePreview();

    closeLoadDraftModal();
    showToast('Draft loaded successfully!');
  }

  function deleteDraft(id) {
    if (confirm('Are you sure you want to delete this draft?')) {
      Storage.deleteDraft(id);
      openLoadDraftModal(); // Refresh the list
      showToast('Draft deleted');
    }
  }

  // ===========================================
  // Reset Form
  // ===========================================
  function resetForm() {
    if (confirm('Are you sure you want to reset all fields?')) {
      // Reset marine info
      if (elements.marineName) elements.marineName.value = '';
      if (elements.marineRank) elements.marineRank.value = '';
      if (elements.marineUnit) elements.marineUnit.value = '';
      if (elements.markingPeriod) elements.markingPeriod.value = '';

      // Reset statements
      elements.proficiencyStatement.value = '';
      elements.conductStatement.value = '';
      elements.performanceLevel.value = '4.0';
      elements.mosType.value = 'general';
      elements.proMark.value = '4.0';
      elements.conMark.value = '4.0';

      updateCharCount('proficiency');
      updateCharCount('conduct');
      updateQuickPhrases();
      elements.alignmentWarning.classList.add('hidden');
      updatePreview();

      showToast('Form reset');
    }
  }

  // ===========================================
  // Toast Notifications
  // ===========================================
  function showToast(message) {
    elements.toastMessage.textContent = message;
    elements.toast.classList.remove('hidden');
    elements.toast.classList.add('toast--visible');

    setTimeout(() => {
      elements.toast.classList.remove('toast--visible');
      setTimeout(() => {
        elements.toast.classList.add('hidden');
      }, 300);
    }, 2500);
  }

  // ===========================================
  // Utility Functions
  // ===========================================
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ===========================================
  // Load Example Data
  // ===========================================
  function loadExample() {
    // Sample Marine info
    if (elements.marineName) elements.marineName.value = 'SMITH, JOHN A';
    if (elements.marineRank) elements.marineRank.value = 'LCpl';
    if (elements.marineUnit) elements.marineUnit.value = '1st Bn, 5th Marines';
    if (elements.markingPeriod) elements.markingPeriod.value = 'OCT 2024 - MAR 2025';

    // Sample proficiency statement (4.4 level - above average)
    elements.proficiencyStatement.value = 'LCpl Smith consistently demonstrates exceptional technical proficiency in all aspects of his MOS. He has trained 3 junior Marines on weapons maintenance procedures and led his fire team during MOUT training with outstanding results. Completed all assigned PME ahead of schedule and actively pursues self-improvement. Recommended for promotion to Corporal.';

    // Sample conduct statement (4.4 level)
    elements.conductStatement.value = 'LCpl Smith exemplifies the highest standards of military bearing and conduct. He maintains impeccable personal appearance and is always squared away for inspection. Demonstrates maturity beyond his rank and serves as a positive role model for junior Marines. Zero adverse conduct issues during this marking period. Actively participates in unit volunteer events and embodies our core values.';

    // Set marks
    elements.proMark.value = '4.4';
    elements.conMark.value = '4.4';
    elements.performanceLevel.value = '4.4';
    elements.mosType.value = 'general';

    // Update UI
    updateCharCount('proficiency');
    updateCharCount('conduct');
    updateQuickPhrases();
    checkAlignment();
    updatePreview();

    showToast('Example loaded! Edit fields as needed.');
  }

  // ===========================================
  // Initialize on DOM Ready
  // ===========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
