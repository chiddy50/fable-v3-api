export interface SceneInterface {
    title: string,
    description: string,
    order: number,
    setting: string,
    charactersInvolved: CharactersInvolved[]
}

interface CharactersInvolved {
    name: string,
    roleInScene: string;
    relationshipToProtagonist: string;
}