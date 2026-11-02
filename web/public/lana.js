    (function () {
      var endpoint = (window.LANA_SUPABASE_URL || "https://lgjdzaqjrmmzyrenevfm.supabase.co") + "/functions/v1/lana-beta-public";
      var overlay = document.getElementById("betaOverlay");
      var closeButton = document.getElementById("betaClose");
      var cancelButton = document.getElementById("betaCancel");
      var openButton = document.getElementById("betaOpenButton");
      var form = document.getElementById("betaForm");
      var submitButton = document.getElementById("betaSubmit");
      var formError = document.getElementById("betaFormError");
      var title = document.getElementById("betaDialogTitle");
      var intro = document.getElementById("betaDialogIntro");
      var kicker = document.getElementById("betaDialogKicker");
      var availabilityText = document.getElementById("betaAvailabilityText");
      var availabilityValue = document.getElementById("betaAvailabilityValue");
      var actionNote = document.getElementById("betaActionNote");
      var result = document.getElementById("betaResult");
      var resultText = document.getElementById("betaResultText");
      var price = document.getElementById("betaPrice");
      var chargeToday = document.getElementById("betaChargeToday");
      var bonusDays = document.getElementById("betaBonusDays");
      var initialDays = document.getElementById("betaInitialDays");
      var statusBadge = document.getElementById("betaStatusBadge");
      var lastFocused = null;
      var state = { checkout_abierto:true, cupo_total:20, cupos_disponibles:null, dias_gratis_adicionales:7, primer_periodo_dias:37 };
      var invitationToken = new URLSearchParams(window.location.search).get("beta_invite") || "";
      var invitationValid = false;
      var requestDemoMode = false;
      var localMode = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? new URLSearchParams(window.location.search).get("beta_mock") : "";

      function api(action, extra) {
        if (localMode) {
          if (action === "estado") return Promise.resolve({ ok:true, checkout_abierto:localMode!=="full", cupo_total:20, cupos_disponibles:localMode==="full"?0:7, cupos_ocupados:localMode==="full"?20:13, precio_mxn_centavos:49900, dias_gratis_adicionales:7, primer_periodo_dias:37 });
          if (action === "validar_invitacion") return Promise.resolve({ ok:true, valida:true, solicitud:{ nombre_contacto:"María López",nombre_negocio:"Taller Norte",email:"maria@ejemplo.com",whatsapp:"523312345678",ciudad:"Guadalajara",pais:"México",tipo_negocio:"Taller de bordado",canales:["whatsapp"] } });
          return Promise.resolve({ ok:true, solicitud_id:"mock" });
        }
        var headers = { "Content-Type":"application/json" };
        if (window.LANA_SUPABASE_ANON_KEY) headers.apikey = window.LANA_SUPABASE_ANON_KEY;
        return fetch(endpoint, { method:"POST", headers:headers, body:JSON.stringify(Object.assign({ accion:action }, extra||{})) })
          .then(function(response){ return response.json().catch(function(){return {};}).then(function(out){ if(!response.ok || out.error){ var e=new Error(out.error||"No pudimos completar la solicitud."); e.codigo=out.codigo; throw e; } return out; }); });
      }

      function moneyFromCents(value) { return "$" + Math.round(Number(value||49900)/100).toLocaleString("es-MX"); }
      function showResult(message, type) { resultText.textContent=message; result.className="beta-result is-visible "+(type==="success"?"is-success":"is-neutral"); }

      function renderState(next) {
        state=Object.assign({},state,next||{});
        var total=Number(state.cupo_total)||20;
        var available=state.cupos_disponibles;
        var used=available===null?0:Math.max(0,total-Number(available));
        var freeDays=Math.max(0,Number(state.dias_gratis_adicionales)||7);
        var firstPeriod=Math.max(30,Number(state.primer_periodo_dias)||30+freeDays);
        if(state.precio_mxn_centavos){price.textContent=moneyFromCents(state.precio_mxn_centavos);chargeToday.textContent=moneyFromCents(state.precio_mxn_centavos);}
        bonusDays.textContent=String(freeDays); initialDays.textContent=String(firstPeriod);
        if(available===null||available===undefined){ availabilityText.textContent="Disponibilidad por confirmar"; availabilityValue.style.width="0%"; }
        else { availabilityText.textContent=available>0?available+" de "+total+" disponibles":"Cupo fundador completo"; availabilityValue.style.width=Math.min(100,Math.round(used/total*100))+"%"; }
        if(!state.checkout_abierto&&!invitationValid){ statusBadge.textContent="Lista de espera"; openButton.textContent="Enviar solicitud"; openButton.classList.remove("button-primary"); actionNote.textContent="Los 20 lugares están ocupados. Seguimos recibiendo solicitudes para las próximas aperturas."; }
        else { statusBadge.textContent=invitationValid?"Invitación activa":"Beta abierta"; openButton.textContent=invitationValid?"Activar mi invitación":"Reservar mi lugar"; openButton.classList.add("button-primary"); actionNote.textContent=invitationValid?"Tu invitación es personal y tiene vigencia limitada.":"El pago es inmediato. Tu primera renovación será "+firstPeriod+" días después."; }
      }

      function fillInvitation(data) {
        Object.keys(data||{}).forEach(function(key){
          if(key==="canales"){ form.querySelectorAll('[name="canales"]').forEach(function(input){input.checked=data.canales.indexOf(input.value)!==-1;}); return; }
          var input=form.elements[key]; if(input&&data[key]!==null&&data[key]!==undefined) input.value=data[key];
        });
      }

      function setFormMode(){
        if(requestDemoMode){
          kicker.textContent="Demostración personalizada";
          title.textContent="Solicita una demostración de LANA";
          intro.textContent="Cuéntanos sobre tu negocio y qué quieres resolver. La solicitud llegará directamente al equipo de LANA para darle seguimiento.";
          submitButton.textContent="Enviar solicitud";
          return;
        }
        var waitlist=!state.checkout_abierto&&!invitationValid;
        kicker.textContent=invitationValid?"Invitación personal":waitlist?"Lista de espera":"LANA Chat IA Beta";
        var freeDays=Math.max(0,Number(state.dias_gratis_adicionales)||7);
        title.textContent=invitationValid?"Activa tu acceso a LANA":waitlist?"Solicita acceso a la próxima apertura":"Reserva uno de los 20 lugares";
        intro.textContent=invitationValid?"Confirma tus datos y continúa al pago seguro de Stripe.":waitlist?"Los 20 lugares están ocupados, pero seguimos recibiendo solicitudes. Déjanos tus datos para considerar tu negocio en la próxima apertura.":"Cuéntanos quién usará LANA. Pagarás hoy de forma segura con Stripe y recibirás "+freeDays+" días adicionales sin costo.";
        submitButton.textContent=waitlist?"Enviar solicitud":"Continuar al pago";
      }
      function openForm(mode){requestDemoMode=mode==="demo";lastFocused=document.activeElement;setFormMode();formError.textContent="";overlay.hidden=false;document.body.classList.add("beta-form-open");window.setTimeout(function(){document.getElementById("betaContact").focus();},0);}
      function closeForm(){overlay.hidden=true;document.body.classList.remove("beta-form-open");if(lastFocused&&typeof lastFocused.focus==="function")lastFocused.focus();}
      function normalizeWhatsapp(value,country){var digits=String(value||"").replace(/[^0-9]/g,"");if(/^m[eé]xico$/i.test(String(country||"").trim())&&digits.length===10)digits="52"+digits;return digits;}
      function formPayload(){var data=new FormData(form);var country=String(data.get("pais")||"").trim();return{nombre_contacto:String(data.get("nombre_contacto")||"").trim(),nombre_negocio:String(data.get("nombre_negocio")||"").trim(),email:String(data.get("email")||"").trim(),whatsapp:normalizeWhatsapp(data.get("whatsapp"),country),ciudad:String(data.get("ciudad")||"").trim(),pais:country,tipo_negocio:String(data.get("tipo_negocio")||"").trim(),canales:data.getAll("canales"),reto_principal:String(data.get("reto_principal")||"").trim(),website:String(data.get("website")||""),privacidad_aceptada:document.getElementById("betaPrivacy").checked,origen:"get-lana.com",invitacion:invitationValid?invitationToken:""};}

      openButton.addEventListener("click",function(){openForm("beta");});
      document.querySelectorAll("[data-demo-request-open]").forEach(function(button){button.addEventListener("click",function(event){event.preventDefault();openForm("demo");});});
      closeButton.addEventListener("click",closeForm); cancelButton.addEventListener("click",closeForm);
      document.addEventListener("keydown",function(event){if(event.key==="Escape"&&!overlay.hidden)closeForm();});
      form.addEventListener("submit",function(event){
        event.preventDefault(); formError.textContent=""; if(!form.reportValidity())return;
        var waitlist=!state.checkout_abierto&&!invitationValid;
        var action=requestDemoMode?"solicitar_demo":waitlist?"lista_espera":"crear_checkout";
        submitButton.disabled=true; submitButton.textContent=requestDemoMode||waitlist?"Enviando...":"Preparando pago...";
        api(action,formPayload()).then(function(out){
          if(requestDemoMode){form.reset();closeForm();showResult("Solicitud recibida. El equipo de LANA se pondrá en contacto contigo para coordinar la demostración.","success");result.scrollIntoView({behavior:"smooth",block:"center"});}
          else if(waitlist){closeForm();showResult("Tu solicitud quedó registrada. Te contactaremos cuando abramos un lugar para tu negocio.","success");result.scrollIntoView({behavior:"smooth",block:"center"});}
          else if(out.url){window.location.href=out.url;}
          else if(localMode){closeForm();showResult("Modo de prueba local: el formulario está listo para crear el checkout de Stripe.","success");}
        }).catch(function(error){if(!requestDemoMode&&error.codigo==="CUPO_COMPLETO"){state.checkout_abierto=false;state.cupos_disponibles=0;invitationValid=false;renderState(state);setFormMode();}formError.textContent=error.message||"No pudimos completar la solicitud.";})
          .finally(function(){submitButton.disabled=false;setFormMode();});
      });

      var paymentResult=new URLSearchParams(window.location.search).get("beta_pago");
      if(paymentResult==="exito")showResult("Pago confirmado. Tu primer periodo incluye 30 días pagados más 7 días adicionales sin costo. Te enviaremos por correo el enlace para crear tu contraseña y entrar a LANA.","success");
      if(paymentResult==="cancelado")showResult("El pago no se completó. Tu lugar se mantiene reservado por unos minutos para que puedas intentarlo de nuevo.","neutral");
      api("estado").then(renderState).catch(function(){availabilityText.textContent="Consulta el cupo al continuar";actionNote.textContent="Confirmaremos la disponibilidad antes de abrir el pago.";});
      if(invitationToken){api("validar_invitacion",{invitacion:invitationToken}).then(function(out){if(!out.valida){showResult("La invitación no es válida o ya venció. Puedes registrarte en la lista de espera.","neutral");return;}invitationValid=true;fillInvitation(out.solicitud||{});renderState(state);showResult("Tu invitación está lista. Confirma tus datos para activar el acceso.","success");openForm("beta");}).catch(function(){showResult("No pudimos validar la invitación. Intenta nuevamente o contacta a soporte.","neutral");});}
    })();
  
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
  