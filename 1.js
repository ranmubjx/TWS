
'use strict';

document.addEventListener('DOMContentLoaded', function() {
    console.log('%c🎵 TWS粉丝站已加载完毕！%c\nTWENTY FOUR SEVEN WITH US!', 
        'color: #1a6bc4; font-size: 16px; font-weight: bold;', 
        'color: #64b5f6; font-size: 14px;');

    initApp();
});

function initApp() {

    setTimeout(() => {
        const skeletonLoader = document.getElementById('skeleton-loader');
        if (skeletonLoader) {
            skeletonLoader.style.opacity = '0';
            setTimeout(() => {
                skeletonLoader.style.display = 'none';
            }, 300);
        }
    }, 800);

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
    initTheme();
    initNavigation();
    initMusicPlayer();
    consoleWelcomeMessage();
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = 'light';
    
    if (storedTheme) {
        currentTheme = storedTheme;
    } else if (systemPrefersDark) {
        currentTheme = 'dark';
    }
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.style.transform = 'rotate(360deg) scale(1.1)';
            setTimeout(() => {
                this.style.transform = '';
            }, 300);
            
            console.log(`%c🎨 主题已切换为：${newTheme === 'dark' ? '深色模式' : '浅色模式'}`, 
                `color: ${newTheme === 'dark' ? '#64b5f6' : '#f59e0b'}; font-weight: bold;`);
        });
    }
}

function initNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
 
            const hamburger = this.querySelector('.hamburger');
            if (hamburger) {
                hamburger.classList.toggle('active');
            }
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    
                    const hamburger = navToggle.querySelector('.hamburger');
                    if (hamburger) {
                        hamburger.classList.remove('active');
                    }
                }
            });
        });
        
        document.addEventListener('click', function(event) {
            if (window.innerWidth < 992 && 
                navMenu.classList.contains('active') &&
                !navToggle.contains(event.target) &&
                !navMenu.contains(event.target)) {
                
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                
                const hamburger = navToggle.querySelector('.hamburger');
                if (hamburger) {
                    hamburger.classList.remove('active');
                }
            }
        });
    }
}

function initMusicPlayer() {
    const playerToggle = document.getElementById('music-player-toggle');
    const playerClose = document.getElementById('player-close');
    const musicPlayer = document.getElementById('music-player');
    const playBtn = document.getElementById('play-btn');
    const progressBar = document.getElementById('progress-bar');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeBtn = document.getElementById('volume-btn');
    let isPlaying = false;
    let currentTime = 0;
    let duration = 205; // 3分25秒
 
    if (playerToggle && musicPlayer) {
        playerToggle.addEventListener('click', function() {
            musicPlayer.classList.toggle('active');

            if (musicPlayer.classList.contains('active') && !isPlaying) {
                togglePlay();
            }
        });
    }

    if (playerClose && musicPlayer) {
        playerClose.addEventListener('click', function() {
            musicPlayer.classList.remove('active');

            if (isPlaying) {
                togglePlay();
            }
        });
    }
  
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (progressBar) {
        progressBar.addEventListener('input', function() {
            currentTime = (this.value / 100) * duration;
            updateTimeDisplay();
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            const volume = this.value;
            updateVolumeIcon(volume);
        });
    }

    if (volumeBtn) {
        volumeBtn.addEventListener('click', function() {
            const currentVolume = volumeSlider.value;
            
            if (currentVolume > 0) {
                volumeSlider.dataset.lastVolume = currentVolume;
                volumeSlider.value = 0;
                updateVolumeIcon(0);
            } else {
                const lastVolume = volumeSlider.dataset.lastVolume || 80;
                volumeSlider.value = lastVolume;
                updateVolumeIcon(lastVolume);
            }
        });
    }

    function simulatePlayback() {
        if (isPlaying && currentTime < duration) {
            currentTime += 0.5;
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            updateTimeDisplay();
        }
    }
 
    setInterval(simulatePlayback, 500);

    function togglePlay() {
        isPlaying = !isPlaying;
        
        if (playBtn) {
            const icon = playBtn.querySelector('i');
            if (icon) {
                icon.className = isPlaying ? 'ri-pause-fill' : 'ri-play-fill';
            }
        }
        
        console.log(`%c🎵 ${isPlaying ? '正在播放: plot twist - TWS' : '播放已暂停'}`, 
            `color: ${isPlaying ? '#10b981' : '#ef4444'}; font-weight: bold;`);
    }

    function updateTimeDisplay() {
        const currentTimeEl = document.querySelector('.current-time');
        const durationEl = document.querySelector('.duration');
        
        if (currentTimeEl) {
            currentTimeEl.textContent = formatTime(currentTime);
        }
        
        if (durationEl) {
            durationEl.textContent = formatTime(duration);
        }
    }

    function updateVolumeIcon(volume) {
        if (!volumeBtn) return;
        
        const icon = volumeBtn.querySelector('i');
        if (!icon) return;
        
        if (volume == 0) {
            icon.className = 'ri-volume-mute-line';
        } else if (volume < 50) {
            icon.className = 'ri-volume-down-line';
        } else {
            icon.className = 'ri-volume-up-line';
        }
    }
    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    updateTimeDisplay();
}

function consoleWelcomeMessage() {
    const styles = [
        'color: #1a6bc4',
        'color: #64b5f6',
        'color: #4fc3f7',
        'color: #1a6bc4',
        'color: #64b5f6'
    ];
    
    console.log(`%c
    ████████╗██╗    ██╗███████╗
    ╚══██╔══╝██║    ██║██╔════╝
       ██║   ██║ █╗ ██║███████╗
       ██║   ██║███╗██║╚════██║
       ██║   ╚███╔███╔╝███████║
       ╚═╝    ╚══╝╚══╝ ╚══════╝
    `, 'color: #1a6bc4; font-weight: bold;');
    
    console.log('%c欢迎来到TWS官方粉丝站！%c\n\n成员信息：', styles[0], styles[1]);
    console.table([
        { 姓名: '申晶㬊 (SHINYU)', 职位: '队长/主唱/领舞', 生日: '2000.04.14' },
        { 姓名: '金道勋 (DOHOON)', 职位: '主唱/领舞', 生日: '2001.07.24' },
        { 姓名: '崔英宰 (YOUNGJAE)', 职位: '主唱/视觉', 生日: '2002.03.26' },
        { 姓名: '韩振 (HANJIN)', 职位: 'Rapper/制作人', 生日: '2004.11.07' },
        { 姓名: '韩志薫 (JIHOON)', 职位: '领舞/Rapper', 生日: '2006.01.31' },
        { 姓名: '李炅潣 (KYUNGMIN)', 职位: '忙内/主舞', 生日: '2006.10.10' }
    ]);
    
    console.log('%c\n代表作品：', styles[2]);
    console.table([
        { 专辑: 'Sparkling Blue', 发行日期: '2024.01.22', 主打歌: 'plot twist' },
        { 专辑: 'SUMMER BEAT!', 发行日期: '2024.06.24', 主打歌: 'hey! hey!' },
        { 专辑: 'TRY WITH US', 发行日期: '2025.04.21', 主打歌: 'If I\'m S, Can You Be My N?' }
    ]);
    
    console.log('%c\n技术栈：', styles[3]);
    console.table([
        { 前端: 'HTML5, CSS3, JavaScript (ES6+)' },
        { 框架: '原生技术 (教学目的)' },
        { 工具: 'Git, Figma, Swiper, AOS' },
        { 设计: '蓝白清新Ins风格, 响应式设计' }
    ]);
    
    console.log('%c\n\n🔄 页面功能已完全加载，享受浏览吧！', styles[4]);
}

function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
 
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#f59e0b';
    }

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApp,
        initTheme,
        initNavigation,
        initMusicPlayer,
        showNotification,
        debounce,
        throttle
    };
}