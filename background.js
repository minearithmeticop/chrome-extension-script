chrome.runtime.onInstalled.addListener(function () {
    // กำหนดค่าเริ่มต้น
    chrome.storage.local.set({ enabled: false });
    console.log('Extension installed');
});

// รับข้อความจาก content.js หรือ popup.js
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'injectScript') {
        // ฉีด script ไปยัง tab ที่กำลังทำงานอยู่
        const tabId = sender.tab ? sender.tab.id : null;

        if (tabId) {
            injectScriptToTab(tabId);
        } else {
            // กรณีที่ไม่มี tab id จาก sender (เช่น มาจาก popup)
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs.length > 0) {
                    injectScriptToTab(tabs[0].id);
                }
            });
        }
    }
});

// ฟังก์ชันสำหรับฉีด script ไปยัง tab ที่กำหนด
function injectScriptToTab(tabId) {
    // ใช้ executeScript API เพื่อรัน inject.js
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['inject.js']
    }).then(() => {
        console.log('Script injected successfully');
    }).catch(err => {
        console.error('Error injecting script:', err);
    });
}

// เมื่อมีการเปิด tab ใหม่หรือโหลดหน้าใหม่
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        // ตรวจสอบว่า script ถูกเปิดใช้งานอยู่หรือไม่
        chrome.storage.local.get(['enabled'], function (data) {
            if (data.enabled) {
                // ฉีด script ไปยัง tab ที่เพิ่งโหลดเสร็จ
                injectScriptToTab(tabId);
            }
        });
    }
});
