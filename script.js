// Main logic for SPA rendering, search, modal, and Fluid Player init.
console.log('Movies loaded:', MOVIES);

// Fluid player config
const config = {
layoutControls: {
controlBar: {
autoHide: true
}
},
vastOptions: {
adList: {
ad1: {adUrl: vastTag}
},
vpaidControls: true
}
};


// Initialize fluid player
try{
currentPlayerInstance = fluidPlayer('fp-video', config);
}catch(err){
console.warn('Fluid Player init failed', err);
}
}


function closePlayer(){
try{ if (currentPlayerInstance && currentPlayerInstance.destroy) currentPlayerInstance.destroy(); }catch(e){}
PLAYER_CONTAINER.innerHTML = '';
MODAL.classList.add('hidden');
}


// Event delegation for play buttons
GRID.addEventListener('click', (e)=>{
const btn = e.target.closest('.play-btn');
if (!btn) return;
const id = btn.getAttribute('data-id');
const movie = MOVIES.find(m=>m.id===id);
if (movie) openPlayer(movie);
});


CLOSE_BTN.addEventListener('click', ()=>closePlayer());
MODAL.addEventListener('click', (e)=>{ if (e.target===MODAL) closePlayer(); });


// Search filter
SEARCH.addEventListener('input', (e)=>{
const q = e.target.value.trim().toLowerCase();
const filtered = MOVIES.filter(m=>
m.title.toLowerCase().includes(q) || (m.category||'').toLowerCase().includes(q)
);
renderGrid(filtered);
});


// initial render
renderGrid(MOVIES);


// Accessibility: keyboard close

window.addEventListener('keydown', (e)=>{ if (e.key==='Escape') closePlayer(); });
