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
  document.querySelector('.character .ruby').innerText = `Ruby: ${data[0].ruby}`;
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

async function loadEquipment() {
  const data = await request('/api/equipment');
  return data;
}

async function loadHeroStats() {
  const data = await request('/api/heroStats');
  return data;
}

async function loadEnemyEquipment() {
  const data = await request('/api/enemy');
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
      drawHeroStats(heroStats);
      const inventory = await loadInventory();
      drawInventory(inventory);
      addInventoryClicks();
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

async function updateUI() {
  const equipment = await loadEquipment();
  drawEquipment(equipment);
  const heroStats = await loadHeroStats();
  drawHeroStats(heroStats);
  const inventory = await loadInventory();
  drawInventory(inventory);
  addInventoryClicks();
  const loginScreen = document.querySelector('.login-form-wrapper');
  loginScreen.classList.add('hidden');
}

window.onload = async function() {
  const gearStats = await loadGearStats();
  authFormSubmit();

  if (false) {
    const enemy = await loadEnemyEquipment();
    drawEnemy(enemy);
    const enemyStats = await loadEnemyStats();

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
        roundIndex += 1;
        hpPools = [roundResult[2], roundResult[3]];
        drawBattleHP(hpPools, maxHp);
      }

    }
    addBattleClicks('me');
    addBattleClicks('enemy');
  }
}
