# Music XML Analyzer


## Zusammenfassung
Bei einer komplexen Untersuchung von Musikstücken ist es oft unumgänglich, auch die Partitur auszuwerten. Die manuelle Analyse ist, vor allem wenn mehrere Partituren gleichzeitig untersucht werden sollen, oftmals aufwendig und mühselig. Neben kostenpflichtiger Software wie Finale (http://www.klemm-music.de/makemusic/finale/) und kostenloser (https://musescore.org/de) Software wie Musescore, die zum Erstellen und Bearbeiten von Partituren geeignet sind, entstehen auch einige Projekte, die das Festhalten und Bearbeiten von Noten im Browser erlauben. Beispiele hierfür sind Vexflow oder Noteflight (http://my.vexflow.com/, https://www.noteflight.com/). Diesen Programmen fehlt jedoch eine umfangreiche Komponente zur Analyse und statistischen Auswertung von Musikstücken. Der Music-XML-Analyzer setzt genau hier an und bietet die Möglichkeit, Partituren im Music-XML-Format statistisch auszuwerten und in Musikstücken nach verschiedenen Pattern zu suchen.


## Setup-Anweisungen
Da es sich um eine Webanwendung handelt, sind zum Betrieb keine Installationsschritte notwendig. Die Projektseite ist unter der URL http://music-xml-analyzer.lukaslamm.de/ zu erreichen. Aufgrund der Beschaffenheit des Projekts wurde die Seite lediglich für Bildschirme mit einer Mindestbreite von 1200 Pixeln optimiert. Um eine spätere Anpassung für weitere Bildschirmgrößen zu ermöglichen wurde das Twitter Bootstrap Framework eingesetzt.


## Problemstellung
Das System soll Musikinteressierte oder Forscher dabei unterstützen, Musik einerseits statistisch auszuwerten und andererseits konkrete Suchmuster in mehreren Musikstücken aufzufinden. Aktuelle Softwarelösungen wie Musescore zum Erstellen und Bearbeiten von Partituren bieten meist keine Komponenten um diese Aufgaben zu erfüllen.


## Projektbeschreibung
Das System lässt sich grob in drei Teilbereiche unterteilen, die in den folgenden Abschnitten näher erläutert werden. Zur besseren Übersichtlichkeit werden die Teilbereiche entsprechend dem Workflow des Nutzers aufgeteilt. Im ersten Schritt erfolgt der Upload von Dateien und daraufhin die automatische, statistische Auswertung. Den letzten Schritt stellt die Suche nach Mustern in den hochgeladenen Dateien dar.  
Auf der Startseite der Anwendung bekommt der Nutzer einen kleinen Überblick über die Funktionen und kann per Klick auf den Button “START UPLOADING NOW!” in Abb. 1 mit der Arbeit beginnen.
![Startseite](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/home.png)
Abb. 1: Startseite (Screenshot)

### Upload
Um dem Anwender die Möglichkeit der statistischen Analyse von Musikstücken zu bieten, müssen zunächst Dateien im MusicXML-Format hochgeladen werden. Das im XML-Standard realisierte, offene Austauschformat MusicXML wird von vielen Notensatzprogrammen unterstützt und löst das vorangehende Notation Interchange File Format (NIFF) ab (http://de.wikipedia.org/wiki/MusicXML). Zudem bieten einige Portale, wie zum Beispiel Musescore (https://musescore.org/de) den kostenlosen Download von Partituren im MusicXML-Format an, wodurch eine Vielzahl von Musikstücken bereits verfügbar ist. Auf der Homepage von Musescore sind die Partituren in verschiedenen Formaten verfügbar und können nach kostenloser Registrierung heruntergeladen werden. Mit Hilfe der ebenfalls kostenlosen Software können die Partituren in andere Formate (mscx, mscz, xml, mid, ogg, wav oder pdf) umgewandelt werden.
![Upload](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/upload.png)
Abb. 2: Upload (Screenshot)

### Statistische Analyse
Die hochgeladenen Dateien werden nach erfolgreichem Upload automatisch analysiert. Dabei werden neben den Noten und Pausen auch die enthaltenen Intervalle, Taktarten und Instrumente gezählt.
Paar Infos zu Funktionsweise (XPath, etc)

### Dashboard
Im Dashboard erhält der Nutzer einen Überblick über die wichtigsten Fakten und Statistiken zu den einzelnen Musikstücken oder über den gesamten hochgeladenen Korpus. Dabei werden die Noten- und Intervallverteilung in einem Balkendiagramm, die Distribution der Tonarten, Notenlängen und Taktarten in einem Kreisdiagramm dargestellt. Daneben werden noch weitere Informationen zur Anzahl und zum Auftreten der Takte, Noten, Pausen und Instrumente angegeben.
![Dashboard](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/dashboard.png)
Abb. 3: Dashboard (Screenshot)

### Suche nach Patterns
Vom Dashboard aus gelangt der User durch einen Klick auf den Button SEARCH FOR PATTERNS oder im Header via SEARCH zur Patternsuche. Die verschiedenen Möglichkeiten, die der Benutzer hat, um seine Musikstücke zu durchsuchen werden im folgenden kurz erläutert und sind in Abbildung 4 dargestellt. Als ersten Schritt muss zwischen MELODY, SOUND SEQUENCE oder RHYTHM unterschieden werden, wobei MELODY hier voreingestellt ist. Darauf hin kann der Benutzer entweder per Maus, direkt auf den Notenzeilen, oder mit Hilfe der Buttons die gewünschten Noten eingeben. Werden die Buttons zur Noteneingabe verwendet, muss jede Note mit einem Klick auf ADD hinzugefügt werden. Durch Klick auf DELETE wird die zuletzt eingegebene Note wieder gelöscht. Alle Noten werden in der angezeigten Notenzeile dargestellt und können jederzeit abgespielt werden. Standartnoten, Triolen oder punktierte Noten müssen mit Hilfe der Buttons eingegeben werden. Alle Noten der dritten bis sechsten Oktave mit einer Dauer von einer Ganzen Note bis zur 64tel Note können ausgewählt werden. Auch Noten mit Kreuz- oder B-Vorzeichen können hinzugefügt werden.
![Search for Patterns](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/search.png)
Abb. 4: Search (Screenshot)

### Suchergebnisse
Ist der Benutzer mit seiner Noteneingabe zufrieden, werden durch einen Klick auf SEARCH alle hochgeladenen Musikstücke nach dem erstellten Pattern durchsucht. Abbildung 5 zeigt die Ergebnisseite der Suche. Hier wird im oberen Bereich das gesuchte Pattern noch einmal dargestellt und darunter die Musikstücke , welche das Pattern enthalten, samt jeweiliger Häufigkeit der Treffer.
![Result list](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/result_list.png)
Abb. 5: Searchresults (Screenshot)

Klickt der User auf einen Treffer, so wird eine Detailansicht aufgerufen, wie in Abbildung 6 zu erkennen ist. Hier werden neben dem Titel des Stücks die jeweiligen Trefferstellen in einem Carousel dargestellt und farblich hervorgehoben. Mit Hilfe der Pfeile kann zwischen den Treffern hin und her gewechselt werden. Auch Informationen, in welcher Stimme und in welchem Takt das Pattern gefunden wurde, werden dargestellt. Ein Klick auf PLAY spielt einen Auszug, der das Pattern enthält, ab. Der Nutzer hat außerdem die Möglichkeit, alle visualisierten Treffer als PDF-Dokument zu exportieren, was mit einem Klick auf den Button EXPORT AS PDF erreicht werden kann.
![Search result detail](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/screenshots/result.png)
Abb. 6: Searchresult Details (Screenshot)


## Architektur und Implementierung

### Projektablauf
Die Projektanforderungen wurden zunächst in Form von User Stories erfasst. Um den Projektablauf zu organisieren, wurde das Issue-System von Github benutzt. Hierbei repräsentierten die Meilensteine jeweils eine User Story. Diesen wurden anschließend kleinere Teilaufgaben, die Issues, zugewiesen. Eine zusätzliche Erweiterung für Google Chrome namens ZenHub (http://zenhub.io) erlaubte die Anordnung der Issues in Form eines Boards mit verschiedenen Pipelines. Das verwendete Board wurde, angelehnt an das Projektmanagement-Framework Kanban, in “Backlog”, “Nice to have”, “To Do”, “In Progress” und “Closed” unterteilt.
Zu Beginn des Projekts konnten die Zuständigkeiten relativ klar aufgeteilt werden. Während Lukas Lamm für die Implementierung des verwendeten Frameworks Laravel und die daran gebundene Datenbankarchitektur zuständig war, kümmerte sich Tobias Semmelmann um die Frontend-Seite des Systems. David Lechler wurde mit der Traversierung, Analyse und Entwicklung der Suchalgorithmen für die MusicXML-Dateien betraut. Matthias Schneider kümmerte sich um die Eingabe der Suchpatterns.
In späteren Projektphasen verwischten die Grenzen der Zuständigkeiten immer häufiger. Dadurch griff Lukas Lamm auch die Darstellung der Suchergebnisse in Form von Takten und Noten unterstützend ein und kümmerte sich um die beiden Export-Funktionen. David Lechler übernahm schließlich die Wiedergabe der Ergebnisse mit Midi.js.

### Frameworks und Bibliotheken
Als Grundlage der Anwendung wurde das PHP Framework Laravel (http://laravel.com/) in Version 4.2 verwendet, welches auf dem Model-View-Controller-Pattern basiert. Dieses bietet Möglichkeiten das Routing zwischen den einzelnen Controllern und Views zu handhaben, sowie die Gestaltung der Views durch Templates. Zudem konnte mit den in Laravel integrierten Models das Datenbankschema in SQL und die einfache Abfrage realisiert werden.
Zur Realisation interaktiver Funktionen und Vereinfachung von Javascript-Code wurde das Framework jQuery (https://jquery.com/) verwendet. Zudem wird jQuery vom eingesetzten CSS-Framework Twitter Bootstrap (http://getbootstrap.com/) und weiteren hier genannten Bibliotheken benötigt. Um einen modernen Look im Material Design zu erzielen wurde zudem das Theme Material Design for Bootstrap (https://fezvrasta.github.io/bootstrap-material-design/) eingebunden. Die Darstellung der Graphen erfolgt mit der Bibliothek D3.js (http://d3js.org/), die Ausgabe der Noten hingegen wird über die API Vexflow (http://www.vexflow.com/) abgewickelt. Die Visualisierung von Statusnachrichten wird mit dem Plugin Typed.js (http://www.mattboldt.com/demos/typed-js/) animiert. Die Darstellung und Abwicklung von hochgeladenen Dateien erfolgt durch die Bibliothek Dropzone.js (http://www.dropzonejs.com/) im Zusammenspiel mit dem Framework Laravel. Die Audioausgabe von eingegebenen Pattern zur Suche oder Ergebnisausschnitten wird mit dem Framework MIDI.js (http://mudcu.be/midi-js/) abgewickelt, während die Exportfunktion der Ergebnisse als PDF mit dem Plugin jsPDF (https://parall.ax/products/jspdf) erfolgt.


### Systemarchitektur
![Systemarchitektur](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/system_architektur.png)
Abb. 7: Systemarchitektur
![Datenbankschema](https://raw.githubusercontent.com/freakimkaefig/Music-XML-Analyzer/master/material/database_schema.png)
Abb. 8: Datenbankschema

## Ausblick
Eine Funktion, die nicht mehr implementiert wurde ist das Abspielen einzelner, hochgeladener Musikstücke. Grund hierfür ist, dass bei den Tests gegen Ende des Projektes noch einige Bugs gefunden wurden und die verbleibende Zeit damit verbracht wurde, diese zu beheben.  
Eine Erweiterungsmöglichkeit des Music-XML-Analyzer wäre, die Beschränkung auf das Format Music-XML aufzuheben, um so andere Dateitypen hochladen und analysieren zu können.
