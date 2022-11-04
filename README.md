# mermaid-interpreter

Knex.js based query builder to interpret design patterns in MermaidJS.

```
// Test string
const input = "classDiagram\r\n  Singleton-->Singleton\r\n SecondSingleton-->SecondSingleton\r\n   Animal <|-- Duck\r\n    Animal <|-- Fish\r\n    Animal <|-- Zebra\r\n  Animal : +int age\r\n    Animal : +String gender\r\n    Animal: +isMammal()\r\n    Animal: +mate()\r\n    class Duck{\r\n        +String beakColor\r\n        +swim()\r\n        +quack()\r\n    }\r\n    class Fish{\r\n        -int sizeInFeet\r\n        -canEat()\r\n    }\r\n    class Zebra{\r\n        +bool is_wild\r\n        +run()\r\n    }\r\n    class Singleton{\r\n        -Singleton singleton$\r\n        -Singleton()\r\n        +getInstance()$ Singleton\r\n   }\r\n    class SecondSingleton{\r\n        -SecondSingleton singleton$\r\n        -SecondSingleton()\r\n        +getInstance()$ SecondSingleton\r\n   }";

```
