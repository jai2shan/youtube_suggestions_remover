# Create simple placeholder icons for the extension
# These are basic SVG icons that can be used for development

# Icon 16x16 (SVG converted to simple format)
echo '<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect width="16" height="16" fill="#ff0000"/>
  <polygon points="5,4 5,12 11,8" fill="white"/>
</svg>' > icons/icon16.svg

# Icon 32x32
echo '<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#ff0000"/>
  <polygon points="10,8 10,24 22,16" fill="white"/>
</svg>' > icons/icon32.svg

# Icon 48x48
echo '<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <rect width="48" height="48" fill="#ff0000"/>
  <polygon points="15,12 15,36 33,24" fill="white"/>
</svg>' > icons/icon48.svg

# Icon 128x128
echo '<svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" fill="#ff0000"/>
  <polygon points="40,32 40,96 88,64" fill="white"/>
</svg>' > icons/icon128.svg

Write-Host "Icon placeholders created! You should replace these with proper PNG icons for production."
