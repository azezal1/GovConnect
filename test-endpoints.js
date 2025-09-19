// 🧪 GovConnect API Testing Script
// Run this to verify all endpoints are working

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test data
const testCitizen = {
  name: 'Test Citizen',
  email: 'citizen@test.com',
  mobile: '9876543210',
  password: 'password123',
  aadhaar: '123456789012'
};

const testGovernment = {
  name: 'Test Official',
  email: 'official@test.com',
  mobile: '9876543211',
  password: 'password123'
};

async function runTests() {
  console.log('🚀 Starting GovConnect API Tests...\n');

  try {
    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...');
    const health = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health Check:', health.data.message);

    // Test 2: Citizen Registration
    console.log('\n2️⃣ Testing Citizen Registration...');
    try {
      const citizenReg = await axios.post(`${BASE_URL}/api/auth/register/citizen`, testCitizen);
      console.log('✅ Citizen Registration:', citizenReg.data.message);
      authToken = citizenReg.data.token;
    } catch (error) {
      if (error.response?.data?.error?.includes('already exists')) {
        console.log('ℹ️ Citizen already exists, trying login...');
        const login = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: testCitizen.email,
          password: testCitizen.password
        });
        console.log('✅ Citizen Login:', login.data.message);
        authToken = login.data.token;
      } else {
        throw error;
      }
    }

    // Test 3: Protected Route (Dashboard)
    console.log('\n3️⃣ Testing Protected Route (Dashboard)...');
    const dashboard = await axios.get(`${BASE_URL}/api/citizen/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Dashboard Data:', {
      totalComplaints: dashboard.data.stats.totalComplaints,
      totalPoints: dashboard.data.stats.totalPoints
    });

    // Test 4: Government Registration
    console.log('\n4️⃣ Testing Government Registration...');
    try {
      const govReg = await axios.post(`${BASE_URL}/api/auth/register/government`, testGovernment);
      console.log('✅ Government Registration:', govReg.data.message);
    } catch (error) {
      if (error.response?.data?.error?.includes('already exists')) {
        console.log('ℹ️ Government official already exists');
      } else {
        throw error;
      }
    }

    // Test 5: Token Verification
    console.log('\n5️⃣ Testing Token Verification...');
    const verify = await axios.get(`${BASE_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Token Verification:', verify.data.user.name);

    console.log('\n🎉 All API Tests Passed! Backend is fully functional.');

  } catch (error) {
    console.error('❌ Test Failed:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run tests if called directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests };
