import { Client, Downloader } from 'mishiro-core';
import Database from 'better-sqlite3';
import fs from 'node:fs/promises';
import { env } from 'node:process';

const ev = await getLatestEvent();

if ((Date.now() - evStart.getTime()) < 60*60*1000) {
  console.log('🐰✅ No new event');
  return;
}

console.log('🐰✨ Today\'s event Found');


const link = `https://cinderella-sl-stage.idolmaster-official.jp/event/event_help/index/${ev.id}`

if (ev.id % 1000 === 1) {
  await post({text: '', title: `【${ev.name}】新規イベントです。ヘルプはこちら`, link});
  return;
}



async function getChangesPage() {

}

async function getLatestEvent() {
  const key = env.CGSS_KEY;

  const client = new Client(key);
  try {
    const resVer = await client.check();
  } catch (e) {
    console.error('🐰⚠️ mishiro error');
    throw e;
  }
  const dler = new Downloader();

  await fs.rm('data/manifest', {force: true});
  await fs.rm('data/manifest.db', {force: true});
  await fs.rm('data/master', {force: true});
  await fs.rm('data/master.mdb', {force: true});

  await dler.downloadManifest(resVer, 'data/manifest');
  const manifest = new Database('data/manifest.db', {fileMustExist: true});
  const hash = manifest.prepare('SELECT hash FROM manifests WHERE name = ?').get('master.mdb').hash;
  await dler.downloadDatabase(hash, 'data/master');
  const master = new Database('data/master.bdb', {fileMustExist: true});
  const ev = master.prepare('SELECT MAX(event_start), event_start, id, name FROM event_data').get();

  return ev;
}
