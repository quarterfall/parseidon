# parseidon

Knex.js based query builder to interpret design patterns in MermaidJS.

# demo

You can try out the ParseidonJS node module at the link below!

[ParseidonJS Demo](https://parseidon.quarterfall.com)

# Database Structure

The database includes 4 tables, as shown in the diagram before. This database is queried to check for design patterns and relations in the class diagram.

```mermaid
 classDiagram
direction LR
Relations "1" --> "2" Classes
Classes "1" --> "0..*" Members
Classes "1" --> "0..*" Methods
class Relations {
int id
String first_class
String relation
String second_class
}
class Classes {
String id
int[] members
int[] methods
String type
}
class Members {
int id
String type
String name
String accessibility
String classifier
}
class Methods {
int id
String returnType
String name
String parameters
String accessibility
String classifier
}
```

# Design Patterns

For the moment, ParseidonJS supports these design patterns software design patterns:

## Singleton

### Steps

1. Singleton class has private static instance of own class
2. Singleton class has a private constructor
3. Singleton class has public static method returning the singleton class instance
4. There is no instance of the singleton class in any other class

```mermaid
 classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Singleton --> Singleton
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
    class Singleton{
      -Singleton singleton$
      -Singleton()
      +getInstance()$ Singleton
    }
```

```
 classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Singleton --> Singleton
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
    class Singleton{
      -Singleton singleton$
      -Singleton()
      +getInstance()$ Singleton
    }
```

## Factory Method

### Steps

1. Have a "product" interface implemented by at least 1 "product'
2. Have an abstract "creator" class with abstract method that returns "product" interface and at least 1 other method
3. Have at least one class inheriting from "creator" class

```mermaid
 classDiagram
direction RL
    class Dialog {
        <<abstract>>
        +render()
        +createButton()* Button
    }
    class Button {
        <<interface>>
        +render()
        +onClick()
    }
    class WindowsDialog {
        +createButton(): Button
    }
WindowsDialog --|> Dialog
WindowsButton ..|> Button
Dialog --> Button
```

```
 classDiagram
    direction RL
    class Dialog {
        <<abstract>>
        +render()
        +createButton()* Button
    }
    class Button {
        <<interface>>
        +render()
        +onClick()
    }
    class WindowsDialog {
        +createButton(): Button
    }
    WindowsDialog --|> Dialog
    WindowsButton ..|> Button
    Dialog --> Button
```

## Strategy

### Steps

1. Strategy interface with 1 method ( Strategy method )
2. Context class with private Strategy interface member
3. One class implementing the Strategy interface

```mermaid
 classDiagram
Context o-- Strategy
Context --> Strategy
ConcreteStrategy ..|> Strategy
class Strategy {
<<interface>>
+execute(data)
}
class ConcreteStrategy {
+execute(data)
}
class Context {
-Strategy strategy
+setStrategy(strategy)
+doSomething()
}
```

```
 classDiagram
    Context o-- Strategy
    Context --> Strategy
    ConcreteStrategy ..|> Strategy
    class Strategy{
        <<interface>>
        +execute(data)
    }
    class ConcreteStrategy{
        +execute(data)
    }
    class Context{
        -Strategy strategy
        +setStrategy(strategy)
        +doSomething()
    }
```

## Adapter

### Steps

1. Adapter class that associates with the service and implements the client interface
2. Service class, the client can't use it directly. Adapter class has an instance of it

```mermaid
 classDiagram
SquarePegAdapter ..|> RoundPeg
SquarePegAdapter --> SquarePeg

class SquarePegAdapter{
-SquarePeg peg
+SquarePegAdapter(SquarePeg peg)
+getRadius() int
}
class SquarePeg{
-int width
+SquarePeg(int width)
+getWidth() int
}
class RoundPeg{
<<interface>>
+getRadius() int
}
```

```
 classDiagram
    SquarePegAdapter ..|> RoundPeg
    SquarePegAdapter --> SquarePeg
    class SquarePegAdapter{
        -SquarePeg peg
        +SquarePegAdapter(SquarePeg peg)
        +getRadius() int
    }
    class SquarePeg{
        -int width
        +SquarePeg(int width)
        +getWidth() int
    }
    class RoundPeg{
        <<interface>>
        +getRadius() int
    }
```

## Composite

### Steps

1. Component interface with at least one method
2. Two classes implementing the Component interface (Leaf and Container)
3. One class(Container) with an array of interface type, methods to add and remove members of the array

```mermaid
 classDiagram
Dot ..|> Graphic
CompoundGraphic ..|> Graphic
class Graphic {
<<interface>>
+move(int x,int y)
+draw()
}
class Dot {
+Dot(int x, int y)
+move(int x, int y)
+draw()
}
class CompoundGraphic {
-Graphic[] children
+add(Graphic child)
+remove(Graphic child)
+move(int x, int y)
+draw()
}
```

```
 classDiagram
    Dot ..|> Graphic
    CompoundGraphic ..|> Graphic
    class Graphic {
        <<interface>>
        +move(int x,int y)
        +draw()
    }
    class Dot {
        +Dot(int x, int y)
        +move(int x, int y)
        +draw()
    }
    class CompoundGraphic {
        -Graphic[] children
        +add(Graphic child)
        +remove(Graphic child)
        +move(int x, int y)
        +draw()
    }
```

## Proxy

### Steps

1. Interface implemented by at least two classes (Proxy and Service)
2. Proxy class has instance of service class
3. Proxy class constructor has parameter of type service class
4. Proxy class has association to Service

```mermaid
 classDiagram
   class ThirdPartyYTLib{
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   class CachedYTClass{
        -ThirdPartyYTClass service
        +CachedYTClass(ThirdPartyYTClass s)
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   class ThirdPartyYTClass{
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   CachedYTClass ..|> ThirdPartyYTLib
   ThirdPartyYTClass ..|> ThirdPartyYTLib
   CachedYTClass o--> ThirdPartyYTLib
```

```
 classDiagram
   class ThirdPartyYTLib{
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   class CachedYTClass{
        -ThirdPartyYTClass service
        +CachedYTClass(ThirdPartyYTClass s)
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   class ThirdPartyYTClass{
        +listVideos()
        +getVideoInfo(id)
        +downloadVideo(id)
   }
   CachedYTClass ..|> ThirdPartyYTLib
   ThirdPartyYTClass ..|> ThirdPartyYTLib
   CachedYTClass o--> ThirdPartyYTLib
```

## Observer

### Steps

1. Interface (Subscriber) implemented by at least one class (concrete subscribers)
2. Interface has aggregation with a class (Publisher) 
3. Publisher class has array of interface (Subscriber) type
4. Publisher class has two methods with parameter of interface (Subscriber) type

```mermaid
 classDiagram
    class EventManager{
        -EventListeners listeners[]
        +subscribe(EventListeners l)
        +unsubscribe(EventListeners l)
        +notify(EventType event, String data)
    }
    class EventListeners{
        <<interface>>
        +update(String filename)
    }
    class EmailAlertsListener{
        +update(String filename)
    }
    class LoggingListener{
        +update(String filename)
    }
    EventManager o--> EventListeners
    EmailAlertsListener ..|> EventListeners
    LoggingListener ..|> EventListeners
```

```
 classDiagram
    class EventManager{
        -EventListeners listeners[]
        +subscribe(EventListeners l)
        +unsubscribe(EventListeners l)
        +notify(EventType event, String data)
    }
    class EventListeners{
        +update(String filename)
    }
    class EmailAlertsListener{
        +update(String filename)
    }
    class LoggingListener{
        +update(String filename)
    }
    EventManager o--> EventListeners
    EmailAlertsListener ..|> EventListeners
    LoggingListener ..|> EventListeners
```

```mermaid
 classDiagram
    class EventManager{
        -EventListeners listeners[]
        +subscribe(EventListeners l)
        +unsubscribe(EventListeners l)
        +notify(EventType event, String data)
    }
    class EventListeners{
        +update(String filename)
    }
    class EmailAlertsListener{
        +update(String filename)
    }
    class LoggingListener{
        +update(String filename)
    }
    EventManager o--> EventListeners
    EmailAlertsListener ..|> EventListeners
    LoggingListener ..|> EventListeners
```
