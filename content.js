// ตรวจสอบว่า script ถูกเปิดใช้งานหรือไม่
chrome.storage.local.get(['enabled', 'script'], function (data) {
    if (data.enabled && data.script) {
        try {
            // ทำการเรียกใช้ script
            eval(data.script);
            console.log('Script Working');
        } catch (error) {
            console.error('Script Error:', error);
        }
    }
});