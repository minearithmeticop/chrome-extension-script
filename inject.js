// ไฟล์นี้จะถูกเรียกใช้โดยตรงใน background.js ผ่าน chrome.scripting.executeScript API
function setupFreeLinks() {
    function getFreeLink(link) {
        if (link.indexOf("-p/images") != -1) {
            return link.replace('/thumbs/', '/contents/').replace(/-p\/images.*/, '').replace(/contents\/(.*)/, 'contents/$1/videos/$1_sh.mp4');
        } else if (link.indexOf("/thumbs/thumb1/") != -1) {
            return link.replace(/thumbs\/thumb1.*/, "").replace(/thumbs\/(.*?)\//, "contents/$1/videos/$1_sh.mp4")
        } else {
            return link
        }
    }

    // ตรวจสอบว่าเคยติดตั้งแล้วหรือไม่ ป้องกันการทำงานซ้ำซ้อน
    if (window.__free_link_enabler_installed) {
        console.log('Free Link Enabler already installed');
        return;
    }

    // ทำเครื่องหมายว่าได้ติดตั้งแล้ว
    window.__free_link_enabler_installed = true;

    // ใช้ querySelector เพื่อหา main element
    const mainElement = document.querySelector("main");
    if (!mainElement) {
        console.log('Main element not found, will retry in 2 seconds');
        setTimeout(setupFreeLinks, 2000);
        return;
    }

    // เพิ่ม event listener
    mainElement.addEventListener('click', function (e) {
        const target = e.target;
        const elementType = target.nodeName;
        const hasTargetClass = target.classList.contains('thumb__link');

        if (elementType == 'A' && hasTargetClass) {
            e.preventDefault();
            e.stopPropagation();

            const parent = target.parentElement;
            const img = parent.querySelector('img');

            if (img) {
                const src = img.src;
                const freeLink = getFreeLink(src);
                window.open(freeLink, '_blank').focus();
            }

            return false;
        }
    });

    // เพิ่ม styles
    const styles = `
      .thumb__blackout-play {
        opacity: 0 !important;
      }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    console.log('Free Link Enabler script installed successfully');
}

// ทำการรันฟังก์ชันเพื่อติดตั้ง script
setupFreeLinks();
