import os
import re

components_dir = '/Users/ranveervishalhajari/Desktop/HOF_PROJECT/frontend/src/components'
for file in os.listdir(components_dir):
    if file.endswith('.tsx') and file != 'LexisCoHomepage.tsx':
        with open(os.path.join(components_dir, file), 'r') as f:
            content = f.read()
        
        # fix quote issues from style parsing
        content = content.replace("''FILL' 1'", "\"'FILL' 1\"")
        content = content.replace("''FILL' 0'", "\"'FILL' 0\"")
        content = content.replace("''wght' 300'", "\"'wght' 300\"")
        content = content.replace("''wght' 400'", "\"'wght' 400\"")
        content = content.replace("''wght' 500'", "\"'wght' 500\"")
        content = content.replace("''GRAD' 0'", "\"'GRAD' 0\"")
        content = content.replace("''opsz' 24'", "\"'opsz' 24\"")

        # Fix specific style parsing issues where multiple single quotes collided
        content = re.sub(r"''([^']*)'([^']*)'", r"\"'\1'\2\"", content)
        
        # remove remaining HTML comments just in case
        content = content.replace("<!--", "{/*").replace("-->", "*/}")

        with open(os.path.join(components_dir, file), 'w') as f:
            f.write(content)
