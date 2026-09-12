// Sprawdza _workoutRows z js/dashboard/14-integracje.js BEZ telefonu.
// Funkcja jest wyciagana z prawdziwego pliku, nie przepisana — inaczej test
// sprawdzalby kopie, a nie kod, ktory pojdzie na produkcje.
// Uruchamianie:  node tools/test_workout_rows.js
//
// ── CO SIE ZMIENILO 2026-09-12 ────────────────────────────────────────────────
// _workoutRows PRZESTALA PRZELICZAC. Wczesniej oddawala gotowy wiersz tabeli
// `workouts` (data lokalna, km, tempo, rodzaj). Teraz oddaje LICZBY SUROWE,
// a przelicza je backend (velm-backend/lib/canonical.js). Powody sa trzy:
//   1. odsiewanie duplikatow rozpoznaje ten sam bieg po starcie z dokladnoscia
//      do +-3 minut — sama data dzienna te informacje gubi,
//   2. `sourceId` (pakiet aplikacji) jest jedynym sposobem rozpoznania biegu
//      relayowanego przez Garmin Connect, a dotad nie opuszczal telefonu,
//      => wczesniej zadne z tych dwoch pol nie bylo wysylane w ogole,
//   3. rodzaj treningu liczony w dwoch miejscach naraz rozjechalby sie przy
//      trzecim zrodle.
// Dlatego testy na `date`, `distance_km`, `avg_pace` i `type` ZNIKLY stad —
// te reguly maja teraz pokrycie w velm-backend/scripts/test-dedup.js.
// Tutaj zostalo to, co ta funkcja nadal robi: ODSIEWA i PRZEPUSZCZA.
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

const kodTypow = slice('const WATCH_RUN_TYPES = [', '];') + '];';
const kodMapowania = slice('function _workoutRows(workouts) {', 'async function _watchReadSamples');

const _workoutRows = new Function(
    kodTypow + '\n' + kodMapowania + '\nreturn _workoutRows;'
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
    sourceId: 'com.garmin.android.apps.connectmobile',
    platformId: 'abc-123'
}, o);

console.log('\n— co ma wyjsc na serwer —');
{
    const r = _workoutRows([bieg({})]);
    sprawdz('bieg 5 km / 30 min daje jeden wiersz', r.length === 1, 'dostalem ' + r.length);
    sprawdz('dystans w METRACH, bez przeliczania', r[0].distance_m === 5000, String(r[0].distance_m));
    sprawdz('czas w SEKUNDACH, bez przeliczania', r[0].duration_s === 1800, String(r[0].duration_s));
    sprawdz('typ Health Connect idzie nietkniety', r[0].workout_type === 'running', String(r[0].workout_type));
    sprawdz('marka zegarka przechodzi', r[0].source_name === 'Garmin Forerunner', String(r[0].source_name));
    sprawdz('identyfikator rekordu przechodzi', r[0].platform_id === 'abc-123', String(r[0].platform_id));
}

console.log('\n— dwa pola, bez ktorych nowa warstwa jest slepa —');
{
    const r = _workoutRows([bieg({})]);
    // Bez pelnej godziny odsiewanie duplikatow nie ma na czym pracowac: ten sam bieg
    // z dwoch zrodel rozpoznaje sie po starcie z dokladnoscia do +-3 minut.
    sprawdz('godzina startu przechodzi, nie sama data',
        r[0].started_at === '2026-08-30T05:00:00.000Z', String(r[0].started_at));
    sprawdz('start to pelny znacznik ISO, nie YYYY-MM-DD',
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(r[0].started_at || ''), String(r[0].started_at));
    // Bez tego bieg relayowany przez Garmin Connect jest nie do odroznienia
    // od biegu zapisanego wprost przez telefon.
    sprawdz('pakiet aplikacji przechodzi (rozpoznanie relayu)',
        r[0].source_id === 'com.garmin.android.apps.connectmobile', String(r[0].source_id));
}

console.log('\n— tetno i kalorie, dotad wyrzucane —');
{
    const r = _workoutRows([bieg({ avgHeartRate: 152, totalEnergyBurned: 430 })]);
    sprawdz('srednie tetno przechodzi', r[0].avg_hr === 152, String(r[0].avg_hr));
    sprawdz('kalorie przechodza', r[0].calories === 430, String(r[0].calories));

    const puste = _workoutRows([bieg({})]);
    sprawdz('brak tetna to null, nie zero', puste[0].avg_hr === null, String(puste[0].avg_hr));
    sprawdz('tetno 300 to zepsuty czujnik, nie dane',
        _workoutRows([bieg({ avgHeartRate: 300 })])[0].avg_hr === null);
    sprawdz('tetno 5 to zepsuty czujnik, nie dane',
        _workoutRows([bieg({ avgHeartRate: 5 })])[0].avg_hr === null);
}

console.log('\n— co ma zostac odsiane —');
{
    sprawdz('rower nie jest biegiem', _workoutRows([bieg({ workoutType: 'cycling' })]).length === 0);
    sprawdz('joga nie jest biegiem', _workoutRows([bieg({ workoutType: 'yoga' })]).length === 0);
    sprawdz('silownia nie jest biegiem', _workoutRows([bieg({ workoutType: 'strengthTraining' })]).length === 0);
    sprawdz('4 minuty to nie trening', _workoutRows([bieg({ duration: 240 })]).length === 0);
    sprawdz('13 godzin to smiec w magazynie', _workoutRows([bieg({ duration: 13 * 3600 })]).length === 0);
    sprawdz('bez daty startu nic nie wysylamy', _workoutRows([bieg({ startDate: null })]).length === 0);
    sprawdz('zepsuta data startu nie przechodzi',
        _workoutRows([bieg({ startDate: 'wczoraj rano' })]).length === 0);
    sprawdz('pusta lista nie wywala funkcji', _workoutRows([]).length === 0);
    sprawdz('null nie wywala funkcji', _workoutRows(null).length === 0);
    sprawdz('dziura w liscie nie wywala funkcji', _workoutRows([null, bieg({})]).length === 1);
}

console.log('\n— wszystkie piec typow biegowych przechodzi —');
{
    // Sito musi sie zgadzac z SPORT_MAP na backendzie (lib/dedup.js). Gdyby tu
    // wpadl typ, ktorego backend nie zna, trening wpadlby jako 'other'.
    ['running', 'runningTreadmill', 'trackAndField', 'walking', 'hiking'].forEach((t) => {
        sprawdz(t + ' przechodzi sito', _workoutRows([bieg({ workoutType: t })]).length === 1);
    });
}

console.log('\n— brak dystansu nie kasuje treningu —');
{
    const r = _workoutRows([bieg({ totalDistance: undefined })]);
    sprawdz('bieznia bez czujnika nadal sie zapisuje', r.length === 1);
    sprawdz('dystans pusty, nie zero', r[0] && r[0].distance_m === null, String(r[0] && r[0].distance_m));
    sprawdz('czas zostaje', r[0] && r[0].duration_s === 1800);
}

console.log('\n— zepsuty dystans lepiej pominac niz podac —');
{
    sprawdz('ujemny dystans nie przechodzi',
        _workoutRows([bieg({ totalDistance: -5000 })])[0].distance_m === null);
    sprawdz('300 km w jednym biegu nie przechodzi',
        _workoutRows([bieg({ totalDistance: 300000, duration: 10 * 3600 })])[0].distance_m === null);
}

console.log('\n— bieg przed polnoca: dzien rozstrzyga backend —');
{
    // 23:30 czasu lokalnego. Wczesniej liczylismy date TUTAJ, ze strefy telefonu.
    // Teraz idzie sam znacznik czasu, a dzien lokalny wyznacza backend ze strefy
    // zapisanej w profilu zawodnika — tej samej, ktorej uzywa check-in.
    const wieczor = new Date();
    wieczor.setHours(23, 30, 0, 0);
    const r = _workoutRows([bieg({ startDate: wieczor.toISOString() })]);
    sprawdz('wieczorny bieg przechodzi w calosci', r.length === 1);
    sprawdz('nie ma juz pola `date` — dzien liczy backend',
        r[0].date === undefined, JSON.stringify(r[0].date));
    sprawdz('godzina 23:30 nie zostala zgubiona',
        new Date(r[0].started_at).getHours() === 23,
        String(new Date(r[0].started_at).getHours()));
}

console.log('\n— dlugie teksty sa przycinane, nie odrzucane —');
{
    const r = _workoutRows([bieg({ sourceName: 'x'.repeat(300), platformId: 'y'.repeat(300) })]);
    sprawdz('nazwa zrodla przycieta do 80', r[0].source_name.length === 80, String(r[0].source_name.length));
    sprawdz('identyfikator przyciety do 120', r[0].platform_id.length === 120, String(r[0].platform_id.length));
    sprawdz('trening mimo to przechodzi', r.length === 1);
}

console.log('\n' + (oblane === 0 ? 'WSZYSTKO ZDANE' : 'SA BLEDY') + ': ' + zdane + ' zdanych, ' + oblane + ' oblanych');
process.exit(oblane === 0 ? 0 : 1);
