import { generateResponse, makeMessage } from './ai.js';
import { loadSession, saveSession, clearSession } from './storage.js';
import { createMessageElement, renderBlocks, renderBlock, streamText } from './render.js';
import { initParticles } from './particles.js';
import { speak, startVoiceInput, supportsSpeechRecognition } from './voice.js';

function $(sel, root = document) {
    return root.querySelector(sel);
}

function $all(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
}

function downloadText(filename, text) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function formatTranscript(messages) {
    return messages
        .map((m) => {
            const header = `[${m.time}] ${m.role.toUpperCase()}:`;
            const text = (m.blocks || [])
                .filter((b) => b.type === 'text')
                .map((b) => b.text)
                .join('\n');
            return `${header}\n${text}\n`;
        })
        .join('\n');
}

function scrollToBottom(logEl) {
    logEl.scrollTop = logEl.scrollHeight;
}

function setEmptyVisible(shell, visible) {
    const empty = $('[data-ai-empty]', shell);
    if (!empty) return;
    empty.style.display = visible ? '' : 'none';
}

function updateIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

function highlightSearch(logEl, query) {
    const q = String(query || '').trim().toLowerCase();
    const messages = $all('.ai-bubble', logEl);
    messages.forEach((b) => b.classList.remove('is-search-hit'));
    if (!q) return;

    messages.forEach((bubble) => {
        const text = bubble.textContent?.toLowerCase() || '';
        if (text.includes(q)) bubble.classList.add('is-search-hit');
    });
}

function attachMessageTooling(logEl, { onSpeak }) {
    logEl.addEventListener('click', async (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const messageEl = button.closest('.ai-msg');
        const bubble = messageEl?.querySelector('.ai-bubble');
        if (!messageEl || !bubble) return;

        const messageText = bubble.textContent || '';

        if (button.hasAttribute('data-ai-copy')) {
            try {
                await navigator.clipboard.writeText(messageText);
                button.title = 'Copied';
                setTimeout(() => (button.title = 'Copy'), 900);
            } catch {
                // ignore
            }
        }

        if (button.hasAttribute('data-ai-like')) {
            button.title = 'Thanks!';
            setTimeout(() => (button.title = 'Like'), 900);
        }

        if (button.hasAttribute('data-ai-dislike')) {
            button.title = 'Noted';
            setTimeout(() => (button.title = 'Dislike'), 900);
        }

        if (onSpeak && (button.hasAttribute('data-ai-like') || button.hasAttribute('data-ai-dislike'))) {
            // no-op (kept for future feedback hooks)
        }
    });
}

function makeMemory(messages) {
    const lastUser = [...messages].reverse().find((m) => m.role === 'user');
    const lastTopic = lastUser?.text ? lastUser.text.slice(0, 42) : null;
    return { lastTopic };
}

function initEliteAI() {
    const shell = document.querySelector('[data-ai-shell]');
    if (!shell) return;

    const logEl = $('[data-ai-log]', shell);
    const form = $('[data-ai-form]', shell);
    const input = $('[data-ai-input]', shell);
    const search = $('[data-ai-search]', shell);
    const fullscreenBtn = $('[data-ai-fullscreen]', shell);
    const fab = $('[data-ai-fab]', shell);
    const clearBtn = $('[data-ai-clear]', shell);
    const downloadBtn = $('[data-ai-download]', shell);
    const themeBtn = $('[data-ai-theme-toggle]', shell);
    const voiceToggleBtn = $('[data-ai-voice-toggle]', shell);
    const voiceInputBtn = $('[data-ai-voice-input]', shell);
    const particleCanvas = $('[data-ai-particles]', shell);

    if (!logEl || !form || !input) return;

    const emptyTemplate = $('[data-ai-empty]', shell)?.outerHTML || '';

    let voiceEnabled = false;
    let recognition = null;

    const session = loadSession() || { messages: [], terminalMode: false, voiceEnabled: false };
    voiceEnabled = Boolean(session.voiceEnabled);
    if (session.terminalMode) shell.classList.add('is-terminal');

    const disposeParticles = initParticles(particleCanvas);

    const persist = () => saveSession({ ...session, voiceEnabled, terminalMode: shell.classList.contains('is-terminal') });

    const renderHistory = () => {
        logEl.innerHTML = emptyTemplate;
        if (!session.messages.length) {
            setEmptyVisible(shell, true);
            return;
        }
        setEmptyVisible(shell, false);
        session.messages.forEach((m) => {
            const { wrapper, bubble } = createMessageElement(m);
            renderBlocks(bubble, m.blocks || []);
            logEl.appendChild(wrapper);
        });
        updateIcons();
        scrollToBottom(logEl);
    };

    renderHistory();
    attachMessageTooling(logEl, { onSpeak: () => { } });

    const setFullscreen = (enabled) => {
        shell.classList.toggle('is-fullscreen', enabled);
        document.documentElement.style.overflow = enabled ? 'hidden' : '';
        if (enabled) {
            input.focus();
            scrollToBottom(logEl);
        }
    };

    const addMessage = (message) => {
        session.messages.push(message);
        persist();
        if (session.messages.length === 1) setEmptyVisible(shell, false);

        const { wrapper, bubble } = createMessageElement(message);
        renderBlocks(bubble, message.blocks || []);
        logEl.appendChild(wrapper);
        updateIcons();
        scrollToBottom(logEl);
        return { wrapper, bubble };
    };

    const addAIStreamingMessage = async (response) => {
        const aiMsg = makeMessage({ role: 'ai', blocks: [{ type: 'typing' }, { type: 'skeleton' }] });
        const { bubble } = addMessage(aiMsg);

        const firstText = (response.blocks || []).find((b) => b.type === 'text')?.text || '...';
        bubble.innerHTML = '';
        const streamed = document.createElement('div');
        streamed.className = 'ai-text';
        bubble.appendChild(streamed);

        await streamText(streamed, firstText, { speedMs: 12 });

        const remaining = (response.blocks || []).filter((b, idx) => !(b.type === 'text' && idx === (response.blocks || []).findIndex((x) => x.type === 'text')));
        remaining.forEach((b) => bubble.appendChild(renderBlock(b)));

        updateIcons();
        scrollToBottom(logEl);

        // Update stored blocks to final form (so reload keeps rendered content)
        aiMsg.blocks = [{ type: 'text', text: firstText }, ...remaining];
        persist();

        speak(firstText, { enabled: voiceEnabled });

        if (response.followups && response.followups.length) {
            const followRow = document.createElement('div');
            followRow.className = 'ai-cta-row';
            response.followups.forEach((f) => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ai-cta';
                btn.innerHTML = `<i data-lucide="sparkles"></i><span>${f.label}</span>`;
                btn.addEventListener('click', () => {
                    input.value = f.label;
                    input.focus();
                });
                followRow.appendChild(btn);
            });
            bubble.appendChild(followRow);
            updateIcons();
            scrollToBottom(logEl);
        }
    };

    const handleSubmit = async (text) => {
        const value = String(text || input.value || '').trim();
        if (!value) return;

        input.value = '';
        const userMsg = makeMessage({ role: 'user', text: value });
        addMessage(userMsg);

        const memory = makeMemory(session.messages);
        const response = generateResponse(value, memory);
        await addAIStreamingMessage(response);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit();
    });

    $all('[data-ai-chip]', shell).forEach((chip) => {
        chip.addEventListener('click', () => handleSubmit(chip.getAttribute('data-ai-chip')));
    });

    if (search) {
        search.addEventListener('input', () => highlightSearch(logEl, search.value));

        document.addEventListener('keydown', (e) => {
            const isK = e.key.toLowerCase() === 'k';
            const meta = e.metaKey || e.ctrlKey;
            if (meta && isK) {
                e.preventDefault();
                search.focus();
            }
        });
    }

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const transcript = formatTranscript(session.messages);
            downloadText(`toluwanimi-ai-chat-${Date.now()}.txt`, transcript);
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            session.messages = [];
            clearSession();
            renderHistory();
        });
    }

    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', () => setFullscreen(!shell.classList.contains('is-fullscreen')));
    }

    if (fab) {
        fab.addEventListener('click', () => setFullscreen(true));
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shell.classList.contains('is-fullscreen')) setFullscreen(false);
    });

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            shell.classList.toggle('is-terminal');
            persist();
        });
    }

    if (voiceToggleBtn) {
        voiceToggleBtn.classList.toggle('is-active', voiceEnabled);
        voiceToggleBtn.addEventListener('click', () => {
            voiceEnabled = !voiceEnabled;
            voiceToggleBtn.classList.toggle('is-active', voiceEnabled);
            persist();
        });
    }

    if (voiceInputBtn) {
        voiceInputBtn.disabled = !supportsSpeechRecognition();
        voiceInputBtn.title = supportsSpeechRecognition() ? 'Voice input' : 'Voice input not supported';

        voiceInputBtn.addEventListener('click', () => {
            if (!supportsSpeechRecognition()) return;
            if (recognition) return;

            voiceInputBtn.style.borderColor = 'rgba(34,211,238,0.55)';

            recognition = startVoiceInput({
                onResult: (t) => {
                    input.value = t;
                    input.focus();
                },
                onEnd: () => {
                    recognition = null;
                    voiceInputBtn.style.borderColor = '';
                },
                onError: () => {
                    recognition = null;
                    voiceInputBtn.style.borderColor = '';
                }
            });
        });
    }

    // Basic cleanup
    window.addEventListener('beforeunload', () => {
        disposeParticles?.();
    });

    updateIcons();
}

document.addEventListener('DOMContentLoaded', initEliteAI);
