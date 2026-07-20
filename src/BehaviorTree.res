// 1. Les 3 états possibles d'un nœud dans un Behavior Tree
type status =
  | Success
  | Fail
  | Running

// 2. La structure de nos nœuds
type rec node =
  | Selector(array<node>)
  | Sequence(array<node>)
  | Action(string)

// 3. La fonction principale de traversée (Tick)
let rec tick = (tree: node): status => {
  switch tree {
  | Action(name) => 
      // Pour l'instant, une action basique renvoie Success
      Js.log("Exécution de l'action : " ++ name)
      Success

  | Sequence(children) =>
      // Dans une Séquence : si un enfant échoue, tout échoue
      // Si un enfant tourne, la séquence reste en Running
      let rec evalChildren = (index) => {
        if index >= Belt.Array.length(children) {
          Success
        } else {
          let childStatus = tick(children[index])
          switch childStatus {
          | Fail => Fail
          | Running => Running
          | Success => evalChildren(index + 1)
          }
        }
      }
      evalChildren(0)

  | Selector(children) =>
      // Dans un Sélecteur : si un enfant réussit, tout réussit
      let rec evalChildren = (index) => {
        if index >= Belt.Array.length(children) {
          Fail
        } else {
          let childStatus = tick(children[index])
          switch childStatus {
          | Success => Success
          | Running => Running
          | Fail => evalChildren(index + 1)
          }
        }
      }
      evalChildren(0)
  }
}