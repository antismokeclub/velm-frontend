#!/usr/bin/env node
/**
 * Sklada dist/ — kopie aplikacji webowej, ktora Capacitor pakuje do apki natywnej
 * (`webDir` w capacitor.config.json wskazuje na dist/).
 *
 * DLACZEGO NODE, A NIE JEDNA LINIA W package.json: npm na Windowsie odpala skrypty
 * przez cmd.exe, gdzie nie ma ani `mkdir -p`, ani `cp`. Poprzednia wersja konczyla
 * sie `|| true`, wiec na tej maszynie CICHO nie robila nic — a blad wyszedlby
 * dopiero przy `npx cap sync`, ktore zglosiloby puste webDir.
 *
 * DLACZEGO BIALA LISTA, A NIE KOPIA KATALOGU: w korzeniu repo siedzi velm-backend/
 * (osobne repo, z .env), node_modules/ i sondy QA. Kopiowanie katalogu wpakowaloby
 * je do pliku .aab wyslanego do Google Play. Lista ponizej ma byc jedynym wejsciem.
 *
 * Uwaga: apka natywna ma ustawione `server.url` na produkcje, wiec normalnie
 * laduje zywa strone, a nie te kopie. Kopia jest po to, zeby usuniecie `server.url`
 * (gdyby Play tego wymagalo) dalo dzialajaca apke offline bez zmian w buildzie.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Musi sie zgadzac z lista `builds` w vercel.json — to te same pliki, ktore
// serwuje produkcja. Rozjazd znaczy, ze apka natywna dostaje inny zestaw niz PWA.
const FILES = [
    'index.html', 'dashboard.html', 'privacy.html', 'terms.html',
    'sw.js', 'manifest.json', 'icon-192.png', 'icon-512.png'
];
const DIRS = ['css', 'js'];

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const missing = [];
for (const f of FILES) {
    const src = path.join(ROOT, f);
    if (!fs.existsSync(src)) { missing.push(f); continue; }
    fs.copyFileSync(src, path.join(DIST, f));
}
for (const d of DIRS) {
    const src = path.join(ROOT, d);
    if (!fs.existsSync(src)) { missing.push(d + '/'); continue; }
    fs.cpSync(src, path.join(DIST, d), { recursive: true });
}

// Brakujacy plik to blad buildu, nie ostrzezenie: apka natywna bez js/ ladowalaby
// pusty ekran, a zauwazylby to dopiero user na telefonie.
if (missing.length) {
    console.error('build-dist: brak plikow w korzeniu repo -> ' + missing.join(', '));
    process.exit(1);
}

const count = (dir) => fs.readdirSync(dir, { withFileTypes: true })
    .reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log(`build-dist: dist/ gotowe (${count(DIST)} plikow)`);
