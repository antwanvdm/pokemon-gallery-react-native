CREATE TABLE IF NOT EXISTS pokemon
(
    id            INTEGER PRIMARY KEY NOT NULL,
    name          VARCHAR(100)        NOT NULL,
    image_default VARCHAR(200)        NOT NULL,
    image_shiny   VARCHAR(200)        NOT NULL,
    image_thumb   VARCHAR(200)        NOT NULL,
    image_gif     VARCHAR(200)        NOT NULL
);

CREATE TABLE IF NOT EXISTS pokemon_names
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    pokemon_id INTEGER                           NOT NULL,
    language   VARCHAR(6)                        NOT NULL,
    name       VARCHAR(100)                      NOT NULL,
    FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS types
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name VARCHAR(100)                      NOT NULL
);

CREATE TABLE IF NOT EXISTS types_names
(
    id       INTEGER PRIMARY KEY NOT NULL,
    type_id  INTEGER             NOT NULL,
    language VARCHAR(6)          NOT NULL,
    name     VARCHAR(200)        NOT NULL,
    FOREIGN KEY (type_id) REFERENCES types (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pokemon_type
(
    pokemon_id INTEGER NOT NULL,
    type_id    INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, type_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon (id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES types (id) ON DELETE CASCADE
);
