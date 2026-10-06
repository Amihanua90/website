/* Bartmuß IT-Assistent
   Läuft vollständig im Browser: keine Netzwerkanfragen, keine Speicherung
   (kein localStorage, keine Cookies). Antworten stammen aus den unten
   fest hinterlegten Themen. Die Zuordnung erfolgt über Stichwörter. */
(function () {
  'use strict';
  if (document.getElementById('bm-chat')) return;

  var START_TEXT =
    'Beschreib kurz, welcher Ablauf euch Zeit kostet, was nicht funktioniert oder was du planst. ' +
    'Ich zeige dir den passenden nächsten Schritt bei Bartmuß-IT – auf Basis fest hinterlegter Informationen. ' +
    'Deine Eingabe wird weder gespeichert noch zum Lernen verwendet.';

  var L = {
    leistungen: { label: 'Leistungen ansehen', href: 'leistungen.html' },
    pflege: { label: 'Leistungen für Pflegedienste', href: 'leistungen.html#pflegedienste' },
    handwerk: { label: 'Leistungen für Handwerk', href: 'leistungen.html#handwerk' },
    privat: { label: 'Leistungen für Privatkunden', href: 'leistungen.html#privatkunden' },
    firmen: { label: 'Leistungen für Geschäftskunden', href: 'leistungen.html#geschaeftskunden' },
    vorgehen: { label: 'Vorgehen ansehen', href: 'vorgehen.html' },
    wechsel: { label: 'Wechsel zu uns', href: 'wechsel.html' },
    kontakt: { label: 'Kontaktformular', href: 'kontakt.html' },
    anrufen: { label: 'Anrufen', href: 'tel:+4917840214611' },
    mail: { label: 'E-Mail schreiben', href: 'mailto:info@bartmuss-it.de' },
    ueber: { label: 'Über uns', href: 'ueber.html' },
    impressum: { label: 'Impressum', href: 'impressum.html' },
    datenschutz: { label: 'Datenschutzerklärung', href: 'datenschutz.html' }
  };

  /* Schlüsselwörter sind normalisiert (klein, ä=ae, ö=oe, ü=ue, ß=ss).
     Kurze Wörter (unter 6 Zeichen) müssen am Wortanfang stehen,
     längere dürfen auch mitten im Wort vorkommen. Ein "$" am Ende
     verlangt ein ganzes Wort. */
  var TOPICS = [
    {
      keys: ['backup', 'datensicherung', 'sicherung', 'datenrettung', 'wiederherstell', 'daten weg', 'daten verloren', 'recovery', 'nas'],
      text: 'Bei der Datensicherung kümmern wir uns um Backup und Recovery deiner Betriebsdaten und prüfen die Sicherung regelmäßig. Ein Backup ist nur so gut, wie es kontrolliert wird. Nächster Schritt: Wir schauen uns an, was bei euch gesichert wird und ob sich Daten im Ernstfall wiederherstellen lassen.',
      links: [L.kontakt, L.leistungen]
    },
    {
      keys: ['microsoft', '365', 'm365', 'office', 'outlook', 'teams', 'sharepoint', 'onedrive', 'exchange', 'cloud', 'aws', 'migration', 'umzug'],
      text: 'Wir bringen Struktur und Effizienz in deine Microsoft-365-Umgebung und Anwendungen, damit sie nicht unkontrolliert weiterwächst. Dazu gehören auch Cloud-Infrastrukturen (AWS) und die Migration lokaler IT-Ressourcen in die Cloud. Nächster Schritt: Schildere kurz, was bei euch in Microsoft 365 läuft und wo es hakt.',
      links: [L.kontakt, L.leistungen]
    },
    {
      keys: ['netzwerk', 'wlan', 'wifi', 'router', 'vpn', 'firewall', 'server', 'internet', 'switch', 'verbindung', 'leitung'],
      text: 'Bei Netzwerkthemen analysieren wir deine Netzwerkgeräte, richten Server-Systeme ein, erweitern und konfigurieren eure vorhandene IT-Infrastruktur und binden Standorte oder Mitarbeitende per VPN an. Nächster Schritt: Eine Analyse zeigt, wo das Problem liegt.',
      links: [L.kontakt, L.leistungen]
    },
    {
      keys: ['virus', 'viren', 'schadsoftware', 'malware', 'trojaner', 'ransomware', 'erpress', 'verschluessel', 'sicherheit', 'antivirus', 'hacker', 'phishing', 'update', 'gehackt', 'angriff'],
      text: 'Wir sorgen für ganzheitlichen Schutz: Antivirus-Lösungen, Firewalls, Sicherheits-Updates und Patchmanagement. Bei einem akuten Verdacht auf Schadsoftware trenne das betroffene Gerät am besten vom Netzwerk und ruf direkt an. Nächster Schritt: Wir klären telefonisch, was zu tun ist.',
      links: [L.anrufen, L.kontakt]
    },
    {
      keys: ['pflege', 'pflegedienst', 'ambulant', 'patient', 'klinik', 'residenz', 'gesundheit', 'senior', 'tour'],
      text: 'Pflegedienste sind einer unserer Schwerpunkte. Silvio Bartmuß bringt 9 Jahre IT-Erfahrung im Gesundheitswesen mit. Wir sorgen für sichere, verlässlich laufende Systeme, geprüfte Datensicherung und Arbeitsplätze sowie mobile Geräte, die im Alltag funktionieren. Nächster Schritt: Sieh dir die Leistungen für Pflegedienste an oder schildere kurz eure Situation.',
      links: [L.pflege, L.kontakt]
    },
    {
      keys: ['handwerk', 'werkstatt', 'baustelle', 'aussendienst', 'monteur', 'tischler', 'elektriker', 'installateur', 'maler', 'dachdecker', 'bau'],
      text: 'Handwerksunternehmen sind unser zweiter Schwerpunkt. Wir richten Büroarbeitsplätze, E-Mail, Datensicherung und den Zugriff von unterwegs so ein, dass Büro, Werkstatt und Außendienst auf dieselben Daten zugreifen können. Nächster Schritt: Sieh dir die Leistungen für Handwerksunternehmen an.',
      links: [L.handwerk, L.kontakt]
    },
    {
      keys: ['wechsel', 'wechseln', 'anderer dienstleister', 'anderen dienstleister', 'unzufrieden', 'schlechter service', 'uebernahme', 'uebernehmen', 'bisherig', 'aktuell dienstleister', 'kuendig'],
      text: 'Ein Wechsel lässt sich planen: Wir starten mit einem Erstgespräch und einer Bestandsaufnahme, planen die Übergabe gemeinsam und übernehmen dann Schritt für Schritt, damit dein Tagesgeschäft möglichst ungestört weiterläuft. Nächster Schritt: Auf der Seite Wechsel findest du den Ablauf und eine Checkliste.',
      links: [L.wechsel, L.kontakt]
    },
    {
      keys: ['ablauf', 'vorgehen', 'wie laeuft', 'wie funktioniert', 'schritte', 'zusammenarbeit', 'anfangen', 'erstgespraech', 'kennenlernen', 'wie geht'],
      text: 'Unser Vorgehen hat fünf Schritte: Kennenlernen, Bestandsaufnahme, Konzept und Abstimmung, Umsetzung sowie Betreuung und Weiterentwicklung. Nächster Schritt: Auf der Seite Vorgehen siehst du, was in jedem Schritt passiert.',
      links: [L.vorgehen, L.kontakt]
    },
    {
      keys: ['kontakt', 'telefon', 'anrufen', 'anruf', 'mail', 'erreich', 'kontaktier', 'wie kann ich', 'sprechen', 'nummer', 'termin', 'rueckruf', 'ansprechpartner', 'melden', 'schreiben'],
      text: 'Du erreichst Silvio Bartmuß telefonisch unter +49 178 40 21 461, per E-Mail an info@bartmuss-it.de oder über das Kontaktformular. Termine vereinbaren wir nach Absprache, telefonisch oder per E-Mail.',
      links: [L.kontakt, L.anrufen, L.mail]
    },
    {
      keys: ['preis', 'kosten', 'kostet', 'angebot', 'teuer', 'stundensatz', 'honorar', 'budget', 'bezahl'],
      text: 'Feste Preise kann ich hier nicht nennen, weil sie vom Umfang abhängen. Im Gespräch klären wir, was bei dir gebraucht wird, und besprechen dann die Kosten. Nächster Schritt: Schildere kurz deine Situation, dann kann Silvio Bartmuß dir einen Vorschlag machen.',
      links: [L.kontakt, L.anrufen]
    },
    {
      keys: ['fernwartung', 'remote', 'fernzugriff', 'aus der ferne', 'per telefon'],
      text: 'Ja, Beratung ist vor Ort, per Telefon und per Fernwartung möglich. Viele Störungen lassen sich so schnell beheben. Nächster Schritt: Schick uns eine Anfrage mit einer kurzen Beschreibung.',
      links: [L.kontakt, L.anrufen]
    },
    {
      keys: ['leipzig', 'region', 'standort', 'vor ort', 'anfahrt', 'umgebung', 'wo seid', 'wo sitzt', 'einzugsgebiet'],
      text: 'Wir sind im Großraum Leipzig und Umgebung für dich da, vor Ort oder per Fernwartung. Sitz ist in Leipzig.',
      links: [L.kontakt, L.ueber]
    },
    {
      keys: ['privat', 'zuhause', 'zu hause', 'heimnetz', 'pc langsam', 'notebook', 'laptop', 'tablet', 'smartphone', 'handy', 'heimkino', 'beamer', 'reparatur', 'computer', 'drucker', 'scanner'],
      text: 'Auch Privatkunden unterstützen wir: Beratung, Beschaffung und Installation von Hard- und Software, Heimnetzwerk und WLAN, Drucker, Scanner und mobile Geräte, Datenrettung, Entfernung von Schadsoftware und einen Abhol- und Bringservice. Nächster Schritt: Sieh dir die Leistungen für Privatkunden an.',
      links: [L.privat, L.kontakt]
    },
    {
      keys: ['arbeitsplatz', 'arbeitsplaetze', 'mitarbeiter', 'clients', 'windows', 'einrichten', 'neue geraete', 'onboarding'],
      text: 'Wir richten Arbeitsplätze, Windows-Clients, Drucker und mobile Endgeräte ein und warten sie, inklusive Einkauf und Aufbau der passenden Hard- und Software. Nächster Schritt: Sieh dir die Leistungen für Geschäftskunden an.',
      links: [L.firmen, L.kontakt]
    },
    {
      keys: ['dokumentation', 'monitoring', 'wartung', 'patch', 'ueberblick', 'unuebersichtlich', 'wer macht was'],
      text: 'Zu unserer Betreuung gehören Wartung, Patchmanagement, Monitoring und eine IT-Dokumentation, damit nachvollziehbar bleibt, wie eure IT aufgebaut ist. Nächster Schritt: Eine Bestandsaufnahme schafft den Überblick.',
      links: [L.vorgehen, L.kontakt]
    },
    {
      keys: ['stoerung', 'ausfall', 'ausgefallen', 'langsam', 'funktioniert nicht', 'geht nicht', 'problem', 'fehler', 'hilfe', 'kaputt', 'zeit kostet', 'haengt', 'absturz', 'abgestuerzt', 'ploetzlich'],
      text: 'Das klingt nach einer Störung, die Zeit kostet. Wir analysieren die Ursache, beheben den Fehler und sorgen mit Wartung und proaktiver Betreuung dafür, dass sie nicht wiederkommt. Nächster Schritt: Beschreib uns kurz, was wann nicht funktioniert, am besten telefonisch oder über das Kontaktformular.',
      links: [L.anrufen, L.kontakt]
    },
    {
      keys: ['wer bist', 'wer seid', 'silvio', 'inhaber', 'erfahrung', 'ueber uns', 'ueber dich', 'bartmuss', 'chef'],
      text: 'Hinter BARTMUß IT-Systeme steht Silvio Bartmuß: 14 Jahre IT-Erfahrung, davon 9 im Gesundheitswesen, ehemals Leiter IT der Paracelsus-Harz-Klinik und Leiter IT der Hera Residenzen Gruppe. Seit Oktober 2018 betreut er Kunden selbstständig mit einem festen Ansprechpartner.',
      links: [L.ueber, L.kontakt]
    },
    {
      keys: ['impressum', 'datenschutz', 'dsgvo', 'speicher', 'daten gespeichert'],
      text: 'Dieser Assistent arbeitet in deinem Browser und beantwortet Fragen mit fest hinterlegten Texten. Deine Eingaben werden nicht übertragen, nicht gespeichert und nicht zum Lernen verwendet. Mehr dazu steht in der Datenschutzerklärung.',
      links: [L.datenschutz, L.impressum]
    },
    {
      keys: ['hallo$', 'hi$', 'hey$', 'moin', 'servus', 'guten tag', 'guten morgen', 'guten abend', 'huhu'],
      text: 'Hallo! Erzähl mir kurz, wo es bei euch hakt oder was du planst. Ich zeige dir den passenden nächsten Schritt.',
      links: []
    },
    {
      keys: ['danke', 'super', 'prima', 'perfekt', 'klasse', 'top$', 'alles klar'],
      text: 'Gern geschehen! Wenn du magst, besprecht ihr alles Weitere direkt mit Silvio Bartmuß, telefonisch unter +49 178 40 21 461 oder über das Kontaktformular.',
      links: [L.kontakt, L.anrufen]
    },
    {
      keys: ['leistung', 'angebot', 'was macht ihr', 'was bietet', 'was koennt', 'dienstleistung', 'it betreuung', 'it-betreuung', 'managed'],
      text: 'Wir übernehmen die IT-Betreuung für kleine und mittlere Unternehmen mit Schwerpunkt Pflegedienste und Handwerk: Managed IT-Service, IT-Sicherheit und Backup, Microsoft 365 und Cloud sowie Netzwerk und Arbeitsplätze. Nächster Schritt: Sieh dir die Leistungen an oder nenn mir dein Thema.',
      links: [L.leistungen, L.kontakt]
    }
  ];

  var FALLBACK = {
    text: 'Dazu habe ich keine hinterlegte Antwort. Am besten schilderst du Silvio Bartmuß kurz, worum es geht, dann meldet er sich bei dir. Oder wähle eines der Themen unten.',
    links: [L.kontakt, L.anrufen, L.mail]
  };

  var CHIPS = ['Datensicherung', 'Microsoft 365', 'Netzwerk und WLAN', 'IT-Sicherheit', 'Wechsel zu euch', 'Kontakt'];

  function norm(s) {
    return String(s).toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9 +]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function keyMatches(hay, key) {
    var whole = key.charAt(key.length - 1) === '$';
    var k = whole ? key.slice(0, -1) : key;
    if (whole) return hay.indexOf(' ' + k + ' ') !== -1;
    if (k.length >= 6) return hay.indexOf(k) !== -1;
    return hay.indexOf(' ' + k) !== -1;
  }

  function findTopic(text) {
    var hay = ' ' + norm(text) + ' ';
    var best = null, bestScore = 0;
    TOPICS.forEach(function (t) {
      var score = 0;
      t.keys.forEach(function (k) {
        if (keyMatches(hay, k)) score += k.replace('$', '').length;
      });
      if (score > bestScore) { best = t; bestScore = score; }
    });
    return best || FALLBACK;
  }

  /* ---------- Oberfläche ---------- */
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function timeStr() {
    var d = new Date();
    return ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
  }
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG_NS = 'http://www.w3.org/2000/svg';
  function icon(pathD, vb) {
    var s = document.createElementNS(SVG_NS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(SVG_NS, 'path');
    p.setAttribute('d', pathD);
    s.appendChild(p);
    return s;
  }
  var ICON_CHAT = 'M12 3C6.9 3 2.8 6.6 2.8 11c0 2.2 1 4.2 2.7 5.7L4.6 21l4.3-2c1 .3 2 .4 3.1.4 5.1 0 9.2-3.6 9.2-8S17.1 3 12 3z';
  var ICON_SEND = 'M3.4 20.4 21 12 3.4 3.6v6.5L15 12l-11.6 1.9z';
  var ICON_PHONE = 'M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z';
  var ICON_MAIL = 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5z';
  var ICON_CLOSE = 'M6.4 5 5 6.4 10.6 12 5 17.6 6.4 19 12 13.4 17.6 19 19 17.6 13.4 12 19 6.4 17.6 5 12 10.6z';

  var root = el('div', 'bm-chat');
  root.id = 'bm-chat';

  var launcher = el('button', 'bm-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'bm-panel');
  launcher.setAttribute('aria-label', 'Bartmuß IT-Assistent öffnen');
  launcher.appendChild(icon(ICON_CHAT));
  launcher.appendChild(el('span', 'bm-launcher-label', 'Bartmuß IT-Assistent'));

  var panel = el('div', 'bm-panel');
  panel.id = 'bm-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Bartmuß IT-Assistent');
  panel.hidden = true;

  var head = el('div', 'bm-head');
  head.appendChild(el('div', 'bm-avatar', 'B'));
  var who = el('div', 'bm-who');
  who.appendChild(el('strong', null, 'Bartmuß IT-Assistent'));
  who.appendChild(el('span', null, 'Automatischer Assistent'));
  head.appendChild(who);
  var closeBtn = el('button', 'bm-close');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Chat schließen');
  closeBtn.appendChild(icon(ICON_CLOSE));
  head.appendChild(closeBtn);

  var log = el('div', 'bm-log');
  log.setAttribute('role', 'log');
  log.setAttribute('aria-live', 'polite');
  log.setAttribute('aria-label', 'Chatverlauf');
  log.tabIndex = 0;

  var form = el('form', 'bm-form');
  form.setAttribute('autocomplete', 'off');
  var input = el('input', 'bm-input');
  input.type = 'text';
  input.maxLength = 500;
  input.placeholder = 'Nachricht schreiben';
  input.setAttribute('aria-label', 'Deine Nachricht');
  var sendBtn = el('button', 'bm-send');
  sendBtn.type = 'submit';
  sendBtn.setAttribute('aria-label', 'Nachricht senden');
  sendBtn.appendChild(icon(ICON_SEND));
  form.appendChild(input);
  form.appendChild(sendBtn);

  var actions = el('div', 'bm-actions');
  var callBtn = el('a', 'bm-action');
  callBtn.href = 'tel:+4917840214611';
  callBtn.appendChild(icon(ICON_PHONE));
  callBtn.appendChild(el('span', null, 'Anrufen'));
  var mailBtn = el('a', 'bm-action');
  mailBtn.href = 'mailto:info@bartmuss-it.de';
  mailBtn.appendChild(icon(ICON_MAIL));
  mailBtn.appendChild(el('span', null, 'E-Mail senden'));
  actions.appendChild(callBtn);
  actions.appendChild(mailBtn);

  panel.appendChild(head);
  panel.appendChild(log);
  panel.appendChild(form);
  panel.appendChild(actions);
  root.appendChild(panel);
  root.appendChild(launcher);
  document.body.appendChild(root);

  var chipsBox = null;
  var busy = false;
  var started = false;

  function scrollDown() { log.scrollTop = log.scrollHeight; }

  function addMessage(kind, text, links) {
    var row = el('div', 'bm-row bm-' + kind);
    var bubble = el('div', 'bm-bubble');
    bubble.appendChild(el('p', 'bm-text', text));
    if (links && links.length) {
      var box = el('div', 'bm-links');
      links.forEach(function (l) {
        var a = el('a', 'bm-link', l.label);
        a.href = l.href;
        box.appendChild(a);
      });
      bubble.appendChild(box);
    }
    var meta = el('span', 'bm-meta', timeStr());
    if (kind === 'out') meta.appendChild(el('span', 'bm-ticks', '✓✓'));
    bubble.appendChild(meta);
    row.appendChild(bubble);
    log.appendChild(row);
    scrollDown();
  }

  function removeChips() {
    if (chipsBox && chipsBox.parentNode) chipsBox.parentNode.removeChild(chipsBox);
    chipsBox = null;
  }

  function addChips() {
    removeChips();
    chipsBox = el('div', 'bm-chips');
    CHIPS.forEach(function (c) {
      var b = el('button', 'bm-chip', c);
      b.type = 'button';
      b.addEventListener('click', function () { send(c); });
      chipsBox.appendChild(b);
    });
    log.appendChild(chipsBox);
    scrollDown();
  }

  function showTyping() {
    var row = el('div', 'bm-row bm-in bm-typing');
    row.setAttribute('aria-hidden', 'true');
    var bubble = el('div', 'bm-bubble');
    for (var i = 0; i < 3; i++) bubble.appendChild(el('span', 'bm-dot'));
    row.appendChild(bubble);
    log.appendChild(row);
    scrollDown();
    return row;
  }

  function send(text) {
    text = String(text).replace(/\s+/g, ' ').trim();
    if (!text || busy) return;
    busy = true;
    removeChips();
    addMessage('out', text);
    input.value = '';
    var typing = showTyping();
    var topic = findTopic(text);
    window.setTimeout(function () {
      if (typing.parentNode) typing.parentNode.removeChild(typing);
      addMessage('in', topic.text, topic.links);
      if (topic === FALLBACK) addChips();
      busy = false;
    }, reduceMotion ? 50 : 700);
  }

  function open() {
    panel.hidden = false;
    root.classList.add('bm-open');
    launcher.setAttribute('aria-expanded', 'true');
    launcher.setAttribute('aria-label', 'Bartmuß IT-Assistent schließen');
    if (!started) {
      started = true;
      addMessage('in', START_TEXT, []);
      addChips();
    }
    window.setTimeout(function () { input.focus(); }, 0);
  }

  function close() {
    panel.hidden = true;
    root.classList.remove('bm-open');
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-label', 'Bartmuß IT-Assistent öffnen');
    launcher.focus();
  }

  launcher.addEventListener('click', function () { if (panel.hidden) open(); else close(); });
  closeBtn.addEventListener('click', close);
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !panel.hidden) close();
  });
})();
