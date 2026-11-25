with open('mockup_realistic.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('studio-stage')
print(text[idx-50:idx+450])
