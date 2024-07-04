import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

async function getDB() {
  return await SQLite.openDatabaseAsync('pokemon_gallery', {
    useNewConnection: true
  });
}

export async function createTables() {
  const db = await getDB();

  try {
    const [{localUri}] = await Asset.loadAsync(require('./sql/create_tables.sql'));
    const queries = await FileSystem.readAsStringAsync(localUri);
    await db.execAsync(queries);
  } catch (error) {
    console.error(error);
  }
}

export async function dropTables() {
  const db = await getDB();

  try {
    const [{localUri}] = await Asset.loadAsync(require('./sql/drop_tables.sql'));
    const queries = await FileSystem.readAsStringAsync(localUri);
    await db.execAsync(queries);
  } catch (error) {
    console.error(error);
  }
}

export async function checkTableExists(tableName) {
  const db = await getDB();

  const query = `SELECT name
                 FROM sqlite_master
                 WHERE type = 'table'
                   AND name = '${tableName}'`;
  const result = await db.getFirstAsync(query);
  return result !== null;
}

export async function addPokemon(pokemon, allTypes) {
  const db = await getDB();

  const query = `INSERT INTO pokemon (id, name, image_default, image_shiny, image_thumb, image_gif)
                 VALUES ($id, $name, $image_default, $image_shiny, $image_thumb, $image_gif)`;
  const statement = await db.prepareAsync(query);
  try {
    const result = await statement.executeAsync({
      $id: pokemon.id,
      $name: pokemon.name,
      $image_default: pokemon.images.default,
      $image_shiny: pokemon.images.shiny,
      $image_thumb: pokemon.images.thumb,
      $image_gif: pokemon.images.gif
    });

    for (const [language, name] of Object.entries(pokemon.names)) {
      const queryName = `INSERT INTO pokemon_names (pokemon_id, language, name)
                         VALUES ($pokemon_id, $language, $name)`;
      const statement = await db.prepareAsync(queryName);

      try {
        await statement.executeAsync({
          $pokemon_id: pokemon.id,
          $language: language,
          $name: name
        });
      } finally {
        await statement.finalizeAsync();
      }
    }

    for (const type of pokemon.types) {
      const queryName = `INSERT INTO pokemon_type (pokemon_id, type_id)
                         VALUES ($pokemon_id, $type_id)`;
      const statement = await db.prepareAsync(queryName);

      const foundType = allTypes.find((t) => t.name === type.type.name);

      try {
        await statement.executeAsync({
          $pokemon_id: pokemon.id,
          $type_id: foundType.id
        });
      } finally {
        await statement.finalizeAsync();
      }
    }

  } catch (e) {
    console.log(e);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getPokemon() {
  const db = await getDB();
  const data = await db.getAllAsync(`SELECT p.id,
                                            p.image_default,
                                            p.image_shiny,
                                            p.image_thumb,
                                            p.image_gif,
                                            '{' || GROUP_CONCAT(DISTINCT '"' || pn.language || '": "' || pn.name || '"') || '}' AS names,
                                            '[' || GROUP_CONCAT(DISTINCT pt.type_id) || ']' AS types
                                     FROM pokemon AS p
                                         LEFT JOIN pokemon_names AS pn ON pn.pokemon_id = p.id
                                         LEFT JOIN pokemon_type AS pt ON pt.pokemon_id = p.id
                                     GROUP BY p.id`);

  data.forEach((p) => {
    p.names = JSON.parse(p.names);
    p.types = JSON.parse(p.types);
  });
  return data;
}

export async function addType(type) {
  const db = await getDB();

  const query = `INSERT INTO types (id, name)
                 VALUES ($id, $name)`;
  const statement = await db.prepareAsync(query);
  try {
    const result = await statement.executeAsync({
      $id: type.id,
      $name: type.name
    });

    for (const [language, name] of Object.entries(type.names)) {
      const queryName = `INSERT INTO types_names (type_id, language, name)
                         VALUES ($type_id, $language, $name)`;
      const statement = await db.prepareAsync(queryName);

      try {
        await statement.executeAsync({
          $type_id: type.id,
          $language: language,
          $name: name
        });
      } finally {
        await statement.finalizeAsync();
      }
    }

  } catch (e) {
    console.log(e);
  } finally {
    await statement.finalizeAsync();
  }
}

export async function getTypes() {
  const db = await getDB();
  const data = await db.getAllAsync(`SELECT t.id,
                                            '{' || GROUP_CONCAT(DISTINCT '"' || tn.language || '": "' || tn.name || '"') || '}' AS names
                                     FROM types AS t
                                         LEFT JOIN types_names AS tn ON tn.type_id = t.id
                                     GROUP BY t.id ORDER BY t.name ASC`);

  data.forEach((p) => p.names = JSON.parse(p.names));
  return data;
}
