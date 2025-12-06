import * as SQLite from 'expo-sqlite';
import initialData from '../assets/seed/initialData.json';

const DB_NAME = 'bayna_yadayk_v2.db';

export const PARTS_OF_SPEECH = {
  NOUN: 'noun',
  VERB: 'verb',
  ADJ: 'adj',
  ADV: 'adv',
  PHRASE: 'phrase',
};

export const PARTS_OF_SPEECH_LABELS = {
  [PARTS_OF_SPEECH.NOUN]: 'Существительное',
  [PARTS_OF_SPEECH.VERB]: 'Глагол',
  [PARTS_OF_SPEECH.ADJ]: 'Прилагательное',
  [PARTS_OF_SPEECH.ADV]: 'Наречие',
  [PARTS_OF_SPEECH.PHRASE]: 'Фраза',
};

let dbPromise = null;
let initPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

async function exec(sql) {
  const db = await getDb();
  await db.execAsync(sql);
}

async function run(sql, params = []) {
  const db = await getDb();
  return db.runAsync(sql, params);
}

async function all(sql, params = []) {
  const db = await getDb();
  return db.getAllAsync(sql, params);
}

function parseLessonContent(rawContent) {
  if (!rawContent) {
    return { dialogues: [], difficulty: null };
  }

  try {
    const parsed = JSON.parse(rawContent);
    const dialogues = Array.isArray(parsed.dialogues) ? parsed.dialogues : [];
    const difficulty = parsed.difficulty || parsed.level || null;

    return { ...parsed, dialogues, difficulty };
  } catch (error) {
    return { dialogues: [], difficulty: null };
  }
}

function normalizeLesson(row) {
  const contentData = parseLessonContent(row.content);
  const dialogues = contentData.dialogues || [];

  return {
    ...row,
    contentData,
    dialogues,
    difficulty: contentData.difficulty || null,
    dialoguesCount: dialogues.length,
  };
}

export async function initDb() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    await exec('PRAGMA foreign_keys = ON;');

    await exec(`
      CREATE TABLE IF NOT EXISTS textbooks (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        title        TEXT    NOT NULL,
        description  TEXT,
        level        TEXT,
        order_index  INTEGER DEFAULT 0
      );
    `);

    await exec(`
      CREATE TABLE IF NOT EXISTS lessons (
        id           INTEGER PRIMARY KEY AUTOINCREMENT,
        textbook_id  INTEGER NOT NULL,
        number       INTEGER NOT NULL,
        title        TEXT    NOT NULL,
        subtitle     TEXT,
        content      TEXT,
        audio_url    TEXT,
        order_index  INTEGER DEFAULT 0,
        FOREIGN KEY (textbook_id) REFERENCES textbooks(id) ON DELETE CASCADE
      );
    `);

    await exec(`
      CREATE TABLE IF NOT EXISTS vocabulary (
        id               INTEGER PRIMARY KEY AUTOINCREMENT,
        arabic           TEXT    NOT NULL,
        transcription    TEXT,
        translation_ru   TEXT    NOT NULL,
        translation_lang TEXT    NOT NULL DEFAULT 'ru',
        part_of_speech   TEXT,
        notes            TEXT,
        audio_url        TEXT
      );
    `);

    await exec(`
      CREATE TABLE IF NOT EXISTS lesson_vocabulary (
        lesson_id      INTEGER NOT NULL,
        vocabulary_id  INTEGER NOT NULL,
        order_index    INTEGER DEFAULT 0,
        PRIMARY KEY (lesson_id, vocabulary_id),
        FOREIGN KEY (lesson_id)     REFERENCES lessons(id)     ON DELETE CASCADE,
        FOREIGN KEY (vocabulary_id) REFERENCES vocabulary(id) ON DELETE CASCADE
      );
    `);
  })();

  return initPromise;
}

export async function getTextbooks() {
  await initDb();
  return all('SELECT * FROM textbooks ORDER BY order_index ASC, id ASC;');
}

export async function getLessonsByTextbook(textbookId) {
  await initDb();
  const rows = await all(
    'SELECT * FROM lessons WHERE textbook_id = ? ORDER BY order_index ASC, number ASC, id ASC;',
    [textbookId]
  );
  return rows.map(normalizeLesson);
}

export async function getLessonById(id) {
  await initDb();
  const rows = await all(
    'SELECT * FROM lessons WHERE id = ? LIMIT 1;',
    [id]
  );
  return rows.length ? normalizeLesson(rows[0]) : null;
}

export async function getVocabularyByLesson(lessonId) {
  await initDb();
  return all(
    `
      SELECT 
        v.id,
        v.arabic,
        v.transcription,
        v.translation_ru,
        v.translation_lang,
        v.part_of_speech,
        v.notes,
        v.audio_url
      FROM lesson_vocabulary lv
      JOIN vocabulary v ON lv.vocabulary_id = v.id
      WHERE lv.lesson_id = ?
      ORDER BY lv.order_index ASC, v.id ASC;
    `,
    [lessonId]
  );
}

export async function getVocabularyItemById(id) {
  await initDb();
  const rows = await all(
    'SELECT * FROM vocabulary WHERE id = ? LIMIT 1;',
    [id]
  );
  return rows.length ? rows[0] : null;
}

export async function getVocabularyByCategory(category) {
  await initDb();
  const hasFilter = category && category !== 'all';
  const query = `
    SELECT * FROM vocabulary
    ${hasFilter ? 'WHERE part_of_speech = ?' : ''}
    ORDER BY id ASC;
  `;
  return all(query, hasFilter ? [category] : []);
}

export async function seedDbIfEmpty() {
  await initDb();

  const textbooksCount = await all('SELECT COUNT(*) as count FROM textbooks;');
  const count = textbooksCount[0]?.count || 0;

  if (count > 0) {
    return false;
  }

  const sampleTextbooks = initialData.textbooks || [];
  const baseLessons = initialData.lessons || [];
  const sampleVocabulary = initialData.vocabulary || [];
  const sampleLessonVocabulary = initialData.lessonVocabulary || [];

  const vocabularyIdByKey = {};

  for (const word of sampleVocabulary) {
    const vocabResult = await run(
      `
        INSERT INTO vocabulary (arabic, transcription, translation_ru, translation_lang, part_of_speech, notes, audio_url)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [
        word.arabic,
        word.transcription,
        word.translation_ru,
        'ru',
        word.part_of_speech,
        word.notes || null,
        word.audio_url || null,
      ]
    );

    vocabularyIdByKey[word.key] = vocabResult.lastInsertRowId;
  }

  for (const textbook of sampleTextbooks) {
    const textbookResult = await run(
      'INSERT INTO textbooks (title, description, level, order_index) VALUES (?, ?, ?, ?);',
      [textbook.title, textbook.description, textbook.level, textbook.order_index]
    );
    const textbookId = textbookResult.lastInsertRowId;

    const lessonIdByNumber = {};

    const lessonsForTextbook = baseLessons.filter(
      (lesson) =>
        !lesson.textbookOrder ||
        lesson.textbookOrder === textbook.order_index
    );

    for (const lesson of lessonsForTextbook) {
      const content = JSON.stringify({
        dialogues: lesson.dialogues,
        difficulty: lesson.difficulty,
      });

      const lessonResult = await run(
        `
          INSERT INTO lessons (textbook_id, number, title, subtitle, content, audio_url, order_index)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
        [textbookId, lesson.number, lesson.title, lesson.subtitle, content, null, lesson.order_index]
      );

      lessonIdByNumber[lesson.number] = lessonResult.lastInsertRowId;
    }

    for (const entry of sampleLessonVocabulary) {
      const lessonId = lessonIdByNumber[entry.lessonNumber];
      const vocabId = vocabularyIdByKey[entry.vocabKey];

      if (!lessonId || !vocabId) {
        continue;
      }

      await run(
        `
          INSERT INTO lesson_vocabulary (lesson_id, vocabulary_id, order_index)
          VALUES (?, ?, ?);
        `,
        [lessonId, vocabId, entry.order_index || 0]
      );
    }
  }

  return true;
}
