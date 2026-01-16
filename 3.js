// memory-game.js - TWS记忆配对游戏

/**
 * TWS记忆配对游戏
 * 这是一个卡牌记忆游戏，玩家需要找到所有匹配的TWS成员卡牌
 */

class MemoryGame {
    constructor() {
        this.gameContainer = null;
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.totalPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.time = 0;
        this.timer = null;
        this.isPlaying = false;
        
        // TWS成员数据
        this.members = [
            { id: 1, name: 'SHINYU', image: 'assets/members/shinyu.jpg' },
            { id: 2, name: 'DOHOON', image: 'assets/members/doohon.jpg' },
            { id: 3, name: 'YOUNGJAE', image: 'assets/members/youngjae.jpg' },
            { id: 4, name: 'HANJIN', image: 'assets/members/hanjin.jpg' },
            { id: 5, name: 'JIHOON', image: 'assets/members/jihoon.jpg' },
            { id: 6, name: 'KYUNGMIN', image: 'assets/members/kyungmin.jpg' }
        ];
    }
    
    /**
     * 初始化游戏
     */
    init() {
        // 获取游戏容器
        this.gameContainer = document.getElementById('game-container');
        
        if (!this.gameContainer) {
            console.error('游戏容器未找到！');
            return;
        }
        
        // 渲染游戏界面
        this.renderGame();
        
        // 初始化游戏数据
        this.setupGame();
        
        // 开始游戏计时
        this.startTimer();
        
        console.log('%c🎮 TWS记忆游戏已初始化！', 'color: #1a6bc4; font-weight: bold;');
    }
    
    /**
     * 渲染游戏界面
     */
    renderGame() {
        const html = `
            <div class="game-header" data-aos="fade-down">
                <h1 class="game-title">TWS记忆配对游戏</h1>
                <p class="game-description">找出所有匹配的TWS成员卡牌，考验你的记忆力！</p>
            </div>
            
            <div class="game-stats" data-aos="fade-up">
                <div class="stat">
                    <div class="stat-icon">
                        <i class="ri-time-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value" id="time-value">0s</div>
                        <div class="stat-label">时间</div>
                    </div>
                </div>
                
                <div class="stat">
                    <div class="stat-icon">
                        <i class="ri-refresh-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value" id="moves-value">0</div>
                        <div class="stat-label">移动次数</div>
                    </div>
                </div>
                
                <div class="stat">
                    <div class="stat-icon">
                        <i class="ri-star-line"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-value" id="score-value">0</div>
                        <div class="stat-label">得分</div>
                    </div>
                </div>
            </div>
            
            <div class="game-controls" data-aos="fade-up">
                <button class="btn" id="start-game">开始游戏</button>
                <button class="btn btn-secondary" id="restart-game">重新开始</button>
                <button class="btn btn-secondary" id="change-difficulty">切换难度</button>
            </div>
            
            <div class="game-board" id="game-board" data-aos="fade-up">
                <!-- 游戏卡片将在这里动态生成 -->
            </div>
            
            <div class="game-result" id="game-result">
                <!-- 游戏结果将在这里显示 -->
            </div>
        `;
        
        this.gameContainer.innerHTML = html;
        
        // 添加事件监听
        this.addEventListeners();
    }
    
    /**
     * 设置游戏
     */
    setupGame() {
        // 确定游戏难度（卡片数量）
        const difficulty = localStorage.getItem('memory-difficulty') || 'medium';
        let cardCount;
        
        switch(difficulty) {
            case 'easy':
                cardCount = 8; // 4对
                break;
            case 'hard':
                cardCount = 16; // 8对
                break;
            case 'medium':
            default:
                cardCount = 12; // 6对
                break;
        }
        
        // 创建卡片数组
        this.cards = [];
        this.totalPairs = cardCount / 2;
        
        // 选择成员（根据卡片数量）
        const selectedMembers = this.members.slice(0, this.totalPairs);
        
        // 为每个成员创建一对卡片
        selectedMembers.forEach(member => {
            this.cards.push({ ...member, matched: false });
            this.cards.push({ ...member, matched: false });
        });
        
        // 洗牌算法 - Fisher-Yates洗牌算法
        this.shuffleCards();
        
        // 重置游戏状态
        this.resetGame();
        
        // 渲染卡片
        this.renderCards();
    }
    
    /**
     * 洗牌算法
     */
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
    
    /**
     * 渲染卡片到游戏板
     */
    renderCards() {
        const gameBoard = document.getElementById('game-board');
        
        if (!gameBoard) return;
        
        let cardsHTML = '';
        
        this.cards.forEach((card, index) => {
            cardsHTML += `
                <div class="memory-card" data-index="${index}" data-id="${card.id}">
                    <div class="card-front">
                        <div class="card-image">
                            <i class="ri-user-smile-line"></i>
                        </div>
                        <div class="card-name">TWS</div>
                    </div>
                    <div class="card-back">
                        <div class="card-image">
                            <i class="ri-user-star-line"></i>
                        </div>
                        <div class="card-name">${card.name}</div>
                    </div>
                </div>
            `;
        });
        
        gameBoard.innerHTML = cardsHTML;
        
        // 根据卡片数量调整网格布局
        const cardCount = this.cards.length;
        let gridColumns;
        
        if (cardCount <= 8) {
            gridColumns = 4;
        } else if (cardCount <= 12) {
            gridColumns = 4;
        } else {
            gridColumns = 4;
        }
        
        gameBoard.style.gridTemplateColumns = `repeat(${gridColumns}, 1fr)`;
    }
    
    /**
     * 重置游戏状态
     */
    resetGame() {
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.score = 0;
        this.time = 0;
        this.isPlaying = false;
        
        // 重置所有卡片状态
        this.cards.forEach(card => {
            card.matched = false;
        });
        
        // 更新UI
        this.updateStats();
        
        // 停止计时器
        this.stopTimer();
    }
    
    /**
     * 开始游戏
     */
    startGame() {
        this.isPlaying = true;
        
        // 重置游戏
        this.resetGame();
        
        // 重新洗牌
        this.shuffleCards();
        
        // 重新渲染卡片
        this.renderCards();
        
        // 开始计时
        this.startTimer();
        
        console.log('%c🎮 游戏开始！', 'color: #10b981; font-weight: bold;');
    }
    
    /**
     * 开始计时器
     */
    startTimer() {
        this.stopTimer(); // 先停止现有的计时器
        
        this.timer = setInterval(() => {
            if (this.isPlaying) {
                this.time++;
                this.updateStats();
            }
        }, 1000);
    }
    
    /**
     * 停止计时器
     */
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    /**
     * 更新游戏统计
     */
    updateStats() {
        // 更新时间显示
        const timeValue = document.getElementById('time-value');
        if (timeValue) {
            timeValue.textContent = `${this.time}s`;
        }
        
        // 更新移动次数
        const movesValue = document.getElementById('moves-value');
        if (movesValue) {
            movesValue.textContent = this.moves;
        }
        
        // 更新得分
        const scoreValue = document.getElementById('score-value');
        if (scoreValue) {
            // 得分计算：基础分 + 时间奖励 - 移动惩罚
            const baseScore = this.matchedPairs * 100;
            const timeBonus = Math.max(0, 300 - this.time) * 2;
            const movePenalty = this.moves * 5;
            this.score = baseScore + timeBonus - movePenalty;
            
            scoreValue.textContent = Math.max(0, this.score);
        }
    }
    
    /**
     * 处理卡片点击
     * @param {HTMLElement} cardElement - 被点击的卡片元素
     */
    handleCardClick(cardElement) {
        // 游戏未开始或已结束时不处理
        if (!this.isPlaying) return;
        
        const cardIndex = parseInt(cardElement.dataset.index);
        const card = this.cards[cardIndex];
        
        // 如果卡片已匹配或已翻开，不处理
        if (card.matched || this.flippedCards.includes(cardIndex)) return;
        
        // 如果已经翻开了两张卡片，不处理
        if (this.flippedCards.length >= 2) return;
        
        // 翻开卡片
        this.flipCard(cardElement, cardIndex);
        
        // 添加到已翻开卡片列表
        this.flippedCards.push(cardIndex);
        
        // 如果翻开了两张卡片，检查是否匹配
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            
            const firstCardIndex = this.flippedCards[0];
            const secondCardIndex = this.flippedCards[1];
            
            const firstCard = this.cards[firstCardIndex];
            const secondCard = this.cards[secondCardIndex];
            
            // 检查是否匹配
            if (firstCard.id === secondCard.id) {
                // 匹配成功
                this.handleMatch(firstCardIndex, secondCardIndex);
            } else {
                // 不匹配，翻回卡片
                this.handleMismatch(firstCardIndex, secondCardIndex);
            }
        }
    }
    
    /**
     * 翻开卡片
     * @param {HTMLElement} cardElement - 卡片元素
     * @param {number} cardIndex - 卡片索引
     */
    flipCard(cardElement, cardIndex) {
        cardElement.classList.add('flipped');
        
        // 添加翻转动画
        cardElement.style.transform = 'rotateY(180deg)';
        
        // 播放音效（如果可用）
        this.playSound('flip');
    }
    
    /**
     * 处理匹配成功
     * @param {number} firstIndex - 第一张卡片索引
     * @param {number} secondIndex - 第二张卡片索引
     */
    handleMatch(firstIndex, secondIndex) {
        // 标记卡片为已匹配
        this.cards[firstIndex].matched = true;
        this.cards[secondIndex].matched = true;
        
        this.matchedPairs++;
        
        // 播放匹配成功音效
        this.playSound('match');
        
        // 添加匹配成功动画
        const firstCard = document.querySelector(`.memory-card[data-index="${firstIndex}"]`);
        const secondCard = document.querySelector(`.memory-card[data-index="${secondIndex}"]`);
        
        if (firstCard && secondCard) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
        }
        
        // 清空已翻开卡片列表
        this.flippedCards = [];
        
        // 检查游戏是否结束
        if (this.matchedPairs === this.totalPairs) {
            this.endGame();
        }
    }
    
    /**
     * 处理不匹配
     * @param {number} firstIndex - 第一张卡片索引
     * @param {number} secondIndex - 第二张卡片索引
     */
    handleMismatch(firstIndex, secondIndex) {
        // 播放不匹配音效
        this.playSound('mismatch');
        
        // 延迟后翻回卡片
        setTimeout(() => {
            const firstCard = document.querySelector(`.memory-card[data-index="${firstIndex}"]`);
            const secondCard = document.querySelector(`.memory-card[data-index="${secondIndex}"]`);
            
            if (firstCard && secondCard) {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                
                firstCard.style.transform = '';
                secondCard.style.transform = '';
            }
            
            // 清空已翻开卡片列表
            this.flippedCards = [];
        }, 1000);
    }
    
    /**
     * 结束游戏
     */
    endGame() {
        this.isPlaying = false;
        this.stopTimer();
        
        // 计算最终得分
        const finalScore = Math.max(0, this.score);
        
        // 显示结果
        this.showResult(finalScore);
        
        console.log(`%c🎮 游戏结束！得分：${finalScore}`, 'color: #f59e0b; font-weight: bold;');
    }
    
    /**
     * 显示游戏结果
     * @param {number} score - 最终得分
     */
    showResult(score) {
        const gameResult = document.getElementById('game-result');
        
        if (!gameResult) return;
        
        let message = '';
        let emoji = '🎉';
        
        if (score >= 1000) {
            message = '太棒了！你是TWS超级粉丝！';
            emoji = '🏆';
        } else if (score >= 700) {
            message = '厉害！你对TWS成员非常了解！';
            emoji = '⭐';
        } else if (score >= 400) {
            message = '不错！继续努力成为TWS粉丝吧！';
            emoji = '👍';
        } else {
            message = '加油！多了解一下TWS成员吧！';
            emoji = '💪';
        }
        
        const html = `
            <div class="result-content" data-aos="fade-up">
                <div class="result-emoji">${emoji}</div>
                <h2 class="result-title">游戏完成！</h2>
                <div class="result-stats">
                    <div class="result-stat">
                        <span class="stat-label">用时</span>
                        <span class="stat-value">${this.time}秒</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">移动次数</span>
                        <span class="stat-value">${this.moves}次</span>
                    </div>
                    <div class="result-stat">
                        <span class="stat-label">得分</span>
                        <span class="stat-value">${score}分</span>
                    </div>
                </div>
                <p class="result-message">${message}</p>
                <button class="btn" id="play-again">再玩一次</button>
            </div>
        `;
        
        gameResult.innerHTML = html;
        
        // 添加再玩一次按钮事件
        const playAgainBtn = document.getElementById('play-again');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => {
                this.startGame();
                gameResult.innerHTML = '';
            });
        }
    }
    
    /**
     * 播放音效
     * @param {string} type - 音效类型
     */
    playSound(type) {
        // 这里可以添加实际音效
        // 由于是示例，我们只记录到控制台
        console.log(`播放音效: ${type}`);
    }
    
    /**
     * 添加事件监听
     */
    addEventListeners() {
        // 开始游戏按钮
        const startGameBtn = document.getElementById('start-game');
        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }
        
        // 重新开始按钮
        const restartGameBtn = document.getElementById('restart-game');
        if (restartGameBtn) {
            restartGameBtn.addEventListener('click', () => this.startGame());
        }
        
        // 切换难度按钮
        const changeDifficultyBtn = document.getElementById('change-difficulty');
        if (changeDifficultyBtn) {
            changeDifficultyBtn.addEventListener('click', () => this.changeDifficulty());
        }
        
        // 卡片点击事件（使用事件委托）
        const gameBoard = document.getElementById('game-board');
        if (gameBoard) {
            gameBoard.addEventListener('click', (e) => {
                const cardElement = e.target.closest('.memory-card');
                if (cardElement) {
                    this.handleCardClick(cardElement);
                }
            });
        }
    }
    
    /**
     * 切换游戏难度
     */
    changeDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentDifficulty = localStorage.getItem('memory-difficulty') || 'medium';
        const currentIndex = difficulties.indexOf(currentDifficulty);
        const nextIndex = (currentIndex + 1) % difficulties.length;
        const nextDifficulty = difficulties[nextIndex];
        
        // 保存难度设置
        localStorage.setItem('memory-difficulty', nextDifficulty);
        
        // 重新设置游戏
        this.setupGame();
        
        // 显示难度提示
        const difficultyNames = {
            'easy': '简单 (4对)',
            'medium': '中等 (6对)',
            'hard': '困难 (8对)'
        };
        
        console.log(`%c🎮 难度已切换为：${difficultyNames[nextDifficulty]}`, 'color: #8b5cf6; font-weight: bold;');
        
        // 显示通知
        this.showNotification(`难度已切换为：${difficultyNames[nextDifficulty]}`);
    }
    
    /**
     * 显示通知
     * @param {string} message - 通知消息
     */
    showNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示通知
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 3秒后隐藏并移除通知
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// 初始化记忆游戏
function initMemoryGame() {
    const game = new MemoryGame();
    game.init();
}