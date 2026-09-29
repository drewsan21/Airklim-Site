/**
 * Database Seed Script
 * Populate database with test data
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { pool, initializeSchema } = require('../config/database');

const seed = async () => {
  console.log('🌱 Starting database seed...\n');

  try {
    // Initialize schema
    await initializeSchema();
    console.log('✅ Schema initialized\n');

    const client = await pool.connect();

    try {
      // Clear existing data
      console.log('🗑️  Clearing existing data...');
      await client.query('DELETE FROM order_items');
      await client.query('DELETE FROM orders');
      await client.query('DELETE FROM sessions');
      await client.query('DELETE FROM audit_logs');
      await client.query('DELETE FROM backups');
      await client.query('DELETE FROM contents');
      await client.query('DELETE FROM products');
      await client.query('DELETE FROM users');
      console.log('✅ Data cleared\n');

      // Seed users
      console.log('👥 Seeding users...');
      const password = await bcrypt.hash('Admin@123!', 10);
      
      const users = [
        {
          email: 'admin@example.com',
          password,
          name: 'Mario',
          surname: 'Rossi',
          role: 'admin',
          phone: '+39 333 1234567',
          permissions: ['all'],
          verified: true,
          status: 'active'
        },
        {
          email: 'professionist@example.com',
          password: await bcrypt.hash('Pro@123!', 10),
          name: 'Luigi',
          surname: 'Bianchi',
          role: 'professionista',
          phone: '+39 333 2345678',
          company: 'ClimaTech Solutions',
          vat_number: 'IT12345678901',
          permissions: ['b2b_pricing', 'full_catalog', 'priority_support'],
          verified: true,
          status: 'active'
        },
        {
          email: 'user@example.com',
          password: await bcrypt.hash('User@123!', 10),
          name: 'Giuseppe',
          surname: 'Verdi',
          role: 'privato',
          phone: '+39 333 3456789',
          permissions: ['public_catalog', 'standard_pricing', 'basic_support'],
          verified: true,
          status: 'active'
        }
      ];

      for (const user of users) {
        await client.query(
          `INSERT INTO users (email, password, name, surname, role, phone, company, vat_number, permissions, verified, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [user.email, user.password, user.name, user.surname, user.role, user.phone, 
           user.company, user.vat_number, JSON.stringify(user.permissions), user.verified, user.status]
        );
      }
      console.log(`✅ ${users.length} users created\n`);

      // Seed products
      console.log('📦 Seeding products...');
      const products = [
        {
          name: 'Panasonic Etherea Z35',
          brand: 'Panasonic',
          category: 'Climatizzatori',
          description: 'Climatizzatore monosplit con tecnologia nanoe™ X',
          price: 1190.00,
          stock: 30,
          status: 'active',
          specifications: {
            power: '3.5 kW',
            btu: '12000',
            seer: 8.5,
            scop: 5.1,
            noise: '19 dB(A)',
            features: ['nanoe™ X', 'Wi-Fi', 'A+++', 'R32']
          }
        },
        {
          name: 'TCL BreezeIN 12000',
          brand: 'TCL',
          category: 'Climatizzatori',
          description: 'Climatizzatore con Gentle Breeze technology',
          price: 590.00,
          stock: 45,
          status: 'active',
          specifications: {
            power: '3.5 kW',
            btu: '12000',
            seer: 6.3,
            scop: 4.0,
            noise: '24 dB(A)',
            features: ['Gentle Breeze', 'Wi-Fi', 'A++', 'R32']
          }
        },
        {
          name: 'Panasonic Aquarea 9kW',
          brand: 'Panasonic',
          category: 'Pompe di Calore',
          description: 'Pompa di calore aria-acqua monoblocco',
          price: 4990.00,
          stock: 8,
          status: 'active',
          specifications: {
            power: '9 kW',
            scop: 5.12,
            min_temp: -28,
            features: ['Monoblocco', 'A+++', 'R32', 'Wi-Fi']
          }
        }
      ];

      for (const product of products) {
        await client.query(
          `INSERT INTO products (name, brand, category, description, price, stock, status, specifications)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [product.name, product.brand, product.category, product.description, 
           product.price, product.stock, product.status, JSON.stringify(product.specifications)]
        );
      }
      console.log(`✅ ${products.length} products created\n`);

      // Seed orders
      console.log('📋 Seeding orders...');
      const userResult = await client.query('SELECT id FROM users WHERE email = $1', ['user@example.com']);
      const userId = userResult.rows[0].id;

      const productResult = await client.query('SELECT id, price FROM products LIMIT 2');
      const productIds = productResult.rows;

      const orders = [
        {
          user_id: userId,
          status: 'delivered',
          total: 1190.00,
          shipping_address: {
            street: 'Via Roma 1',
            city: 'Palermo',
            zip: '90100',
            country: 'IT'
          },
          payment_method: 'stripe',
          payment_status: 'paid'
        },
        {
          user_id: userId,
          status: 'shipped',
          total: 590.00,
          shipping_address: {
            street: 'Via Roma 1',
            city: 'Palermo',
            zip: '90100',
            country: 'IT'
          },
          payment_method: 'stripe',
          payment_status: 'paid',
          tracking_number: 'TRK123456789'
        }
      ];

      for (const order of orders) {
        const orderResult = await client.query(
          `INSERT INTO orders (user_id, status, total, shipping_address, payment_method, payment_status, tracking_number)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [order.user_id, order.status, order.total, JSON.stringify(order.shipping_address),
           order.payment_method, order.payment_status, order.tracking_number]
        );
        
        const orderId = orderResult.rows[0].id;

        // Add order items
        await client.query(
          `INSERT INTO order_items (order_id, product_id, name, quantity, price)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, productIds[0].id, 'Panasonic Etherea Z35', 1, productIds[0].price]
        );
      }
      console.log(`✅ ${orders.length} orders created\n`);

      // Seed contents
      console.log('📝 Seeding contents...');
      const contents = [
        {
          type: 'blog',
          title: 'Guida alla Scelta del Climatizzatore',
          description: 'Come scegliere il climatizzatore perfetto per le tue esigenze',
          content: '<h2>Introduzione</h2><p>La scelta del climatizzatore dipende da diversi fattori...</p>',
          category: 'Guida all\'Acquisto',
          published: true
        },
        {
          type: 'testimonial',
          title: 'Mario Rossi',
          description: 'Collaboro con AIRKLIM da 5 anni e posso confermare la loro professionalità.',
          category: 'professionista',
          published: true,
          metadata: {
            role: 'Installatore Certificato',
            company: 'ClimaTech Solutions',
            rating: 5,
            product: 'Panasonic Etherea Z35',
            location: 'Palermo'
          }
        }
      ];

      for (const content of contents) {
        await client.query(
          `INSERT INTO contents (type, title, description, content, category, published, metadata)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [content.type, content.title, content.description, content.content,
           content.category, content.published, JSON.stringify(content.metadata)]
        );
      }
      console.log(`✅ ${contents.length} contents created\n`);

      // Seed audit logs
      console.log('📋 Seeding audit logs...');
      const auditLogs = [
        {
          user_email: 'admin@example.com',
          action: 'login',
          resource: 'authentication',
          details: { success: true },
          ip_address: '192.168.1.100',
          severity: 'info'
        },
        {
          user_email: 'user@example.com',
          action: 'create',
          resource: 'order',
          resource_id: 'ORD-2026-001',
          details: { total: 1190.00 },
          ip_address: '192.168.1.101',
          severity: 'info'
        }
      ];

      for (const log of auditLogs) {
        await client.query(
          `INSERT INTO audit_logs (user_email, action, resource, resource_id, details, ip_address, severity)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [log.user_email, log.action, log.resource, log.resource_id,
           JSON.stringify(log.details), log.ip_address, log.severity]
        );
      }
      console.log(`✅ ${auditLogs.length} audit logs created\n`);

      console.log('🎉 Database seed completed successfully!\n');
      console.log('📊 Summary:');
      console.log('   - Users: 3');
      console.log('   - Products: 3');
      console.log('   - Orders: 2');
      console.log('   - Contents: 2');
      console.log('   - Audit Logs: 2\n');
      console.log('🔐 Test Credentials:');
      console.log('   Admin: admin@example.com / Admin@123!');
      console.log('   Pro: professionist@example.com / Pro@123!');
      console.log('   User: user@example.com / User@123!\n');

    } finally {
      client.release();
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
