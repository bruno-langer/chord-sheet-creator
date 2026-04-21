const TYPES = ['intro', 'verse', 'pre', 'chorus', 'bridge'];

// Initialize TYPE_LABELS dynamically from i18n
let TYPE_LABELS = {};

function updateTypeLabels() {
  TYPE_LABELS = {
    intro: i18next.t('sections.types.intro'),
    verse: i18next.t('sections.types.verse'),
    pre: i18next.t('sections.types.pre'),
    chorus: i18next.t('sections.types.chorus'),
    bridge: i18next.t('sections.types.bridge')
  };
}

let songs = [
  {
    title: 'Musica Exemplo',
    key: 'F#',
    sections: [
      { type: 'intro', repeat: 5, lines: 'F# B9' },
      { type: 'verse', repeat: 2, lines: 'F# C#9 B9' },
      { type: 'pre', repeat: 1, lines: 'D#m A#m7 B9 C#9' },
      { type: 'chorus', repeat: 1, lines: 'F# C#9 B9\nD#m C#9 B9 C#9' },
      { type: 'bridge', repeat: 1, lines: 'D#m C#9 B9' },
    ]
  }
];

let currentSongIndex = 0;

// Listen for language changes
document.addEventListener('languageChanged', function(e) {
  updateTypeLabels();
  render();
  updatePreview();
  renderSongList();

  // Update language selector
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = e.detail.language;
  }
});

function getCurrentSong() {
  return songs[currentSongIndex];
}

function getSections() {
  return getCurrentSong().sections;
}

function renderSongList() {
  const listDiv = document.getElementById('songListPanel');
  listDiv.innerHTML = '';
  const sectionsText = (typeof i18next !== 'undefined') ? i18next.t('songs.sections') : 'sections';
  songs.forEach((song, i) => {
    const item = document.createElement('div');
    item.className = `song-item ${i === currentSongIndex ? 'active' : ''}`;
    item.innerHTML = `
      <div class="song-item-text" data-index="${i}">
        <div class="song-title">${song.title}</div>
        <div class="song-meta">${song.key} • ${song.sections.length} ${sectionsText}</div>
      </div>
      <button class="icon-btn del-btn song-delete" data-index="${i}" style="margin-left:auto;">✕</button>
    `;
    listDiv.appendChild(item);
  });
}

function switchToSong(index) {
  currentSongIndex = index;
  const song = getCurrentSong();
  document.getElementById('songTitle').value = song.title;
  document.getElementById('songKey').value = song.key;
  render();
  updatePreview();
  renderSongList();
}

function createNewSong() {
  const newSongTitle = (typeof i18next !== 'undefined') ? `${i18next.t('songs.newSong')} ${songs.length + 1}` : `Song ${songs.length + 1}`;
  const newSong = {
    title: newSongTitle,
    key: 'C',
    sections: [
      { type: 'intro', repeat: 1, lines: '' }
    ]
  };
  songs.push(newSong);
  switchToSong(songs.length - 1);
}

function deleteSong(index) {
  const minSongsError = (typeof i18next !== 'undefined') ? i18next.t('songs.minSongsError') : 'You must have at least one song';
  if (songs.length <= 1) {
    alert(minSongsError);
    return;
  }
  songs.splice(index, 1);
  if (currentSongIndex >= songs.length) {
    currentSongIndex = songs.length - 1;
  }
  switchToSong(currentSongIndex);
}

function render() {
  const list = document.getElementById('sectionList');
  const sections = getSections();
  list.innerHTML = '';
  sections.forEach((sec, i) => {
    const card = document.createElement('div');
    card.className = 'sec-card';
    const repeatText = (typeof i18next !== 'undefined') ? i18next.t('sections.repeat') : 'Repeat';
    const placeholderText = (typeof i18next !== 'undefined') ? i18next.t('sections.placeholder') : 'Chords, one line per row…';
    card.innerHTML = `
    <div class="move-btns">
      <button class="icon-btn" data-action="up" data-i="${i}" ${i === 0 ? 'disabled' : ''}>▲</button>
      <button class="icon-btn" data-action="down" data-i="${i}" ${i === sections.length - 1 ? 'disabled' : ''}>▼</button>
    </div>
    <div class="sec-right">
      <div class="sec-row">
        <span class="badge badge-${sec.type}">${TYPE_LABELS[sec.type]}</span>
        <select data-action="type" data-i="${i}">
          ${TYPES.map(t => `<option value="${t}"${t === sec.type ? ' selected' : ''}>${TYPE_LABELS[t]}</option>`).join('')}
        </select>
        <label style="font-size:12px;color:var(--color-text-secondary);margin-left:4px;">${repeatText}</label>
        <input class="repeat-inp" type="number" min="1" max="20" value="${sec.repeat}" data-action="repeat" data-i="${i}">
        <button class="icon-btn del-btn" data-action="del" data-i="${i}" style="margin-left:auto;">✕</button>
      </div>
      <textarea data-action="lines" data-i="${i}" placeholder="${placeholderText}">${sec.lines}</textarea>
    </div>
  `;
    list.appendChild(card);
  });
}

function updatePreview() {
  const song = getCurrentSong();
  const preview = document.getElementById('previewContent');
  const keyLabel = (typeof i18next !== 'undefined') ? i18next.t('preview.keyLabel') : 'Key:';
  const emptyText = (typeof i18next !== 'undefined') ? i18next.t('sections.empty') : '(empty)';
  preview.innerHTML = `<div class="preview-title">${song.title} <span class="preview-key">(${keyLabel} ${song.key})</span></div>`;
  const sections = getSections();
  sections.forEach(section => {
    const div = document.createElement('div');
    div.className = `preview-section preview-${section.type}`;
    const lines = section.lines.split('\n').map(l => l.trim()).filter(l => l);
    div.innerHTML = `<div class="preview-line">${lines.join(' • ') || emptyText}</div>`;
    if (section.repeat > 1) {
      const label = document.createElement('div');
      label.className = 'preview-repeat-label';
      label.textContent = section.repeat + 'X';
      div.appendChild(label);
    }
    preview.appendChild(div);
  });
}

document.getElementById('sectionList').addEventListener('change', e => {
  const el = e.target, i = +el.dataset.i, a = el.dataset.action;
  const sections = getSections();
  if (a === 'type') { sections[i].type = el.value; render(); updatePreview(); }
  if (a === 'repeat') { sections[i].repeat = Math.max(1, +el.value); updatePreview(); }
});
document.getElementById('sectionList').addEventListener('input', e => {
  const el = e.target, i = +el.dataset.i, a = el.dataset.action;
  const sections = getSections();
  if (a === 'lines') { sections[i].lines = el.value; updatePreview(); }
});

document.getElementById('songTitle').addEventListener('input', e => {
  getCurrentSong().title = e.target.value;
  updatePreview();
  renderSongList();
});

document.getElementById('songKey').addEventListener('input', e => {
  getCurrentSong().key = e.target.value;
  updatePreview();
});

document.getElementById('sectionList').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const i = +btn.dataset.i, a = btn.dataset.action;
  const sections = getSections();
  if (a === 'del') { sections.splice(i, 1); render(); updatePreview(); }
  if (a === 'up' && i > 0) { [sections[i - 1], sections[i]] = [sections[i], sections[i - 1]]; render(); updatePreview(); }
  if (a === 'down' && i < sections.length - 1) { [sections[i], sections[i + 1]] = [sections[i + 1], sections[i]]; render(); updatePreview(); }
});

document.getElementById('addBtn').addEventListener('click', () => {
  const type = document.getElementById('addType').value;
  getSections().push({ type, repeat: 1, lines: '' });
  render();
  updatePreview();
  setTimeout(() => {
    const cards = document.querySelectorAll('.sec-card');
    cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
});

document.getElementById('newSongBtn').addEventListener('click', createNewSong);

document.getElementById('songListPanel').addEventListener('click', e => {
  const songItem = e.target.closest('.song-item-text');
  if (songItem) {
    switchToSong(+songItem.dataset.index);
    return;
  }
  const deleteBtn = e.target.closest('.song-delete');
  if (deleteBtn) {
    deleteSong(+deleteBtn.dataset.index);
  }
});

document.getElementById('genBtn').addEventListener('click', () => {
  const songList = songs.map(s => ({ 
    title: s.title, 
    key: s.key, 
    sections: s.sections.map(sec => ({ ...sec })) 
  }));

  const currentLang = (typeof i18next !== 'undefined') ? i18next.language : 'pt';
  const viewerTitle = (typeof i18next !== 'undefined') ? i18next.t('viewer.title') : 'Chord Viewer';
  const keyLabel = (typeof i18next !== 'undefined') ? i18next.t('preview.keyLabel') : 'Tom:';
  const html = `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${viewerTitle}</title>
<style>
body{margin:0;font-family:monospace;background:#0f172a;color:#e5e7eb;padding:16px;}
h1{font-size:20px;margin-bottom:4px;}
.nav-bar{display:flex;align-items:center;gap:16px;margin-bottom:16px;padding:12px;background:#111827;border-radius:8px;}
#content{display:flex;flex-direction:column;gap:12px;}
.section{flex:1;padding:12px;border-radius:10px;background:#111827;}
.line{flex:1;text-align:center;white-space:pre;font-size:24px;font-weight:bold;position:relative;}
.repeat-label{position:absolute;top:50%;left:8px;transform:translateY(-50%);font-size:12px;background:rgba(0,0,0,.5);padding:2px 6px;border-radius:4px;}
.intro{background-color:#3b82f6cc;}.verse{background-color:#6b7280cc;}
.pre{background-color:#f59e0bcc;}.chorus{background-color:#22c55ecc;}.bridge{background-color:#8b5cf6cc;}
button{padding:8px 12px;font-size:18px;cursor:pointer;background:#3b82f6;color:#fff;border:none;border-radius:4px;}
button:hover{background:#2563eb;}
</style>
</head>
<body>
<div class="nav-bar">
<button id="prevBtn">&#9664;</button>
<div style="flex:1;">
<h1 id="title" style="margin:0 0 4px 0;"></h1>
<div id="songCounter" style="font-size:12px;color:#9ca3af;"></div>
</div>
<button id="nextBtn">&#9654;</button>
</div>
<div id="content"></div>
<script>
const songList=${JSON.stringify(songList)};
let currentSongIndex=0;
function renderSong(){
  const data=songList[currentSongIndex];
  const container=document.getElementById("content");
  container.innerHTML="";
  document.getElementById("title").innerText=data.title+" (${keyLabel} "+data.key+")";
  document.getElementById("songCounter").innerText="${(typeof i18next !== 'undefined') ? i18next.t('viewer.songCounter', { current: '${currentSongIndex+1}', total: '${songList.length}' }) : 'Song ${currentSongIndex+1} of ${songList.length}'}".replace('${currentSongIndex+1}', currentSongIndex+1).replace('${songList.length}', songList.length);
  data.sections.forEach(section=>{
    const repeat=section.repeat||1;
    const div=document.createElement("div");
    div.className="section "+section.type;
    const l=document.createElement("div");
    l.className="line";
    l.innerText=section.lines;
    if(repeat>1){const lb=document.createElement("div");lb.className="repeat-label";lb.innerText=repeat+"X";l.appendChild(lb);}
    div.appendChild(l);container.appendChild(div);
  });
}
document.getElementById("prevBtn").addEventListener("click",()=>{currentSongIndex=(currentSongIndex-1+songList.length)%songList.length;renderSong();});
document.getElementById("nextBtn").addEventListener("click",()=>{currentSongIndex=(currentSongIndex+1)%songList.length;renderSong();});
renderSong();
<\/script>
</body>
</html>`;

  document.getElementById('outputArea').value = html;
  document.getElementById('outputWrap').style.display = 'block';
  document.getElementById('outputWrap').scrollIntoView({ behavior: 'smooth' });
  
  // Trigger file download
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'cifra-viewer.html';
  link.click();
  URL.revokeObjectURL(link.href);
});

document.getElementById('copyBtn').addEventListener('click', () => {
  navigator.clipboard.writeText(document.getElementById('outputArea').value);
  const copyBtn = document.getElementById('copyBtn');
  const copiedText = (typeof i18next !== 'undefined') ? i18next.t('actions.copied') : 'Copied!';
  const copyText = (typeof i18next !== 'undefined') ? i18next.t('actions.copy') : 'Copy';
  copyBtn.textContent = copiedText;
  setTimeout(() => copyBtn.textContent = copyText, 1500);
});

// Listen for language changes
document.addEventListener('languageChanged', function(e) {
  updateTypeLabels();
  render();
  updatePreview();
  renderSongList();

  // Update language selector
  const langSelect = document.getElementById('languageSelect');
  if (langSelect) {
    langSelect.value = e.detail.language;
  }
});

// Wait for i18next to be loaded before initializing
function initializeApp() {
  if (typeof i18next === 'undefined') {
    // Wait a bit more for i18next to load
    setTimeout(initializeApp, 100);
    return;
  }

  updateTypeLabels();
  renderSongList();
  render();
  updatePreview();
}

// Initialize when DOM is ready and i18next is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});
