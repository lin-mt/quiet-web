export default function (name: string) {
  switch (name) {
    case 'class-diagrams':
      return `
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
      `;
    case 'flowchart':
      return `
\`\`\`mermaid
graph TD
Start --> Stop
\`\`\`
      `;
    case 'sequence-diagrams':
      return `
\`\`\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
John-->>Alice: Great!
Alice-)John: See you later!
\`\`\`
      `;
    case 'gantt':
      return `
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
      `;
    case 'user-journey-diagrams':
      return `
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
      `;
    case 'pie-chart':
      return `
\`\`\`mermaid
pie title Pets adopted by volunteers
"Dogs" : 386
"Cats" : 85
"Rats" : 15
\`\`\`
      `;
    case 'entity-relationship-diagrams':
      return `
\`\`\`mermaid
erDiagram
CUSTOMER ||--o{ ORDER : places
ORDER ||--|{ LINE-ITEM : contains
CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
\`\`\`
      `;
    case 'state-diagrams':
      return `
\`\`\`mermaid
stateDiagram-v2
[*] --> Still
Still --> [*]

Still --> Moving
Moving --> Still
Moving --> Crash
Crash --> [*]
\`\`\`
      `;
  }
}
