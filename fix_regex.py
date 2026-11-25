with open('build_ui2.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = "var h = (window.location.hash || '').replace(/^#\\/?/, '');"
replacement = "var rawHash = window.location.hash || ''; var h = rawHash.indexOf('#/') === 0 ? rawHash.substring(2) : (rawHash.indexOf('#') === 0 ? rawHash.substring(1) : rawHash);"

if target in text:
    text = text.replace(target, replacement)
    print("Replaced target in build_ui2.js successfully!")
else:
    # check alternative
    import re
    text = re.sub(r"var h = \(window\.location\.hash \|\| ''\)\.replace\([^\)]+\);", replacement, text)
    print("Replaced with regex in build_ui2.js!")

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(text)
