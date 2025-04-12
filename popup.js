document.addEventListener('DOMContentLoaded', function () {
    const scriptToggle = document.getElementById('scriptToggle');
    const statusText = document.getElementById('statusText');
    const activateBtn = document.getElementById('activateBtn');

    // โหลดสถานะ
    chrome.storage.local.get(['enabled'], function (data) {
        scriptToggle.checked = data.enabled || false;
        statusText.textContent = scriptToggle.checked ? 'Script Active' : 'Script Inactive';
    });

    // บันทึกสถานะ toggle
    scriptToggle.addEventListener('change', function () {
        const isEnabled = scriptToggle.checked;
        statusText.textContent = isEnabled ? 'Script Active' : 'Script Inactive';

        chrome.storage.local.set({ enabled: isEnabled }, function () {
            console.log('Status is ' + isEnabled);
        });
    });

    // ปุ่มสำหรับเรียกใช้ script ใน tab ปัจจุบันทันที
    activateBtn.addEventListener('click', function () {
        // เปิดสวิตช์โดยอัตโนมัติเมื่อกดปุ่มนี้
        scriptToggle.checked = true;
        statusText.textContent = 'Script Active';
        chrome.storage.local.set({ enabled: true });

        // รัน script ในหน้าปัจจุบัน
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs && tabs[0]) {
                chrome.runtime.sendMessage({ action: "injectScript" });
            }
        });
    });
});
