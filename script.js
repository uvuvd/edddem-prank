document.addEventListener('DOMContentLoaded', function() {
    const ADMIN_PASSWORD = 'DGhfjfkg8884655Dgjh';
    const prankImage = document.getElementById('prankImage');
    const prankSound = document.getElementById('prankSound');
    const imageUpload = document.getElementById('imageUpload');
    const soundUpload = document.getElementById('soundUpload');
    const saveButton = document.getElementById('saveContent');
    const adminPasswordInput = document.getElementById('adminPassword');
    const adminMessage = document.getElementById('adminMessage');
    const imagePreview = document.getElementById('imagePreview');
    const soundPreview = document.getElementById('soundPreview');
    const currentImageStatus = document.getElementById('currentImageStatus');
    const currentSoundStatus = document.getElementById('currentSoundStatus');
    let uploadedImage = null;
    let uploadedSound = null;
    loadSavedContent();
    prankImage.addEventListener('click', function() {
        playPrankSound();
    });
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showMessage('Выберите файл изображения', 'error');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Размер изображения до 5MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedImage = e.target.result;
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Превью">`;
                showTempMessage('🖼️ Изображение загружено', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    soundUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('audio/')) {
                showMessage('Выберите аудио файл', 'error');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                showMessage('Размер звука до 10MB', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                uploadedSound = e.target.result;
                soundPreview.src = uploadedSound;
                showTempMessage('🎵 Звук загружен', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
    saveButton.addEventListener('click', function() {
        const enteredPassword = adminPasswordInput.value;
        if (!enteredPassword) {
            showMessage('Введите пароль', 'error');
            return;
        }
        if (enteredPassword !== ADMIN_PASSWORD) {
            showMessage('Неверный пароль', 'error');
            return;
        }
        if (!uploadedImage && !uploadedSound) {
            showMessage('Загрузите файл', 'error');
            return;
        }
        const content = {
            image: uploadedImage || getSavedContent().image,
            sound: uploadedSound || getSavedContent().sound,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('edemSid_prank_content', JSON.stringify(content));
        showMessage('✅ Контент сохранен!', 'success');
        loadSavedContent();
        adminPasswordInput.value = '';
        imageUpload.value = '';
        soundUpload.value = '';
        uploadedImage = null;
        uploadedSound = null;
        setTimeout(() => {
            imagePreview.innerHTML = '';
            soundPreview.src = '';
        }, 2000);
    });
    function loadSavedContent() {
        const content = getSavedContent();
        if (content.image) {
            prankImage.src = content.image;
            currentImageStatus.textContent = '✅ Загружена';
            currentImageStatus.className = 'status-loaded';
        }
        if (content.sound) {
            prankSound.src = content.sound;
            currentSoundStatus.textContent = '✅ Загружен';
            currentSoundStatus.className = 'status-loaded';
        }
    }
    function getSavedContent() {
        const saved = localStorage.getItem('edemSid_prank_content');
        return saved ? JSON.parse(saved) : { image: '', sound: '' };
    }
    function playPrankSound() {
        if (prankSound.src && !prankSound.src.endsWith('undefined')) {
            prankSound.currentTime = 0;
            prankSound.play().catch(e => {
                showTempMessage('🔇 Нажмите на страницу для звука', 'error');
            });
        } else {
            showTempMessage('🎵 Загрузите звук в панели', 'error');
        }
    }
    function showMessage(text, type) {
        adminMessage.textContent = text;
        adminMessage.className = `message ${type}`;
        adminMessage.style.display = 'block';
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 4000);
    }
    function showTempMessage(text, type) {
        const tempMsg = document.createElement('div');
        tempMsg.textContent = text;
        tempMsg.className = `message ${type}`;
        tempMsg.style.position = 'fixed';
        tempMsg.style.top = '20px';
        tempMsg.style.left = '50%';
        tempMsg.style.transform = 'translateX(-50%)';
        tempMsg.style.zIndex = '10000';
        document.body.appendChild(tempMsg);
        setTimeout(() => {
            tempMsg.remove();
        }, 3000);
    }
    let tapCount = 0;
    let lastTap = 0;
    document.addEventListener('click', function(e) {
        if (e.target.closest('.admin-panel')) return;
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            tapCount++;
        } else {
            tapCount = 1;
        }
        if (tapCount >= 5) {
            document.getElementById('adminSection').scrollIntoView({ 
                behavior: 'smooth' 
            });
            showTempMessage('🔓 Панель управления разблокирована', 'success');
            tapCount = 0;
        }
        lastTap = currentTime;
    });
});
