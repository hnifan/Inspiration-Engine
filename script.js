// 全局变量
let currentSection = 'home';
let ideas = [];
let projects = [];
let researchData = [];

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    setupEventListeners();
});

// 初始化应用
function initializeApp() {
    // 设置导航链接点击事件
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });

    // 设置搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // 设置筛选标签
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            filterResearch(this.dataset.category);
        });
    });
}

// 显示指定区域
function showSection(sectionId) {
    // 隐藏所有区域
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // 显示目标区域
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;
    }

    // 更新导航状态
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // 根据区域加载相应内容
    switch(sectionId) {
        case 'explore':
            renderResearchGrid();
            break;
        case 'collaborate':
            renderProjectList();
            break;
        case 'insights':
            renderInsights();
            break;
        case 'profile':
            renderProfile();
            break;
    }
}

// 加载示例数据
function loadSampleData() {
    // 示例研究数据
    researchData = [
        {
            id: 1,
            title: "基于深度学习的蛋白质结构预测",
            author: "李教授",
            category: "ai",
            description: "利用深度神经网络预测蛋白质三维结构，为药物设计提供新的思路。",
            tags: ["深度学习", "蛋白质", "生物信息学"],
            date: "2024-03-15",
            participants: 8
        },
        {
            id: 2,
            title: "量子计算在密码学中的应用",
            author: "王研究员",
            category: "physics",
            description: "探索量子算法在现代密码系统中的潜在威胁和机遇。",
            tags: ["量子计算", "密码学", "信息安全"],
            date: "2024-03-12",
            participants: 5
        },
        {
            id: 3,
            title: "CRISPR基因编辑技术的伦理思考",
            author: "张博士",
            category: "bio",
            description: "从多学科角度分析基因编辑技术的伦理问题和社会影响。",
            tags: ["CRISPR", "基因编辑", "生物伦理"],
            date: "2024-03-10",
            participants: 12
        },
        {
            id: 4,
            title: "机器学习在材料科学中的创新应用",
            author: "陈教授",
            category: "ai",
            description: "运用机器学习算法加速新材料的发现和性能预测。",
            tags: ["机器学习", "材料科学", "预测模型"],
            date: "2024-03-08",
            participants: 6
        },
        {
            id: 5,
            title: "区块链技术在学术诚信中的应用",
            author: "刘副教授",
            category: "cs",
            description: "探索区块链技术如何保障学术成果的原创性和可追溯性。",
            tags: ["区块链", "学术诚信", "去中心化"],
            date: "2024-03-05",
            participants: 9
        },
        {
            id: 6,
            title: "纳米材料在环境治理中的应用",
            author: "赵研究员",
            category: "chemistry",
            description: "开发新型纳米材料用于水污染治理和空气净化。",
            tags: ["纳米材料", "环境治理", "绿色化学"],
            date: "2024-03-03",
            participants: 7
        }
    ];

    // 示例项目数据
    projects = [
        {
            id: 1,
            title: "智能教育平台开发",
            description: "基于AI的个性化学习平台",
            type: "applied",
            members: 6,
            progress: 75,
            lastUpdate: "2024-03-15"
        },
        {
            id: 2,
            title: "可持续能源材料研究",
            description: "新型太阳能电池材料的开发",
            type: "research",
            members: 4,
            progress: 45,
            lastUpdate: "2024-03-14"
        },
        {
            id: 3,
            title: "生物医学图像分析系统",
            description: "AI辅助医学影像诊断",
            type: "interdisciplinary",
            members: 8,
            progress: 60,
            lastUpdate: "2024-03-13"
        }
    ];

    // 示例灵感数据
    ideas = [
        {
            id: 1,
            title: "量子机器学习算法",
            description: "结合量子计算和机器学习的新算法",
            category: "ai",
            tags: ["量子计算", "机器学习"],
            date: "2024-03-15"
        },
        {
            id: 2,
            title: "生物启发的材料设计",
            description: "模仿自然界的材料结构设计新材料",
            category: "bio",
            tags: ["仿生学", "材料科学"],
            date: "2024-03-14"
        }
    ];
}

// 设置事件监听器
function setupEventListeners() {
    // 模态框关闭事件
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target);
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

// 渲染研究网格
function renderResearchGrid() {
    const grid = document.getElementById('researchGrid');
    if (!grid) return;

    grid.innerHTML = researchData.map(research => `
        <div class="research-card" data-category="${research.category}">
            <div class="research-card-header">
                <h3>${research.title}</h3>
                <div class="research-card-meta">
                    <span><i class="fas fa-user"></i> ${research.author}</span>
                    <span><i class="fas fa-users"></i> ${research.participants} 人参与</span>
                    <span><i class="fas fa-calendar"></i> ${research.date}</span>
                </div>
            </div>
            <div class="research-card-body">
                <p>${research.description}</p>
                <div class="research-tags">
                    ${research.tags.map(tag => `<span class="research-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// 筛选研究
function filterResearch(category) {
    const cards = document.querySelectorAll('.research-card');
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 搜索处理
function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.research-card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.research-tag'))
            .map(tag => tag.textContent.toLowerCase()).join(' ');
        
        if (title.includes(query) || description.includes(query) || tags.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// 渲染项目列表
function renderProjectList() {
    const projectList = document.getElementById('projectList');
    if (!projectList) return;

    projectList.innerHTML = projects.map(project => `
        <div class="project-item">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-meta">
                <span><i class="fas fa-users"></i> ${project.members} 成员</span>
                <span><i class="fas fa-chart-line"></i> ${project.progress}% 完成</span>
                <span><i class="fas fa-clock"></i> ${project.lastUpdate}</span>
            </div>
        </div>
    `).join('');
}

// 渲染洞察数据
function renderInsights() {
    // 这里可以添加图表渲染逻辑
    const trendChart = document.getElementById('trendChart');
    const networkGraph = document.getElementById('networkGraph');
    
    if (trendChart) {
        trendChart.innerHTML = '<p>📈 研究趋势图表</p>';
    }
    
    if (networkGraph) {
        networkGraph.innerHTML = '<p>🕸️ 学科关系网络</p>';
    }
}

// 渲染个人资料
function renderProfile() {
    const userIdeas = document.getElementById('userIdeas');
    const userProjects = document.getElementById('userProjects');
    
    if (userIdeas) {
        userIdeas.innerHTML = ideas.map(idea => `
            <div class="idea-item">
                <h4>${idea.title}</h4>
                <p>${idea.description}</p>
                <div class="idea-meta">
                    <span>${idea.date}</span>
                    <div class="research-tags">
                        ${idea.tags.map(tag => `<span class="research-tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    if (userProjects) {
        userProjects.innerHTML = projects.slice(0, 2).map(project => `
            <div class="project-item-small">
                <h4>${project.title}</h4>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span>${project.progress}% 完成</span>
                </div>
            </div>
        `).join('');
    }
}

// 打开灵感记录模态框
function openIdeaModal() {
    const modal = document.getElementById('ideaModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 关闭灵感记录模态框
function closeIdeaModal() {
    const modal = document.getElementById('ideaModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // 清空表单
        document.getElementById('ideaForm').reset();
    }
}

// 保存灵感
function saveIdea() {
    const title = document.getElementById('ideaTitle').value;
    const description = document.getElementById('ideaDescription').value;
    const category = document.getElementById('ideaCategory').value;
    const tags = document.getElementById('ideaTags').value.split(',').map(tag => tag.trim());
    
    if (!title || !description) {
        alert('请填写标题和描述');
        return;
    }
    
    const newIdea = {
        id: ideas.length + 1,
        title,
        description,
        category,
        tags,
        date: new Date().toISOString().split('T')[0]
    };
    
    ideas.push(newIdea);
    closeIdeaModal();
    
    // 显示成功消息
    showNotification('灵感已保存！', 'success');
    
    // 如果当前在个人页面，更新显示
    if (currentSection === 'profile') {
        renderProfile();
    }
}

// 创建新项目
function createNewProject() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// 关闭项目模态框
function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        document.getElementById('projectForm').reset();
    }
}

// 创建项目
function createProject() {
    const title = document.getElementById('projectTitle').value;
    const description = document.getElementById('projectDescription').value;
    const type = document.getElementById('projectType').value;
    
    if (!title || !description) {
        alert('请填写项目名称和描述');
        return;
    }
    
    const newProject = {
        id: projects.length + 1,
        title,
        description,
        type,
        members: 1,
        progress: 0,
        lastUpdate: new Date().toISOString().split('T')[0]
    };
    
    projects.push(newProject);
    closeProjectModal();
    
    showNotification('项目已创建！', 'success');
    
    if (currentSection === 'collaborate') {
        renderProjectList();
    }
}

// 通用模态框关闭
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 添加通知样式
    notification.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 2rem;
        background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 防抖函数
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

// 添加通知动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 模拟实时数据更新
setInterval(() => {
    // 随机更新一些数据
    const metrics = document.querySelectorAll('.metric-value');
    metrics.forEach(metric => {
        const currentValue = parseInt(metric.textContent.replace(',', ''));
        const newValue = currentValue + Math.floor(Math.random() * 5);
        metric.textContent = newValue.toLocaleString();
    });
}, 30000); // 每30秒更新一次

// 添加页面滚动效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});