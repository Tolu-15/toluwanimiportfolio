export function supportsSpeechRecognition() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export function startVoiceInput({ onResult, onEnd, onError } = {}) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        const transcript = event?.results?.[0]?.[0]?.transcript;
        if (transcript && onResult) onResult(transcript);
    };
    recognition.onend = () => onEnd && onEnd();
    recognition.onerror = (e) => onError && onError(e);

    recognition.start();
    return recognition;
}

export function speak(text, { enabled } = {}) {
    if (!enabled) return;
    if (!('speechSynthesis' in window)) return;

    const utter = new SpeechSynthesisUtterance(String(text || ''));
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.lang = 'en-US';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
}
