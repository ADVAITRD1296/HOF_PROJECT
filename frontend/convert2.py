import os
import re

html_dir = '/Users/ranveervishalhajari/Desktop/HOF_PROJECT/frontend/stitch_assets'
components_dir = '/Users/ranveervishalhajari/Desktop/HOF_PROJECT/frontend/src/components'

def style_to_react(match):
    style_str = match.group(1)
    props = []
    for prop in style_str.split(';'):
        if ':' not in prop:
            continue
        key, value = prop.split(':', 1)
        key = key.strip()
        value = value.strip()
        key_parts = key.split('-')
        key = key_parts[0] + ''.join(part.capitalize() for part in key_parts[1:])
        
        # Escape double quotes inside value
        value = value.replace('"', '\\"')
        props.append(f'"{key}": "{value}"')
    react_style = '{' + ', '.join(props) + '}'
    return f'style={{{react_style}}}'

def convert(filename):
    with open(os.path.join(html_dir, filename), 'r') as f:
        html = f.read()
    
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.IGNORECASE | re.DOTALL)
    if body_match:
        html = body_match.group(1)

    html = html.replace('class="', 'className="')
    html = html.replace('for="', 'htmlFor="')
    html = html.replace('<!--', '{/*')
    html = html.replace('-->', '*/}')
    
    html = re.sub(r'style="([^"]*)"', style_to_react, html)
    html = re.sub(r'(<(img|input|hr|br)[^>]*?)(?<!/)>', r'\1 />', html)

    attrs_to_camel = [
        'stroke-linecap', 'stroke-linejoin', 'stroke-width', 'fill-rule', 
        'clip-rule', 'clip-path', 'stroke-dasharray', 'stroke-dashoffset'
    ]
    for attr in attrs_to_camel:
        camel = attr.split('-')[0] + ''.join(p.capitalize() for p in attr.split('-')[1:])
        html = html.replace(f'{attr}="', f'{camel}="')

    html = html.replace('viewbox=', 'viewBox=')
    html = html.replace('xmlns:xlink=', 'xmlnsXlink=')
    
    name = filename.replace('.html', '').replace('-', '_').replace(' ', '_')
    name = ''.join(word.capitalize() for word in name.split('_') if word)
    
    if name == 'LexisCoHomepageWithLiquidGlassButtons': return
    if 'Mentor' in name: name = 'LexisCoAdvancedAIMentorInterface'
    if 'Profile' in name: name = 'LexisCoProfile'
    if 'Subscription' in name: name = 'LexisCoSubscription'
    if 'Sign_In' in name or 'SignIn' in name: name = 'LexisCoSignIn'
    if 'Create' in name: name = 'LexisCoCreateAccount'
    if 'Feedback' in name: name = 'LexisCoFeedbackForm'

    component = f"""
import React from 'react';
import {{ Link }} from 'react-router-dom';

export const {name}: React.FC = () => {{
  return (
    <>
{html}
    </>
  );
}};
"""
    out_path = os.path.join(components_dir, f'{name}.tsx')
    with open(out_path, 'w') as f:
        f.write(component.strip() + '\n')
    print(f'Created {name}.tsx')

for file in os.listdir(html_dir):
    if file.endswith('.html'):
        convert(file)
