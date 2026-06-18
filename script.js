const imageInput = document.getElementById('imageInput');
const statusText = document.getElementById('statusText');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const convertBtn = document.getElementById('convertBtn');
const downloadLink = document.getElementById('downloadLink');

let selectedFile = null;
let selectedFormat = null;

// Function to set format when an option is clicked
function setFormat(format) {
    selectedFormat = format;
    const label = format.replace('to-', '').toUpperCase();
    statusText.textContent = `Will convert to: ${label}`;
    statusText.style.color = '#ff9999'; // Highlight in pastel red
}

// Handle File Selection
imageInput.addEventListener('change', function(e) {
    if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
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

// Handle Conversion
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

            // White background for JPEGs to maintain transparency layers
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
