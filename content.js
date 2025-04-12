// ตรวจสอบสถานะ enable ก่อนรัน script
chrome.storage.local.get(['enabled'], function (data) {
    if (data.enabled) {
        // แจ้ง background script ให้ฉีด script
        chrome.runtime.sendMessage({ action: "injectScript" });
    }
});

// รับฟังข้อความจาก popup หรือ background
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'toggleScript') {
        if (request.enabled) {
            // แจ้ง background script ให้ฉีด script
            chrome.runtime.sendMessage({ action: "injectScript" });
        }
        sendResponse({ status: 'ok' });
    }
});