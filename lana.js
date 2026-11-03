    // Demo interactiva del chat (diálogo #demoProducto). El módulo de reserva Beta se retiró.
    (function () {
      var overlay = document.getElementById("demoProducto");
      var closeButton = document.getElementById("demoClose");
      var consent = document.getElementById("demoConsent");
      var consentCheck = document.getElementById("demoConsentCheck");
      var consentButton = document.getElementById("demoConsentButton");
      var messagesElement = document.getElementById("demoMessages");
      var quickRepliesElement = document.getElementById("demoQuickReplies");
      var form = document.getElementById("demoForm");
      var input = document.getElementById("demoInput");
      var sendButton = document.getElementById("demoSend");
      var attachButton = document.getElementById("demoAttach");
      var attachmentInput = document.getElementById("demoAttachmentInput");
      var attachmentPreview = document.getElementById("demoAttachmentPreview");
      var attachmentImage = document.getElementById("demoAttachmentImage");
      var attachmentName = document.getElementById("demoAttachmentName");
      var attachmentRemove = document.getElementById("demoAttachmentRemove");
      var progressText = document.getElementById("demoProgressText");
      var progressValue = document.getElementById("demoProgressValue");
      var lastFocused = null;
      var accepted = false;
      var busy = false;
      var completed = false;
      var sessionId = "";
      var turnCount = 0;
      var history = [];
      var order = {};
      var pendingAttachment = null;
      var lastFailedRequest = null;
      var lastErrorMessage = null;
      var initialPrompts = ["Quiero 30 polos bordados", "Necesito uniformes para mi equipo", "Busco 50 termos con logotipo"];
      var localMock = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) && new URLSearchParams(window.location.search).get("demo_mock") === "1";

      function makeSessionId() {
        return window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : "demo-" + Date.now() + "-" + Math.random().toString(16).slice(2);
      }

      function createElement(tag, className, text) {
        var element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
      }

      function scrollMessages() {
        window.requestAnimationFrame(function () { messagesElement.scrollTop = messagesElement.scrollHeight; });
      }

      function addMessage(role, text, extraClass) {
        var message = createElement("div", "demo-message " + role + (extraClass ? " " + extraClass : ""), text);
        messagesElement.appendChild(message);
        scrollMessages();
        return message;
      }

      function addUserMessage(text, attachment) {
        var message = createElement("div", "demo-message user" + (attachment ? " has-image" : ""));
        if (attachment) {
          var image = createElement("img", "demo-message-image");
          image.src = attachment.preview;
          image.alt = "Imagen adjunta: " + attachment.name;
          message.appendChild(image);
        }
        message.appendChild(createElement("span", "demo-message-text", text || "Imagen adjunta para revisar"));
        messagesElement.appendChild(message);
        scrollMessages();
        return message;
      }

      function showGreeting() {
        addMessage("assistant", "Hola, soy LANA. Puedo ayudarte a convertir una idea en un pedido organizado. ¿Qué producto necesitas y cuántas piezas estás considerando?");
      }

      function renderQuickReplies(replies) {
        quickRepliesElement.replaceChildren();
        (replies || []).forEach(function (reply) {
          var option = typeof reply === "string" ? { label:reply, action:null } : reply;
          var button = createElement("button", "demo-quick-reply", option.label);
          button.type = "button";
          button.disabled = busy;
          button.addEventListener("click", function () { option.action ? option.action() : sendMessage(option.label); });
          quickRepliesElement.appendChild(button);
        });
      }

      function setProgress(value) {
        var safe = Math.max(0, Math.min(100, Number(value) || 0));
        progressText.textContent = safe + "% completo";
        progressValue.style.width = safe + "%";
      }

      function setBusy(value) {
        busy = value;
        var locked = !accepted || value || completed || turnCount >= 10 || Boolean(lastFailedRequest);
        input.disabled = locked;
        attachButton.disabled = locked;
        attachmentInput.disabled = locked;
        attachmentRemove.disabled = value;
        sendButton.disabled = locked || (!input.value.trim() && !pendingAttachment);
        quickRepliesElement.querySelectorAll("button").forEach(function (button) { button.disabled = value; });
      }

      function clearPendingAttachment() {
        pendingAttachment = null;
        attachmentInput.value = "";
        attachmentImage.removeAttribute("src");
        attachmentName.textContent = "";
        attachmentPreview.hidden = true;
        setBusy(busy);
      }

      function selectAttachment(file) {
        if (!file) return;
        if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
          addMessage("assistant", "Puedes adjuntar una imagen JPG, PNG o WebP de hasta 5 MB.");
          attachmentInput.value = "";
          return;
        }
        var reader = new FileReader();
        reader.addEventListener("load", function () {
          pendingAttachment = { name:file.name.slice(0,80), preview:String(reader.result || "") };
          attachmentImage.src = pendingAttachment.preview;
          attachmentName.textContent = pendingAttachment.name;
          attachmentPreview.hidden = false;
          setBusy(false);
        });
        reader.addEventListener("error", function () { addMessage("assistant", "No pudimos abrir esa imagen. Prueba con otro archivo."); });
        reader.readAsDataURL(file);
      }

      function formatCurrency(value) {
        return new Intl.NumberFormat("es-MX", { style:"currency", currency:"MXN", maximumFractionDigits:0 }).format(Number(value) || 0);
      }

      function orderRow(label, value, className) {
        var row = createElement("div", "demo-order-row" + (className ? " " + className : ""));
        row.appendChild(createElement("span", "", label));
        row.appendChild(createElement("strong", "", value || "Por definir"));
        return row;
      }

      function renderWorkOrder(workOrder) {
        var card = createElement("section", "demo-order-card");
        var head = createElement("div", "demo-order-head");
        head.appendChild(createElement("span", "", "Orden de trabajo demo"));
        head.appendChild(createElement("strong", "", workOrder.folio));
        card.appendChild(head);
        var body = createElement("div", "demo-order-body");
        body.appendChild(orderRow("Producto", workOrder.product));
        body.appendChild(orderRow("Cantidad", String(workOrder.quantity) + " piezas"));
        body.appendChild(orderRow("Color y tallas", workOrder.color + " · " + workOrder.sizes));
        body.appendChild(orderRow("Personalización", workOrder.technique + " · " + workOrder.position));
        body.appendChild(orderRow("Diseño", workOrder.design));
        body.appendChild(orderRow("Total estimado", formatCurrency(workOrder.total), "demo-order-total"));
        card.appendChild(body);
        card.appendChild(createElement("p", "demo-disclaimer", workOrder.disclaimer));
        var reset = createElement("button", "demo-reset", "Iniciar otra demostración");
        reset.type = "button";
        reset.addEventListener("click", resetDemo);
        card.appendChild(reset);
        messagesElement.appendChild(card);
        scrollMessages();
      }

      function openDemo(event) {
        if (event) event.preventDefault();
        lastFocused = document.activeElement;
        overlay.hidden = false;
        document.body.classList.add("demo-open");
        closeButton.focus();
      }

      function closeDemo() {
        overlay.hidden = true;
        document.body.classList.remove("demo-open");
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      }

      function resetDemo() {
        sessionId = makeSessionId();
        turnCount = 0;
        completed = false;
        history = [];
        order = {};
        lastFailedRequest = null;
        lastErrorMessage = null;
        clearPendingAttachment();
        messagesElement.replaceChildren();
        setProgress(0);
        showGreeting();
        renderQuickReplies(accepted ? initialPrompts : []);
        input.value = "";
        setBusy(false);
      }

      function mockResponse(text, hasAttachment) {
        var normalized = text.toLowerCase();
        var next = Object.assign({}, order);
        if (!next.product_id) {
          next.product_id = normalized.includes("termo") ? "termo-acero" : "polo-ejecutivo";
          next.quantity = Number((normalized.match(/\d+/) || [30])[0]);
          next.technique = normalized.includes("bordad") ? "bordado" : null;
        }
        if (!next.color && /(negro|azul marino|blanco|gris|plata)/.test(normalized)) next.color = normalized.match(/negro|azul marino|blanco|gris|plata/)[0];
        else if (!next.sizes && /(talla|tallas|ch a xl|mixtas)/.test(normalized)) next.sizes = text;
        else if (!next.technique && /(bordado|dtf|serigraf)/.test(normalized)) next.technique = normalized.includes("dtf") ? "dtf" : normalized.includes("serigraf") ? "serigrafia" : "bordado";
        else if (!next.position && /(pecho|frente|espalda)/.test(normalized)) next.position = text;
        else if (!next.design && /(logotipo|diseño|logo|apoyo)/.test(normalized)) next.design = text;
        if (hasAttachment) next.design = "Imagen adjunta para revisión de diseño";
        order = next;
        var fields = ["product_id","quantity","color","sizes","technique","position","design"];
        var missing = fields.filter(function (field) { return !next[field]; });
        var progress = Math.round((fields.length - missing.length) / fields.length * 100);
        var reply = "Ya registré el producto y la cantidad. ¿En qué color lo necesitas?";
        var quick = ["Negro", "Azul marino", "Blanco"];
        if (missing[0] === "sizes") { reply = "Perfecto. ¿Cómo distribuimos las tallas?"; quick = ["Tallas mixtas CH a XL", "Todas talla M"]; }
        if (missing[0] === "technique") { reply = "¿Qué técnica de personalización prefieres?"; quick = ["Bordado", "DTF", "Serigrafía"]; }
        if (missing[0] === "position") { reply = "¿Dónde debe colocarse el diseño?"; quick = ["Pecho izquierdo", "Frente centrado", "Espalda"]; }
        if (missing[0] === "design") { reply = "Solo falta el diseño. ¿Ya tienes un archivo o necesitas apoyo?"; quick = ["Tengo mi logotipo listo", "Necesito apoyo con el diseño"]; }
        if (!missing.length) { reply = "El pedido está completo. El total estimado es de " + formatCurrency((next.quantity || 0) * 354 + 350) + ". ¿Quieres generar la orden de demostración?"; quick = ["Confirmar pedido de demostración", "Cambiar un dato"]; }
        var confirmed = !missing.length && normalized.includes("confirmar");
        return Promise.resolve({
          reply: confirmed ? "Listo. Convertí la conversación en una orden estructurada para revisión." : reply,
          order: next,
          progress: progress,
          quick_replies: confirmed ? [] : quick,
          work_order: confirmed ? { folio:"DEMO-OT-LOCAL1", product:next.product_id === "termo-acero" ? "Termo de acero" : "Polo ejecutivo", quantity:next.quantity, color:next.color, sizes:next.sizes, technique:next.technique === "bordado" ? "Bordado" : next.technique, position:next.position, design:next.design, total:(next.quantity || 0) * 354 + 350, disclaimer:"Orden ficticia de demostración. No genera una compra ni una solicitud real." } : null
        });
      }

      async function requestResponse(text, hasAttachment) {
        if (localMock) return mockResponse(text, hasAttachment);
        if (!window.LANA_SUPABASE_URL || !window.LANA_SUPABASE_ANON_KEY) throw new Error("La demostración no está configurada.");
        var response;
        try {
          response = await fetch(window.LANA_SUPABASE_URL + "/functions/v1/demo-lana-chat", {
            method:"POST",
            headers:{ "Content-Type":"application/json", "apikey":window.LANA_SUPABASE_ANON_KEY },
            body:JSON.stringify({ session_id:sessionId, messages:history, order:order, has_attachment:Boolean(hasAttachment) })
          });
        } catch (_error) {
          throw new Error("No pudimos conectar con la demostración. Intenta nuevamente.");
        }
        var payload = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(payload.error || "No fue posible continuar la demostración.");
        return payload;
      }

      async function deliverRequest(requestDetails) {
        if (lastErrorMessage) {
          lastErrorMessage.remove();
          lastErrorMessage = null;
        }
        renderQuickReplies([]);
        setBusy(true);
        var loading = addMessage("assistant", "LANA está organizando el pedido…", "loading");
        loading.prepend(createElement("span", "demo-loading-dot"));
        try {
          var response = await requestResponse(requestDetails.text, requestDetails.hasAttachment);
          loading.remove();
          lastFailedRequest = null;
          order = response.order || order;
          addMessage("assistant", response.reply || "Continuemos con el pedido.");
          history.push({ role:"assistant", content:response.reply || "Continuemos con el pedido." });
          setProgress(response.progress);
          renderQuickReplies(response.quick_replies || []);
          if (response.work_order) {
            completed = true;
            renderWorkOrder(response.work_order);
            input.placeholder = "Demostración finalizada";
          }
        } catch (error) {
          loading.remove();
          lastFailedRequest = requestDetails;
          lastErrorMessage = addMessage("assistant", error && error.message ? error.message : "No pudimos continuar. Intenta nuevamente.");
          renderQuickReplies([{ label:"Volver a intentar", action:retryLastRequest }]);
        } finally {
          setBusy(false);
          if (!input.disabled) input.focus();
        }
      }

      function retryLastRequest() {
        if (!lastFailedRequest || busy) return;
        deliverRequest(lastFailedRequest);
      }

      async function sendMessage(text) {
        var clean = String(text || "").trim().slice(0, 600);
        if (!accepted || busy || completed || lastFailedRequest || (!clean && !pendingAttachment) || turnCount >= 10) return;
        var attachment = pendingAttachment;
        var historyText = clean || "Adjunté una imagen para revisar el diseño.";
        addUserMessage(clean, attachment);
        history.push({ role:"user", content:historyText });
        input.value = "";
        turnCount += 1;
        clearPendingAttachment();
        await deliverRequest({ text:historyText, hasAttachment:Boolean(attachment) });
      }

      document.querySelectorAll("[data-demo-open]").forEach(function (button) { button.addEventListener("click", openDemo); });
      closeButton.addEventListener("click", closeDemo);
      overlay.addEventListener("click", function (event) { if (event.target === overlay) closeDemo(); });
      document.addEventListener("keydown", function (event) { if (event.key === "Escape" && !overlay.hidden) closeDemo(); });
      consentCheck.addEventListener("change", function () { consentButton.disabled = !consentCheck.checked; });
      consentButton.addEventListener("click", function () {
        if (!consentCheck.checked) return;
        accepted = true;
        consent.hidden = true;
        renderQuickReplies(initialPrompts);
        setBusy(false);
        input.focus();
      });
      input.addEventListener("input", function () {
        sendButton.disabled = !accepted || busy || completed || Boolean(lastFailedRequest) || (!input.value.trim() && !pendingAttachment) || turnCount >= 10;
        input.style.height = "auto";
        input.style.height = Math.min(input.scrollHeight, 92) + "px";
      });
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
      });
      attachButton.addEventListener("click", function () { if (!attachButton.disabled) attachmentInput.click(); });
      attachmentInput.addEventListener("change", function () { selectAttachment(attachmentInput.files && attachmentInput.files[0]); });
      attachmentRemove.addEventListener("click", clearPendingAttachment);
      form.addEventListener("submit", function (event) { event.preventDefault(); sendMessage(input.value); });
      resetDemo();
    })();
  