
## No-Shitshow-Diskussionsforum 

- soll keine shitshow sein
- soll sich von gängigen Diskussionsplattformen (twitter, facebook, reddit) unterscheiden:
	->Teilnehmer sind pseudonymisiert
	-> man kann nicht folgen oder blocken / ignorieren
	-> man kann seine Beiträge nicht löschen oder editieren 
		(denken, tippen, Enter drücken)
	-> Bubble-Bildung soll so vorgebeugt werden

Themen werden von Moderatoren (Mods) erstellt und moderiert. Jeder User kann anfangs im sachlichen Bereich (SB) und unsachlichen Bereich (UB) eines Themas kommentieren. Wird im SB unsachlich diskutiert, wird der Teilnehmer in den UB des Themas verbannt.

Wenn hinreichend viel diskutiert wurde, wird das Thema in verschiedene Facetten (Sub Threads) unterteilt, um es übersichtlicher zu gestalten. Dort können verschiedene Aspekte des Themas vertieft werden. Jede Facette bekommt ein TLDR, sodass man einen noch besseren Überblick über den Stand der Diskussionen bekommt.


---
## Themen

Themen sind, wie der Name schon sagt, einfach nur die groben Themen, die für Diskussionen vorgegeben werden. Dies können zB Gesetzes-Entwürfe sein, jüngste internationale Entwicklungen, politische oder wirtschaftliche Themen aller Art. Ein Thema wird durch eine Beschreibung beschrieben, die ggf. relevante Materialien (zB Gesetzes-Entwürfe, Fotos oder Videos) enthalten kann oder darauf verlinkt.

## Facetten

Facetten sind die "Sub Threads" von Themen, wo die eigentlichen Diskussionen stattfinden. Bei frischen Themen kann es sein, dass sich noch keine Facetten herauskristallisiert haben, aber früher oder später kann man jede Diskussion einer Facette zuordnen. ZB "Auswirkungen auf die Umwelt", "Auswirkungen auf die Kinder" oder "Kosten und Finanzierung". Gern auch sowas wie "Religiöse Bedeutung" oder "Historischer Kontext". Facetten sollen die Navigation durch ein Thema übersichtlicher und einfacher machen. Jede Facette hat ein TLDR, in dem zusammengefasst werden soll, wie der Consens/Dissens aktuell steht.

## Diskussionen

Diskussionen sind das Herzstück des Forums. Dementsprechend ist das Design so gedacht, dass hochwertige und sinnvolle Diskussionen entstehen können. Abschweifungen, Trolling, Doxxing, Beleidigungen und Bedrohungen sollen minimiert werden. Für jeden soll in kürzester Zeit ersichtlich werden, wie der Stand der Diskussionen zu einem Thema ist. 

## Anfangsargument

Damit geht eine Diskussion los. Anfangsargumente müssen diskutierbar sein. Eine ausschließliche Anreihung von Meinungen ist kein Argument. Falsche Behauptungen sind kein Argument. Anfangsargumente können Fakten, Schlussfolgerungen oder Meinungen beinhalten. Gerne auch Links oder andere Verweise auf Quellen. Sie sollten zur Diskussion einladen und sie nicht "abwürgen". 


## Struktur zusammengefasst:

Ein Thema enthält viele Diskussionen, die in Facetten (Sub-Threads) gegliedert sind. Es gibt eine Themen-Beschreibung, die das Thema verdeutlichen soll und ggf. relevante Materialien enthält oder darauf verlinkt. Diskussionen fangen immer mit einem Anfangsargument an. Darauf folgen dann die Antworten, die die Diskussion ausmachen.

---

# Features und ggf. technische Umsetzung

## Facetten und SB/UB

Für eine einfache Umsetzung werden alle Diskussionen als Felder des Themen-Objektes implementiert.  Facetten werden durch einfache Tags umgesetzt, die einer Diskussion gegeben werden können. ZB kann eine Diskussion, die sich mit Auswirkungen auf Umwelt und Wirtschaft beschäftigt, die Tags "Auswirkungen auf Umwelt" und "Auswirkungen auf Wirtschaft" bekommen. Somit wird die Diskussion in den Suchen nach beiden Tags angezeigt. 

Ebenso wird die Zugehörigkeit einer Diskussion/Antwort zm SB/UB durch einen Tag geregelt. Anfangs hat ein Beitrag keinen Tag, sobald er aber auf den UB beschränkt wird, bekommt er den "UB" Tag und wird für rein sachlich-suchende User nicht mehr angezeigt. Ist ein User für ein Thema mit "UB" markiert, bekommen all seine Beiträge für dieses Thema automatisch den "UB" Tag.

## Pseudonymisierung

User sind grundsätzlich für die Öffentlichkeit pseudonymisiert. Für jedes Thema bekommt ein User ein neues Pseudonym (zb. "grüner Biber", "brauner Dachs"). Dies soll verhindern, dass man einen User durch das Forum "folgen" oder auch "verfolgen" kann. Dies soll gewährleisten, dass der Fokus der Diskussionen auf den Argumenten liegt und nicht auf den Personen. Namen, Geschlecht (aus dem Namen ableitbar) und Titel können sich falsch negativ oder falsch positiv auf die Wahrnehmung des Argumentes auswirken und sind somit hinderlich. Pseudonyme dienen dazu, dass man während einer Diskussion die Teilnehmer auseinanderhalten kann, lassen aber idealerweise keinen Schluss auf die Identität der Teilnehmer zu. 


---

## Rollen

##### Jeder:
- kann alle Themen, Facetten, Diskussionen und TLDRs sehen, lesen und durchsuchen
- kein einloggen, keine Cookies, kein Tracking

##### User:
- muss eingeloggt sein
- kann eine Übersicht anzeigen lassen, die NUR seine EIGENEN Beiträge zeigt:
	-> bei "UB" Beiträgen ist die Begründung dann leicht einsehbar
- kann zu einem Thema eine Diskussion mit Anfangsargumentation erstellen
- kann einstellen, wer auf Antworten antworten kann :
	1. nur User selbst
	2. alle
- kann zu einer Diskussion eine Antwort verfassen
- kann zu Antworten auf seine EIGENE Anfangsargumentation weitere Antworten verfassen
		(TBD ob die Einschränkung sinnvoll ist)
- kann alle aktuellen Themen, sowie deren Facetten und TLDRs sehen
- kann Unsachlichkeits-Meldungen erstellen:
	1. mit Button "als unsachlich melden"
	2. Textbereich markieren, der unsachlich ist
	3. (optional) Begründung schreiben
	4. bestätigen
- kann Präferenz festlegen, ob unsachliche Beiträge (rot hinterlegt) angezeigt werden sollen

##### Mod:
- muss eingeloggt sein
- kann Themen erstellen
- kann Unsachlichkeits-Meldungen erstellen und/oder entscheiden:
	1. ablehnen -> Meldung wird gelöscht
	2. bestätigen -> Verfasser des unsachlichen Beitrages wird im relevanten Thema auf den UB beschränkt -> Meldung wird an den Beitrag geknüpft und kann eingesehen werden
- kann Facetten zu einem Thema erstellen
- kann TLDR zu einer Facette verfassen und/oder bearbeiten
- kann Diskussionen einer oder mehreren Facetten zuordnen

---