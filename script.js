const imageInput = document.getElementById('imageInput');
const dropZone = document.getElementById('dropZone');
const fileName = document.getElementById('fileName');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const downloadLink = document.getElementById('downloadLink');

// Handle Click Upload
dropZone.addEventListener('click', () => imageInput.click());

// Handle File Selection
imageInput.addEventListener('change', handleFileSelect);

// Handle Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length) {
        imageInput.files = files;
        handleFileSelect();
    }
});

function handleFileSelect() {
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        fileName.textContent = file.name;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            previewContainer.style.display = 'block';
            downloadLink.style.display = 'none'; // Hide download until converted
        };
        reader.readAsDataURL(file);
    }
}

function convertImage() {
    if (!imageInput.files || !imageInput.files[0]) {
        alert('Please select an image first!');
        return;
    }

    const format = document.getElementById('formatSelect').value;
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            
            // White background for JPEGs (transparent becomes black otherwise)
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            
            ctx.drawImage(img, 0, 0);
            
            const dataUrl = canvas.toDataURL(format, 0.9); // 0.9 quality
            downloadLink.href = dataUrl;
            
            const ext = format.split('/')[1];
            downloadLink.download = `converted-image.${ext}`;
            downloadLink.style.display = 'inline-block';
            downloadLink.innerText = `⬇️ Download .${ext.toUpperCase()}`;
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(imageInput.files[0]);
}   
