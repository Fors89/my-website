document.addEventListener('DOMContentLoaded', () => {
    // Элементы интерфейса
    const fileUpload = document.getElementById('file-upload');
    const beforeImg = document.querySelector('.result-image.before img');
    const afterImg = document.querySelector('.result-image.after img');
    const processButton = document.getElementById('process-button');
    const loading = document.getElementById('loading');
    const downloadButton = document.getElementById('download-button');

    // Проверка, что элементы найдены
    if (!fileUpload || !beforeImg || !afterImg || !processButton || !loading || !downloadButton) {
        console.error('Один или несколько элементов не найдены!', {
            fileUpload, beforeImg, afterImg, processButton, loading, downloadButton
        });
        return;
    }

    // Обработка загрузки файла
    fileUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        console.log('Выбран файл:', file);
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (beforeImg) {
                    console.log('Устанавливаем изображение:', event.target.result);
                    beforeImg.src = event.target.result;
                    beforeImg.style.display = 'block';
                    beforeImg.style.maxWidth = '200px';
                    afterImg.style.display = 'none';
                    downloadButton.style.display = 'none'; // Скрываем кнопку при загрузке нового файла
                } else {
                    console.error('Элемент beforeImg не найден в DOM');
                    alert('Ошибка: изображение не может быть отображено. Проверь консоль (F12).');
                }
            };
            reader.onerror = () => {
                console.error('Ошибка чтения файла');
                alert('Ошибка при загрузке изображения!');
            };
            reader.readAsDataURL(file);
        } else {
            alert('Пожалуйста, выберите изображение (JPG, PNG, WEBP)!');
            fileUpload.value = '';
        }
    });

    // Обработка кнопки "Обработать"
    processButton.addEventListener('click', async () => {
        const file = fileUpload.files[0];
        if (!file) {
            alert('Пожалуйста, выберите изображение!');
            return;
        }

        loading.style.display = 'block';
        afterImg.style.display = 'none';
        downloadButton.style.display = 'none';

        const formData = new FormData();
        formData.append('image_file', file);
        formData.append('size', 'auto');

        try {
            const response = await fetch('https://api.remove.bg/v1.0/removebg', {
                method: 'POST',
                headers: {
                    'X-Api-Key': '5p8B9y7sXubcTejLrNpJeaPQ'
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Ошибка API: ${response.status}`);
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            afterImg.src = url;
            afterImg.style.display = 'block';
            downloadButton.style.display = 'inline-block'; // Показываем кнопку после обработки
            downloadButton.dataset.url = url; // Сохраняем URL для скачивания
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Не удалось обработать изображение. Проверь консоль (F12).');
        } finally {
            loading.style.display = 'none';
            fileUpload.value = '';
        }
    });

    // Обработка кнопки "Скачать"
    downloadButton.addEventListener('click', () => {
        const url = downloadButton.dataset.url;
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            a.download = 'processed_image.png'; // Имя файла по умолчанию
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            alert('Ошибка: файл для скачивания не найден.');
        }
    });
});

async function removeBg(imageFile) {
    const formData = new FormData();
    formData.append('image_file', imageFile);
    
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
            'X-Api-Key': '5p8B9y7sXubcTejLrNpJeaPQ',
        },
        bodyclinic: formData,
    });
    
    const result = await response.blob();
    return URL.createObjectURL(result);
}