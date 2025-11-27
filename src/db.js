import * as SQLite from 'expo-sqlite';

const DB_NAME = 'bayna_yadayk.db';

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

  const sampleTextbook = {
    title: 'Байна ядайк - Том 1',
    description: 'Базовый курс диалогов и лексики для начинающих',
    level: 'A1',
    order_index: 1,
  };

  const sampleLessons = [
    {
      number: 1,
      title: 'الدرس الأول - التعارف',
      subtitle: 'Урок 1 - Знакомство',
      difficulty: 'مبتدئ',
      order_index: 1,
      dialogues: [
        { id: 1, arabic: 'السلام عليكم', transcription: 'as-salāmu ʿalaykum', russian: 'Мир вам (приветствие)', speaker: 'А' },
        { id: 2, arabic: 'وعليكم السلام', transcription: 'wa ʿalaykumu s-salām', russian: 'И вам мир (ответ на приветствие)', speaker: 'Б' },
        { id: 3, arabic: 'ما اسمك؟', transcription: 'mā ismuka?', russian: 'Как тебя зовут?', speaker: 'А' },
        { id: 4, arabic: 'اسمي أحمد', transcription: 'ismī Aḥmad', russian: 'Меня зовут Ахмад', speaker: 'Б' },
        { id: 5, arabic: 'أهلاً وسهلاً', transcription: 'ahlan wa sahlan', russian: 'Добро пожаловать', speaker: 'А' },
      ],
    },
    {
      number: 2,
      title: 'الدرس الثاني - في البيت',
      subtitle: 'Урок 2 - Дома',
      difficulty: 'مبتدئ',
      order_index: 2,
      dialogues: [
        { id: 1, arabic: 'أين البيت؟', transcription: 'ayna l-bayt?', russian: 'Где дом?', speaker: 'А' },
        { id: 2, arabic: 'هذا البيت', transcription: 'hādhā l-bayt', russian: 'Вот дом', speaker: 'Б' },
        { id: 3, arabic: 'البيت كبير', transcription: 'al-baytu kabīr', russian: 'Дом большой', speaker: 'А' },
        { id: 4, arabic: 'نعم، البيت جميل', transcription: 'naʿam, al-baytu jamīl', russian: 'Да, дом красивый', speaker: 'Б' },
      ],
    },
    {
      number: 3,
      title: 'الدرس الثالث - في السوق',
      subtitle: 'Урок 3 - На рынке',
      difficulty: 'متوسط',
      order_index: 3,
      dialogues: [
        { id: 1, arabic: 'أين السوق؟', transcription: 'ayna s-sūq?', russian: 'Где рынок?', speaker: 'А' },
        { id: 2, arabic: 'السوق قريب من هنا', transcription: 'as-sūqu qarībun min hunā', russian: 'Рынок близко отсюда', speaker: 'Б' },
        { id: 3, arabic: 'بكم هذا؟', transcription: 'bi-kam hādhā?', russian: 'Сколько это стоит?', speaker: 'А' },
        { id: 4, arabic: 'بعشرة ريالات', transcription: 'bi-ʿasharati riyālāt', russian: 'Десять риалов', speaker: 'Б' },
        { id: 5, arabic: 'غالي جداً', transcription: 'ghālin jiddan', russian: 'Очень дорого', speaker: 'А' },
      ],
    },
  ];

  const sampleVocabulary = [
    { key: 'salam', arabic: 'السلام عليكم', transcription: 'as-salāmu ʿalaykum', translation_ru: 'Мир вам', part_of_speech: PARTS_OF_SPEECH.PHRASE, notes: 'Базовое приветствие' },
    { key: 'reply_salam', arabic: 'وعليكم السلام', transcription: 'wa ʿalaykumu s-salām', translation_ru: 'И вам мир', part_of_speech: PARTS_OF_SPEECH.PHRASE, notes: 'Ответ на приветствие' },
    { key: 'name', arabic: 'اسم', transcription: 'ism', translation_ru: 'имя', part_of_speech: PARTS_OF_SPEECH.NOUN },
    { key: 'house', arabic: 'بيت', transcription: 'bayt', translation_ru: 'дом', part_of_speech: PARTS_OF_SPEECH.NOUN },
    { key: 'market', arabic: 'سوق', transcription: 'sūq', translation_ru: 'рынок', part_of_speech: PARTS_OF_SPEECH.NOUN },
    { key: 'big', arabic: 'كبير', transcription: 'kabīr', translation_ru: 'большой', part_of_speech: PARTS_OF_SPEECH.ADJ },
    { key: 'beautiful', arabic: 'جميل', transcription: 'jamīl', translation_ru: 'красивый', part_of_speech: PARTS_OF_SPEECH.ADJ },
    { key: 'expensive', arabic: 'غالي', transcription: 'ghālī', translation_ru: 'дорогой', part_of_speech: PARTS_OF_SPEECH.ADJ },
    { key: 'riyal', arabic: 'ريال', transcription: 'riyāl', translation_ru: 'риал', part_of_speech: PARTS_OF_SPEECH.NOUN },
  ];

  const sampleLessonVocabulary = [
    { lessonNumber: 1, vocabKey: 'salam', order_index: 1 },
    { lessonNumber: 1, vocabKey: 'reply_salam', order_index: 2 },
    { lessonNumber: 1, vocabKey: 'name', order_index: 3 },
    { lessonNumber: 2, vocabKey: 'house', order_index: 1 },
    { lessonNumber: 2, vocabKey: 'big', order_index: 2 },
    { lessonNumber: 2, vocabKey: 'beautiful', order_index: 3 },
    { lessonNumber: 3, vocabKey: 'market', order_index: 1 },
    { lessonNumber: 3, vocabKey: 'riyal', order_index: 2 },
    { lessonNumber: 3, vocabKey: 'expensive', order_index: 3 },
  ];

  const textbookResult = await run(
    'INSERT INTO textbooks (title, description, level, order_index) VALUES (?, ?, ?, ?);',
    [sampleTextbook.title, sampleTextbook.description, sampleTextbook.level, sampleTextbook.order_index]
  );
  const textbookId = textbookResult.lastInsertRowId;

  const lessonIdByNumber = {};

  for (const lesson of sampleLessons) {
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

  return true;
}
