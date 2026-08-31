// Sprawdza _workoutRows z js/dashboard/14-integracje.js BEZ telefonu.
// Funkcja jest wyciagana z prawdziwego pliku, nie przepisana — inaczej test
// sprawdzalby kopie, a nie kod, ktory pojdzie na produkcje.
// Uruchamianie:  node tools/test_workout_rows.js
const fs = require('fs');
const nodePath = require('path');
const plik = nodePath.join(__dirname, '..', 'js', 'dashboard', '14-integracje.js');
const src = fs.readFileSync(plik, 'utf8');

function slice(startMarker, endMarker) {
    const a = src.indexOf(startMarker);
    if (a < 0) throw new Error('nie znaleziono w pliku: ' + startMarker);
    const b = src.indexOf(endMarker, a);
    if (b < 0) throw new Error('nie znaleziono konca dla: ' + startMarker);
    return src.slice(a, b);
}

const kodTypow = slice('const WATCH_RUN_TYPES = {', '};') + '};';
const kodMapowania = slice('function _workoutRows(workouts) {', 'async function _watchReadSamples');

// toDateStr zyje w 05-kalendarz.js i jest ladowany wczesniej — tu ta sama tresc.
const kodDaty = `function toDateStr(d) {
    return \`\${d.getFullYear()}-\${String(d.getMonth()+1).padStart(2,'0')}-\${String(d.getDate()).padStart(2,'0')}\`;
}`;

const _workoutRows = new Function(
    kodDaty + '\n' + kodTypow + '\n' + kodMapowania + '\nreturn _workoutRows;'
)();

let zdane = 0, oblane = 0;
function sprawdz(nazwa, warunek, szczegol) {
    if (warunek) { zdane++; console.log('  OK   ' + nazwa); }
    else { oblane++; console.log('  BLAD ' + nazwa + (szczegol ? ' → ' + szczegol : '')); }
}

const bieg = (o) => Object.assign({
    workoutType: 'running',
    duration: 1800,
    totalDistance: 5000,
    startDate: '2026-08-30T07:00:00.000+02:00',
    endDate: '2026-08-30T07:30:00.000+02:00',
    sourceName: 'Garmin Forerunner',
    platformId: 'abc-123'
}, o);

console.log('\n— co ma wejsc do bazy —');
{
    const r = _workoutRows([bieg({})]);
    sprawdz('bieg 5 km / 30 min daje jeden wiersz', r.length === 1, 'dostalem ' + r.length);
    sprawdz('dystans w km, nie w metrach', r[0].distance_km === 5, String(r[0].distance_km));
    sprawdz('czas w minutach', r[0].duration_min === 30, String(r[0].duration_min));
    sprawdz('tempo 6:00/km', r[0].avg_pace === '6:00', String(r[0].avg_pace));
    sprawdz('rodzaj easy', r[0].type === 'easy', String(r[0].type));
    sprawdz('marka zegarka przechodzi', r[0].source_name === 'Garmin Forerunner', String(r[0].source_name));
}

console.log('\n— co ma zostac odsiane —');
{
    sprawdz('rower nie jest biegiem', _workoutRows([bieg({ workoutType: 'cycling' })]).length === 0);
    sprawdz('joga nie jest biegiem', _workoutRows([bieg({ workoutType: 'yoga' })]).length === 0);
    sprawdz('silownia nie jest biegiem', _workoutRows([bieg({ workoutType: 'strengthTraining' })]).length === 0);
    sprawdz('4 minuty to nie trening', _workoutRows([bieg({ duration: 240 })]).length === 0);
    sprawdz('13 godzin to smiec w magazynie', _workoutRows([bieg({ duration: 13 * 3600 })]).length === 0);
    sprawdz('bez daty startu nic nie zapisujemy', _workoutRows([bieg({ startDate: null })]).length === 0);
    sprawdz('pusta lista nie wywala funkcji', _workoutRows([]).length === 0);
    sprawdz('null nie wywala funkcji', _workoutRows(null).length === 0);
    sprawdz('dziura w liscie nie wywala funkcji', _workoutRows([null, bieg({})]).length === 1);
}

console.log('\n— brak dystansu nie kasuje treningu —');
{
    const r = _workoutRows([bieg({ totalDistance: undefined })]);
    sprawdz('bieznia bez czujnika nadal sie zapisuje', r.length === 1);
    sprawdz('dystans pusty, nie zero', r[0] && r[0].distance_km === null, String(r[0] && r[0].distance_km));
    sprawdz('bez dystansu nie ma tempa', r[0] && r[0].avg_pace === null, String(r[0] && r[0].avg_pace));
    sprawdz('czas zostaje', r[0] && r[0].duration_min === 30);
}

console.log('\n— rodzaj treningu —');
{
    sprawdz('20 km to dlugie wybieganie',
        _workoutRows([bieg({ totalDistance: 20000, duration: 7200 })])[0].type === 'long');
    sprawdz('marsz to walkrun',
        _workoutRows([bieg({ workoutType: 'walking' })])[0].type === 'walkrun');
    sprawdz('wedrowka to walkrun',
        _workoutRows([bieg({ workoutType: 'hiking', duration: 3600, totalDistance: 6000 })])[0].type === 'walkrun');
    sprawdz('dlugi marsz tez jest long',
        _workoutRows([bieg({ workoutType: 'walking', totalDistance: 25000, duration: 5 * 3600 })])[0].type === 'long');
}

console.log('\n— zepsute tempo lepiej pominac niz podac —');
{
    sprawdz('1:00/km to nie bieg czlowieka',
        _workoutRows([bieg({ totalDistance: 30000, duration: 1800 })])[0].avg_pace === null);
    sprawdz('25:00/km to nie bieg ani marsz',
        _workoutRows([bieg({ totalDistance: 1200, duration: 1800 })])[0].avg_pace === null);
    sprawdz('ujemny dystans nie przechodzi',
        _workoutRows([bieg({ totalDistance: -5000 })])[0].distance_km === null);
    sprawdz('300 km w jednym biegu nie przechodzi',
        _workoutRows([bieg({ totalDistance: 300000, duration: 10 * 3600 })])[0].distance_km === null);
}

console.log('\n— data lokalna, nie UTC (bieg przed polnoca) —');
{
    // 23:30 czasu lokalnego. Po przelozeniu na UTC to czesto JUZ nastepny dzien —
    // gdyby kod bral date z UTC, trening wyladowalby pod innym dniem niz check-in.
    const wieczor = new Date();
    wieczor.setHours(23, 30, 0, 0);
    const oczekiwana = wieczor.getFullYear() + '-'
        + String(wieczor.getMonth() + 1).padStart(2, '0') + '-'
        + String(wieczor.getDate()).padStart(2, '0');
    const r = _workoutRows([bieg({ startDate: wieczor.toISOString() })]);
    sprawdz('bieg o 23:30 liczy sie do DZIS, nie do jutra',
        r[0].date === oczekiwana, r[0].date + ' zamiast ' + oczekiwana);
}

console.log('\n— czas CALKOWITY zaniza tempo (znany limit kanalu) —');
{
    // 5 km w 25 min biegu + 5 min stania na swiatlach = 30 min sesji.
    // Strava podalaby 5:00/km (moving_time), Health Connect poda 6:00/km.
    const r = _workoutRows([bieg({ totalDistance: 5000, duration: 1800 })]);
    sprawdz('tempo liczone z czasu calkowitego = 6:00, nie 5:00',
        r[0].avg_pace === '6:00',
        'jesli to sie zmieni, zaktualizuj komentarz o moving_time');
}

console.log('\n' + (oblane === 0 ? 'WSZYSTKO ZDANE' : 'SA BLEDY') + ': ' + zdane + ' zdanych, ' + oblane + ' oblanych');
process.exit(oblane === 0 ? 0 : 1);
