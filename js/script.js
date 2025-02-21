document.addEventListener('DOMContentLoaded', function () {
    // 封装获取 DOM 元素的函数
    function getElement(id) {
        return document.getElementById(id);
    }

    const setup = getElement('setup');
    const bpContainer = getElement('bp-container');
    const startButton = getElement('start');
    const blueBan = getElement('blue-ban');
    const redBan = getElement('red-ban');
    const bluePick = getElement('blue-pick');
    const redPick = getElement('red-pick');
    const blueUsed = getElement('blue-used');
    const redUsed = getElement('red-used');
    const heroTypeList = getElement('hero-type-list');
    const heroList = getElement('hero-list');
    const undoButton = getElement('undo');
    const endButtons = getElement('end-buttons');
    const swapButtons = getElement('swap-buttons');
    const saveButton = getElement('save');
    const deleteButton = getElement('delete');
    const swapButton = getElement('swap');
    const noSwapButton = getElement('no-swap');
    const finishButton = getElement('finish');
    const backToTypesButton = getElement('back-to-types');

    const currentPhaseDisplay = document.createElement('div');
    currentPhaseDisplay.id = 'current-phase';
    currentPhaseDisplay.style.textAlign = 'center';
    currentPhaseDisplay.style.marginBottom = '10px';
    document.querySelector('#bp-container').insertBefore(currentPhaseDisplay, document.querySelector('#bp-display'));

    const countdownDisplay = getElement('countdown');
    const systemPrompt = getElement('system-prompt');

    let blueTeamName = '蓝方';
    let redTeamName = '红方';
    let games = 1;
    let currentGame = 1;
    let currentStep = 0;
    let steps = [
        { team: 'blue', action: 'ban' },
        { team: 'red', action: 'ban' },
        { team: 'blue', action: 'ban' },
        { team: 'red', action: 'ban' },
        { team: 'blue', action: 'pick' },
        { team: 'red', action: 'pick' },
        { team: 'red', action: 'pick' },
        { team: 'blue', action: 'pick' },
        { team: 'blue', action: 'pick' },
        { team: 'red', action: 'pick' },
        { team: 'red', action: 'ban' },
        { team: 'blue', action: 'ban' },
        { team: 'red', action: 'ban' },
        { team: 'blue', action: 'ban' },
        { team: 'red', action: 'ban' },
        { team: 'blue', action: 'ban' },
        { team: 'red', action: 'pick' },
        { team: 'blue', action: 'pick' },
        { team: 'blue', action: 'pick' },
        { team: 'red', action: 'pick' }
    ];
    let history = [];
    let bannedHeroes = [];
    let bluePickedHeroes = [];
    let redPickedHeroes = [];
    let blueUsedHeroes = [];
    let redUsedHeroes = [];
    let bothUsedHeroes = [];

    // 英雄列表
    const heroes = [
        { name: "曹操", image: "img/曹操.jpg", type: "对抗路" },
        { name: "程咬金", image: "img/程咬金.jpg", type: "对抗路" },
        { name: "达摩", image: "img/达摩.jpg", type: "对抗路" },
        { name: "关羽", image: "img/关羽.jpg", type: "对抗路" },
        { name: "花木兰", image: "img/花木兰.jpg", type: "对抗路" },
        { name: "姬小满", image: "img/姬小满.jpg", type: "对抗路" },
        { name: "狂铁", image: "img/狂铁.jpg", type: "对抗路" },
        { name: "老夫子", image: "img/老夫子.jpg", type: "对抗路" },
        { name: "李信", image: "img/李信.jpg", type: "对抗路" },
        { name: "刘邦", image: "img/刘邦.jpg", type: "对抗路" },
        { name: "吕布", image: "img/吕布.jpg", type: "对抗路" },
        { name: "马超", image: "img/马超.jpg", type: "对抗路" },
        { name: "蒙恬", image: "img/蒙恬.jpg", type: "对抗路" },
        { name: "芈月", image: "img/芈月.jpg", type: "对抗路" },
        { name: "司空震", image: "img/司空震.jpg", type: "对抗路" },
        { name: "孙策", image: "img/孙策.jpg", type: "对抗路" },
        { name: "夏洛特", image: "img/夏洛特.jpg", type: "对抗路" },
        { name: "项羽", image: "img/项羽.jpg", type: "对抗路" },
        { name: "亚连", image: "img/亚连.jpg", type: "对抗路" },
        { name: "亚瑟", image: "img/亚瑟.jpg", type: "对抗路" },
        { name: "杨戬", image: "img/杨戬.jpg", type: "对抗路" },
        { name: "影", image: "img/影.jpg", type: "对抗路" },
        { name: "元歌", image: "img/元歌.jpg", type: "对抗路" },
        { name: "钟无艳", image: "img/钟无艳.jpg", type: "对抗路" },
        { name: "阿古朵", image: "img/阿古朵.jpg", type: "打野" },
        { name: "阿珂", image: "img/阿珂.jpg", type: "打野" },
        { name: "白起", image: "img/白起.jpg", type: "打野" },
        { name: "百里玄策", image: "img/百里玄策.jpg", type: "打野" },
        { name: "大司命", image: "img/大司命.jpg", type: "打野" },
        { name: "典韦", image: "img/典韦.jpg", type: "打野" },
        { name: "暃", image: "img/暃.jpg", type: "打野" },
        { name: "宫本武藏", image: "img/宫本武藏.jpg", type: "打野" },
        { name: "韩信", image: "img/韩信.jpg", type: "打野" },
        { name: "镜", image: "img/镜.jpg", type: "打野" },
        { name: "橘右京", image: "img/橘右京.jpg", type: "打野" },
        { name: "铠", image: "img/铠.jpg", type: "打野" },
        { name: "兰陵王", image: "img/兰陵王.jpg", type: "打野" },
        { name: "澜", image: "img/澜.jpg", type: "打野" },
        { name: "李白", image: "img/李白.jpg", type: "打野" },
        { name: "刘备", image: "img/刘备.jpg", type: "打野" },
        { name: "露娜", image: "img/露娜.jpg", type: "打野" },
        { name: "梦奇", image: "img/梦奇.jpg", type: "打野" },
        { name: "哪吒", image: "img/哪吒.jpg", type: "打野" },
        { name: "娜可露露", image: "img/娜可露露.jpg", type: "打野" },
        { name: "盘古", image: "img/盘古.jpg", type: "打野" },
        { name: "裴擒虎", image: "img/裴擒虎.jpg", type: "打野" },
        { name: "司马懿", image: "img/司马懿.jpg", type: "打野" },
        { name: "孙悟空", image: "img/孙悟空.jpg", type: "打野" },
        { name: "夏侯惇", image: "img/夏侯惇.jpg", type: "打野" },
        { name: "雅典娜", image: "img/雅典娜.jpg", type: "打野" },
        { name: "曜", image: "img/曜.jpg", type: "打野" },
        { name: "元流之子(坦克)", image: "img/元流之子(坦克).jpg", type: "打野" },
        { name: "云缨", image: "img/云缨.jpg", type: "打野" },
        { name: "云中君", image: "img/云中君.jpg", type: "打野" },
        { name: "赵怀真", image: "img/赵怀真.jpg", type: "打野" },
        { name: "赵云", image: "img/赵云.jpg", type: "打野" },
        { name: "猪八戒", image: "img/猪八戒.jpg", type: "打野" },
        { name: "安琪拉", image: "img/安琪拉.jpg", type: "中路" },
        { name: "扁鹊", image: "img/扁鹊.jpg", type: "中路" },
        { name: "不知火舞", image: "img/不知火舞.jpg", type: "中路" },
        { name: "嫦娥", image: "img/嫦娥.jpg", type: "中路" },
        { name: "妲己", image: "img/妲己.jpg", type: "中路" },
        { name: "貂蝉", image: "img/貂蝉.jpg", type: "中路" },
        { name: "干将莫邪", image: "img/干将莫邪.jpg", type: "中路" },
        { name: "高渐离", image: "img/高渐离.jpg", type: "中路" },
        { name: "海诺", image: "img/海诺.jpg", type: "中路" },
        { name: "海月", image: "img/海月.jpg", type: "中路" },
        { name: "姜子牙", image: "img/姜子牙.jpg", type: "中路" },
        { name: "金蝉", image: "img/金蝉.jpg", type: "中路" },
        { name: "米莱狄", image: "img/米莱狄.jpg", type: "中路" },
        { name: "女娲", image: "img/女娲.jpg", type: "中路" },
        { name: "上官婉儿", image: "img/上官婉儿.jpg", type: "中路" },
        { name: "沈梦溪", image: "img/沈梦溪.jpg", type: "中路" },
        { name: "王昭君", image: "img/王昭君.jpg", type: "中路" },
        { name: "武则天", image: "img/武则天.jpg", type: "中路" },
        { name: "西施", image: "img/西施.jpg", type: "中路" },
        { name: "小乔", image: "img/小乔.jpg", type: "中路" },
        { name: "杨玉环", image: "img/杨玉环.jpg", type: "中路" },
        { name: "弈星", image: "img/弈星.jpg", type: "中路" },
        { name: "嬴政", image: "img/嬴政.jpg", type: "中路" },
        { name: "元流之子(法师)", image: "img/元流之子(法师).jpg", type: "中路" },
        { name: "甄姬", image: "img/甄姬.jpg", type: "中路" },
        { name: "周瑜", image: "img/周瑜.jpg", type: "中路" },
        { name: "诸葛亮", image: "img/诸葛亮.jpg", type: "中路" },
        { name: "艾琳", image: "img/艾琳.jpg", type: "发育路" },
        { name: "敖隐", image: "img/敖隐.jpg", type: "发育路" },
        { name: "百里守约", image: "img/百里守约.jpg", type: "发育路" },
        { name: "苍", image: "img/苍.jpg", type: "发育路" },
        { name: "狄仁杰", image: "img/狄仁杰.jpg", type: "发育路" },
        { name: "伽罗", image: "img/伽罗.jpg", type: "发育路" },
        { name: "戈娅", image: "img/戈娅.jpg", type: "发育路" },
        { name: "公孙离", image: "img/公孙离.jpg", type: "发育路" },
        { name: "后羿", image: "img/后羿.jpg", type: "发育路" },
        { name: "黄忠", image: "img/黄忠.jpg", type: "发育路" },
        { name: "莱西奥", image: "img/莱西奥.jpg", type: "发育路" },
        { name: "李元芳", image: "img/李元芳.jpg", type: "发育路" },
        { name: "鲁班七号", image: "img/鲁班七号.jpg", type: "发育路" },
        { name: "马可波罗", image: "img/马可波罗.jpg", type: "发育路" },
        { name: "蒙犽", image: "img/蒙犽.jpg", type: "发育路" },
        { name: "孙尚香", image: "img/孙尚香.jpg", type: "发育路" },
        { name: "虞姬", image: "img/虞姬.jpg", type: "发育路" },
        { name: "蔡文姬", image: "img/蔡文姬.jpg", type: "游走" },
        { name: "大乔", image: "img/大乔.jpg", type: "游走" },
        { name: "东皇太一", image: "img/东皇太一.jpg", type: "游走" },
        { name: "盾山", image: "img/盾山.jpg", type: "游走" },
        { name: "朵莉亚", image: "img/朵莉亚.jpg", type: "游走" },
        { name: "鬼谷子", image: "img/鬼谷子.jpg", type: "游走" },
        { name: "廉颇", image: "img/廉颇.jpg", type: "游走" },
        { name: "刘禅", image: "img/刘禅.jpg", type: "游走" },
        { name: "鲁班大师", image: "img/鲁班大师.jpg", type: "游走" },
        { name: "明世隐", image: "img/明世隐.jpg", type: "游走" },
        { name: "墨子", image: "img/墨子.jpg", type: "游走" },
        { name: "牛魔", image: "img/牛魔.jpg", type: "游走" },
        { name: "桑启", image: "img/桑启.jpg", type: "游走" },
        { name: "少司缘", image: "img/少司缘.png", type: "游走" },
        { name: "苏烈", image: "img/苏烈.jpg", type: "游走" },
        { name: "孙膑", image: "img/孙膑.jpg", type: "游走" },
        { name: "太乙真人", image: "img/太乙真人.jpg", type: "游走" },
        { name: "瑶", image: "img/瑶.jpg", type: "游走" },
        { name: "张飞", image: "img/张飞.jpg", type: "游走" },
        { name: "张良", image: "img/张良.jpg", type: "游走" },
        { name: "钟馗", image: "img/钟馗.jpg", type: "游走" },
        { name: "庄周", image: "img/庄周.jpg", type: "游走" },
        { name: "空ban", image: "img/空ban.jpg", type: "空Ban" }
    ];

    let countdown;

    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    const allHeroesPopup = document.createElement('div');
    allHeroesPopup.id = 'all-heroes-popup';
    overlay.appendChild(allHeroesPopup);
    document.body.appendChild(overlay);

    // 封装禁用英雄判断逻辑
    function isHeroDisabled(hero, currentTeam, currentAction) {
        if (hero.type === '空Ban') {
            return false; // 空ban可以重复选择
        }
        const isBanned = bannedHeroes.includes(hero.name);
        const isSelfPicked = (currentTeam === 'blue' && bluePickedHeroes.includes(hero.name)) ||
            (currentTeam === 'red' && redPickedHeroes.includes(hero.name));
        const isOpponentPicked = (currentTeam === 'blue' && redPickedHeroes.includes(hero.name)) ||
            (currentTeam === 'red' && bluePickedHeroes.includes(hero.name));
        const isBothUsed = bothUsedHeroes.includes(hero.name);

        const currentTeamPickedTank = (currentTeam === 'blue' && bluePickedHeroes.includes('元流之子(坦克)')) ||
            (currentTeam === 'red' && redPickedHeroes.includes('元流之子(坦克)'));
        const currentTeamPickedMage = (currentTeam === 'blue' && bluePickedHeroes.includes('元流之子(法师)')) ||
            (currentTeam === 'red' && redPickedHeroes.includes('元流之子(法师)'));
        const opponentPickedTank = (currentTeam === 'blue' && redPickedHeroes.includes('元流之子(坦克)')) ||
            (currentTeam === 'red' && bluePickedHeroes.includes('元流之子(坦克)'));
        const opponentPickedMage = (currentTeam === 'blue' && redPickedHeroes.includes('元流之子(法师)')) ||
            (currentTeam === 'red' && bluePickedHeroes.includes('元流之子(法师)'));
        const isYuanliuConflict = (hero.name === '元流之子(坦克)' && (currentTeamPickedMage || opponentPickedMage)) ||
            (hero.name === '元流之子(法师)' && (currentTeamPickedTank || opponentPickedTank));

        let isDisabled = false;

        if (currentAction === 'ban') {
            const opponentUsedHeroes = currentTeam === 'blue' ? redUsedHeroes : blueUsedHeroes;
            isDisabled = opponentUsedHeroes.includes(hero.name) || isBanned || isSelfPicked || isOpponentPicked || isBothUsed || isYuanliuConflict;
        } else {
            const selfUsedHeroes = currentTeam === 'blue' ? blueUsedHeroes : redUsedHeroes;
            isDisabled = selfUsedHeroes.includes(hero.name) || isBanned || isSelfPicked || isOpponentPicked || isBothUsed || isYuanliuConflict;
        }

        return isDisabled;
    }

    // 封装创建英雄按钮的逻辑
    function createHeroButton(hero, currentTeam, currentAction) {
        const heroButton = document.createElement('button');
        heroButton.classList.add('hero');
        heroButton.dataset.name = hero.name;

        const img = document.createElement('img');
        img.src = hero.image;
        heroButton.appendChild(img);

        const heroNameSpan = document.createElement('span');
        heroNameSpan.classList.add('hero-name');
        heroNameSpan.textContent = hero.name;
        heroButton.appendChild(heroNameSpan);

        const isDisabled = isHeroDisabled(hero, currentTeam, currentAction);

        if (isDisabled) {
            img.classList.add('grayscale');
            heroButton.disabled = true;
        }

        return heroButton;
    }

    startButton.addEventListener('click', () => {
        blueTeamName = getElement('blue-team').value;
        redTeamName = getElement('red-team').value;
        games = getElement('games').value;
        getElement('blue-team-name').textContent = blueTeamName;
        getElement('red-team-name').textContent = redTeamName;
        setup.style.display = 'none';
        bpContainer.style.display = 'block';
        updateCurrentPhaseDisplay();
        startCountdown();
        adjustScale();
    });

    function adjustScale() {
        const container = document.getElementById('main-container');
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const scaleX = windowWidth / 1920;
        const scaleY = windowHeight / 1080;
        const scale = Math.min(scaleX, scaleY);

        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'top left';
    }

    window.addEventListener('resize', adjustScale);

    heroTypeList.addEventListener('click', (e) => {
        if (e.target.classList.contains('hero-type-button')) {
            const type = e.target.dataset.type;
            if (type === '全部') {
                overlay.style.display = 'flex';
                allHeroesPopup.innerHTML = '';

                // 排除空Ban分类
                const categories = ['对抗路', '打野', '中路', '发育路', '游走'];
                categories.forEach(category => {
                    const categoryContainer = document.createElement('div');
                    categoryContainer.classList.add('hero-category-container');

                    const categoryTitle = document.createElement('div');
                    categoryTitle.classList.add('hero-category-title');
                    categoryTitle.textContent = category;
                    categoryContainer.appendChild(categoryTitle);

                    const categoryList = document.createElement('div');
                    categoryList.classList.add('hero-category-list');

                    const categoryHeroes = heroes.filter(hero => hero.type === category);
                    const currentTeam = steps[currentStep].team;
                    const currentAction = steps[currentStep].action;
                    categoryHeroes.forEach(hero => {
                        const heroButton = createHeroButton(hero, currentTeam, currentAction);
                        categoryList.appendChild(heroButton);
                    });

                    categoryContainer.appendChild(categoryList);
                    allHeroesPopup.appendChild(categoryContainer);
                });
            } else if (type === '空Ban') {
                const currentTeam = steps[currentStep].team;
                const currentAction = steps[currentStep].action;
                const emptyBanHero = heroes.find(hero => hero.type === '空Ban');
                if (emptyBanHero && currentAction === 'ban') {
                    const heroName = emptyBanHero.name;
                    const img = document.createElement('img');
                    img.src = emptyBanHero.image;
                    img.width = 40;
                    img.height = 40;

                    bannedHeroes.push(heroName);
                    if (currentTeam === 'blue') {
                        blueBan.appendChild(img);
                    } else {
                        redBan.appendChild(img);
                    }

                    history.push({ hero: heroName, action: 'ban', team: currentTeam });
                    undoButton.disabled = false;
                    currentStep++;

                    if (currentStep < steps.length) {
                        updateCurrentPhaseDisplay();
                        restartCountdown();
                    } else {
                        endButtons.style.display = 'block';
                        clearInterval(countdown);
                        countdownDisplay.textContent = '<->';
                    }
                }
            } else {
                heroList.innerHTML = '';
                const filteredHeroes = heroes.filter(hero => hero.type === type);
                const currentTeam = steps[currentStep].team;
                const currentAction = steps[currentStep].action;
                filteredHeroes.forEach(hero => {
                    const heroButton = createHeroButton(hero, currentTeam, currentAction);
                    heroList.appendChild(heroButton);
                });
                heroTypeList.style.display = 'none';
                heroList.style.display = 'block';
                backToTypesButton.style.display = 'inline-block';
            }
        }
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    });

    const handleHeroSelection = (target) => {
        if (target.classList.contains('hero')) {
            const heroName = target.dataset.name;
            const hero = heroes.find(h => h.name === heroName);

            const currentTeam = steps[currentStep].team;
            const currentAction = steps[currentStep].action;

            if (isHeroDisabled(hero, currentTeam, currentAction)) {
                return;
            }

            const action = steps[currentStep].action;
            const team = steps[currentStep].team;
            const img = document.createElement('img');
            img.src = hero.image;
            img.width = 40;
            img.height = 40;

            if (action === 'ban') {
                bannedHeroes.push(heroName);
                if (team === 'blue') {
                    blueBan.appendChild(img);
                } else {
                    redBan.appendChild(img);
                }
            } else {
                if (team === 'blue') {
                    bluePickedHeroes.push(heroName);
                    bluePick.appendChild(img);
                    if (!blueUsedHeroes.includes(heroName)) {
                        blueUsedHeroes.push(heroName);
                        const usedImg = img.cloneNode(true);
                        blueUsed.appendChild(usedImg);
                    }
                    if (redUsedHeroes.includes(heroName) && !bothUsedHeroes.includes(heroName)) {
                        bothUsedHeroes.push(heroName);
                    }
                } else {
                    redPickedHeroes.push(heroName);
                    redPick.appendChild(img);
                    if (!redUsedHeroes.includes(heroName)) {
                        redUsedHeroes.push(heroName);
                        const usedImg = img.cloneNode(true);
                        redUsed.appendChild(usedImg);
                    }
                    if (blueUsedHeroes.includes(heroName) && !bothUsedHeroes.includes(heroName)) {
                        bothUsedHeroes.push(heroName);
                    }
                }
            }

            history.push({ hero: heroName, action, team });
            undoButton.disabled = false;
            currentStep++;

            if (currentStep < steps.length) {
                updateCurrentPhaseDisplay();
                restartCountdown();
            } else {
                endButtons.style.display = 'block';
                clearInterval(countdown);
                countdownDisplay.textContent = '<->';
            }

            heroTypeList.style.display = 'block';
            heroList.style.display = 'none';
            backToTypesButton.style.display = 'none';
            overlay.style.display = 'none';
        }
    };

    heroList.addEventListener('click', (e) => {
        let target = e.target;
        if (target.tagName === 'IMG') {
            target = target.parentNode;
        }
        handleHeroSelection(target);
    });

    allHeroesPopup.addEventListener('click', (e) => {
        let target = e.target;
        if (target.tagName === 'IMG') {
            target = target.parentNode;
        }
        handleHeroSelection(target);
    });

    undoButton.addEventListener('click', () => {
        if (history.length > 0) {
            const lastAction = history.pop();
            const { hero, action, team } = lastAction;

            if (action === 'ban') {
                bannedHeroes = bannedHeroes.filter(h => h!== hero);
                if (team === 'blue') {
                    blueBan.removeChild(blueBan.lastChild);
                } else {
                    redBan.removeChild(redBan.lastChild);
                }
            } else {
                if (team === 'blue') {
                    bluePickedHeroes = bluePickedHeroes.filter(h => h!== hero);
                    bluePick.removeChild(bluePick.lastChild);
                    if (blueUsedHeroes.includes(hero)) {
                        const index = blueUsedHeroes.indexOf(hero);
                        blueUsedHeroes.splice(index, 1);
                        blueUsed.removeChild(blueUsed.children[index]);
                    }
                    if (bothUsedHeroes.includes(hero) && !redUsedHeroes.includes(hero)) {
                        const index = bothUsedHeroes.indexOf(hero);
                        bothUsedHeroes.splice(index, 1);
                    }
                } else {
                    redPickedHeroes = redPickedHeroes.filter(h => h!== hero);
                    redPick.removeChild(redPick.lastChild);
                    if (redUsedHeroes.includes(hero)) {
                        const index = redUsedHeroes.indexOf(hero);
                        redUsedHeroes.splice(index, 1);
                        redUsed.removeChild(redUsed.children[index]);
                    }
                    if (bothUsedHeroes.includes(hero) && !blueUsedHeroes.includes(hero)) {
                        const index = bothUsedHeroes.indexOf(hero);
                        bothUsedHeroes.splice(index, 1);
                    }
                }
            }

            currentStep--;
            if (history.length === 0) {
                undoButton.disabled = true;
            }
            endButtons.style.display = 'none';
            updateCurrentPhaseDisplay();
            restartCountdown();
        }
    });

    saveButton.addEventListener('click', () => {
        console.log('保存本局数据');
        const separatorImgBlue = document.createElement('img');
        separatorImgBlue.src = 'img/分隔.jpg';
        separatorImgBlue.classList.add('separator-img'); 
        blueUsed.appendChild(separatorImgBlue);

        const separatorImgRed = document.createElement('img');
        separatorImgRed.src = 'img/分隔.jpg';
        separatorImgRed.classList.add('separator-img'); 
        redUsed.appendChild(separatorImgRed);

        nextGame();
    });

    deleteButton.addEventListener('click', () => {
        console.log('不保存本局数据');
        bluePickedHeroes.forEach(hero => {
            const index = blueUsedHeroes.indexOf(hero);
            if (index!== -1) {
                blueUsedHeroes.splice(index, 1);
                blueUsed.removeChild(blueUsed.children[index]);
            }
        });
        redPickedHeroes.forEach(hero => {
            const index = redUsedHeroes.indexOf(hero);
            if (index!== -1) {
                redUsedHeroes.splice(index, 1);
                redUsed.removeChild(redUsed.children[index]);
            }
        });
        blueBan.innerHTML = '';
        redBan.innerHTML = '';
        bluePick.innerHTML = '';
        redPick.innerHTML = '';
        bannedHeroes = [];
        bluePickedHeroes = [];
        redPickedHeroes = [];
        history = [];
        currentStep = 0;
        undoButton.disabled = true;
        endButtons.style.display = 'none';
        updateCurrentPhaseDisplay();
        restartCountdown();
    });

    function nextGame() {
        currentGame++;
        if (currentGame <= games) {
            swapButtons.style.display = 'block';
            endButtons.style.display = 'none';
            blueBan.innerHTML = '';
            redBan.innerHTML = '';
            bluePick.innerHTML = '';
            redPick.innerHTML = '';
            bannedHeroes = [];
            bluePickedHeroes = [];
            redPickedHeroes = [];
            history = [];
            currentStep = 0;
            undoButton.disabled = true;
            updateCurrentPhaseDisplay();
        } else {
            console.log('所有小局已完成');
            endButtons.style.display = 'block';
        }
    }

    swapButton.addEventListener('click', () => {
        [blueTeamName, redTeamName] = [redTeamName, blueTeamName];
        document.getElementById('blue-team-name').textContent = blueTeamName;
        document.getElementById('red-team-name').textContent = redTeamName;
        [blueUsed.innerHTML, redUsed.innerHTML] = [redUsed.innerHTML, blueUsed.innerHTML];
        [blueUsedHeroes, redUsedHeroes] = [redUsedHeroes, blueUsedHeroes];
        swapButtons.style.display = 'none';
        startCountdown();
    });

    noSwapButton.addEventListener('click', () => {
        swapButtons.style.display = 'none';
        startCountdown();
    });

    finishButton.addEventListener('click', () => {
        blueBan.innerHTML = '';
        redBan.innerHTML = '';
        bluePick.innerHTML = '';
        redPick.innerHTML = '';
        blueUsed.innerHTML = '';
        redUsed.innerHTML = '';
        bannedHeroes = [];
        bluePickedHeroes = [];
        redPickedHeroes = [];
        blueUsedHeroes = [];
        redUsedHeroes = [];
        bothUsedHeroes = [];
        history = [];
        currentStep = 0;
        currentGame = 1;
        undoButton.disabled = true;
        endButtons.style.display = 'none';
        swapButtons.style.display = 'none';
        setup.style.display = 'block';
        bpContainer.style.display = 'none';
    });

    backToTypesButton.addEventListener('click', () => {
        heroTypeList.style.display = 'block';
        heroList.style.display = 'none';
        backToTypesButton.style.display = 'none';
    });

    function updateCurrentPhaseDisplay() {
        if (currentStep < steps.length) {
            const team = steps[currentStep].team === 'blue' ? blueTeamName : redTeamName;
            const action = steps[currentStep].action === 'ban' ? '禁用阶段' : '选择阶段';
            currentPhaseDisplay.textContent = `${team} ${action}`;
        } else {
            currentPhaseDisplay.textContent = '';
        }
    }

    function startCountdown() {
        let timeLeft = 30;
        countdownDisplay.textContent = ` ${timeLeft} `;

        countdown = setInterval(() => {
            timeLeft--;
            if (timeLeft >= 0) {
                countdownDisplay.textContent = ` ${timeLeft} `;
            } else {
                clearInterval(countdown);
                showSystemPrompt();
            }
        }, 1000);
    }

    function restartCountdown() {
        clearInterval(countdown);
        startCountdown();
    }

    function showSystemPrompt() {
        systemPrompt.textContent = '系统要给你选亚瑟了';
        systemPrompt.style.display = 'block';
        setTimeout(() => {
            systemPrompt.style.display = 'none';
        }, 3000);
    }
});