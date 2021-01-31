const { NONAME } = require('dns');
const { response } = require('express');
const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./rs-clone-3b0fc-firebase-adminsdk-x8au4-59b8931e06.json');
const app = express();
const port = 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rs-clone-3b0fc-default-rtdb.europe-west1.firebasedatabase.app"
});

let db = admin.database();

let gearStats = [];
let gearStatsRef = db.ref('/gearStats');
gearStatsRef.on("value", function(snapshot) {
    gearStats = snapshot.val();
}, function (errorObject) {
    console.log('Error: ' + errorObject.code);
});

let usersList = [];
let usersListRef = db.ref('/users');
usersListRef.on("value", function(snapshot) {
    usersList = snapshot.val();
}, function (errorObject) {
    console.log('Error: ' + errorObject.code);
});

let playerIndex = [];
let equipment = [];
let inventory = [];
let shop = [];
let gold = 0;
let progress = [];

let enemyEquipment = [];

let heroStats = [{
    attackPower: 0,
    health: 0,
    armor: 0,
    speed: 0,
    accuracy: 0,
    luck: 0,
    gold: 0,
    ruby: 0,
}]

let enemyStats = [{
    attackPower: 0,
    health: 0,
    armor: 0,
    speed: 0,
    accuracy: 0,
    luck: 0,
    gold: 0,
    ruby: 0,
}]

function calculateStats(equipment, stats) {
    let items = Object.values(equipment[0]);
    const initialValue = 0;
    items = items.map((item) => gearStats.find((fItem) => fItem.name === item));
    stats[0].attackPower = items.reduce((acc, curr) => acc + curr.attackPower, initialValue);
    stats[0].health = items.reduce((acc, curr) => acc + curr.health, initialValue);
    stats[0].armor = items.reduce((acc, curr) => acc + curr.armor, initialValue);
    stats[0].speed = items.reduce((acc, curr) => acc + curr.speed, initialValue);
    stats[0].accuracy = items.reduce((acc, curr) => acc + curr.accuracy, initialValue);
    stats[0].luck = items.reduce((acc, curr) => acc + curr.luck, initialValue);
}

app.use(express.json());

app.get('/api/equipment', (request, response) => {
    response.status(200).json(equipment);
})

app.get('/api/heroStats', (request, response) => {
    calculateStats(equipment, heroStats);
    response.status(200).json(heroStats);
})

app.get('/api/inventory', (request, response) => {
    response.status(200).json(inventory);
})

app.get('/api/shop', (request, response) => {
    response.status(200).json(shop);
})

app.get('/api/gold', (request, response) => {
    response.status(200).json(gold);
})

app.get('/api/progress', (request, response) => {
    response.status(200).json(progress);
})

function loadUser(index) {
    equipment = usersList[index].equipment;
    inventory = usersList[index].inventory;
    shop = usersList[index].shop;
    gold = usersList[index].gold;
    progress = usersList[index].progress;
}

app.get('/api/enemyStats', (request, response) => {
    calculateStats(enemyEquipment, enemyStats);
    response.status(200).json(enemyStats);
})

app.get('/api/gearStats', (request, response) => {
    response.status(200).json(gearStats);
})

function updateUserList() {
    usersListRef.on("child_changed", function(snapshot) {
        usersList = snapshot.val();
    }, function (errorObject) {
        console.log('Error: ' + errorObject.code);
    });
}

function regearInDB() {
    const equipmentRef = db.ref(`/users/${playerIndex}/equipment`);
    const inventoryRef = db.ref(`/users/${playerIndex}/inventory`);
    equipmentRef.set(equipment);
    inventoryRef.set(inventory);
    updateUserList();
}

app.post('/api/equipment', (request, response) => {
    const slots = Object.keys(equipment[0]);
    const names = Object.values(equipment[0]);
    const inventoryIndex = parseInt(...request.body);
    const slot = inventory[inventoryIndex].slot;
    const index = slots.indexOf(slot);
    const currentItem = {name: `${names[index]}`, slot: `${slot}`};
    inventory.push(currentItem);
    equipment[0][slot] = inventory[inventoryIndex].name;
    inventory.splice(inventoryIndex, 1);
    regearInDB();
    calculateStats(equipment, heroStats);
    response.status(201).json(equipment);
})

function shopInDB() {
    const shopRef = db.ref(`/users/${playerIndex}/shop`);
    const inventoryRef = db.ref(`/users/${playerIndex}/inventory`);
    const goldRef = db.ref(`/users/${playerIndex}/gold`);
    shopRef.set(shop);
    inventoryRef.set(inventory);
    goldRef.set(gold);
    updateUserList();
}

function updateShop() {
    const odds = gearStats.map(item => item.rarity);
    let randomArray = [];
    for (let i = 0; i < odds.length; i += 1) {
        for (let j = 0; j < odds[i]; j += 1) {
            randomArray.push(i);
        }
    }
    let rand1 = Math.floor(Math.random() * randomArray.length);
    let rand2 = Math.floor(Math.random() * randomArray.length);
    let rand3 = Math.floor(Math.random() * randomArray.length);
    let item1 = randomArray[rand1];
    let item2 = randomArray[rand2];
    let item3 = randomArray[rand3];
    shop = [
        {name:`${gearStats[item1].name}`,slot:`${gearStats[item1].slot}`},
        {name:`${gearStats[item2].name}`,slot:`${gearStats[item2].slot}`},
        {name:`${gearStats[item3].name}`,slot:`${gearStats[item3].slot}`}]
}

app.get('/api/updatedshop', (request, response) => {
    if (gold >= 20) {
        gold -= 20;
        updateShop();
        shopInDB();
        response.status(200).json(shop);
    } else {
        response.status(400).json('Not enough gold');
    }
})

app.post('/api/shop', (request, response) => {
    const shopIndex = parseInt(...request.body);
    const currentItem = shop[shopIndex];
    const currentItemPrice = gearStats.find(item => item.name === currentItem.name).price;
    if (currentItemPrice > gold) {
        response.status(400).json('Not enough gold');
    } else {
        inventory.push(currentItem);
        shop.splice(shopIndex, 1);
        gold -= currentItemPrice;
        shopInDB();
        response.status(201).json([inventory, shop]);
    }
})

app.post('/api/inventory', (request, response) => {
    const invIndex = parseInt(...request.body);
    const currentItem = inventory[invIndex];
    shop.push(currentItem);
    inventory.splice(invIndex, 1);
    const currentItemPrice = gearStats.find(item => item.name === currentItem.name).price;
    gold += currentItemPrice/2;
    shopInDB();
    response.status(201).json([inventory, shop]);
})

function authIngame(email, password){
    const logins = usersList.map(user => user.login);
    const passwords = usersList.map(user => user.password);
    playerIndex = logins.indexOf(email);
    let message = [0, ''];
    if (playerIndex === -1) {
        message = [0, 'User with this email not found'];
    } else {
        if (password != passwords[playerIndex]) {
            message = [0, 'Wrong password'];
        } else {
            message = [1, playerIndex];
        }
    }
    return message;
}

app.post('/api/user', (request, response) => {
    const email = request.body[0];
    const password = request.body[1];
    message = authIngame(email, password);
    if (message[0] === 0) {
        response.status(401).json(message[1]);
    } else {
        loadUser(message[1]);
        response.status(200).json(usersList[message[1]].name);
    }
})

function addNewUser(email, password, name) {
    const newUser = {
        login: `${email}`, password: `${password}`, name: `${name}`,
        equipment: [{bag:"BagTier1",cape:"CapeTier1",food:"SandwitchTier1",potion:"PoisonTier1",mount:"HorseTier1",helmet:"HelmetTier1",armor:"ArmorTier1",boots:"BootsTier1",weapon:"SwordTier1",offhand:"ShieldTier1"}],
        inventory: [{name:"AxeTier1",slot:"weapon"}],
        shop: [{name:"AxeTier1",slot:"weapon"},{name:"HelmetTier2",slot:"helmet"}],
        gold: 100,
        progress: [0, 0, 0, 0, 0]
    }
    usersList.push(newUser);
    const usersListRef = db.ref(`/users`);
    usersListRef.set(usersList);
    updateUserList();
}

function register(email, password, name) {
    const logins = usersList.map(user => user.login);
    const index = logins.indexOf(email);
    let message = '';
    if (index === -1) {
        addNewUser(email, password, name);
        message = 'Player registered';
    } else {
        message = 'User with this email already exists';
    }
    return message;
}

app.post('/api/register', (request, response) => {
    const email = request.body[0];
    const password = request.body[1];
    const name = request.body[2];
    message = register(email, password, name);
    if (message === 'User with this email already exists') {
        response.status(400).json(message);
    } else {
        response.status(201).json(message);
    }
})

let enemiesEquipment = [];
let enemyIndex = 0;
const enemiesEquipmentRef = db.ref(`/enemies`);
enemiesEquipmentRef.on("value", function(snapshot) {
    enemiesEquipment = snapshot.val();
}, function (errorObject) {
    console.log('Error: ' + errorObject.code);
});

app.post('/api/enemies', (request, response) => {
    enemyIndex = parseInt(...request.body);
    enemyEquipment = enemiesEquipment[enemyIndex];
    response.status(200).json(enemyEquipment);
})

let rival = '';
const rivalIndex = 5;

app.post('/api/pvp', (request, response) => {
    enemyIndex = rivalIndex;
    enemyEquipment = usersList[enemyIndex].equipment;
    response.status(200).json(enemyEquipment);
})

function enemyRandomSelect() {
    const targets = ['helmet', 'armor', 'boots', 'weapon', 'offhand'];
    const enemyAttack = targets[Math.floor(Math.random() * targets.length)];
    const enemyDefence = targets[Math.floor(Math.random() * targets.length)];
    return [enemyAttack, enemyDefence];
}

function damageCalc(selectedTarget, enemyTarget, fighter1, fighter2) {
    let damage;
    if (selectedTarget === enemyTarget) {
        damage = 0;
    } else {
        damage = fighter1.attackPower * (fighter1.accuracy / 100) * (fighter2.armor / 100);
    }
    return damage;
}

function speedCheck() {
    return (heroStats[0].speed >= enemyStats[0].speed);
}

function reward(index) {
    if (index !== 5) {
        return parseInt(index * 10 * (1 + Math.random() / 2));
    }
    return parseInt(10 * (1 + Math.random() / 2));
}

function clearEnemy() {
    enemyEquipment = 0;
    enemyIndex = 0;
}

function battleWin() {
    gold += reward(enemyIndex + 1);
    progress[enemyIndex] += 1;
    const goldRef = db.ref(`/users/${playerIndex}/gold`);
    goldRef.set(gold);
    const progrRef = db.ref(`/users/${playerIndex}/progress`);
    progrRef.set(progress);
    updateUserList();
}

function battleLogic(selectedTargets, roundIndex, maxHp) {
    if (roundIndex === 0) {
        currentBattleHP = maxHp;
    }
    let message = 'continue';
    let enemyTargets = enemyRandomSelect();
    let myDamage = parseInt(damageCalc(selectedTargets[1], enemyTargets[0], heroStats[0], enemyStats[0]));
    let enemyDamage = parseInt(damageCalc(selectedTargets[0], enemyTargets[1], enemyStats[0], heroStats[0]));
    if (speedCheck()) {
        currentBattleHP[1] = currentBattleHP[1] - myDamage;
        if (currentBattleHP[1] <= 0) {
            enemyDamage = 0;
            message = 'win';
            battleWin();
            clearEnemy();
        } else {
            currentBattleHP[0] = currentBattleHP[0] - enemyDamage;
            if (currentBattleHP[0] <= 0) {
                myDamage = 0;
                message = 'battle is lost';
                clearEnemy();
            }
        }
    } else {
        currentBattleHP[0] = currentBattleHP[0] - enemyDamage;
        if (currentBattleHP[0] <= 0) {
            myDamage = 0;
            message = 'battle is lost';
            clearEnemy();
        } else {
            currentBattleHP[1] = currentBattleHP[1] - myDamage;
            if (currentBattleHP[1] <= 0) {
                enemyDamage = 0;
                message = 'win';
                battleWin();
                clearEnemy();
            }
        }
    }
    return [myDamage, enemyDamage, currentBattleHP[0], currentBattleHP[1], message];
}

let currentBattleHP = [0, 0];

app.post('/api/battle', (request, response) => {
    const selectedTargets = request.body[0];
    const roundIndex = request.body[1];
    const maxHp = [heroStats[0].health, enemyStats[0].health];

    const battleResult = battleLogic(selectedTargets, roundIndex, maxHp);
    response.status(200).json(battleResult);
})

function getRandomRival() {
    rivalIndex = Math.floor(Math.random() * usersList.length);
    rival = usersList[rivalIndex].name;
}

app.get('/api/rival', (request, response) => {
    getRandomRival();
    response.status(200).json(rival);
})

app.use(express.static(path.resolve(__dirname, 'client')))

app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})
