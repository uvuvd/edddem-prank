document.addEventListener('DOMContentLoaded', function() {
    // 🔐 ВАШ ПАРОЛЬ
    const ADMIN_PASSWORD = 'DGhfjfkg8884655Dgjh';
    
    // Элементы страницы
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

    // Переменные для хранения загруженных файлов
    let uploadedImage = null;
    let uploadedSound = null;

    // Загружаем сохраненный контент при запуске
    loadSavedContent();

    // Обработчик клика по картинке - воспроизводим звук
    prankImage.addEventListener('click', function() {
        playPrankSound();
    });

    // Загрузка картинки
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                showMessage('Пожалуйста, выберите файл изображения', 'error');
                return;
            }

            // Проверяем размер (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showMessage('Размер изображения не должен превышать 5MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // Сохраняем данные изображения
                uploadedImage = e.target.result;
                
                // Показываем превью
                imagePreview.innerHTML = `<img src="${uploadedImage}" alt="Превью">`;
                
                showTempMessage('🖼️ Изображение загружено', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Загрузка звука
    soundUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Проверяем тип файла
            if (!file.type.startsWith('audio/')) {
                showMessage('Пожалуйста, выберите аудио файл', 'error');
                return;
            }

            // Проверяем размер (максимум 10MB)
            if (file.size > 10 * 1024 * 1024) {
                showMessage('Размер звукового файла не должен превышать 10MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                // Сохраняем данные звука
                uploadedSound = e.target.result;
                
                // Показываем превью плеера
                soundPreview.src = uploadedSound;
                
                showTempMessage('🎵 Звук загружен', 'success');
            };
            reader.readAsDataURL(file);
        }
    });

    // Сохранение контента
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
            showMessage('Загрузите хотя бы один файл', 'error');
            return;
        }

        // Сохраняем в localStorage
        const content = {
            image: uploadedImage || getSavedContent().image,
            sound: uploadedSound || getSavedContent().sound,
            timestamp: new Date().getTime()
        };
        
        localStorage.setItem('edemSid_prank_content', JSON.stringify(content));
        showMessage('✅ Контент успешно сохранен!', 'success');
        
        // Обновляем отображение
        loadSavedContent();
        
        // Очищаем поля
        adminPasswordInput.value = '';
        imageUpload.value = '';
        soundUpload.value = '';
        uploadedImage = null;
        uploadedSound = null;
        
        // Очищаем превью через секунду
        setTimeout(() => {
            imagePreview.innerHTML = '';
            soundPreview.src = '';
        }, 2000);
    });

    // Функция загрузки сохраненного контента
    function loadSavedContent() {
        const content = getSavedContent();
        
        if (content.image) {
            prankImage.src = content.image;
            currentImageStatus.textContent = '✅ Загружена';
            currentImageStatus.className = 'status-loaded';
        } else {
            currentImageStatus.textContent = '❌ Не загружена';
            currentImageStatus.className = 'status-not-loaded';
        }
        
        if (content.sound) {
            prankSound.src = content.sound;
            currentSoundStatus.textContent = '✅ Загружен';
            currentSoundStatus.className = 'status-loaded';
        } else {
            currentSoundStatus.textContent = '❌ Не загружен';
            currentSoundStatus.className = 'status-not-loaded';
        }
    }

    // Получение сохраненного контента
    function getSavedContent() {
        const saved = localStorage.getItem('edemSid_prank_content');
        return saved ? JSON.parse(saved) : { image: '', sound: '' };
    }

    // Воспроизведение звука
    function playPrankSound() {
        if (prankSound.src && !prankSound.src.endsWith('undefined')) {
            prankSound.currentTime = 0;
            prankSound.play().catch(e => {
                console.log('Ошибка воспроизведения:', e);
                showTempMessage('🔇 Нажмите на страницу перед воспроизведением звука', 'error');
            });
        } else {
            showTempMessage('🎵 Сначала загрузите звук в панели управления', 'error');
        }
    }

    // Показать сообщение в админке
    function showMessage(text, type) {
        adminMessage.textContent = text;
        adminMessage.className = `message ${type}`;
        adminMessage.style.display = 'block';
        
        setTimeout(() => {
            adminMessage.style.display = 'none';
        }, 4000);
    }

    // Временное сообщение (для превью)
    function showTempMessage(text, type) {
        const tempMsg = document.createElement('div');
        tempMsg.textContent = text;
        tempMsg.className = `message ${type}`;
        tempMsg.style.position = 'fixed';
        tempMsg.style.top = '20px';
        tempMsg.style.left = '50%';
        tempMsg.style.transform = 'translateX(-50%)';
        tempMsg.style.zIndex = '10000';
        tempMsg.style.minWidth = '300px';
        tempMsg.style.textAlign = 'center';
        
        document.body.appendChild(tempMsg);
        
        setTimeout(() => {
            tempMsg.remove();
        }, 3000);
    }

    // Секретный вход в админку по 5 тапам
    let tapCount = 0;
    let lastTap = 0;
    
    document.addEventListener('click', function(e) {
        // Игнорируем клики по элементам админки
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

    console.log('🎭 EDEM SID Prank System активирован');
    console.log('🔐 Пароль:', ADMIN_PASSWORD);
    console.log('💾 Система загрузки файлов готова');
});