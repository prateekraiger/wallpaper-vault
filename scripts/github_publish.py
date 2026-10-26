import os
import sys
import ctypes
import ctypes.wintypes
import urllib.request
import urllib.error
import json
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

class CREDENTIAL(ctypes.Structure):
    _fields_ = [
        ('Flags', ctypes.wintypes.DWORD),
        ('Type', ctypes.wintypes.DWORD),
        ('TargetName', ctypes.wintypes.LPWSTR),
        ('Comment', ctypes.wintypes.LPWSTR),
        ('LastWritten', ctypes.wintypes.FILETIME),
        ('CredentialBlobSize', ctypes.wintypes.DWORD),
        ('CredentialBlob', ctypes.POINTER(ctypes.c_byte)),
        ('Persist', ctypes.wintypes.DWORD),
        ('AttributeCount', ctypes.wintypes.DWORD),
        ('Attributes', ctypes.c_void_p),
        ('TargetAlias', ctypes.wintypes.LPWSTR),
        ('UserName', ctypes.wintypes.LPWSTR),
    ]

Advapi32 = ctypes.windll.Advapi32
CredReadW = Advapi32.CredReadW
CredReadW.argtypes = [ctypes.wintypes.LPWSTR, ctypes.wintypes.DWORD, ctypes.wintypes.DWORD, ctypes.POINTER(ctypes.POINTER(CREDENTIAL))]
CredReadW.restype = ctypes.wintypes.BOOL
CredFree = Advapi32.CredFree
CredFree.argtypes = [ctypes.c_void_p]

def get_token():
    for target in ['git:https://github.com', 'GitHub - https://api.github.com/prateekraiger']:
        pcred = ctypes.POINTER(CREDENTIAL)()
        if CredReadW(target, 1, 0, ctypes.byref(pcred)):
            cred = pcred.contents
            blob = ctypes.string_at(cred.CredentialBlob, cred.CredentialBlobSize)
            token = blob.decode('utf-16le', errors='ignore')
            CredFree(pcred)
            if token:
                return token
    return None

def main():
    token = get_token()
    if not token:
        print("ERROR: Could not retrieve GitHub token from Windows Credential Manager.")
        sys.exit(1)
        
    repo_name = "wallpaper-vault"
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "WallpaperVaultPublisher"
    }
    
    # 1. Check if repo exists
    print(f"Checking if repository 'prateekraiger/{repo_name}' exists on GitHub...")
    check_url = f"https://api.github.com/repos/prateekraiger/{repo_name}"
    check_req = urllib.request.Request(check_url, headers=headers)
    
    repo_exists = False
    try:
        with urllib.request.urlopen(check_req) as resp:
            data = json.loads(resp.read().decode())
            print(f"Repository already exists: {data.get('html_url')}")
            repo_exists = True
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print("Repository does not exist yet. Creating repository...")
        else:
            print(f"Check error: {e}")
            
    # 2. Create if not exists
    if not repo_exists:
        create_url = "https://api.github.com/user/repos"
        payload = json.dumps({
            "name": repo_name,
            "description": "Curated 4,800+ 4K Wallpapers categorized for Desktop & Mobile with Next.js web application",
            "private": False,
            "has_issues": True,
            "has_projects": True,
            "has_wiki": False
        }).encode("utf-8")
        
        create_req = urllib.request.Request(create_url, data=payload, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(create_req) as resp:
                data = json.loads(resp.read().decode())
                print(f"Repository successfully created: {data.get('html_url')}")
        except urllib.error.HTTPError as e:
            print(f"Create error {e.code}: {e.read().decode()}")
            sys.exit(1)
            
    # 3. Configure git remote
    remote_url = f"https://{token}@github.com/prateekraiger/{repo_name}.git"
    public_remote_url = f"https://github.com/prateekraiger/{repo_name}.git"
    
    print("\nSetting git remote...")
    subprocess.run(["git", "remote", "remove", "origin"], stderr=subprocess.DEVNULL)
    res = subprocess.run(["git", "remote", "add", "origin", remote_url], capture_output=True, text=True)
    if res.returncode != 0:
        print(f"Remote error: {res.stderr}")
        
    # 4. Push to GitHub
    print("Pushing commits to GitHub main branch...")
    push_res = subprocess.run(["git", "push", "-u", "origin", "main"], capture_output=True, text=True)
    print(push_res.stdout)
    if push_res.returncode == 0 or "Everything up-to-date" in push_res.stderr:
        print(f"SUCCESS: Pushed to GitHub successfully! Remote: {public_remote_url}")
    else:
        print(f"Push stderr: {push_res.stderr}")
        
    # Sanitize remote URL to remove inline token for security
    subprocess.run(["git", "remote", "set-url", "origin", public_remote_url])
    print("Git remote safely updated to public URL.")

if __name__ == "__main__":
    main()
