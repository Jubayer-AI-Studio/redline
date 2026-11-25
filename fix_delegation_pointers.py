with open('build_ui2.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the window export section
old_exports = """  window.showToast = function(m, i) { if (typeof showToast === 'function') showToast(m, i); };
  window.closeGameModal = function(e) { if (typeof closeGameModal === 'function') closeGameModal(e); };
  window.sendChatMessage = function() { if (typeof sendChatMessage === 'function') sendChatMessage(); };
  window.claimBonusCredits = function(a, b) { if (typeof claimBonusCredits === 'function') claimBonusCredits(a, b); };
  window.claimDailyReward = function(a) { if (typeof claimDailyReward === 'function') claimDailyReward(a); };
  window.inviteFriend = function(id) { if (typeof inviteFriend === 'function') inviteFriend(id); };
  window.pokeFriend = function(id) { if (typeof pokeFriend === 'function') pokeFriend(id); };
  window.refillBooster = function() { if (typeof refillBooster === 'function') refillBooster(); };"""

new_vars = "  var _showToast, _closeGameModal, _sendChatMessage, _claimBonusCredits, _claimDailyReward, _inviteFriend, _pokeFriend, _refillBooster;\n"

new_exports = """  window.showToast = function(m, i) { if (_showToast) _showToast(m, i); };
  window.closeGameModal = function(e) { if (_closeGameModal) _closeGameModal(e); };
  window.sendChatMessage = function() { if (_sendChatMessage) _sendChatMessage(); };
  window.claimBonusCredits = function(a, b) { if (_claimBonusCredits) _claimBonusCredits(a, b); };
  window.claimDailyReward = function(a) { if (_claimDailyReward) _claimDailyReward(a); };
  window.inviteFriend = function(id) { if (_inviteFriend) _inviteFriend(id); };
  window.pokeFriend = function(id) { if (_pokeFriend) _pokeFriend(id); };
  window.refillBooster = function() { if (_refillBooster) _refillBooster(); };"""

new_assignments = """    _showToast = showToast;
    _closeGameModal = closeGameModal;
    _sendChatMessage = sendChatMessage;
    _claimBonusCredits = claimBonusCredits;
    _claimDailyReward = claimDailyReward;
    _inviteFriend = inviteFriend;
    _pokeFriend = pokeFriend;
    _refillBooster = refillBooster;"""

if old_exports in text:
    text = text.replace(old_exports, new_exports)
    # Add variable declarations
    text = text.replace("var _nextCar, _prevCar, _setStudioView, _confirmSelectCar, _openSocialModal, _openRewardsModal;", "var _nextCar, _prevCar, _setStudioView, _confirmSelectCar, _openSocialModal, _openRewardsModal;\n" + new_vars)
    # Add assignments
    text = text.replace("_openRewardsModal = openRewardsModal;", "_openRewardsModal = openRewardsModal;\n" + new_assignments)
    print("Fixed recursive delegation pointers in build_ui2.js!")
else:
    print("old_exports not matched in build_ui2.js!")

with open('build_ui2.js', 'w', encoding='utf-8') as f:
    f.write(text)
