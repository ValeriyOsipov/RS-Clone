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

const enemyEquipment = [{
    bag: 'BagTier1',
    cape: 'CapeTier1',
    food: 'SandwitchTier1',
    potion: 'PoisonTier1',
    mount: 'HorseTier1',
    helmet: 'HelmetTier1',
    armor: 'HeavyArmorTier1',
    boots: 'BootsTier1',
    weapon: 'SwordTier1',
    offhand: 'ShieldTier1',
}]

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

function loadUser(index) {
    console.log(usersList[index]);
    equipment = usersList[index].equipment;
    inventory = usersList[index].inventory;
}

app.get('/api/enemy', (request, response) => {
    response.status(200).json(enemyEquipment);
})

app.get('/api/enemyStats', (request, response) => {
    calculateStats(enemyEquipment, enemyStats);
    response.status(200).json(enemyStats);
})

app.get('/api/gearStats', (request, response) => {
    response.status(200).json(gearStats);
})

function regearInDB() {
    const equipmentRef = db.ref(`/users/${playerIndex}/equipment`);
    const inventoryRef = db.ref(`/users/${playerIndex}/inventory`);
    equipmentRef.set(equipment);
    inventoryRef.set(inventory);
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
        response.status(200).json('hello');
    }
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

function battleLogic(selectedTargets, roundIndex, maxHp) {
    if (roundIndex === 0) {
        currentBattleHP = maxHp;
    }
    let enemyTargets = enemyRandomSelect();
    let myDamage = damageCalc(selectedTargets[1], enemyTargets[0], heroStats[0], enemyStats[0]);
    let enemyDamage = damageCalc(selectedTargets[0], enemyTargets[1], enemyStats[0], heroStats[0]);
    if (speedCheck()) {
        currentBattleHP[1] = currentBattleHP[1] - myDamage;
        if (currentBattleHP[1] <= 0) {
            //battleWin();
        } else {
            currentBattleHP[0] = currentBattleHP[0] - enemyDamage;
            if (currentBattleHP[0] <= 0) {
                //battleLose();
            }
        }
    } else {
        currentBattleHP[0] = currentBattleHP[0] - enemyDamage;
        if (currentBattleHP[0] <= 0) {
            //battleLose()
        } else {
            currentBattleHP[1] = currentBattleHP[1] - myDamage;
            if (currentBattleHP[1] <= 0) {
                //battleWin();
            }
        }
    }
    return [myDamage, enemyDamage, currentBattleHP[0], currentBattleHP[1]];
}

let currentBattleHP = [0, 0];

app.post('/api/battle', (request, response) => {
    const selectedTargets = request.body[0];
    const roundIndex = request.body[1];
    const maxHp = [heroStats[0].health, enemyStats[0].health];

    const battleResult = battleLogic(selectedTargets, roundIndex, maxHp);
    response.status(200).json(battleResult);
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
