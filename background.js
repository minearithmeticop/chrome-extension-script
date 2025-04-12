chrome.runtime.onInstalled.addListener(function () {
    // กำหนดค่าเริ่มต้น
    chrome.storage.local.set({ enabled: false, script: '' });
    console.log('Extension Installed');
});

// รับข้อความจาก popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'toggleScript') {
        console.log('script status: ' + (request.enabled ? 'active' : 'inactive'));
    }
});
