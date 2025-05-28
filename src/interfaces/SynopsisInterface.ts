export interface SynopsisInterface {
    id: string;
    content: string;
    active: false;
    synopsis: string;
    storyStructure: string;
    reason: string;
    narrativeConcept: string[];
    projectDescription: string;
    characters: CharacterParserInterface[]
}

interface CharacterParserInterface {
    id: string;
    name: string;
    alias: string;
    race: string;
    gender: string;
    age: string;
    role: string;
    backstory: string;
    internalConflict: string;
    externalConflict: string;
    relationshipToProtagonists: string;
    relationshipToOtherCharacters: [
        {
            id: string;
            name: string;
            relationship: string;
        }
    ];
    weaknesses: string;
    strengths: string;
    voice: string;
    perspective: string;
    uniqueHook: string;
}
