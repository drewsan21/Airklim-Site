/**
 * Database Configuration
 * PostgreSQL connection pool and queries
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ Database connected');
});

pool.on('error', (err) => {
  // Non uscire: un errore idle del pool (es. restart di Postgres) non deve
  // uccidere il server; le query successive riconnettono automaticamente.
  console.error('❌ Database pool error:', err.message);
});

// Query helper
const query = async (text, params) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Query executed', { text, duration, rows: res.rowCount });
  }
  
  return res;
};

// Transaction helper
const transaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Initialize database schema
const initializeSchema = async () => {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        surname VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'privato' CHECK (role IN ('admin', 'professionista', 'privato')),
        phone VARCHAR(20),
        company VARCHAR(255),
        vat_number VARCHAR(20),
        permissions JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'deleted')),
        verified BOOLEAN DEFAULT FALSE,
        verification_token VARCHAR(255),
        reset_token VARCHAR(255),
        reset_token_expires TIMESTAMP,
        last_login TIMESTAMP,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
    `);

    // Orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
        total DECIMAL(10, 2) NOT NULL,
        shipping_address JSONB NOT NULL,
        payment_method VARCHAR(50),
        payment_status VARCHAR(20) DEFAULT 'pending',
        tracking_number VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
    `);

    // Order items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID REFERENCES products(id),
        name VARCHAR(255) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
    `);

    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        brand VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock')),
        image_url VARCHAR(500),
        specifications JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    `);

    // Sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
    `);

    // Audit logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        user_email VARCHAR(255),
        action VARCHAR(50) NOT NULL,
        resource VARCHAR(100) NOT NULL,
        resource_id VARCHAR(255),
        details JSONB,
        ip_address VARCHAR(45),
        user_agent TEXT,
        severity VARCHAR(20) DEFAULT 'info',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `);

    // Backups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS backups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(20) NOT NULL CHECK (type IN ('full', 'incremental')),
        size BIGINT NOT NULL,
        status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
        duration INTEGER,
        verified BOOLEAN DEFAULT FALSE,
        notes TEXT,
        file_path VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_backups_type ON backups(type);
      CREATE INDEX IF NOT EXISTS idx_backups_status ON backups(status);
    `);

    // Contents table (blog, video, gallery, testimonials)
    await client.query(`
      CREATE TABLE IF NOT EXISTS contents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type VARCHAR(20) NOT NULL CHECK (type IN ('blog', 'video', 'gallery', 'testimonial')),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        image_url VARCHAR(500),
        video_url VARCHAR(500),
        category VARCHAR(100),
        published BOOLEAN DEFAULT FALSE,
        author_id UUID REFERENCES users(id) ON DELETE SET NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
      CREATE INDEX IF NOT EXISTS idx_contents_published ON contents(published);
    `);

    // Settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        key VARCHAR(100) UNIQUE NOT NULL,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('✅ Database schema initialized');
  } finally {
    client.release();
  }
};

module.exports = {
  pool,
  query,
  transaction,
  initializeSchema
};
