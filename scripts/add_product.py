#!/usr/bin/env python3
import os
import re
import json
import urllib.request
import urllib.error

DATA_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'projects-data.js')

def fetch_github_repo(repo_url):
    """
    Fetches repository details using the GitHub API.
    repo_url can be like 'https://github.com/owner/repo' or 'owner/repo'
    """
    # Clean repo url to get 'owner/repo'
    cleaned = repo_url.replace("https://github.com/", "").replace("http://github.com/", "")
    parts = [p for p in cleaned.split('/') if p]
    if len(parts) < 2:
        print(f"[-] Invalid GitHub repository format: {repo_url}")
        return None
    
    repo_path = f"{parts[0]}/{parts[1]}"
    api_url = f"https://api.github.com/repos/{repo_path}"
    
    print(f"[*] Fetching metadata for {repo_path} from GitHub API...")
    req = urllib.request.Request(
        api_url, 
        headers={"User-Agent": "Python-urllib-VictorBaezM-Portfolio-Builder"}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            return {
                "title": data.get("name", ""),
                "description": data.get("description", ""),
                "link": data.get("html_url", ""),
                "githubRepo": repo_path,
                "tags": data.get("topics", []),
                "status": "Completed"
            }
    except urllib.error.HTTPError as e:
        print(f"[-] GitHub API error ({e.code}): {e.reason}")
    except Exception as e:
        print(f"[-] Failed to fetch from GitHub: {e}")
    return None

def main():
    print("=" * 60)
    print("           Project Showcase CLI Helper Tool")
    print("=" * 60)
    
    project = {
        "id": "",
        "title": "",
        "description": "",
        "link": "",
        "githubRepo": "",
        "video": "",
        "image": "",
        "tags": [],
        "status": "Completed"
    }
    
    # 1. Ask for GitHub URL to auto-fill
    github_input = input("Enter GitHub repository URL/path (optional, e.g. VictorBaezM/repo): ").strip()
    if github_input:
        fetched = fetch_github_repo(github_input)
        if fetched:
            print("[+] Successfully fetched repo metadata!")
            project.update(fetched)
    
    # 2. Refine / Ask for input
    project["title"] = input(f"Project Title [{project['title']}]: ").strip() or project["title"]
    
    # ID is derived from title if empty
    default_id = re.sub(r'[^a-z0-9\-]', '', project["title"].lower().replace(' ', '-'))
    project["id"] = input(f"Unique Card ID [{default_id}]: ").strip() or default_id
    
    project["description"] = input(f"Project Description [{project['description']}]: ").strip() or project["description"]
    project["link"] = input(f"Project Link / Website [{project['link']}]: ").strip() or project["link"]
    project["githubRepo"] = input(f"GitHub Repo Path (owner/repo) [{project['githubRepo']}]: ").strip() or project["githubRepo"]
    
    is_private_input = input("Is this repository private? (y/n) [n]: ").strip().lower()
    if is_private_input in ["y", "yes"]:
        project["isPrivate"] = True

    project["video"] = input("Video File Path (optional, e.g. videos/trailer.mp4): ").strip()
    project["image"] = input("Image File/Thumbnail Path (optional, e.g. images/pic.jpg): ").strip()
    
    status_choices = ["Completed", "Live", "In Progress"]
    print("\nSelect Project Status:")
    for idx, choice in enumerate(status_choices, 1):
        print(f"  {idx}. {choice}")
    status_select = input(f"Select Status (1-3) [1]: ").strip()
    if status_select in ["1", "2", "3"]:
        project["status"] = status_choices[int(status_select) - 1]
    
    tags_input = input(f"Tags (comma separated, e.g. React, C#) [{', '.join(project['tags'])}]: ").strip()
    if tags_input:
        project["tags"] = [t.strip() for t in tags_input.split(",") if t.strip()]
    
    # Clean up empty optional fields
    for field in ["video", "image", "githubRepo"]:
        if not project[field]:
            project.pop(field, None)
            
    # 3. Read and update projects-data.js
    if not os.path.exists(DATA_FILE_PATH):
        print(f"[-] Data file not found at {DATA_FILE_PATH}")
        return
        
    print(f"[*] Reading existing projects from {DATA_FILE_PATH}...")
    try:
        with open(DATA_FILE_PATH, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Regex search to extract the JS array content inside window.PRODUCTS_DATA = [ ... ];
        match = re.search(r'window\.PRODUCTS_DATA\s*=\s*(\[.*?\])\s*;', content, re.DOTALL)
        if not match:
            print("[-] Error: Could not locate window.PRODUCTS_DATA array in the javascript file.")
            return
            
        array_str = match.group(1)
        # Parse current projects
        # Since it's a JS file, standard JSON parser might fail if there are trailing commas or single quotes.
        # However, we wrote it as a clean JSON-compatible array structure. Let's load it safely:
        # We can clean up double slash comments and trailing commas to be safe.
        clean_array_str = re.sub(r'//.*$', '', array_str, flags=re.MULTILINE)
        clean_array_str = re.sub(r',\s*\]', ']', clean_array_str) # remove trailing commas before closing bracket
        
        try:
            projects_list = json.loads(clean_array_str)
        except json.JSONDecodeError:
            # Fallback to eval-like safe loading using standard parser or literal eval if needed
            # For simplicity, since we wrote the original file as clean JSON, it should load perfectly.
            print("[-] Failed to parse current projects file. Creating a new array list...")
            projects_list = []
            
        # Append new project
        projects_list.append(project)
        
        # Serialize back to beautiful format
        formatted_json = json.dumps(projects_list, indent=2)
        new_content = f"// Data storage for the website's project / product section.\n" \
                      f"// Easily add, modify, or remove projects here without editing HTML or CSS.\n\n" \
                      f"window.PRODUCTS_DATA = {formatted_json};\n"
                      
        with open(DATA_FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        print(f"[+] Successfully added project '{project['title']}' to {DATA_FILE_PATH}!")
        
    except Exception as e:
        print(f"[-] Error writing to data file: {e}")

if __name__ == "__main__":
    main()
