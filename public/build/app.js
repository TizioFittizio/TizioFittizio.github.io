/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    audioPath: "assets/sounds/",
    audio: [
        "raggioAaah.ogg",
        "raggioAhiaa.ogg",
        "raggioBooza.ogg",
        "raggioBrutteCose.ogg",
        "raggioCartaIgienica.ogg",
        "raggioCoronati.ogg",
        "raggioCotolette.ogg",
        "raggioDelfini.ogg",
        "raggioAuuau.ogg",
        "raggioAmmazzoSette.ogg",
        "raggioEu.ogg",
        "raggioFigliolo.ogg",
        "raggioFotocellula.ogg",
        "raggioUo.ogg",
        "raggioSalame.ogg",
        "raggioRebus.ogg",
        "raggioZucchero.ogg",
        "raggioHhho.ogg",
        "raggioOcchiali.ogg",
        "raggioSbagliato.ogg",
        "raggioStaiPiuAttento.ogg",
        "raggioSpina.ogg",
        "raggioSpazzatura.ogg",
        "raggioMotore.ogg",
        "raggioNonTiPermettere.ogg",
        "raggioNonVero.ogg",
        "raggioOuch.ogg",
        "howDoYouKnow.ogg"
    ],
    spritePath: "assets/sprites/",
    playerSprite: "chicken.png",
    playerSize: 48,
    playerDefaultHealth: 5,
    playerRespawnTime: 90,
    objectSprites: [
        "block.png"
    ]
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var loadingState_1 = __webpack_require__(6);
var levelState_1 = __webpack_require__(9);
var gameCache_1 = __webpack_require__(13);
var audioManager_1 = __webpack_require__(14);
/**
 * Classe core che memorizza gli stati possibili di gioco e processa il ciclo di rendering
 * di quello attivo
 */
var Core = /** @class */ (function () {
    function Core(_a) {
        var PIXI = _a.PIXI, app = _a.app;
        this.PIXI = PIXI;
        this.app = app;
        this.audioManager = new audioManager_1.default({ core: this });
        this.interruptGameLoop = false;
        this.cache = new gameCache_1.default();
        this.main();
        this.addListeners();
    }
    /**
     * Inizializza gli stati di gioco
     */
    Core.prototype.initStates = function () {
        this.states = [
            new loadingState_1.default({ name: "loading", core: this }),
            new levelState_1.default({ name: "level", core: this })
        ];
    };
    /**
     * Ciclo infinito del gioco
     * @param delta Delta
     */
    Core.prototype.gameLoop = function (delta) {
        if (this.interruptGameLoop)
            return;
        this.updateLayersZ();
        this.currentState.update(delta);
    };
    /**
     * Funzione eseguita per inizializzare questa istanza di CORE
     */
    Core.prototype.main = function () {
        var _this = this;
        this.initStates();
        this.currentState = this.states[0];
        this.app.ticker.add(function (delta) { return _this.gameLoop(delta); });
        this.currentState.onEnter();
    };
    /**
     * Cambia lo stato di cui deve essere eseguito l'update
     * @param name Nome del nuovo stato
     * @param args Parametri di cambiamento
     */
    Core.prototype.changeState = function (name, args) {
        this.interruptGameLoop = true;
        this.currentState.onExit();
        if (args.resetPreviousState)
            this.currentState.reset();
        var nextState = this.states.filter(function (x) { return x.name === name; })[0];
        if (args.resetFollowingState)
            nextState.reset();
        this.currentState = nextState;
        this.currentState.onEnter();
        this.interruptGameLoop = false;
    };
    /**
     * Ottiene un id univoco
     */
    Core.generateId = function () {
        return this.idGenerator++;
    };
    /**
     * Ordina i figli in base all' asse z
     */
    Core.prototype.updateLayersZ = function () {
        this.app.stage.children.sort(function (a, b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex;
        });
    };
    Core.prototype.addListeners = function () {
        var _this = this;
        setTimeout(function () {
            document.getElementsByTagName("body")[0].addEventListener("keydown", function (e) {
                if (e.key === "p") {
                    _this.interruptGameLoop = !_this.interruptGameLoop;
                    if (_this.interruptGameLoop)
                        console.log(_this);
                }
            });
        }, 1);
    };
    /** Valore incrementante usato per generare id univoci */
    Core.idGenerator = 0;
    return Core;
}());
exports.default = Core;
window.core = function (PIXI, app) {
    new Core({ PIXI: PIXI, app: app });
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var timerPool_1 = __webpack_require__(3);
var GameState = /** @class */ (function () {
    function GameState(_a) {
        var name = _a.name, core = _a.core;
        this.name = name;
        this.core = core;
        this.timerPool = new timerPool_1.default({ core: this.core });
    }
    GameState.prototype.onEnter = function () {
    };
    GameState.prototype.onExit = function () {
    };
    /**
     * Esegue l'update dei timer e dei pool
     * @param delta Delta
     */
    GameState.prototype.update = function (delta) {
        this.timerPool.updatePool(delta);
    };
    GameState.prototype.reset = function () {
    };
    /**
     * Esegue una callback o più callback secondo un tempo specificato
     * @param clockParams Argomenti timer
     */
    GameState.prototype.addTimer = function (clockParams) {
        this.timerPool.addTimer(clockParams);
    };
    /**
     * Continua ad eseguire una o più callback secondo un tempo specificato
     * @param clockParams   Argomenti timer
     * @param name          Nome Loop
     */
    GameState.prototype.addLoop = function (clockParams, name) {
        this.timerPool.addLoop(clockParams, name);
    };
    /**
     * Interrompe un loop precedentemente impostato
     * @param name      Nome loop
     */
    GameState.prototype.removeLoop = function (name) {
        this.timerPool.removeLoop(name);
    };
    return GameState;
}());
exports.default = GameState;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = __webpack_require__(7);
var loop_1 = __webpack_require__(8);
/**
 * Questa classe esegue l'update di timer e di loop al suo interno
 */
var TimerPool = /** @class */ (function () {
    function TimerPool(_a) {
        var core = _a.core;
        this.core = core;
        this.clocks = [];
    }
    /**
     * Aggiunge un timer al timerPool
     * @param param0 Argomenti per il timer
     * @return id del timer creato
     */
    TimerPool.prototype.addTimer = function (params) {
        var timer = new timer_1.default({
            timerPool: this,
            group: params.group
        }, params.actions ? params.actions : [[params.time, params.callback]]);
        this.clocks.push(timer);
        return timer.id;
    };
    /**
     * Rimuove un timer dal pool, interrompendo la sua esecuzione
     * @param id Id del timer
     */
    TimerPool.prototype.removeTimer = function (id) {
        this.clocks = this.clocks.filter(function (x) { return x instanceof loop_1.default ? true : x.id !== id; });
    };
    /**
     * Rimuove dei timer dal pool, interrompendo la loro esecuzione
     * @param group Gruppo del timer, i timer di default come gruppo hanno null
     */
    TimerPool.prototype.removeTimerByGroup = function (group) {
        this.clocks = this.clocks.filter(function (x) { return x instanceof loop_1.default ? true : x.group !== group; });
    };
    TimerPool.prototype.addLoop = function (params, name) {
        var loop = new loop_1.default({
            timerPool: this,
            group: params.group,
            name: name
        }, params.actions ? params.actions : [[params.time, params.callback]]);
        this.clocks.push(loop);
    };
    TimerPool.prototype.removeLoop = function (name) {
        this.clocks = this.clocks.filter(function (x) { return x instanceof timer_1.default ? true : x.name !== name; });
    };
    TimerPool.prototype.updatePool = function (delta) {
        this.clocks.forEach(function (x) { return x.update(delta); });
    };
    TimerPool.prototype.clear = function () {
        this.clocks = [];
    };
    return TimerPool;
}());
exports.default = TimerPool;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(0);
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /**
     * Crea uno sprite tramite PIXI
     * @param core
     * @param path
     */
    Utils.createSprite = function (core, name) {
        return new core.PIXI.Sprite(core.PIXI.loader.resources[constants_1.default.spritePath + name].texture);
    };
    /**
     * Dati due sprite creati tramite PIXI, verifica se collidono
     * @param r1 Sprite1
     * @param r2 Sprite2
     */
    Utils.hitTestRectangle = function (r1, r2) {
        //Calculate `centerX` and `centerY` properties on the sprites
        r1.centerX = r1.x + r1.width / 2;
        r1.centerY = r1.y + r1.height / 2;
        r2.centerX = r2.x + r2.width / 2;
        r2.centerY = r2.y + r2.height / 2;
        //Calculate the `halfWidth` and `halfHeight` properties of the sprites
        r1.halfWidth = r1.width / 2;
        r1.halfHeight = r1.height / 2;
        r2.halfWidth = r2.width / 2;
        r2.halfHeight = r2.height / 2;
        //Create a `collision` variable that will tell us
        //if a collision is occurring
        var collision = false;
        //Check whether the shapes of the sprites are overlapping. If they
        //are, set `collision` to `true`
        if (Math.abs(r1.centerX - r2.centerX) < r1.halfWidth + r2.halfWidth
            && Math.abs(r1.centerY - r2.centerY) < r1.halfHeight + r2.halfHeight) {
            collision = true;
        }
        //Return the value of `collision` back to the main program
        return collision;
    };
    return Utils;
}());
exports.default = Utils;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var timerPool_1 = __webpack_require__(3);
var GameObject = /** @class */ (function () {
    function GameObject(_a) {
        var name = _a.name, core = _a.core, x = _a.x, y = _a.y, width = _a.width, height = _a.height, sprite = _a.sprite;
        this.name = name;
        this.core = core;
        this.id = core_1.default.generateId();
        this.initSprite(sprite, x, y, width, height);
        this.liveTime = 0;
        this.timerPool = new timerPool_1.default({ core: core });
    }
    GameObject.prototype.initSprite = function (sprite, x, y, width, height) {
        this.sprite = sprite;
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.width = width;
        this.sprite.height = height;
        //this.sprite.pivot.set(width / 2, height / 2);
        //console.log(this.sprite.pivot);
    };
    /**
     * Listener eseguito quando il GameObject viene aggiunto al pool
     */
    GameObject.prototype.onCreate = function () {
    };
    /**
     * Listener eseguito quando il GameObject viene rimosso dal pool
     */
    GameObject.prototype.onDestroy = function () {
        this.timerPool.clear();
    };
    /**
     * Update dell' oggetto, gestisce i timer ed i loop
     * @param delta Delta
     */
    GameObject.prototype.update = function (delta) {
        this.liveTime += delta;
        this.timerPool.updatePool(delta);
    };
    /**
     * Listener eseguito quando si tocca un gameObject collidable se
     * questo oggetto ha attivo checkCollision
     * @param obj GameObject toccato
     */
    GameObject.prototype.onCollision = function (obj) {
    };
    /**
     * Listener eseguito quando si riceve un messaggio dal pool
     * @param message Nome del messaggio
     */
    GameObject.prototype.onMessageReceived = function (message) {
    };
    /**
     * Ottiene lo sprite di questo gameObject
     */
    GameObject.prototype.getSprite = function () {
        return this.sprite;
    };
    /**
     * Rimuove questo oggetto dal pool, distruggendolo
     */
    GameObject.prototype.destroy = function () {
        this.gameObjectPool.removeGameObjectById(this.id);
    };
    /**
     * DEVE ESSERE CHIAMATO SOLO DA GAMEOBJECTPOOL
     * @param pool Istanza di GameObjectPool
     */
    GameObject.prototype.setGameObjectPool = function (pool) {
        this.gameObjectPool = pool;
    };
    /**
     * Indica se deve essere considerato dagli oggetti con checkCollision
     */
    GameObject.prototype.isCollidable = function () {
        return this.collidable;
    };
    /**
     * Indica se il listener della collisione deve essere attivato quando
     * si toccano gameObject con collidable
     */
    GameObject.prototype.shouldCheckCollision = function () {
        return this.checkCollision;
    };
    /**
     * Esegue una callback o più callback secondo un tempo specificato
     * @param clockParams Argomenti timer
     */
    GameObject.prototype.addTimer = function (clockParams) {
        this.timerPool.addTimer(clockParams);
    };
    /**
     * Rimuove un timer precedentemente impostato
     * @param param0 id o gruppo del timer
     */
    GameObject.prototype.removeTimer = function (_a) {
        var id = _a.id, group = _a.group;
        if (id)
            this.timerPool.removeTimer(id);
        else if (group)
            this.timerPool.removeTimerByGroup(group);
        else
            console.warn("Tentato di rimuovere un timer con ", id, group);
    };
    /**
     * Continua ad eseguire una o più callback secondo un tempo specificato
     * @param clockParams   Argomenti timer
     * @param name          Nome Loop
     */
    GameObject.prototype.addLoop = function (clockParams, name) {
        this.timerPool.addLoop(clockParams, name);
    };
    /**
     * Interrompe un loop precedentemente impostato
     * @param name      Nome loop
     */
    GameObject.prototype.removeLoop = function (name) {
        this.timerPool.removeLoop(name);
    };
    return GameObject;
}());
exports.default = GameObject;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gameState_1 = __webpack_require__(2);
var constants_1 = __webpack_require__(0);
/**
 * Stato di caricamento
 */
var LoadingState = /** @class */ (function (_super) {
    __extends(LoadingState, _super);
    function LoadingState(_a) {
        var name = _a.name, core = _a.core;
        return _super.call(this, { name: name, core: core }) || this;
        //this.loadingText = new Text("");
    }
    LoadingState.prototype.onEnter = function () {
        this.loadingText = new this.core.PIXI.Text("", {
            wordWrap: true,
            fill: ['#ffffff']
        });
        this.loadingText.x = 0;
        this.loadingText.y = 0;
        this.core.app.stage.addChild(this.loadingText);
        this.loadAssets();
        //this.core.app.stage.addChild(this.loadingText);
    };
    LoadingState.prototype.onExit = function () {
        this.core.app.stage.removeChild(this.loadingText);
    };
    LoadingState.prototype.update = function (delta) {
    };
    LoadingState.prototype.reset = function () {
    };
    LoadingState.prototype.loadAssets = function () {
        var assetsToLoad = [];
        assetsToLoad.push(constants_1.default.spritePath + constants_1.default.playerSprite);
        constants_1.default.objectSprites.forEach(function (x) { return assetsToLoad.push(constants_1.default.spritePath + x); });
        //assetsToLoad = assetsToLoad.concat(constants.audio.map(x => x.path));
        this.core.PIXI.loader.add(assetsToLoad, { crossOrigin: 'anonymous' })
            .on("progress", this.loadProgressHandler.bind(this))
            .load(this.onAssetsLoaded.bind(this));
    };
    LoadingState.prototype.loadProgressHandler = function (loader, resource) {
        console.log("Caricato", resource, loader.progress);
        this.loadingText.setText(loader.progress + "%");
    };
    LoadingState.prototype.onAssetsLoaded = function () {
        this.core.changeState("level", {});
    };
    return LoadingState;
}(gameState_1.default));
exports.default = LoadingState;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var Timer = /** @class */ (function () {
    function Timer(_a, actionsArray) {
        var id = _a.id, timerPool = _a.timerPool, _b = _a.group, group = _b === void 0 ? null : _b;
        this.timers = actionsArray.map(function (x) { return x[0]; });
        this.callbacks = actionsArray.map(function (x) { return x[1]; });
        this.time = this.timers.shift();
        this.timerPool = timerPool;
        this.id = core_1.default.generateId();
        this.group = group;
    }
    Timer.prototype.update = function (delta) {
        this.time -= delta;
        if (this.time <= 0) {
            this.callbacks.shift()();
            if (this.timers.length) {
                //Sottraggo il tempo che è andato sotto lo 0
                var difference = this.time;
                this.time = this.timers.shift();
                this.time -= difference;
            }
            else {
                this.timerPool.removeTimer(this.id);
            }
        }
    };
    return Timer;
}());
exports.default = Timer;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__(1);
var Loop = /** @class */ (function () {
    function Loop(_a, actionsArray) {
        var name = _a.name, _b = _a.group, group = _b === void 0 ? null : _b;
        this.id = core_1.default.generateId();
        this.name = name;
        this.group = group;
        this.timers = actionsArray.map(function (x) { return x[0]; });
        this.callbacks = actionsArray.map(function (x) { return x[1]; });
        this.currentIndex = 0;
        this.currentTime = this.timers[this.currentIndex];
    }
    Loop.prototype.update = function (delta) {
        this.currentTime -= delta;
        if (this.currentTime <= 0) {
            this.callbacks[this.currentIndex]();
            this.currentIndex = (this.currentIndex + 1) % this.callbacks.length;
            //Sottraggo il tempo che è andato sotto lo 0
            var restart = this.timers[this.currentIndex];
            restart -= this.currentTime;
            this.currentTime = restart;
        }
    };
    return Loop;
}());
exports.default = Loop;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gameState_1 = __webpack_require__(2);
var gameObjectPool_1 = __webpack_require__(10);
var player_1 = __webpack_require__(11);
var constants_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(4);
var wall_1 = __webpack_require__(12);
var LevelState = /** @class */ (function (_super) {
    __extends(LevelState, _super);
    //TODO URGENTE FAI CHE TUTTI GLI OGGETTI DI UNO STATO SONO DENTRO UN CONTAINER DI PIXI
    //E TROVA ANCHE UN MODO PER GESTIRE LO Z INDEX
    function LevelState(_a) {
        var name = _a.name, core = _a.core;
        var _this = _super.call(this, { name: name, core: core }) || this;
        _this.gameObjectPool = new gameObjectPool_1.default({ core: _this.core });
        _this.initText();
        _this.firstMoving = 0;
        return _this;
    }
    LevelState.prototype.initText = function () {
        this.subtitleText = new this.core.PIXI.Text('', {
            fill: ['#ffffff'],
            wordWrap: true,
            wordWrapWidth: 390,
            breakWords: true
        });
        this.subtitleText.x = 206;
        this.subtitleText.y = 690;
        this.subtitleText.zIndex = -100;
        this.subtitleText.anchor.set(0.5);
        this.core.app.stage.addChild(this.subtitleText);
        this.healthText = new this.core.PIXI.Text("", {
            fill: ['#ffffff']
        });
        this.core.app.stage.addChild(this.healthText);
    };
    LevelState.prototype.onEnter = function () {
        var _this = this;
        _super.prototype.onEnter.call(this);
        var playerSprite = utils_1.default.createSprite(this.core, constants_1.default.playerSprite);
        this.player = new player_1.default({ name: "player", core: this.core, x: 178, y: 600, sprite: playerSprite, levelState: this });
        this.gameObjectPool.addGameObject(this.player);
        this.addTimer({
            time: 180,
            callback: function () {
                _this.subtitleText.setText("Trascinami");
                _this.firstMoving = 1;
            }
        });
    };
    LevelState.prototype.onExit = function () {
        _super.prototype.onExit.call(this);
        this.gameObjectPool.clearPool();
    };
    LevelState.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.gameObjectPool.updatePool(delta);
    };
    LevelState.prototype.reset = function () {
        _super.prototype.reset.call(this);
    };
    LevelState.prototype.onPlayerMoving = function () {
        if (this.firstMoving === 1) {
            this.firstMoving = 2;
            this.startLevel();
        }
    };
    LevelState.prototype.startLevel = function () {
        var _this = this;
        this.subtitleText.setText("");
        this.core.audioManager.playAudio("howDoYouKnow.ogg", {
            volume: 0.75
        });
        this.player.updateUI();
        this.addTimer({
            actions: [
                [60 * 8.5, function () {
                        _this.core.audioManager.playAudio("raggioSalame.ogg", {
                            endCallback: function () {
                                _this.subtitleText.setText("");
                                _this.player.speak();
                                _this.addLoop({
                                    callback: function () { return _this.spawnWall1(); },
                                    time: 35
                                }, "loop1");
                            }
                        });
                    }],
                [60 * 0.5, function () { return _this.subtitleText.setText("Finisci il salame!"); }],
                [60 * 42, function () { return _this.removeLoop("loop1"); }],
                [60 * 4, function () { return _this.addLoop({
                        callback: function () { return _this.spawnWall2(); },
                        time: 35
                    }, "loop2"); }
                ],
                [60 * 42, function () { return _this.removeLoop("loop2"); }],
                [60 * 2, function () { return _this.addLoop({
                        callback: function () { return _this.spawnWall3(); },
                        time: 120
                    }, "loop3"); }],
                [60 * 37, function () { return _this.removeLoop("loop3"); }],
                [60 * 1, function () { return _this.spawnWall4(); }],
                [60 * 9, function () { return _this.addLoop({
                        time: 30,
                        callback: function () {
                            _this.spawnWall1(false);
                            _this.spawnWall2(false);
                        }
                    }, "loop4"); }]
            ]
        });
    };
    LevelState.prototype.generateWall = function (x, y, velX, velY, bounceX, bounceY, increment, size) {
        var wallSprite = utils_1.default.createSprite(this.core, "block.png");
        var wall = new wall_1.default({
            name: "wall",
            core: this.core,
            x: x,
            y: y,
            width: size,
            height: size,
            sprite: wallSprite,
            speed: { x: velX, y: velY },
            bounceX: bounceX,
            bounceY: bounceY,
            increment: increment
        });
        this.gameObjectPool.addGameObject(wall);
    };
    LevelState.prototype.spawnWall1 = function (again) {
        var position = ~~(Math.random() * 6);
        this.generateWall(position * 64, -64, 0, 8, false, false, false, 64);
        if (again === false)
            return;
        if (Math.random() < 0.4)
            this.spawnWall1(false);
    };
    LevelState.prototype.spawnWall2 = function (again) {
        var position = ~~(Math.random() * 6);
        this.generateWall(position * 64, 732 + 64, 0, -8, false, false, false, 64);
        if (again === false)
            return;
        if (Math.random() < 0.4)
            this.spawnWall2(false);
    };
    LevelState.prototype.spawnWall3 = function () {
        var y = Math.random() > 0.5 ? -128 : 732 + 128;
        this.generateWall(Math.random() * (412 - 128), y, 8, y > 0 ? -4 : 4, true, false, false, 128);
    };
    LevelState.prototype.spawnWall4 = function () {
        this.generateWall(-128, -128, 6, 6, false, false, true, 128);
    };
    return LevelState;
}(gameState_1.default));
exports.default = LevelState;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(4);
var GameObjectPool = /** @class */ (function () {
    function GameObjectPool(_a) {
        var core = _a.core;
        this.pool = [];
        this.core = core;
    }
    GameObjectPool.prototype.updatePool = function (delta) {
        //Update di tutti i GameObject
        this.pool.forEach(function (x) { return x.update(delta); });
        //Check collisione
        var canCollide = this.pool.filter(function (x) { return x.shouldCheckCollision(); });
        var possibileCollision = this.pool.filter(function (x) { return x.isCollidable(); });
        canCollide.forEach(function (walker) {
            //Controllo se l'oggetto in questione deve ancora ricevere collisioni
            if (!walker.shouldCheckCollision())
                return;
            possibileCollision.forEach(function (wall) {
                //Non controllo le collisioni con me stesso
                if (walker === wall)
                    return;
                //Controllo se l'oggetto in questione deve ancora ricevere collisioni
                if (!walker.shouldCheckCollision())
                    return;
                var walkerSprite = walker.getSprite();
                var wallSprite = wall.getSprite();
                if (utils_1.default.hitTestRectangle(walkerSprite, wallSprite)) {
                    walker.onCollision(wall);
                }
            });
        });
    };
    GameObjectPool.prototype.addGameObject = function (obj) {
        obj.setGameObjectPool(this);
        this.core.app.stage.addChild(obj.getSprite());
        this.pool.push(obj);
        obj.onCreate();
    };
    GameObjectPool.prototype.removeGameObjectById = function (id) {
        var toRemove = this.pool.filter(function (x) { return x.id === id; })[0];
        if (!toRemove) {
            console.warn("Nessun gameObject con id " + id + " presente!");
        }
        else {
            this.core.app.stage.removeChild(toRemove.getSprite());
            toRemove.onDestroy();
            this.pool = this.pool.filter(function (x) { return x.id !== id; });
        }
    };
    GameObjectPool.prototype.removeGameObjectByName = function (name) {
        var toRemove = this.pool.filter(function (x) { return x.name == name; })[0];
        if (!toRemove) {
            console.warn("Nessun gameObject con nome " + name + " presente!");
        }
        else {
            this.core.app.stage.removeChild(toRemove.getSprite());
            toRemove.onDestroy();
            this.pool = this.pool.filter(function (x) { return x.name != name; });
        }
    };
    GameObjectPool.prototype.clearPool = function () {
        this.pool = [];
    };
    /**
     * Fa ricevere un messaggio a tutti i gameObject
     * @param message nome messaggio
     */
    GameObjectPool.prototype.sendMessage = function (message) {
        this.pool.forEach(function (x) { return x.onMessageReceived(message); });
    };
    return GameObjectPool;
}());
exports.default = GameObjectPool;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gameObject_1 = __webpack_require__(5);
var constants_1 = __webpack_require__(0);
var PlayerPhrase = /** @class */ (function () {
    //TODO REFACTORING PERCHE ACCETTI UN UNICO ARRAY
    function PlayerPhrase(audioName, words, wordsTime) {
        this.audioName = audioName;
        this.words = words;
        this.wordsTime = wordsTime;
    }
    return PlayerPhrase;
}());
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    //TODO sarebbe davvero figo ruotare in base alla direzione dell x
    function Player(_a) {
        var name = _a.name, core = _a.core, x = _a.x, y = _a.y, sprite = _a.sprite, levelState = _a.levelState;
        var _this = _super.call(this, { name: name, core: core, x: x, y: y, sprite: sprite, width: constants_1.default.playerSize, height: constants_1.default.playerSize }) || this;
        _this.levelState = levelState;
        _this.checkCollision = true;
        _this.health = constants_1.default.playerDefaultHealth;
        _this.phraseBook = _this.initPhraseBook();
        _this.harmPhraseBook = _this.initHarmPhraseBook();
        _this.addTouchControls();
        return _this;
    }
    Player.prototype.onCreate = function () {
        _super.prototype.onCreate.call(this);
        /*this.addTimer(() => {
            this.addLoop(() => {
                const sound = this.core.PIXI.sound.Sound.from(constants.audioToLoad[0].path);
                sound.play();
            }, "loopBase", 60);
        }, 300);*/
        /*this.addLoop(() => {
            this.core.audioManager.playAudio("raggioUo", "raggio");
        }, "test", 60);*/
    };
    Player.prototype.onDestroy = function () {
        _super.prototype.onDestroy.call(this);
        console.log("Distrutto!");
    };
    Player.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
    };
    Player.prototype.onCollision = function (obj) {
        _super.prototype.onCollision.call(this, obj);
        console.log("Colpito da ", obj);
        this.damage();
    };
    Player.prototype.damage = function () {
        var _this = this;
        this.health--;
        this.updateUI();
        this.checkCollision = false;
        this.addLoop({
            actions: [
                [5, function () { return _this.sprite.alpha = 0; }],
                [5, function () { return _this.sprite.alpha = 1; }]
            ]
        }, "respawn");
        this.addTimer({
            time: constants_1.default.playerRespawnTime,
            callback: function () {
                _this.removeLoop("respawn");
                _this.sprite.alpha = 1;
                _this.checkCollision = true;
            },
            group: "respawn"
        });
        this.speak(true);
    };
    Player.prototype.addTouchControls = function () {
        this.sprite.interactive = true;
        this.sprite
            .on('mousedown', this.onDragStart.bind(this))
            .on('touchstart', this.onDragStart.bind(this))
            .on('mouseup', this.onDragEnd.bind(this))
            .on('mouseupoutside', this.onDragEnd.bind(this))
            .on('touchend', this.onDragEnd.bind(this))
            .on('touchendoutside', this.onDragEnd.bind(this))
            .on('mousemove', this.onDragMove.bind(this))
            .on('touchmove', this.onDragMove.bind(this));
    };
    Player.prototype.onDragStart = function (event) {
        this.touchData = event.data;
        this.touchDragging = true;
    };
    Player.prototype.onDragEnd = function () {
        this.touchDragging = false;
        this.touchData = null;
    };
    Player.prototype.onDragMove = function () {
        if (this.touchDragging) {
            var newPosition = this.touchData.getLocalPosition(this.sprite.parent);
            this.sprite.position.x = newPosition.x - this.sprite.width / 2;
            this.sprite.position.y = newPosition.y - this.sprite.height / 2;
            this.levelState.onPlayerMoving();
        }
    };
    Player.prototype.updateUI = function () {
        this.levelState.healthText.setText(this.health);
    };
    Player.prototype.speak = function (harm) {
        var _this = this;
        //Zittisco frasi precedentemente in esecuzione
        this.removeTimer({ group: "raggio" });
        this.levelState.subtitleText.setText("");
        var toSay;
        if (!harm)
            toSay = this.phraseBook[~~(Math.random() * this.phraseBook.length)];
        else
            toSay = this.harmPhraseBook[~~(Math.random() * this.harmPhraseBook.length)];
        //const toSay = this.phraseBook[this.phraseBook.length - 1];
        this.core.audioManager.playAudio(toSay.audioName, {
            endCallback: function () {
                _this.removeTimer({ group: "raggio" });
                _this.levelState.subtitleText.setText("");
                _this.addTimer({
                    callback: function () { return _this.speak(); },
                    time: Math.random() * 150,
                    group: "raggio"
                });
            },
            stringId: "raggio"
        });
        var callbacks = [];
        var _loop_1 = function (i) {
            callbacks.push([toSay.wordsTime[i], function () {
                    _this.levelState.subtitleText.setText(toSay.words[i]);
                }]);
        };
        for (var i = 0; i < toSay.words.length; i++) {
            _loop_1(i);
        }
        this.addTimer({
            actions: callbacks,
            group: "raggio"
        });
        /*this.addTimer({
            actions: [
                [200, () => console.log("!")],
                [200, () => console.log("!!")],
                [200, () => console.log("!!!")],
                [200, () => console.log("!!!!")],
                [200, () => console.log("!!!!!")],
                [200, () => this.destroy()]
            ]
        });*/
    };
    Player.prototype.initPhraseBook = function () {
        var phraseBook = [
            new PlayerPhrase("raggioBooza.ogg", ["Booza booza booza", "booza booza buz"], [0, 70]),
            new PlayerPhrase("raggioAuuau.ogg", ["Ahuaaaaaao"], [0]),
            new PlayerPhrase("raggioBrutteCose.ogg", ["Non devi più dire", "queste brutte", "coseeee"], [0, 80, 100]),
            new PlayerPhrase("raggioCartaIgienica.ogg", ["HhhHmmh", "carta igienicaaaaaaaaaaa"], [0, 70]),
            new PlayerPhrase("raggioCoronati.ogg", ["Coronati il cazzooh"], [0]),
            new PlayerPhrase("raggioCotolette.ogg", ["Tre cotolette", "e mozzarellaa", "Ohoh", ""], [0, 80, 120, 20]),
            new PlayerPhrase("raggioDelfini.ogg", ["I delfini devono smetterla", "di inquinareeeeeeee"], [0, 120]),
            new PlayerPhrase("raggioFigliolo.ogg", ["Ricorda figliolo", "le idee", "vengono cagando"], [0, 80, 60]),
            new PlayerPhrase("raggioFotocellula.ogg", ["La fotocellula", "è fottutaaahh"], [0, 60]),
            new PlayerPhrase("raggioHhho.ogg", ["Hhooh"], [0]),
            new PlayerPhrase("raggioMotore.ogg", [
                "hhh..perchè",
                "Mwhooo",
                "Eh no perchè",
                "Mwhooo",
                "Eeh mh mh 😕",
                "Mh Mh Mho",
                "Oooh Oooh",
                "Oooooooh",
                "Ooooohuah"
            ], [0, 60, 40, 70, 60, 60, 80, 80, 80]),
            new PlayerPhrase("raggioNonTiPermettere.ogg", ["Non ti permettere di parlarmi cosi eh", "Non ti permettere", "Non lo fare piùùùù"], [0, 120, 70]),
            new PlayerPhrase("raggioNonVero.ogg", ["Hm mw", "Uo oooh", "Non è veroooooooooooo"], [0, 60, 70]),
            new PlayerPhrase("raggioRebus.ogg", [
                "Scometto che non sai risolvere questo rebus",
                "5 volte",
                "che i chiodi",
                "cadono dal soffitto",
                "fan per 2!",
                "3,5",
                "senza dividere",
                "il moltiplicando per il divisore",
                "Quindi tu",
                "pensa che",
                "l'altro giorno",
                "hhhhhh",
                "mi ero messo il gel",
                "mi sono caduti i capelli",
                "ho moltiplicato per 4!",
                "E sai che mi è uscito fuori?",
                "Di fare la borsa!",
                "Bisogna dividere tutto per 0!",
                "uu?☼aa"
            ], //gel        //uscito fuori
            [0, 160, 100, 80, 100, 120, 100, 60, 120, 80, 60, 60, 50, 70, 90, 100, 100, 100, 120]),
            new PlayerPhrase("raggioSpazzatura.ogg", [
                "Hm hm hm",
                "L'altro giorno",
                "stavo",
                "pulendo la spazzatura",
                "però",
                "è arrivato",
                "Mr.Gigi",
                "e ha detto",
                "\"Ma vaffanculo\"",
                "hhhoh"
            ], //arrivato
            [0, 80, 70, 70, 70, 60, 100, 80, 80, 100]),
            new PlayerPhrase("raggioZucchero.ogg", [
                "Dov'è lo zuccherooooo"
            ], [0]),
        ];
        return phraseBook;
    };
    Player.prototype.initHarmPhraseBook = function () {
        var phraseBook = [
            new PlayerPhrase("raggioStaiPiuAttento.ogg", [
                "Ehi ma sta più attento",
                "mi hai fatto maleeee",
                "",
                "Guarda dove vai",
                "Guarda la stradaaaa"
            ], [0, 80, 80, 60, 60, 60]),
            new PlayerPhrase("raggioSbagliato.ogg", ["Hai sbagliatoooo"], [0]),
            new PlayerPhrase("raggioOuch.ogg", ["Ouch", "Ouuuuuu"], [0, 40]),
            new PlayerPhrase("raggioAaah.ogg", ["Aaaaaaaaaaah"], [0]),
            new PlayerPhrase("raggioAhiaa.ogg", ["Ahiaaaaaaaaaaa"], [0]),
            new PlayerPhrase("raggioAmmazzoSette.ogg", ["Ahia!!!", "Se sbagli ancora una volta", "ti ammazzo in 7!!!!"], [0, 40, 60])
        ];
        return phraseBook;
    };
    return Player;
}(gameObject_1.default));
exports.default = Player;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var gameObject_1 = __webpack_require__(5);
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(_a) {
        var name = _a.name, core = _a.core, x = _a.x, y = _a.y, sprite = _a.sprite, width = _a.width, height = _a.height, speed = _a.speed, bounceX = _a.bounceX, bounceY = _a.bounceY, increment = _a.increment;
        var _this = _super.call(this, { name: name, core: core, x: x, y: y, sprite: sprite, width: width, height: height }) || this;
        _this.collidable = true;
        _this.speed = speed;
        _this.bounceX = bounceX;
        _this.bounceY = bounceY;
        _this.increment = increment;
        return _this;
    }
    Wall.prototype.onCreate = function () {
        var _this = this;
        if (this.increment) {
            this.addTimer({
                time: 60 * 0.8,
                callback: function () {
                    _this.bounceX = true;
                    _this.bounceY = true;
                }
            });
        }
    };
    Wall.prototype.onDestroy = function () {
    };
    Wall.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        this.sprite.x += this.speed.x;
        this.sprite.y += this.speed.y;
        if (this.liveTime > 9 * 60)
            this.destroy();
        if (this.bounceX) {
            if (this.sprite.x > 412 - this.sprite.width)
                this.speed.x = -this.speed.x;
            if (this.sprite.x < 0)
                this.speed.x = -this.speed.x;
        }
        if (this.bounceY) {
            if (this.sprite.y > 732 - this.sprite.height)
                this.speed.y = -this.speed.y;
            if (this.sprite.y < 0)
                this.speed.y = -this.speed.y;
        }
        if (this.increment) {
            if (this.speed.x > 0)
                this.speed.x += 0.03;
            else
                this.speed.x -= 0.03;
            if (this.speed.y > 0)
                this.speed.y += 0.03;
            else
                this.speed.y -= 0.03;
        }
    };
    Wall.prototype.onCollision = function (obj) {
    };
    return Wall;
}(gameObject_1.default));
exports.default = Wall;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GameCache = /** @class */ (function () {
    function GameCache() {
        this.cache = [];
    }
    GameCache.prototype.get = function (name) {
        var result = this.cache.filter(function (x) { return x.name == name; })[0];
        return result ? result.object : null;
    };
    GameCache.prototype.set = function (name, object) {
        this.cache.push({ name: name, object: object });
    };
    GameCache.prototype.clear = function () {
        this.cache = [];
    };
    return GameCache;
}());
exports.default = GameCache;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = __webpack_require__(0);
var PlayingAudio = /** @class */ (function () {
    function PlayingAudio(_a) {
        var name = _a.name, audio = _a.audio;
        this.name = name;
        this.audio = audio;
    }
    return PlayingAudio;
}());
//TODO IMPLEMENTARE CACHE PIXI-SOUND http://pixijs.io/pixi-sound/examples/index.html#section-library
//TODO implementare semplice stop audio
var AudioManager = /** @class */ (function () {
    function AudioManager(_a) {
        var core = _a.core;
        this.core = core;
        this.audioPool = [];
    }
    /**
     * Riproduce un audio
     * @param name          Nome dell' audio da riprodurre
     * @param options       Opzioni di riproduzione
     */
    AudioManager.prototype.playAudio = function (name, options) {
        //Se esiste già un audio con lo stesso id viene fermato e rimosso dal pool
        if (options && options.stringId)
            this.removeFromPool(options.stringId);
        //Ottengo l'audio da riprodurre e creo l'istanza
        var audio = constants_1.default.audio.filter(function (x) { return x === name; })[0];
        if (!audio) {
            console.warn("Nessun audio associato a " + name);
            return;
        }
        var source = this.core.PIXI.sound.Sound.from({
            url: constants_1.default.audioPath + audio,
            speed: options ? options.speed || 1 : 1,
            autoPlay: true,
            volume: options ? options.volume || 1 : 1,
            complete: function () {
                if (options && options.stringId)
                    this.removeFromPool(options.stringId);
                if (options && options.endCallback)
                    options.endCallback();
            }.bind(this)
        });
        //Riproduco ed aggiungo al pool, alla sua esecuzione sarà rimosso
        if (options && options.stringId)
            this.addToPool(options.stringId, source);
    };
    AudioManager.prototype.addToPool = function (name, source) {
        var sound = new PlayingAudio({ name: name, audio: source });
        this.audioPool.push(sound);
    };
    AudioManager.prototype.removeFromPool = function (name) {
        var audioObj = this.audioPool.filter(function (x) { return x.name == name; })[0];
        if (!audioObj)
            return;
        audioObj.audio.stop(0);
        this.audioPool = this.audioPool.filter(function (x) { return x.name != name; });
    };
    return AudioManager;
}());
exports.default = AudioManager;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2M4YTJhYzllOTUzOTczNWMzMjAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xhc3Nlcy9nYW1lU3RhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvdGltZXJQb29sLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xhc3Nlcy9nYW1lT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZXMvbG9hZGluZ1N0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL3RpbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2xvb3AudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlcy9sZXZlbFN0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2dhbWVPYmplY3RQb29sLnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lT2JqZWN0cy9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWVPYmplY3RzL3dhbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvZ2FtZUNhY2hlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2F1ZGlvTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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QUcsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDMUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBQztZQUNkLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztnQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzNFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3hELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUM7WUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLElBQUk7WUFDMUMsSUFBSTtnQkFBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7WUFDMUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FB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ZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2M4YTJhYzllOTUzOTczNWMzMjAiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBhdWRpb1BhdGg6IFwiYXNzZXRzL3NvdW5kcy9cIixcclxuICAgIGF1ZGlvOiBbXHJcbiAgICAgICAgXCJyYWdnaW9BYWFoLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQWhpYWEub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Cb296YS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb0JydXR0ZUNvc2Uub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9DYXJ0YUlnaWVuaWNhLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQ29yb25hdGkub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Db3RvbGV0dGUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9EZWxmaW5pLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQXV1YXUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9BbW1henpvU2V0dGUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9FdS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb0ZpZ2xpb2xvLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvRm90b2NlbGx1bGEub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Vby5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1NhbGFtZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1JlYnVzLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvWnVjY2hlcm8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9IaGhvLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvT2NjaGlhbGkub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9TYmFnbGlhdG8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9TdGFpUGl1QXR0ZW50by5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1NwaW5hLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvU3BhenphdHVyYS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb01vdG9yZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb05vblRpUGVybWV0dGVyZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb05vblZlcm8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9PdWNoLm9nZ1wiLFxyXG4gICAgICAgIFwiaG93RG9Zb3VLbm93Lm9nZ1wiXHJcbiAgICBdLFxyXG4gICAgc3ByaXRlUGF0aDogXCJhc3NldHMvc3ByaXRlcy9cIixcclxuICAgIHBsYXllclNwcml0ZTogXCJjaGlja2VuLnBuZ1wiLFxyXG4gICAgcGxheWVyU2l6ZTogNDgsXHJcbiAgICBwbGF5ZXJEZWZhdWx0SGVhbHRoOiA1LFxyXG4gICAgcGxheWVyUmVzcGF3blRpbWU6IDkwLFxyXG4gICAgb2JqZWN0U3ByaXRlczpbXHJcbiAgICAgICAgXCJibG9jay5wbmdcIlxyXG4gICAgXVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbnN0YW50cy50cyIsImltcG9ydCBMb2FkaW5nU3RhdGUgZnJvbSBcIi4vc3RhdGVzL2xvYWRpbmdTdGF0ZVwiO1xyXG5pbXBvcnQgR2FtZVN0YXRlIGZyb20gXCIuL2NsYXNzZXMvZ2FtZVN0YXRlXCI7XHJcbmltcG9ydCBMZXZlbFN0YXRlIGZyb20gJy4vc3RhdGVzL2xldmVsU3RhdGUnO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgR2FtZUNhY2hlIGZyb20gXCIuL2NsYXNzZXMvZ2FtZUNhY2hlXCI7XHJcbmltcG9ydCBBdWRpb01hbmFnZXIgZnJvbSBcIi4vY2xhc3Nlcy9hdWRpb01hbmFnZXJcIjtcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNjZW5lQXJncyB7XHJcbiAgICBcclxuICAgIC8qIExvIHN0YXRvIGNoZSBkaXZlbnRlcsOgIG5vbiBhdHRpdm8gZGV2ZSBlc3NlcmUgcmVzZXR0YXRvPyAqL1xyXG4gICAgcmVzZXRQcmV2aW91c1N0YXRlPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKiBMbyBzdGF0byBjaGUgZGl2ZW50ZXLDoCBhdHRpdm8gZGV2ZSBlc3NlcmUgcmVzZXR0YXRvPyAqL1xyXG4gICAgcmVzZXRGb2xsb3dpbmdTdGF0ZT86IGJvb2xlYW47XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3NlIGNvcmUgY2hlIG1lbW9yaXp6YSBnbGkgc3RhdGkgcG9zc2liaWxpIGRpIGdpb2NvIGUgcHJvY2Vzc2EgaWwgY2ljbG8gZGkgcmVuZGVyaW5nXHJcbiAqIGRpIHF1ZWxsbyBhdHRpdm9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmUge1xyXG5cclxuICAgIC8qKiBMJ29nZ2V0dG8gUElYSSBvdHRlbnV0byBkYSBQSVhJLmpzICovXHJcbiAgICByZWFkb25seSBQSVhJOiBhbnk7XHJcblxyXG4gICAgLyoqIEwnb2dnZXR0byBhcHAgb3R0ZW51dG8gZGEgUElYSS5qcyAqL1xyXG4gICAgcmVhZG9ubHkgYXBwOiBhbnk7XHJcblxyXG4gICAgLyoqIExvIHN0YXRvIGF0dHVhbGUgcHJvY2Vzc2F0byBkYWwgZ2lvY28gKi9cclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlOiBHYW1lU3RhdGU7XHJcblxyXG4gICAgLyoqIFN0YXRpIGRpIGdpb2NvICovXHJcbiAgICBwcml2YXRlIHN0YXRlczogR2FtZVN0YXRlW107XHJcblxyXG4gICAgLyoqIE9nZ2V0dG8gcGVyIHJpcHJvZHVycmUgYXVkaW8gKi9cclxuICAgIHJlYWRvbmx5IGF1ZGlvTWFuYWdlcjogQXVkaW9NYW5hZ2VyO1xyXG5cclxuICAgIC8qKiBWYWxvcmUgaW5jcmVtZW50YW50ZSB1c2F0byBwZXIgZ2VuZXJhcmUgaWQgdW5pdm9jaSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRHZW5lcmF0b3I6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqIFNlIHZlcmEsIG5lbCBsb29wIGRpIGdpb2NvIG5vbiB2aWVuZSBwaXUgZXNlZ3VpdG8gbmVzc3VuIHVwZGF0ZSBkZWxsbyBzdGF0byBjb3JyZW50ZSAqL1xyXG4gICAgcHJpdmF0ZSBpbnRlcnJ1cHRHYW1lTG9vcDogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIGNhY2hlOiBHYW1lQ2FjaGU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe1BJWEksIGFwcH06IGFueSl7XHJcbiAgICAgICAgdGhpcy5QSVhJID0gUElYSTtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlciA9IG5ldyBBdWRpb01hbmFnZXIoe2NvcmU6IHRoaXN9KTtcclxuICAgICAgICB0aGlzLmludGVycnVwdEdhbWVMb29wID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG5ldyBHYW1lQ2FjaGUoKTtcclxuICAgICAgICB0aGlzLm1haW4oKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVycygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pemlhbGl6emEgZ2xpIHN0YXRpIGRpIGdpb2NvXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFN0YXRlcygpe1xyXG4gICAgICAgIHRoaXMuc3RhdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgTG9hZGluZ1N0YXRlKHtuYW1lOiBcImxvYWRpbmdcIiwgY29yZTogdGhpc30pLFxyXG4gICAgICAgICAgICBuZXcgTGV2ZWxTdGF0ZSh7bmFtZTogXCJsZXZlbFwiLCBjb3JlOiB0aGlzfSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2ljbG8gaW5maW5pdG8gZGVsIGdpb2NvXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEgRGVsdGFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnYW1lTG9vcChkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICBpZiAodGhpcy5pbnRlcnJ1cHRHYW1lTG9vcCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGF5ZXJzWigpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlLnVwZGF0ZShkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW56aW9uZSBlc2VndWl0YSBwZXIgaW5pemlhbGl6emFyZSBxdWVzdGEgaXN0YW56YSBkaSBDT1JFXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWFpbigpe1xyXG4gICAgICAgIHRoaXMuaW5pdFN0YXRlcygpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZXNbMF07XHJcbiAgICAgICAgdGhpcy5hcHAudGlja2VyLmFkZCgoZGVsdGE6IG51bWJlcikgPT4gdGhpcy5nYW1lTG9vcChkZWx0YSkpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlLm9uRW50ZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbWJpYSBsbyBzdGF0byBkaSBjdWkgZGV2ZSBlc3NlcmUgZXNlZ3VpdG8gbCd1cGRhdGVcclxuICAgICAqIEBwYXJhbSBuYW1lIE5vbWUgZGVsIG51b3ZvIHN0YXRvXHJcbiAgICAgKiBAcGFyYW0gYXJncyBQYXJhbWV0cmkgZGkgY2FtYmlhbWVudG9cclxuICAgICAqL1xyXG4gICAgY2hhbmdlU3RhdGUobmFtZSwgYXJnczogQ2hhbmdlU2NlbmVBcmdzKXtcclxuICAgICAgICB0aGlzLmludGVycnVwdEdhbWVMb29wID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5vbkV4aXQoKTtcclxuICAgICAgICBpZiAoYXJncy5yZXNldFByZXZpb3VzU3RhdGUpIHRoaXMuY3VycmVudFN0YXRlLnJlc2V0KCk7XHJcbiAgICAgICAgY29uc3QgbmV4dFN0YXRlOiBHYW1lU3RhdGUgPSB0aGlzLnN0YXRlcy5maWx0ZXIoeCA9PiB4Lm5hbWUgPT09IG5hbWUpWzBdO1xyXG4gICAgICAgIGlmIChhcmdzLnJlc2V0Rm9sbG93aW5nU3RhdGUpIG5leHRTdGF0ZS5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gbmV4dFN0YXRlO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlLm9uRW50ZXIoKTtcclxuICAgICAgICB0aGlzLmludGVycnVwdEdhbWVMb29wID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdHRpZW5lIHVuIGlkIHVuaXZvY29cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdlbmVyYXRlSWQoKTogbnVtYmVye1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlkR2VuZXJhdG9yKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPcmRpbmEgaSBmaWdsaSBpbiBiYXNlIGFsbCcgYXNzZSB6XHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUxheWVyc1ooKXtcclxuICAgICAgICB0aGlzLmFwcC5zdGFnZS5jaGlsZHJlbi5zb3J0KGZ1bmN0aW9uKGEsYikge1xyXG4gICAgICAgICAgICBhLnpJbmRleCA9IGEuekluZGV4IHx8IDA7XHJcbiAgICAgICAgICAgIGIuekluZGV4ID0gYi56SW5kZXggfHwgMDtcclxuICAgICAgICAgICAgcmV0dXJuIGIuekluZGV4IC0gYS56SW5kZXhcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMaXN0ZW5lcnMoKXtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJib2R5XCIpWzBdLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGUua2V5ID09PSBcInBcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJydXB0R2FtZUxvb3AgPSAhdGhpcy5pbnRlcnJ1cHRHYW1lTG9vcDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pbnRlcnJ1cHRHYW1lTG9vcCkgY29uc29sZS5sb2codGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgMSlcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbih3aW5kb3cgYXMgYW55KS5jb3JlID0gKFBJWEksIGFwcCkgPT4ge1xyXG4gICAgbmV3IENvcmUoe1BJWEksIGFwcH0pO1xyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvcmUudHMiLCJpbXBvcnQgQ29yZSBmcm9tIFwiLi4vY29yZVwiO1xyXG5pbXBvcnQgVGltZXJQb29sLCB7IENsb2NrUGFyYW1zIH0gZnJvbSBcIi4vdGltZXJQb29sXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lU3RhdGUge1xyXG5cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGNvcmU6IENvcmU7XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lclBvb2w6IFRpbWVyUG9vbDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgY29yZX06IGFueSl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmNvcmUgPSBjb3JlO1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sID0gbmV3IFRpbWVyUG9vbCh7Y29yZTogdGhpcy5jb3JlfSlcclxuICAgIH1cclxuXHJcbiAgICBvbkVudGVyKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uRXhpdCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVzZWd1ZSBsJ3VwZGF0ZSBkZWkgdGltZXIgZSBkZWkgcG9vbFxyXG4gICAgICogQHBhcmFtIGRlbHRhIERlbHRhXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZShkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbC51cGRhdGVQb29sKGRlbHRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXNlZ3VlIHVuYSBjYWxsYmFjayBvIHBpw7kgY2FsbGJhY2sgc2Vjb25kbyB1biB0ZW1wbyBzcGVjaWZpY2F0b1xyXG4gICAgICogQHBhcmFtIGNsb2NrUGFyYW1zIEFyZ29tZW50aSB0aW1lclxyXG4gICAgICovXHJcbiAgICBhZGRUaW1lcihjbG9ja1BhcmFtczogQ2xvY2tQYXJhbXMpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLmFkZFRpbWVyKGNsb2NrUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRpbnVhIGFkIGVzZWd1aXJlIHVuYSBvIHBpw7kgY2FsbGJhY2sgc2Vjb25kbyB1biB0ZW1wbyBzcGVjaWZpY2F0b1xyXG4gICAgICogQHBhcmFtIGNsb2NrUGFyYW1zICAgQXJnb21lbnRpIHRpbWVyXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAgICAgICAgICBOb21lIExvb3BcclxuICAgICAqL1xyXG4gICAgYWRkTG9vcChjbG9ja1BhcmFtczogQ2xvY2tQYXJhbXMsIG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wuYWRkTG9vcChjbG9ja1BhcmFtcywgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcnJvbXBlIHVuIGxvb3AgcHJlY2VkZW50ZW1lbnRlIGltcG9zdGF0b1xyXG4gICAgICogQHBhcmFtIG5hbWUgICAgICBOb21lIGxvb3BcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlTG9vcChuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLnJlbW92ZUxvb3AobmFtZSk7XHJcbiAgICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvZ2FtZVN0YXRlLnRzIiwiaW1wb3J0IFRpbWVyIGZyb20gXCIuL3RpbWVyXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcbmltcG9ydCBMb29wIGZyb20gJy4vbG9vcCc7XHJcblxyXG5leHBvcnQgdHlwZSBDbG9jayA9IFRpbWVyIHwgTG9vcDtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ2xvY2tQYXJhbXMge1xyXG5cclxuICAgIC8qKiBDYWxsYmFjayBtdWx0aXBsZSBkYSBlc2VndWlyZSBpbiBvcmRpbmUgY29uIHRlbXBvIGRpIGF0dGVzYSByZWxhdGl2byAqL1xyXG4gICAgYWN0aW9ucz86IFtudW1iZXIsICgpID0+IHZvaWRdW107XHJcblxyXG4gICAgLyoqIFRlbXBvIGRpIGF0dGVzYSBwZXIgdW5hIHNpbmdvbGEgY2FsbGJhY2sgKi9cclxuICAgIHRpbWU/OiBudW1iZXI7XHJcblxyXG4gICAgLyoqIFNpbmdvbGEgY2FsbGJhY2sgZGEgZXNlZ3VpcmUgKi9cclxuICAgIGNhbGxiYWNrPzogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAvKiogQXNzZWduYSB1biBncnVwcG8gKi9cclxuICAgIGdyb3VwPzogc3RyaW5nO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIFF1ZXN0YSBjbGFzc2UgZXNlZ3VlIGwndXBkYXRlIGRpIHRpbWVyIGUgZGkgbG9vcCBhbCBzdW8gaW50ZXJub1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXJQb29sIHtcclxuXHJcbiAgICBwcml2YXRlIGNsb2NrczogQ2xvY2tbXTtcclxuICAgIHByaXZhdGUgY29yZTogQ29yZTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7Y29yZX0pe1xyXG4gICAgICAgIHRoaXMuY29yZSA9IGNvcmU7XHJcbiAgICAgICAgdGhpcy5jbG9ja3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFnZ2l1bmdlIHVuIHRpbWVyIGFsIHRpbWVyUG9vbFxyXG4gICAgICogQHBhcmFtIHBhcmFtMCBBcmdvbWVudGkgcGVyIGlsIHRpbWVyXHJcbiAgICAgKiBAcmV0dXJuIGlkIGRlbCB0aW1lciBjcmVhdG9cclxuICAgICAqL1xyXG4gICAgYWRkVGltZXIocGFyYW1zOiBDbG9ja1BhcmFtcyk6IG51bWJlcntcclxuICAgICAgICBjb25zdCB0aW1lciA9IG5ldyBUaW1lcih7XHJcbiAgICAgICAgICAgIHRpbWVyUG9vbDogdGhpcyxcclxuICAgICAgICAgICAgZ3JvdXA6IHBhcmFtcy5ncm91cFxyXG4gICAgICAgIH0sIHBhcmFtcy5hY3Rpb25zID8gcGFyYW1zLmFjdGlvbnMgOiBbW3BhcmFtcy50aW1lLCBwYXJhbXMuY2FsbGJhY2tdXSlcclxuICAgICAgICB0aGlzLmNsb2Nrcy5wdXNoKHRpbWVyKTtcclxuICAgICAgICByZXR1cm4gdGltZXIuaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSaW11b3ZlIHVuIHRpbWVyIGRhbCBwb29sLCBpbnRlcnJvbXBlbmRvIGxhIHN1YSBlc2VjdXppb25lXHJcbiAgICAgKiBAcGFyYW0gaWQgSWQgZGVsIHRpbWVyXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVRpbWVyKGlkOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuY2xvY2tzID0gdGhpcy5jbG9ja3MuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIExvb3AgPyB0cnVlIDogeC5pZCAhPT0gaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmltdW92ZSBkZWkgdGltZXIgZGFsIHBvb2wsIGludGVycm9tcGVuZG8gbGEgbG9ybyBlc2VjdXppb25lXHJcbiAgICAgKiBAcGFyYW0gZ3JvdXAgR3J1cHBvIGRlbCB0aW1lciwgaSB0aW1lciBkaSBkZWZhdWx0IGNvbWUgZ3J1cHBvIGhhbm5vIG51bGxcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVGltZXJCeUdyb3VwKGdyb3VwOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY2xvY2tzID0gdGhpcy5jbG9ja3MuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIExvb3AgPyB0cnVlIDogeC5ncm91cCAhPT0gZ3JvdXApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZExvb3AocGFyYW1zOiBDbG9ja1BhcmFtcywgbmFtZTogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCBsb29wID0gbmV3IExvb3Aoe1xyXG4gICAgICAgICAgICB0aW1lclBvb2w6IHRoaXMsXHJcbiAgICAgICAgICAgIGdyb3VwOiBwYXJhbXMuZ3JvdXAsXHJcbiAgICAgICAgICAgIG5hbWVcclxuICAgICAgICB9LCBwYXJhbXMuYWN0aW9ucyA/IHBhcmFtcy5hY3Rpb25zIDogW1twYXJhbXMudGltZSwgcGFyYW1zLmNhbGxiYWNrXV0pO1xyXG4gICAgICAgIHRoaXMuY2xvY2tzLnB1c2gobG9vcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTG9vcChuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMuY2xvY2tzID0gdGhpcy5jbG9ja3MuZmlsdGVyKHggPT4geCBpbnN0YW5jZW9mIFRpbWVyID8gdHJ1ZSA6IHgubmFtZSAhPT0gbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUG9vbChkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLmNsb2Nrcy5mb3JFYWNoKHggPT4geC51cGRhdGUoZGVsdGEpKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMuY2xvY2tzID0gW107XHJcbiAgICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvdGltZXJQb29sLnRzIiwiaW1wb3J0IENvcmUgZnJvbSBcIi4vY29yZVwiO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbHMge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYSB1bm8gc3ByaXRlIHRyYW1pdGUgUElYSVxyXG4gICAgICogQHBhcmFtIGNvcmUgXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZVNwcml0ZShjb3JlOiBDb3JlLCBuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIHJldHVybiBuZXcgY29yZS5QSVhJLlNwcml0ZShjb3JlLlBJWEkubG9hZGVyLnJlc291cmNlc1tjb25zdGFudHMuc3ByaXRlUGF0aCArIG5hbWVdLnRleHR1cmUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGF0aSBkdWUgc3ByaXRlIGNyZWF0aSB0cmFtaXRlIFBJWEksIHZlcmlmaWNhIHNlIGNvbGxpZG9ub1xyXG4gICAgICogQHBhcmFtIHIxIFNwcml0ZTFcclxuICAgICAqIEBwYXJhbSByMiBTcHJpdGUyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBoaXRUZXN0UmVjdGFuZ2xlKHIxLCByMil7XHJcbiAgICAgICAgLy9DYWxjdWxhdGUgYGNlbnRlclhgIGFuZCBgY2VudGVyWWAgcHJvcGVydGllcyBvbiB0aGUgc3ByaXRlc1xyXG4gICAgICAgIHIxLmNlbnRlclggPSByMS54ICsgcjEud2lkdGggLyAyO1xyXG4gICAgICAgIHIxLmNlbnRlclkgPSByMS55ICsgcjEuaGVpZ2h0IC8gMjtcclxuICAgICAgICByMi5jZW50ZXJYID0gcjIueCArIHIyLndpZHRoIC8gMjtcclxuICAgICAgICByMi5jZW50ZXJZID0gcjIueSArIHIyLmhlaWdodCAvIDI7XHJcblxyXG4gICAgICAgIC8vQ2FsY3VsYXRlIHRoZSBgaGFsZldpZHRoYCBhbmQgYGhhbGZIZWlnaHRgIHByb3BlcnRpZXMgb2YgdGhlIHNwcml0ZXNcclxuICAgICAgICByMS5oYWxmV2lkdGggPSByMS53aWR0aCAvIDI7XHJcbiAgICAgICAgcjEuaGFsZkhlaWdodCA9IHIxLmhlaWdodCAvIDI7XHJcbiAgICAgICAgcjIuaGFsZldpZHRoID0gcjIud2lkdGggLyAyO1xyXG4gICAgICAgIHIyLmhhbGZIZWlnaHQgPSByMi5oZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICAvL0NyZWF0ZSBhIGBjb2xsaXNpb25gIHZhcmlhYmxlIHRoYXQgd2lsbCB0ZWxsIHVzXHJcbiAgICAgICAgLy9pZiBhIGNvbGxpc2lvbiBpcyBvY2N1cnJpbmdcclxuICAgICAgICBsZXQgY29sbGlzaW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vQ2hlY2sgd2hldGhlciB0aGUgc2hhcGVzIG9mIHRoZSBzcHJpdGVzIGFyZSBvdmVybGFwcGluZy4gSWYgdGhleVxyXG4gICAgICAgIC8vYXJlLCBzZXQgYGNvbGxpc2lvbmAgdG8gYHRydWVgXHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHIxLmNlbnRlclggLSByMi5jZW50ZXJYKSA8IHIxLmhhbGZXaWR0aCArIHIyLmhhbGZXaWR0aFxyXG4gICAgICAgICYmIE1hdGguYWJzKHIxLmNlbnRlclkgLSByMi5jZW50ZXJZKSA8IHIxLmhhbGZIZWlnaHQgKyByMi5oYWxmSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGNvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL1JldHVybiB0aGUgdmFsdWUgb2YgYGNvbGxpc2lvbmAgYmFjayB0byB0aGUgbWFpbiBwcm9ncmFtXHJcbiAgICAgICAgcmV0dXJuIGNvbGxpc2lvbjtcclxuICAgIH1cclxuXHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3V0aWxzLnRzIiwiaW1wb3J0IENvcmUgZnJvbSBcIi4uL2NvcmVcIjtcclxuaW1wb3J0IEdhbWVPYmplY3RQb29sIGZyb20gJy4vZ2FtZU9iamVjdFBvb2wnO1xyXG5pbXBvcnQgVGltZXJQb29sLCB7IENsb2NrUGFyYW1zIH0gZnJvbSBcIi4vdGltZXJQb29sXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBjb3JlOiBDb3JlO1xyXG5cclxuICAgIHByb3RlY3RlZCBzcHJpdGU6IGFueTtcclxuXHJcbiAgICBwcml2YXRlIGdhbWVPYmplY3RQb29sOiBHYW1lT2JqZWN0UG9vbDtcclxuICAgIHByaXZhdGUgdGltZXJQb29sOiBUaW1lclBvb2w7XHJcblxyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcclxuXHJcbiAgICAvKiogSW5kaWNhIHNlIGRldmUgZXNzZXJlIGNvbnNpZGVyYXRvIGNvbWUgY29sbGlzaW9uZSBuZWwgbW9tZW50byBpbiBjdWkgc2kgdG9jY2EgKi9cclxuICAgIHByb3RlY3RlZCBjb2xsaWRhYmxlOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBJbmRpY2Egc2UgZGV2ZSBlc3NlcmUgY29zdGFudGVtZW50ZSBpbiBhc2NvbHRvIHBlciByZWdpc3RhcmUgY29sbGlzaW9uaSAqL1xyXG4gICAgcHJvdGVjdGVkIGNoZWNrQ29sbGlzaW9uOiBib29sZWFuO1xyXG5cclxuICAgIC8qKiBUZW1wbyBkaSB2aXRhIGRpIHF1ZXN0byBnYW1lT2JqZWN0ICovXHJcbiAgICBwcm90ZWN0ZWQgbGl2ZVRpbWU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoe25hbWUsIGNvcmUsIHgsIHksIHdpZHRoLCBoZWlnaHQsIHNwcml0ZX0pe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jb3JlID0gY29yZTtcclxuICAgICAgICB0aGlzLmlkID0gQ29yZS5nZW5lcmF0ZUlkKCk7XHJcbiAgICAgICAgdGhpcy5pbml0U3ByaXRlKHNwcml0ZSwgeCwgeSwgd2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgdGhpcy5saXZlVGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wgPSBuZXcgVGltZXJQb29sKHtjb3JlOiBjb3JlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0U3ByaXRlKHNwcml0ZSwgeCwgeSwgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUueCA9IHg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUueSA9IHk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUud2lkdGggPSB3aWR0aDtcclxuICAgICAgICB0aGlzLnNwcml0ZS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgLy90aGlzLnNwcml0ZS5waXZvdC5zZXQod2lkdGggLyAyLCBoZWlnaHQgLyAyKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuc3ByaXRlLnBpdm90KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3RlbmVyIGVzZWd1aXRvIHF1YW5kbyBpbCBHYW1lT2JqZWN0IHZpZW5lIGFnZ2l1bnRvIGFsIHBvb2xcclxuICAgICAqL1xyXG4gICAgb25DcmVhdGUoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW5lciBlc2VndWl0byBxdWFuZG8gaWwgR2FtZU9iamVjdCB2aWVuZSByaW1vc3NvIGRhbCBwb29sXHJcbiAgICAgKi9cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgZGVsbCcgb2dnZXR0bywgZ2VzdGlzY2UgaSB0aW1lciBlZCBpIGxvb3BcclxuICAgICAqIEBwYXJhbSBkZWx0YSBEZWx0YVxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZGVsdGEpe1xyXG4gICAgICAgIHRoaXMubGl2ZVRpbWUgKz0gZGVsdGE7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wudXBkYXRlUG9vbChkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW5lciBlc2VndWl0byBxdWFuZG8gc2kgdG9jY2EgdW4gZ2FtZU9iamVjdCBjb2xsaWRhYmxlIHNlXHJcbiAgICAgKiBxdWVzdG8gb2dnZXR0byBoYSBhdHRpdm8gY2hlY2tDb2xsaXNpb25cclxuICAgICAqIEBwYXJhbSBvYmogR2FtZU9iamVjdCB0b2NjYXRvXHJcbiAgICAgKi9cclxuICAgIG9uQ29sbGlzaW9uKG9iajogR2FtZU9iamVjdCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuZXIgZXNlZ3VpdG8gcXVhbmRvIHNpIHJpY2V2ZSB1biBtZXNzYWdnaW8gZGFsIHBvb2xcclxuICAgICAqIEBwYXJhbSBtZXNzYWdlIE5vbWUgZGVsIG1lc3NhZ2dpb1xyXG4gICAgICovXHJcbiAgICBvbk1lc3NhZ2VSZWNlaXZlZChtZXNzYWdlOiBzdHJpbmcpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE90dGllbmUgbG8gc3ByaXRlIGRpIHF1ZXN0byBnYW1lT2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGdldFNwcml0ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNwcml0ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJpbXVvdmUgcXVlc3RvIG9nZ2V0dG8gZGFsIHBvb2wsIGRpc3RydWdnZW5kb2xvXHJcbiAgICAgKi9cclxuICAgIGRlc3Ryb3koKXtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RQb29sLnJlbW92ZUdhbWVPYmplY3RCeUlkKHRoaXMuaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogREVWRSBFU1NFUkUgQ0hJQU1BVE8gU09MTyBEQSBHQU1FT0JKRUNUUE9PTFxyXG4gICAgICogQHBhcmFtIHBvb2wgSXN0YW56YSBkaSBHYW1lT2JqZWN0UG9vbFxyXG4gICAgICovXHJcbiAgICBzZXRHYW1lT2JqZWN0UG9vbChwb29sOiBHYW1lT2JqZWN0UG9vbCl7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbCA9IHBvb2w7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmRpY2Egc2UgZGV2ZSBlc3NlcmUgY29uc2lkZXJhdG8gZGFnbGkgb2dnZXR0aSBjb24gY2hlY2tDb2xsaXNpb25cclxuICAgICAqL1xyXG4gICAgaXNDb2xsaWRhYmxlKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGlkYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluZGljYSBzZSBpbCBsaXN0ZW5lciBkZWxsYSBjb2xsaXNpb25lIGRldmUgZXNzZXJlIGF0dGl2YXRvIHF1YW5kb1xyXG4gICAgICogc2kgdG9jY2FubyBnYW1lT2JqZWN0IGNvbiBjb2xsaWRhYmxlXHJcbiAgICAgKi9cclxuICAgIHNob3VsZENoZWNrQ29sbGlzaW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tDb2xsaXNpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFc2VndWUgdW5hIGNhbGxiYWNrIG8gcGnDuSBjYWxsYmFjayBzZWNvbmRvIHVuIHRlbXBvIHNwZWNpZmljYXRvXHJcbiAgICAgKiBAcGFyYW0gY2xvY2tQYXJhbXMgQXJnb21lbnRpIHRpbWVyXHJcbiAgICAgKi9cclxuICAgIGFkZFRpbWVyKGNsb2NrUGFyYW1zOiBDbG9ja1BhcmFtcyl7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wuYWRkVGltZXIoY2xvY2tQYXJhbXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmltdW92ZSB1biB0aW1lciBwcmVjZWRlbnRlbWVudGUgaW1wb3N0YXRvXHJcbiAgICAgKiBAcGFyYW0gcGFyYW0wIGlkIG8gZ3J1cHBvIGRlbCB0aW1lclxyXG4gICAgICovXHJcbiAgICByZW1vdmVUaW1lcih7aWQsIGdyb3VwfTogYW55KXtcclxuICAgICAgICBpZiAoaWQpIHRoaXMudGltZXJQb29sLnJlbW92ZVRpbWVyKGlkKTtcclxuICAgICAgICBlbHNlIGlmIChncm91cCkgdGhpcy50aW1lclBvb2wucmVtb3ZlVGltZXJCeUdyb3VwKGdyb3VwKTtcclxuICAgICAgICBlbHNlIGNvbnNvbGUud2FybihcIlRlbnRhdG8gZGkgcmltdW92ZXJlIHVuIHRpbWVyIGNvbiBcIiwgaWQsIGdyb3VwKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29udGludWEgYWQgZXNlZ3VpcmUgdW5hIG8gcGnDuSBjYWxsYmFjayBzZWNvbmRvIHVuIHRlbXBvIHNwZWNpZmljYXRvXHJcbiAgICAgKiBAcGFyYW0gY2xvY2tQYXJhbXMgICBBcmdvbWVudGkgdGltZXJcclxuICAgICAqIEBwYXJhbSBuYW1lICAgICAgICAgIE5vbWUgTG9vcFxyXG4gICAgICovXHJcbiAgICBhZGRMb29wKGNsb2NrUGFyYW1zOiBDbG9ja1BhcmFtcywgbmFtZTogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbC5hZGRMb29wKGNsb2NrUGFyYW1zLCBuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEludGVycm9tcGUgdW4gbG9vcCBwcmVjZWRlbnRlbWVudGUgaW1wb3N0YXRvXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAgICAgIE5vbWUgbG9vcFxyXG4gICAgICovXHJcbiAgICByZW1vdmVMb29wKG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wucmVtb3ZlTG9vcChuYW1lKTtcclxuICAgIH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9nYW1lT2JqZWN0LnRzIiwiaW1wb3J0IEdhbWVTdGF0ZSBmcm9tIFwiLi4vY2xhc3Nlcy9nYW1lU3RhdGVcIjtcclxuaW1wb3J0IGNvbnN0YW50cyBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcblxyXG4vKipcclxuICogU3RhdG8gZGkgY2FyaWNhbWVudG9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExvYWRpbmdTdGF0ZSBleHRlbmRzIEdhbWVTdGF0ZSB7XHJcblxyXG4gICAgLy9UT0RPIHF1aSB2YSBhbmNoZSBpbCBjYXJpY2FtZW50byBkaSBhdWRpb01hbmFnZXJcclxuICAgIFxyXG4gICAgLyoqIFRlc3RvIGRpIGNhcmljYW1lbnRvICovXHJcbiAgICBwcml2YXRlIGxvYWRpbmdUZXh0O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHtuYW1lLCBjb3JlfTogYW55KXtcclxuICAgICAgICBzdXBlcih7bmFtZSwgY29yZX0pO1xyXG4gICAgICAgIC8vdGhpcy5sb2FkaW5nVGV4dCA9IG5ldyBUZXh0KFwiXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW50ZXIoKXtcclxuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0ID0gbmV3IHRoaXMuY29yZS5QSVhJLlRleHQoXCJcIiwge1xyXG4gICAgICAgICAgICB3b3JkV3JhcDogdHJ1ZSxcclxuICAgICAgICAgICAgZmlsbDogWycjZmZmZmZmJ11cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0LnggPSAwO1xyXG4gICAgICAgIHRoaXMubG9hZGluZ1RleHQueSA9IDA7XHJcbiAgICAgICAgdGhpcy5jb3JlLmFwcC5zdGFnZS5hZGRDaGlsZCh0aGlzLmxvYWRpbmdUZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkQXNzZXRzKCk7XHJcbiAgICAgICAgLy90aGlzLmNvcmUuYXBwLnN0YWdlLmFkZENoaWxkKHRoaXMubG9hZGluZ1RleHQpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIG9uRXhpdCgpe1xyXG4gICAgICAgIHRoaXMuY29yZS5hcHAuc3RhZ2UucmVtb3ZlQ2hpbGQodGhpcy5sb2FkaW5nVGV4dCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhOiBudW1iZXIpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgbG9hZEFzc2V0cygpe1xyXG4gICAgICAgIGxldCBhc3NldHNUb0xvYWQgOiBhbnlbXSA9IFtdO1xyXG4gICAgICAgIGFzc2V0c1RvTG9hZC5wdXNoKGNvbnN0YW50cy5zcHJpdGVQYXRoICsgY29uc3RhbnRzLnBsYXllclNwcml0ZSk7XHJcbiAgICAgICAgY29uc3RhbnRzLm9iamVjdFNwcml0ZXMuZm9yRWFjaCh4ID0+IGFzc2V0c1RvTG9hZC5wdXNoKGNvbnN0YW50cy5zcHJpdGVQYXRoICsgeCkpXHJcbiAgICAgICAgLy9hc3NldHNUb0xvYWQgPSBhc3NldHNUb0xvYWQuY29uY2F0KGNvbnN0YW50cy5hdWRpby5tYXAoeCA9PiB4LnBhdGgpKTtcclxuICAgICAgICB0aGlzLmNvcmUuUElYSS5sb2FkZXIuYWRkKGFzc2V0c1RvTG9hZCwge2Nyb3NzT3JpZ2luOiAnYW5vbnltb3VzJ30pXHJcbiAgICAgICAgLm9uKFwicHJvZ3Jlc3NcIiwgdGhpcy5sb2FkUHJvZ3Jlc3NIYW5kbGVyLmJpbmQodGhpcykpXHJcbiAgICAgICAgLmxvYWQodGhpcy5vbkFzc2V0c0xvYWRlZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRQcm9ncmVzc0hhbmRsZXIobG9hZGVyOiBhbnksIHJlc291cmNlOiBhbnkpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2FyaWNhdG9cIiwgcmVzb3VyY2UsIGxvYWRlci5wcm9ncmVzcyk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nVGV4dC5zZXRUZXh0KGxvYWRlci5wcm9ncmVzcyArIFwiJVwiKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQXNzZXRzTG9hZGVkKCl7XHJcbiAgICAgICAgdGhpcy5jb3JlLmNoYW5nZVN0YXRlKFwibGV2ZWxcIiwge30pO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3N0YXRlcy9sb2FkaW5nU3RhdGUudHMiLCJpbXBvcnQgVGltZXJQb29sIGZyb20gXCIuL3RpbWVyUG9vbFwiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xyXG5cclxuICAgIHByaXZhdGUgdGltZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSB0aW1lclBvb2w6IFRpbWVyUG9vbDtcclxuXHJcbiAgICBwcml2YXRlIHRpbWVyczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogKCgpID0+IHZvaWQpW107XHJcblxyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcclxuICAgIHJlYWRvbmx5IGdyb3VwOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe2lkLCB0aW1lclBvb2wsIGdyb3VwID0gbnVsbH06IGFueSwgYWN0aW9uc0FycmF5OiBbbnVtYmVyLCAoKSA9PiB2b2lkXVtdKXtcclxuICAgICAgICB0aGlzLnRpbWVycyA9IGFjdGlvbnNBcnJheS5tYXAoeCA9PiB4WzBdKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IGFjdGlvbnNBcnJheS5tYXAoeCA9PiB4WzFdKTtcclxuICAgICAgICB0aGlzLnRpbWUgPSB0aGlzLnRpbWVycy5zaGlmdCgpO1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sID0gdGltZXJQb29sO1xyXG4gICAgICAgIHRoaXMuaWQgPSBDb3JlLmdlbmVyYXRlSWQoKTtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhKXtcclxuICAgICAgICB0aGlzLnRpbWUgLT0gZGVsdGE7XHJcbiAgICAgICAgaWYgKHRoaXMudGltZSA8PSAwKXtcclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc2hpZnQoKSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lcnMubGVuZ3RoKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvL1NvdHRyYWdnbyBpbCB0ZW1wbyBjaGUgw6ggYW5kYXRvIHNvdHRvIGxvIDBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpZmZlcmVuY2UgPSB0aGlzLnRpbWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWUgPSB0aGlzLnRpbWVycy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lIC09IGRpZmZlcmVuY2U7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lclBvb2wucmVtb3ZlVGltZXIodGhpcy5pZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvdGltZXIudHMiLCJpbXBvcnQgVGltZXJQb29sIGZyb20gXCIuL3RpbWVyUG9vbFwiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi4vY29yZVwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9vcCB7XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lcnM6IG51bWJlcltdO1xyXG4gICAgcHJpdmF0ZSBjYWxsYmFja3M6ICgoKSA9PiB2b2lkKVtdO1xyXG5cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGlkOiBudW1iZXI7XHJcbiAgICByZWFkb25seSBncm91cDogc3RyaW5nO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudFRpbWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgY3VycmVudEluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGdyb3VwID0gbnVsbH06IGFueSwgYWN0aW9uc0FycmF5OiBbbnVtYmVyLCAoKSA9PiB2b2lkXVtdKXtcclxuICAgICAgICB0aGlzLmlkID0gQ29yZS5nZW5lcmF0ZUlkKCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XHJcbiAgICAgICAgdGhpcy50aW1lcnMgPSBhY3Rpb25zQXJyYXkubWFwKHggPT4geFswXSk7XHJcbiAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBhY3Rpb25zQXJyYXkubWFwKHggPT4geFsxXSk7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAwO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUgPSB0aGlzLnRpbWVyc1t0aGlzLmN1cnJlbnRJbmRleF07XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRUaW1lIC09IGRlbHRhO1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRUaW1lIDw9IDApe1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrc1t0aGlzLmN1cnJlbnRJbmRleF0oKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEluZGV4ID0gKHRoaXMuY3VycmVudEluZGV4ICsgMSkgJSB0aGlzLmNhbGxiYWNrcy5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAvL1NvdHRyYWdnbyBpbCB0ZW1wbyBjaGUgw6ggYW5kYXRvIHNvdHRvIGxvIDBcclxuICAgICAgICAgICAgbGV0IHJlc3RhcnQgPSB0aGlzLnRpbWVyc1t0aGlzLmN1cnJlbnRJbmRleF07XHJcbiAgICAgICAgICAgIHJlc3RhcnQgLT0gdGhpcy5jdXJyZW50VGltZTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50VGltZSA9IHJlc3RhcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvbG9vcC50cyIsImltcG9ydCBHYW1lU3RhdGUgZnJvbSBcIi4uL2NsYXNzZXMvZ2FtZVN0YXRlXCI7XHJcbmltcG9ydCBHYW1lT2JqZWN0UG9vbCBmcm9tICcuLy4uL2NsYXNzZXMvZ2FtZU9iamVjdFBvb2wnO1xyXG5pbXBvcnQgUGxheWVyIGZyb20gXCIuLi9nYW1lT2JqZWN0cy9wbGF5ZXJcIjtcclxuaW1wb3J0IGNvbnN0YW50cyBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IFdhbGwgZnJvbSBcIi4uL2dhbWVPYmplY3RzL3dhbGxcIjtcclxuaW1wb3J0IFRpbWVyUG9vbCBmcm9tIFwiLi4vY2xhc3Nlcy90aW1lclBvb2xcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExldmVsU3RhdGUgZXh0ZW5kcyBHYW1lU3RhdGUge1xyXG5cclxuICAgIHByaXZhdGUgZ2FtZU9iamVjdFBvb2w6IEdhbWVPYmplY3RQb29sO1xyXG5cclxuICAgIHByaXZhdGUgZmlyc3RNb3Zpbmc6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIHBsYXllcjogUGxheWVyO1xyXG5cclxuICAgIHN1YnRpdGxlVGV4dDogYW55O1xyXG4gICAgaGVhbHRoVGV4dDogYW55O1xyXG5cclxuICAgIC8vVE9ETyBVUkdFTlRFIEZBSSBDSEUgVFVUVEkgR0xJIE9HR0VUVEkgREkgVU5PIFNUQVRPIFNPTk8gREVOVFJPIFVOIENPTlRBSU5FUiBESSBQSVhJXHJcbiAgICAvL0UgVFJPVkEgQU5DSEUgVU4gTU9ETyBQRVIgR0VTVElSRSBMTyBaIElOREVYXHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGNvcmV9OiBhbnkpe1xyXG4gICAgICAgIHN1cGVyKHtuYW1lLCBjb3JlfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbCA9IG5ldyBHYW1lT2JqZWN0UG9vbCh7Y29yZTogdGhpcy5jb3JlfSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5pbml0VGV4dCgpO1xyXG5cclxuICAgICAgICB0aGlzLmZpcnN0TW92aW5nID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VGV4dCgpe1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVUZXh0ID0gbmV3IHRoaXMuY29yZS5QSVhJLlRleHQoJycsIHtcclxuICAgICAgICAgICAgZmlsbDogWycjZmZmZmZmJ10sXHJcbiAgICAgICAgICAgIHdvcmRXcmFwOiB0cnVlLFxyXG4gICAgICAgICAgICB3b3JkV3JhcFdpZHRoOiAzOTAsXHJcbiAgICAgICAgICAgIGJyZWFrV29yZHM6IHRydWVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnN1YnRpdGxlVGV4dC54ID0gMjA2O1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LnkgPSA2OTA7XHJcbiAgICAgICAgdGhpcy5zdWJ0aXRsZVRleHQuekluZGV4ID0gLTEwMDtcclxuICAgICAgICB0aGlzLnN1YnRpdGxlVGV4dC5hbmNob3Iuc2V0KDAuNSk7XHJcbiAgICAgICAgdGhpcy5jb3JlLmFwcC5zdGFnZS5hZGRDaGlsZCh0aGlzLnN1YnRpdGxlVGV4dCk7XHJcblxyXG4gICAgICAgIHRoaXMuaGVhbHRoVGV4dCA9IG5ldyB0aGlzLmNvcmUuUElYSS5UZXh0KFwiXCIsIHtcclxuICAgICAgICAgICAgZmlsbDogWycjZmZmZmZmJ11cclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuY29yZS5hcHAuc3RhZ2UuYWRkQ2hpbGQodGhpcy5oZWFsdGhUZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVudGVyKCl7XHJcbiAgICAgICAgc3VwZXIub25FbnRlcigpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXJTcHJpdGUgPSBVdGlscy5jcmVhdGVTcHJpdGUodGhpcy5jb3JlLCBjb25zdGFudHMucGxheWVyU3ByaXRlKVxyXG4gICAgICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcih7bmFtZTogXCJwbGF5ZXJcIiwgY29yZTogdGhpcy5jb3JlLCB4OiAxNzgsIHk6IDYwMCwgc3ByaXRlOiBwbGF5ZXJTcHJpdGUsIGxldmVsU3RhdGU6IHRoaXN9KVxyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdFBvb2wuYWRkR2FtZU9iamVjdCh0aGlzLnBsYXllcik7XHJcblxyXG4gICAgICAgIHRoaXMuYWRkVGltZXIoe1xyXG4gICAgICAgICAgICB0aW1lOiAxODAsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1YnRpdGxlVGV4dC5zZXRUZXh0KFwiVHJhc2NpbmFtaVwiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maXJzdE1vdmluZyA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbkV4aXQoKXtcclxuICAgICAgICBzdXBlci5vbkV4aXQoKTtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RQb29sLmNsZWFyUG9vbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICBzdXBlci51cGRhdGUoZGVsdGEpO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdFBvb2wudXBkYXRlUG9vbChkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKXtcclxuICAgICAgICBzdXBlci5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uUGxheWVyTW92aW5nKCl7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlyc3RNb3ZpbmcgPT09IDEpe1xyXG4gICAgICAgICAgICB0aGlzLmZpcnN0TW92aW5nID0gMjtcclxuICAgICAgICAgICAgdGhpcy5zdGFydExldmVsKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnRMZXZlbCgpe1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LnNldFRleHQoXCJcIik7XHJcbiAgICAgICAgdGhpcy5jb3JlLmF1ZGlvTWFuYWdlci5wbGF5QXVkaW8oXCJob3dEb1lvdUtub3cub2dnXCIsIHtcclxuICAgICAgICAgICAgdm9sdW1lOiAwLjc1XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIudXBkYXRlVUkoKTtcclxuICAgICAgICB0aGlzLmFkZFRpbWVyKHtcclxuICAgICAgICAgICAgYWN0aW9uczogW1xyXG4gICAgICAgICAgICAgICAgWzYwICogOC41LCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3JlLmF1ZGlvTWFuYWdlci5wbGF5QXVkaW8oXCJyYWdnaW9TYWxhbWUub2dnXCIsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5kQ2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LnNldFRleHQoXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5zcGVhaygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGRMb29wKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5zcGF3bldhbGwxKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZTogMzVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwibG9vcDFcIilcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDAuNSwgKCkgPT4gdGhpcy5zdWJ0aXRsZVRleHQuc2V0VGV4dChcIkZpbmlzY2kgaWwgc2FsYW1lIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiA0MiwgKCkgPT4gdGhpcy5yZW1vdmVMb29wKFwibG9vcDFcIildLFxyXG4gICAgICAgICAgICAgICAgWzYwICogNCwgKCkgPT4gdGhpcy5hZGRMb29wKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuc3Bhd25XYWxsMigpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiAzNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sIFwibG9vcDJcIilcclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiA0MiwgKCkgPT4gdGhpcy5yZW1vdmVMb29wKFwibG9vcDJcIildLFxyXG4gICAgICAgICAgICAgICAgWzYwICogMiwgKCkgPT4gdGhpcy5hZGRMb29wKHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5zcGF3bldhbGwzKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogMTIwXHJcbiAgICAgICAgICAgICAgICB9LCBcImxvb3AzXCIpXSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDM3LCAoKSA9PiB0aGlzLnJlbW92ZUxvb3AoXCJsb29wM1wiKV0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiAxLCAoKSA9PiB0aGlzLnNwYXduV2FsbDQoKV0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiA5LCAoKSA9PiB0aGlzLmFkZExvb3Aoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IDMwLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25XYWxsMShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3Bhd25XYWxsMihmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgXCJsb29wNFwiKV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZW5lcmF0ZVdhbGwoeCwgeSwgdmVsWCwgdmVsWSwgYm91bmNlWCwgYm91bmNlWSwgaW5jcmVtZW50LCBzaXplKXtcclxuICAgICAgICBjb25zdCB3YWxsU3ByaXRlID0gVXRpbHMuY3JlYXRlU3ByaXRlKHRoaXMuY29yZSwgXCJibG9jay5wbmdcIilcclxuICAgICAgICBjb25zdCB3YWxsID0gbmV3IFdhbGwoe1xyXG4gICAgICAgICAgICBuYW1lOiBcIndhbGxcIiwgXHJcbiAgICAgICAgICAgIGNvcmU6IHRoaXMuY29yZSwgXHJcbiAgICAgICAgICAgIHgsXHJcbiAgICAgICAgICAgIHksIFxyXG4gICAgICAgICAgICB3aWR0aDogc2l6ZSwgXHJcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSwgXHJcbiAgICAgICAgICAgIHNwcml0ZTogd2FsbFNwcml0ZSwgXHJcbiAgICAgICAgICAgIHNwZWVkOiB7eDogdmVsWCwgeTogdmVsWX0sXHJcbiAgICAgICAgICAgIGJvdW5jZVgsXHJcbiAgICAgICAgICAgIGJvdW5jZVksXHJcbiAgICAgICAgICAgIGluY3JlbWVudFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdFBvb2wuYWRkR2FtZU9iamVjdCh3YWxsKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwYXduV2FsbDEoYWdhaW4/OiBib29sZWFuKXtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IH5+KE1hdGgucmFuZG9tKCkgKiA2KTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlV2FsbChwb3NpdGlvbiAqIDY0LCAtNjQsIDAsIDgsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDY0KTtcclxuICAgICAgICBpZiAoYWdhaW4gPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjQpIHRoaXMuc3Bhd25XYWxsMShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzcGF3bldhbGwyKGFnYWluPzogYm9vbGVhbil7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb24gPSB+fihNYXRoLnJhbmRvbSgpICogNik7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVdhbGwocG9zaXRpb24gKiA2NCwgNzMyICsgNjQsIDAsIC04LCBmYWxzZSwgZmFsc2UsIGZhbHNlLCA2NCk7XHJcbiAgICAgICAgaWYgKGFnYWluID09PSBmYWxzZSkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChNYXRoLnJhbmRvbSgpIDwgMC40KSB0aGlzLnNwYXduV2FsbDIoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3Bhd25XYWxsMygpe1xyXG4gICAgICAgIGNvbnN0IHkgPSBNYXRoLnJhbmRvbSgpID4gMC41ID8gLTEyOCA6IDczMiArIDEyODtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlV2FsbChcclxuICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqICg0MTIgLSAxMjgpLFxyXG4gICAgICAgICAgICB5LFxyXG4gICAgICAgICAgICA4LFxyXG4gICAgICAgICAgICB5ID4gMCA/IC00IDogNCxcclxuICAgICAgICAgICAgdHJ1ZSxcclxuICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAxMjhcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzcGF3bldhbGw0KCl7XHJcbiAgICAgICAgdGhpcy5nZW5lcmF0ZVdhbGwoXHJcbiAgICAgICAgICAgIC0xMjgsXHJcbiAgICAgICAgICAgIC0xMjgsXHJcbiAgICAgICAgICAgIDYsXHJcbiAgICAgICAgICAgIDYsXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgdHJ1ZSxcclxuICAgICAgICAgICAgMTI4XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3RhdGVzL2xldmVsU3RhdGUudHMiLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tIFwiLi9nYW1lT2JqZWN0XCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcbmltcG9ydCBVdGlscyBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVPYmplY3RQb29sIHtcclxuXHJcbiAgICBwcml2YXRlIHBvb2w6IEdhbWVPYmplY3RbXTtcclxuICAgIHJlYWRvbmx5IGNvcmU6IENvcmU7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHtjb3JlfSl7XHJcbiAgICAgICAgdGhpcy5wb29sID0gW107XHJcbiAgICAgICAgdGhpcy5jb3JlID0gY29yZTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQb29sKGRlbHRhKXtcclxuXHJcbiAgICAgICAgLy9VcGRhdGUgZGkgdHV0dGkgaSBHYW1lT2JqZWN0XHJcbiAgICAgICAgdGhpcy5wb29sLmZvckVhY2goeCA9PiB4LnVwZGF0ZShkZWx0YSkpXHJcblxyXG4gICAgICAgIC8vQ2hlY2sgY29sbGlzaW9uZVxyXG4gICAgICAgIGNvbnN0IGNhbkNvbGxpZGUgPSB0aGlzLnBvb2wuZmlsdGVyKHggPT4geC5zaG91bGRDaGVja0NvbGxpc2lvbigpKTtcclxuICAgICAgICBjb25zdCBwb3NzaWJpbGVDb2xsaXNpb24gPSB0aGlzLnBvb2wuZmlsdGVyKHggPT4geC5pc0NvbGxpZGFibGUoKSk7XHJcbiAgICAgICAgY2FuQ29sbGlkZS5mb3JFYWNoKHdhbGtlciA9PiB7XHJcblxyXG4gICAgICAgICAgICAvL0NvbnRyb2xsbyBzZSBsJ29nZ2V0dG8gaW4gcXVlc3Rpb25lIGRldmUgYW5jb3JhIHJpY2V2ZXJlIGNvbGxpc2lvbmlcclxuICAgICAgICAgICAgaWYgKCF3YWxrZXIuc2hvdWxkQ2hlY2tDb2xsaXNpb24oKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgcG9zc2liaWxlQ29sbGlzaW9uLmZvckVhY2god2FsbCA9PiB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9Ob24gY29udHJvbGxvIGxlIGNvbGxpc2lvbmkgY29uIG1lIHN0ZXNzb1xyXG4gICAgICAgICAgICAgICAgaWYgKHdhbGtlciA9PT0gd2FsbCkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vQ29udHJvbGxvIHNlIGwnb2dnZXR0byBpbiBxdWVzdGlvbmUgZGV2ZSBhbmNvcmEgcmljZXZlcmUgY29sbGlzaW9uaVxyXG4gICAgICAgICAgICAgICAgaWYgKCF3YWxrZXIuc2hvdWxkQ2hlY2tDb2xsaXNpb24oKSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHdhbGtlclNwcml0ZSA9IHdhbGtlci5nZXRTcHJpdGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdhbGxTcHJpdGUgPSB3YWxsLmdldFNwcml0ZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFV0aWxzLmhpdFRlc3RSZWN0YW5nbGUod2Fsa2VyU3ByaXRlLCB3YWxsU3ByaXRlKSl7XHJcbiAgICAgICAgICAgICAgICAgICAgd2Fsa2VyLm9uQ29sbGlzaW9uKHdhbGwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgYWRkR2FtZU9iamVjdChvYmo6IEdhbWVPYmplY3Qpe1xyXG4gICAgICAgIG9iai5zZXRHYW1lT2JqZWN0UG9vbCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNvcmUuYXBwLnN0YWdlLmFkZENoaWxkKG9iai5nZXRTcHJpdGUoKSk7XHJcbiAgICAgICAgdGhpcy5wb29sLnB1c2gob2JqKTtcclxuICAgICAgICBvYmoub25DcmVhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVHYW1lT2JqZWN0QnlJZChpZDogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCB0b1JlbW92ZSA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4LmlkID09PSBpZClbMF07XHJcbiAgICAgICAgaWYgKCF0b1JlbW92ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5lc3N1biBnYW1lT2JqZWN0IGNvbiBpZCBcIiArIGlkICsgXCIgcHJlc2VudGUhXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLmFwcC5zdGFnZS5yZW1vdmVDaGlsZCh0b1JlbW92ZS5nZXRTcHJpdGUoKSk7XHJcbiAgICAgICAgICAgIHRvUmVtb3ZlLm9uRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLnBvb2wgPSB0aGlzLnBvb2wuZmlsdGVyKHggPT4geC5pZCAhPT0gaWQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVHYW1lT2JqZWN0QnlOYW1lKG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgdG9SZW1vdmUgPSB0aGlzLnBvb2wuZmlsdGVyKHggPT4geC5uYW1lID09IG5hbWUpWzBdO1xyXG4gICAgICAgIGlmICghdG9SZW1vdmUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXCJOZXNzdW4gZ2FtZU9iamVjdCBjb24gbm9tZSBcIiArIG5hbWUgKyBcIiBwcmVzZW50ZSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuYXBwLnN0YWdlLnJlbW92ZUNoaWxkKHRvUmVtb3ZlLmdldFNwcml0ZSgpKTtcclxuICAgICAgICAgICAgdG9SZW1vdmUub25EZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9vbCA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4Lm5hbWUgIT0gbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyUG9vbCgpe1xyXG4gICAgICAgIHRoaXMucG9vbCA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRmEgcmljZXZlcmUgdW4gbWVzc2FnZ2lvIGEgdHV0dGkgaSBnYW1lT2JqZWN0IFxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2Ugbm9tZSBtZXNzYWdnaW9cclxuICAgICAqL1xyXG4gICAgc2VuZE1lc3NhZ2UobWVzc2FnZTogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnBvb2wuZm9yRWFjaCh4ID0+IHgub25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZSkpO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9nYW1lT2JqZWN0UG9vbC50cyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuLi9jbGFzc2VzL2dhbWVPYmplY3RcIjtcclxuaW1wb3J0IGNvbnN0YW50cyBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCBMZXZlbFN0YXRlIGZyb20gXCIuLi9zdGF0ZXMvbGV2ZWxTdGF0ZVwiO1xyXG5cclxuY2xhc3MgUGxheWVyUGhyYXNlIHtcclxuXHJcbiAgICByZWFkb25seSBhdWRpb05hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IHdvcmRzVGltZTogbnVtYmVyW107XHJcbiAgICByZWFkb25seSB3b3Jkczogc3RyaW5nW107XHJcblxyXG4gICAgLy9UT0RPIFJFRkFDVE9SSU5HIFBFUkNIRSBBQ0NFVFRJIFVOIFVOSUNPIEFSUkFZXHJcbiAgICBjb25zdHJ1Y3RvcihhdWRpb05hbWU6IHN0cmluZywgd29yZHM6IHN0cmluZ1tdLCB3b3Jkc1RpbWU6IG51bWJlcltdKXtcclxuICAgICAgICB0aGlzLmF1ZGlvTmFtZSA9IGF1ZGlvTmFtZTtcclxuICAgICAgICB0aGlzLndvcmRzID0gd29yZHM7XHJcbiAgICAgICAgdGhpcy53b3Jkc1RpbWUgPSB3b3Jkc1RpbWU7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGF5ZXIgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBwcml2YXRlIGxldmVsU3RhdGU6IExldmVsU3RhdGU7XHJcblxyXG4gICAgcHJpdmF0ZSB0b3VjaERhdGE6IGFueTtcclxuICAgIHByaXZhdGUgdG91Y2hEcmFnZ2luZzogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIGhlYWx0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBwaHJhc2VCb29rOiBQbGF5ZXJQaHJhc2VbXTtcclxuICAgIHByaXZhdGUgaGFybVBocmFzZUJvb2s6IFBsYXllclBocmFzZVtdO1xyXG5cclxuICAgIC8vVE9ETyBzYXJlYmJlIGRhdnZlcm8gZmlnbyBydW90YXJlIGluIGJhc2UgYWxsYSBkaXJlemlvbmUgZGVsbCB4XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGNvcmUsIHgsIHksIHNwcml0ZSwgbGV2ZWxTdGF0ZX0pe1xyXG4gICAgICAgIHN1cGVyKHtuYW1lLCBjb3JlLCB4LCB5LCBzcHJpdGUsIHdpZHRoOiBjb25zdGFudHMucGxheWVyU2l6ZSwgaGVpZ2h0OiBjb25zdGFudHMucGxheWVyU2l6ZX0pO1xyXG4gICAgICAgIHRoaXMubGV2ZWxTdGF0ZSA9IGxldmVsU3RhdGU7XHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbiA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggPSBjb25zdGFudHMucGxheWVyRGVmYXVsdEhlYWx0aDtcclxuICAgICAgICB0aGlzLnBocmFzZUJvb2sgPSB0aGlzLmluaXRQaHJhc2VCb29rKCk7XHJcbiAgICAgICAgdGhpcy5oYXJtUGhyYXNlQm9vayA9IHRoaXMuaW5pdEhhcm1QaHJhc2VCb29rKCk7XHJcbiAgICAgICAgdGhpcy5hZGRUb3VjaENvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25DcmVhdGUoKXtcclxuICAgICAgICBzdXBlci5vbkNyZWF0ZSgpO1xyXG4gICAgICAgIC8qdGhpcy5hZGRUaW1lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkTG9vcCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzb3VuZCA9IHRoaXMuY29yZS5QSVhJLnNvdW5kLlNvdW5kLmZyb20oY29uc3RhbnRzLmF1ZGlvVG9Mb2FkWzBdLnBhdGgpO1xyXG4gICAgICAgICAgICAgICAgc291bmQucGxheSgpO1xyXG4gICAgICAgICAgICB9LCBcImxvb3BCYXNlXCIsIDYwKTtcclxuICAgICAgICB9LCAzMDApOyovXHJcbiAgICAgICAgLyp0aGlzLmFkZExvb3AoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuYXVkaW9NYW5hZ2VyLnBsYXlBdWRpbyhcInJhZ2dpb1VvXCIsIFwicmFnZ2lvXCIpO1xyXG4gICAgICAgIH0sIFwidGVzdFwiLCA2MCk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBvbkRlc3Ryb3koKXtcclxuICAgICAgICBzdXBlci5vbkRlc3Ryb3koKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkRpc3RydXR0byFcIik7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhKXtcclxuICAgICAgICBzdXBlci51cGRhdGUoZGVsdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKG9iajogR2FtZU9iamVjdCl7XHJcbiAgICAgICAgc3VwZXIub25Db2xsaXNpb24ob2JqKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNvbHBpdG8gZGEgXCIsIG9iailcclxuICAgICAgICB0aGlzLmRhbWFnZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhbWFnZSgpe1xyXG4gICAgICAgIHRoaXMuaGVhbHRoIC0tO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKTtcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5hZGRMb29wKHtcclxuICAgICAgICAgICAgYWN0aW9uczogW1xyXG4gICAgICAgICAgICAgICAgWzUsICgpID0+IHRoaXMuc3ByaXRlLmFscGhhID0gMF0sXHJcbiAgICAgICAgICAgICAgICBbNSwgKCkgPT4gdGhpcy5zcHJpdGUuYWxwaGEgPSAxXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSwgXCJyZXNwYXduXCIpXHJcbiAgICAgICAgdGhpcy5hZGRUaW1lcih7XHJcbiAgICAgICAgICAgIHRpbWU6IGNvbnN0YW50cy5wbGF5ZXJSZXNwYXduVGltZSxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTG9vcChcInJlc3Bhd25cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNwcml0ZS5hbHBoYSA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ3JvdXA6IFwicmVzcGF3blwiXHJcbiAgICAgICAgfSlcclxuICAgICAgICB0aGlzLnNwZWFrKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkVG91Y2hDb250cm9scygpe1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLmludGVyYWN0aXZlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNwcml0ZVxyXG4gICAgICAgIC5vbignbW91c2Vkb3duJywgdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbigndG91Y2hzdGFydCcsIHRoaXMub25EcmFnU3RhcnQuYmluZCh0aGlzKSlcclxuICAgICAgICAub24oJ21vdXNldXAnLCB0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbignbW91c2V1cG91dHNpZGUnLCB0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbigndG91Y2hlbmQnLCB0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbigndG91Y2hlbmRvdXRzaWRlJywgdGhpcy5vbkRyYWdFbmQuYmluZCh0aGlzKSlcclxuICAgICAgICAub24oJ21vdXNlbW92ZScsIHRoaXMub25EcmFnTW92ZS5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbigndG91Y2htb3ZlJywgdGhpcy5vbkRyYWdNb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25EcmFnU3RhcnQoZXZlbnQpe1xyXG4gICAgICAgIHRoaXMudG91Y2hEYXRhID0gZXZlbnQuZGF0YTtcclxuICAgICAgICB0aGlzLnRvdWNoRHJhZ2dpbmcgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uRHJhZ0VuZCgpe1xyXG4gICAgICAgIHRoaXMudG91Y2hEcmFnZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudG91Y2hEYXRhID0gbnVsbDtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcHJpdmF0ZSBvbkRyYWdNb3ZlKCl7XHJcbiAgICAgICAgaWYgKHRoaXMudG91Y2hEcmFnZ2luZyl7XHJcbiAgICAgICAgICAgIHZhciBuZXdQb3NpdGlvbiA9IHRoaXMudG91Y2hEYXRhLmdldExvY2FsUG9zaXRpb24odGhpcy5zcHJpdGUucGFyZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucG9zaXRpb24ueCA9IG5ld1Bvc2l0aW9uLnggLSB0aGlzLnNwcml0ZS53aWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnBvc2l0aW9uLnkgPSBuZXdQb3NpdGlvbi55IC0gdGhpcy5zcHJpdGUuaGVpZ2h0IC8gMjtcclxuICAgICAgICAgICAgdGhpcy5sZXZlbFN0YXRlLm9uUGxheWVyTW92aW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVVJKCl7XHJcbiAgICAgICAgdGhpcy5sZXZlbFN0YXRlLmhlYWx0aFRleHQuc2V0VGV4dCh0aGlzLmhlYWx0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3BlYWsoaGFybT86IGJvb2xlYW4pe1xyXG5cclxuXHJcbiAgICAgICAgLy9aaXR0aXNjbyBmcmFzaSBwcmVjZWRlbnRlbWVudGUgaW4gZXNlY3V6aW9uZVxyXG4gICAgICAgIHRoaXMucmVtb3ZlVGltZXIoe2dyb3VwOiBcInJhZ2dpb1wifSk7XHJcbiAgICAgICAgdGhpcy5sZXZlbFN0YXRlLnN1YnRpdGxlVGV4dC5zZXRUZXh0KFwiXCIpO1xyXG5cclxuICAgICAgICBsZXQgdG9TYXk7XHJcbiAgICAgICAgaWYgKCFoYXJtKSB0b1NheSA9IHRoaXMucGhyYXNlQm9va1t+fihNYXRoLnJhbmRvbSgpICogdGhpcy5waHJhc2VCb29rLmxlbmd0aCldO1xyXG4gICAgICAgIGVsc2UgdG9TYXkgPSB0aGlzLmhhcm1QaHJhc2VCb29rW35+KE1hdGgucmFuZG9tKCkgKiB0aGlzLmhhcm1QaHJhc2VCb29rLmxlbmd0aCldO1xyXG4gICAgICAgIC8vY29uc3QgdG9TYXkgPSB0aGlzLnBocmFzZUJvb2tbdGhpcy5waHJhc2VCb29rLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuY29yZS5hdWRpb01hbmFnZXIucGxheUF1ZGlvKHRvU2F5LmF1ZGlvTmFtZSwge1xyXG4gICAgICAgICAgICBlbmRDYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVUaW1lcih7Z3JvdXA6IFwicmFnZ2lvXCJ9KVxyXG4gICAgICAgICAgICAgICAgdGhpcy5sZXZlbFN0YXRlLnN1YnRpdGxlVGV4dC5zZXRUZXh0KFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRUaW1lcih7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHRoaXMuc3BlYWsoKSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiBNYXRoLnJhbmRvbSgpICogMTUwLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiBcInJhZ2dpb1wiXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzdHJpbmdJZDogXCJyYWdnaW9cIlxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGxldCBjYWxsYmFja3MgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvU2F5LndvcmRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgY2FsbGJhY2tzLnB1c2goW3RvU2F5LndvcmRzVGltZVtpXSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZXZlbFN0YXRlLnN1YnRpdGxlVGV4dC5zZXRUZXh0KHRvU2F5LndvcmRzW2ldKVxyXG4gICAgICAgICAgICB9XSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYWRkVGltZXIoe1xyXG4gICAgICAgICAgICBhY3Rpb25zOiBjYWxsYmFja3MsXHJcbiAgICAgICAgICAgIGdyb3VwOiBcInJhZ2dpb1wiXHJcbiAgICAgICAgfSlcclxuICAgICAgICAvKnRoaXMuYWRkVGltZXIoe1xyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiBjb25zb2xlLmxvZyhcIiFcIildLFxyXG4gICAgICAgICAgICAgICAgWzIwMCwgKCkgPT4gY29uc29sZS5sb2coXCIhIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiBjb25zb2xlLmxvZyhcIiEhIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiBjb25zb2xlLmxvZyhcIiEhISFcIildLFxyXG4gICAgICAgICAgICAgICAgWzIwMCwgKCkgPT4gY29uc29sZS5sb2coXCIhISEhIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiB0aGlzLmRlc3Ryb3koKV1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFBocmFzZUJvb2soKTogUGxheWVyUGhyYXNlW117XHJcbiAgICAgICAgY29uc3QgcGhyYXNlQm9vayA9IFtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0Jvb3phLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQm9vemEgYm9vemEgYm9vemFcIiwgXCJib296YSBib296YSBidXpcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgNzBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9BdXVhdS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkFodWFhYWFhYW9cIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQnJ1dHRlQ29zZS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIk5vbiBkZXZpIHBpw7kgZGlyZVwiLCBcInF1ZXN0ZSBicnV0dGVcIiwgXCJjb3NlZWVlXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDgwLCAxMDBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0NhcnRhSWdpZW5pY2Eub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJIaGhIbW1oXCIsIFwiY2FydGEgaWdpZW5pY2FhYWFhYWFhYWFhXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDcwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9Db3JvbmF0aS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkNvcm9uYXRpIGlsIGNhenpvb2hcIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQ290b2xldHRlLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiVHJlIGNvdG9sZXR0ZVwiLCBcImUgbW96emFyZWxsYWFcIiwgXCJPaG9oXCIsIFwiXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDgwLCAxMjAsIDIwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9EZWxmaW5pLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiSSBkZWxmaW5pIGRldm9ubyBzbWV0dGVybGFcIiwgXCJkaSBpbnF1aW5hcmVlZWVlZWVlXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDEyMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvRmlnbGlvbG8ub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJSaWNvcmRhIGZpZ2xpb2xvXCIsIFwibGUgaWRlZVwiLCBcInZlbmdvbm8gY2FnYW5kb1wiXSxcclxuICAgICAgICAgICAgICAgIFswLCA4MCwgNjBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0ZvdG9jZWxsdWxhLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiTGEgZm90b2NlbGx1bGFcIiwgXCLDqCBmb3R0dXRhYWFoaFwiXSxcclxuICAgICAgICAgICAgICAgIFswLCA2MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvSGhoby5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkhob29oXCJdLFxyXG4gICAgICAgICAgICAgICAgWzBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb01vdG9yZS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBcImhoaC4ucGVyY2jDqFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIk13aG9vb1wiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIkVoIG5vIHBlcmNow6hcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJNd2hvb29cIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFZWggbWggbWgg8J+YlVwiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIk1oIE1oIE1ob1wiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIk9vb2ggT29vaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiT29vb29vb2hcIixcclxuICAgICAgICAgICAgICAgICAgICBcIk9vb29vaHVhaFwiXSxcclxuICAgICAgICAgICAgICAgIFswLCA2MCwgNDAsIDcwLCA2MCwgNjAsIDgwLCA4MCwgODBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb05vblRpUGVybWV0dGVyZS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIk5vbiB0aSBwZXJtZXR0ZXJlIGRpIHBhcmxhcm1pIGNvc2kgZWhcIiwgXCJOb24gdGkgcGVybWV0dGVyZVwiLCBcIk5vbiBsbyBmYXJlIHBpw7nDucO5w7lcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgMTIwLCA3MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvTm9uVmVyby5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkhtIG13XCIsIFwiVW8gb29vaFwiLCBcIk5vbiDDqCB2ZXJvb29vb29vb29vb29cIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgNjAsIDcwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvUmVidXMub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJTY29tZXR0byBjaGUgbm9uIHNhaSByaXNvbHZlcmUgcXVlc3RvIHJlYnVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCI1IHZvbHRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjaGUgaSBjaGlvZGlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNhZG9ubyBkYWwgc29mZml0dG9cIixcclxuICAgICAgICAgICAgICAgICAgICBcImZhbiBwZXIgMiFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIjMsNVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwic2VuemEgZGl2aWRlcmVcIixcclxuICAgICAgICAgICAgICAgICAgICBcImlsIG1vbHRpcGxpY2FuZG8gcGVyIGlsIGRpdmlzb3JlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJRdWluZGkgdHVcIixcclxuICAgICAgICAgICAgICAgICAgICBcInBlbnNhIGNoZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibCdhbHRybyBnaW9ybm9cIixcclxuICAgICAgICAgICAgICAgICAgICBcImhoaGhoaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWkgZXJvIG1lc3NvIGlsIGdlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwibWkgc29ubyBjYWR1dGkgaSBjYXBlbGxpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJobyBtb2x0aXBsaWNhdG8gcGVyIDQhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJFIHNhaSBjaGUgbWkgw6ggdXNjaXRvIGZ1b3JpP1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRGkgZmFyZSBsYSBib3JzYSFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkJpc29nbmEgZGl2aWRlcmUgdHV0dG8gcGVyIDAhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ1dT/imLxhYVwiXHJcbiAgICAgICAgICAgICAgICBdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9nZWwgICAgICAgIC8vdXNjaXRvIGZ1b3JpXHJcbiAgICAgICAgICAgICAgICBbMCwgMTYwLCAxMDAsIDgwLCAxMDAsIDEyMCwgMTAwLCA2MCwgMTIwLCA4MCwgNjAsIDYwLCA1MCwgNzAsIDkwLCAxMDAsIDEwMCwgMTAwLCAxMjBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9TcGF6emF0dXJhLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiSG0gaG0gaG1cIixcclxuICAgICAgICAgICAgICAgICAgICBcIkwnYWx0cm8gZ2lvcm5vXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzdGF2b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicHVsZW5kbyBsYSBzcGF6emF0dXJhXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwZXLDslwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiw6ggYXJyaXZhdG9cIixcclxuICAgICAgICAgICAgICAgICAgICBcIk1yLkdpZ2lcIixcclxuICAgICAgICAgICAgICAgICAgICBcImUgaGEgZGV0dG9cIixcclxuICAgICAgICAgICAgICAgICAgICBcIlxcXCJNYSB2YWZmYW5jdWxvXFxcIlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGhob2hcIlxyXG4gICAgICAgICAgICAgICAgXSwgICAgICAgICAgICAgICAgICAvL2Fycml2YXRvXHJcbiAgICAgICAgICAgICAgICBbMCwgODAsIDcwLCA3MCwgNzAsIDYwLCAxMDAsIDgwLCA4MCwgMTAwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvWnVjY2hlcm8ub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEb3Ynw6ggbG8genVjY2hlcm9vb29vXCJcclxuICAgICAgICAgICAgICAgIF0sICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgXVxyXG4gICAgICAgIHJldHVybiBwaHJhc2VCb29rO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRIYXJtUGhyYXNlQm9vaygpOiBQbGF5ZXJQaHJhc2VbXXtcclxuICAgICAgICBjb25zdCBwaHJhc2VCb29rID0gW1xyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9TdGFpUGl1QXR0ZW50by5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBcIkVoaSBtYSBzdGEgcGnDuSBhdHRlbnRvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtaSBoYWkgZmF0dG8gbWFsZWVlZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJHdWFyZGEgZG92ZSB2YWlcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkd1YXJkYSBsYSBzdHJhZGFhYWFcIlxyXG4gICAgICAgICAgICAgICAgXSwgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFswLCA4MCwgODAsIDYwLCA2MCwgNjBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb1NiYWdsaWF0by5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkhhaSBzYmFnbGlhdG9vb29cIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvT3VjaC5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIk91Y2hcIiwgXCJPdXV1dXV1XCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDQwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9BYWFoLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQWFhYWFhYWFhYWFoXCJdLFxyXG4gICAgICAgICAgICAgICAgWzBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0FoaWFhLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQWhpYWFhYWFhYWFhYWFcIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQW1tYXp6b1NldHRlLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQWhpYSEhIVwiLCBcIlNlIHNiYWdsaSBhbmNvcmEgdW5hIHZvbHRhXCIsIFwidGkgYW1tYXp6byBpbiA3ISEhIVwiXSxcclxuICAgICAgICAgICAgICAgIFswLCA0MCwgNjBdXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICBdXHJcbiAgICAgICAgcmV0dXJuIHBocmFzZUJvb2s7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ2FtZU9iamVjdHMvcGxheWVyLnRzIiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4uL2NsYXNzZXMvZ2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuLi9jb25zdGFudHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdhbGwgZXh0ZW5kcyBHYW1lT2JqZWN0IHtcclxuXHJcbiAgICBwcml2YXRlIHNwZWVkO1xyXG4gICAgcHJpdmF0ZSBib3VuY2VYO1xyXG4gICAgcHJpdmF0ZSBib3VuY2VZO1xyXG4gICAgcHJpdmF0ZSBpbmNyZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGNvcmUsIHgsIHksIHNwcml0ZSwgd2lkdGgsIGhlaWdodCwgc3BlZWQsIGJvdW5jZVgsIGJvdW5jZVksIGluY3JlbWVudH0pe1xyXG4gICAgICAgIHN1cGVyKHtuYW1lLCBjb3JlLCB4LCB5LCBzcHJpdGUsIHdpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9KTtcclxuICAgICAgICB0aGlzLmNvbGxpZGFibGUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcclxuICAgICAgICB0aGlzLmJvdW5jZVggPSBib3VuY2VYO1xyXG4gICAgICAgIHRoaXMuYm91bmNlWSA9IGJvdW5jZVk7XHJcbiAgICAgICAgdGhpcy5pbmNyZW1lbnQgPSBpbmNyZW1lbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgb25DcmVhdGUoKXtcclxuICAgICAgICBpZiAodGhpcy5pbmNyZW1lbnQpe1xyXG4gICAgICAgICAgICB0aGlzLmFkZFRpbWVyKHtcclxuICAgICAgICAgICAgICAgIHRpbWU6IDYwICogMC44LFxyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvdW5jZVggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm91bmNlWSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YSk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUueCArPSB0aGlzLnNwZWVkLng7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUueSArPSB0aGlzLnNwZWVkLnk7XHJcbiAgICAgICAgaWYgKHRoaXMubGl2ZVRpbWUgPiA5ICogNjApIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgIGlmICh0aGlzLmJvdW5jZVgpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcHJpdGUueCA+IDQxMiAtIHRoaXMuc3ByaXRlLndpZHRoKSB0aGlzLnNwZWVkLnggPSAtdGhpcy5zcGVlZC54O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcHJpdGUueCA8IDApIHRoaXMuc3BlZWQueCA9IC10aGlzLnNwZWVkLng7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmJvdW5jZVkpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcHJpdGUueSA+IDczMiAtIHRoaXMuc3ByaXRlLmhlaWdodCkgdGhpcy5zcGVlZC55ID0gLXRoaXMuc3BlZWQueTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3ByaXRlLnkgPCAwKSB0aGlzLnNwZWVkLnkgPSAtdGhpcy5zcGVlZC55O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5pbmNyZW1lbnQpe1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcGVlZC54ID4gMCkgdGhpcy5zcGVlZC54ICs9IDAuMDNcclxuICAgICAgICAgICAgZWxzZSB0aGlzLnNwZWVkLnggLT0gMC4wMztcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3BlZWQueSA+IDApIHRoaXMuc3BlZWQueSArPSAwLjAzO1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuc3BlZWQueSAtPSAwLjAzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbihvYmo6IEdhbWVPYmplY3Qpe1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2dhbWVPYmplY3RzL3dhbGwudHMiLCJleHBvcnQgaW50ZXJmYWNlIENhY2hlT2JqZWN0IHtcclxuXHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBvYmplY3Q6IGFueTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVDYWNoZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBjYWNoZTogQ2FjaGVPYmplY3RbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQobmFtZTogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmNhY2hlLmZpbHRlcih4ID0+IHgubmFtZSA9PSBuYW1lKVswXTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0ID8gcmVzdWx0Lm9iamVjdCA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0KG5hbWU6IHN0cmluZywgb2JqZWN0OiBhbnkpe1xyXG4gICAgICAgIHRoaXMuY2FjaGUucHVzaCh7bmFtZSwgb2JqZWN0fSlcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpe1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuICAgIH1cclxuICAgIFxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvZ2FtZUNhY2hlLnRzIiwiaW1wb3J0IGNvbnN0YW50cyBmcm9tIFwiLi4vY29uc3RhbnRzXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcblxyXG5jbGFzcyBQbGF5aW5nQXVkaW8ge1xyXG5cclxuICAgIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcclxuICAgIHJlYWRvbmx5IGF1ZGlvOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGF1ZGlvfSl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmF1ZGlvID0gYXVkaW87XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5pbnRlcmZhY2UgUGxheUF1ZGlvT3B0aW9ucyB7XHJcblxyXG4gICAgLyoqIElkIGRlbGwnIGF1ZGlvLCBzZSDDqCBpbiBlc2VjdXppb25lIHVuIGF1ZGlvIGNvbiBsbyBzdGVzc28gaWQgdmVycsOgIGZlcm1hdG8gKi9cclxuICAgIHN0cmluZ0lkPzogc3RyaW5nO1xyXG5cclxuICAgIC8qKiBQaXRjaCBkZWxsJyBhdWRpbywgZGVmYXVsdCAxICovXHJcbiAgICBzcGVlZD86IG51bWJlcjtcclxuXHJcbiAgICAvKiogQ2FsbGJhY2sgZXNlZ3VpdGEgcXVhbmRvIGwnYXVkaW8gdmllbmUgdGVybWluYXRvICovXHJcbiAgICBlbmRDYWxsYmFjaz86ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqIFZvbHVtZSBkZWxsJyBhdWRpbywgZGVmYXVsdCAxICovXHJcbiAgICB2b2x1bWU/OiBudW1iZXI7XHJcblxyXG59XHJcblxyXG4vL1RPRE8gSU1QTEVNRU5UQVJFIENBQ0hFIFBJWEktU09VTkQgaHR0cDovL3BpeGlqcy5pby9waXhpLXNvdW5kL2V4YW1wbGVzL2luZGV4Lmh0bWwjc2VjdGlvbi1saWJyYXJ5XHJcbi8vVE9ETyBpbXBsZW1lbnRhcmUgc2VtcGxpY2Ugc3RvcCBhdWRpb1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXVkaW9NYW5hZ2VyIHtcclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGNvcmU6IENvcmU7XHJcbiAgICBwcml2YXRlIGF1ZGlvUG9vbCA6IFBsYXlpbmdBdWRpb1tdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHtjb3JlfSl7XHJcbiAgICAgICAgdGhpcy5jb3JlID0gY29yZTtcclxuICAgICAgICB0aGlzLmF1ZGlvUG9vbCA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmlwcm9kdWNlIHVuIGF1ZGlvXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAgICAgICAgICBOb21lIGRlbGwnIGF1ZGlvIGRhIHJpcHJvZHVycmVcclxuICAgICAqIEBwYXJhbSBvcHRpb25zICAgICAgIE9wemlvbmkgZGkgcmlwcm9kdXppb25lXHJcbiAgICAgKi9cclxuICAgIHBsYXlBdWRpbyhuYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBQbGF5QXVkaW9PcHRpb25zKXtcclxuXHJcbiAgICAgICAgLy9TZSBlc2lzdGUgZ2nDoCB1biBhdWRpbyBjb24gbG8gc3Rlc3NvIGlkIHZpZW5lIGZlcm1hdG8gZSByaW1vc3NvIGRhbCBwb29sXHJcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdHJpbmdJZCkgdGhpcy5yZW1vdmVGcm9tUG9vbChvcHRpb25zLnN0cmluZ0lkKTtcclxuXHJcbiAgICAgICAgLy9PdHRlbmdvIGwnYXVkaW8gZGEgcmlwcm9kdXJyZSBlIGNyZW8gbCdpc3RhbnphXHJcbiAgICAgICAgY29uc3QgYXVkaW8gPSBjb25zdGFudHMuYXVkaW8uZmlsdGVyKHggPT4geCA9PT0gbmFtZSlbMF07XHJcbiAgICAgICAgaWYgKCFhdWRpbyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5lc3N1biBhdWRpbyBhc3NvY2lhdG8gYSBcIiArIG5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuY29yZS5QSVhJLnNvdW5kLlNvdW5kLmZyb20oe1xyXG4gICAgICAgICAgICB1cmw6IGNvbnN0YW50cy5hdWRpb1BhdGggKyBhdWRpbyxcclxuICAgICAgICAgICAgc3BlZWQ6IG9wdGlvbnMgPyBvcHRpb25zLnNwZWVkIHx8IDEgOiAxLFxyXG4gICAgICAgICAgICBhdXRvUGxheTogdHJ1ZSxcclxuICAgICAgICAgICAgdm9sdW1lOiBvcHRpb25zID8gb3B0aW9ucy52b2x1bWUgfHwgMSA6IDEsXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc3RyaW5nSWQpIHRoaXMucmVtb3ZlRnJvbVBvb2wob3B0aW9ucy5zdHJpbmdJZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmVuZENhbGxiYWNrKSBvcHRpb25zLmVuZENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL1JpcHJvZHVjbyBlZCBhZ2dpdW5nbyBhbCBwb29sLCBhbGxhIHN1YSBlc2VjdXppb25lIHNhcsOgIHJpbW9zc29cclxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmluZ0lkKSB0aGlzLmFkZFRvUG9vbChvcHRpb25zLnN0cmluZ0lkLCBzb3VyY2UpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFkZFRvUG9vbChuYW1lOiBzdHJpbmcsIHNvdXJjZTogYW55KXtcclxuICAgICAgICBjb25zdCBzb3VuZCA9IG5ldyBQbGF5aW5nQXVkaW8oe25hbWUsIGF1ZGlvOiBzb3VyY2V9KVxyXG4gICAgICAgIHRoaXMuYXVkaW9Qb29sLnB1c2goc291bmQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVtb3ZlRnJvbVBvb2wobmFtZTogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCBhdWRpb09iaiA9IHRoaXMuYXVkaW9Qb29sLmZpbHRlcih4ID0+IHgubmFtZSA9PSBuYW1lKVswXTtcclxuICAgICAgICBpZiAoIWF1ZGlvT2JqKSByZXR1cm47XHJcbiAgICAgICAgYXVkaW9PYmouYXVkaW8uc3RvcCgwKTtcclxuICAgICAgICB0aGlzLmF1ZGlvUG9vbCA9IHRoaXMuYXVkaW9Qb29sLmZpbHRlcih4ID0+IHgubmFtZSAhPSBuYW1lKTtcclxuICAgIH1cclxuICAgIFxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvYXVkaW9NYW5hZ2VyLnRzIl0sInNvdXJjZVJvb3QiOiIifQ==