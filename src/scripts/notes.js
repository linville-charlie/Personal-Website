const wall = document.querySelector('#notes-wall');

if (wall) {
  const controls = document.querySelector('.notes-controls');
  const search = document.querySelector('#notes-search');
  const topic = document.querySelector('#notes-topic');
  const sort = document.querySelector('#notes-sort');
  const count = document.querySelector('.notes-count');
  const noResults = document.querySelector('.notes-no-results');
  const cards = [...wall.querySelectorAll('[data-note-card]')];

  controls.hidden = false;
  count.hidden = false;

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

  function openLinkedNote() {
    let id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    const card = document.getElementById(id);
    const details = card?.matches('[data-note-card]') ? card.querySelector('details') : null;
    if (details) details.open = true;
  }

  search.addEventListener('input', updateNotes);
  topic.addEventListener('change', updateNotes);
  sort.addEventListener('change', updateNotes);
  window.addEventListener('hashchange', openLinkedNote);
  updateNotes();
  openLinkedNote();
}
