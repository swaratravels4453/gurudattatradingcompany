/**
 * ============================================================
 * GURUDATTA TRADING CO. — Google Apps Script Backend
 * ============================================================
 * DEPLOYMENT STEPS:
 *   1. Open https://script.google.com → New Project → paste this file
 *   2. Click "Deploy" → "New Deployment"
 *   3. Type: Web App | Execute as: Me | Who has access: Anyone
 *   4. Deploy → Authorise → Copy the Web App URL
 *   5. That URL is already set in script.js (SCRIPT_URL constant)
 *
 * SHEETS CREATED AUTOMATICALLY:
 *   Sheet 1 → "CalculatorEnquiries"  (full spring report)
 *   Sheet 2 → "ContactMessages"      (contact form)
 * ============================================================
 */

/* ============================= */
/* ===== SHEET NAME CONFIG ===== */
/* ============================= */
const SHEET_CALC    = 'CalculatorEnquiries';
const SHEET_CONTACT = 'ContactMessages';


/* ============================= */
/* ===== doPost — MAIN ENTRY ===== */
/* ============================= */
function doPost(e) {
  try {
    const data   = JSON.parse(e.postData.contents);
    const action = data.action || '';

    if (action === 'calculator') return handleCalculator(data);
    if (action === 'contact')    return handleContact(data);

    return jsonRes({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return jsonRes({ status: 'error', message: err.toString() });
  }
}

/* ============================= */
/* ===== doGet — Health check ===== */
/* ============================= */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Gurudatta Trading Script is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}


/* ============================================================ */
/* ===== HANDLER 1 — Calculator Enquiry (full spring report) ===== */
/* ============================================================ */
function handleCalculator(d) {
  const headers = [
    /* ── Timestamp & Customer ── */
    'Timestamp',
    'Customer Name',
    'Mobile Number',
    /* ── Spring Configuration ── */
    'Spring Type',
    'Unit System',
    'Material',
    'End Type',
    'Wind Direction',
    /* ── Input Dimensions ── */
    'Wire Diameter (input)',
    'Outer Diameter (input)',
    'Free Length (input)',
    'Total Coils (input)',
    /* ── Calculated Results ── */
    'Spring Rate (k)',
    'Solid Height (Ls)',
    'Max Safe Travel',
    'Max Safe Load',
    'Spring Index (C)',
    'Wahl Correction Factor (Kw)',
    'Max Shear Stress',
    'Total Wire Length',
    'Estimated Weight',
  ];

  const sheet = getOrCreate(SHEET_CALC, headers);

  sheet.appendRow([
    d.timestamp       || new Date().toLocaleString('en-IN'),
    d.name            || '',
    d.mobile          || '',
    d.springType      || '',
    d.unit            || '',
    d.material        || '',
    d.endType         || '',
    d.windDir         || '',
    d.wireDiameter    || '',
    d.outerDiameter   || '',
    d.freeLength      || '',
    d.totalCoils      || '',
    d.springRate      || '',
    d.solidHeight     || '',
    d.maxTravel       || '',
    d.maxLoad         || '',
    d.springIndex     || '',
    d.wahlFactor      || '',
    d.maxShearStress  || '',
    d.totalWireLength || '',
    d.estimatedWeight || '',
  ]);

  return jsonRes({ status: 'success', message: 'Calculator data saved.' });
}


/* ======================================================= */
/* ===== HANDLER 2 — Contact Form Submission ===== */
/* ======================================================= */
function handleContact(d) {
  const headers = [
    'Timestamp',
    'Name',
    'Email',
    'Message',
  ];

  const sheet = getOrCreate(SHEET_CONTACT, headers);

  sheet.appendRow([
    d.timestamp || new Date().toLocaleString('en-IN'),
    d.name      || '',
    d.email     || '',
    d.message   || '',
  ]);

  return jsonRes({ status: 'success', message: 'Contact message saved.' });
}


/* ======================================================= */
/* ===== UTILITY — Get or create sheet with styled headers ===== */
/* ======================================================= */
function getOrCreate(sheetName, headers) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    /* Style the header row (dark teal + white bold text) */
    const hRow = sheet.getRange(1, 1, 1, headers.length);
    hRow.setBackground('#0d5c7a');
    hRow.setFontColor('#ffffff');
    hRow.setFontWeight('bold');
    hRow.setFontSize(10);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }

  return sheet;
}


/* ======================================================= */
/* ===== UTILITY — Build JSON ContentService response ===== */
/* ======================================================= */
function jsonRes(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
