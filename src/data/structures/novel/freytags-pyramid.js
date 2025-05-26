export const freytagsPyramidNovel = {
    goal: "Create a novel with a classic dramatic arc of rising and falling tension",
    
    description: "Freytag's Pyramid is a traditional dramatic structure that follows a clear progression from exposition through conflict to resolution. This 7-chapter structure adapts the classic 5-part model for novel-length stories, providing meaningful pacing and emotional progression.",
    
    idealLength: "7 chapters (novel format)",
    
    preWritingQuestion: {
        task: "What kind of story are you telling? (Note: if it's a tragedy, you'll want to include the Catastrophe chapter)",
        suggestions: ["Adventure", "Romance", "Coming-of-age", "Tragedy", "Mystery", "Fantasy", "Drama"]
    },
    
    chapterOne: {
        index: 1,
        objective: "Exposition",
        purpose: "Set the stage. Introduce the protagonist, setting, and background.",
        questions: [
            {
                index: 1,
                question: "Who is the protagonist, and what do they want?",
                suggestions: []
            },
            {
                index: 2,
                question: "What is their normal life like?",
                suggestions: ["Daily routines", "Important relationships", "Occupation or status", "Living conditions"]
            },
            {
                index: 3,
                question: "Where and when does the story take place?",
                suggestions: []
            },
            {
                index: 4,
                question: "What relationships and internal conflicts exist?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 5000
        },
        promptToUser: "Start by establishing your protagonist's world before anything goes wrong. Show us who they are, what their life is like, and what matters to them.",
        prompt: "Introduce the protagonist, their world, and what's at stake in their normal life before the conflict begins.",
        aiPrompt: `
            Create the exposition chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Introduce [CHARACTER NAME], a [CHARACTER DESCRIPTION].
            Show their normal life in [SETTING].
            Establish their primary relationships with [SECONDARY CHARACTERS].
            Reveal their desires, strengths, and flaws.
            Hint at the coming conflict without directly introducing it yet.
            End with a subtle suggestion that change is coming.
        `
    },
    
    chapterTwo: {
        index: 2,
        objective: "Inciting Incident",
        purpose: "Introduce the first spark of conflict or disruption that sets the story in motion.",
        questions: [
            {
                index: 1,
                question: "What unexpected event disrupts the protagonist's normal world?",
                suggestions: ["A visitor", "A discovery", "A challenge", "A loss", "An opportunity"]
            },        
            {
                index: 2,
                question: "How does this challenge or threaten them?",
                suggestions: []
            },
            {
                index: 3,
                question: "What's the initial reaction?",
                suggestions: ["Denial", "Excitement", "Fear", "Confusion", "Reluctance"]
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "Disrupt your protagonist's normal life with a significant event. This is the moment that sets your entire story in motion.",
        prompt: "Something happens that interrupts the protagonist's routine and pushes them toward a challenge or choice.",
        aiPrompt: `
            Create the inciting incident chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show [CHARACTER NAME] experiencing [DISRUPTING EVENT].
            Demonstrate how this event challenges or threatens their normal life.
            Describe their initial reaction: [REACTION].
            Show how this event creates a problem that needs solving.
            End with the character at a decision point or faced with an unavoidable change.
        `
    },
    
    chapterThree: {
        index: 3,
        objective: "Rising Action",
        purpose: "Build tension through a series of obstacles and developments.",
        questions: [
            {
                index: 1,
                question: "What escalating events make the conflict worse?",
                suggestions: []
            },
            {
                index: 2,
                question: "What new characters, enemies, or stakes are introduced?",
                suggestions: []
            },
            {
                index: 3,
                question: "How does the protagonist start to change or struggle?",
                suggestions: ["New skills", "Internal conflict", "Changing relationships", "Growing determination"]
            }
        ],
        wordCount: {
            min: 3000,
            max: 6000
        },
        promptToUser: "Complicate your story by adding obstacles, new challenges, or escalating the existing conflict. Show your protagonist adapting and struggling.",
        prompt: "Show how the situation becomes more complicated. The protagonist encounters resistance, forms alliances, or faces setbacks.",
        aiPrompt: `
            Create the rising action chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show [CHARACTER NAME] facing increasingly difficult challenges related to [MAIN CONFLICT].
            Introduce new complications: [COMPLICATIONS].
            Add or develop supporting characters who help or hinder the protagonist.
            Show the protagonist changing in response to these challenges.
            Raise the stakes by showing what could be lost.
            End with tension at its highest point before the climax.
        `
    },
    
    chapterFour: {
        index: 4,
        objective: "Climax",
        purpose: "Reach the story's emotional and narrative peak.",
        questions: [
            {
                index: 1,
                question: "What is the turning point of the story?",
                suggestions: ["Confrontation", "Revelation", "Decision", "Battle", "Transformation"]
            },
            {
                index: 2,
                question: "What major decision, confrontation, or revelation occurs?",
                suggestions: []
            },
            {
                index: 3,
                question: "What is lost or gained?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 5000
        },
        promptToUser: "This is the peak of your story—the moment everything has been building toward. Create a powerful scene where the conflict reaches its most intense point.",
        prompt: "The most intense part of the story. A major choice or event happens that shifts the direction of everything.",
        aiPrompt: `
            Create the climax chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show [CHARACTER NAME] facing the ultimate challenge: [CLIMACTIC MOMENT].
            Build tension through pacing, setting, and stakes.
            Include a moment of truth, decision, or revelation that changes everything.
            Make this moment emotionally powerful and impactful.
            Show what the protagonist gains or loses in this crucial moment.
            End with a clear sense that things will never be the same.
        `
    },
    
    chapterFive: {
        index: 5,
        objective: "Falling Action",
        purpose: "Show the fallout or immediate consequences of the climax.",
        questions: [
            {
                index: 1,
                question: "What changes in the world or characters after the climax?",
                suggestions: []
            },
            {
                index: 2,
                question: "How does the protagonist respond or recover?",
                suggestions: ["Processing emotions", "Dealing with aftermath", "New understanding", "Recovery"]
            },
            {
                index: 3,
                question: "What lingering conflict still remains?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 2000,
            max: 4000
        },
        promptToUser: "After the climactic moment, show the immediate aftermath. How do characters react? What has changed? What still needs resolution?",
        prompt: "After the climax, show what happens next. Things begin to settle, but the outcome still has consequences.",
        aiPrompt: `
            Create the falling action chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show the immediate aftermath of [CLIMACTIC EVENT].
            Demonstrate how [CHARACTER NAME] and others are processing what happened.
            Reveal the consequences and changes caused by the climax.
            Begin to resolve secondary conflicts.
            Show how the protagonist is different now.
            Include any remaining tension that still needs resolution.
        `
    },
    
    chapterSix: {
        index: 6,
        conditional: true,
        objective: "Catastrophe or Final Twist",
        purpose: "Introduce a final loss, twist, or hard truth (especially in tragedies).",
        questions: [
            {
                index: 1,
                question: "Is there one final moment of tragedy, realization, or cost?",
                suggestions: []
            },
            {
                index: 2,
                question: "Does the protagonist lose something meaningful?",
                suggestions: ["A person", "An ideal", "Hope", "Innocence", "Status", "Identity"]
            },
            {
                index: 3,
                question: "How does this affect the final resolution?",
                suggestions: []
            }
        ],
        wordCount: {
            min: 1500,
            max: 3000
        },
        promptToUser: "For tragic or dramatic stories, include a final significant loss or twist that solidifies the theme of your story. This is where the full cost of the journey becomes clear.",
        prompt: "A last shocking turn or emotional blow happens. It solidifies the message or moral of the story.",
        aiPrompt: `
            Create the catastrophe/final twist chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show [CHARACTER NAME] experiencing a final significant [LOSS/TWIST/REVELATION].
            Make this moment emotionally powerful and connected to the story's themes.
            Demonstrate the full cost or consequence of the journey.
            Show how this shapes the protagonist's final understanding.
            Connect this moment to the story's central message or moral.
        `
    },
    
    chapterSeven: {
        index: 7,
        objective: "Denouement (Resolution)",
        purpose: "Resolve the conflict and reveal the new normal.",
        questions: [
            {
                index: 1,
                question: "How has the protagonist changed?",
                suggestions: []
            },
            {
                index: 2,
                question: "What does the world look like after the journey?",
                suggestions: []
            },
            {
                index: 3,
                question: "What message or emotional note ends the story?",
                suggestions: ["Hope", "Acceptance", "Understanding", "Peace", "New beginning"]
            }
        ],
        wordCount: {
            min: 1500,
            max: 3000
        },
        promptToUser: "Bring your story to a close by showing the new equilibrium. How has your protagonist changed? What's the new normal? What final emotion or thought do you want to leave with readers?",
        prompt: "Bring the story to a close. The character reflects or moves forward. Resolve any remaining loose ends.",
        aiPrompt: `
            Create the denouement/resolution chapter for a [GENRE] novel using Freytag's Pyramid structure.
            Show the new normal for [CHARACTER NAME] after all the events.
            Resolve any remaining conflicts or questions.
            Demonstrate how the protagonist has changed since the beginning.
            Provide closure on relationships and subplots.
            End with a final image, thought, or moment that encapsulates the story's meaning.
            Leave the reader with a sense of completion and emotional satisfaction.
        `
    },
    
    implementationDetails: {
        conditionalChapters: {
            catastrophe: {
                condition: "Only include Chapter 6 (Catastrophe) if the story is a tragedy or drama",
                implementation: "Make this optional in the UI with a toggle or genre selection"
            }
        },
        genreSpecificGuidance: {
            tragedy: "Emphasize the protagonist's fatal flaw and ensure the catastrophe feels inevitable",
            adventure: "Focus on external obstacles during rising action",
            romance: "Ensure the climax resolves the central relationship question",
            mystery: "Use the climax for the major revelation or solution to the puzzle"
        },
        chapterLengthProportions: {
            chapterOne: "15% of total word count",
            chapterTwo: "10% of total word count",
            chapterThree: "25% of total word count",
            chapterFour: "15% of total word count",
            chapterFive: "15% of total word count",
            chapterSix: "10% of total word count",
            chapterSeven: "10% of total word count"
        },
        analysisFeatures: [
            "Check for proper tension arc with rising and falling action",
            "Verify that the climax is truly the highest point of conflict or emotion",
            "Ensure character development follows a coherent arc from beginning to end"
        ],
        commonPitfalls: [
            "Starting with too much backstory before the inciting incident",
            "Creating a climax that doesn't fundamentally change the situation",
            "Introducing new major conflicts after the climax",
            "Resolving the main conflict before the designated climax chapter"
        ]
    }
};