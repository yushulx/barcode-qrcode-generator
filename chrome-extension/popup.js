// Helper functions
function randomEAN13Number() {
    let value = '';
    for (let i = 0; i < 12; i++) {
        value += Math.floor(Math.random() * 10);
    }
    return value;
}

function randomPharmacodeNumber() {
    return Math.floor(Math.random() * (131070 - 3 + 1)) + 3;
}

function randomCodabar() {
    const chars = '0123456789-$:/.+';
    const startStopChars = 'ABCD';
    const startChar = startStopChars[Math.floor(Math.random() * startStopChars.length)];
    const stopChar = startStopChars[Math.floor(Math.random() * startStopChars.length)];
    const middleLength = Math.floor(Math.random() * (16 - 4 + 1)) + 4;

    let middlePart = '';
    for (let i = 0; i < middleLength; i++) {
        middlePart += chars[Math.floor(Math.random() * chars.length)];
    }

    return startChar + middlePart + stopChar;
}

function getDefaultValue(barcodeType) {
    if (barcodeType === 'pharmacode') {
        return '12345';
    } else if (barcodeType === 'rationalizedCodabar') {
        return 'A1234567890B';
    } else {
        return '123456789012';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

function showSuccess(message) {
    const resultDiv = document.getElementById('result');
    let successMsg = resultDiv.querySelector('.success-message');
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        resultDiv.appendChild(successMsg);
    }
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 2000);
}

// Generate barcode
function generateBarcode() {
    const text = document.getElementById('text').value.trim();
    const barcodeType = document.getElementById('barcodeType').value;
    const canvas = document.getElementById('barcodeCanvas');
    const resultDiv = document.getElementById('result');

    if (!text) {
        showError('Please enter text or click "Use Current URL"');
        return;
    }

    try {
        bwipjs.toCanvas(canvas, {
            bcid: barcodeType,
            text: text,
            scale: 3,
            includetext: true,
        });

        resultDiv.style.display = 'block';
        document.getElementById('error').style.display = 'none';
    } catch (error) {
        showError('Error generating barcode: ' + error.message);
        resultDiv.style.display = 'none';
    }
}

// Download barcode
function downloadBarcode() {
    const canvas = document.getElementById('barcodeCanvas');
    const link = document.createElement('a');
    const barcodeType = document.getElementById('barcodeType').value;
    link.download = `barcode_${barcodeType}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    showSuccess('Barcode downloaded!');
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        const canvas = document.getElementById('barcodeCanvas');
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        showSuccess('Barcode copied to clipboard!');
    } catch (error) {
        showError('Failed to copy to clipboard: ' + error.message);
    }
}

// Get current tab URL
async function getCurrentTabUrl() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        return tab.url;
    } catch (error) {
        showError('Failed to get current URL: ' + error.message);
        return '';
    }
}

// Event listeners
document.getElementById('useUrl').addEventListener('click', async () => {
    const url = await getCurrentTabUrl();
    if (url) {
        document.getElementById('text').value = url;
        // Auto-select QR code for URLs as it's most suitable
        document.getElementById('barcodeType').value = 'qrcode';
    }
});

document.getElementById('useManual').addEventListener('click', () => {
    document.getElementById('text').value = '';
    document.getElementById('text').focus();
});

document.getElementById('generate').addEventListener('click', generateBarcode);

document.getElementById('download').addEventListener('click', downloadBarcode);

document.getElementById('copy').addEventListener('click', copyToClipboard);

// Handle barcode type change
document.getElementById('barcodeType').addEventListener('change', (e) => {
    const currentValue = document.getElementById('text').value;
    if (!currentValue || currentValue === getDefaultValue(e.target.value)) {
        document.getElementById('text').value = getDefaultValue(e.target.value);
    }
});

// Allow Enter key to generate
document.getElementById('text').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateBarcode();
    }
});

// Initialize with default value
window.addEventListener('load', () => {
    const barcodeType = document.getElementById('barcodeType').value;
    document.getElementById('text').value = getDefaultValue(barcodeType);
});
