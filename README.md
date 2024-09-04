# ChatBot Web Component

A customizable ChatBot web component built with LitElement.

## Installation

```bash
npm install aaraabot-web-component
```

## Usage

```html
<script type="module">
  import 'your-chatbot-web-component';
</script>

<chat-bot
  endpoint="https://your-api-endpoint.com"
  heading="My AI Assistant"
  theme="dark"
  initial-model="gpt-4o"
  initial-temperature="0.7"
  initial-max-tokens="2048"
  initial-top-p="0.9"
></chat-bot>
```

## Attributes

- `endpoint`: API endpoint for the chatbot
- `heading`: Chat window heading
- `theme`: 'dark' or 'light'
- `initial-model`: Initial AI model to use
- `initial-temperature`: Initial temperature setting
- `initial-max-tokens`: Initial max tokens setting
- `initial-top-p`: Initial top-p setting

## License

MIT
