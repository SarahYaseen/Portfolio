/* -------------------------------------------------------------
 * Static File Server for Sarah Yaseen Portfolio
 * Serves HTML, CSS, JavaScript, and image assets locally
 * Run with: node server.js
 * ------------------------------------------------------------- */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  // Normalize path and decode URL-encoded characters
  const decodedUrl = decodeURIComponent(req.url.split('?')[0]);
  
  // Handle contact form POST submissions
  if (req.method === 'POST' && decodedUrl === '/api/contact') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { name, email, phone, subject, projectType, budget, message } = data;
        
        // Server-side validation
        if (!name || !email || !subject || !message) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Full Name, Email Address, Subject, and Message are required fields.' }));
          return;
        }
        
        // Email format validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Please enter a valid email address.' }));
          return;
        }

        const submission = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          name: name.trim(),
          email: email.trim(),
          phone: (phone || '').trim(),
          subject: subject.trim(),
          projectType: projectType || 'Not Selected',
          budget: budget || 'Not Selected',
          message: message.trim()
        };

        const submissionsFile = path.join(__dirname, 'submissions.json');
        
        fs.readFile(submissionsFile, (err, fileContent) => {
          let submissions = [];
          if (!err) {
            try {
              submissions = JSON.parse(fileContent);
            } catch (parseErr) {
              submissions = [];
            }
          }
          submissions.push(submission);
          
          fs.writeFile(submissionsFile, JSON.stringify(submissions, null, 2), (writeErr) => {
            if (writeErr) {
              console.error('Error saving submission:', writeErr);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Server error saving submission.' }));
            } else {
              console.log('\n--- NEW INQUIRY RECEIVED ---');
              console.log(`From:    ${submission.name} <${submission.email}>`);
              console.log(`Phone:   ${submission.phone || 'N/A'}`);
              console.log(`Subject: ${submission.subject}`);
              console.log(`Service: ${submission.projectType}`);
              console.log(`Budget:  ${submission.budget}`);
              console.log(`Message: ${submission.message}`);
              console.log('----------------------------\n');
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'Inquiry received successfully!' }));
            }
          });
        });
      } catch (e) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON body.' }));
      }
    });
    return;
  }

  let filePath = path.join(__dirname, decodedUrl === '/' ? 'index.html' : decodedUrl);
  
  // Security check: Prevent directory traversal outside the directory
  const relative = path.relative(__dirname, filePath);
  const isSafe = relative && !relative.startsWith('..') && !path.isAbsolute(relative);
  if (decodedUrl !== '/' && !isSafe) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('File Not Found');
      } else {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at: http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server.');
});
