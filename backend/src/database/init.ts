import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'db.sqlite')

export const db = new Database(DB_PATH)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Create tables
export function initDatabase() {
  // Conversations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Messages table
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `)

  // Followed sports table
  db.exec(`
    CREATE TABLE IF NOT EXISTS followed_sports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sport TEXT NOT NULL,
      team_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Feed items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feed_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      sport TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log('✅ Database initialized')
}

// Prepared statements for common operations
export const statements = {
  // Conversations
  insertConversation: db.prepare('INSERT INTO conversations (title) VALUES (?)'),
  getConversation: db.prepare('SELECT * FROM conversations WHERE id = ?'),
  getAllConversations: db.prepare('SELECT * FROM conversations ORDER BY updated_at DESC'),
  updateConversation: db.prepare('UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'),
  deleteConversation: db.prepare('DELETE FROM conversations WHERE id = ?'),

  // Messages
  insertMessage: db.prepare('INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)'),
  getMessagesByConversation: db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'),
  getAllMessages: db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 1000'),

  // Followed sports
  insertFollowedSport: db.prepare('INSERT INTO followed_sports (sport, team_id) VALUES (?, ?)'),
  getFollowedSports: db.prepare('SELECT * FROM followed_sports ORDER BY created_at DESC'),
  deleteFollowedSport: db.prepare('DELETE FROM followed_sports WHERE id = ?'),

  // Feed items
  insertFeedItem: db.prepare('INSERT INTO feed_items (type, title, content, sport) VALUES (?, ?, ?, ?)'),
  getRecentFeedItems: db.prepare('SELECT * FROM feed_items ORDER BY created_at DESC LIMIT 50'),
  getFeedItemsBySport: db.prepare('SELECT * FROM feed_items WHERE sport = ? ORDER BY created_at DESC LIMIT 50')
}
