/**
 * Automated Verification & Testing Suite for ArchConnect
 * Tests Authentication, Designer Profiles, Portfolios, Inquiries, Reviews, and Admin Modules.
 */

const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting ArchConnect End-to-End Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'online', 'API Health Check returns 200 online');

    // 2. Public Designer Directory & Filtering
    const designers = await request('GET', '/designers');
    assert(designers.status === 200 && Array.isArray(designers.data.designers), 'GET /api/designers returns designers list');
    assert(designers.data.designers.length >= 5, 'Seeded database contains at least 5 realistic architecture studios');

    // Filter by city
    const filterBangalore = await request('GET', '/designers?location=Bangalore');
    assert(filterBangalore.status === 200 && filterBangalore.data.designers.some(d => d.location.includes('Bangalore')), 'Filter by city (Bangalore) returns matching studios');

    // Filter by specialization
    const filterResidential = await request('GET', '/designers?specialization=Residential');
    assert(filterResidential.status === 200 && filterResidential.data.designers.length > 0, 'Filter by specialization (Residential) returns matching studios');

    // Single Designer Profile Detail
    const sampleDesigner = designers.data.designers[0];
    const singleDesigner = await request('GET', `/designers/${sampleDesigner.id}`);
    assert(singleDesigner.status === 200 && singleDesigner.data.designer.studioName === sampleDesigner.studioName, `GET /api/designers/:id fetches complete details for ${sampleDesigner.studioName}`);

    // 3. Authentication & Role Logins
    const clientLogin = await request('POST', '/auth/login', {
      email: 'client@architectportal.com',
      password: 'password123'
    });
    assert(clientLogin.status === 200 && clientLogin.data.token && clientLogin.data.user.role === 'CLIENT', 'Client authentication succeeds and returns JWT');
    const clientToken = clientLogin.data.token;

    const designerLogin = await request('POST', '/auth/login', {
      email: 'designer@architectportal.com',
      password: 'password123'
    });
    assert(designerLogin.status === 200 && designerLogin.data.token && designerLogin.data.user.role === 'DESIGNER', 'Designer authentication succeeds and returns JWT');
    const designerToken = designerLogin.data.token;

    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@architectportal.com',
      password: 'password123'
    });
    assert(adminLogin.status === 200 && adminLogin.data.token && adminLogin.data.user.role === 'ADMIN', 'Admin authentication succeeds and returns JWT');
    const adminToken = adminLogin.data.token;

    // 4. Portfolio Management (CRUD by Designer)
    const newProject = await request('POST', '/projects', {
      title: 'Test Eco-Villa at Sakleshpur',
      category: 'Residential Villa',
      style: 'Tropical Modern',
      description: 'Test coffee plantation eco-cottage with rammed earth construction.',
      location: 'Sakleshpur, Karnataka',
      completionYear: '2024',
      areaSqFt: '2,800 sq.ft',
      budgetRange: '₹55 Lakhs',
      thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    }, designerToken);
    assert(newProject.status === 201 && newProject.data.project.id, 'Designer can create a new portfolio project');
    const createdProjectId = newProject.data.project.id;

    // Update project
    const updateProject = await request('PUT', `/projects/${createdProjectId}`, {
      title: 'Updated Eco-Villa at Sakleshpur',
      budgetRange: '₹60 Lakhs'
    }, designerToken);
    assert(updateProject.status === 200 && updateProject.data.project.budgetRange === '₹60 Lakhs', 'Designer can update project specifications');

    // Delete project
    const deleteProject = await request('DELETE', `/projects/${createdProjectId}`, null, designerToken);
    assert(deleteProject.status === 200, 'Designer can delete project from portfolio');

    // 5. Inquiry Lifecycle (Client -> Designer -> Messaging -> Status)
    const newInquiry = await request('POST', '/inquiries', {
      designerId: sampleDesigner.id,
      projectTitle: 'E2E Test Villa Commission',
      projectCategory: 'Residential Villa Construction',
      location: 'Koramangala, Bangalore',
      budgetRange: '₹75 Lakhs - ₹1 Crore',
      targetTimeline: '6 Months',
      scopeDescription: 'Automated test scope for architectural floor plans and 3D elevations.'
    }, clientToken);
    assert(newInquiry.status === 201 && newInquiry.data.inquiry.id, 'Client can submit a new project inquiry to designer');
    const inquiryId = newInquiry.data.inquiry.id;

    // Client fetches my inquiries
    const clientInquiries = await request('GET', '/inquiries/my', null, clientToken);
    assert(clientInquiries.status === 200 && clientInquiries.data.inquiries.some(i => i.id === inquiryId), 'Client dashboard lists submitted inquiry');

    // Add message in thread
    const postMessage = await request('POST', `/inquiries/${inquiryId}/messages`, {
      messageText: 'Hello Ar. Rajesh, can we schedule a site visit this coming Monday?'
    }, clientToken);
    assert(postMessage.status === 201 && postMessage.data.message.id, 'Client can post message in inquiry conversation thread');

    // Designer updates status to UNDER_REVIEW or ACCEPTED
    const updateStatus = await request('PATCH', `/inquiries/${inquiryId}/status`, {
      status: 'UNDER_REVIEW'
    }, designerToken);
    assert(updateStatus.status === 200 && updateStatus.data.inquiry.status === 'UNDER_REVIEW', 'Designer can transition inquiry status to UNDER_REVIEW');

    // 6. Review & Rating Module
    const postReview = await request('POST', '/reviews', {
      designerId: sampleDesigner.id,
      rating: 5,
      reviewTitle: 'Exemplary architectural service',
      comment: 'Very professional handling of municipal approvals and structural drawings.',
      projectCategory: 'Residential Villa'
    }, clientToken);
    assert(postReview.status === 201 && postReview.data.newAverageRating, 'Client can submit verified review and update studio average rating');

    // 7. Admin Console
    const adminStats = await request('GET', '/admin/stats', null, adminToken);
    assert(adminStats.status === 200 && adminStats.data.stats.totalDesigners > 0, 'Admin can fetch system KPIs (total designers, portfolios, conversion rate)');

    const adminUsers = await request('GET', '/admin/users', null, adminToken);
    assert(adminUsers.status === 200 && Array.isArray(adminUsers.data.users), 'Admin can view user governance directory');

    // Admin toggle verification badge
    const toggleVerify = await request('PATCH', `/admin/designers/${sampleDesigner.id}/verify`, null, adminToken);
    assert(toggleVerify.status === 200, 'Admin can toggle Council of Architecture (COA) verification status');

    console.log(`\n========================================`);
    console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed === 0) {
      console.log('🎉 ALL APPLICATION MODULES ARE FULLY VERIFIED AND PASSING!\n');
    }
  } catch (error) {
    console.error('Test execution error:', error);
  }
}

runTests();

