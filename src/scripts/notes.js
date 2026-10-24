const wall = document.querySelector('#notes-wall');

if (wall) {
  const controls = document.querySelector('.notes-controls');
  const search = document.querySelector('#notes-search');
  const topic = document.querySelector('#notes-topic');
  const sort = document.querySelector('#notes-sort');
  const count = document.querySelector('.notes-count');
  const noResults = document.querySelector('.notes-no-results');
  const cards = [...wall.querySelectorAll('[data-note-card]')];
  const dialog = document.querySelector('#note-dialog');
  const dialogContent = document.querySelector('#note-dialog-content');
  const closeButton = document.querySelector('#note-dialog-close');
  const copyButton = document.querySelector('#note-copy-link');
  let activeCard = null;
  let copyResetTimer;

  controls.hidden = false;
  count.hidden = false;
  wall.classList.add('notes-wall-interactive');

  function updateNotes() {
    const query = search.value.trim().toLocaleLowerCase();
    const selectedTopic = topic.value;
    const visible = cards.filter((card) => {
      const tags = card.dataset.tags.split('|');
      const matchesTopic = !selectedTopic || tags.includes(selectedTopic);
      const matchesSearch = !query || card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !(matchesTopic && matchesSearch);
      return !card.hidden;
    });

    visible.sort((a, b) => {
      if (sort.value === 'title') return a.dataset.title.localeCompare(b.dataset.title);
      if (sort.value === 'oldest') return a.dataset.published.localeCompare(b.dataset.published);
      if (sort.value === 'newest') return b.dataset.published.localeCompare(a.dataset.published);
      return b.dataset.updated.localeCompare(a.dataset.updated);
    });
    visible.forEach((card) => wall.append(card));

    count.textContent = `${visible.length} ${visible.length === 1 ? 'note' : 'notes'}`;
    noResults.hidden = visible.length > 0;
  }

  function setNoteHash(id) {
    const url = new URL(window.location.href);
    url.hash = id ? `#${id}` : '';
    window.history.replaceState(window.history.state, '', url);
  }

  function openNote(card, updateHash = true) {
    const expanded = card.cloneNode(true);
    expanded.removeAttribute('id');
    expanded.removeAttribute('data-note-card');
    expanded.querySelector('.note-open-link')?.remove();
    expanded.querySelector('details')?.setAttribute('open', '');
    expanded.querySelector('h2').id = 'note-dialog-title';
    const cardStyle = window.getComputedStyle(card);
    expanded.style.backgroundColor = cardStyle.backgroundColor;
    expanded.style.borderColor = cardStyle.borderColor;
    dialogContent.replaceChildren(expanded);
    activeCard = card;
    window.clearTimeout(copyResetTimer);
    copyButton.textContent = 'Copy note link';

    if (updateHash) setNoteHash(card.id);
    if (!dialog.open) dialog.showModal();
    closeButton.focus();
  }

  function openLinkedNote() {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const card = cards.find((note) => note.id === id);
    if (!card) {
      if (dialog.open) dialog.close();
      return;
    }
    if (card.hidden) {
      search.value = '';
      topic.value = '';
      updateNotes();
    }
    openNote(card, false);
  }

  wall.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const card = event.target.closest('[data-note-card]');
    if (!card) return;
    const link = event.target.closest('a');
    if (link && !link.matches('.note-open-link')) return;
    if (link || event.target.closest('summary')) event.preventDefault();
    openNote(card);
  });

  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    if (activeCard && window.location.hash === `#${activeCard.id}`) setNoteHash('');
    activeCard = null;
    window.clearTimeout(copyResetTimer);
    copyButton.textContent = 'Copy note link';
  });
  copyButton.addEventListener('click', async () => {
    if (!activeCard) return;
    const link = new URL(`/notes#${activeCard.id}`, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(link);
      copyButton.textContent = 'Copied!';
    } catch {
      copyButton.textContent = 'Copy failed';
    }
    window.clearTimeout(copyResetTimer);
    copyResetTimer = window.setTimeout(() => { copyButton.textContent = 'Copy note link'; }, 2000);
  });

  search.addEventListener('input', updateNotes);
  topic.addEventListener('change', updateNotes);
  sort.addEventListener('change', updateNotes);
  window.addEventListener('hashchange', openLinkedNote);
  updateNotes();
  openLinkedNote();
}
