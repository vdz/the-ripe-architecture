/**
 * The Ripe Method - Documentation App
 * 
 * A simple SPA that loads and renders markdown documentation.
 * Requires a local server to work (fetch won't work with file://)
 */

// ===========================================
// Configuration
// ===========================================

const CONFIG = {
  defaultFile: '01-client-architecture/00-introduction.md',
  contentSelector: '#content',
  navItemSelector: '.nav-item',
};

// ===========================================
// Markdown Renderer
// ===========================================

const renderer = {
  /**
   * Initialize marked.js with syntax highlighting
   */
  init() {
    if (typeof marked === 'undefined') {
      console.error('marked.js not loaded');
      return;
    }

    marked.setOptions({
      highlight: (code, lang) => {
        if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        if (typeof hljs !== 'undefined') {
          return hljs.highlightAuto(code).value;
        }
        return code;
      },
      breaks: false,
      gfm: true,
    });

    // Initialize mermaid for diagrams
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({ 
        startOnLoad: false,
        theme: 'neutral',
        securityLevel: 'loose',
      });
    }
  },

  /**
   * Render markdown string to HTML
   */
  render(markdown) {
    return marked.parse(markdown);
  },

  /**
   * Process mermaid code blocks after content is inserted
   */
  async processMermaid(container) {
    if (typeof mermaid === 'undefined') return;

    const mermaidBlocks = container.querySelectorAll('code.language-mermaid');
    
    mermaidBlocks.forEach((block) => {
      const pre = block.parentElement;
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = block.textContent;
      pre.replaceWith(div);
    });

    try {
      await mermaid.run({ nodes: container.querySelectorAll('.mermaid') });
    } catch (error) {
      console.warn('Mermaid rendering failed:', error);
    }
  },
};

// ===========================================
// File Loader
// ===========================================

const loader = {
  /**
   * Check if running from file:// protocol
   */
  isFileProtocol() {
    return window.location.protocol === 'file:';
  },

  /**
   * Load a file and return its contents
   */
  async loadFile(path) {
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.text();
  },

  /**
   * Determine if file is code (not markdown)
   */
  isCodeFile(path) {
    return /\.(ts|tsx|js|jsx|json)$/.test(path);
  },

  /**
   * Get language from file extension
   */
  getLanguage(path) {
    const ext = path.split('.').pop();
    const langMap = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      json: 'json',
    };
    return langMap[ext] || 'plaintext';
  },
};

// ===========================================
// Navigation
// ===========================================

const nav = {
  items: null,

  init() {
    this.items = document.querySelectorAll(CONFIG.navItemSelector);
    this.bindEvents();
  },

  bindEvents() {
    this.items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const file = item.dataset.file;
        if (file) {
          this.setActive(item);
          app.loadContent(file);
          history.pushState(null, '', '#' + file);
        }
      });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      const file = this.getFileFromHash();
      this.setActiveByFile(file);
      app.loadContent(file);
    });
  },

  setActive(activeItem) {
    this.items.forEach((item) => item.classList.remove('active'));
    activeItem.classList.add('active');
  },

  setActiveByFile(file) {
    this.items.forEach((item) => {
      item.classList.toggle('active', item.dataset.file === file);
    });
  },

  getFileFromHash() {
    return location.hash.slice(1) || CONFIG.defaultFile;
  },
};

// ===========================================
// Main App
// ===========================================

const app = {
  contentEl: null,

  init() {
    this.contentEl = document.querySelector(CONFIG.contentSelector);
    renderer.init();
    nav.init();

    // Check if running from file://
    if (loader.isFileProtocol()) {
      this.showServerNotice();
      return;
    }

    // Load initial content
    const initialFile = nav.getFileFromHash();
    nav.setActiveByFile(initialFile);
    this.loadContent(initialFile);
  },

  showServerNotice() {
    this.contentEl.innerHTML = `
      <div class="server-notice">
        <h3>Local Server Required</h3>
        <p>This documentation viewer needs a local server to load files.</p>
        <p>Run one of these commands in the <code>docs/</code> folder:</p>
        <pre><code># Using npx (Node.js)
npx serve .

# Using Python
python -m http.server 3000

# Using PHP
php -S localhost:3000</code></pre>
        <p>Then open <code>http://localhost:3000</code></p>
      </div>
      <h1>The Ripe Method</h1>
      <p>Welcome to the MCE Architecture Onboarding documentation.</p>
      <p>Start a local server to browse the full documentation interactively.</p>
    `;
  },

  showLoading() {
    this.contentEl.innerHTML = '<div class="loading">Loading</div>';
  },

  showError(message, details = '') {
    this.contentEl.innerHTML = `
      <div class="error">
        <h2>Failed to Load</h2>
        <p>${message}</p>
        ${details ? `<p><code>${details}</code></p>` : ''}
      </div>
    `;
  },

  async loadContent(path) {
    this.showLoading();

    try {
      const text = await loader.loadFile(path);

      if (loader.isCodeFile(path)) {
        this.renderCode(path, text);
      } else {
        await this.renderMarkdown(path, text);
      }

      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Failed to load:', path, error);
      this.showError(`Could not load: ${path}`, error.message);
    }
  },

  renderCode(path, code) {
    const filename = path.split('/').pop();
    const lang = loader.getLanguage(path);
    
    let highlighted = code;
    if (typeof hljs !== 'undefined') {
      highlighted = hljs.highlight(code, { language: lang }).value;
    }

    this.contentEl.innerHTML = `
      <h1>${filename}</h1>
      <p>Example code file</p>
      <pre><code class="hljs language-${lang}">${highlighted}</code></pre>
    `;
  },

  async renderMarkdown(path, markdown) {
    // Render markdown to HTML
    let html = renderer.render(markdown);

    // Fix relative image paths
    const basePath = path.substring(0, path.lastIndexOf('/') + 1);
    html = html.replace(/src="\.\.\/images\//g, `src="${basePath}../images/`);
    html = html.replace(/src="\.\.\/\.\.\/images\//g, `src="images/`);

    // Insert into DOM
    this.contentEl.innerHTML = html;

    // Process mermaid diagrams
    await renderer.processMermaid(this.contentEl);
  },
};

// ===========================================
// Initialize on DOM ready
// ===========================================

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}
