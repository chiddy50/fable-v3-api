export interface SceneInterface {
    title: string,
    description: string,
    order: number,
    setting: string,
    prompt: string,
    charactersInvolved: CharactersInvolved[]
}

interface CharactersInvolved {
    name: string,
    roleInScene: string;
    relationshipToProtagonist: string;
}