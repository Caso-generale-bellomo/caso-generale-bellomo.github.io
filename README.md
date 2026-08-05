# Sito "Generale Nicola Bellomo"

Sito statico di documentazione storica sul caso del generale Nicola Bellomo (1881-1945). Responsabile dei contenuti: Nicola Bellomo (nipote del generale), professore emerito del Politecnico di Torino.

## Struttura

```
index.html               ← home monopagina
css/style.css
js/main.js               ← barra-indice del rapporto + scrollytelling della sintesi
mappa-bari.html          ← mappa Leaflet caricata in iframe dalla home
assets/
  foto/                  ← 8 foto del generale, ottimizzate web
  copertine/             ← 8 copertine libri (01-08), ottimizzate web
  pdf/
    rapporto-tecnico.pdf
    saggio-martino-patria-indipendente.pdf   (pubblicazione autorizzata)
```

Restano fuori dal repo (sono nel `.gitignore`, vivono solo nella cartella di lavoro sul Mac) `docs/` - architettura, brief, inventario dei materiali, design di riferimento della home - e `contenuti/` - i sorgenti redazionali in markdown e `note-redazionali.md` con i refusi e le incoerenze da far approvare all'autore. Il repo è pubblico perché GitHub Pages lo richiede: online va solo il sito.

## Come è fatta la home

HTML statico + un solo foglio di stile, nessun framework e nessun build step: si apre `index.html` e funziona. Il JavaScript è un file solo e fa due cose, entrambe legate allo scroll: evidenzia la sezione corrente nella barra-indice del rapporto, e manda avanti lo scrollytelling della "Sintesi visiva" (immagine, didascalia e inquadratura della mappa). Le didascalie e le viste della mappa stanno negli attributi `data-*` del markup, non nel codice: si cambiano in `index.html`.

La timeline delle date chiave è presente ma disattivata (attributo `hidden` sulla sezione), perché ridondante con la sintesi visiva.

Attenzione a un dettaglio fragile: nessun antenato deve avere `overflow-x:hidden`, che creerebbe un contenitore di scroll e romperebbe tutti i `position:sticky` (nav, barra-indice, scrollytelling). Si usa `overflow-x:clip`.

## Pubblicazione

GitHub Pages, organizzazione `caso-generale-bellomo`. Se il repo si chiama `caso-generale-bellomo.github.io` il sito è online su https://caso-generale-bellomo.github.io appena si fa push di index.html su main.

## Regole

- Il testo del rapporto è dell'autore: non riformulare. Correzioni solo da `contenuti/note-redazionali.md` dopo approvazione.
- Non caricare mai i verbali del processo né il libro completo (vedi docs/03-inventario-materiali.md): il .gitignore contiene pattern cautelativi.
- Titoli in sentence case, trattini semplici "-", nessun tracker invasivo.
