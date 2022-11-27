type MermaidDefault = {
  name: string;
  value: string;
  newColumnPos: number;
  newLineNum: number;
};

export const MermaidDefaults: Record<string, MermaidDefault> = {
  classDiagrams: {
    name: '类图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal <|-- Zebra
Animal : +int age
Animal : +String gender
Animal: +isMammal()
Animal: +mate()
class Duck{
+String beakColor
+swim()
+quack()
}
class Fish{
-int sizeInFeet
-canEat()
}
class Zebra{
+bool is_wild
+run()
}
\`\`\`
`,
  },
  flowChart: {
    name: '流程图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
graph TD
Start --> Stop
\`\`\`
`,
  },
  sequenceDiagrams: {
    name: '时序图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
John-->>Alice: Great!
Alice-)John: See you later!
\`\`\`
`,
  },
  gantt: {
    name: '甘特图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
gantt
title A Gantt Diagram
dateFormat  YYYY-MM-DD
section Section
A task           :a1, 2014-01-01, 30d
Another task     :after a1  , 20d
section Another
Task in sec      :2014-01-12  , 12d
another task      : 24d
\`\`\`
`,
  },
  userJourneyDiagrams: {
    name: '旅程图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
journey
title My working day
section Go to work
Make tea: 5: Me
Go upstairs: 3: Me
Do work: 1: Me, Cat
section Go home
Go downstairs: 5: Me
Sit down: 5: Me
\`\`\`
`,
  },
  pieChart: {
    name: '饼状图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
pie title Pets adopted by volunteers
"Dogs" : 386
"Cats" : 85
"Rats" : 15
\`\`\`
`,
  },
  entityRelationshipDiagrams: {
    name: '关系图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
erDiagram
CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ LINE-ITEM : contains
CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\`
`,
  },
  stateDiagrams: {
    name: '状态图',
    newColumnPos: 0,
    newLineNum: 2,
    value: `
\`\`\`mermaid
stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
\`\`\`
`,
  },
};
