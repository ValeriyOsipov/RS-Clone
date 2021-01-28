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

async function buyItem(index) {
  const newEquipment = await request('/api/shop', 'POST', [index]);
  return newEquipment;
}

async function sellItem(index) {
  const newEquipment = await request('/api/inventory', 'POST', [index]);
  return newEquipment;
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
      inventory = resp[0];
      shop = resp[1];
      updateShopUI();
    })
  }
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

function drawBattleHP(hpPools, maxHp) {
  document.querySelector('.my-health').innerText = `Health: ${hpPools[0]}/ ${maxHp[0]}`;
  document.querySelector('.enemy-health').innerText = `Health: ${hpPools[1]}/ ${maxHp[1]}`;
}

async function startRound(selectedTargets, i) {
  const roundLog = await request('/api/battle', 'POST', [selectedTargets, i]);
  return roundLog;
}

async function authFormSubmit() {
  document.querySelector('.login-form-wrapper')
    .addEventListener('submit', authFormHandler);
}

async function authFormHandler(event) {
  event.preventDefault();
  const email = document.querySelector('.email').value;
  const password = document.querySelector('.password').value;
  const loginDetails = await request('/api/user', 'POST', [email, password]);
  if (loginDetails !== 'User with this email not found' && loginDetails !== 'Wrong password' && loginDetails !== undefined) {
    await updateUI();
  }
}

let equipment, heroStats, inventory, gold, shop, progress;

async function updateUI() {
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

function addPveSelect() {
  const enemies = document.querySelectorAll('.pve');
  const enemiesArray = [...enemies];
  for (let i = 0; i < enemiesArray.length; i += 1) {
    enemiesArray[i].addEventListener('click', () => {
      loadBattle(i);
    })
  }
}

async function selectEnemyOnServer(index) {
  const enemy = await request('/api/enemies', 'POST', [index]);
  return enemy;
}

async function loadBattle(enemyIndex) {
  let enemy = await selectEnemyOnServer(enemyIndex);

  drawEnemy(enemy);
  let enemyStats = await loadEnemyStats();

  const maxHp = [heroStats[0].health, enemyStats[0].health];
  let hpPools = [heroStats[0].health, enemyStats[0].health];
  let roundIndex = 0;
  drawBattleHP(hpPools, maxHp);

  document.querySelector('.fight').onclick = async function() {
    const selectedDivs = [...document.querySelectorAll('.selected')];
    const selectedTargets = selectedDivs.map(i => [...i.classList][1]);
    if (selectedTargets[0] === undefined || selectedTargets[1] === undefined) {
      //ошибка - выберите цели
    } else {
      const roundResult = await startRound(selectedTargets, roundIndex);
      const status = roundResult[4];
      roundIndex += 1;
      hpPools = [roundResult[2], roundResult[3]];
      drawBattleHP(hpPools, maxHp);
      if (status == 'battle is lost') {
        //lose
        window.alert('lost');
      }
      if (status == 'win') {
        //win
        window.alert('win');
      }
    }
  }
  addBattleClicks('me');
  addBattleClicks('enemy');
}

window.onload = async function() {
  const gearStats = await loadGearStats();
  authFormSubmit();
  addPveSelect();
}
