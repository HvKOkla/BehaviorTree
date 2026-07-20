export class Blackboard {
    constructor() {
        this.data = new Map();
    }

    set(key, value) {
        this.data.set(key, value);
    }

    get(key) {
        return this.data.get(key);
    }

    has(key) {
        return this.data.has(key);
    }

    delete(key) {
        return this.data.delete(key);
    }

    clear() {
        this.data.clear();
    }
}

export class Selector {
    constructor(name, children = []) {
        this.name = name;
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
        return this;
    }

    async run(context) {
        for (const child of this.children) {
            const status = await child.run(context);
            if (status === 'SUCCESS' || status === 'RUNNING') {
                return status;
            }
        }
        return 'FAIL';
    }
}

export class Sequence {
    constructor(name, children = []) {
        this.name = name;
        this.children = children;
    }

    addChild(child) {
        this.children.push(child);
        return this;
    }

    async run(context) {
        for (const child of this.children) {
            const status = await child.run(context);
            if (status === 'FAIL' || status === 'RUNNING') {
                return status;
            }
        }
        return 'SUCCESS';
    }
}

export class Action {
    constructor(name, callback) {
        this.name = name;
        this.callback = callback;
    }

    async run(context) {
        return await this.callback(context);
    }
}

export class Condition {
    constructor(name, predicate) {
        this.name = name;
        this.predicate = predicate;
    }

    async run(context) {
        const result = await this.predicate(context);
        return result ? 'SUCCESS' : 'FAIL';
    }
}

export class Inverter {
    constructor(name, child) {
        this.name = name;
        this.child = child;
    }

    async run(context) {
        const status = await this.child.run(context);
        if (status === 'SUCCESS') return 'FAIL';
        if (status === 'FAIL') return 'SUCCESS';
        return 'RUNNING';
    }
}

export class NodeRegistry {
    constructor() {
        this.actions = new Map();
    }

    registerAction(name, callback) {
        this.actions.set(name, callback);
    }

    getAction(name) {
        return this.actions.get(name);
    }
}

export function buildTreeFromJSON(config, registry) {
    switch (config.type) {
        case 'Sequence': {
            const children = (config.children || []).map(c => buildTreeFromJSON(c, registry));
            return new Sequence(config.name, children);
        }
        case 'Selector': {
            const children = (config.children || []).map(c => buildTreeFromJSON(c, registry));
            return new Selector(config.name, children);
        }
        case 'Condition': {
            const key = config.actionName || config.name;
            const fn = registry.getAction(key);
            if (!fn) throw new Error(`Condition non trouvée dans le registre : "${key}"`);
            return new Condition(config.name, async (ctx) => (await fn(ctx)) === 'SUCCESS');
        }
        case 'Action': {
            const key = config.actionName || config.name;
            const fn = registry.getAction(key);
            if (!fn) throw new Error(`Action non trouvée dans le registre : "${key}"`);
            return new Action(config.name, fn);
        }
        case 'Inverter': {
            if (!config.child) throw new Error(`L'Inverter "${config.name}" nécessite un champ "child"`);
            const child = buildTreeFromJSON(config.child, registry);
            return new Inverter(config.name, child);
        }
        default:
            throw new Error(`Type de nœud inconnu : ${config.type}`);
    }
}

export class BehaviorTree {
    constructor(root = null) {
        this.root = root;
    }

    setRoot(rootNode) {
        this.root = rootNode;
    }

    async update(context) {
        if (this.root) {
            return await this.root.run(context);
        }
        return undefined;
    }

    static fromJSON(config, registry) {
        const root = buildTreeFromJSON(config, registry);
        return new BehaviorTree(root);
    }
}