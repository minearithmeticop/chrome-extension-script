document.addEventListener('DOMContentLoaded', function () {
    const scriptToggle = document.getElementById('scriptToggle');
    const statusText = document.getElementById('statusText');
    const scriptInput = document.getElementById('scriptInput');
    const saveBtn = document.getElementById('saveBtn');
    const runBtn = document.getElementById('runBtn');

    // โหลดสถานะและข้อมูล script จาก storage
    chrome.storage.local.get(['enabled', 'script'], function (data) {
        scriptToggle.checked = data.enabled || false;
        statusText.textContent = scriptToggle.checked ? 'Script Active' : 'Script Inactive';
        scriptInput.value = data.script || '';
    });

    // บันทึกสถานะ toggle
    scriptToggle.addEventListener('change', function () {
        const isEnabled = scriptToggle.checked;
        statusText.textContent = isEnabled ? 'Script Active' : 'Script Inactive';

        chrome.storage.local.set({ enabled: isEnabled }, function () {
            console.log('Status is ' + isEnabled);

            // แจ้ง background script ให้ทราบว่าสถานะเปลี่ยน
            chrome.runtime.sendMessage({ action: 'toggleScript', enabled: isEnabled });
        });
    });

    // บันทึก script
    saveBtn.addEventListener('click', function () {
        const script = scriptInput.value;
        chrome.storage.local.set({ script: script }, function () {
            alert('Save Script Successfully!');
        });
    });

    // เรียกใช้ script ใน tab ปัจจุบัน
    runBtn.addEventListener('click', function () {
        const script = scriptInput.value;
        if (script) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: executeScript,
                    args: [script]
                });
            });
        } else {
            alert('Please JavaScript code to run!');
        }
    });

    // ฟังก์ชันสำหรับเรียกใช้ script
    function executeScript(script) {
        try {
            return eval(script);
        } catch (error) {
            console.error('Script Error:', error);
            return { error: error.message };
        }
    }
});
