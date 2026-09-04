const fs = require('fs');
const path = require('path');

const snippetsDir = path.join(__dirname, 'snippets');
const sectionsDir = path.join(__dirname, 'sections');

// Files to process:
const filesToProcess = fs.readdirSync(snippetsDir)
  .filter(f => f.endsWith('.liquid') && !f.startsWith('global-'))
  .map(f => path.join(snippetsDir, f));

// Add sections if needed
if (fs.existsSync(path.join(sectionsDir, 'pag-portada.liquid'))) {
  filesToProcess.push(path.join(sectionsDir, 'pag-portada.liquid'));
}

let headerContent = '';
let footerContent = '';

let hasExtracted = false;

for (const file of filesToProcess) {
  let content = fs.readFileSync(file, 'utf8');

  // Regex to extract header (from top-banner to </header>)
  const headerRegex = /(<div class="top-banner">[\s\S]*?<\/header>)/;
  // Regex to extract footer (from <footer class="site-footer"> to end of file, or before {% schema %})
  const footerRegex = /(<footer class="site-footer">[\s\S]*?)(?={%\s*schema\s*%}|$)/;

  const headerMatch = content.match(headerRegex);
  const footerMatch = content.match(footerRegex);

  if (headerMatch && footerMatch) {
    if (!hasExtracted) {
      headerContent = headerMatch[1];
      footerContent = footerMatch[1];
      hasExtracted = true;
    }

    // Remove them from the original file
    content = content.replace(headerMatch[1], '');
    content = content.replace(footerMatch[1], '');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Refactored: ${file}`);
  } else {
    console.log(`Skipped (no match): ${file}`);
  }
}

if (hasExtracted) {
  fs.writeFileSync(path.join(snippetsDir, 'global-header.liquid'), headerContent, 'utf8');
  fs.writeFileSync(path.join(snippetsDir, 'global-footer.liquid'), footerContent, 'utf8');
  console.log('Created global-header.liquid and global-footer.liquid');
}

// Now update layout/theme.liquid
const themeFile = path.join(__dirname, 'layout', 'theme.liquid');
let themeContent = fs.readFileSync(themeFile, 'utf8');
themeContent = themeContent.replace(/{{ content_for_layout }}/, "{% render 'global-header' %}\n{{ content_for_layout }}\n{% render 'global-footer' %}");
fs.writeFileSync(themeFile, themeContent, 'utf8');
console.log('Updated theme.liquid');
