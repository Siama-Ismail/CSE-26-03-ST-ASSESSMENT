// Form validation and file handling
class VideoUploadManager {
  constructor() {
    this.videoFile = null;
    this.thumbnailFile = null;
    this.init();
  }

  init() {
    // Get all form elements
    this.form = document.getElementById('uploadForm');
    this.videoUploadArea = document.getElementById('videoUploadArea');
    this.thumbnailUploadArea = document.getElementById('thumbnailUploadArea');
    this.videoInput = document.getElementById('videoInput');
    this.thumbnailInput = document.getElementById('thumbnailInput');
    this.submitBtn = document.getElementById('submitBtn');

    if (!this.form) return; // Exit if no form found

    // Setup event listeners
    this.setupFileUploadAreas();
    this.setupFormValidation();
  }

  setupFileUploadAreas() {
    // Video upload area
    if (this.videoUploadArea) {
      this.videoUploadArea.addEventListener('click', () => this.videoInput.click());
      this.videoUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, 'video'));
      this.videoUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, 'video'));
      this.videoUploadArea.addEventListener('drop', (e) => this.handleDrop(e, 'video'));
    }

    // Thumbnail upload area
    if (this.thumbnailUploadArea) {
      this.thumbnailUploadArea.addEventListener('click', () => this.thumbnailInput.click());
      this.thumbnailUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e, 'thumbnail'));
      this.thumbnailUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e, 'thumbnail'));
      this.thumbnailUploadArea.addEventListener('drop', (e) => this.handleDrop(e, 'thumbnail'));
    }

    // File input changes
    if (this.videoInput) {
      this.videoInput.addEventListener('change', (e) => this.handleFileSelect(e, 'video'));
    }
    if (this.thumbnailInput) {
      this.thumbnailInput.addEventListener('change', (e) => this.handleFileSelect(e, 'thumbnail'));
    }

    // Buttons
    if (this.submitBtn) {
      this.submitBtn.addEventListener('click', (e) => this.handleSubmit(e));
    }
  }

  setupFormValidation() {
    const inputs = this.form?.querySelectorAll('input[type="text"], textarea, select') || [];
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.clearFieldError(e.target));
    });
  }

  handleDragOver(e, type) {
    e.preventDefault();
    const area = type === 'video' ? this.videoUploadArea : this.thumbnailUploadArea;
    area.classList.add('dragover');
  }

  handleDragLeave(e, type) {
    e.preventDefault();
    const area = type === 'video' ? this.videoUploadArea : this.thumbnailUploadArea;
    area.classList.remove('dragover');
  }

  handleDrop(e, type) {
    e.preventDefault();
    const area = type === 'video' ? this.videoUploadArea : this.thumbnailUploadArea;
    area.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const input = type === 'video' ? this.videoInput : this.thumbnailInput;
      input.files = files;
      this.handleFileSelect({ target: input }, type);
    }
  }

  handleFileSelect(e, type) {
    const file = e.target.files[0];
    if (!file) return;

    const area = type === 'video' ? this.videoUploadArea : this.thumbnailUploadArea;
    
    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      this.showFieldError(area, 'File is too large (max 500MB)');
      return;
    }

    // Validate file type
    if (type === 'video') {
      const validVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'];
      if (!validVideoTypes.includes(file.type)) {
        this.showFieldError(area, 'Invalid video format. Use MP4, MPEG, MOV, or AVI');
        return;
      }
      this.videoFile = file;
      this.showVideoPreview(file, area);
    } else if (type === 'thumbnail') {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validImageTypes.includes(file.type)) {
        this.showFieldError(area, 'Invalid image format. Use JPEG, PNG, or GIF');
        return;
      }
      this.thumbnailFile = file;
      this.showImagePreview(file, area);
    }

    this.clearFieldError(area);
  }

  showVideoPreview(file, area) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let preview = area.querySelector('.preview-area');
      if (!preview) {
        preview = document.createElement('div');
        preview.className = 'preview-area';
        area.appendChild(preview);
      }

      preview.innerHTML = `
        <div class="preview-video">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #999; font-size: 36px; gap: 2px;">
            <div style="position: relative; display: inline-block;">
              <span style="font-size: 40px;">☁️</span>
              <span style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); font-size: 18px;">⬆️</span>
            </div>
            <div style="font-size: 11px; margin-top: 6px;">Upload video</div>
          </div>
        </div>
      `;
      preview.classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  showImagePreview(file, area) {
    const reader = new FileReader();
    reader.onload = (e) => {
      let preview = area.querySelector('.preview-area');
      if (!preview) {
        preview = document.createElement('div');
        preview.className = 'preview-area';
        area.appendChild(preview);
      }

      preview.innerHTML = `
        <img class="preview-image" src="${e.target.result}" alt="Thumbnail preview">
      `;
      preview.classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  validateField(field) {
    if (!field.value.trim()) {
      this.showFieldError(field, 'This field is required');
      return false;
    }

    // Additional validation based on field type
    if (field.name === 'title' && field.value.trim().length < 3) {
      this.showFieldError(field, 'Title must be at least 3 characters');
      return false;
    }

    if (field.name === 'description' && field.value.trim().length < 5) {
      this.showFieldError(field, 'Description must be at least 5 characters');
      return false;
    }

    this.clearFieldError(field);
    return true;
  }

  showFieldError(element, message) {
    const formGroup = element.closest('.form-group') || element.parentElement;
    formGroup.classList.add('error');
    
    let errorMsg = formGroup.querySelector('.error-message');
    if (!errorMsg) {
      errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      formGroup.appendChild(errorMsg);
    }
    errorMsg.textContent = message;
    errorMsg.classList.add('show');
  }

  clearFieldError(element) {
    const formGroup = element.closest('.form-group') || element.parentElement;
    formGroup.classList.remove('error');
    
    const errorMsg = formGroup.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.classList.remove('show');
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    // Validate all fields
    const inputs = this.form.querySelectorAll('input[type="text"], textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    // Check files
    if (!this.videoFile) {
      this.showFieldError(this.videoUploadArea, 'Video is required');
      isValid = false;
    }

    if (!this.thumbnailFile) {
      this.showFieldError(this.thumbnailUploadArea, 'Thumbnail is required');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    this.uploadVideo();
  }

  uploadVideo() {
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('quality', document.getElementById('quality').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('tags', document.getElementById('tags').value);
    formData.append('video', this.videoFile);
    formData.append('thumbnail', this.thumbnailFile);

    this.submitBtn.disabled = true;
    this.submitBtn.classList.add('loading');
    this.submitBtn.textContent = 'Uploading...';

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          this.showSuccessMessage('Video uploaded successfully!');
          this.resetForm();
          
          // Redirect to videos page after 2 seconds
          setTimeout(() => {
            window.location.href = '/videos';
          }, 2000);
        } else {
          this.showErrorMessage(data.message || 'Upload failed');
        }
      })
      .catch(err => {
        console.error('Upload error:', err);
        this.showErrorMessage('An error occurred during upload');
      })
      .finally(() => {
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('loading');
        this.submitBtn.textContent = 'Upload Video';
      });
  }

  showSuccessMessage(message) {
    let successMsg = document.querySelector('.success-message');
    if (!successMsg) {
      successMsg = document.createElement('div');
      successMsg.className = 'success-message';
      this.form.insertBefore(successMsg, this.form.firstChild);
    }
    successMsg.textContent = message;
    successMsg.classList.add('show');
  }

  showErrorMessage(message) {
    alert('Error: ' + message);
  }

  resetForm() {
    this.form.reset();
    this.videoFile = null;
    this.thumbnailFile = null;

    // Clear previews
    const previews = this.form.querySelectorAll('.preview-area');
    previews.forEach(preview => {
      preview.classList.remove('show');
      preview.innerHTML = '';
    });

    // Clear errors
    const errors = this.form.querySelectorAll('.form-group.error');
    errors.forEach(error => {
      error.classList.remove('error');
    });

    // Clear success message
    const successMsg = document.querySelector('.success-message');
    if (successMsg) {
      successMsg.classList.remove('show');
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  new VideoUploadManager();
});

// Video player functionality
function playVideo(videoId) {
  fetch(`/api/video/${videoId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showVideoModal(data.video);
      } else {
        alert('Failed to load video');
      }
    })
    .catch(err => {
      console.error('Error:', err);
      alert('Error loading video');
    });
}

function showVideoModal(video) {
  const modal = document.getElementById('videoModal') || createVideoModal();
  
  const playerDiv = modal.querySelector('.video-player');
  playerDiv.innerHTML = `
    <video width="100%" height="100%" controls>
      <source src="${video.videoPath}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;

  const detailsDiv = modal.querySelector('.video-details');
  detailsDiv.innerHTML = `
    <div class="detail-item">
      <div class="detail-label">Title</div>
      <div class="detail-value">${video.title}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Quality</div>
      <div class="detail-value">${video.quality}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Category</div>
      <div class="detail-value">${video.category}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Tags</div>
      <div class="detail-value">${video.tags}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Description</div>
      <div class="detail-value">${video.description}</div>
    </div>
    <div class="detail-item">
      <div class="detail-label">Uploaded</div>
      <div class="detail-value">${new Date(video.uploadedAt).toLocaleDateString()}</div>
    </div>
  `;

  modal.classList.add('show');
}

function createVideoModal() {
  const modal = document.createElement('div');
  modal.id = 'videoModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Video Player</h2>
        <button class="modal-close" onclick="closeVideoModal()">×</button>
      </div>
      <div class="modal-body">
        <div class="video-player"></div>
        <div class="video-details"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

function closeVideoModal() {
  const modal = document.getElementById('videoModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

// Close modal on background click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('videoModal');
  if (modal && e.target === modal) {
    closeVideoModal();
  }
});
