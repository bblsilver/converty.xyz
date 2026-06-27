// ====== NAV MENU & VIEW CONTROLLERS ======
function toggleNavMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('navMenuDropdown');
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }
}

function switchView(viewName) {
    const imageView = document.getElementById('imageView');
    const gifView = document.getElementById('gifView');
    const menu = document.getElementById('navMenuDropdown');
    
    menu.style.display = 'none';

    if (viewName === 'image') {
        imageView.style.display = 'flex';
        gifView.style.display = 'none';
    } else if (viewName === 'gif') {
        imageView.style.display = 'none';
        gifView.style.display = 'flex';
    }
}

window.addEventListener('click', function() {
    const menu = document.getElementById('navMenuDropdown');
    if (menu) {
        menu.style.display = 'none';
    }
});


// ====== VIEW 1: IMAGE CONVERTER ENGINE ======
const imageInput = document.getElementById('imageInput');
const statusText = document.getElementById('statusText');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const convertBtn = document.getElementById('convertBtn');
const downloadLink = document.getElementById('downloadLink');

let selectedFile = null;
let selectedFormat = null;

function setFormat(format) {
    selectedFormat = format;
    const label = format.replace('to-', '').toUpperCase();
    statusText.textContent = `Will convert to: ${label}`;
    statusText.style.color = '#ff9999';
}

imageInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0]; // FIXED: Correctly targets first index array element
        statusText.textContent = `Selected: ${selectedFile.name}`;
        statusText.style.color = '#666';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'flex';
            convertBtn.style.display = 'block';
            downloadLink.style.display = 'none';
        };
        reader.readAsDataURL(selectedFile);
    }
});

function convertImage() {
    if (!selectedFile) {
        alert("Please choose a file first!");
        return;
    }
    if (!selectedFormat) {
        alert("Please select a format (JPG, PNG, etc.) from the arrow menu first!");
        return;
    }

    let targetFormat = '';
    let extension = '';

    switch(selectedFormat) {
        case 'to-jpg': targetFormat = 'image/jpeg'; extension = 'jpg'; break;
        case 'to-png': targetFormat = 'image/png'; extension = 'png'; break;
        case 'to-webp': targetFormat = 'image/webp'; extension = 'webp'; break;
        case 'to-gif': targetFormat = 'image/gif'; extension = 'gif'; break;
        case 'to-bmp': targetFormat = 'image/bmp'; extension = 'bmp'; break;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (targetFormat === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);
            
            const dataUrl = canvas.toDataURL(targetFormat, 0.9);
            downloadLink.href = dataUrl;
            downloadLink.download = `converted-${selectedFile.name.split('.')[0]}.${extension}`;
            downloadLink.textContent = `Download .${extension.toUpperCase()}`;
            downloadLink.style.display = 'block';
            downloadLink.scrollIntoView({ behavior: 'smooth' });
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
}


// ====== VIEW 2: DUAL-MODE GIF CONVERTER ENGINE ======
const gifVideoInput = document.getElementById('gifVideoInput');
const gifStatusText = document.getElementById('gifStatusText');
const gifPreviewContainer = document.getElementById('gifPreviewContainer');
const gifVideoPreview = document.getElementById('gifVideoPreview');
const gifImagePreview = document.getElementById('gifImagePreview');
const gifConvertBtn = document.getElementById('gifConvertBtn');
const gifDownloadLink = document.getElementById('gifDownloadLink');

let selectedGifFile = null;
let selectedGifFormat = null;

function setGifFormat(format) {
    selectedGifFormat = format;
    gifStatusText.textContent = `Will convert to: ANIMATED GIF`;
    gifStatusText.style.color = '#ff9999';
}

gifVideoInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        selectedGifFile = e.target.files[0]; // FIXED: Changed from e.target.files to target the specific file object inside array index [0]
        gifStatusText.textContent = `Selected: ${selectedGifFile.name}`;
        gifStatusText.style.color = '#666';
        
        gifVideoPreview.style.display = 'none';
        gifImagePreview.style.display = 'none';
        gifDownloadLink.style.display = 'none';

        if (selectedGifFile.type.startsWith('video/')) {
            const videoUrl = URL.createObjectURL(selectedGifFile);
            gifVideoPreview.src = videoUrl;
            gifVideoPreview.style.display = 'block';
        } else if (selectedGifFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                gifImagePreview.src = e.target.result;
                gifImagePreview.style.display = 'block';
            };
            reader.readAsDataURL(selectedGifFile);
        }

        gifPreviewContainer.style.display = 'flex';
        gifConvertBtn.style.display = 'block';
        setGifFormat('to-gif');
    }
});

function convertMediaToGif() {
    if (!selectedGifFile) {
        alert("Please choose a file first!");
        return;
    }
    if (!selectedGifFormat) {
        alert("Please select the GIF format option from the arrow menu first!");
        return;
    }

    gifStatusText.textContent = "Processing animated GIF... please wait...";
    gifStatusText.style.color = '#ff9999';
    gifConvertBtn.disabled = true;

    // SCENARIO A: Input file is a standard Video asset
    if (selectedGifFile.type.startsWith('video/')) {
        const videoUrl = URL.createObjectURL(selectedGifFile);
        gifshot.createGIF({
            video: [videoUrl],
            gifWidth: 400,
            gifHeight: 400,
            interval: 0.1,
            numFrames: 30,
            sampleInterval: 10
        }, handleGifshotResponse);
    } 
    // SCENARIO B: Input file is a Static Image
    else if (selectedGifFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Str = e.target.result;
            gifshot.createGIF({
                images: [base64Str, base64Str], // Double frames force proper multi-frame format recognition across Discord servers
                gifWidth: 400,
                gifHeight: 400,
                interval: 0.2
            }, handleGifshotResponse);
        };
        reader.readAsDataURL(selectedGifFile);
    }
}

function handleGifshotResponse(obj) {
    gifConvertBtn.disabled = false;
    if (!obj.error) {
        const dataUrl = obj.image;
        gifDownloadLink.href = dataUrl;
        gifDownloadLink.download = `converted-${selectedGifFile.name.split('.')[0]}.gif`; // FIXED: Changed split('|') to split('.') to prevent string breaking
        gifDownloadLink.textContent = `Download .GIF`;
        gifDownloadLink.style.display = 'block';
        gifStatusText.textContent = "Conversion Complete!";
        gifStatusText.style.color = '#666';
        gifDownloadLink.scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("GIF conversion failed: " + obj.errorMsg);
        gifStatusText.textContent = "Conversion failed.";
    }
}
