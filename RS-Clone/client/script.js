//Работа с сервером

async function request(url, method = 'GET', data = null) {
  const headers = {};
  let body;
  if (data) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(data);
  }
  const response = await fetch(url, {
    method,
    headers,
    body
  })
  return await response.json();
}

async function loadEquipment() {
  const data = await request('/api/equipment');
  return data;
}

async function loadHeroStats() {
  const data = await request('/api/heroStats');
  return data;
}

async function loadEnemyStats() {
  const data = await request('/api/enemyStats');
  return data;
}

async function loadGearStats() {
  const data = await request('/api/gearStats');
  return data;
}

async function loadInventory() {
  const data = await request('/api/inventory');
  return data;
}

async function loadShop() {
  const data = await request('/api/shop');
  return data;
}

async function loadGold() {
  const data = await request('/api/gold');
  return data;
}

async function loadProgress() {
  const data = await request('/api/progress');
  return data;
}

async function regear(index) {
  const newEquipment = await request('/api/equipment', 'POST', [index]);
  return newEquipment;
}

async function buyItem(index) {
  const newEquipment = await request('/api/shop', 'POST', [index]);
  return newEquipment;
}

async function sellItem(index) {
  const newEquipment = await request('/api/inventory', 'POST', [index]);
  return newEquipment;
}

async function startRound(selectedTargets, i) {
  const roundLog = await request('/api/battle', 'POST', [selectedTargets, i]);
  return roundLog;
}

async function authFormHandler(event) {
  event.preventDefault();
  const email = document.querySelector('.email').value;
  const password = document.querySelector('.password').value;
  const loginDetails = await request('/api/user', 'POST', [email, password]);
  if (loginDetails !== 'User with this email not found' && loginDetails !== 'Wrong password' && loginDetails !== undefined) {
    await updateUI(loginDetails);
  }
}

async function registerFormHandler(event) {
  event.preventDefault();
  const email = document.querySelector('.reg-email').value;
  const password = document.querySelector('.reg-password').value;
  const name = document.querySelector('.reg-name').value;
  const regDetails = await request('/api/register', 'POST', [email, password, name]);
  if (regDetails !== 'User with this email already exists' && regDetails !== undefined) {
    alert('Account registered');
  } else {
    alert('User with this email already exists');
  }
}

async function selectPveEnemyOnServer(index) {
  const enemy = await request('/api/enemies', 'POST', [index]);
  return enemy;
}

async function selectPvpEnemyOnServer(index) {
  const enemy = await request('/api/pvp', 'POST', [index]);
  return enemy;
}

async function updateRival() {
  const data = await request('/api/rival');
  return data;
}

//Элементы

const itemStats = document.querySelector('.item-stats');
const battleLog = document.querySelector('.battle-log');
const main = document.querySelector('.main-content');
const header = document.querySelector('.menu-wrapper');
const battleScreen = document.querySelector('.battle-screen');

//Отрисовка

function drawEquipment(data) {
  document.querySelector('.hero .bag').style.backgroundImage = `url('/assets/${data[0].bag}.png')`;
  document.querySelector('.hero .cape').style.backgroundImage = `url('/assets/${data[0].cape}.png')`;
  document.querySelector('.hero .food').style.backgroundImage = `url('/assets/${data[0].food}.png')`;
  document.querySelector('.hero .potion').style.backgroundImage = `url('/assets/${data[0].potion}.png')`;
  document.querySelector('.hero .mount').style.backgroundImage = `url('/assets/${data[0].mount}.png')`;
  document.querySelector('.hero .helmet').style.backgroundImage = `url('/assets/${data[0].helmet}.png')`;
  document.querySelector('.hero .armor').style.backgroundImage = `url('/assets/${data[0].armor}.png')`;
  document.querySelector('.hero .boots').style.backgroundImage = `url('/assets/${data[0].boots}.png')`;
  document.querySelector('.hero .weapon').style.backgroundImage = `url('/assets/${data[0].weapon}.png')`;
  document.querySelector('.hero .offhand').style.backgroundImage = `url('/assets/${data[0].offhand}.png')`;
  document.querySelector('.me .bag').style.backgroundImage = `url('/assets/${data[0].bag}.png')`;
  document.querySelector('.me .cape').style.backgroundImage = `url('/assets/${data[0].cape}.png')`;
  document.querySelector('.me .food').style.backgroundImage = `url('/assets/${data[0].food}.png')`;
  document.querySelector('.me .potion').style.backgroundImage = `url('/assets/${data[0].potion}.png')`;
  document.querySelector('.me .mount').style.backgroundImage = `url('/assets/${data[0].mount}.png')`;
  document.querySelector('.me .helmet').style.backgroundImage = `url('/assets/${data[0].helmet}.png')`;
  document.querySelector('.me .armor').style.backgroundImage = `url('/assets/${data[0].armor}.png')`;
  document.querySelector('.me .boots').style.backgroundImage = `url('/assets/${data[0].boots}.png')`;
  document.querySelector('.me .weapon').style.backgroundImage = `url('/assets/${data[0].weapon}.png')`;
  document.querySelector('.me .offhand').style.backgroundImage = `url('/assets/${data[0].offhand}.png')`; 
}

function drawEnemy(data) {
  document.querySelector('.enemy .bag').style.backgroundImage = `url('/assets/${data[0].bag}.png')`;
  document.querySelector('.enemy .cape').style.backgroundImage = `url('/assets/${data[0].cape}.png')`;
  document.querySelector('.enemy .food').style.backgroundImage = `url('/assets/${data[0].food}.png')`;
  document.querySelector('.enemy .potion').style.backgroundImage = `url('/assets/${data[0].potion}.png')`;
  document.querySelector('.enemy .mount').style.backgroundImage = `url('/assets/${data[0].mount}.png')`;
  document.querySelector('.enemy .helmet').style.backgroundImage = `url('/assets/${data[0].helmet}.png')`;
  document.querySelector('.enemy .armor').style.backgroundImage = `url('/assets/${data[0].armor}.png')`;
  document.querySelector('.enemy .boots').style.backgroundImage = `url('/assets/${data[0].boots}.png')`;
  document.querySelector('.enemy .weapon').style.backgroundImage = `url('/assets/${data[0].weapon}.png')`;
  document.querySelector('.enemy .offhand').style.backgroundImage = `url('/assets/${data[0].offhand}.png')`;  
}

function drawHeroStats(data) {
  document.querySelector('.character .attack-power').innerText = `Attack power: ${data[0].attackPower}`;
  document.querySelector('.character .health').innerText = `Health: ${data[0].health}`;
  document.querySelector('.character .armor').innerText = `Armor: ${data[0].armor}`;
  document.querySelector('.character .speed').innerText = `Speed: ${data[0].speed}`;
  document.querySelector('.character .accuracy').innerText = `Accuracy: ${data[0].accuracy}`;
  document.querySelector('.character .luck').innerText = `Luck: ${data[0].luck}`;
  document.querySelector('.character .gold').innerText = `Gold: ${data[0].gold}`;
  document.querySelector('.shop .gold').innerText = `Gold: ${data[0].gold}`;
}

function getPosition(e){
	let x = 0;
  let y = 0;
	if (!e) {
		var e = window.event;
	}
	if (e.pageX || e.pageY){
		x = e.pageX;
		y = e.pageY;
	} else if (e.clientX || e.clientY){
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	return {x: x, y: y}
}

function setStatsPosition(e) {
  let coords = getPosition(e);
  itemStats.style.top = `${coords.y + 3}px`;
  itemStats.style.left = `${coords.x + 3}px`;
}

async function getSelectedItem(itemName) {
  return await gearStats.find(it => it.name === itemName);
}

async function prepareStats(item) {
  let itemName = item.style.backgroundImage;
  itemName = itemName.slice(13).slice(0,-6);
  let itemDescription = '';
  let selectedItem = await getSelectedItem(itemName);
  itemDescription = `
  Item: ${selectedItem.name}
  Attack Power: ${selectedItem.attackPower}
  Health: ${selectedItem.health}
  Armor: ${selectedItem.armor}
  Speed: ${selectedItem.speed}
  Accuracy: ${selectedItem.accuracy}
  Luck: ${selectedItem.luck}
  Price: ${selectedItem.price}
  `
  return itemDescription;
}

async function showItemStats(item, e) {
  item.classList.add('hovered_item');
  itemStats.style.display = 'flex';
  setStatsPosition(e);
  itemStats.innerText = await prepareStats(item);
}

function hideitemStats(item) {
  item.classList.remove('hovered_item');
  itemStats.style.display = 'none';
  itemStats.innerText = '';
}

function clearInventory() {
  const inventoryWrap = document.querySelector('.inventory');
  while (inventoryWrap.firstChild) {
    inventoryWrap.removeChild(inventoryWrap.lastChild);
  }
}

function drawInventory(data) {
  clearInventory();
  const inventoryWrap = document.querySelector('.inventory');
  for (let i = 0; i < data.length; i += 1) {
    let item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundImage = `url('/assets/${data[i].name}.png')`;
    inventoryWrap.appendChild(item);
  }
  addItemsHover();
}

function clearShop() {
  const invWrap = document.querySelector('.inv-in-shop');
  while (invWrap.firstChild) {
    invWrap.removeChild(invWrap.lastChild);
  }
  const goodsWrap = document.querySelector('.goods-in-shop');
  while (goodsWrap.firstChild) {
    goodsWrap.removeChild(goodsWrap.lastChild);
  }
}

function drawShop(data1, data2) {
  clearShop();
  const invWrap = document.querySelector('.inv-in-shop');
  for (let i = 0; i < data1.length; i += 1) {
    let item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundImage = `url('/assets/${data1[i].name}.png')`;
    invWrap.appendChild(item);
  }
  const goodsWrap = document.querySelector('.goods-in-shop');
  for (let i = 0; i < data2.length; i += 1) {
    let item = document.createElement('div');
    item.classList.add('item');
    item.style.backgroundImage = `url('/assets/${data2[i].name}.png')`;
    goodsWrap.appendChild(item);
  }
  addItemsHover();
}

async function updateShopUI() {
  heroStats = await loadHeroStats();
  gold = await loadGold();
  heroStats[0].gold = gold;
  drawHeroStats(heroStats);
  inventory = await loadInventory();
  drawInventory(inventory);
  shop = await loadShop();
  drawShop(inventory, shop);
  addInventoryClicks();
  addShopClicks();
}

function drawBattleHP(hpPools, maxHp) {
  document.querySelector('.my-health').innerText = `My Health: ${hpPools[0]}/ ${maxHp[0]}`;
  document.querySelector('.enemy-health').innerText = `Enemy Health: ${hpPools[1]}/ ${maxHp[1]}`;
}

function clearBattleLog() {
  const battleLog = document.querySelector('.battle-log');
  battleLog.innerText = '';
}

function drawBattleLog(roundIndex, roundResult) {
  battleLog.innerText += `${roundIndex}. You hit on ${roundResult[0]} damage, and take ${roundResult[1]} damage\n`;
}

function showBattleScreen() {
  main.classList.add('hidden');
  header.classList.add('hidden');
  battleScreen.classList.remove('hidden');
}

function drawRival(data) {
  const rivalCont = document.querySelector('.pvp');
  rivalCont.innerText = `Your rival: ${data}`;
}

//Ивент листенеры

function addRegisterClicks() {
  const regLink = document.querySelector('.reg-link');
  const regForm = document.querySelector('.register-form-wrapper');
  const regClose = document.querySelector('.reg-close');
  regLink.addEventListener('click', () => {
    regForm.classList.remove('hidden');
  })
  regClose.addEventListener('click', () => {
    regForm.classList.add('hidden');
  })
}

function addMenuClicks() {
  const menuItems = [...document.querySelectorAll('.menu-item')];
  const tabs = [...document.querySelectorAll('.tab')];
  for (let i = 0; i < menuItems.length; i += 1) {
    menuItems[i].addEventListener('click', () => {
      tabs.forEach(tab => tab.classList.add('hidden'));
      menuItems.forEach(item => item.classList.remove('active-menu-item'));
      tabs[i].classList.remove('hidden');
      menuItems[i].classList.add('active-menu-item');
    })
  }
}

function addItemsHover() {
  let items = document.querySelectorAll('.main-content .item');
  for (let i = 0; i < items.length; i += 1) {
    items[i].addEventListener('mouseover', function(e){
      e.stopPropagation();
      showItemStats(items[i], e);
    });
    items[i].addEventListener('mouseout', function(e){
      e.stopPropagation();
      hideitemStats(items[i]);
    });
  }
}

function addInventoryClicks() {
  const items = document.querySelectorAll('.inventory .item');
  const itemsArray = [...items];
  for (let i = 0; i < itemsArray.length; i += 1) {
    itemsArray[i].addEventListener('click', async () => {
      const equipment = await regear(i);
      drawEquipment(equipment);
      const heroStats = await loadHeroStats();
      const gold = await loadGold();
      heroStats[0].gold = gold;
      drawHeroStats(heroStats);
      const inventory = await loadInventory();
      drawInventory(inventory);
      updateShopUI();
      addInventoryClicks();
    })
  }
}

function addShopClicks() {
  const invItems = document.querySelectorAll('.inv-in-shop .item');
  const invItemsArray = [...invItems];
  for (let i = 0; i < invItemsArray.length; i += 1) {
    invItemsArray[i].addEventListener('click', async () => {
      let resp = await sellItem(i);
      inventory = resp[0];
      shop = resp[1];
      updateShopUI();
    })
  }
  const shopItems = document.querySelectorAll('.goods-in-shop .item');
  const shopItemsArray = [...shopItems];
  for (let i = 0; i < shopItemsArray.length; i += 1) {
    shopItemsArray[i].addEventListener('click', async () => {
      let resp = await buyItem(i);
      if (resp === 'Not enough gold') {
        alert('Not enough gold');
      } else {
        inventory = resp[0];
        shop = resp[1];
        updateShopUI();
      }
    })
  }
}

async function updateShopGoods() {
  document.querySelector('.update-shop').addEventListener('click', async () => {
    const data = await request('/api/updatedshop');
    if (data === 'Not enough gold') {
      alert('Not enough gold');
    } else {
      shop = data;
      updateShopUI();
    }
  });
}

function addBattleClicks(character) {
  const activeElements = document.querySelectorAll(`.${character} .battle`);
  const activeElementsArray = [...activeElements];
  for (let i = 0; i < activeElementsArray.length; i += 1) {
    activeElementsArray[i].addEventListener('click', () => {
      activeElementsArray.forEach(element => element.classList.remove('selected'));
      activeElementsArray[i].classList.add('selected');
    })
  }
}

async function authFormSubmit() {
  document.querySelector('.login-form-wrapper')
    .addEventListener('submit', authFormHandler);
}

async function registerFormSubmit() {
  document.querySelector('.register-form-wrapper')
    .addEventListener('submit', registerFormHandler);
}

function addPveSelect() {
  const enemies = document.querySelectorAll('.pve');
  const enemiesArray = [...enemies];
  for (let i = 0; i < enemiesArray.length; i += 1) {
    enemiesArray[i].addEventListener('click', () => {
      loadBattle(i, 'pve');
      showBattleScreen();
    })
  }
}

function showCloseButton() {
  const closeBattle = document.querySelector('.battle-close');
  closeBattle.classList.remove('hidden');
  closeBattle.addEventListener('click', () => {
    closeBattle.classList.add('hidden');
    main.classList.remove('hidden');
    header.classList.remove('hidden');
    battleScreen.classList.add('hidden');
    battleLog.innerText='';
  });
}

function addPvpSelect() {
  const enemies = document.querySelectorAll('.pvp-fight');
  const enemiesArray = [...enemies];
  for (let i = 0; i < enemiesArray.length; i += 1) {
    enemiesArray[i].addEventListener('click', () => {
      loadBattle(i, 'pvp');
      showBattleScreen();
    })
  }
}

function addRivalUpdateButton() {
  const updButton = document.querySelector('.update-pvp');
    updButton.addEventListener('click', async () => {
      const rival = await updateRival();
      drawRival(rival);
    })
}

//Логика

let equipment, heroStats, inventory, gold, shop, progress;

async function updateUI(name) {
  const heroName = document.querySelector('.hero-wrapper .block-header');
  heroName.innerText = name;
  equipment = await loadEquipment();
  drawEquipment(equipment);
  heroStats = await loadHeroStats();
  gold = await loadGold();
  heroStats[0].gold = gold;
  drawHeroStats(heroStats);
  inventory = await loadInventory();
  shop = await loadShop();
  drawInventory(inventory);
  drawShop(inventory, shop);
  addInventoryClicks();
  addShopClicks();
  const loginScreen = document.querySelector('.login-form-wrapper');
  loginScreen.classList.add('hidden');
}

async function loadBattle(enemyIndex, mode) {
  let enemy;
  if (mode === 'pve') {
    enemy = await selectPveEnemyOnServer(enemyIndex);
  } else {
    enemy = await selectPvpEnemyOnServer(enemyIndex);
  }

  drawEnemy(enemy);
  let enemyStats = await loadEnemyStats();

  const maxHp = [heroStats[0].health, enemyStats[0].health];
  let hpPools = [heroStats[0].health, enemyStats[0].health];
  let roundIndex = 0;
  drawBattleHP(hpPools, maxHp);

  const fightButton = document.querySelector('.fight');
  fightButton.removeAttribute('disabled');

  fightButton.onclick = async function() {
    const selectedDivs = [...document.querySelectorAll('.selected')];
    const selectedTargets = selectedDivs.map(i => [...i.classList][1]);
    if (selectedTargets[0] === undefined || selectedTargets[1] === undefined) {
      window.alert('Select defence and attack targets');
    } else {
      const roundResult = await startRound(selectedTargets, roundIndex);
      const status = roundResult[4];
      roundIndex += 1;
      drawBattleLog(roundIndex, roundResult);
      hpPools = [roundResult[2], roundResult[3]];
      drawBattleHP(hpPools, maxHp);
      if (status == 'battle is lost') {
        window.alert('Battle is lost. Try harder next time.');
        fightButton.disabled = 'disabled';
        showCloseButton();
      }
      if (status == 'win') {
        gold = await loadGold();
        heroStats[0].gold = gold;
        drawHeroStats(heroStats);
        window.alert('You win and earn some gold!');
        fightButton.disabled = 'disabled';
        showCloseButton();
      }
    }
  }
  addBattleClicks('me');
  addBattleClicks('enemy');
}

let gearStats = [];

window.onload = async function() {
  gearStats = await loadGearStats();
  addRegisterClicks();
  authFormSubmit();
  registerFormSubmit();
  addMenuClicks();
  updateShopGoods();
  addPveSelect();
  addPvpSelect();
  let rival = await updateRival();
  drawRival(rival);
  addRivalUpdateButton();
}
