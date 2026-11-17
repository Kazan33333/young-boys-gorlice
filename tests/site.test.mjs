import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resultsData } from '../js/resultsData.js';
import { leagueFixturesData } from '../js/leagueFixturesData.js';
import { standingsData } from '../js/standingsData.js';
import { tournamentResultsData } from '../js/tournamentsData.js';
import { standingsData as tournamentStandings } from '../js/tournamentsStandingsData.js';
import { seasonMedals } from '../js/seasonMedals.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(root, path), 'utf8');
const pages = ['index', 'history', 'gallery', 'fixtures', 'results', 'tournaments', 'stats'];
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');

// Baseline digests were computed from the user's uploaded files, before refactoring.
// This guards against accidental changes to even one score, date, name, or scorer.
const originalDigests = {
    resultsData: '79aea26194e12b0898ff0347f3511e0226ed5b3c57c909cad436a5f731cd5f18',
    leagueFixturesData: 'b8f98479dd05b7cd92dbb9ae3599b442c73af50898200be7d3789a2d0aadaa3d',
    standingsData: '3a03ba7f28940a9697167e1dfb875fdd679b0f3dd5d5ac128bb272d8da6d24fc',
    tournamentResultsData: 'a9944415afbc8e35d9b6cdc5214cffb57eceb1d29dc38cc661dde1c3a2b96bea',
};

test('all original league, result, standing, and tournament records are unchanged', () => {
    for (const [name, data] of Object.entries({
        resultsData, leagueFixturesData, standingsData, tournamentResultsData,
    })) {
        assert.equal(hash(data), originalDigests[name], `${name} differs from the upload`);
    }
    assert.equal(Object.values(resultsData).reduce((sum, games) => sum + games.length, 0), 116);
    assert.equal(Object.values(leagueFixturesData).reduce((sum, games) => sum + games.length, 0), 108);
});

test('recent club records are derived from league fixtures without losing scorer details', () => {
    for (const season of ['2024/25', '2025/26']) {
        const fixtures = leagueFixturesData[season].filter(match => match.team.includes('Young Boys Gorlice'));
        const results = resultsData[season];
        assert.equal(results.length, fixtures.length);
        for (let i = 0; i < fixtures.length; i++) {
            assert.equal(results[i].date, fixtures[i].date.split(' ')[0]);
            assert.equal(results[i].score, fixtures[i].score);
            assert.equal(typeof results[i].scorers, 'string');
            if (season === '2024/25' && i === 6) {
                assert.equal(results[i].team, 'Young Boys Gorlice - Przęłęcz Magurska');
            } else {
                assert.equal(results[i].team, fixtures[i].team);
            }
        }
    }
});

test('all seven generated HTML pages remain standalone and contain their required UI', () => {
    for (const page of pages) {
        const output = read(`${page}.html`);
        const source = read(`src/pages/${page}.html`);
        assert.match(output, /<!doctype html>/i);
        assert.match(output, /<header>/);
        assert.match(output, /<footer\b/);
        assert.match(output, /id="searchResultsModal"/);
        assert.match(output, /<main\b/);
        assert.doesNotMatch(output, /\{\{[^}]*\}\}/, `unresolved template in ${page}`);
        assert.match(source, /\{\{>header\}\}/);
        assert.match(source, /\{\{>search-modal\}\}/);
        assert.equal((output.match(/id="searchResultsModal"/g) || []).length, 1);
        assert.doesNotMatch(output, /id="loginLink"/, 'duplicated legacy navigation ID');
    }
});

test('all referenced local images, scripts, stylesheets and links exist', () => {
    for (const page of pages) {
        const html = read(`${page}.html`);
        for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
            let uri = match[1];
            if (/^(?:https?:|\/\/|javascript:|mailto:|tel:|#|data:)/i.test(uri)) continue;
            uri = uri.split(/[?#]/)[0];
            if (!uri) continue;
            const localPath = join(root, uri.replace(/^\//, ''));
            assert.ok(existsSync(localPath), `${page} references missing file: ${uri}`);
        }
    }
    for (const medal of Object.values(seasonMedals)) {
        assert.ok(existsSync(join(root, medal)), `Missing medal: ${medal}`);
    }
    // Tournament tables include additional data not duplicated in league standings.
    assert.equal(Object.keys(tournamentStandings).length, Object.keys(tournamentResultsData).length);
});
