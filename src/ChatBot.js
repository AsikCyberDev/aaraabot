import { LitElement, css, html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { unsafeHTML } from 'https://cdn.jsdelivr.net/npm/lit-html@2/directives/unsafe-html.js';
import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import ReactMarkdown from 'https://cdn.jsdelivr.net/npm/react-markdown@9.0.1/+esm';
import { PrismLight as SyntaxHighlighter } from 'https://cdn.jsdelivr.net/npm/react-syntax-highlighter@15.5.0/+esm';
import atomDark from 'https://cdn.jsdelivr.net/npm/react-syntax-highlighter@15.5.0/dist/esm/styles/prism/atom-dark.js';
// Define default models
const defaultModels = [
  "gpt-4o",
  "gpt-4o-mini",
  "Meta-Llama-3-70B-Instruct",
  "Meta-Llama-3-8B-Instruct",
  "Phi-3-medium-128k-instruct",
  "Phi-3-mini-4k-instruct",
];

class ChatBot extends LitElement {
  static properties = {
    endpoint: { type: String },
    heading: { type: String },
    models: { type: Array },
    theme: { type: String },
    initialModel: { type: String },
    initialTemperature: { type: Number },
    initialMaxTokens: { type: Number },
    initialTopP: { type: Number },
    input: { type: String },
    messages: { type: Array },
    isLoading: { type: Boolean },
    isChatOpen: { type: Boolean },
    isSettingsOpen: { type: Boolean },
    selectedModel: { type: String },
    temperature: { type: Number },
    maxTokens: { type: Number },
    topP: { type: Number },
  };

  static styles = css`
    /* Include all the styles from the CSS file */
    :host {
      display: contents;
    }
    /* Base styles */
    .fixed { position: fixed; }
    .bottom-4 { bottom: 1rem; }
    .right-4 { right: 1rem; }
    .bg-gray-800 { background-color: #1a202c; }
    .bg-white { background-color: #ffffff; }
    .text-white { color: #ffffff; }
    .rounded-lg { border-radius: 0.5rem; }
    .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    .w-80 { width: 20rem; }
    .md\\:w-96 { width: 24rem; }
    .max-h-\\[80vh\\] { max-height: 80vh; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .bg-blue-600 { background-color: #2563eb; }
    .bg-blue-500 { background-color: #3b82f6; }
    .p-3 { padding: 0.75rem; }
    .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
    .text-lg { font-size: 1.125rem; }
    .font-semibold { font-weight: 600; }
    .space-x-2 > * + * { margin-left: 0.5rem; }
    .w-5 { width: 1.25rem; }
    .h-5 { height: 1.25rem; }
    .cursor-pointer { cursor: pointer; }
    .hover\\:text-gray-300:hover { color: #d1d5db; }
    .bg-gray-700 { background-color: #374151; }
    .border-t { border-top-width: 1px; }
    .border-gray-600 { border-color: #4b5563; }
    .space-y-4 > * + * { margin-top: 1rem; }
    .block { display: block; }
    .text-sm { font-size: 0.875rem; }
    .text-gray-200 { color: #e5e7eb; }
    .mt-1 { margin-top: 0.25rem; }
    .w-full { width: 100%; }
    .pl-3 { padding-left: 0.75rem; }
    .pr-10 { padding-right: 2.5rem; }
    .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
    .text-base { font-size: 1rem; }
    .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
    .focus\\:ring-blue-500:focus { --tw-ring-opacity: 1; --tw-ring-color: rgba(59, 130, 246, var(--tw-ring-opacity)); }
    .focus\\:border-blue-500:focus { --tw-border-opacity: 1; border-color: rgba(59, 130, 246, var(--tw-border-opacity)); }
    .sm\\:text-sm { font-size: 0.875rem; }
    .rounded-md { border-radius: 0.375rem; }
    .flex-1 { flex: 1 1 0%; }
    .overflow-y-auto { overflow-y: auto; }
    .p-4 { padding: 1rem; }
    .bg-gray-600 { background-color: #4b5563; }
    .rounded-lg { border-radius: 0.5rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .transition-colors { transition-property: background-color, border-color, color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
    .duration-150 { transition-duration: 150ms; }
    .opacity-50 { opacity: 0.5; }
    .cursor-not-allowed { cursor: not-allowed; }

    /* Custom styles */
    ::-webkit-scrollbar {
      width: 8px;
    }
    ::-webkit-scrollbar-track {
      background: #2d3748;
    }
    ::-webkit-scrollbar-thumb {
      background: #4a5568;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #718096;
    }
    .user-message {
      background-color: #2d3748;
      color: #f7fafc;
      border-radius: 20px 20px 0 20px;
      transition: all 0.3s ease-in-out;
    }
    .assistant-message {
      background-color: #4a5568;
      color: #f7fafc;
      border-radius: 20px 20px 20px 0;
      transition: all 0.3s ease-in-out;
    }
    .message:hover {
      transform: scale(1.02);
    }
    .button-primary {
      background-color: #3182ce;
      color: #ffffff;
      transition: background-color 0.3s ease-in-out;
    }
    .button-primary:hover {
      background-color: #2b6cb0;
    }
    .button-primary:disabled {
      background-color: #63b3ed;
      cursor: not-allowed;
    }
    .input-field, .select-field {
      background-color: #2d3748;
      border: 1px solid #4a5568;
      padding: 10px 15px;
      border-radius: 8px;
      color: #e2e8f0;
      transition: border-color 0.2s ease-in-out;
    }
    .input-field:focus, .select-field:focus {
      border-color: #3182ce;
    }
    .select-field {
      appearance: none;
    }
    .select-field::after {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      border-width: 5px;
      border-style: solid;
      border-color: #e2e8f0 transparent transparent transparent;
      pointer-events: none;
    }
    @keyframes slideIn {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .message {
      animation: slideIn 0.5s ease-in-out;
    }
    .chatbot-container {
      background: #2d3748;
      border-radius: 8px;
      padding: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
    }
    .chatbot-header {
      background: #1f2937;
      color: #e2e8f0;
      border-bottom: 1px solid #4a5568;
    }
    .settings-panel {
      background: #1f2937;
      padding: 10px;
      border-top: 1px solid #4a5568;
      color: #e2e8f0;
    }
    .settings-label {
      color: #cbd5e0;
    }
   .settings-button, .close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  transition: background-color 0.3s ease;
}

.settings-button:hover, .close-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
       .settings-panel {
      max-height: 300px;
      overflow-y: auto;
    }

    .input-field, .select-field {
      width: 100%;
      box-sizing: border-box;
    }

    .icon {
  width: 24px;
  height: 24px;
}
   .markdown-content {
      white-space: pre-wrap;
      word-break: break-word;
    }

    .markdown-content p {
      margin-bottom: 1em;
    }

    .markdown-content code {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: monospace;
    }

    .code-block {
      margin: 1em 0;
      border-radius: 6px;
      overflow: hidden;
    }
      .message-container {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      margin-bottom: 4px;
    }

    .user-message-container {
      align-self: flex-end;
    }

    .assistant-message-container {
      align-self: flex-start;
    }

    .message {
      padding: 4px 8px;
      border-radius: 10px;
      position: relative;
      word-wrap: break-word;
      display: inline-block;
      font-size: 0.9em;
      line-height: 1.2;
    }

    .user-message {
      background-color: #2b5797;
      color: white;
      border-bottom-right-radius: 2px;
    }

    .assistant-message {
      background-color: #36393f;
      color: white;
      border-bottom-left-radius: 2px;
    }

    .message-actions {
      display: flex;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity 0.2s;
      margin-top: 1px;
    }

    .message-container:hover .message-actions {
      opacity: 1;
    }

    .copy-button {
      background: none;
      border: none;
      color: #a0a0a0;
      cursor: pointer;
      padding: 1px 2px;
      font-size: 0.7em;
    }

    .copy-button:hover {
      color: white;
    }

    .markdown-content {
      font-size: 0.9em;
      line-height: 1.2;
    }

    .markdown-content p {
      margin: 0 0 2px 0;
    }

    .markdown-content p:last-child {
      margin-bottom: 0;
    }

    .markdown-content pre {
      background-color: #2f3136;
      padding: 4px;
      border-radius: 3px;
      overflow-x: auto;
      margin: 2px 0;
    }

    .markdown-content code {
      font-family: 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', monospace;
      font-size: 0.8em;
    }
  `;

  constructor() {
    super();
    this.endpoint = '';
    this.heading = 'Chat with AI';
    this.models = defaultModels;
    this.theme = 'dark';
    this.initialModel = 'gpt-4o';
    this.initialTemperature = 1;
    this.initialMaxTokens = 4096;
    this.initialTopP = 1;
    this.input = '';
    this.messages = [];
    this.isLoading = false;
    this.isChatOpen = true;
    this.isSettingsOpen = false;
    this.selectedModel = this.initialModel;
    this.temperature = this.initialTemperature;
    this.maxTokens = this.initialMaxTokens;
    this.topP = this.initialTopP;
    marked.setOptions({
      highlight: (code, lang) => {
        const language = SyntaxHighlighter.supportedLanguages.includes(lang) ? lang : 'plaintext';
        return SyntaxHighlighter.highlight(code, { language, style: atomDark });
      }
    });
  }

  render() {
    if (!this.isChatOpen) {
      return html`
        <button
          class="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-4 shadow-lg"
          @click=${() => this.isChatOpen = true}
        >
          Chat
        </button>
      `;
    }

    const iconColor = this.theme === 'dark' ? 'white' : 'currentColor';

    return html`
      <div class="fixed bottom-4 right-4 ${this.theme === 'dark' ? 'bg-gray-800' : 'bg-white'} text-white rounded-lg shadow-lg w-80 md:w-96 max-h-[80vh] flex flex-col">
        <div class="flex items-center justify-between ${this.theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500'} p-3 rounded-t-lg">
          <span class="text-lg font-semibold">${this.heading}</span>
          <div class="flex space-x-2">
            <button class="settings-button" @click=${() => this.isSettingsOpen = !this.isSettingsOpen}>
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke=${iconColor}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button class="close-button" @click=${() => this.isChatOpen = false}>
              <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke=${iconColor}>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        ${this.isSettingsOpen ? this.renderSettings() : ''}
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          ${this.messages.map((message, index) => this.renderMessage(message, index))}
        </div>
        <div class="p-3 bg-gray-700 border-t border-gray-600">
          <div class="flex space-x-2">
            <input
              type="text"
              .value=${this.input}
              @input=${(e) => this.input = e.target.value}
              @keypress=${(e) => e.key === 'Enter' && this.handleSend()}
              class="flex-1 p-2 bg-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              ?disabled=${this.isLoading}
            />
            <button
              @click=${this.handleSend}
              class="button-primary px-4 py-2 rounded-lg transition-colors duration-150 ${this.isLoading ? 'opacity-50 cursor-not-allowed' : ''}"
              ?disabled=${this.isLoading}
            >
              ${this.isLoading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    `;
  }


  renderSettings() {
    return html`
      <div class="p-3 bg-gray-700 border-t border-gray-600 space-y-4 settings-panel">
        <div>
          <label for="model-select" class="block text-sm font-medium text-gray-200">Select Model</label>
          <select
            id="model-select"
            .value=${this.selectedModel}
            @change=${(e) => this.selectedModel = e.target.value}
            class="select-field mt-1 block w-full pl-3 pr-10 py-2 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            ${this.models.map((model) => html`
              <option value=${model}>${model}</option>
            `)}
          </select>
        </div>
        <div>
          <label for="temperature" class="block text-sm font-medium text-gray-200">Temperature: ${this.temperature}</label>
          <input
            type="range"
            id="temperature"
            .value=${this.temperature}
            @input=${(e) => this.temperature = parseFloat(e.target.value)}
            min="0"
            max="2"
            step="0.1"
            class="input-field mt-1 block w-full"
          />
        </div>
        <div>
          <label for="max-tokens" class="block text-sm font-medium text-gray-200">Max Tokens: ${this.maxTokens}</label>
          <input
            type="range"
            id="max-tokens"
            .value=${this.maxTokens}
            @input=${(e) => this.maxTokens = parseInt(e.target.value)}
            min="1"
            max="8192"
            class="input-field mt-1 block w-full"
          />
        </div>
        <div>
          <label for="top-p" class="block text-sm font-medium text-gray-200">Top P: ${this.topP}</label>
          <input
            type="range"
            id="top-p"
            .value=${this.topP}
            @input=${(e) => this.topP = parseFloat(e.target.value)}
            min="0"
            max="1"
            step="0.1"
            class="input-field mt-1 block w-full"
          />
        </div>
      </div>
    `;
  }


  renderMessage(message) {
    const containerClass = message.role === 'user' ? 'user-message-container' : 'assistant-message-container';
    const messageClass = message.role === 'user' ? 'user-message' : 'assistant-message';

    return html`
      <div class="message-container ${containerClass}">
        <div class="message ${messageClass}">
          <div class="markdown-content">
            ${unsafeHTML(marked(message.content))}
          </div>
        </div>
        <div class="message-actions">
          <button class="copy-button" @click=${() => this.copyToClipboard(message.content)}>
            Copy
          </button>
        </div>
      </div>
    `;
  }

  renderMarkdown(content) {
    return html`
      <div class="markdown-content">
        ${ReactMarkdown({
      children: content,
      components: {
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? html`
                <div class="code-block">
                  ${SyntaxHighlighter({
            children: String(children).replace(/\n$/, ''),
            style: atomDark,
            language: match[1],
            PreTag: 'div',
            ...props
          })}
                </div>
              ` : html`
                <code class=${className} ...${props}>${children}</code>
              `;
        }
      }
    })}
      </div>
    `;
  }

  async handleSend() {
    if (this.input.trim() && !this.isLoading) {
      const userMessage = { role: 'user', content: this.input };
      this.messages = [...this.messages, userMessage];
      this.input = '';
      this.isLoading = true;

      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: this.messages,
            model: this.selectedModel,
            temperature: this.temperature,
            maxTokens: this.maxTokens,
            topP: this.topP,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = { role: 'assistant', content: '' };
        this.messages = [...this.messages, assistantMessage];

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();
              if (data === '[DONE]') {
                this.isLoading = false;
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed?.choices?.[0]?.delta?.content;
                if (content) {
                  assistantMessage.content += content;
                  this.messages = [...this.messages.slice(0, -1), { ...assistantMessage }];
                  this.requestUpdate();
                }
              } catch (error) {
                console.error('Error parsing JSON:', error, 'Data:', data);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        this.messages = [
          ...this.messages,
          { role: 'assistant', content: 'Sorry, an error occurred. Please try again.' }
        ];
        this.isLoading = false;
      }
    }
  }

  copyToClipboard(content) {
    navigator.clipboard.writeText(content).then(() => {
      alert('Message copied to clipboard!');
    });
  }

  updated(changedProperties) {
    if (changedProperties.has('messages')) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const chatContainer = this.shadowRoot.querySelector('.overflow-y-auto');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

customElements.define('chat-bot', ChatBot);