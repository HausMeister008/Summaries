<script lang="ts">
    export default {
        computed:{
            
        }
    }
</script>


<template>
    <div id="welcome" class="page">
        <h1>Willkommen</h1>
        <div class="info_tag">
            <h2>Kurze Einweisung</h2>
            <p class="explenations">
                Für alle die neu sind: über "Registrieren" kann man sich... nun ja... registrieren und über Login dann auf allen möglichen
                Endgeräten einloggen. Sobald ihr eingeloggt seid, erscheint ein neuer Reiter oben in der Navigation: "Auswahl". Mit dem könnt ihr 
                irgendwen auswählen, von dem ihr gern die Zusammenfassung hättet.
            </p>
        </div>
        <div class="info_tag">
            <h2>Möglichkeiten</h2>
            <p class="explenations">
                Ihr könnt entweder einfach nur Zusammenfassungen von anderen runterladen oder aber ihr könnt auch selber welche hochladen, die 
                dann wieder andere benutzen können... wie ihr wollt.
            </p>
        </div>
        <div class="info_tag">
            <h2>An alle Creators</h2>
            <p class="explenations">
                Ihr habt beim Hochladen die Möglichkeit, den Zugang zu euren Zusammenfassungen einzuschränken, sie also nur denjenigen zugänglich zu machen,
                die ihr wollt. Wenn ihr zum Beispiel keinen Bock habt, eure 10 Seiten lange Geschichtszusammenfassung für einfach jeden kostenlos zugänglich zu machen,
                könnt ihr ganz einfach sagen, dass zu Anfang keiner - oder nur eure engsten Freunde - Zugriff hat, und jeden, der euch dann z.B. in der Schule 5€ (oder wie viel auch immer ihr wollt) gibt,
                nachträglich hinzufügen. 
            </p>
        </div>
    </div>
</template>

<style scoped>
#welcome{
    margin-top: var(--nav_height);
    width: 100vw;
    height: calc(100vh - var(--nav_height));
    overflow: auto;
    scrollbar-width: thin;
    color: var(--base);
    background: var(--anti_base);
}
#welcome h1{
    position:sticky;
    top: 0;
    text-align: center;
    margin: 0;
    z-index: 10;
    color: var(--base);
    background: var(--anti_base);
    padding: .5rem 1rem;
    box-shadow: 0 0 15px var(--box_shadows);
}
.info_tag{
    width: 90vw;
    margin-left: 5vw;
    min-width: min-content;
    margin-top: 5rem;
    border-radius: 5px;
    box-shadow: 0 0 15px var(--box_shadows);
    padding: 2rem;
    text-align: center;
    font-size: 1.2rem;
}
.info_tag:last-child{
    margin-bottom: 5rem;
}
@media (min-width: 700px) {
    .info_tag{
        width: 80vw;
        margin-left: 10vw;
    }    
}
.info_tag h2{
    margin-bottom: 1rem;
}
#welcome .explenations{
}
</style>