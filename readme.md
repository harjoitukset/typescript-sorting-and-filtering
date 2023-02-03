# TypeScript: Tapahtumien suodattaminen ja lajittelu

Tämän viikon tehtävänä on harjoitella sisäkkäisistä objekteista ja listoista koostuvan aineiston suodattamista sekä järjestämistä annettujen ehtojen mukaan.

Aineistona käytämme [MyHelsinki Open API](https://open-api.myhelsinki.fi/) -REST-rajapinnan tarjoamia tapahtumatietoja, joissa vastaus koostuu JSON-rakenteessa, jonka sisällä on taulukko tapahtumista, joilla on jokaisella tiedot niiden ajankohdasta, nimistä, sijainnista ja muista tarpeellisista tiedoista.

> <em>"So,<br/>
> I heard you guys like dictionaries,<br/>
> So we put a dictionary in a list within another dictionary within another list"</em>
>
> Anonymous Haaga-Helia student, 2021


## GitHub classroom

Tehtävä arvostellaan käyttäen [GitHub classroom](https://classroom.github.com/) -palvelua, joka suorittaa ohjelmasi ja tarkastaa sekä pisteyttää tulokset automaattisesti. Taustalla GitHub classroom hyödyntää [GitHub actions](https://github.com/features/actions) -nimistä jatkuvan integroinnin palvelua, johon tutustumme kurssilla lisää myöhemmillä viikoilla.

Voit tarvittaessa lähettää tehtävän tarkastettavaksi monta kertaa. Tee tällöin uusi commit ja vie (push) muutokset GitHubiin. Varmista kuitenkin, että viimeisin tekemäsi commit tuottaa parhaat pisteet.

💡 Automaattisen arvioinnin vuoksi et saa muuttaa annettujen tiedostojen nimiä etkä funktioiden nimiä etkä parametrien ja paluuarvojen tyyppejä.


## Tehtävän kloonaaminen

Kun olet hyväksynyt tehtävän GitHub classroomissa ja saanut repositoriosta henkilökohtaisen kopion, kloonaa se itsellesi `git clone` -komennolla. Siirry sen jälkeen VS Codeen editoimaan tiedostoja.

Kloonatessasi repositoriota **varmista, että Git-osoitteen lopussa on oma GitHub-käyttäjänimesi**. Jos käyttäjänimesi puuttuu osoitteesta, kyseessä ei ole henkilökohtainen kopiosi tehtävästä. Luo tässä tapauksessa oma classroom-kopio tehtävästä itsellesi Teams-tehtävästä löytyvän linkin avulla.


## Riippuvuuksien asentaminen

Aloita asentamalla projektin riippuvuudet, jotka on määritelty `package.json`-tiedostossa:

```sh
$ npm install
```

Riippuvuudet sisältävät sekä [TypeScript-kielen](https://www.npmjs.com/package/typescript), [Jest-testaustyökalun](https://www.npmjs.com/package/jest) että [`ts-node`](https://www.npmjs.com/package/ts-node)- ja [`ts-jest`](https://www.npmjs.com/package/ts-jest)-paketit TypeScript-kielisen koodin ja testien suorittamiseksi Node.js:llä. Lisäksi riippuvuuksista löytyy `node-fetch`, joka mahdollistaa selaimista tutun `fetch`-funktion hyödyntämisen myös vanhemmilla Node.js-versioilla.

Node.js sinulta tulee löytyä valmiina.


## Ohjelman suorittaminen

Ohjelman varsinainen tekstikäyttöliittymä toteutetaan tiedostoon `src/index.ts`. Tiedosto voidaan suorittaa `ts-node`-työkalulla seuraavasti:

```bash
$ npx ts-node src/index.ts
```


## Testien suorittaminen

Tehtävän yksikkötestit suoritetaan [Jest-testityökalun](https://jestjs.io/) avulla komennolla `npm test`:

```sh
$ npm test          # sama kuin `npx jest --verbose --coverage`
```


## Järjesteltävä aineisto

[MyHelsinki Open API](https://open-api.myhelsinki.fi/) on MyHelsinki.fi-sivuston avoin REST-rajapinta kaupungin tapahtumien, paikkojen ja aktiviteettien tietoihin:

> *"MyHelsinki.fi-sivuston teknisestä toiminnasta ja tietojen päivittämisestä vastaa Helsinki Partners. Helsinki Partners on kansainväliseen kaupunkimarkkinointiin sekä investointien että osaajien houkutteluun keskittyvä Helsingin kaupungin omistama yhtiö. Lue lisää ja ota yhteyttä osoitteessa [helsinkipartners.com](https://www.helsinkipartners.com/)."*
>
> https://www.myhelsinki.fi/fi/yhteystiedot

Rajapinnan dokumentaatio löytyy interaktiivisessa [Swagger](https://swagger.io/)-muodossa osoitteesta [https://open-api.myhelsinki.fi/doc](https://open-api.myhelsinki.fi/doc). Kyseisessä osoitteessa on dokumentoituna esimerkkeineen niin resurssien osoitteet, niiden tukemat parametrit kuin palautettujen JSON-tietueiden rakenne.

Tässä tehtävässä hyödynnetään rajapinnan tarjoamaa tapahtuma-aineistoa osoitteesta [https://open-api.myhelsinki.fi/v1/events/](https://open-api.myhelsinki.fi/v1/events/).

Karkeasti supistettuna yhden tapahtuman pituinen vastaus rajapinnasta voi näyttää esimerkiksi seuraavalta:


```json
{
  "meta": {},
  "data": [
    {
      "id": "abc123",
      "name": {
        "fi": "Suomenkielinen tapahtuman nimi",
        "en": "English name",
        "sv": "Svenska namn",
        "zh": "标题"
      },
      "source_type": {},
      "info_url": null,
      "modified_at": "",
      "location": {
        "lat": 60,
        "lon": 24,
        "address": {}
      },
      "description": {
        "intro": "",
        "body": "",
        "images": []
      },
      "tags": [],
      "event_dates": {
        "starting_day": "2025-10-24T16:00:00.000Z",
        "ending_day": "2025-10-24T17:00:00.000Z",
        "additional_description": null
      }
    }
  ],
  "tags": {
  }
}
```

Huom: JSON-rakenteen uloin elementti on objekti, jonka `"data"`-attribuutista löytyy lista tapahtumista.


## Osa 1: aineiston suodattaminen (2 pistettä)

Tiedostossa [src/filtering.ts](./src/filtering.ts) on määritelty seuraava funktio:

```ts
export function filterEventsByStartDate(events: Event[], minDate: Date, maxDate: Date): Event[] {
    // todo
}
```

Tehtäväsi on toteuttaa funktioon toimintalogiikka, joka suodattaa annetuista tapahtumista sellaiset, joiden alkamisaika (`event_dates.starting_day`) sijoittuu annetun minimi- ja maksimiarvon väliin.

Huomaa, että kaikilla rajapinnan palauttamilla tapahtumilla ei välttämättä ole alkamisaikaa. **Tuntemattoman ajankohdan tapahtumat tulee suodattaa pois aineistosta.**

Huomaa myös, että **JSON-tietorakenteessa päivämäärät ovat merkkijonoja**, kuten `"2025-10-24T16:00:00.000Z"`. Funktiolle annettavat parametrit ovat puolestaan [Date-olioita](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date). Voit hyödyntää päivämäärien muuntamisessa ja käsittelyssä erillisiä npm-paketteja, kunhan lisäät ne projektisi riippuvuuksiin.

<!--
Voit muodostaa Pythonissa aikaoliot sekä nykyhetkelle että 30 päivän päähän esimerkiksi seuraavasti:

```python
from datetime import datetime, timedelta
alku = datetime.utcnow()
loppu = alku + timedelta(days=30)
```

Yllä olevassa koodissa [utcnow-funktio](https://docs.python.org/3/library/datetime.html#datetime.datetime.utcnow) muodostaa ajanhetken UTC-aikavyöhykkeessä, joka vastaa myös tapahtuma-aineistossa käytettävää aikavyöhykettä.
-->


## Osa 2: tapahtumien lajittelu (3 pistettä)

Tässä osassa sinun tulee suodattamisen lisäksi **järjestää** tapahtumat niiden alkamisajan mukaan käyttäen **itse toteuttamaasi lajittelualgoritmia**. Tiedostossa [src/sorting.ts](./src/sorting.ts) on määritelty seuraava funktio:

```ts
export function sortEventsByStartDate(events: Event[]): Event[] {
    // todo
}
```

Toteuta järjestämislogiikkasi tähän funktioon. Voit halutessasi toteuttaa myös erillisiä apufunktioita.

> *"Some examples where you can find direct application of sorting techniques include: Sorting by price, popularity etc in e-commerce websites"*
>
> [The Ohio State University. 7 algorithms and data structures every programmer must know](https://u.osu.edu/cstutorials/2016/11/21/7-algorithms-and-data-structures-every-programmer-must-know/)

Koodisi tulee järjestellä **kokonaisia tapahtumatietueita**, eli et voi poimia aineistosta järjesteltäväksi esimerkiksi pelkkiä nimiä ja alkamisaikoja.

Voit valita toteutettavan järjestämisalgoritmin esimerkiksi seuraavista:

**Lisäyslajittelu eli Insertion Sort**

[https://en.wikipedia.org/wiki/Insertion_sort](https://en.wikipedia.org/wiki/Insertion_sort)

<a title="Simpsons contributor / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Insertion_sort.gif"><img height="256" alt="Insertion sort" src="https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif"></a>

Kuva: By Simpsons contributor - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=17512147](https://commons.wikimedia.org/w/index.php?curid=17512147)

**Lomituslajittelu eli Merge Sort**

[https://en.wikipedia.org/wiki/Merge_sort](https://en.wikipedia.org/wiki/Merge_sort)

<a title="Swfung8 / CC BY-SA (https://creativecommons.org/licenses/by-sa/3.0)" href="https://commons.wikimedia.org/wiki/File:Merge-sort-example-300px.gif"><img width="256" alt="Merge-sort-example-300px" src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif" style="border solid silver 1px;"></a>

Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14961648](https://commons.wikimedia.org/w/index.php?curid=14961648)

**Kuplalajittelu eli Bubble Sort**

[https://en.wikipedia.org/wiki/Bubble_sort](https://en.wikipedia.org/wiki/Bubble_sort)

<a href="https://commons.wikimedia.org/wiki/File:Bubble-sort-example-300px.gif#/media/File:Bubble-sort-example-300px.gif" title="By Swfung8 - Own work, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=14953478"><img src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif" alt="Bubble-sort-example-300px.gif" width="256" style="border solid silver 1px;"></a>

Kuva: By Swfung8 - Own work, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=14953478](https://commons.wikimedia.org/w/index.php?curid=14953478)

**Pikalajittelu eli Quicksort**

[https://en.wikipedia.org/wiki/Quicksort](https://en.wikipedia.org/wiki/Quicksort)

<a href="https://commons.wikimedia.org/wiki/File:Sorting_quicksort_anim.gif#/media/File:Sorting_quicksort_anim.gif" title="By en:User:RolandH, CC BY-SA 3.0, https://commons.wikimedia.org/w/index.php?curid=1965827"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/Sorting_quicksort_anim.gif" alt="Sorting quicksort anim.gif" width="256" style="border solid silver 1px;"></a>

Kuva: By en:User:RolandH, CC BY-SA 3.0, [https://commons.wikimedia.org/w/index.php?curid=1965827](https://commons.wikimedia.org/w/index.php?curid=1965827)


🚨 **Tämän harjoituksen tavoitteena on opetella itse toteuttamaan jokin tunnettu järjestämisalgoritmi, joten JavaScriptin valmiin `Array.sort`-funktion käyttämistä ei sallita.** 🚨


### Algoritmin valintaperusteet

Voit valita itsellesi mieluisen algoritmin esimerkiksi tutustumalla ensin niiden tehokkuuteen tai valita sen, joka vaikuttaa toteutukseltaan sopivan yksinkertaiselta. Muista myös, että voit kysyä Teamsissa neuvoa mihin vain tehtävässä kohtaamaasi haasteeseen liittyen. Todennäköisesti samojen haasteiden parissa kamppailee myös moni muu kurssilainen.

Kun aineisto on järjestetty, tulosta tapahtumien nimet ja ajankohdat kronologisessa järjestyksessä. Tulosteen muodolla ei ole tehtävän arvioinnin kannalta isoa merkitystä, kunhan tulosteesta on todennettavissa ohjelman oikea toiminta.

Arvioi lopuksi tehtävää ratkaistessasi järjestämiseen kuluvaa aikaa. Miten esimerkiksi aineiston koon kaksinkertaistaminen vaikuttaisi ohjelmasi suoritusaikaan? Kirjoita yhden virkkeen pituinen arvio suorituskyvystä koodin kommentteihin.

**Huom!** Oikeassa ohjelmistoprojektissa käyttäisit JavaScriptin `Array.sort`-funktiota, ja antaisit sille parametrina kahden tapahtuman ajankohtia vertailevan vertailufunktion. Voit tutustua aiheeseen esim. [mdn web docs -sivustolla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort).


## Ohjelman esimerkkituloste

Halutessasi voit tulostaa tapahtumat skriptissäsi esimerkiksi seuraavaalla tavalla:

```
2022-01-14
 11:00 Bingo
 21:00 Maiju Hukkanen: Päiviä, jotka rytmittyvät päiväunien mukaan
2022-01-15
 08:00 Työpaja lapsiperheille
 09:00 Tarja Pitkänen-Walter: Maalauksellisia mietteitä
 10:00 Greta Hällfors-Sipilä & Sulho Sipilä -näyttelyn opastus ruotsiksi
 12:00 Taide ja aktivismi - keskustelu Palestiinasta
 12:00 Vain muutos on pysyvää -lukupiiri
 12:00 Katharina Grosse -näyttelyn opastus suomeksi
 13:00 Elannon Näyttämön 100-vuotisjuhlanäytelmä: Elämänmeno
 17:00 Det svarta fåret
2022-01-16
 17:00 Open Stage With Bryn And Ben
 22:01 Sibafest – Recovery Tour 2022
2022-01-17
 07:00 Valokuvanäyttely, kuvia Etiopiasta
 07:00 Kannelmäen kirjaston ekaluokkalaisstartti
 07:30 Leikkipuisto Ruoholahden ja Perhetalo Betanian yhteinen Perheaamu
 08:00 Luetaan yhdessä
 08:00 Lorurasti
 08:00 Vauva-aamu
 08:00 Vipinävarpaat: winter edition!
 08:00 Vauva-aamu
 08:00 Pihapuuhat
 08:30 Perheaamu
 09:00 Totta vai tarua?
 09:00 Runoryhmä
 10:30 Digirasti: Digitaitokurssi 2 (perusteiden kurssi) -TÄYNNÄ!
 12:00 Kielikahvila e-Ekstra Skypessä
...
```

💡 Tapahtumien tulostaminen päivittäin ryhmiteltynä ei välttämättä vaadi erillistä tietorakennetta, vaan yksinkertainen tapahtumalista riittää. Vertaa vain aina tapahtuman päivämäärää edellisen päivämäärään, ja mikäli se on eri, tulosta uusi päivämäärän ennen tapahtuman kellonajan ja nimen tulostamista.

----

## Lisenssit ja tekijänoikeudet

Tämän oppimateriaalin on kehittänyt Teemu Havulinna ja se on lisensoitu [Creative Commons BY-NC-SA -lisenssillä](https://creativecommons.org/licenses/by-nc-sa/4.0/).


## MyHelsinki Open API

> *"Note that all of the information provided over the API is open data with the exception of image files. When using images, please refer to the license terms included with each image.*"
>
> MyHelsinki Open API. https://open-api.myhelsinki.fi/
MyHelsinki Open API:n aineisto on lisensoitu [Creative Commons BY 4.0](https://open-api.myhelsinki.fi/terms)-lisenssillä. Voit lukea tarkemmat käyttöehdot ositteesta https://open-api.myhelsinki.fi/terms.