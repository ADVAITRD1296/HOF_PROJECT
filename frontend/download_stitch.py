import json
import os
import urllib.request

input_file = "/Users/ranveervishalhajari/.gemini/antigravity/brain/76632be9-9f89-4cca-8914-4fdfb923a3b3/.system_generated/steps/14/output.txt"
output_dir = "/Users/ranveervishalhajari/Desktop/HOF_PROJECT/frontend/stitch_assets"

screen_ids = [
    "06d29bc2052d494d95ebbc837f15629b", "78decbf5d8e7426ba6437f077c624ff4",
    "2724cc87518143cebe1dba550be72f54", "17131310604625536185",
    "17177007943371417975", "8b91215b7b204021977d0e0f0539ddd6",
    "16696002629150962399", "6142177129888490625",
    "20bff06c2861415e8845860f1a3a49c1", "1741686452837671892",
    "16968605266769690852", "592bd82aad844ecb880adb60408fbc27",
    "17156470808005661261", "178b697c3cff45ef94bfff7810964587",
    "15197562151491642104"
]

os.makedirs(output_dir, exist_ok=True)

with open(input_file, 'r') as f:
    data = json.load(f)

for screen in data.get('screens', []):
    screen_id = screen['name'].split('/')[-1]
    title = screen.get('title', screen_id).replace(" ", "_").replace("/", "-")
    
    if screen_id in screen_ids:
        print(f"Processing {title} ({screen_id})...")
        
        # Download HTML
        if 'htmlCode' in screen and 'downloadUrl' in screen['htmlCode']:
            html_url = screen['htmlCode']['downloadUrl']
            try:
                urllib.request.urlretrieve(html_url, os.path.join(output_dir, f"{title}.html"))
                print(f"  Downloaded HTML")
            except Exception as e:
                print(f"  Failed HTML: {e}")
        
        # Download Screenshot
        if 'screenshot' in screen and 'downloadUrl' in screen['screenshot']:
            img_url = screen['screenshot']['downloadUrl']
            try:
                urllib.request.urlretrieve(img_url, os.path.join(output_dir, f"{title}.png"))
                print(f"  Downloaded Image")
            except Exception as e:
                print(f"  Failed Image: {e}")
