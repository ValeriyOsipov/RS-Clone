const { NONAME } = require('dns');
const { response } = require('express');
const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('./rs-clone-3b0fc-firebase-adminsdk-x8au4-59b8931e06.json');
const { auth } = require('firebase-admin');
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
    console.log('dsfsd' + errorObject.code);
});

let equipment = [{
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
}];

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

const gearStats_test = [
    {name: 'SwordTier1', slot: 'weapon', attackPower: 10, health: 0, armor: 0, speed: 0, accuracy: 70, luck: 0},
    {name: 'AxeTier1', slot: 'weapon', attackPower: 15, health: 0, armor: 0, speed: 0, accuracy: 60, luck: 0},
    {name: 'HelmetTier1', slot: 'helmet', attackPower: 0, health: 10, armor: 5, speed: 0, accuracy: 0, luck: 0},
    {name: 'HelmetTier2', slot: 'helmet', attackPower: 0, health: 10, armor: 10, speed: 0, accuracy: 0, luck: 0},
    {name: 'BagTier1', slot: 'bag', attackPower: 0, health: 0, armor: 0, speed: 5, accuracy: 0, luck: 1},
    {name: 'CapeTier1', slot: 'cape', attackPower: 0, health: 0, armor: 2, speed: 2, accuracy: 0, luck: 1},
    {name: 'SandwitchTier1', slot: 'food', attackPower: 0, health: 10, armor: 0, speed: 0, accuracy: 0, luck: 0},
    {name: 'PoisonTier1', slot: 'potion', attackPower: 5, health: 0, armor: 0, speed: 0, accuracy: 0, luck: 0},
    {name: 'HorseTier1', slot: 'mount', attackPower: 0, health: 0, armor: 0, speed: 10, accuracy: 0, luck: 0},
    {name: 'HeavyArmorTier1', slot: 'armor', attackPower: 0, health: 20, armor: 20, speed: 0, accuracy: 0, luck: 0},
    {name: 'BootsTier1', slot: 'boots', attackPower: 0, health: 10, armor: 5, speed: 0, accuracy: 0, luck: 0},
    {name: 'ShieldTier1', slot: 'offhand', attackPower: 0, health: 0, armor: 10, speed: 0, accuracy: 0, luck: 0},
]

let inventory = [
    {name: 'AxeTier1', slot: 'weapon'},
    {name: 'HelmetTier2', slot: 'helmet'},
]

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

app.get('/api/inventory', (request, response) => {
    response.status(200).json(inventory);
})

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
    calculateStats(equipment, heroStats);
    response.status(201).json(equipment);
})

app.post('/api/user', (request, response) => {
    const email = request.body[0];
    const password = request.body[1];
    authInDB(email, password)
        .then(fetchToken);
    response.status(200).json('true');
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
