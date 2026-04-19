function escapeHtml(text) {
    return String(text)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
}

function withLineBreaks(text) {
    return escapeHtml(text).replaceAll('\n', '<br>');
}

export function createMessageElement(message) {
    const wrapper = document.createElement('article');
    wrapper.className = `ai-msg ${message.role === 'user' ? 'is-user' : 'is-ai'}`;
    wrapper.dataset.messageId = message.id;

    const bubble = document.createElement('div');
    bubble.className = 'ai-bubble';
    bubble.innerHTML = '';

    const meta = document.createElement('div');
    meta.className = 'ai-meta';
    meta.innerHTML = `<span>${message.time}</span>`;

    const tools = document.createElement('div');
    tools.className = 'ai-tools';

    if (message.role === 'ai') {
        tools.appendChild(toolButton('Copy', 'copy', 'data-ai-copy'));
        tools.appendChild(toolButton('Like', 'thumbs-up', 'data-ai-like'));
        tools.appendChild(toolButton('Dislike', 'thumbs-down', 'data-ai-dislike'));
    }

    meta.appendChild(tools);
    wrapper.appendChild(bubble);
    wrapper.appendChild(meta);

    return { wrapper, bubble };
}

function toolButton(label, icon, dataAttr) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ai-tool';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute(dataAttr, 'true');
    btn.innerHTML = `<i data-lucide="${icon}"></i>`;
    return btn;
}

export function renderBlocks(bubbleEl, blocks) {
    bubbleEl.innerHTML = '';
    blocks.forEach((block) => {
        bubbleEl.appendChild(renderBlock(block));
    });
}

export function renderBlock(block) {
    if (!block || !block.type) {
        const p = document.createElement('p');
        p.textContent = '';
        return p;
    }

    if (block.type === 'text') {
        const div = document.createElement('div');
        div.className = 'ai-text';
        div.innerHTML = `<p>${withLineBreaks(block.text || '')}</p>`;
        return div;
    }

    if (block.type === 'typing') {
        const div = document.createElement('div');
        div.className = 'ai-typing';
        div.innerHTML = `<span class="ai-typing-dot"></span><span class="ai-typing-dot"></span><span class="ai-typing-dot"></span>`;
        return div;
    }

    if (block.type === 'skeleton') {
        const div = document.createElement('div');
        div.className = 'ai-skeleton';
        return div;
    }

    if (block.type === 'badges') {
        const container = document.createElement('div');
        container.innerHTML = block.title ? `<p><strong>${escapeHtml(block.title)}</strong></p>` : '';
        const row = document.createElement('div');
        row.className = 'ai-badges';
        (block.items || []).forEach((item) => {
            const b = document.createElement('span');
            b.className = 'ai-badge';
            b.textContent = item.label;
            row.appendChild(b);
        });
        container.appendChild(row);
        return container;
    }

    if (block.type === 'list') {
        const ul = document.createElement('ul');
        ul.style.marginTop = '8px';
        ul.style.paddingLeft = '18px';
        ul.style.color = 'rgba(226, 232, 240, 0.92)';
        (block.items || []).forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item.label;
            ul.appendChild(li);
        });
        return ul;
    }

    if (block.type === 'cards') {
        const grid = document.createElement('div');
        grid.className = 'ai-cards';
        (block.items || []).forEach((card) => {
            const el = document.createElement('div');
            el.className = 'ai-card';
            const tags = (card.tags || []).map((t) => `<span class="ai-badge">${escapeHtml(t)}</span>`).join(' ');
            const ctas = (card.ctas || [])
                .map((cta) => `<a class="ai-cta" href="${cta.href}" target="${cta.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer"><i data-lucide="arrow-right"></i><span>${escapeHtml(cta.label)}</span></a>`)
                .join(' ');
            el.innerHTML = `
                <h4>${escapeHtml(card.title || '')}</h4>
                <p>${escapeHtml(card.description || '')}</p>
                ${tags ? `<div class="ai-badges">${tags}</div>` : ''}
                ${ctas ? `<div class="ai-cta-row">${ctas}</div>` : ''}
            `;
            grid.appendChild(el);
        });
        return grid;
    }

    if (block.type === 'ctaRow') {
        const row = document.createElement('div');
        row.className = 'ai-cta-row';
        (block.actions || []).forEach((a) => {
            const link = document.createElement('a');
            link.className = 'ai-cta';
            link.href = a.href || '#';
            if ((a.href || '').startsWith('http')) {
                link.target = '_blank';
                link.rel = 'noreferrer';
            }
            link.innerHTML = `<i data-lucide="arrow-right"></i><span>${escapeHtml(a.label || 'Open')}</span>`;
            row.appendChild(link);
        });
        return row;
    }

    if (block.type === 'contact') {
        const wrap = document.createElement('div');
        wrap.innerHTML = block.title ? `<p><strong>${escapeHtml(block.title)}</strong></p>` : '';
        const row = document.createElement('div');
        row.className = 'ai-cta-row';
        (block.items || []).forEach((item) => {
            const a = document.createElement('a');
            a.className = 'ai-cta';
            a.href = item.href || '#';
            if ((item.href || '').startsWith('http')) {
                a.target = '_blank';
                a.rel = 'noreferrer';
            }
            a.innerHTML = `<i data-lucide="link"></i><span>${escapeHtml(item.label)}: ${escapeHtml(item.value)}</span>`;
            row.appendChild(a);
        });
        wrap.appendChild(row);
        return wrap;
    }

    if (block.type === 'faq') {
        const wrap = document.createElement('div');
        (block.items || []).forEach((item) => {
            const d = document.createElement('div');
            d.style.marginTop = '10px';
            d.innerHTML = `<p><strong>${escapeHtml(item.q)}</strong></p><p style="color: rgba(148,163,184,0.98)">${escapeHtml(item.a)}</p>`;
            wrap.appendChild(d);
        });
        return wrap;
    }

    const fallback = document.createElement('p');
    fallback.textContent = '';
    return fallback;
}

export async function streamText(intoEl, fullText, { speedMs = 14 } = {}) {
    intoEl.innerHTML = `<p></p>`;
    const p = intoEl.querySelector('p');
    if (!p) return;

    const safe = String(fullText || '');
    let i = 0;
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            i += 1;
            p.innerHTML = withLineBreaks(safe.slice(0, i));
            if (i >= safe.length) {
                clearInterval(timer);
                resolve();
            }
        }, speedMs);
    });
}
