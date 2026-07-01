/* =========================
   CONFIG
========================= */

window.USE_AI = true;

/* =========================
   ELEMENTOS
========================= */

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

/* =========================
   MEMORIA DE LA SESIÓN
========================= */

let messages = [];

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

        if (msg.loading) {
            div.classList.add("loading");
        }

        div.textContent = msg.text;

        chatBox.appendChild(div);

    });

    scrollToBottom();
}

/* =========================
   SCROLL AUTOMÁTICO
========================= */

function scrollToBottom() {

    if (!chatBox) return;

    chatBox.scrollTop = chatBox.scrollHeight;
}

/* =========================
   AGREGAR MENSAJE
========================= */

function addMessage(text, role) {

    messages.push({
        text,
        role,
        time: Date.now()
    });

    renderMessages();
}

/* =========================
   MENSAJE CARGANDO
========================= */

function addLoadingMessage() {

    const loadingTexts = {

        gandalf:
            "Gandalf está consultando los antiguos pergaminos...",

        yoda:
            "Paciencia debes tener... pensando estoy...",

        sherlock:
            "Sherlock está analizando las pistas..."

    };

    messages.push({
        text:
            loadingTexts[window.currentCharacter] ||
            "⌛ Pensando...",
        role: "bot",
        loading: true
    });

    renderMessages();
}

/* =========================
   ELIMINAR CARGA
========================= */

function removeLoadingMessage() {

    messages = messages.filter(
        message => !message.loading
    );

    renderMessages();
}

/* =========================
   RESPUESTAS LOCALES
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

    const list =
        responses[window.currentCharacter] || [
            "No tengo una respuesta clara..."
        ];

    return list[
        Math.floor(Math.random() * list.length)
    ];
}

/* =========================
   ENVIAR MENSAJE
========================= */

async function sendMessage() {

    if (!input) return;

    const text = input.value.trim();

    if (!text) return;

    addMessage(text, "user");

    input.value = "";

    addLoadingMessage();

    /* =========================
       MODO SIN IA
    ========================= */

    if (!window.USE_AI) {

        setTimeout(() => {

            removeLoadingMessage();

            addMessage(
                fakeResponse(),
                window.currentCharacter
            );

        }, 700);

        return;
    }

    /* =========================
       MODO IA
    ========================= */

    try {

        const response = await fetch(
            "/api/functions",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message: text,
                    character:
                        window.currentCharacter,

                    history: messages
                        .filter(m => !m.loading)
                        .map(m => ({
                            role:
                                m.role === "user"
                                    ? "user"
                                    : "assistant",
                            text: m.text
                        }))
                })
            }
        );

        const data =
            await response.json();

        removeLoadingMessage();

        if (!response.ok) {

            addMessage(
                data.error ||
                "Error al consultar el personaje.",
                "bot"
            );

            return;
        }

        addMessage(
            data.reply,
            window.currentCharacter
        );

    } catch (error) {

        console.error(error);

        removeLoadingMessage();

        addMessage(
            "⚠️ No molestar en este momento, estoy meditando algunas respuestas.",
            "bot"
        );
    }
}

/* =========================
   EVENTOS
========================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (sendBtn) {
            sendBtn.addEventListener(
                "click",
                sendMessage
            );
        }

        if (input) {

            input.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" &&
                        !event.shiftKey
                    ) {

                        event.preventDefault();

                        sendMessage();
                    }

                }
            );

        }

    }
);

/* =========================
   EXPORT GLOBAL
========================= */

window.sendMessage = sendMessage;
window.addMessage = addMessage;