/* =========================
   CONFIG
========================= */

window.USE_AI = true; // false = sin IA

/* =========================
   ELEMENTOS
========================= */

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

/* =========================
   MEMORIA
========================= */

let messages = [];
/* =========================
   LOCAL STORAGE
========================= */

function getStorageKey() {
    return `history_${window.currentCharacter}`;
}

function saveMessages() {

    localStorage.setItem(
        getStorageKey(),
        JSON.stringify(messages)
    );

    updateHistoryIndicator();
}

function loadMessages() {

    const saved =
        localStorage.getItem(
            getStorageKey()
        );

    if (!saved) {
        messages = [];
        renderMessages();
        updateHistoryIndicator();
        return;
    }

    try {

        messages = JSON.parse(saved);

        renderMessages();
        updateHistoryIndicator();

    }catch (error) {

    console.error(
        "Error cargando historial:",
        error
    );

    messages = [];

    renderMessages();

    updateHistoryIndicator();
}
}
function clearHistory() {

    if (
        !confirm(
            "¿Borrar el historial de este personaje?"
        )
    ) {
        return;
    }

    messages = [];

    localStorage.removeItem(
        getStorageKey()
    );

    renderMessages();

    updateHistoryIndicator();
}

function updateHistoryIndicator() {

    const indicator =
        document.getElementById(
            "historyStatus"
        );

    if (!indicator) return;

    if (messages.length > 0) {

        indicator.textContent =
            "💾 Historial guardado";

    } else {

        indicator.textContent =
            "Sin historial guardado";
    }
}

/* =========================
   RENDER
========================= */

function renderMessages() {
    if (!chatBox) return;

    chatBox.innerHTML = "";

    messages.forEach(msg => {
        const div = document.createElement("div");

        div.classList.add("message");

        if (msg.role === "user") {
            div.classList.add("user");
        } else {
            div.classList.add(msg.role);
        }

        div.textContent = msg.text;

        chatBox.appendChild(div);
    });

    scrollToBottom();
}

/* =========================
   SCROLL
========================= */

function scrollToBottom() {
    if (!chatBox) return;
    chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   ADD MESSAGE
========================= */

function addMessage(text, role) {

    messages.push({
        text,
        role,
        time: Date.now()
    });

    saveMessages();

    renderMessages();
}
/* =========================
   LOADING
========================= */

function addLoadingMessage() {
    const loadingTexts = {
        gandalf: "Estoy consultando los antiguos pergaminos...",
        yoda: "Paciencia debes tener... pensando estoy...",
        sherlock: "Estoy analizando las pistas..."
    };

    messages.push({
        text: loadingTexts[window.currentCharacter] || "⌛ Pensando...",
        role: "bot",
        loading: true
    });

    renderMessages();
}

/* =========================
   REMOVE LOADING
========================= */
function removeLoadingMessage() {

    messages =
        messages.filter(
            m => !m.loading
        );

    saveMessages();

    renderMessages();
}

/* =========================
   RESPUESTAS SIN IA
========================= */

function fakeResponse() {

    const responses = {
        gandalf: [
            "Un poder antiguo observa tus palabras...",
            "El destino aún no está escrito...",
            "La sabiduría llega con el tiempo.",
            "He visto caminos oscuros y luminosos."
        ],

        yoda: [
            "Difícil de ver el futuro es...",
            "Paciencia debes tener.",
            "Dentro de ti está la respuesta.",
            "El miedo es el camino al lado oscuro."
        ],

        sherlock: [
            "Interesante… los hechos son claros.",
            "La deducción es evidente.",
            "Cada detalle cambia la conclusión.",
            "Elemental."
        ]
    };

    const list = responses[window.currentCharacter] || [
        "No tengo una respuesta clara..."
    ];

    return list[Math.floor(Math.random() * list.length)];
}

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

    if (!input) return;

    const message = input.value.trim();
    if (!message) return;

    // usuario
    addMessage(message, "user");

    input.value = "";

    // loader
    addLoadingMessage();

    /* =========================
       MODO SIN IA
    ========================= */

    if (!window.USE_AI) {

        setTimeout(() => {
            removeLoadingMessage();
            addMessage(fakeResponse(), window.currentCharacter);
        }, 700);

        return;
    }

    /* =========================
       MODO IA
    ========================= */

    try {

        const response = await fetch("/api/functions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                character: window.currentCharacter,
                useAI: window.USE_AI
            })
        });

        const data = await response.json();

        removeLoadingMessage();

        if (!response.ok) {
            addMessage(
                data.error || "Error al consultar el personaje.",
                "bot"
            );
            return;
        }

        addMessage(data.reply, window.currentCharacter);
} catch (error) {

    console.error(error);

    removeLoadingMessage();

    const errorResponses = [
        "⚠️ El oráculo está en silencio… intenta más tarde.",
        "⚠️ Mis pensamientos se han perdido en el vacío.",
        "⚠️ Estoy meditando… pero algo interrumpió mi concentración.",
        "⚠️ Las fuerzas mágicas no responden en este momento.",
        "⚠️ No puedo responder ahora… el destino está inestable.",
        "⚠️ La conexión con los antiguos saberes se ha perdido.",
        "⚠️ Algo bloquea mi visión del futuro.",
        "⚠️ Las sombras interfieren con mi respuesta.",
        "⚠️ El conocimiento está fuera de alcance ahora mismo.",
        "⚠️ Mi mente está nublada… vuelve a intentarlo luego."
    ];

    const random =
        errorResponses[Math.floor(Math.random() * errorResponses.length)];

    addMessage(random, "bot");
}
}

/* =========================
   EVENTOS
========================= */

document.addEventListener("DOMContentLoaded", () => {

    if (sendBtn) {
        sendBtn.addEventListener("click", sendMessage);
    }

    if (input) {
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }

        loadMessages();
});

/* =========================
   GLOBAL
========================= */

window.sendMessage = sendMessage;
window.addMessage = addMessage;
window.clearHistory = clearHistory;
window.loadMessages = loadMessages; 