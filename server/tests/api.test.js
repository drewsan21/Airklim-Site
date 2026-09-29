/**
 * Backend API Test Suite
 * Complete testing for all API endpoints
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../server');
const { pool } = require('../config/database');

let adminToken;
let userToken;
let adminId;
let userId;
let productId;
let orderId;

// ===== SETUP & TEARDOWN =====
beforeAll(async () => {
  // Get test user IDs
  const adminResult = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);
  adminId = adminResult.rows[0]?.id;
  
  const userResult = await pool.query('SELECT id FROM users WHERE email = $1', ['user@example.com']);
  userId = userResult.rows[0]?.id;

  // Generate tokens
  adminToken = jwt.sign(
    { id: adminId, email: 'admin@example.com', role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  userToken = jwt.sign(
    { id: userId, email: 'user@example.com', role: 'privato' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Get test product
  const productResult = await pool.query('SELECT id FROM products LIMIT 1');
  productId = productResult.rows[0]?.id;
});

afterAll(async () => {
  await pool.end();
});

// ===== AUTH TESTS =====
describe('Authentication API', () => {
  describe('POST /api/auth/login', () => {
    test('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin@123!'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe('admin@example.com');
    });

    test('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'WrongPassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });

    test('should fail with invalid email format', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Admin@123!'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    test('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/register', () => {
    test('should register new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'NewUser@123!',
          name: 'New',
          surname: 'User',
          role: 'privato'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('newuser@example.com');
    });

    test('should fail with weak password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'weak',
          name: 'Test',
          surname: 'User'
        });

      expect(res.statusCode).toBe(400);
    });

    test('should fail with duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'admin@example.com',
          password: 'Admin@123!',
          name: 'Test',
          surname: 'User'
        });

      expect(res.statusCode).toBe(409);
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

// ===== USERS TESTS =====
describe('Users API', () => {
  describe('GET /api/users', () => {
    test('should get all users (admin only)', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter users by role', async () => {
      const res = await request(app)
        .get('/api/users?role=professionista')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(u => u.role === 'professionista')).toBe(true);
    });

    test('should fail without authentication', async () => {
      const res = await request(app)
        .get('/api/users');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    test('should get user by ID', async () => {
      const res = await request(app)
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.id).toBe(userId);
    });

    test('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    test('should update user', async () => {
      const res = await request(app)
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated',
          surname: 'Name'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.name).toBe('Updated');
    });
  });
});

// ===== PRODUCTS TESTS =====
describe('Products API', () => {
  describe('GET /api/products', () => {
    test('should get all products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter products by brand', async () => {
      const res = await request(app)
        .get('/api/products?brand=Panasonic');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(p => p.brand === 'Panasonic')).toBe(true);
    });

    test('should search products', async () => {
      const res = await request(app)
        .get('/api/products?search=Etherea');

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/products', () => {
    test('should create product (admin only)', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Product',
          brand: 'Test Brand',
          category: 'Test Category',
          price: 999.99,
          stock: 10
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).toBe('Test Product');
    });

    test('should fail without admin role', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Product',
          brand: 'Test Brand',
          category: 'Test Category',
          price: 999.99
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('PUT /api/products/:id', () => {
    test('should update product', async () => {
      const res = await request(app)
        .put(`/api/products/${productId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          price: 1299.99,
          stock: 20
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.price).toBe(1299.99);
    });
  });
});

// ===== ORDERS TESTS =====
describe('Orders API', () => {
  describe('POST /api/orders', () => {
    test('should create order', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [
            { productId, quantity: 1 }
          ],
          shippingAddress: {
            street: 'Via Test 1',
            city: 'Palermo',
            zip: '90100',
            country: 'IT'
          }
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.status).toBe('pending');
      orderId = res.body.data.id;
    });

    test('should fail with empty items', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          items: [],
          shippingAddress: {
            street: 'Via Test 1',
            city: 'Palermo'
          }
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/orders', () => {
    test('should get user orders', async () => {
      const res = await request(app)
        .get('/api/orders')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    test('should filter orders by status', async () => {
      const res = await request(app)
        .get('/api/orders?status=pending')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.every(o => o.status === 'pending')).toBe(true);
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    test('should update order status (admin only)', async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ status: 'confirmed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.status).toBe('confirmed');
    });

    test('should fail without admin role', async () => {
      const res = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'shipped' });

      expect(res.statusCode).toBe(403);
    });
  });
});

// ===== ANALYTICS TESTS =====
describe('Analytics API', () => {
  describe('GET /api/analytics', () => {
    test('should get analytics (admin only)', async () => {
      const res = await request(app)
        .get('/api/analytics')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.users).toBeDefined();
      expect(res.body.data.orders).toBeDefined();
      expect(res.body.data.products).toBeDefined();
    });

    test('should fail without admin role', async () => {
      const res = await request(app)
        .get('/api/analytics')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
    });
  });
});

// ===== SECURITY TESTS =====
describe('Security', () => {
  describe('Rate Limiting', () => {
    test('should limit login attempts', async () => {
      const promises = Array(10).fill().map(() => 
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'admin@example.com',
            password: 'WrongPassword'
          })
      );

      const results = await Promise.all(promises);
      const limitedRequests = results.filter(r => r.statusCode === 429);
      
      expect(limitedRequests.length).toBeGreaterThan(0);
    });
  });

  describe('SQL Injection Protection', () => {
    test('should block SQL injection in login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: "admin@example.com' OR '1'='1",
          password: 'Admin@123!'
        });

      expect(res.statusCode).toBe(400);
    });

    test('should block SQL injection in search', async () => {
      const res = await request(app)
        .get("/api/products?search='; DROP TABLE products; --");

      expect(res.statusCode).toBe(400);
    });
  });

  describe('XSS Protection', () => {
    test('should sanitize user input', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'xss@example.com',
          password: 'XssTest@123!',
          name: '<script>alert("xss")</script>',
          surname: 'User'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.name).not.toContain('<script>');
    });
  });

  describe('Authentication', () => {
    test('should reject invalid JWT', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.statusCode).toBe(401);
    });

    test('should reject expired JWT', async () => {
      const expiredToken = jwt.sign(
        { id: adminId, email: 'admin@example.com', role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(res.statusCode).toBe(401);
    });
  });
});

// ===== PERFORMANCE TESTS =====
describe('Performance', () => {
  test('should respond within 500ms', async () => {
    const start = Date.now();
    
    await request(app)
      .get('/api/products');
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(500);
  });

  test('should handle concurrent requests', async () => {
    const promises = Array(10).fill().map(() => 
      request(app).get('/api/products')
    );

    const results = await Promise.all(promises);
    expect(results.every(r => r.statusCode === 200)).toBe(true);
  });
});

// ===== HEALTH CHECK =====
describe('Health Check', () => {
  test('should return health status', async () => {
    const res = await request(app)
      .get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});
