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
    openProPhraseBank: document.getElementById('openProPhraseBank'),
    openConPhraseBank: document.getElementById('openConPhraseBank'),
    clearPro: document.getElementById('clearPro'),
    clearCon: document.getElementById('clearCon'),
    copyToClipboard: document.getElementById('copyToClipboard'),
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
    cancelLoad: document.getElementById('cancelLoad')
  };

  // Current phrase bank type being edited
  let currentPhraseType = 'proficiency';

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

    // Performance level change
    elements.performanceLevel.addEventListener('change', () => {
      updateQuickPhrases();
      syncMarksToLevel();
    });

    // MOS type change
    elements.mosType.addEventListener('change', updateQuickPhrases);

    // Statement input handlers
    elements.proficiencyStatement.addEventListener('input', () => {
      updateCharCount('proficiency');
      checkAlignment();
    });

    elements.conductStatement.addEventListener('input', () => {
      updateCharCount('conduct');
      checkAlignment();
    });

    // Mark change handlers
    elements.proMark.addEventListener('change', checkAlignment);
    elements.conMark.addEventListener('change', checkAlignment);

    // Clear buttons
    elements.clearPro.addEventListener('click', () => {
      elements.proficiencyStatement.value = '';
      updateCharCount('proficiency');
      checkAlignment();
    });

    elements.clearCon.addEventListener('click', () => {
      elements.conductStatement.value = '';
      updateCharCount('conduct');
      checkAlignment();
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

    // Copy to clipboard
    elements.copyToClipboard.addEventListener('click', copyToClipboard);

    // Reset form
    elements.resetForm.addEventListener('click', resetForm);

    // Template buttons
    document.querySelectorAll('[data-template]').forEach(btn => {
      btn.addEventListener('click', () => applyTemplate(btn.dataset.template));
    });

    // Close modals on overlay click
    [elements.phraseBankModal, elements.saveDraftModal, elements.loadDraftModal].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('modal-overlay--active');
        }
      });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape to close modals
      if (e.key === 'Escape') {
        closePhraseBank();
        closeSaveDraftModal();
        closeLoadDraftModal();
      }
    });
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
        <input type="checkbox" id="phrase-${index}" value="${phrase}">
        <label for="phrase-${index}">${phrase}</label>
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
    showToast(`Applied ${Templates.getTemplate(templateId).name} template`);
  }

  // ===========================================
  // Copy to Clipboard
  // ===========================================
  async function copyToClipboard() {
    const proStatement = elements.proficiencyStatement.value.trim();
    const conStatement = elements.conductStatement.value.trim();
    const proMark = elements.proMark.value;
    const conMark = elements.conMark.value;

    if (!proStatement && !conStatement) {
      showToast('Please enter at least one statement');
      return;
    }

    let text = '';

    if (proStatement) {
      text += `PROFICIENCY (${proMark}):\n${proStatement}\n\n`;
    }

    if (conStatement) {
      text += `CONDUCT (${conMark}):\n${conStatement}`;
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
    elements.draftName.value = '';
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

    const draftData = {
      proStatement: elements.proficiencyStatement.value,
      conStatement: elements.conductStatement.value,
      proMark: elements.proMark.value,
      conMark: elements.conMark.value,
      performanceLevel: elements.performanceLevel.value,
      mosType: elements.mosType.value
    };

    Storage.saveDraft(name, draftData);
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
  // Initialize on DOM Ready
  // ===========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
