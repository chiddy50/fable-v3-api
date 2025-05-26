export const sevenPointStructureShortStory = {
    goal: "Create a compelling short story using the seven-point structure",
    
    description: "A condensed version of the Seven-Point Structure designed for short fiction. Each chapter delivers a crucial story beat with maximum efficiency, perfect for impactful character arcs or twist-driven narratives in limited word counts.",
    
    idealLength: "1,500–5,000 words (short story format)",
    
    preWritingQuestion: {
        task: "What core emotion or transformation will define your story?",
        suggestions: ["Betrayal to vengeance", "Fear to courage", "Ignorance to awareness", "Isolation to connection", "Doubt to conviction"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Hook",
        purpose: "Establish character, flaw, and hint at the coming disruption in minimal space.",
        questions: [
            {
                index: 1,
                question: "How can you show the protagonist's flaw in one vivid detail?",
                suggestions: ["A recurring habit", "A telling object they carry", "A strained relationship"]
            },
            {
                index: 2,
                question: "What single sentence could foreshadow the inciting incident?",
                suggestions: ["The letter arrived at dusk", "She didn't notice the locked door", "His last coin was gone"]
            }
        ],
        wordCount: {
            min: 300,
            max: 700
        },
        promptToUser: "Introduce the protagonist mid-action, with their flaw visible. Hint at the storm coming.",
        prompt: "Show the character's normal world and flaw in 1-2 scenes, ending with subtle foreshadowing.",
        aiPrompt: `
            Write Chapter 1 (Hook) of a [GENRE] short story using the Seven-Point Structure.
            Open with [CHARACTER NAME] doing [CHARACTERIZING ACTION] that reveals [FLAW].
            Establish [SETTING] through sensory details (1-2 lines max).
            Hint at the coming disruption with: [FORESHADOWING DETAIL].
            End with a line that creates unease or curiosity.
            (Max: 700 words)
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "First Plot Point",
        purpose: "The inciting incident—force the protagonist onto a new path.",
        questions: [
            {
                index: 1,
                question: "What irreversible event occurs?",
                suggestions: ["A death", "A discovered secret", "A ultimatum", "A supernatural encounter"]
            },
            {
                index: 2,
                question: "How does this exploit the protagonist's flaw?",
                suggestions: ["Their pride blinds them", "Their fear paralyzes", "Their trust is misplaced"]
            }
        ],
        wordCount: {
            min: 400,
            max: 800
        },
        promptToUser: "Drop the bomb. No buildup—just the event and immediate aftermath.",
        prompt: "The protagonist's world changes in an instant. Show their visceral reaction.",
        aiPrompt: `
            Write Chapter 2 (First Plot Point) of a [GENRE] short story.
            [INCITING EVENT] occurs by paragraph 2.
            Show [CHARACTER NAME]'s raw reaction (physical first, then emotional).
            Their flaw causes them to [FLAW-DRIVEN RESPONSE].
            End with them making a definitive (possibly rash) decision.
            (Max: 800 words)
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "First Pinch Point",
        purpose: "Introduce the antagonist/opposition—apply pressure.",
        questions: [
            {
                index: 1,
                question: "How does the opposition manifest physically?",
                suggestions: ["A threatening note", "A stolen item", "A direct confrontation", "A natural disaster"]
            },
            {
                index: 2,
                question: "What does the protagonist stand to lose?",
                suggestions: ["Their home", "A relationship", "Their identity", "Their last chance"]
            }
        ],
        wordCount: {
            min: 300,
            max: 700
        },
        promptToUser: "Make the threat tangible. One concrete action from the opposition.",
        prompt: "The antagonist makes their move or the situation worsens decisively.",
        aiPrompt: `
            Write Chapter 3 (First Pinch Point) of a [GENRE] short story.
            [ANTAGONIST/OPPOSING FORCE] does [SPECIFIC THREATENING ACTION].
            [CHARACTER NAME] loses [IMPORTANT THING/PERSON/OPPORTUNITY].
            Show their flawed coping mechanism: [FLAW IN ACTION].
            End with the threat looming larger.
            (Max: 700 words)
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Midpoint",
        purpose: "A revelation shifts the protagonist from reactive to proactive.",
        questions: [
            {
                index: 1,
                question: "What truth cracks their flawed perspective?",
                suggestions: ["They've been used", "The enemy is closer than they thought", "Their fear was misplaced"]
            },
            {
                index: 2,
                question: "What do they resolve to do differently?",
                suggestions: ["Confront the antagonist", "Protect someone else", "Sacrifice themselves"]
            }
        ],
        wordCount: {
            min: 400,
            max: 800
        },
        promptToUser: "A lightbulb moment. No internal monologue—show the shift through action.",
        prompt: "The protagonist realizes something fundamental and changes course.",
        aiPrompt: `
            Write Chapter 4 (Midpoint) of a [GENRE] short story.
            [CHARACTER NAME] witnesses [REVELATORY EVENT/IMAGE].
            They [PHYSICAL ACTION SHOWING CHANGE] instead of [OLD FLAW-DRIVEN BEHAVIOR].
            Include one line of dialogue or thought showing new resolve.
            End with them taking a decisive step toward the goal.
            (Max: 800 words)
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Second Pinch Point",
        purpose: "The opposition strikes back—everything seems lost.",
        questions: [
            {
                index: 1,
                question: "What does the antagonist destroy or take?",
                suggestions: ["The escape route", "The evidence", "The ally", "The protagonist's confidence"]
            },
            {
                index: 2,
                question: "How does this test the protagonist's new resolve?",
                suggestions: ["They nearly revert to old ways", "They find hidden strength", "They make a costly mistake"]
            }
        ],
        wordCount: {
            min: 300,
            max: 700
        },
        promptToUser: "Pull the rug out. The protagonist's progress should feel undone.",
        prompt: "The antagonist delivers a crushing blow. All seems hopeless.",
        aiPrompt: `
            Write Chapter 5 (Second Pinch Point) of a [GENRE] short story.
            [ANTAGONIST] executes [DEVASTATING COUNTERMOVE].
            [CHARACTER NAME] loses [CRUCIAL RESOURCE/ALLY/HOPE].
            Show them almost succumbing to [OLD FLAW] but resisting at the last moment.
            End with them at their lowest point.
            (Max: 700 words)
        `
    },
    
    chapterSix: {
        index: 6,
        objective: "Second Plot Point",
        purpose: "The protagonist finds the key to overcoming the conflict.",
        questions: [
            {
                index: 1,
                question: "What unexpected resource or insight appears?",
                suggestions: ["A hidden skill", "An ally's sacrifice", "The antagonist's weakness", "A repressed memory"]
            },
            {
                index: 2,
                question: "How does this tie to their transformation?",
                suggestions: ["They finally believe in themselves", "They accept a hard truth", "They prioritize others"]
            }
        ],
        wordCount: {
            min: 400,
            max: 800
        },
        promptToUser: "The game-changer. Make it feel earned, not convenient.",
        prompt: "The protagonist discovers what they need to face the climax.",
        aiPrompt: `
            Write Chapter 6 (Second Plot Point) of a [GENRE] short story.
            [CHARACTER NAME] discovers [SOLUTION/TRUTH/WEAPON] through [HARD-EARNED MEANS].
            This directly counters [ANTAGONIST'S STRENGTH/MAIN OBSTACLE].
            Show their transformed perspective through [ACTION/DIALOGUE].
            End with them preparing for the final confrontation.
            (Max: 800 words)
        `
    },
    
    chapterSeven: {
        index: 7,
        objective: "Resolution",
        purpose: "The climax and denouement—show the transformed character.",
        questions: [
            {
                index: 1,
                question: "How does the final confrontation highlight their change?",
                suggestions: ["They act selflessly", "They use a new skill", "They walk away", "They forgive"]
            },
            {
                index: 2,
                question: "What final image echoes the theme?",
                suggestions: ["An empty chair", "A healed wound", "A burning letter", "A shared glance"]
            }
        ],
        wordCount: {
            min: 400,
            max: 1000
        },
        promptToUser: "Resolve with action, not explanation. Let the last image linger.",
        prompt: "The protagonist faces the antagonist or conflict, proving their transformation.",
        aiPrompt: `
            Write Chapter 7 (Resolution) of a [GENRE] short story.
            [CHARACTER NAME] confronts [ANTAGONIST/FINAL OBSTACLE] using [NEW APPROACH].
            Show their transformation through [DEFINING ACTION].
            Resolve the central conflict definitively.
            End with [THEMATIC IMAGE] that mirrors/reverses the opening.
            (Max: 1,000 words)
        `
    },
    
    implementationDetails: {
        genreSpecificGuidance: {
            thriller: "First pinch point = physical threat; second pinch point = psychological trap",
            literary: "Focus the midpoint on a subtle but life-altering realization",
            horror: "Second plot point should reveal the monster's weakness... or the protagonist becoming the monster",
            romance: "Midpoint = moment of vulnerability; resolution = gesture proving love's triumph"
        },
        chapterLengthProportions: {
            chapterOne: "15%",
            chapterTwo: "20%",
            chapterThree: "15%",
            chapterFour: "15%",
            chapterFive: "10%",
            chapterSix: "10%",
            chapterSeven: "15%"
        },
        analysisFeatures: [
            "Does the inciting incident occur by the end of Chapter 2?",
            "Is the protagonist's flaw visible in their Chapter 1 actions?",
            "Does the midpoint pivot rely on external action, not just thought?",
            "Is the final image thematically resonant?"
        ],
        commonPitfalls: [
            "Spending too many words on setup (Chapters 1-2 bloated)",
            "Midpoint revelation told rather than shown through action",
            "Resolution undercuts tension (e.g., deus ex machina)",
            "Antagonist feels absent in pinch points"
        ],
        structuralRecommendations: [
            "Chapter 1's last line should subtly foreshadow Chapter 2's disruption",
            "Chapter 3's threat should directly exploit the protagonist's flaw",
            "Chapter 7's final image should contrast with Chapter 1's opening image",
            "Each chapter must end with a clear narrative question pulling readers forward"
        ]
    }
};