import re

file_path = r'c:\Users\tejes\Desktop\Cogniva\pages\user-dashboard.html'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Revert navlinks
navlinks_data = [
    ('overview', 'Overview', 'Your daily cognitive snapshot.'),
    ('stack', 'My Stack', 'Manage your customized daily protocols.'),
    ('biometrics', 'Biometrics', 'Sync and analyze physiological metrics.'),
    ('insights', 'Insights', 'Track long-term performance trends.'),
    ('challenges', 'Challenges', 'Join events to maintain consistency.'),
    ('community', 'Community', 'Engage in real-time protocol discussions.'),
    ('settings', 'Settings', 'Manage your profile and preferences.')
]

for section_id, name, desc in navlinks_data:
    pattern = r'<div style="display: flex; flex-direction: column; gap: 2px;"><span style="line-height: 1.2;">' + name + r'</span><span style="font-size: 11px; opacity: 0.7; font-weight: 400; line-height: 1.2;">.*?</span></div>'
    replacement = f'<span>{name}</span>'
    content = re.sub(pattern, replacement, content, flags=re.DOTALL)

# 2. Add Tab Title and Description to EACH tab pane, directly inside the <div id="tab-XZY" class="tab-pane">
# And remove the dynamically changing page header in the topbar.

for section_id, name, desc in navlinks_data:
    # Because my script last time defined tabTitles differently for Overview vs others, let's use a nice title.
    nice_title = {
        'overview': 'Dashboard Overview',
        'stack': 'My Supplement Stack',
        'biometrics': 'Biometrics Data',
        'insights': 'Cognitive Insights',
        'challenges': 'Active Challenges',
        'community': 'Community Pulse',
        'settings': 'Account Settings'
    }[section_id]
    
    # We will find `<div id="tab-{section_id}" class="tab-pane[^"]*">`
    tab_pattern = rf'(<div id="tab-{section_id}" class="tab-pane[^"]*">)'
    tab_replacement = rf'\1\n                    <div class="section-header" style="margin-bottom: 24px;">\n                        <h2 style="font-size: 1.5rem; margin-bottom: 4px;">{nice_title}</h2>\n                        <p style="color: var(--text-muted); font-size: 14px;">{desc}</p>\n                    </div>'
    content = re.sub(tab_pattern, tab_replacement, content, count=1)

# 3. Make the main topbar static (e.g. "User Workspace") and remove the description
topbar_target = r'<div class="topbar-left">.*?<h2 class="page-title"[^>]*>.*?</h2>.*?<p class="page-description"[^>]*>.*?</p>.*?</div>'
topbar_replacement = '''<div class="topbar-left">
                    <button class="icon-btn mobile-menu-toggle" id="mobile-sidebar-open" aria-label="Open sidebar">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <h2 class="page-title">Personal Control Center</h2>
                </div>'''
content = re.sub(topbar_target, topbar_replacement, content, flags=re.DOTALL)

# 4. Remove the javascript that changes the topbar title/description dynamically
js_titles_pattern = r'const tabTitles = \{.*?\};\s*const tabDescriptions = \{.*?\};'
content = re.sub(js_titles_pattern, '', content, flags=re.DOTALL)

js_update_pattern = r'// Update header title and description\s*if\(tabTitles\[targetId\].*?\}'
content = re.sub(js_update_pattern, '', content, flags=re.DOTALL)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("success")
