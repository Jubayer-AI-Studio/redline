with open('build_ui2.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "html.rl-v2:not(.rl-in-session) #global-nav,",
    "html.rl-v2 #gnav,\nhtml.rl-v2 .gnav,\nhtml.rl-v2:not(.rl-in-session) #global-nav,"
)

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added #gnav and .gnav to hidden rules!")
