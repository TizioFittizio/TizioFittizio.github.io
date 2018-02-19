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
        this.PIXI.glCore.VertexArrayObject.FORCE_NATIVE = true;
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
        //console.log(core.PIXI.loader.resources);
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
        //Caricamento sprite giocatore
        assetsToLoad.push(constants_1.default.spritePath + constants_1.default.playerSprite);
        //Caricamento sprite generali
        constants_1.default.objectSprites.forEach(function (x) { return assetsToLoad.push(constants_1.default.spritePath + x); });
        //Caricamento audio
        constants_1.default.audio.forEach(function (x) { return assetsToLoad.push(constants_1.default.audioPath + x); });
        this.core.PIXI.loader.add(assetsToLoad, { crossOrigin: 'anonymous' })
            .on("progress", this.loadProgressHandler.bind(this))
            .load(this.onAssetsLoaded.bind(this));
    };
    LoadingState.prototype.loadProgressHandler = function (loader, resource) {
        //console.log("Caricato", resource, loader.progress);
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
                [60 * 6.5, function () {
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
        var _this = this;
        //Se esiste già un audio con lo stesso id viene fermato e rimosso dal pool
        if (options && options.stringId)
            this.removeFromPool(options.stringId);
        //Ottengo l'audio da riprodurre e creo l'istanza
        var audio = this.core.PIXI.loader.resources[constants_1.default.audioPath + name].sound;
        if (!audio) {
            console.warn("Nessun audio associato a " + name);
            return;
        }
        audio.speed = options ? options.speed || 1 : 1;
        audio.volume = options ? options.volume || 1 : 1;
        var instance = audio.play();
        instance.on('end', function () {
            if (options && options.stringId)
                _this.removeFromPool(options.stringId);
            if (options && options.endCallback)
                options.endCallback();
        });
        //Riproduco ed aggiungo al pool, alla sua esecuzione sarà rimosso
        if (options && options.stringId)
            this.addToPool(options.stringId, audio);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzVkZDE5ZGE5ODYyOTNkNmI5ZTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnN0YW50cy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29yZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xhc3Nlcy9nYW1lU3RhdGUudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvdGltZXJQb29sLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY2xhc3Nlcy9nYW1lT2JqZWN0LnRzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZXMvbG9hZGluZ1N0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL3RpbWVyLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2xvb3AudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlcy9sZXZlbFN0YXRlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2dhbWVPYmplY3RQb29sLnRzIiwid2VicGFjazovLy8uL3NyYy9nYW1lT2JqZWN0cy9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWVPYmplY3RzL3dhbGwudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NsYXNzZXMvZ2FtZUNhY2hlLnRzIiwid2VicGFjazovLy8uL3NyYy9jbGFzc2VzL2F1ZGlvTWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtB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RU8sK0JBQVUsR0FBbEIsVUFBbUIsS0FBZTtRQUM5QixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDckUsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO1lBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRU8sK0JBQVUsR0FBbEIsVUFBbUIsS0FBZTtRQUM5QixJQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7WUFBQyxNQUFNLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQztZQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVPLCtCQUFVLEdBQWxCO1FBQ0ksSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFD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QWMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTCxtQkFBQztBQUFELENBQUMiLCJmaWxlIjoiYnVpbGQvYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgYzVkZDE5ZGE5ODYyOTNkNmI5ZTkiLCJleHBvcnQgZGVmYXVsdCB7XHJcbiAgICBhdWRpb1BhdGg6IFwiYXNzZXRzL3NvdW5kcy9cIixcclxuICAgIGF1ZGlvOiBbXHJcbiAgICAgICAgXCJyYWdnaW9BYWFoLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQWhpYWEub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Cb296YS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb0JydXR0ZUNvc2Uub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9DYXJ0YUlnaWVuaWNhLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQ29yb25hdGkub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Db3RvbGV0dGUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9EZWxmaW5pLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvQXV1YXUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9BbW1henpvU2V0dGUub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9FdS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb0ZpZ2xpb2xvLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvRm90b2NlbGx1bGEub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9Vby5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1NhbGFtZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1JlYnVzLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvWnVjY2hlcm8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9IaGhvLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvT2NjaGlhbGkub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9TYmFnbGlhdG8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9TdGFpUGl1QXR0ZW50by5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb1NwaW5hLm9nZ1wiLFxyXG4gICAgICAgIFwicmFnZ2lvU3BhenphdHVyYS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb01vdG9yZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb05vblRpUGVybWV0dGVyZS5vZ2dcIixcclxuICAgICAgICBcInJhZ2dpb05vblZlcm8ub2dnXCIsXHJcbiAgICAgICAgXCJyYWdnaW9PdWNoLm9nZ1wiLFxyXG4gICAgICAgIFwiaG93RG9Zb3VLbm93Lm9nZ1wiXHJcbiAgICBdLFxyXG4gICAgc3ByaXRlUGF0aDogXCJhc3NldHMvc3ByaXRlcy9cIixcclxuICAgIHBsYXllclNwcml0ZTogXCJjaGlja2VuLnBuZ1wiLFxyXG4gICAgcGxheWVyU2l6ZTogNDgsXHJcbiAgICBwbGF5ZXJEZWZhdWx0SGVhbHRoOiA1LFxyXG4gICAgcGxheWVyUmVzcGF3blRpbWU6IDkwLFxyXG4gICAgb2JqZWN0U3ByaXRlczpbXHJcbiAgICAgICAgXCJibG9jay5wbmdcIlxyXG4gICAgXVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NvbnN0YW50cy50cyIsImltcG9ydCBMb2FkaW5nU3RhdGUgZnJvbSBcIi4vc3RhdGVzL2xvYWRpbmdTdGF0ZVwiO1xyXG5pbXBvcnQgR2FtZVN0YXRlIGZyb20gXCIuL2NsYXNzZXMvZ2FtZVN0YXRlXCI7XHJcbmltcG9ydCBMZXZlbFN0YXRlIGZyb20gJy4vc3RhdGVzL2xldmVsU3RhdGUnO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuL2NvbnN0YW50c1wiO1xyXG5pbXBvcnQgR2FtZUNhY2hlIGZyb20gXCIuL2NsYXNzZXMvZ2FtZUNhY2hlXCI7XHJcbmltcG9ydCBBdWRpb01hbmFnZXIgZnJvbSBcIi4vY2xhc3Nlcy9hdWRpb01hbmFnZXJcIjtcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENoYW5nZVNjZW5lQXJncyB7XHJcbiAgICBcclxuICAgIC8qIExvIHN0YXRvIGNoZSBkaXZlbnRlcsOgIG5vbiBhdHRpdm8gZGV2ZSBlc3NlcmUgcmVzZXR0YXRvPyAqL1xyXG4gICAgcmVzZXRQcmV2aW91c1N0YXRlPzogYm9vbGVhbjtcclxuXHJcbiAgICAvKiBMbyBzdGF0byBjaGUgZGl2ZW50ZXLDoCBhdHRpdm8gZGV2ZSBlc3NlcmUgcmVzZXR0YXRvPyAqL1xyXG4gICAgcmVzZXRGb2xsb3dpbmdTdGF0ZT86IGJvb2xlYW47XHJcblxyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3NlIGNvcmUgY2hlIG1lbW9yaXp6YSBnbGkgc3RhdGkgcG9zc2liaWxpIGRpIGdpb2NvIGUgcHJvY2Vzc2EgaWwgY2ljbG8gZGkgcmVuZGVyaW5nXHJcbiAqIGRpIHF1ZWxsbyBhdHRpdm9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvcmUge1xyXG5cclxuICAgIC8qKiBMJ29nZ2V0dG8gUElYSSBvdHRlbnV0byBkYSBQSVhJLmpzICovXHJcbiAgICByZWFkb25seSBQSVhJOiBhbnk7XHJcblxyXG4gICAgLyoqIEwnb2dnZXR0byBhcHAgb3R0ZW51dG8gZGEgUElYSS5qcyAqL1xyXG4gICAgcmVhZG9ubHkgYXBwOiBhbnk7XHJcblxyXG4gICAgLyoqIExvIHN0YXRvIGF0dHVhbGUgcHJvY2Vzc2F0byBkYWwgZ2lvY28gKi9cclxuICAgIHByaXZhdGUgY3VycmVudFN0YXRlOiBHYW1lU3RhdGU7XHJcblxyXG4gICAgLyoqIFN0YXRpIGRpIGdpb2NvICovXHJcbiAgICBwcml2YXRlIHN0YXRlczogR2FtZVN0YXRlW107XHJcblxyXG4gICAgLyoqIE9nZ2V0dG8gcGVyIHJpcHJvZHVycmUgYXVkaW8gKi9cclxuICAgIHJlYWRvbmx5IGF1ZGlvTWFuYWdlcjogQXVkaW9NYW5hZ2VyO1xyXG5cclxuICAgIC8qKiBWYWxvcmUgaW5jcmVtZW50YW50ZSB1c2F0byBwZXIgZ2VuZXJhcmUgaWQgdW5pdm9jaSAqL1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRHZW5lcmF0b3I6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqIFNlIHZlcmEsIG5lbCBsb29wIGRpIGdpb2NvIG5vbiB2aWVuZSBwaXUgZXNlZ3VpdG8gbmVzc3VuIHVwZGF0ZSBkZWxsbyBzdGF0byBjb3JyZW50ZSAqL1xyXG4gICAgcHJpdmF0ZSBpbnRlcnJ1cHRHYW1lTG9vcDogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIGNhY2hlOiBHYW1lQ2FjaGU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe1BJWEksIGFwcH06IGFueSl7XHJcbiAgICAgICAgdGhpcy5QSVhJID0gUElYSTtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLmF1ZGlvTWFuYWdlciA9IG5ldyBBdWRpb01hbmFnZXIoe2NvcmU6IHRoaXN9KTtcclxuICAgICAgICB0aGlzLmludGVycnVwdEdhbWVMb29wID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IG5ldyBHYW1lQ2FjaGUoKTtcclxuICAgICAgICB0aGlzLm1haW4oKTtcclxuICAgICAgICB0aGlzLmFkZExpc3RlbmVycygpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pemlhbGl6emEgZ2xpIHN0YXRpIGRpIGdpb2NvXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgaW5pdFN0YXRlcygpe1xyXG4gICAgICAgIHRoaXMuc3RhdGVzID0gW1xyXG4gICAgICAgICAgICBuZXcgTG9hZGluZ1N0YXRlKHtuYW1lOiBcImxvYWRpbmdcIiwgY29yZTogdGhpc30pLFxyXG4gICAgICAgICAgICBuZXcgTGV2ZWxTdGF0ZSh7bmFtZTogXCJsZXZlbFwiLCBjb3JlOiB0aGlzfSlcclxuICAgICAgICBdXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qKlxyXG4gICAgICogQ2ljbG8gaW5maW5pdG8gZGVsIGdpb2NvXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEgRGVsdGFcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBnYW1lTG9vcChkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICBpZiAodGhpcy5pbnRlcnJ1cHRHYW1lTG9vcCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudXBkYXRlTGF5ZXJzWigpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlLnVwZGF0ZShkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGdW56aW9uZSBlc2VndWl0YSBwZXIgaW5pemlhbGl6emFyZSBxdWVzdGEgaXN0YW56YSBkaSBDT1JFXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgbWFpbigpe1xyXG4gICAgICAgIHRoaXMuaW5pdFN0YXRlcygpO1xyXG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gdGhpcy5zdGF0ZXNbMF07XHJcbiAgICAgICAgdGhpcy5hcHAudGlja2VyLmFkZCgoZGVsdGE6IG51bWJlcikgPT4gdGhpcy5nYW1lTG9vcChkZWx0YSkpO1xyXG4gICAgICAgIHRoaXMuUElYSS5nbENvcmUuVmVydGV4QXJyYXlPYmplY3QuRk9SQ0VfTkFUSVZFID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5vbkVudGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYW1iaWEgbG8gc3RhdG8gZGkgY3VpIGRldmUgZXNzZXJlIGVzZWd1aXRvIGwndXBkYXRlXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBOb21lIGRlbCBudW92byBzdGF0b1xyXG4gICAgICogQHBhcmFtIGFyZ3MgUGFyYW1ldHJpIGRpIGNhbWJpYW1lbnRvXHJcbiAgICAgKi9cclxuICAgIGNoYW5nZVN0YXRlKG5hbWUsIGFyZ3M6IENoYW5nZVNjZW5lQXJncyl7XHJcbiAgICAgICAgdGhpcy5pbnRlcnJ1cHRHYW1lTG9vcCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUub25FeGl0KCk7XHJcbiAgICAgICAgaWYgKGFyZ3MucmVzZXRQcmV2aW91c1N0YXRlKSB0aGlzLmN1cnJlbnRTdGF0ZS5yZXNldCgpO1xyXG4gICAgICAgIGNvbnN0IG5leHRTdGF0ZTogR2FtZVN0YXRlID0gdGhpcy5zdGF0ZXMuZmlsdGVyKHggPT4geC5uYW1lID09PSBuYW1lKVswXTtcclxuICAgICAgICBpZiAoYXJncy5yZXNldEZvbGxvd2luZ1N0YXRlKSBuZXh0U3RhdGUucmVzZXQoKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5leHRTdGF0ZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5vbkVudGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcnJ1cHRHYW1lTG9vcCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3R0aWVuZSB1biBpZCB1bml2b2NvXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZW5lcmF0ZUlkKCk6IG51bWJlcntcclxuICAgICAgICByZXR1cm4gdGhpcy5pZEdlbmVyYXRvcisrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogT3JkaW5hIGkgZmlnbGkgaW4gYmFzZSBhbGwnIGFzc2UgelxyXG4gICAgICovXHJcbiAgICB1cGRhdGVMYXllcnNaKCl7XHJcbiAgICAgICAgdGhpcy5hcHAuc3RhZ2UuY2hpbGRyZW4uc29ydChmdW5jdGlvbihhLGIpIHtcclxuICAgICAgICAgICAgYS56SW5kZXggPSBhLnpJbmRleCB8fCAwO1xyXG4gICAgICAgICAgICBiLnpJbmRleCA9IGIuekluZGV4IHx8IDA7XHJcbiAgICAgICAgICAgIHJldHVybiBiLnpJbmRleCAtIGEuekluZGV4XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTGlzdGVuZXJzKCl7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYm9keVwiKVswXS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBlID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlLmtleSA9PT0gXCJwXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmludGVycnVwdEdhbWVMb29wID0gIXRoaXMuaW50ZXJydXB0R2FtZUxvb3A7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJydXB0R2FtZUxvb3ApIGNvbnNvbGUubG9nKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sIDEpXHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4od2luZG93IGFzIGFueSkuY29yZSA9IChQSVhJLCBhcHApID0+IHtcclxuICAgIG5ldyBDb3JlKHtQSVhJLCBhcHB9KTtcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jb3JlLnRzIiwiaW1wb3J0IENvcmUgZnJvbSBcIi4uL2NvcmVcIjtcclxuaW1wb3J0IFRpbWVyUG9vbCwgeyBDbG9ja1BhcmFtcyB9IGZyb20gXCIuL3RpbWVyUG9vbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZVN0YXRlIHtcclxuXHJcbiAgICByZWFkb25seSBuYW1lOiBzdHJpbmc7XHJcbiAgICByZWFkb25seSBjb3JlOiBDb3JlO1xyXG5cclxuICAgIHByaXZhdGUgdGltZXJQb29sOiBUaW1lclBvb2w7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe25hbWUsIGNvcmV9OiBhbnkpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jb3JlID0gY29yZTtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbCA9IG5ldyBUaW1lclBvb2woe2NvcmU6IHRoaXMuY29yZX0pXHJcbiAgICB9XHJcblxyXG4gICAgb25FbnRlcigpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBvbkV4aXQoKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBFc2VndWUgbCd1cGRhdGUgZGVpIHRpbWVyIGUgZGVpIHBvb2xcclxuICAgICAqIEBwYXJhbSBkZWx0YSBEZWx0YVxyXG4gICAgICovXHJcbiAgICB1cGRhdGUoZGVsdGE6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wudXBkYXRlUG9vbChkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEVzZWd1ZSB1bmEgY2FsbGJhY2sgbyBwacO5IGNhbGxiYWNrIHNlY29uZG8gdW4gdGVtcG8gc3BlY2lmaWNhdG9cclxuICAgICAqIEBwYXJhbSBjbG9ja1BhcmFtcyBBcmdvbWVudGkgdGltZXJcclxuICAgICAqL1xyXG4gICAgYWRkVGltZXIoY2xvY2tQYXJhbXM6IENsb2NrUGFyYW1zKXtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbC5hZGRUaW1lcihjbG9ja1BhcmFtcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb250aW51YSBhZCBlc2VndWlyZSB1bmEgbyBwacO5IGNhbGxiYWNrIHNlY29uZG8gdW4gdGVtcG8gc3BlY2lmaWNhdG9cclxuICAgICAqIEBwYXJhbSBjbG9ja1BhcmFtcyAgIEFyZ29tZW50aSB0aW1lclxyXG4gICAgICogQHBhcmFtIG5hbWUgICAgICAgICAgTm9tZSBMb29wXHJcbiAgICAgKi9cclxuICAgIGFkZExvb3AoY2xvY2tQYXJhbXM6IENsb2NrUGFyYW1zLCBuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLmFkZExvb3AoY2xvY2tQYXJhbXMsIG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW50ZXJyb21wZSB1biBsb29wIHByZWNlZGVudGVtZW50ZSBpbXBvc3RhdG9cclxuICAgICAqIEBwYXJhbSBuYW1lICAgICAgTm9tZSBsb29wXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZUxvb3AobmFtZTogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbC5yZW1vdmVMb29wKG5hbWUpO1xyXG4gICAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL2dhbWVTdGF0ZS50cyIsImltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiO1xyXG5pbXBvcnQgQ29yZSBmcm9tIFwiLi4vY29yZVwiO1xyXG5pbXBvcnQgTG9vcCBmcm9tICcuL2xvb3AnO1xyXG5cclxuZXhwb3J0IHR5cGUgQ2xvY2sgPSBUaW1lciB8IExvb3A7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENsb2NrUGFyYW1zIHtcclxuXHJcbiAgICAvKiogQ2FsbGJhY2sgbXVsdGlwbGUgZGEgZXNlZ3VpcmUgaW4gb3JkaW5lIGNvbiB0ZW1wbyBkaSBhdHRlc2EgcmVsYXRpdm8gKi9cclxuICAgIGFjdGlvbnM/OiBbbnVtYmVyLCAoKSA9PiB2b2lkXVtdO1xyXG5cclxuICAgIC8qKiBUZW1wbyBkaSBhdHRlc2EgcGVyIHVuYSBzaW5nb2xhIGNhbGxiYWNrICovXHJcbiAgICB0aW1lPzogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBTaW5nb2xhIGNhbGxiYWNrIGRhIGVzZWd1aXJlICovXHJcbiAgICBjYWxsYmFjaz86ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqIEFzc2VnbmEgdW4gZ3J1cHBvICovXHJcbiAgICBncm91cD86IHN0cmluZztcclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBRdWVzdGEgY2xhc3NlIGVzZWd1ZSBsJ3VwZGF0ZSBkaSB0aW1lciBlIGRpIGxvb3AgYWwgc3VvIGludGVybm9cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVyUG9vbCB7XHJcblxyXG4gICAgcHJpdmF0ZSBjbG9ja3M6IENsb2NrW107XHJcbiAgICBwcml2YXRlIGNvcmU6IENvcmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe2NvcmV9KXtcclxuICAgICAgICB0aGlzLmNvcmUgPSBjb3JlO1xyXG4gICAgICAgIHRoaXMuY2xvY2tzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZ2dpdW5nZSB1biB0aW1lciBhbCB0aW1lclBvb2xcclxuICAgICAqIEBwYXJhbSBwYXJhbTAgQXJnb21lbnRpIHBlciBpbCB0aW1lclxyXG4gICAgICogQHJldHVybiBpZCBkZWwgdGltZXIgY3JlYXRvXHJcbiAgICAgKi9cclxuICAgIGFkZFRpbWVyKHBhcmFtczogQ2xvY2tQYXJhbXMpOiBudW1iZXJ7XHJcbiAgICAgICAgY29uc3QgdGltZXIgPSBuZXcgVGltZXIoe1xyXG4gICAgICAgICAgICB0aW1lclBvb2w6IHRoaXMsXHJcbiAgICAgICAgICAgIGdyb3VwOiBwYXJhbXMuZ3JvdXBcclxuICAgICAgICB9LCBwYXJhbXMuYWN0aW9ucyA/IHBhcmFtcy5hY3Rpb25zIDogW1twYXJhbXMudGltZSwgcGFyYW1zLmNhbGxiYWNrXV0pXHJcbiAgICAgICAgdGhpcy5jbG9ja3MucHVzaCh0aW1lcik7XHJcbiAgICAgICAgcmV0dXJuIHRpbWVyLmlkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmltdW92ZSB1biB0aW1lciBkYWwgcG9vbCwgaW50ZXJyb21wZW5kbyBsYSBzdWEgZXNlY3V6aW9uZVxyXG4gICAgICogQHBhcmFtIGlkIElkIGRlbCB0aW1lclxyXG4gICAgICovXHJcbiAgICByZW1vdmVUaW1lcihpZDogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLmNsb2NrcyA9IHRoaXMuY2xvY2tzLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBMb29wID8gdHJ1ZSA6IHguaWQgIT09IGlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJpbXVvdmUgZGVpIHRpbWVyIGRhbCBwb29sLCBpbnRlcnJvbXBlbmRvIGxhIGxvcm8gZXNlY3V6aW9uZVxyXG4gICAgICogQHBhcmFtIGdyb3VwIEdydXBwbyBkZWwgdGltZXIsIGkgdGltZXIgZGkgZGVmYXVsdCBjb21lIGdydXBwbyBoYW5ubyBudWxsXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVRpbWVyQnlHcm91cChncm91cDogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNsb2NrcyA9IHRoaXMuY2xvY2tzLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBMb29wID8gdHJ1ZSA6IHguZ3JvdXAgIT09IGdyb3VwKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRMb29wKHBhcmFtczogQ2xvY2tQYXJhbXMsIG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgbG9vcCA9IG5ldyBMb29wKHtcclxuICAgICAgICAgICAgdGltZXJQb29sOiB0aGlzLFxyXG4gICAgICAgICAgICBncm91cDogcGFyYW1zLmdyb3VwLFxyXG4gICAgICAgICAgICBuYW1lXHJcbiAgICAgICAgfSwgcGFyYW1zLmFjdGlvbnMgPyBwYXJhbXMuYWN0aW9ucyA6IFtbcGFyYW1zLnRpbWUsIHBhcmFtcy5jYWxsYmFja11dKTtcclxuICAgICAgICB0aGlzLmNsb2Nrcy5wdXNoKGxvb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUxvb3AobmFtZTogc3RyaW5nKXtcclxuICAgICAgICB0aGlzLmNsb2NrcyA9IHRoaXMuY2xvY2tzLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBUaW1lciA/IHRydWUgOiB4Lm5hbWUgIT09IG5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBvb2woZGVsdGE6IG51bWJlcil7XHJcbiAgICAgICAgdGhpcy5jbG9ja3MuZm9yRWFjaCh4ID0+IHgudXBkYXRlKGRlbHRhKSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKXtcclxuICAgICAgICB0aGlzLmNsb2NrcyA9IFtdO1xyXG4gICAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL3RpbWVyUG9vbC50cyIsImltcG9ydCBDb3JlIGZyb20gXCIuL2NvcmVcIjtcclxuaW1wb3J0IGNvbnN0YW50cyBmcm9tIFwiLi9jb25zdGFudHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWEgdW5vIHNwcml0ZSB0cmFtaXRlIFBJWElcclxuICAgICAqIEBwYXJhbSBjb3JlIFxyXG4gICAgICogQHBhcmFtIHBhdGggXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGVTcHJpdGUoY29yZTogQ29yZSwgbmFtZTogc3RyaW5nKXtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvcmUuUElYSS5sb2FkZXIucmVzb3VyY2VzKTtcclxuICAgICAgICByZXR1cm4gbmV3IGNvcmUuUElYSS5TcHJpdGUoY29yZS5QSVhJLmxvYWRlci5yZXNvdXJjZXNbY29uc3RhbnRzLnNwcml0ZVBhdGggKyBuYW1lXS50ZXh0dXJlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERhdGkgZHVlIHNwcml0ZSBjcmVhdGkgdHJhbWl0ZSBQSVhJLCB2ZXJpZmljYSBzZSBjb2xsaWRvbm9cclxuICAgICAqIEBwYXJhbSByMSBTcHJpdGUxXHJcbiAgICAgKiBAcGFyYW0gcjIgU3ByaXRlMlxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaGl0VGVzdFJlY3RhbmdsZShyMSwgcjIpe1xyXG4gICAgICAgIC8vQ2FsY3VsYXRlIGBjZW50ZXJYYCBhbmQgYGNlbnRlcllgIHByb3BlcnRpZXMgb24gdGhlIHNwcml0ZXNcclxuICAgICAgICByMS5jZW50ZXJYID0gcjEueCArIHIxLndpZHRoIC8gMjtcclxuICAgICAgICByMS5jZW50ZXJZID0gcjEueSArIHIxLmhlaWdodCAvIDI7XHJcbiAgICAgICAgcjIuY2VudGVyWCA9IHIyLnggKyByMi53aWR0aCAvIDI7XHJcbiAgICAgICAgcjIuY2VudGVyWSA9IHIyLnkgKyByMi5oZWlnaHQgLyAyO1xyXG5cclxuICAgICAgICAvL0NhbGN1bGF0ZSB0aGUgYGhhbGZXaWR0aGAgYW5kIGBoYWxmSGVpZ2h0YCBwcm9wZXJ0aWVzIG9mIHRoZSBzcHJpdGVzXHJcbiAgICAgICAgcjEuaGFsZldpZHRoID0gcjEud2lkdGggLyAyO1xyXG4gICAgICAgIHIxLmhhbGZIZWlnaHQgPSByMS5oZWlnaHQgLyAyO1xyXG4gICAgICAgIHIyLmhhbGZXaWR0aCA9IHIyLndpZHRoIC8gMjtcclxuICAgICAgICByMi5oYWxmSGVpZ2h0ID0gcjIuaGVpZ2h0IC8gMjtcclxuXHJcbiAgICAgICAgLy9DcmVhdGUgYSBgY29sbGlzaW9uYCB2YXJpYWJsZSB0aGF0IHdpbGwgdGVsbCB1c1xyXG4gICAgICAgIC8vaWYgYSBjb2xsaXNpb24gaXMgb2NjdXJyaW5nXHJcbiAgICAgICAgbGV0IGNvbGxpc2lvbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvL0NoZWNrIHdoZXRoZXIgdGhlIHNoYXBlcyBvZiB0aGUgc3ByaXRlcyBhcmUgb3ZlcmxhcHBpbmcuIElmIHRoZXlcclxuICAgICAgICAvL2FyZSwgc2V0IGBjb2xsaXNpb25gIHRvIGB0cnVlYFxyXG4gICAgICAgIGlmIChNYXRoLmFicyhyMS5jZW50ZXJYIC0gcjIuY2VudGVyWCkgPCByMS5oYWxmV2lkdGggKyByMi5oYWxmV2lkdGhcclxuICAgICAgICAmJiBNYXRoLmFicyhyMS5jZW50ZXJZIC0gcjIuY2VudGVyWSkgPCByMS5oYWxmSGVpZ2h0ICsgcjIuaGFsZkhlaWdodCkge1xyXG4gICAgICAgICAgICBjb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9SZXR1cm4gdGhlIHZhbHVlIG9mIGBjb2xsaXNpb25gIGJhY2sgdG8gdGhlIG1haW4gcHJvZ3JhbVxyXG4gICAgICAgIHJldHVybiBjb2xsaXNpb247XHJcbiAgICB9XHJcblxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy91dGlscy50cyIsImltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcbmltcG9ydCBHYW1lT2JqZWN0UG9vbCBmcm9tICcuL2dhbWVPYmplY3RQb29sJztcclxuaW1wb3J0IFRpbWVyUG9vbCwgeyBDbG9ja1BhcmFtcyB9IGZyb20gXCIuL3RpbWVyUG9vbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdCB7XHJcblxyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgY29yZTogQ29yZTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgc3ByaXRlOiBhbnk7XHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0UG9vbDogR2FtZU9iamVjdFBvb2w7XHJcbiAgICBwcml2YXRlIHRpbWVyUG9vbDogVGltZXJQb29sO1xyXG5cclxuICAgIHJlYWRvbmx5IGlkOiBudW1iZXI7XHJcblxyXG4gICAgLyoqIEluZGljYSBzZSBkZXZlIGVzc2VyZSBjb25zaWRlcmF0byBjb21lIGNvbGxpc2lvbmUgbmVsIG1vbWVudG8gaW4gY3VpIHNpIHRvY2NhICovXHJcbiAgICBwcm90ZWN0ZWQgY29sbGlkYWJsZTogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogSW5kaWNhIHNlIGRldmUgZXNzZXJlIGNvc3RhbnRlbWVudGUgaW4gYXNjb2x0byBwZXIgcmVnaXN0YXJlIGNvbGxpc2lvbmkgKi9cclxuICAgIHByb3RlY3RlZCBjaGVja0NvbGxpc2lvbjogYm9vbGVhbjtcclxuXHJcbiAgICAvKiogVGVtcG8gZGkgdml0YSBkaSBxdWVzdG8gZ2FtZU9iamVjdCAqL1xyXG4gICAgcHJvdGVjdGVkIGxpdmVUaW1lOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHtuYW1lLCBjb3JlLCB4LCB5LCB3aWR0aCwgaGVpZ2h0LCBzcHJpdGV9KXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuY29yZSA9IGNvcmU7XHJcbiAgICAgICAgdGhpcy5pZCA9IENvcmUuZ2VuZXJhdGVJZCgpO1xyXG4gICAgICAgIHRoaXMuaW5pdFNwcml0ZShzcHJpdGUsIHgsIHksIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIHRoaXMubGl2ZVRpbWUgPSAwO1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sID0gbmV3IFRpbWVyUG9vbCh7Y29yZTogY29yZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFNwcml0ZShzcHJpdGUsIHgsIHksIHdpZHRoLCBoZWlnaHQpe1xyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gc3ByaXRlO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnggPSB4O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuc3ByaXRlLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgIC8vdGhpcy5zcHJpdGUucGl2b3Quc2V0KHdpZHRoIC8gMiwgaGVpZ2h0IC8gMik7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnNwcml0ZS5waXZvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW5lciBlc2VndWl0byBxdWFuZG8gaWwgR2FtZU9iamVjdCB2aWVuZSBhZ2dpdW50byBhbCBwb29sXHJcbiAgICAgKi9cclxuICAgIG9uQ3JlYXRlKCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuZXIgZXNlZ3VpdG8gcXVhbmRvIGlsIEdhbWVPYmplY3QgdmllbmUgcmltb3NzbyBkYWwgcG9vbFxyXG4gICAgICovXHJcbiAgICBvbkRlc3Ryb3koKXtcclxuICAgICAgICB0aGlzLnRpbWVyUG9vbC5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIGRlbGwnIG9nZ2V0dG8sIGdlc3Rpc2NlIGkgdGltZXIgZWQgaSBsb29wXHJcbiAgICAgKiBAcGFyYW0gZGVsdGEgRGVsdGFcclxuICAgICAqL1xyXG4gICAgdXBkYXRlKGRlbHRhKXtcclxuICAgICAgICB0aGlzLmxpdmVUaW1lICs9IGRlbHRhO1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLnVwZGF0ZVBvb2woZGVsdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuZXIgZXNlZ3VpdG8gcXVhbmRvIHNpIHRvY2NhIHVuIGdhbWVPYmplY3QgY29sbGlkYWJsZSBzZVxyXG4gICAgICogcXVlc3RvIG9nZ2V0dG8gaGEgYXR0aXZvIGNoZWNrQ29sbGlzaW9uXHJcbiAgICAgKiBAcGFyYW0gb2JqIEdhbWVPYmplY3QgdG9jY2F0b1xyXG4gICAgICovXHJcbiAgICBvbkNvbGxpc2lvbihvYmo6IEdhbWVPYmplY3Qpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3RlbmVyIGVzZWd1aXRvIHF1YW5kbyBzaSByaWNldmUgdW4gbWVzc2FnZ2lvIGRhbCBwb29sXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBOb21lIGRlbCBtZXNzYWdnaW9cclxuICAgICAqL1xyXG4gICAgb25NZXNzYWdlUmVjZWl2ZWQobWVzc2FnZTogc3RyaW5nKXtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBPdHRpZW5lIGxvIHNwcml0ZSBkaSBxdWVzdG8gZ2FtZU9iamVjdFxyXG4gICAgICovXHJcbiAgICBnZXRTcHJpdGUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5zcHJpdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSaW11b3ZlIHF1ZXN0byBvZ2dldHRvIGRhbCBwb29sLCBkaXN0cnVnZ2VuZG9sb1xyXG4gICAgICovXHJcbiAgICBkZXN0cm95KCl7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbC5yZW1vdmVHYW1lT2JqZWN0QnlJZCh0aGlzLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERFVkUgRVNTRVJFIENISUFNQVRPIFNPTE8gREEgR0FNRU9CSkVDVFBPT0xcclxuICAgICAqIEBwYXJhbSBwb29sIElzdGFuemEgZGkgR2FtZU9iamVjdFBvb2xcclxuICAgICAqL1xyXG4gICAgc2V0R2FtZU9iamVjdFBvb2wocG9vbDogR2FtZU9iamVjdFBvb2wpe1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdFBvb2wgPSBwb29sO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5kaWNhIHNlIGRldmUgZXNzZXJlIGNvbnNpZGVyYXRvIGRhZ2xpIG9nZ2V0dGkgY29uIGNoZWNrQ29sbGlzaW9uXHJcbiAgICAgKi9cclxuICAgIGlzQ29sbGlkYWJsZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbGxpZGFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbmRpY2Egc2UgaWwgbGlzdGVuZXIgZGVsbGEgY29sbGlzaW9uZSBkZXZlIGVzc2VyZSBhdHRpdmF0byBxdWFuZG9cclxuICAgICAqIHNpIHRvY2Nhbm8gZ2FtZU9iamVjdCBjb24gY29sbGlkYWJsZVxyXG4gICAgICovXHJcbiAgICBzaG91bGRDaGVja0NvbGxpc2lvbigpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoZWNrQ29sbGlzaW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXNlZ3VlIHVuYSBjYWxsYmFjayBvIHBpw7kgY2FsbGJhY2sgc2Vjb25kbyB1biB0ZW1wbyBzcGVjaWZpY2F0b1xyXG4gICAgICogQHBhcmFtIGNsb2NrUGFyYW1zIEFyZ29tZW50aSB0aW1lclxyXG4gICAgICovXHJcbiAgICBhZGRUaW1lcihjbG9ja1BhcmFtczogQ2xvY2tQYXJhbXMpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLmFkZFRpbWVyKGNsb2NrUGFyYW1zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJpbXVvdmUgdW4gdGltZXIgcHJlY2VkZW50ZW1lbnRlIGltcG9zdGF0b1xyXG4gICAgICogQHBhcmFtIHBhcmFtMCBpZCBvIGdydXBwbyBkZWwgdGltZXJcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlVGltZXIoe2lkLCBncm91cH06IGFueSl7XHJcbiAgICAgICAgaWYgKGlkKSB0aGlzLnRpbWVyUG9vbC5yZW1vdmVUaW1lcihpZCk7XHJcbiAgICAgICAgZWxzZSBpZiAoZ3JvdXApIHRoaXMudGltZXJQb29sLnJlbW92ZVRpbWVyQnlHcm91cChncm91cCk7XHJcbiAgICAgICAgZWxzZSBjb25zb2xlLndhcm4oXCJUZW50YXRvIGRpIHJpbXVvdmVyZSB1biB0aW1lciBjb24gXCIsIGlkLCBncm91cClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnRpbnVhIGFkIGVzZWd1aXJlIHVuYSBvIHBpw7kgY2FsbGJhY2sgc2Vjb25kbyB1biB0ZW1wbyBzcGVjaWZpY2F0b1xyXG4gICAgICogQHBhcmFtIGNsb2NrUGFyYW1zICAgQXJnb21lbnRpIHRpbWVyXHJcbiAgICAgKiBAcGFyYW0gbmFtZSAgICAgICAgICBOb21lIExvb3BcclxuICAgICAqL1xyXG4gICAgYWRkTG9vcChjbG9ja1BhcmFtczogQ2xvY2tQYXJhbXMsIG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wuYWRkTG9vcChjbG9ja1BhcmFtcywgbmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcnJvbXBlIHVuIGxvb3AgcHJlY2VkZW50ZW1lbnRlIGltcG9zdGF0b1xyXG4gICAgICogQHBhcmFtIG5hbWUgICAgICBOb21lIGxvb3BcclxuICAgICAqL1xyXG4gICAgcmVtb3ZlTG9vcChuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMudGltZXJQb29sLnJlbW92ZUxvb3AobmFtZSk7XHJcbiAgICB9XHJcblxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2NsYXNzZXMvZ2FtZU9iamVjdC50cyIsImltcG9ydCBHYW1lU3RhdGUgZnJvbSBcIi4uL2NsYXNzZXMvZ2FtZVN0YXRlXCI7XHJcbmltcG9ydCBjb25zdGFudHMgZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xyXG5cclxuLyoqXHJcbiAqIFN0YXRvIGRpIGNhcmljYW1lbnRvXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb2FkaW5nU3RhdGUgZXh0ZW5kcyBHYW1lU3RhdGUge1xyXG5cclxuICAgIC8vVE9ETyBxdWkgdmEgYW5jaGUgaWwgY2FyaWNhbWVudG8gZGkgYXVkaW9NYW5hZ2VyXHJcbiAgICBcclxuICAgIC8qKiBUZXN0byBkaSBjYXJpY2FtZW50byAqL1xyXG4gICAgcHJpdmF0ZSBsb2FkaW5nVGV4dDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgY29yZX06IGFueSl7XHJcbiAgICAgICAgc3VwZXIoe25hbWUsIGNvcmV9KTtcclxuICAgICAgICAvL3RoaXMubG9hZGluZ1RleHQgPSBuZXcgVGV4dChcIlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVudGVyKCl7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nVGV4dCA9IG5ldyB0aGlzLmNvcmUuUElYSS5UZXh0KFwiXCIsIHtcclxuICAgICAgICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgICAgICAgIGZpbGw6IFsnI2ZmZmZmZiddXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nVGV4dC54ID0gMDtcclxuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0LnkgPSAwO1xyXG4gICAgICAgIHRoaXMuY29yZS5hcHAuc3RhZ2UuYWRkQ2hpbGQodGhpcy5sb2FkaW5nVGV4dCk7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEFzc2V0cygpO1xyXG4gICAgICAgIC8vdGhpcy5jb3JlLmFwcC5zdGFnZS5hZGRDaGlsZCh0aGlzLmxvYWRpbmdUZXh0KTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBvbkV4aXQoKXtcclxuICAgICAgICB0aGlzLmNvcmUuYXBwLnN0YWdlLnJlbW92ZUNoaWxkKHRoaXMubG9hZGluZ1RleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YTogbnVtYmVyKXtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRBc3NldHMoKXtcclxuICAgICAgICBsZXQgYXNzZXRzVG9Mb2FkIDogYW55W10gPSBbXTtcclxuXHJcbiAgICAgICAgLy9DYXJpY2FtZW50byBzcHJpdGUgZ2lvY2F0b3JlXHJcbiAgICAgICAgYXNzZXRzVG9Mb2FkLnB1c2goY29uc3RhbnRzLnNwcml0ZVBhdGggKyBjb25zdGFudHMucGxheWVyU3ByaXRlKTtcclxuXHJcbiAgICAgICAgLy9DYXJpY2FtZW50byBzcHJpdGUgZ2VuZXJhbGlcclxuICAgICAgICBjb25zdGFudHMub2JqZWN0U3ByaXRlcy5mb3JFYWNoKHggPT4gYXNzZXRzVG9Mb2FkLnB1c2goY29uc3RhbnRzLnNwcml0ZVBhdGggKyB4KSlcclxuXHJcbiAgICAgICAgLy9DYXJpY2FtZW50byBhdWRpb1xyXG4gICAgICAgIGNvbnN0YW50cy5hdWRpby5mb3JFYWNoKHggPT4gYXNzZXRzVG9Mb2FkLnB1c2goY29uc3RhbnRzLmF1ZGlvUGF0aCArIHgpKVxyXG5cclxuICAgICAgICB0aGlzLmNvcmUuUElYSS5sb2FkZXIuYWRkKGFzc2V0c1RvTG9hZCwge2Nyb3NzT3JpZ2luOiAnYW5vbnltb3VzJ30pXHJcbiAgICAgICAgLm9uKFwicHJvZ3Jlc3NcIiwgdGhpcy5sb2FkUHJvZ3Jlc3NIYW5kbGVyLmJpbmQodGhpcykpXHJcbiAgICAgICAgLmxvYWQodGhpcy5vbkFzc2V0c0xvYWRlZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGxvYWRQcm9ncmVzc0hhbmRsZXIobG9hZGVyOiBhbnksIHJlc291cmNlOiBhbnkpe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJDYXJpY2F0b1wiLCByZXNvdXJjZSwgbG9hZGVyLnByb2dyZXNzKTtcclxuICAgICAgICB0aGlzLmxvYWRpbmdUZXh0LnNldFRleHQobG9hZGVyLnByb2dyZXNzICsgXCIlXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgb25Bc3NldHNMb2FkZWQoKXtcclxuICAgICAgICB0aGlzLmNvcmUuY2hhbmdlU3RhdGUoXCJsZXZlbFwiLCB7fSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc3RhdGVzL2xvYWRpbmdTdGF0ZS50cyIsImltcG9ydCBUaW1lclBvb2wgZnJvbSBcIi4vdGltZXJQb29sXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUaW1lciB7XHJcblxyXG4gICAgcHJpdmF0ZSB0aW1lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRpbWVyUG9vbDogVGltZXJQb29sO1xyXG5cclxuICAgIHByaXZhdGUgdGltZXJzOiBudW1iZXJbXTtcclxuICAgIHByaXZhdGUgY2FsbGJhY2tzOiAoKCkgPT4gdm9pZClbXTtcclxuXHJcbiAgICByZWFkb25seSBpZDogbnVtYmVyO1xyXG4gICAgcmVhZG9ubHkgZ3JvdXA6IHN0cmluZztcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7aWQsIHRpbWVyUG9vbCwgZ3JvdXAgPSBudWxsfTogYW55LCBhY3Rpb25zQXJyYXk6IFtudW1iZXIsICgpID0+IHZvaWRdW10pe1xyXG4gICAgICAgIHRoaXMudGltZXJzID0gYWN0aW9uc0FycmF5Lm1hcCh4ID0+IHhbMF0pO1xyXG4gICAgICAgIHRoaXMuY2FsbGJhY2tzID0gYWN0aW9uc0FycmF5Lm1hcCh4ID0+IHhbMV0pO1xyXG4gICAgICAgIHRoaXMudGltZSA9IHRoaXMudGltZXJzLnNoaWZ0KCk7XHJcbiAgICAgICAgdGhpcy50aW1lclBvb2wgPSB0aW1lclBvb2w7XHJcbiAgICAgICAgdGhpcy5pZCA9IENvcmUuZ2VuZXJhdGVJZCgpO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEpe1xyXG4gICAgICAgIHRoaXMudGltZSAtPSBkZWx0YTtcclxuICAgICAgICBpZiAodGhpcy50aW1lIDw9IDApe1xyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5zaGlmdCgpKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVycy5sZW5ndGgpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vU290dHJhZ2dvIGlsIHRlbXBvIGNoZSDDqCBhbmRhdG8gc290dG8gbG8gMFxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IHRoaXMudGltZTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZSA9IHRoaXMudGltZXJzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWUgLT0gZGlmZmVyZW5jZTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVyUG9vbC5yZW1vdmVUaW1lcih0aGlzLmlkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy90aW1lci50cyIsImltcG9ydCBUaW1lclBvb2wgZnJvbSBcIi4vdGltZXJQb29sXCI7XHJcbmltcG9ydCBDb3JlIGZyb20gXCIuLi9jb3JlXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMb29wIHtcclxuXHJcbiAgICBwcml2YXRlIHRpbWVyczogbnVtYmVyW107XHJcbiAgICBwcml2YXRlIGNhbGxiYWNrczogKCgpID0+IHZvaWQpW107XHJcblxyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcclxuICAgIHJlYWRvbmx5IGdyb3VwOiBzdHJpbmc7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50VGltZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50SW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgZ3JvdXAgPSBudWxsfTogYW55LCBhY3Rpb25zQXJyYXk6IFtudW1iZXIsICgpID0+IHZvaWRdW10pe1xyXG4gICAgICAgIHRoaXMuaWQgPSBDb3JlLmdlbmVyYXRlSWQoKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcclxuICAgICAgICB0aGlzLnRpbWVycyA9IGFjdGlvbnNBcnJheS5tYXAoeCA9PiB4WzBdKTtcclxuICAgICAgICB0aGlzLmNhbGxiYWNrcyA9IGFjdGlvbnNBcnJheS5tYXAoeCA9PiB4WzFdKTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbmRleCA9IDA7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VGltZSA9IHRoaXMudGltZXJzW3RoaXMuY3VycmVudEluZGV4XTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudFRpbWUgLT0gZGVsdGE7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFRpbWUgPD0gMCl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzW3RoaXMuY3VycmVudEluZGV4XSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5kZXggPSAodGhpcy5jdXJyZW50SW5kZXggKyAxKSAlIHRoaXMuY2FsbGJhY2tzLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIC8vU290dHJhZ2dvIGlsIHRlbXBvIGNoZSDDqCBhbmRhdG8gc290dG8gbG8gMFxyXG4gICAgICAgICAgICBsZXQgcmVzdGFydCA9IHRoaXMudGltZXJzW3RoaXMuY3VycmVudEluZGV4XTtcclxuICAgICAgICAgICAgcmVzdGFydCAtPSB0aGlzLmN1cnJlbnRUaW1lO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRUaW1lID0gcmVzdGFydDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9sb29wLnRzIiwiaW1wb3J0IEdhbWVTdGF0ZSBmcm9tIFwiLi4vY2xhc3Nlcy9nYW1lU3RhdGVcIjtcclxuaW1wb3J0IEdhbWVPYmplY3RQb29sIGZyb20gJy4vLi4vY2xhc3Nlcy9nYW1lT2JqZWN0UG9vbCc7XHJcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4uL2dhbWVPYmplY3RzL3BsYXllclwiO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbXBvcnQgV2FsbCBmcm9tIFwiLi4vZ2FtZU9iamVjdHMvd2FsbFwiO1xyXG5pbXBvcnQgVGltZXJQb29sIGZyb20gXCIuLi9jbGFzc2VzL3RpbWVyUG9vbFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGV2ZWxTdGF0ZSBleHRlbmRzIEdhbWVTdGF0ZSB7XHJcblxyXG4gICAgcHJpdmF0ZSBnYW1lT2JqZWN0UG9vbDogR2FtZU9iamVjdFBvb2w7XHJcblxyXG4gICAgcHJpdmF0ZSBmaXJzdE1vdmluZzogbnVtYmVyO1xyXG5cclxuICAgIHByaXZhdGUgcGxheWVyOiBQbGF5ZXI7XHJcblxyXG4gICAgc3VidGl0bGVUZXh0OiBhbnk7XHJcbiAgICBoZWFsdGhUZXh0OiBhbnk7XHJcblxyXG4gICAgLy9UT0RPIFVSR0VOVEUgRkFJIENIRSBUVVRUSSBHTEkgT0dHRVRUSSBESSBVTk8gU1RBVE8gU09OTyBERU5UUk8gVU4gQ09OVEFJTkVSIERJIFBJWElcclxuICAgIC8vRSBUUk9WQSBBTkNIRSBVTiBNT0RPIFBFUiBHRVNUSVJFIExPIFogSU5ERVhcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgY29yZX06IGFueSl7XHJcbiAgICAgICAgc3VwZXIoe25hbWUsIGNvcmV9KTtcclxuICAgICAgICB0aGlzLmdhbWVPYmplY3RQb29sID0gbmV3IEdhbWVPYmplY3RQb29sKHtjb3JlOiB0aGlzLmNvcmV9KTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluaXRUZXh0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuZmlyc3RNb3ZpbmcgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRUZXh0KCl7XHJcbiAgICAgICAgdGhpcy5zdWJ0aXRsZVRleHQgPSBuZXcgdGhpcy5jb3JlLlBJWEkuVGV4dCgnJywge1xyXG4gICAgICAgICAgICBmaWxsOiBbJyNmZmZmZmYnXSxcclxuICAgICAgICAgICAgd29yZFdyYXA6IHRydWUsXHJcbiAgICAgICAgICAgIHdvcmRXcmFwV2lkdGg6IDM5MCxcclxuICAgICAgICAgICAgYnJlYWtXb3JkczogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LnggPSAyMDY7XHJcbiAgICAgICAgdGhpcy5zdWJ0aXRsZVRleHQueSA9IDY5MDtcclxuICAgICAgICB0aGlzLnN1YnRpdGxlVGV4dC56SW5kZXggPSAtMTAwO1xyXG4gICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LmFuY2hvci5zZXQoMC41KTtcclxuICAgICAgICB0aGlzLmNvcmUuYXBwLnN0YWdlLmFkZENoaWxkKHRoaXMuc3VidGl0bGVUZXh0KTtcclxuXHJcbiAgICAgICAgdGhpcy5oZWFsdGhUZXh0ID0gbmV3IHRoaXMuY29yZS5QSVhJLlRleHQoXCJcIiwge1xyXG4gICAgICAgICAgICBmaWxsOiBbJyNmZmZmZmYnXVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5jb3JlLmFwcC5zdGFnZS5hZGRDaGlsZCh0aGlzLmhlYWx0aFRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW50ZXIoKXtcclxuICAgICAgICBzdXBlci5vbkVudGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHBsYXllclNwcml0ZSA9IFV0aWxzLmNyZWF0ZVNwcml0ZSh0aGlzLmNvcmUsIGNvbnN0YW50cy5wbGF5ZXJTcHJpdGUpXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKHtuYW1lOiBcInBsYXllclwiLCBjb3JlOiB0aGlzLmNvcmUsIHg6IDE3OCwgeTogNjAwLCBzcHJpdGU6IHBsYXllclNwcml0ZSwgbGV2ZWxTdGF0ZTogdGhpc30pXHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbC5hZGRHYW1lT2JqZWN0KHRoaXMucGxheWVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5hZGRUaW1lcih7XHJcbiAgICAgICAgICAgIHRpbWU6IDE4MCxcclxuICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VidGl0bGVUZXh0LnNldFRleHQoXCJUcmFzY2luYW1pXCIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpcnN0TW92aW5nID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIG9uRXhpdCgpe1xyXG4gICAgICAgIHN1cGVyLm9uRXhpdCgpO1xyXG4gICAgICAgIHRoaXMuZ2FtZU9iamVjdFBvb2wuY2xlYXJQb29sKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlKGRlbHRhOiBudW1iZXIpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YSk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbC51cGRhdGVQb29sKGRlbHRhKTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpe1xyXG4gICAgICAgIHN1cGVyLnJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25QbGF5ZXJNb3ZpbmcoKXtcclxuICAgICAgICBpZiAodGhpcy5maXJzdE1vdmluZyA9PT0gMSl7XHJcbiAgICAgICAgICAgIHRoaXMuZmlyc3RNb3ZpbmcgPSAyO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXJ0TGV2ZWwoKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdGFydExldmVsKCl7XHJcbiAgICAgICAgdGhpcy5zdWJ0aXRsZVRleHQuc2V0VGV4dChcIlwiKTtcclxuICAgICAgICB0aGlzLmNvcmUuYXVkaW9NYW5hZ2VyLnBsYXlBdWRpbyhcImhvd0RvWW91S25vdy5vZ2dcIiwge1xyXG4gICAgICAgICAgICB2b2x1bWU6IDAuNzVcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnBsYXllci51cGRhdGVVSSgpO1xyXG4gICAgICAgIHRoaXMuYWRkVGltZXIoe1xyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICBbNjAgKiA2LjUsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvcmUuYXVkaW9NYW5hZ2VyLnBsYXlBdWRpbyhcInJhZ2dpb1NhbGFtZS5vZ2dcIiwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmRDYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdWJ0aXRsZVRleHQuc2V0VGV4dChcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLnNwZWFrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZExvb3Aoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnNwYXduV2FsbDEoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lOiAzNVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXCJsb29wMVwiKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgICAgICAgWzYwICogMC41LCAoKSA9PiB0aGlzLnN1YnRpdGxlVGV4dC5zZXRUZXh0KFwiRmluaXNjaSBpbCBzYWxhbWUhXCIpXSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDQyLCAoKSA9PiB0aGlzLnJlbW92ZUxvb3AoXCJsb29wMVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiA0LCAoKSA9PiB0aGlzLmFkZExvb3Aoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5zcGF3bldhbGwyKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbWU6IDM1XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgXCJsb29wMlwiKVxyXG4gICAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDQyLCAoKSA9PiB0aGlzLnJlbW92ZUxvb3AoXCJsb29wMlwiKV0sXHJcbiAgICAgICAgICAgICAgICBbNjAgKiAyLCAoKSA9PiB0aGlzLmFkZExvb3Aoe1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKSA9PiB0aGlzLnNwYXduV2FsbDMoKSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiAxMjBcclxuICAgICAgICAgICAgICAgIH0sIFwibG9vcDNcIildLFxyXG4gICAgICAgICAgICAgICAgWzYwICogMzcsICgpID0+IHRoaXMucmVtb3ZlTG9vcChcImxvb3AzXCIpXSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDEsICgpID0+IHRoaXMuc3Bhd25XYWxsNCgpXSxcclxuICAgICAgICAgICAgICAgIFs2MCAqIDksICgpID0+IHRoaXMuYWRkTG9vcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogMzAsXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGF3bldhbGwxKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zcGF3bldhbGwyKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCBcImxvb3A0XCIpXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdlbmVyYXRlV2FsbCh4LCB5LCB2ZWxYLCB2ZWxZLCBib3VuY2VYLCBib3VuY2VZLCBpbmNyZW1lbnQsIHNpemUpe1xyXG4gICAgICAgIGNvbnN0IHdhbGxTcHJpdGUgPSBVdGlscy5jcmVhdGVTcHJpdGUodGhpcy5jb3JlLCBcImJsb2NrLnBuZ1wiKVxyXG4gICAgICAgIGNvbnN0IHdhbGwgPSBuZXcgV2FsbCh7XHJcbiAgICAgICAgICAgIG5hbWU6IFwid2FsbFwiLCBcclxuICAgICAgICAgICAgY29yZTogdGhpcy5jb3JlLCBcclxuICAgICAgICAgICAgeCxcclxuICAgICAgICAgICAgeSwgXHJcbiAgICAgICAgICAgIHdpZHRoOiBzaXplLCBcclxuICAgICAgICAgICAgaGVpZ2h0OiBzaXplLCBcclxuICAgICAgICAgICAgc3ByaXRlOiB3YWxsU3ByaXRlLCBcclxuICAgICAgICAgICAgc3BlZWQ6IHt4OiB2ZWxYLCB5OiB2ZWxZfSxcclxuICAgICAgICAgICAgYm91bmNlWCxcclxuICAgICAgICAgICAgYm91bmNlWSxcclxuICAgICAgICAgICAgaW5jcmVtZW50XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5nYW1lT2JqZWN0UG9vbC5hZGRHYW1lT2JqZWN0KHdhbGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc3Bhd25XYWxsMShhZ2Fpbj86IGJvb2xlYW4pe1xyXG4gICAgICAgIGNvbnN0IHBvc2l0aW9uID0gfn4oTWF0aC5yYW5kb20oKSAqIDYpO1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVXYWxsKHBvc2l0aW9uICogNjQsIC02NCwgMCwgOCwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgNjQpO1xyXG4gICAgICAgIGlmIChhZ2FpbiA9PT0gZmFsc2UpIHJldHVybjtcclxuICAgICAgICBpZiAoTWF0aC5yYW5kb20oKSA8IDAuNCkgdGhpcy5zcGF3bldhbGwxKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwYXduV2FsbDIoYWdhaW4/OiBib29sZWFuKXtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IH5+KE1hdGgucmFuZG9tKCkgKiA2KTtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlV2FsbChwb3NpdGlvbiAqIDY0LCA3MzIgKyA2NCwgMCwgLTgsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIDY0KTtcclxuICAgICAgICBpZiAoYWdhaW4gPT09IGZhbHNlKSByZXR1cm47XHJcbiAgICAgICAgaWYgKE1hdGgucmFuZG9tKCkgPCAwLjQpIHRoaXMuc3Bhd25XYWxsMihmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzcGF3bldhbGwzKCl7XHJcbiAgICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgPiAwLjUgPyAtMTI4IDogNzMyICsgMTI4O1xyXG4gICAgICAgIHRoaXMuZ2VuZXJhdGVXYWxsKFxyXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogKDQxMiAtIDEyOCksXHJcbiAgICAgICAgICAgIHksXHJcbiAgICAgICAgICAgIDgsXHJcbiAgICAgICAgICAgIHkgPiAwID8gLTQgOiA0LFxyXG4gICAgICAgICAgICB0cnVlLFxyXG4gICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgIDEyOFxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNwYXduV2FsbDQoKXtcclxuICAgICAgICB0aGlzLmdlbmVyYXRlV2FsbChcclxuICAgICAgICAgICAgLTEyOCxcclxuICAgICAgICAgICAgLTEyOCxcclxuICAgICAgICAgICAgNixcclxuICAgICAgICAgICAgNixcclxuICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICB0cnVlLFxyXG4gICAgICAgICAgICAxMjhcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zdGF0ZXMvbGV2ZWxTdGF0ZS50cyIsImltcG9ydCBHYW1lT2JqZWN0IGZyb20gXCIuL2dhbWVPYmplY3RcIjtcclxuaW1wb3J0IENvcmUgZnJvbSBcIi4uL2NvcmVcIjtcclxuaW1wb3J0IFV0aWxzIGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZU9iamVjdFBvb2wge1xyXG5cclxuICAgIHByaXZhdGUgcG9vbDogR2FtZU9iamVjdFtdO1xyXG4gICAgcmVhZG9ubHkgY29yZTogQ29yZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3Ioe2NvcmV9KXtcclxuICAgICAgICB0aGlzLnBvb2wgPSBbXTtcclxuICAgICAgICB0aGlzLmNvcmUgPSBjb3JlO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVBvb2woZGVsdGEpe1xyXG5cclxuICAgICAgICAvL1VwZGF0ZSBkaSB0dXR0aSBpIEdhbWVPYmplY3RcclxuICAgICAgICB0aGlzLnBvb2wuZm9yRWFjaCh4ID0+IHgudXBkYXRlKGRlbHRhKSlcclxuXHJcbiAgICAgICAgLy9DaGVjayBjb2xsaXNpb25lXHJcbiAgICAgICAgY29uc3QgY2FuQ29sbGlkZSA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4LnNob3VsZENoZWNrQ29sbGlzaW9uKCkpO1xyXG4gICAgICAgIGNvbnN0IHBvc3NpYmlsZUNvbGxpc2lvbiA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4LmlzQ29sbGlkYWJsZSgpKTtcclxuICAgICAgICBjYW5Db2xsaWRlLmZvckVhY2god2Fsa2VyID0+IHtcclxuXHJcbiAgICAgICAgICAgIC8vQ29udHJvbGxvIHNlIGwnb2dnZXR0byBpbiBxdWVzdGlvbmUgZGV2ZSBhbmNvcmEgcmljZXZlcmUgY29sbGlzaW9uaVxyXG4gICAgICAgICAgICBpZiAoIXdhbGtlci5zaG91bGRDaGVja0NvbGxpc2lvbigpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICBwb3NzaWJpbGVDb2xsaXNpb24uZm9yRWFjaCh3YWxsID0+IHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL05vbiBjb250cm9sbG8gbGUgY29sbGlzaW9uaSBjb24gbWUgc3Rlc3NvXHJcbiAgICAgICAgICAgICAgICBpZiAod2Fsa2VyID09PSB3YWxsKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgLy9Db250cm9sbG8gc2UgbCdvZ2dldHRvIGluIHF1ZXN0aW9uZSBkZXZlIGFuY29yYSByaWNldmVyZSBjb2xsaXNpb25pXHJcbiAgICAgICAgICAgICAgICBpZiAoIXdhbGtlci5zaG91bGRDaGVja0NvbGxpc2lvbigpKSByZXR1cm47XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2Fsa2VyU3ByaXRlID0gd2Fsa2VyLmdldFNwcml0ZSgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgd2FsbFNwcml0ZSA9IHdhbGwuZ2V0U3ByaXRlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoVXRpbHMuaGl0VGVzdFJlY3RhbmdsZSh3YWxrZXJTcHJpdGUsIHdhbGxTcHJpdGUpKXtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrZXIub25Db2xsaXNpb24od2FsbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhZGRHYW1lT2JqZWN0KG9iajogR2FtZU9iamVjdCl7XHJcbiAgICAgICAgb2JqLnNldEdhbWVPYmplY3RQb29sKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY29yZS5hcHAuc3RhZ2UuYWRkQ2hpbGQob2JqLmdldFNwcml0ZSgpKTtcclxuICAgICAgICB0aGlzLnBvb2wucHVzaChvYmopO1xyXG4gICAgICAgIG9iai5vbkNyZWF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUdhbWVPYmplY3RCeUlkKGlkOiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IHRvUmVtb3ZlID0gdGhpcy5wb29sLmZpbHRlcih4ID0+IHguaWQgPT09IGlkKVswXTtcclxuICAgICAgICBpZiAoIXRvUmVtb3ZlKXtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFwiTmVzc3VuIGdhbWVPYmplY3QgY29uIGlkIFwiICsgaWQgKyBcIiBwcmVzZW50ZSFcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuYXBwLnN0YWdlLnJlbW92ZUNoaWxkKHRvUmVtb3ZlLmdldFNwcml0ZSgpKTtcclxuICAgICAgICAgICAgdG9SZW1vdmUub25EZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9vbCA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4LmlkICE9PSBpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUdhbWVPYmplY3RCeU5hbWUobmFtZTogc3RyaW5nKXtcclxuICAgICAgICBjb25zdCB0b1JlbW92ZSA9IHRoaXMucG9vbC5maWx0ZXIoeCA9PiB4Lm5hbWUgPT0gbmFtZSlbMF07XHJcbiAgICAgICAgaWYgKCF0b1JlbW92ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5lc3N1biBnYW1lT2JqZWN0IGNvbiBub21lIFwiICsgbmFtZSArIFwiIHByZXNlbnRlIVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29yZS5hcHAuc3RhZ2UucmVtb3ZlQ2hpbGQodG9SZW1vdmUuZ2V0U3ByaXRlKCkpO1xyXG4gICAgICAgICAgICB0b1JlbW92ZS5vbkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5wb29sID0gdGhpcy5wb29sLmZpbHRlcih4ID0+IHgubmFtZSAhPSBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJQb29sKCl7XHJcbiAgICAgICAgdGhpcy5wb29sID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGYSByaWNldmVyZSB1biBtZXNzYWdnaW8gYSB0dXR0aSBpIGdhbWVPYmplY3QgXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZSBub21lIG1lc3NhZ2dpb1xyXG4gICAgICovXHJcbiAgICBzZW5kTWVzc2FnZShtZXNzYWdlOiBzdHJpbmcpe1xyXG4gICAgICAgIHRoaXMucG9vbC5mb3JFYWNoKHggPT4geC5vbk1lc3NhZ2VSZWNlaXZlZChtZXNzYWdlKSk7XHJcbiAgICB9XHJcblxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL2dhbWVPYmplY3RQb29sLnRzIiwiaW1wb3J0IEdhbWVPYmplY3QgZnJvbSBcIi4uL2NsYXNzZXMvZ2FtZU9iamVjdFwiO1xyXG5pbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IExldmVsU3RhdGUgZnJvbSBcIi4uL3N0YXRlcy9sZXZlbFN0YXRlXCI7XHJcblxyXG5jbGFzcyBQbGF5ZXJQaHJhc2Uge1xyXG5cclxuICAgIHJlYWRvbmx5IGF1ZGlvTmFtZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgd29yZHNUaW1lOiBudW1iZXJbXTtcclxuICAgIHJlYWRvbmx5IHdvcmRzOiBzdHJpbmdbXTtcclxuXHJcbiAgICAvL1RPRE8gUkVGQUNUT1JJTkcgUEVSQ0hFIEFDQ0VUVEkgVU4gVU5JQ08gQVJSQVlcclxuICAgIGNvbnN0cnVjdG9yKGF1ZGlvTmFtZTogc3RyaW5nLCB3b3Jkczogc3RyaW5nW10sIHdvcmRzVGltZTogbnVtYmVyW10pe1xyXG4gICAgICAgIHRoaXMuYXVkaW9OYW1lID0gYXVkaW9OYW1lO1xyXG4gICAgICAgIHRoaXMud29yZHMgPSB3b3JkcztcclxuICAgICAgICB0aGlzLndvcmRzVGltZSA9IHdvcmRzVGltZTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBsYXllciBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG5cclxuICAgIHByaXZhdGUgbGV2ZWxTdGF0ZTogTGV2ZWxTdGF0ZTtcclxuXHJcbiAgICBwcml2YXRlIHRvdWNoRGF0YTogYW55O1xyXG4gICAgcHJpdmF0ZSB0b3VjaERyYWdnaW5nOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgaGVhbHRoOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHBocmFzZUJvb2s6IFBsYXllclBocmFzZVtdO1xyXG4gICAgcHJpdmF0ZSBoYXJtUGhyYXNlQm9vazogUGxheWVyUGhyYXNlW107XHJcblxyXG4gICAgLy9UT0RPIHNhcmViYmUgZGF2dmVybyBmaWdvIHJ1b3RhcmUgaW4gYmFzZSBhbGxhIGRpcmV6aW9uZSBkZWxsIHhcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgY29yZSwgeCwgeSwgc3ByaXRlLCBsZXZlbFN0YXRlfSl7XHJcbiAgICAgICAgc3VwZXIoe25hbWUsIGNvcmUsIHgsIHksIHNwcml0ZSwgd2lkdGg6IGNvbnN0YW50cy5wbGF5ZXJTaXplLCBoZWlnaHQ6IGNvbnN0YW50cy5wbGF5ZXJTaXplfSk7XHJcbiAgICAgICAgdGhpcy5sZXZlbFN0YXRlID0gbGV2ZWxTdGF0ZTtcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IGNvbnN0YW50cy5wbGF5ZXJEZWZhdWx0SGVhbHRoO1xyXG4gICAgICAgIHRoaXMucGhyYXNlQm9vayA9IHRoaXMuaW5pdFBocmFzZUJvb2soKTtcclxuICAgICAgICB0aGlzLmhhcm1QaHJhc2VCb29rID0gdGhpcy5pbml0SGFybVBocmFzZUJvb2soKTtcclxuICAgICAgICB0aGlzLmFkZFRvdWNoQ29udHJvbHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNyZWF0ZSgpe1xyXG4gICAgICAgIHN1cGVyLm9uQ3JlYXRlKCk7XHJcbiAgICAgICAgLyp0aGlzLmFkZFRpbWVyKCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5hZGRMb29wKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNvdW5kID0gdGhpcy5jb3JlLlBJWEkuc291bmQuU291bmQuZnJvbShjb25zdGFudHMuYXVkaW9Ub0xvYWRbMF0ucGF0aCk7XHJcbiAgICAgICAgICAgICAgICBzb3VuZC5wbGF5KCk7XHJcbiAgICAgICAgICAgIH0sIFwibG9vcEJhc2VcIiwgNjApO1xyXG4gICAgICAgIH0sIDMwMCk7Ki9cclxuICAgICAgICAvKnRoaXMuYWRkTG9vcCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29yZS5hdWRpb01hbmFnZXIucGxheUF1ZGlvKFwicmFnZ2lvVW9cIiwgXCJyYWdnaW9cIik7XHJcbiAgICAgICAgfSwgXCJ0ZXN0XCIsIDYwKTsqL1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIHN1cGVyLm9uRGVzdHJveSgpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRGlzdHJ1dHRvIVwiKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGUoZGVsdGEpe1xyXG4gICAgICAgIHN1cGVyLnVwZGF0ZShkZWx0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24ob2JqOiBHYW1lT2JqZWN0KXtcclxuICAgICAgICBzdXBlci5vbkNvbGxpc2lvbihvYmopO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ29scGl0byBkYSBcIiwgb2JqKVxyXG4gICAgICAgIHRoaXMuZGFtYWdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZGFtYWdlKCl7XHJcbiAgICAgICAgdGhpcy5oZWFsdGggLS07XHJcbiAgICAgICAgdGhpcy51cGRhdGVVSSgpO1xyXG4gICAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFkZExvb3Aoe1xyXG4gICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICBbNSwgKCkgPT4gdGhpcy5zcHJpdGUuYWxwaGEgPSAwXSxcclxuICAgICAgICAgICAgICAgIFs1LCAoKSA9PiB0aGlzLnNwcml0ZS5hbHBoYSA9IDFdXHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LCBcInJlc3Bhd25cIilcclxuICAgICAgICB0aGlzLmFkZFRpbWVyKHtcclxuICAgICAgICAgICAgdGltZTogY29uc3RhbnRzLnBsYXllclJlc3Bhd25UaW1lLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMb29wKFwicmVzcGF3blwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3ByaXRlLmFscGhhID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tDb2xsaXNpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBncm91cDogXCJyZXNwYXduXCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIHRoaXMuc3BlYWsodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRUb3VjaENvbnRyb2xzKCl7XHJcbiAgICAgICAgdGhpcy5zcHJpdGUuaW50ZXJhY3RpdmUgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlXHJcbiAgICAgICAgLm9uKCdtb3VzZWRvd24nLCB0aGlzLm9uRHJhZ1N0YXJ0LmJpbmQodGhpcykpXHJcbiAgICAgICAgLm9uKCd0b3VjaHN0YXJ0JywgdGhpcy5vbkRyYWdTdGFydC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbignbW91c2V1cCcsIHRoaXMub25EcmFnRW5kLmJpbmQodGhpcykpXHJcbiAgICAgICAgLm9uKCdtb3VzZXVwb3V0c2lkZScsIHRoaXMub25EcmFnRW5kLmJpbmQodGhpcykpXHJcbiAgICAgICAgLm9uKCd0b3VjaGVuZCcsIHRoaXMub25EcmFnRW5kLmJpbmQodGhpcykpXHJcbiAgICAgICAgLm9uKCd0b3VjaGVuZG91dHNpZGUnLCB0aGlzLm9uRHJhZ0VuZC5iaW5kKHRoaXMpKVxyXG4gICAgICAgIC5vbignbW91c2Vtb3ZlJywgdGhpcy5vbkRyYWdNb3ZlLmJpbmQodGhpcykpXHJcbiAgICAgICAgLm9uKCd0b3VjaG1vdmUnLCB0aGlzLm9uRHJhZ01vdmUuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBvbkRyYWdTdGFydChldmVudCl7XHJcbiAgICAgICAgdGhpcy50b3VjaERhdGEgPSBldmVudC5kYXRhO1xyXG4gICAgICAgIHRoaXMudG91Y2hEcmFnZ2luZyA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHByaXZhdGUgb25EcmFnRW5kKCl7XHJcbiAgICAgICAgdGhpcy50b3VjaERyYWdnaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy50b3VjaERhdGEgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9uRHJhZ01vdmUoKXtcclxuICAgICAgICBpZiAodGhpcy50b3VjaERyYWdnaW5nKXtcclxuICAgICAgICAgICAgdmFyIG5ld1Bvc2l0aW9uID0gdGhpcy50b3VjaERhdGEuZ2V0TG9jYWxQb3NpdGlvbih0aGlzLnNwcml0ZS5wYXJlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZS5wb3NpdGlvbi54ID0gbmV3UG9zaXRpb24ueCAtIHRoaXMuc3ByaXRlLndpZHRoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGUucG9zaXRpb24ueSA9IG5ld1Bvc2l0aW9uLnkgLSB0aGlzLnNwcml0ZS5oZWlnaHQgLyAyO1xyXG4gICAgICAgICAgICB0aGlzLmxldmVsU3RhdGUub25QbGF5ZXJNb3ZpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVUkoKXtcclxuICAgICAgICB0aGlzLmxldmVsU3RhdGUuaGVhbHRoVGV4dC5zZXRUZXh0KHRoaXMuaGVhbHRoKTtcclxuICAgIH1cclxuXHJcbiAgICBzcGVhayhoYXJtPzogYm9vbGVhbil7XHJcblxyXG5cclxuICAgICAgICAvL1ppdHRpc2NvIGZyYXNpIHByZWNlZGVudGVtZW50ZSBpbiBlc2VjdXppb25lXHJcbiAgICAgICAgdGhpcy5yZW1vdmVUaW1lcih7Z3JvdXA6IFwicmFnZ2lvXCJ9KTtcclxuICAgICAgICB0aGlzLmxldmVsU3RhdGUuc3VidGl0bGVUZXh0LnNldFRleHQoXCJcIik7XHJcblxyXG4gICAgICAgIGxldCB0b1NheTtcclxuICAgICAgICBpZiAoIWhhcm0pIHRvU2F5ID0gdGhpcy5waHJhc2VCb29rW35+KE1hdGgucmFuZG9tKCkgKiB0aGlzLnBocmFzZUJvb2subGVuZ3RoKV07XHJcbiAgICAgICAgZWxzZSB0b1NheSA9IHRoaXMuaGFybVBocmFzZUJvb2tbfn4oTWF0aC5yYW5kb20oKSAqIHRoaXMuaGFybVBocmFzZUJvb2subGVuZ3RoKV07XHJcbiAgICAgICAgLy9jb25zdCB0b1NheSA9IHRoaXMucGhyYXNlQm9va1t0aGlzLnBocmFzZUJvb2subGVuZ3RoIC0gMV07XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5jb3JlLmF1ZGlvTWFuYWdlci5wbGF5QXVkaW8odG9TYXkuYXVkaW9OYW1lLCB7XHJcbiAgICAgICAgICAgIGVuZENhbGxiYWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZVRpbWVyKHtncm91cDogXCJyYWdnaW9cIn0pXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxldmVsU3RhdGUuc3VidGl0bGVUZXh0LnNldFRleHQoXCJcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRpbWVyKHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4gdGhpcy5zcGVhaygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IE1hdGgucmFuZG9tKCkgKiAxNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXA6IFwicmFnZ2lvXCJcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0cmluZ0lkOiBcInJhZ2dpb1wiXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgbGV0IGNhbGxiYWNrcyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9TYXkud29yZHMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjYWxsYmFja3MucHVzaChbdG9TYXkud29yZHNUaW1lW2ldLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxldmVsU3RhdGUuc3VidGl0bGVUZXh0LnNldFRleHQodG9TYXkud29yZHNbaV0pXHJcbiAgICAgICAgICAgIH1dKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5hZGRUaW1lcih7XHJcbiAgICAgICAgICAgIGFjdGlvbnM6IGNhbGxiYWNrcyxcclxuICAgICAgICAgICAgZ3JvdXA6IFwicmFnZ2lvXCJcclxuICAgICAgICB9KVxyXG4gICAgICAgIC8qdGhpcy5hZGRUaW1lcih7XHJcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcclxuICAgICAgICAgICAgICAgIFsyMDAsICgpID0+IGNvbnNvbGUubG9nKFwiIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiBjb25zb2xlLmxvZyhcIiEhXCIpXSxcclxuICAgICAgICAgICAgICAgIFsyMDAsICgpID0+IGNvbnNvbGUubG9nKFwiISEhXCIpXSxcclxuICAgICAgICAgICAgICAgIFsyMDAsICgpID0+IGNvbnNvbGUubG9nKFwiISEhIVwiKV0sXHJcbiAgICAgICAgICAgICAgICBbMjAwLCAoKSA9PiBjb25zb2xlLmxvZyhcIiEhISEhXCIpXSxcclxuICAgICAgICAgICAgICAgIFsyMDAsICgpID0+IHRoaXMuZGVzdHJveSgpXVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBpbml0UGhyYXNlQm9vaygpOiBQbGF5ZXJQaHJhc2VbXXtcclxuICAgICAgICBjb25zdCBwaHJhc2VCb29rID0gW1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQm9vemEub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJCb296YSBib296YSBib296YVwiLCBcImJvb3phIGJvb3phIGJ1elwiXSxcclxuICAgICAgICAgICAgICAgIFswLCA3MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0F1dWF1Lm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQWh1YWFhYWFhb1wiXSxcclxuICAgICAgICAgICAgICAgIFswXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9CcnV0dGVDb3NlLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiTm9uIGRldmkgcGnDuSBkaXJlXCIsIFwicXVlc3RlIGJydXR0ZVwiLCBcImNvc2VlZWVcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgODAsIDEwMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQ2FydGFJZ2llbmljYS5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIkhoaEhtbWhcIiwgXCJjYXJ0YSBpZ2llbmljYWFhYWFhYWFhYWFcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgNzBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0Nvcm9uYXRpLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiQ29yb25hdGkgaWwgY2F6em9vaFwiXSxcclxuICAgICAgICAgICAgICAgIFswXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9Db3RvbGV0dGUub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJUcmUgY290b2xldHRlXCIsIFwiZSBtb3p6YXJlbGxhYVwiLCBcIk9ob2hcIiwgXCJcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgODAsIDEyMCwgMjBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0RlbGZpbmkub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJJIGRlbGZpbmkgZGV2b25vIHNtZXR0ZXJsYVwiLCBcImRpIGlucXVpbmFyZWVlZWVlZWVcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgMTIwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9GaWdsaW9sby5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcIlJpY29yZGEgZmlnbGlvbG9cIiwgXCJsZSBpZGVlXCIsIFwidmVuZ29ubyBjYWdhbmRvXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDgwLCA2MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvRm90b2NlbGx1bGEub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJMYSBmb3RvY2VsbHVsYVwiLCBcIsOoIGZvdHR1dGFhYWhoXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDYwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9IaGhvLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiSGhvb2hcIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvTW90b3JlLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaGhoLi5wZXJjaMOoXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTXdob29vXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIFwiRWggbm8gcGVyY2jDqFwiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIk13aG9vb1wiLCBcclxuICAgICAgICAgICAgICAgICAgICBcIkVlaCBtaCBtaCDwn5iVXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTWggTWggTWhvXCIsIFxyXG4gICAgICAgICAgICAgICAgICAgIFwiT29vaCBPb29oXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPb29vb29vaFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiT29vb29odWFoXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDYwLCA0MCwgNzAsIDYwLCA2MCwgODAsIDgwLCA4MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvTm9uVGlQZXJtZXR0ZXJlLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiTm9uIHRpIHBlcm1ldHRlcmUgZGkgcGFybGFybWkgY29zaSBlaFwiLCBcIk5vbiB0aSBwZXJtZXR0ZXJlXCIsIFwiTm9uIGxvIGZhcmUgcGnDucO5w7nDuVwiXSxcclxuICAgICAgICAgICAgICAgIFswLCAxMjAsIDcwXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9Ob25WZXJvLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiSG0gbXdcIiwgXCJVbyBvb29oXCIsIFwiTm9uIMOoIHZlcm9vb29vb29vb29vb1wiXSxcclxuICAgICAgICAgICAgICAgIFswLCA2MCwgNzBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9SZWJ1cy5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBcIlNjb21ldHRvIGNoZSBub24gc2FpIHJpc29sdmVyZSBxdWVzdG8gcmVidXNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIjUgdm9sdGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNoZSBpIGNoaW9kaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY2Fkb25vIGRhbCBzb2ZmaXR0b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZmFuIHBlciAyIVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiMyw1XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJzZW56YSBkaXZpZGVyZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaWwgbW9sdGlwbGljYW5kbyBwZXIgaWwgZGl2aXNvcmVcIixcclxuICAgICAgICAgICAgICAgICAgICBcIlF1aW5kaSB0dVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwicGVuc2EgY2hlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJsJ2FsdHJvIGdpb3Jub1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaGhoaGhoXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtaSBlcm8gbWVzc28gaWwgZ2VsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJtaSBzb25vIGNhZHV0aSBpIGNhcGVsbGlcIixcclxuICAgICAgICAgICAgICAgICAgICBcImhvIG1vbHRpcGxpY2F0byBwZXIgNCFcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkUgc2FpIGNoZSBtaSDDqCB1c2NpdG8gZnVvcmk/XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJEaSBmYXJlIGxhIGJvcnNhIVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiQmlzb2duYSBkaXZpZGVyZSB0dXR0byBwZXIgMCFcIixcclxuICAgICAgICAgICAgICAgICAgICBcInV1P+KYvGFhXCJcclxuICAgICAgICAgICAgICAgIF0sICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2dlbCAgICAgICAgLy91c2NpdG8gZnVvcmlcclxuICAgICAgICAgICAgICAgIFswLCAxNjAsIDEwMCwgODAsIDEwMCwgMTIwLCAxMDAsIDYwLCAxMjAsIDgwLCA2MCwgNjAsIDUwLCA3MCwgOTAsIDEwMCwgMTAwLCAxMDAsIDEyMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb1NwYXp6YXR1cmEub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJIbSBobSBobVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTCdhbHRybyBnaW9ybm9cIixcclxuICAgICAgICAgICAgICAgICAgICBcInN0YXZvXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJwdWxlbmRvIGxhIHNwYXp6YXR1cmFcIixcclxuICAgICAgICAgICAgICAgICAgICBcInBlcsOyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCLDqCBhcnJpdmF0b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiTXIuR2lnaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZSBoYSBkZXR0b1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiXFxcIk1hIHZhZmZhbmN1bG9cXFwiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJoaGhvaFwiXHJcbiAgICAgICAgICAgICAgICBdLCAgICAgICAgICAgICAgICAgIC8vYXJyaXZhdG9cclxuICAgICAgICAgICAgICAgIFswLCA4MCwgNzAsIDcwLCA3MCwgNjAsIDEwMCwgODAsIDgwLCAxMDBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9adWNjaGVyby5vZ2dcIixcclxuICAgICAgICAgICAgICAgIFtcclxuICAgICAgICAgICAgICAgICAgICBcIkRvdifDqCBsbyB6dWNjaGVyb29vb29cIlxyXG4gICAgICAgICAgICAgICAgXSwgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIFswXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBcclxuICAgICAgICBdXHJcbiAgICAgICAgcmV0dXJuIHBocmFzZUJvb2s7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEhhcm1QaHJhc2VCb29rKCk6IFBsYXllclBocmFzZVtde1xyXG4gICAgICAgIGNvbnN0IHBocmFzZUJvb2sgPSBbXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb1N0YWlQaXVBdHRlbnRvLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiRWhpIG1hIHN0YSBwacO5IGF0dGVudG9cIixcclxuICAgICAgICAgICAgICAgICAgICBcIm1pIGhhaSBmYXR0byBtYWxlZWVlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkd1YXJkYSBkb3ZlIHZhaVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiR3VhcmRhIGxhIHN0cmFkYWFhYVwiXHJcbiAgICAgICAgICAgICAgICBdLCAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgWzAsIDgwLCA4MCwgNjAsIDYwLCA2MF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvU2JhZ2xpYXRvLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiSGFpIHNiYWdsaWF0b29vb1wiXSxcclxuICAgICAgICAgICAgICAgIFswXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9PdWNoLm9nZ1wiLFxyXG4gICAgICAgICAgICAgICAgW1wiT3VjaFwiLCBcIk91dXV1dXVcIl0sXHJcbiAgICAgICAgICAgICAgICBbMCwgNDBdXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIG5ldyBQbGF5ZXJQaHJhc2UoXHJcbiAgICAgICAgICAgICAgICBcInJhZ2dpb0FhYWgub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJBYWFhYWFhYWFhYWhcIl0sXHJcbiAgICAgICAgICAgICAgICBbMF1cclxuICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgbmV3IFBsYXllclBocmFzZShcclxuICAgICAgICAgICAgICAgIFwicmFnZ2lvQWhpYWEub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJBaGlhYWFhYWFhYWFhYVwiXSxcclxuICAgICAgICAgICAgICAgIFswXVxyXG4gICAgICAgICAgICApLFxyXG4gICAgICAgICAgICBuZXcgUGxheWVyUGhyYXNlKFxyXG4gICAgICAgICAgICAgICAgXCJyYWdnaW9BbW1henpvU2V0dGUub2dnXCIsXHJcbiAgICAgICAgICAgICAgICBbXCJBaGlhISEhXCIsIFwiU2Ugc2JhZ2xpIGFuY29yYSB1bmEgdm9sdGFcIiwgXCJ0aSBhbW1henpvIGluIDchISEhXCJdLFxyXG4gICAgICAgICAgICAgICAgWzAsIDQwLCA2MF1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIF1cclxuICAgICAgICByZXR1cm4gcGhyYXNlQm9vaztcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9nYW1lT2JqZWN0cy9wbGF5ZXIudHMiLCJpbXBvcnQgR2FtZU9iamVjdCBmcm9tIFwiLi4vY2xhc3Nlcy9nYW1lT2JqZWN0XCI7XHJcbmltcG9ydCBjb25zdGFudHMgZnJvbSBcIi4uL2NvbnN0YW50c1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2FsbCBleHRlbmRzIEdhbWVPYmplY3Qge1xyXG5cclxuICAgIHByaXZhdGUgc3BlZWQ7XHJcbiAgICBwcml2YXRlIGJvdW5jZVg7XHJcbiAgICBwcml2YXRlIGJvdW5jZVk7XHJcbiAgICBwcml2YXRlIGluY3JlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgY29yZSwgeCwgeSwgc3ByaXRlLCB3aWR0aCwgaGVpZ2h0LCBzcGVlZCwgYm91bmNlWCwgYm91bmNlWSwgaW5jcmVtZW50fSl7XHJcbiAgICAgICAgc3VwZXIoe25hbWUsIGNvcmUsIHgsIHksIHNwcml0ZSwgd2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH0pO1xyXG4gICAgICAgIHRoaXMuY29sbGlkYWJsZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xyXG4gICAgICAgIHRoaXMuYm91bmNlWCA9IGJvdW5jZVg7XHJcbiAgICAgICAgdGhpcy5ib3VuY2VZID0gYm91bmNlWTtcclxuICAgICAgICB0aGlzLmluY3JlbWVudCA9IGluY3JlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBvbkNyZWF0ZSgpe1xyXG4gICAgICAgIGlmICh0aGlzLmluY3JlbWVudCl7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVGltZXIoe1xyXG4gICAgICAgICAgICAgICAgdGltZTogNjAgKiAwLjgsXHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm91bmNlWCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3VuY2VZID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95KCl7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZShkZWx0YSl7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlKGRlbHRhKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS54ICs9IHRoaXMuc3BlZWQueDtcclxuICAgICAgICB0aGlzLnNwcml0ZS55ICs9IHRoaXMuc3BlZWQueTtcclxuICAgICAgICBpZiAodGhpcy5saXZlVGltZSA+IDkgKiA2MCkgdGhpcy5kZXN0cm95KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuYm91bmNlWCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNwcml0ZS54ID4gNDEyIC0gdGhpcy5zcHJpdGUud2lkdGgpIHRoaXMuc3BlZWQueCA9IC10aGlzLnNwZWVkLng7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNwcml0ZS54IDwgMCkgdGhpcy5zcGVlZC54ID0gLXRoaXMuc3BlZWQueDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuYm91bmNlWSl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNwcml0ZS55ID4gNzMyIC0gdGhpcy5zcHJpdGUuaGVpZ2h0KSB0aGlzLnNwZWVkLnkgPSAtdGhpcy5zcGVlZC55O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcHJpdGUueSA8IDApIHRoaXMuc3BlZWQueSA9IC10aGlzLnNwZWVkLnk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmluY3JlbWVudCl7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNwZWVkLnggPiAwKSB0aGlzLnNwZWVkLnggKz0gMC4wM1xyXG4gICAgICAgICAgICBlbHNlIHRoaXMuc3BlZWQueCAtPSAwLjAzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zcGVlZC55ID4gMCkgdGhpcy5zcGVlZC55ICs9IDAuMDM7XHJcbiAgICAgICAgICAgIGVsc2UgdGhpcy5zcGVlZC55IC09IDAuMDM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKG9iajogR2FtZU9iamVjdCl7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvZ2FtZU9iamVjdHMvd2FsbC50cyIsImV4cG9ydCBpbnRlcmZhY2UgQ2FjaGVPYmplY3Qge1xyXG5cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIG9iamVjdDogYW55O1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNhY2hlIHtcclxuXHJcbiAgICBwcml2YXRlIGNhY2hlOiBDYWNoZU9iamVjdFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldChuYW1lOiBzdHJpbmcpe1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuY2FjaGUuZmlsdGVyKHggPT4geC5uYW1lID09IG5hbWUpWzBdO1xyXG4gICAgICAgIHJldHVybiByZXN1bHQgPyByZXN1bHQub2JqZWN0IDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQobmFtZTogc3RyaW5nLCBvYmplY3Q6IGFueSl7XHJcbiAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHtuYW1lLCBvYmplY3R9KVxyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCl7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgfVxyXG4gICAgXHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvY2xhc3Nlcy9nYW1lQ2FjaGUudHMiLCJpbXBvcnQgY29uc3RhbnRzIGZyb20gXCIuLi9jb25zdGFudHNcIjtcclxuaW1wb3J0IENvcmUgZnJvbSBcIi4uL2NvcmVcIjtcclxuXHJcbmNsYXNzIFBsYXlpbmdBdWRpbyB7XHJcblxyXG4gICAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xyXG4gICAgcmVhZG9ubHkgYXVkaW86IGFueTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih7bmFtZSwgYXVkaW99KXtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuYXVkaW8gPSBhdWRpbztcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmludGVyZmFjZSBQbGF5QXVkaW9PcHRpb25zIHtcclxuXHJcbiAgICAvKiogSWQgZGVsbCcgYXVkaW8sIHNlIMOoIGluIGVzZWN1emlvbmUgdW4gYXVkaW8gY29uIGxvIHN0ZXNzbyBpZCB2ZXJyw6AgZmVybWF0byAqL1xyXG4gICAgc3RyaW5nSWQ/OiBzdHJpbmc7XHJcblxyXG4gICAgLyoqIFBpdGNoIGRlbGwnIGF1ZGlvLCBkZWZhdWx0IDEgKi9cclxuICAgIHNwZWVkPzogbnVtYmVyO1xyXG5cclxuICAgIC8qKiBDYWxsYmFjayBlc2VndWl0YSBxdWFuZG8gbCdhdWRpbyB2aWVuZSB0ZXJtaW5hdG8gKi9cclxuICAgIGVuZENhbGxiYWNrPzogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAvKiogVm9sdW1lIGRlbGwnIGF1ZGlvLCBkZWZhdWx0IDEgKi9cclxuICAgIHZvbHVtZT86IG51bWJlcjtcclxuXHJcbn1cclxuXHJcbi8vVE9ETyBJTVBMRU1FTlRBUkUgQ0FDSEUgUElYSS1TT1VORCBodHRwOi8vcGl4aWpzLmlvL3BpeGktc291bmQvZXhhbXBsZXMvaW5kZXguaHRtbCNzZWN0aW9uLWxpYnJhcnlcclxuLy9UT0RPIGltcGxlbWVudGFyZSBzZW1wbGljZSBzdG9wIGF1ZGlvXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdWRpb01hbmFnZXIge1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgY29yZTogQ29yZTtcclxuICAgIHByaXZhdGUgYXVkaW9Qb29sIDogUGxheWluZ0F1ZGlvW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioe2NvcmV9KXtcclxuICAgICAgICB0aGlzLmNvcmUgPSBjb3JlO1xyXG4gICAgICAgIHRoaXMuYXVkaW9Qb29sID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSaXByb2R1Y2UgdW4gYXVkaW9cclxuICAgICAqIEBwYXJhbSBuYW1lICAgICAgICAgIE5vbWUgZGVsbCcgYXVkaW8gZGEgcmlwcm9kdXJyZVxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgICAgICAgT3B6aW9uaSBkaSByaXByb2R1emlvbmVcclxuICAgICAqL1xyXG4gICAgcGxheUF1ZGlvKG5hbWU6IHN0cmluZywgb3B0aW9ucz86IFBsYXlBdWRpb09wdGlvbnMpe1xyXG5cclxuICAgICAgICAvL1NlIGVzaXN0ZSBnacOgIHVuIGF1ZGlvIGNvbiBsbyBzdGVzc28gaWQgdmllbmUgZmVybWF0byBlIHJpbW9zc28gZGFsIHBvb2xcclxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmluZ0lkKSB0aGlzLnJlbW92ZUZyb21Qb29sKG9wdGlvbnMuc3RyaW5nSWQpO1xyXG5cclxuICAgICAgICAvL090dGVuZ28gbCdhdWRpbyBkYSByaXByb2R1cnJlIGUgY3JlbyBsJ2lzdGFuemFcclxuICAgICAgICBjb25zdCBhdWRpbyA9IHRoaXMuY29yZS5QSVhJLmxvYWRlci5yZXNvdXJjZXNbY29uc3RhbnRzLmF1ZGlvUGF0aCArIG5hbWVdLnNvdW5kXHJcbiAgICAgICAgaWYgKCFhdWRpbyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcIk5lc3N1biBhdWRpbyBhc3NvY2lhdG8gYSBcIiArIG5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhdWRpby5zcGVlZCA9IG9wdGlvbnMgPyBvcHRpb25zLnNwZWVkIHx8IDEgOiAxO1xyXG4gICAgICAgIGF1ZGlvLnZvbHVtZSA9IG9wdGlvbnMgPyBvcHRpb25zLnZvbHVtZSB8fCAxIDogMTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBhdWRpby5wbGF5KCk7XHJcbiAgICAgICAgaW5zdGFuY2Uub24oJ2VuZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5zdHJpbmdJZCkgdGhpcy5yZW1vdmVGcm9tUG9vbChvcHRpb25zLnN0cmluZ0lkKTtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5lbmRDYWxsYmFjaykgb3B0aW9ucy5lbmRDYWxsYmFjaygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL1JpcHJvZHVjbyBlZCBhZ2dpdW5nbyBhbCBwb29sLCBhbGxhIHN1YSBlc2VjdXppb25lIHNhcsOgIHJpbW9zc29cclxuICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnN0cmluZ0lkKSB0aGlzLmFkZFRvUG9vbChvcHRpb25zLnN0cmluZ0lkLCBhdWRpbyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRUb1Bvb2wobmFtZTogc3RyaW5nLCBzb3VyY2U6IGFueSl7XHJcbiAgICAgICAgY29uc3Qgc291bmQgPSBuZXcgUGxheWluZ0F1ZGlvKHtuYW1lLCBhdWRpbzogc291cmNlfSlcclxuICAgICAgICB0aGlzLmF1ZGlvUG9vbC5wdXNoKHNvdW5kKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZUZyb21Qb29sKG5hbWU6IHN0cmluZyl7XHJcbiAgICAgICAgY29uc3QgYXVkaW9PYmogPSB0aGlzLmF1ZGlvUG9vbC5maWx0ZXIoeCA9PiB4Lm5hbWUgPT0gbmFtZSlbMF07XHJcbiAgICAgICAgaWYgKCFhdWRpb09iaikgcmV0dXJuO1xyXG4gICAgICAgIGF1ZGlvT2JqLmF1ZGlvLnN0b3AoMCk7XHJcbiAgICAgICAgdGhpcy5hdWRpb1Bvb2wgPSB0aGlzLmF1ZGlvUG9vbC5maWx0ZXIoeCA9PiB4Lm5hbWUgIT0gbmFtZSk7XHJcbiAgICB9XHJcbiAgICBcclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9jbGFzc2VzL2F1ZGlvTWFuYWdlci50cyJdLCJzb3VyY2VSb290IjoiIn0=