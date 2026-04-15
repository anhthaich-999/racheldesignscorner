// Node.js script to parse CSV and create products.json
const fs = require('fs');
const path = require('path');

const csvPath = String.raw`C:\Users\No One\.openclaw\media\outbound\21fd0dd9-d1bf-4c35-ba76-8ce3d7a645ed.csv`;
const outputPath = path.join(__dirname, 'data', 'products.json');

// Simple CSV parser that handles quoted fields with newlines
function parseCSV(text) {
  const rows = [];
  let i = 0;
  
  // Parse header
  const headerResult = parseRow(text, i);
  const headers = headerResult.fields;
  i = headerResult.nextIndex;
  
  while (i < text.length) {
    // Skip empty lines
    if (text[i] === '\n' || text[i] === '\r') {
      i++;
      continue;
    }
    const result = parseRow(text, i);
    if (result.fields.length > 0) {
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = result.fields[idx] || '';
      });
      rows.push(row);
    }
    i = result.nextIndex;
  }
  
  return rows;
}

function parseRow(text, start) {
  const fields = [];
  let i = start;
  
  while (i < text.length) {
    if (text[i] === '"') {
      // Quoted field
      i++; // skip opening quote
      let field = '';
      while (i < text.length) {
        if (text[i] === '"') {
          if (i + 1 < text.length && text[i + 1] === '"') {
            field += '"';
            i += 2;
          } else {
            i++; // skip closing quote
            break;
          }
        } else {
          field += text[i];
          i++;
        }
      }
      fields.push(field.trim());
      // Skip comma or end of line
      if (i < text.length && text[i] === ',') i++;
      else if (i < text.length && (text[i] === '\n' || text[i] === '\r')) {
        if (text[i] === '\r' && i + 1 < text.length && text[i + 1] === '\n') i += 2;
        else i++;
        return { fields, nextIndex: i };
      }
    } else if (text[i] === '\n' || text[i] === '\r') {
      if (text[i] === '\r' && i + 1 < text.length && text[i + 1] === '\n') i += 2;
      else i++;
      return { fields, nextIndex: i };
    } else {
      // Unquoted field
      let field = '';
      while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
        field += text[i];
        i++;
      }
      fields.push(field.trim());
      if (i < text.length && text[i] === ',') i++;
      else if (i < text.length && (text[i] === '\n' || text[i] === '\r')) {
        if (text[i] === '\r' && i + 1 < text.length && text[i + 1] === '\n') i += 2;
        else i++;
        return { fields, nextIndex: i };
      }
    }
  }
  
  return { fields, nextIndex: i };
}

// Categorize products
function categorize(title, tags) {
  const t = (title + ' ' + tags).toLowerCase();
  
  if (/\bcoach\b/.test(t) || /\bsport\b/.test(t) || /\bbaseball\b/.test(t) || /\bbasketball\b/.test(t) || /\bfootball\b/.test(t) || /\bsoccer\b/.test(t) || /\bvolleyball\b/.test(t) || /\bhockey\b/.test(t) || /\bswim\b/.test(t) || /\btennis\b/.test(t) || /\btrack\b/.test(t) || /\bcheer\b/.test(t) || /\bwrestl/.test(t) || /\blacrosse\b/.test(t) || /\bgymnast/.test(t) || /\bsoftball\b/.test(t)) {
    return 'Coach & Sports';
  }
  if (/clipboard/.test(t)) return 'Clipboards';
  if (/ornament/.test(t) || /christmas/.test(t)) return 'Christmas & Ornaments';
  if (/christian/.test(t) || /\bcross\b/.test(t) || /bible/.test(t) || /faith/.test(t) || /psalm/.test(t) || /prayer/.test(t) || /scripture/.test(t) || /church/.test(t) || /baptism/.test(t) || /communion/.test(t) || /religious/.test(t)) return 'Christian & Cross';
  if (/\bpet\b/.test(t) || /memorial/.test(t) || /\bdog\b/.test(t) || /\bcat\b/.test(t) || /rainbow bridge/.test(t)) return 'Pet Memorial';
  if (/teacher/.test(t)) return 'Teacher Gifts';
  if (/night\s*light/.test(t) || /\blamp\b/.test(t) || /\bled\b/.test(t) || /light\s*box/.test(t)) return 'Night Lights & Lamps';
  if (/wedding/.test(t) || /couple/.test(t) || /bride/.test(t) || /groom/.test(t) || /anniversary/.test(t) || /engagement/.test(t)) return 'Wedding & Couples';
  
  return 'Other';
}

// Main
const csvText = fs.readFileSync(csvPath, 'utf-8');
const rows = parseCSV(csvText);

console.log(`Parsed ${rows.length} rows`);

const products = rows.map((row, idx) => {
  const images = [];
  for (let i = 1; i <= 10; i++) {
    const key = `IMAGE${i}`;
    if (row[key] && row[key].trim()) {
      images.push(row[key].trim());
    }
  }
  
  return {
    id: idx + 1,
    title: row.TITLE || '',
    description: row.DESCRIPTION || '',
    price: parseFloat(row.PRICE) || 0,
    currency: row.CURRENCY_CODE || 'USD',
    images: images,
    tags: row.TAGS || '',
    sku: row.SKU || '',
    category: categorize(row.TITLE || '', row.TAGS || '')
  };
}).filter(p => p.title); // Remove any empty rows

// Stats
const categories = {};
products.forEach(p => {
  categories[p.category] = (categories[p.category] || 0) + 1;
});
console.log('Categories:', JSON.stringify(categories, null, 2));
console.log(`Total products: ${products.length}`);

// Write JSON
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
console.log(`Written to ${outputPath}`);
