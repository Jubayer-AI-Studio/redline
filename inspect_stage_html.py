with open('mockup_realistic.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('id="stage"')
print(text[idx-30:idx+450])
