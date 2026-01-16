// spa-router.js - 单页面应用路由系统

/**
 * TWS粉丝站 - SPA路由系统
 * 实现无刷新页面切换，提升用户体验
 */

class SPARouter {
    constructor() {
        this.routes = {};
        this.currentPage = null;
        this.mainContent = document.getElementById('main-content');
        
        // 定义页面路由
        this.defineRoutes();
        
        // 监听hash变化
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // 初始路由处理
        this.handleRoute();
    }
    
    /**
     * 定义应用路由
     */
    defineRoutes() {
        this.routes = {
            'home': {
                title: 'TWS - 首页',
                template: 'home-template',
                render: this.renderHomePage.bind(this)
            },
            'members': {
                title: 'TWS - 成员介绍',
                template: 'members-template',
                render: this.renderMembersPage.bind(this)
            },
            'career': {
                title: 'TWS - 演艺经历',
                template: 'career-template',
                render: this.renderCareerPage.bind(this)
            },
            'awards': {
                title: 'TWS - 获奖记录',
                template: 'awards-template',
                render: this.renderAwardsPage.bind(this)
            },
            'game': {
                title: 'TWS - 记忆游戏',
                template: 'game-template',
                render: this.renderGamePage.bind(this)
            },
            'media': {
                title: 'TWS - 影音中心',
                template: 'media-template',
                render: this.renderMediaPage.bind(this)
            }
        };
    }
    
    /**
     * 处理路由变化
     */
    handleRoute() {
        // 获取hash值，去掉#符号
        const hash = window.location.hash.substring(1) || 'home';
        
        // 获取对应路由
        const route = this.routes[hash];
        
        if (route) {
            // 更新页面标题
            document.title = route.title;
            
            // 更新导航激活状态
            this.updateActiveNav(hash);
            
            // 渲染页面
            this.renderPage(route);
            
            // 更新当前页面
            this.currentPage = hash;
            
            // 初始化页面特定功能
            this.initPageSpecificFeatures(hash);
        } else {
            // 404处理
            this.render404();
        }
    }
    
    /**
     * 渲染页面
     * @param {Object} route - 路由对象
     */
    renderPage(route) {
        // 显示加载状态
        this.showLoading();
        
        // 使用setTimeout模拟异步加载（实际项目中会从服务器获取数据）
        setTimeout(() => {
            // 渲染页面内容
            if (route.render) {
                route.render();
            } else {
                this.renderTemplate(route.template);
            }
            
            // 隐藏加载状态
            this.hideLoading();
            
            // 触发AOS重新初始化（针对动态加载的内容）
            if (typeof AOS !== 'undefined') {
                AOS.refresh();
            }
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log(`%c📍 页面已切换至：${route.title}`, 'color: #1a6bc4; font-weight: bold;');
        }, 300);
    }
    
    /**
     * 渲染首页
     */
    renderHomePage() {
        const html = `
            <section class="hero-section">
                <div class="container">
                    <div class="hero-content" data-aos="fade-up">
                        <h1 class="hero-title">TWENTY FOUR SEVEN WITH US</h1>
                        <p class="hero-subtitle">TWS官方粉丝站 - 24小时与你相伴</p>
                        <p class="hero-description">
                            TWS是PLEDIS Entertainment于2024年1月22日推出的韩国男子音乐组合，队名含义为"TWENTY FOUR SEVEN WITH US"，寓意"一天24小时、一周7天都与我们在一起"。
                        </p>
                        <div class="hero-buttons">
                            <a href="#members" class="btn" data-page="members">认识成员</a>
                            <a href="#media" class="btn btn-secondary" data-page="media">观看MV</a>
                        </div>
                    </div>
                    
                    <div class="hero-image" data-aos="fade-left">
                        <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                             alt="TWS团体照" class="hero-img"
                             loading="lazy">
                    </div>
                </div>
            </section>
            
            <section class="highlights-section">
                <div class="container">
                    <h2 class="section-title" data-aos="fade-up">最新动态</h2>
                    
                    <div class="highlights-grid">
                        <div class="highlight-card" data-aos="fade-up" data-aos-delay="100">
                            <div class="highlight-icon">
                                <i class="ri-album-line"></i>
                            </div>
                            <h3 class="highlight-title">新专辑发布</h3>
                            <p class="highlight-text">第三张迷你专辑《TRY WITH US》已正式发行，主打歌《If I'm S, Can You Be My N?》获得热烈反响。</p>
                        </div>
                        
                        <div class="highlight-card" data-aos="fade-up" data-aos-delay="200">
                            <div class="highlight-icon">
                                <i class="ri-trophy-line"></i>
                            </div>
                            <h3 class="highlight-title">获奖记录</h3>
                            <p class="highlight-text">在第40届金唱片颁奖礼荣获最佳表演奖，这是TWS出道以来获得的第5个主要奖项。</p>
                        </div>
                        
                        <div class="highlight-card" data-aos="fade-up" data-aos-delay="300">
                            <div class="highlight-icon">
                                <i class="ri-calendar-event-line"></i>
                            </div>
                            <h3 class="highlight-title">巡演计划</h3>
                            <p class="highlight-text">2026年世界巡回演唱会"WITH US"正在筹备中，预计将访问亚洲、北美和欧洲多个城市。</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="albums-section">
                <div class="container">
                    <h2 class="section-title" data-aos="fade-up">音乐作品</h2>
                    
                    <div class="swiper albums-swiper" data-aos="fade-up">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide">
                                <div class="album-card">
                                    <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                         alt="Sparkling Blue专辑封面" class="album-cover"
                                         loading="lazy">
                                    <div class="album-info">
                                        <h3 class="album-title">Sparkling Blue</h3>
                                        <p class="album-date">2024.01.22</p>
                                        <p class="album-track">主打歌: plot twist</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="swiper-slide">
                                <div class="album-card">
                                    <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                         alt="SUMMER BEAT!专辑封面" class="album-cover"
                                         loading="lazy">
                                    <div class="album-info">
                                        <h3 class="album-title">SUMMER BEAT!</h3>
                                        <p class="album-date">2024.06.24</p>
                                        <p class="album-track">主打歌: hey! hey!</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="swiper-slide">
                                <div class="album-card">
                                    <img src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                                         alt="TRY WITH US专辑封面" class="album-cover"
                                         loading="lazy">
                                    <div class="album-info">
                                        <h3 class="album-title">TRY WITH US</h3>
                                        <p class="album-date">2025.04.21</p>
                                        <p class="album-track">主打歌: If I'm S, Can You Be My N?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="swiper-pagination"></div>
                    </div>
                </div>
            </section>
        `;
        
        this.mainContent.innerHTML = html;
        
        // 初始化Swiper轮播
        this.initAlbumsSwiper();
    }
    
    /**
     * 渲染成员介绍页面
     */
    renderMembersPage() {
        const members = [
            {
                id: 1,
                name: '申晶㬊',
                englishName: 'SHINYU',
                position: '队长/主唱/领舞',
                birth: '2000.04.14',
                color: '#1a6bc4',
                description: 'TWS的队长，拥有出色的领导能力和扎实的唱功，在舞台上总是展现出强大的气场。'
            },
            {
                id: 2,
                name: '金道勋',
                englishName: 'DOHOON',
                position: '主唱/领舞',
                birth: '2001.07.24',
                color: '#64b5f6',
                description: '拥有清澈嗓音的主唱，同时具备出色的舞蹈实力，是团队中的全能型成员。'
            },
            {
                id: 3,
                name: '崔英宰',
                englishName: 'YOUNGJAE',
                position: '主唱/视觉',
                birth: '2002.03.26',
                color: '#4fc3f7',
                description: '凭借出众的外貌被称为"视觉担当"，同时拥有稳定的唱功和迷人的音色。'
            },
            {
                id: 4,
                name: '韩振',
                englishName: 'HANJIN',
                position: 'Rapper/制作人',
                birth: '2004.11.07',
                color: '#2196f3',
                description: '团队中的主要Rapper，参与多首歌曲的制作，展现出出色的创作能力。'
            },
            {
                id: 5,
                name: '韩志薫',
                englishName: 'JIHOON',
                position: '领舞/Rapper',
                birth: '2006.01.31',
                color: '#03a9f4',
                description: '舞蹈实力突出的领舞，同时也能胜任Rapper的角色，舞台表现力极强。'
            },
            {
                id: 6,
                name: '李炅潣',
                englishName: 'KYUNGMIN',
                position: '忙内/主舞',
                birth: '2006.10.10',
                color: '#00bcd4',
                description: '团队中最年轻的成员，拥有惊人的舞蹈天赋，是TWS的"忙内"(老幺)兼主舞。'
            }
        ];
        
        let membersHTML = '';
        
        members.forEach((member, index) => {
            membersHTML += `
                <div class="member-card" data-aos="fade-up" data-aos-delay="${index * 100}">
                    <div class="member-header" style="background-color: ${member.color}">
                        <div class="member-number">0${member.id}</div>
                        <h3 class="member-name">${member.name}</h3>
                        <p class="member-english">${member.englishName}</p>
                    </div>
                    
                    <div class="member-body">
                        <div class="member-info">
                            <div class="info-item">
                                <span class="info-label">职位</span>
                                <span class="info-value">${member.position}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">生日</span>
                                <span class="info-value">${member.birth}</span>
                            </div>
                        </div>
                        
                        <p class="member-description">${member.description}</p>
                        
                        <div class="member-stats">
                            <div class="stat">
                                <span class="stat-label">唱功</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${80 + member.id * 3}%"></div>
                                </div>
                            </div>
                            <div class="stat">
                                <span class="stat-label">舞蹈</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${75 + member.id * 3}%"></div>
                                </div>
                            </div>
                            <div class="stat">
                                <span class="stat-label">表现力</span>
                                <div class="stat-bar">
                                    <div class="stat-fill" style="width: ${85 + member.id * 2}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        const html = `
            <section class="members-section">
                <div class="container">
                    <div class="section-header" data-aos="fade-up">
                        <h1 class="section-title">TWS成员介绍</h1>
                        <p class="section-subtitle">6位各具特色的成员，共同组成TWENTY FOUR SEVEN WITH US</p>
                    </div>
                    
                    <div class="members-grid">
                        ${membersHTML}
                    </div>
                    
                    <div class="members-stats" data-aos="fade-up">
                        <div class="stat-card">
                            <div class="stat-number">6</div>
                            <div class="stat-label">成员数量</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">2000-2006</div>
                            <div class="stat-label">出生年份跨度</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">3</div>
                            <div class="stat-label">主唱数量</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">3</div>
                            <div class="stat-label">主舞/Rapper数量</div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        this.mainContent.innerHTML = html;
    }
    
    /**
     * 初始化专辑轮播
     */
    initAlbumsSwiper() {
        if (typeof Swiper !== 'undefined') {
            new Swiper('.albums-swiper', {
                slidesPerView: 1,
                spaceBetween: 20,
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    576: {
                        slidesPerView: 1,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    },
                },
            });
        }
    }
    
    /**
     * 更新导航激活状态
     * @param {string} page - 当前页面ID
     */
    updateActiveNav(page) {
        // 移除所有激活状态
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // 添加当前页面激活状态
        const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    /**
     * 显示加载状态
     */
    showLoading() {
        if (this.mainContent) {
            this.mainContent.innerHTML = `
                <div class="page-loading">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                    </div>
                    <p class="loading-text">加载中...</p>
                </div>
            `;
        }
    }
    
    /**
     * 隐藏加载状态
     */
    hideLoading() {
        // 加载状态会被新内容替换
    }
    
    /**
     * 初始化页面特定功能
     * @param {string} page - 页面ID
     */
    initPageSpecificFeatures(page) {
        switch(page) {
            case 'game':
                // 初始化记忆游戏
                if (typeof initMemoryGame === 'function') {
                    initMemoryGame();
                }
                break;
            case 'media':
                // 初始化视频播放器
                this.initVideoPlayers();
                break;
        }
    }
    
    /**
     * 渲染404页面
     */
    render404() {
        const html = `
            <section class="not-found-section">
                <div class="container">
                    <div class="not-found-content" data-aos="fade-up">
                        <h1 class="not-found-title">404</h1>
                        <p class="not-found-text">抱歉，您访问的页面不存在。</p>
                        <a href="#home" class="btn" data-page="home">返回首页</a>
                    </div>
                </div>
            </section>
        `;
        
        this.mainContent.innerHTML = html;
    }
}

// 初始化SPA路由
function initSPARouter() {
    new SPARouter();
}