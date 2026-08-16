// Common functions for all pages
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadLabel = document.querySelector('.upload-label');
    const submitBtn = document.getElementById('submitBtn');

    if (fileInput && uploadLabel) {
        // File input change handler
        fileInput.addEventListener('change', handleFileSelect);

        // Drag and drop handlers
        uploadLabel.addEventListener('dragover', handleDragOver);
        uploadLabel.addEventListener('dragleave', handleDragLeave);
        uploadLabel.addEventListener('drop', handleDrop);
    }

    // Initialize page-specific handlers
    if (document.getElementById('splitForm')) {
        initSplitPage();
    } else if (document.getElementById('mergeForm')) {
        initMergePage();
    } else if (document.getElementById('compressForm')) {
        initCompressPage();
    } else if (document.getElementById('compressImageForm')) {
        initCompressImagePage();
    } else if (document.getElementById('compressGIFForm')) {
        initCompressGIFPage();
    } else if (document.getElementById('removePasswordForm')) {
        initRemovePasswordPage();
    } else if (document.getElementById('addPasswordForm')) {
        initAddPasswordPage();
    } else if (document.getElementById('removePageForm')) {
        initRemovePagePage();
    } else if (document.getElementById('imageToPDFForm')) {
        initImageToPDFPage();
    }
});

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        updateFileInfo(files);
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.files = files;
            // Dispatch change event to trigger form specific listeners
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
        updateFileInfo(files);
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;
    }
}

function updateFileInfo(files) {
    const fileInfo = document.getElementById('fileInfo');
    if (fileInfo && files.length === 1) {
        const file = files[0];
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileInfo.innerHTML = `
            <div class="flex items-center gap-3 w-full">
                <div class="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold uppercase tracking-wider text-emerald-700">Selected File</div>
                    <div class="text-sm font-semibold text-slate-800 truncate">${file.name}</div>
                </div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    ${sizeMB} MB
                </span>
            </div>
        `;
        fileInfo.style.display = 'flex';
    }
}

function showProgress() {
    const progress = document.getElementById('progress');
    const result = document.getElementById('result');
    const submitBtn = document.getElementById('submitBtn');

    if (progress) progress.style.display = 'block';
    if (result) result.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;
}

function hideProgress() {
    const progress = document.getElementById('progress');
    const submitBtn = document.getElementById('submitBtn');

    if (progress) progress.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
}

function showResult(message, isError = false, downloadUrl = null) {
    const result = document.getElementById('result');
    if (!result) return;
    
    result.className = 'result' + (isError ? ' error' : '');

    let html = '';
    if (isError) {
        html = `
            <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mt-0.5">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <div>
                    <h3 class="text-base font-bold text-rose-900 m-0 mb-1">Action Failed</h3>
                    <p class="text-sm text-rose-700 m-0">${message}</p>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                        <h3 class="text-base font-bold text-emerald-950 m-0 mb-1">Processing Complete!</h3>
                        <p class="text-sm text-emerald-800 m-0 leading-relaxed">${message}</p>
                    </div>
                </div>
                ${downloadUrl ? `
                <div class="flex-shrink-0">
                    <a href="${downloadUrl}" class="download-link flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition" download>
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Result
                    </a>
                </div>
                ` : ''}
            </div>
        `;
    }

    result.innerHTML = html;
    result.style.display = 'block';
    hideProgress();
}

// Split page
function initSplitPage() {
    const form = document.getElementById('splitForm');
    const rangeRadio = document.getElementById('customRange');
    const pageRangeInput = document.getElementById('pageRange');

    // Enable/disable page range input
    document.querySelectorAll('input[name="splitMode"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (pageRangeInput && rangeRadio) {
                pageRangeInput.disabled = !rangeRadio.checked;
                if (rangeRadio.checked) {
                    pageRangeInput.focus();
                }
            }
        });
    });

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(form);
            const splitMode = formData.get('splitMode');

            if (splitMode === 'range' && !formData.get('pageRange')) {
                showResult('Please enter page ranges (e.g. 1-3,5)', true);
                return;
            }

            showProgress();

            try {
                const response = await fetch('/api/split', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Split failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Merge page
function initMergePage() {
    const form = document.getElementById('mergeForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    let selectedFiles = [];

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            updateFileList();
        });
    }

    function updateFileList() {
        if (!fileList || !fileItems) return;

        if (selectedFiles.length < 2) {
            fileList.style.display = 'none';
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        fileList.style.display = 'block';
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;

        fileItems.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item" draggable="true" data-index="${index}">
                <div class="flex items-center gap-3 min-w-0">
                    <span class="text-slate-400 hover:text-slate-600 cursor-grab">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                    </span>
                    <span class="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">${index + 1}</span>
                    <span class="file-item-name">${file.name}</span>
                </div>
                <span class="file-item-remove" onclick="removeFile(${index})" title="Remove file">✕</span>
            </div>
        `).join('');

        // Add drag and drop for reordering
        const items = fileItems.querySelectorAll('.file-item');
        items.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOverItem);
            item.addEventListener('drop', handleDropItem);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };

    let draggedIndex;

    function handleDragStart(e) {
        draggedIndex = parseInt(e.currentTarget.dataset.index);
        e.currentTarget.classList.add('dragging');
    }

    function handleDragOverItem(e) {
        e.preventDefault();
    }

    function handleDropItem(e) {
        e.preventDefault();
        const dropIndex = parseInt(e.currentTarget.dataset.index);

        if (draggedIndex !== dropIndex) {
            const draggedFile = selectedFiles[draggedIndex];
            selectedFiles.splice(draggedIndex, 1);
            selectedFiles.splice(dropIndex, 0, draggedFile);
            updateFileList();
        }
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (selectedFiles.length < 2) {
                showResult('Please select at least 2 PDF files', true);
                return;
            }

            showProgress();

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                const response = await fetch('/api/merge', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Merge failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Compress page
function initCompressPage() {
    const form = document.getElementById('compressForm');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/compress', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    let message = data.message;
                    if (data.originalSize && data.compressedSize) {
                        const reduction = ((1 - data.compressedSize / data.originalSize) * 100).toFixed(1);
                        const origMB = (data.originalSize / (1024 * 1024)).toFixed(2);
                        const compMB = (data.compressedSize / (1024 * 1024)).toFixed(2);
                        message += `<br><span class="text-xs font-semibold text-emerald-800">Original: ${origMB} MB → Compressed: ${compMB} MB (${reduction}% saved)</span>`;
                    }
                    showResult(message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Compression failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Compress image page
function initCompressImagePage() {
    const form = document.getElementById('compressImageForm');
    const fileInput = document.getElementById('fileInput');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const resizeCheckbox = document.getElementById('resize');
    const resizeOptions = document.getElementById('resizeOptions');
    const previewDiv = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImg');

    // Update quality value display
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', function() {
            qualityValue.textContent = this.value;
        });
    }

    // Toggle resize options
    if (resizeCheckbox && resizeOptions) {
        resizeCheckbox.addEventListener('change', function() {
            resizeOptions.style.display = this.checked ? 'block' : 'none';
        });
    }

    // Handle dimension presets
    const presetSelect = document.getElementById('preset');
    const targetWidth = document.getElementById('targetWidth');
    const targetHeight = document.getElementById('targetHeight');
    const resizeMode = document.getElementById('resizeMode');

    if (presetSelect && targetWidth && targetHeight) {
        presetSelect.addEventListener('change', function() {
            const presets = {
                'passport': { width: 600, height: 600, mode: 'exact' },
                'id': { width: 450, height: 600, mode: 'exact' },
                'hd': { width: 1920, height: 1080, mode: 'max' },
                'square-1024': { width: 1024, height: 1024, mode: 'exact' },
                'square-512': { width: 512, height: 512, mode: 'exact' }
            };

            const preset = presets[this.value];
            if (preset) {
                targetWidth.value = preset.width;
                targetHeight.value = preset.height;
                if (resizeMode) resizeMode.value = preset.mode;
            } else {
                targetWidth.value = '';
                targetHeight.value = '';
            }
        });
    }

    // Show image preview
    if (fileInput && previewDiv && previewImg) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewDiv.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/compress-image', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    let message = data.message;
                    if (data.originalSize && data.compressedSize) {
                        const reduction = ((1 - data.compressedSize / data.originalSize) * 100).toFixed(1);
                        const originalMB = (data.originalSize / (1024 * 1024)).toFixed(2);
                        const compressedMB = (data.compressedSize / (1024 * 1024)).toFixed(2);
                        message += `<br><span class="text-xs font-semibold text-emerald-800">Original: ${originalMB} MB → Compressed: ${compressedMB} MB (${reduction}% reduction)</span>`;
                    }
                    showResult(message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Compression failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Compress GIF page
function initCompressGIFPage() {
    const form = document.getElementById('compressGIFForm');
    const fileInput = document.getElementById('fileInput');
    const presetSelect = document.getElementById('preset');
    const advancedOptions = document.getElementById('advancedOptions');
    const previewDiv = document.getElementById('gifPreview');
    const previewImg = document.getElementById('previewImg');
    const gifInfo = document.getElementById('gifInfo');

    // Update slider value displays
    const sliders = [
        { input: 'colorCount', display: 'colorCountValue' },
        { input: 'resizePercent', display: 'resizeValue' },
        { input: 'lossyLevel', display: 'lossyValue' }
    ];

    sliders.forEach(({ input, display }) => {
        const slider = document.getElementById(input);
        const displayEl = document.getElementById(display);
        if (slider && displayEl) {
            slider.addEventListener('input', function() {
                displayEl.textContent = this.value;
            });
        }
    });

    // Toggle advanced options when "custom" is selected
    if (presetSelect && advancedOptions) {
        presetSelect.addEventListener('change', function() {
            advancedOptions.style.display = this.value === 'custom' ? 'block' : 'none';
        });
    }

    // Show GIF preview
    if (fileInput && previewDiv && previewImg) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type === 'image/gif') {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewDiv.style.display = 'block';
                    if (gifInfo) {
                        const sizeKB = (file.size / 1024).toFixed(1);
                        gifInfo.textContent = 'File size: ' + sizeKB + ' KB';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/compress-gif', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    let message = data.message;
                    if (data.originalSize && data.compressedSize) {
                        const reduction = ((1 - data.compressedSize / data.originalSize) * 100).toFixed(1);
                        const originalKB = (data.originalSize / 1024).toFixed(1);
                        const compressedKB = (data.compressedSize / 1024).toFixed(1);
                        message += `<br><span class="text-xs font-semibold text-emerald-800">Original: ${originalKB} KB → Compressed: ${compressedKB} KB (${reduction}% reduction)</span>`;
                    }
                    showResult(message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Compression failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Remove password page
function initRemovePasswordPage() {
    const form = document.getElementById('removePasswordForm');
    const passwordInput = document.getElementById('passwordInput');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const password = passwordInput ? passwordInput.value.trim() : '';
            if (!password) {
                showResult('Please enter the PDF password', true);
                return;
            }

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/remove-password', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Failed to remove password', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Add password page
function initAddPasswordPage() {
    const form = document.getElementById('addPasswordForm');
    const passwordInput = document.getElementById('passwordInput');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const password = passwordInput ? passwordInput.value.trim() : '';
            if (!password) {
                showResult('Please enter a password', true);
                return;
            }

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/add-password', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Failed to add password', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Remove page page
function initRemovePagePage() {
    const form = document.getElementById('removePageForm');
    const pageRangeInput = document.getElementById('pageRangeInput');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const pageRange = pageRangeInput ? pageRangeInput.value.trim() : '';
            if (!pageRange) {
                showResult('Please enter page numbers to remove', true);
                return;
            }

            showProgress();

            const formData = new FormData(form);

            try {
                const response = await fetch('/api/remove-page', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Failed to remove pages', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}

// Images to PDF page
function initImageToPDFPage() {
    const form = document.getElementById('imageToPDFForm');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const fileItems = document.getElementById('fileItems');
    let selectedFiles = [];

    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            selectedFiles = Array.from(e.target.files);
            updateFileList();
        });
    }

    function updateFileList() {
        if (!fileList || !fileItems) return;

        if (selectedFiles.length === 0) {
            fileList.style.display = 'none';
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) submitBtn.disabled = true;
            return;
        }

        fileList.style.display = 'block';
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.disabled = false;

        fileItems.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item" draggable="true" data-index="${index}">
                <div class="flex items-center gap-3 min-w-0">
                    <span class="text-slate-400 hover:text-slate-600 cursor-grab">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path></svg>
                    </span>
                    <span class="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">${index + 1}</span>
                    <span class="file-item-name">${file.name}</span>
                </div>
                <span class="file-item-remove" onclick="removeImageFile(${index})" title="Remove image">✕</span>
            </div>
        `).join('');

        // Add drag and drop for reordering
        const items = fileItems.querySelectorAll('.file-item');
        items.forEach(item => {
            item.addEventListener('dragstart', handleDragStart);
            item.addEventListener('dragover', handleDragOverItem);
            item.addEventListener('drop', handleDropItem);
            item.addEventListener('dragend', handleDragEnd);
        });
    }

    window.removeImageFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };

    let draggedIndex;

    function handleDragStart(e) {
        draggedIndex = parseInt(e.currentTarget.dataset.index);
        e.currentTarget.classList.add('dragging');
    }

    function handleDragOverItem(e) {
        e.preventDefault();
    }

    function handleDropItem(e) {
        e.preventDefault();
        const dropIndex = parseInt(e.currentTarget.dataset.index);

        if (draggedIndex !== dropIndex) {
            const draggedFile = selectedFiles[draggedIndex];
            selectedFiles.splice(draggedIndex, 1);
            selectedFiles.splice(dropIndex, 0, draggedFile);
            updateFileList();
        }
    }

    function handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
    }

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (selectedFiles.length === 0) {
                showResult('Please select at least 1 image file', true);
                return;
            }

            showProgress();

            const formData = new FormData();
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });

            try {
                const response = await fetch('/api/image-to-pdf', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    showResult(data.message, false, data.downloadUrl);
                } else {
                    showResult(data.error || 'Conversion failed', true);
                }
            } catch (error) {
                showResult('Network error: ' + error.message, true);
            }
        });
    }
}
