const imageInput = document.getElementById('imageInput');
const conversionType = document.getElementById('conversionType');
const fileInfo = document.getElementById('fileInfo');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const convertBtn = document.getElementById('convertBtn');
const downloadLink = document.getElementById('downloadLink');
let selectedFile = null;

imageInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
        fileInfo.textContent = `Selected: ${selectedFile.name}`;
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
    if (!selectedFile) { alert("Please choose a file first!"); return; }
    const type = conversionType.value;
    if (!type) { alert("Please select a conversion type!"); return; }
    let targetFormat = '';
    let extension = '';
    switch(type) {
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
