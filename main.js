document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});

/* ---------- Kontaktformular ----------
   Versand über Web3Forms (https://web3forms.com): kostenloser Access-Key,
   der an die E-Mail-Adresse info@bartmuss-it.de gebunden wird.
   Solange hier der Platzhalter steht, öffnet das Formular stattdessen
   das E-Mail-Programm der Besucher (mailto), sodass nichts verloren geht. */
const WEB3FORMS_ACCESS_KEY = 'HIER_WEB3FORMS_KEY_EINTRAGEN';
const MAIL_TO = 'info@bartmuss-it.de';

const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  const btn = document.getElementById('submit-btn');

  const show = (text, ok) => {
    status.textContent = text;
    status.className = 'form-status ' + (ok ? 'ok' : 'err');
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Spam-Schutz: verstecktes Feld darf nicht ausgefüllt sein
    if (document.getElementById('botcheck').value) return;

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const branche = document.getElementById('branche').value;
    const message = document.getElementById('message').value.trim();
    const subject = 'Anfrage über bartmuss-it.de' + (branche ? ' (' + branche + ')' : '');

    // Fallback ohne Access-Key: E-Mail-Programm öffnen
    if (WEB3FORMS_ACCESS_KEY === 'HIER_WEB3FORMS_KEY_EINTRAGEN') {
      const body = 'Name: ' + name + '\nE-Mail: ' + email +
        (branche ? '\nBranche: ' + branche : '') + '\n\n' + message;
      window.location.href = 'mailto:' + MAIL_TO +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      show('Ihr E-Mail-Programm wurde geöffnet. Bitte senden Sie die vorbereitete Nachricht dort ab.', true);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Wird gesendet …';
    status.className = 'form-status';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: subject,
          from_name: 'Webseite BARTMUß IT-Systeme',
          name: name,
          email: email,
          branche: branche || 'nicht angegeben',
          message: message
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        show('Vielen Dank, Ihre Nachricht ist angekommen. Wir melden uns bei Ihnen.', true);
        form.reset();
      } else {
        throw new Error(data.message || 'Versand fehlgeschlagen');
      }
    } catch (err) {
      show('Die Nachricht konnte nicht gesendet werden. Bitte schreiben Sie uns direkt an ' + MAIL_TO + ' oder rufen Sie an: +49 178 40 21 461.', false);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Nachricht senden';
    }
  });
}
