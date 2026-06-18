function convertImage() {
    const input = document.getElementById('imageInput');
    const format = document.getElementById('formatSelect').value;
    const downloadLink = document.getElementById('downloadLink');

    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const dataUrl = canvas.toDataURL(format);
                downloadLink.href = dataUrl;
                downloadLink.download = 'converted-image.' + format.split('/')[1];
                downloadLink.style.display = 'inline-block';
                downloadLink.innerText = 'Download Converted Image';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        alert('Please select an image first!');
    }
}   
