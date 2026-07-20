import { BehaviorTree, NodeRegistry, Blackboard, JSONNode } from './BehaviorTree.js
const registry = new NodeRegistry<Blackboard>();


registry.registerAction('hasKey', (ctx) => {
    const hasKey = ctx.get<boolean>('hasKey');
    console.log(`[Condition] Vérifier clé... ${hasKey ? 'OUI' : 'NON'}`);
    return hasKey ? 'SUCCESS' : 'FAIL';
});

registry.registerAction('openDoor', () => {
    console.log('[Action] 🚪 La porte est ouverte !');
    return 'SUCCESS';
});

registry.registerAction('canBreakDoor', (ctx) => {
    const isStrong = ctx.get<boolean>('isStrong');
    console.log(`[Condition] Est-ce défonçable ?... ${isStrong ? 'OUI' : 'NON'}`);
    return isStrong ? 'SUCCESS' : 'FAIL';
});

registry.registerAction('knockDoor', () => {
    console.log('[Action] ✊ Toc toc toc à la porte !');
    return 'SUCCESS';
});


async function runTest() {
    try {
        
        const response = await fetch('./test.json');
        const treeJSON: JSONNode = await response.json();

        
        const tree = BehaviorTree.fromJSON(treeJSON, registry);

        
        const blackboard = new Blackboard();
        blackboard.set('hasKey', true);     // On lui donne la clé
        blackboard.set('isStrong', false);  // Pas assez fort pour défoncer

        
        console.log("--- DÉBUT DU TEST ---");
        const result = await tree.update(blackboard);
        console.log(`--- FIN DU TEST (Résultat : ${result}) ---`);

    } catch (error) {
        console.error("Erreur lors du chargement ou de l'exécution :", error);
    }
}

runTest();